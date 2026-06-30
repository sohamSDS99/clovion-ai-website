// Free AI Visibility Score — v2 scan endpoint (single engine: ChatGPT).
//
// Native OpenAI gpt-4o-mini, web-grounded, consolidated (~2 searches/scan).
// Pipeline: rate-limit -> validate domain (SSRF) -> [gate cookie] -> cache
//           -> [spend cap] -> [single-flight] -> runScan -> cache -> [email].
//
// Sole scan endpoint. (The legacy OpenRouter /api/free-score route was removed.)

import { normalizeDomain, validateDomain } from '@/lib/freeScore/validate'
import {
  getCached,
  setCached,
  checkRateLimit,
  acquireLock,
  releaseLock,
  waitForCached,
  getDailySpend,
  addDailySpend,
  bumpDailyCount,
  refundDailyCount,
} from '@/lib/freeScore/store'
import { runScan, ScanError } from '@/lib/freeScore/scan'
import { SCAN_COOKIE, verifyScanToken, readCookie } from '@/lib/freeScore/scanToken'
import { sendReportEmail } from '@/lib/freeScore/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const REQUIRE_GATE = process.env.FREE_SCORE_REQUIRE_GATE === '1'
const DAILY_BUDGET_USD = Number(process.env.SCAN_DAILY_BUDGET_USD || 200)
const EST_COST_USD = Number(process.env.SCAN_COST_USD || 0.04)
const COALESCE_WAIT_MS = 12_000
// Anti-abuse: free scans allowed per email / per IP per rolling day.
const MAX_PER_EMAIL = Number(process.env.FREE_SCORE_MAX_PER_EMAIL || 1)
const MAX_PER_IP = Number(process.env.FREE_SCORE_MAX_PER_IP || 10)

function extractClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

export async function POST(request: Request) {
  // Kill switch
  if (process.env.FREE_SCORE_DISABLED === '1') {
    return Response.json({ error: 'temporarily unavailable', code: 'disabled' }, { status: 503 })
  }

  // 1. Rate-limit first (cheapest reject)
  const ip = extractClientIp(request)
  const rate = await checkRateLimit(ip)
  if (!rate.allowed) {
    return Response.json(
      { error: 'rate limit exceeded', code: 'rate_limited', retryAfterSec: rate.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
    )
  }

  // 2. Parse + validate domain
  let body: { domain?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid JSON body', code: 'bad_json' }, { status: 400 })
  }
  if (typeof body.domain !== 'string' || !body.domain.trim()) {
    return Response.json({ error: 'domain is required', code: 'bad_domain' }, { status: 400 })
  }
  const domain = normalizeDomain(body.domain)
  const check = validateDomain(domain)
  if (!check.ok) {
    return Response.json({ error: check.reason, code: 'bad_domain' }, { status: 400 })
  }

  // 3. Gate (P2): require a valid scan-token cookie when gating is on.
  let email = ''
  if (REQUIRE_GATE) {
    const token = readCookie(request.headers.get('cookie'), SCAN_COOKIE)
    const auth = verifyScanToken(token)
    if (!auth) {
      return Response.json({ error: 'email required', code: 'gate_required' }, { status: 401 })
    }
    email = auth.email
  }

  // 3b. Per-email / per-IP daily quota (anti-abuse). Reserve up front so one
  // captured lead can't spam unlimited scans; refund below on any path that
  // doesn't actually deliver a report.
  const quotaKeys = email ? [`ip:${ip}`, `email:${email}`] : [`ip:${ip}`]
  const counts = await Promise.all(quotaKeys.map(bumpDailyCount))
  const refundQuota = () => Promise.all(quotaKeys.map(refundDailyCount))
  const overIp = counts[0] > MAX_PER_IP
  const overEmail = email ? counts[1] > MAX_PER_EMAIL : false
  if (overIp || overEmail) {
    // Keep the count elevated (don't refund) so repeated attempts stay blocked.
    return Response.json({ error: 'free scan limit reached', code: 'quota' }, { status: 429 })
  }

  // 4. Cache hit → instant (and still email a copy if gated)
  const cached = await getCached(domain)
  if (cached) {
    if (email) void sendReportEmail(email, cached)
    return Response.json({ domain, result: cached, cached: true })
  }

  // 5. Need a key
  if (!process.env.OPENAI_API_KEY) {
    console.error('[free-score] OPENAI_API_KEY not configured')
    await refundQuota()
    return Response.json({ error: 'service unavailable', code: 'no_key' }, { status: 503 })
  }

  // 6. Spend cap (P3): degrade gracefully when over budget.
  if ((await getDailySpend()) >= DAILY_BUDGET_USD) {
    console.warn(`[free-score] daily spend cap hit ($${DAILY_BUDGET_USD}) — shedding domain=${domain}`)
    await refundQuota()
    return Response.json(
      {
        error: 'high demand — your report is queued and will be emailed shortly',
        code: 'budget',
        emailWhenReady: Boolean(email),
      },
      { status: 503 }
    )
  }

  // 7. Single-flight (P3): coalesce concurrent scans of the same domain.
  const gotLock = await acquireLock(domain)
  if (!gotLock) {
    const coalesced = await waitForCached(domain, COALESCE_WAIT_MS)
    if (coalesced) {
      if (email) void sendReportEmail(email, coalesced)
      return Response.json({ domain, result: coalesced, cached: true })
    }
    // Fall through and scan anyway (the other request may have failed).
  }

  // 8. Run the scan
  try {
    console.log(`[free-score] v2 scan domain=${domain} model=gpt-4o-mini`)
    const result = await runScan(domain)
    await setCached(domain, result)
    await addDailySpend(EST_COST_USD)
    if (email) void sendReportEmail(email, result) // P4: fire-and-forget
    return Response.json({ domain, result })
  } catch (e) {
    const code = e instanceof ScanError ? e.code : 'upstream'
    console.warn(`[free-score] v2 scan failed domain=${domain}: ${(e as Error)?.message}`)
    await refundQuota()
    return Response.json({ error: 'scan failed', code }, { status: code === 'timeout' ? 504 : 502 })
  } finally {
    if (gotLock) await releaseLock(domain)
  }
}

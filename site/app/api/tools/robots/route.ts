// Robots.txt AI Bot Checker — real crawler endpoint.
//
// Fetches the site's actual robots.txt (URL mode) or parses pasted content
// (paste mode), then evaluates every AI bot's access to "/" using the real
// RFC-9309 matcher in lib/tools/robots. No mock data — output varies per site.

import { normalizeDomain, validateDomain } from '@/lib/freeScore/validate'
import { checkRateLimit } from '@/lib/freeScore/store'
import { safeFetch, FetchError } from '@/lib/tools/fetch'
import { parseRobots, evaluateBot, AI_BOTS, type BotStatus } from '@/lib/tools/robots'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 20

type BotRow = { bot: string; ua: string; rule: string; status: BotStatus }

function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

function audit(robotsText: string): { bots: BotRow[]; counts: Record<BotStatus, number> } {
  const parsed = parseRobots(robotsText)
  const counts: Record<BotStatus, number> = { allowed: 0, blocked: 0, indeterminate: 0 }
  const bots: BotRow[] = AI_BOTS.map((b) => {
    const v = evaluateBot(parsed, b.ua, '/')
    counts[v.status]++
    return { bot: b.bot, ua: b.ua, rule: v.rule, status: v.status }
  })
  return { bots, counts }
}

// When there's no robots.txt at all, every bot defaults to allowed.
function allowAll(): { bots: BotRow[]; counts: Record<BotStatus, number> } {
  const bots: BotRow[] = AI_BOTS.map((b) => ({
    bot: b.bot,
    ua: b.ua,
    rule: 'no robots.txt · allow all',
    status: 'allowed' as BotStatus,
  }))
  return { bots, counts: { allowed: bots.length, blocked: 0, indeterminate: 0 } }
}

export async function POST(request: Request) {
  const ip = clientIp(request)
  const rate = await checkRateLimit(ip)
  if (!rate.allowed) {
    return Response.json(
      { error: 'rate limit exceeded', code: 'rate_limited', retryAfterSec: rate.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } }
    )
  }

  let body: { url?: unknown; content?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid JSON body', code: 'bad_json' }, { status: 400 })
  }

  // ── Paste mode ────────────────────────────────────────────────────────────
  if (typeof body.content === 'string' && body.content.trim()) {
    const robotsText = body.content.slice(0, 200_000)
    const { bots, counts } = audit(robotsText)
    return Response.json({
      source: 'paste',
      exists: true,
      robotsUrl: null,
      robotsText,
      bots,
      counts,
    })
  }

  // ── URL mode ───────────────────────────────────────────────────────────────
  if (typeof body.url !== 'string' || !body.url.trim()) {
    return Response.json({ error: 'url or content is required', code: 'bad_input' }, { status: 400 })
  }
  const domain = normalizeDomain(body.url)
  const check = validateDomain(domain)
  if (!check.ok) {
    return Response.json({ error: check.reason, code: 'bad_domain' }, { status: 400 })
  }

  const robotsUrl = `https://${domain}/robots.txt`
  try {
    const res = await safeFetch(robotsUrl, { timeoutMs: 10_000, maxBytes: 512_000, accept: 'text/plain,*/*' })
    const looksHtml =
      /text\/html/i.test(res.contentType) || res.body.trimStart().toLowerCase().startsWith('<!doctype') || res.body.trimStart().startsWith('<')

    // No robots.txt (404 / soft-404 HTML / empty) → everything allowed.
    if (!res.ok || looksHtml || !res.body.trim()) {
      const { bots, counts } = allowAll()
      return Response.json({
        source: 'url',
        url: `https://${domain}`,
        exists: false,
        robotsUrl,
        robotsText: '',
        bots,
        counts,
        fetchedStatus: res.status,
      })
    }

    const robotsText = res.body
    const { bots, counts } = audit(robotsText)
    return Response.json({
      source: 'url',
      url: `https://${domain}`,
      exists: true,
      robotsUrl: res.finalUrl,
      robotsText,
      bots,
      counts,
      fetchedStatus: res.status,
    })
  } catch (e) {
    if (e instanceof FetchError) {
      const status = e.code === 'timeout' ? 504 : e.code === 'bad_url' || e.code === 'blocked' ? 400 : 502
      console.warn(`[tools/robots] fetch failed domain=${domain} code=${e.code}: ${e.message}`)
      return Response.json({ error: `could not fetch robots.txt (${e.code})`, code: e.code }, { status })
    }
    console.warn(`[tools/robots] unexpected error domain=${domain}: ${(e as Error)?.message}`)
    return Response.json({ error: 'fetch failed', code: 'upstream' }, { status: 502 })
  }
}

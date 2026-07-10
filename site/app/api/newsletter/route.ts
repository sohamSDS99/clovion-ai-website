import { NextRequest, NextResponse } from 'next/server'
import { sendMetaConversion } from '@/lib/meta/capi'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Newsletter subscribe endpoint for the homepage "Weekly AI Visibility Insights"
// popup. Validates the email and, when a destination is configured, forwards it
// server-side to a webhook (keeps the URL out of the client bundle, sidesteps
// CORS) — same pattern as /api/lead.
//
// UI-first rollout: capture isn't wired yet. There is intentionally NO fallback
// to the free-score LEAD_WEBHOOK_URL, so newsletter signups never pollute the
// trial pipeline. Until NEWSLETTER_WEBHOOK_URL is set, a valid signup is accepted
// and logged (the popup confirms) but not forwarded. Set the env var later to
// switch on real delivery — no code change needed.
const WEBHOOK_URL = process.env.NEWSLETTER_WEBHOOK_URL || ''

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FIELD = 200

function isoUtc(d: Date): string {
  return d.toISOString().replace('Z', '+00:00')
}

// Best-effort first/last name from the email local-part. Handles the common
// `first.last` / `first_last` / `first-last` shapes; strips `+tags` and stray
// digits; title-cases each token. One token → first name only, no last name.
// Purely heuristic — a mailbox like `info@` yields { firstName: 'Info' }.
function deriveName(email: string): { firstName: string; lastName: string } {
  const local = (email.split('@')[0] || '').split('+')[0]
  const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '')
  const tokens = local
    .split(/[._-]+/)
    .map((t) => t.replace(/\d+/g, '').trim())
    .filter(Boolean)
  if (tokens.length === 0) return { firstName: '', lastName: '' }
  if (tokens.length === 1) return { firstName: cap(tokens[0]), lastName: '' }
  return { firstName: cap(tokens[0]), lastName: cap(tokens[tokens.length - 1]) }
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === 'unknown' ||
    ip === '::1' ||
    /^127\./.test(ip) ||
    /^10\./.test(ip) ||
    /^192\.168\./.test(ip) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    /^(::ffff:)?(10|127|192\.168)\./.test(ip) ||
    /^f[cd]/.test(ip.toLowerCase())
  )
}

function countryName(code: string): string {
  if (!code) return ''
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || ''
  } catch {
    return ''
  }
}

// Resolve the sender's country from their IP. Production sits behind Cloudflare,
// which injects `CF-IPCountry` (ISO-2) at the edge — free, instant, no lookup.
// Only when that header is absent (e.g. non-CF path) do we fall back to a geo-IP
// API with a short timeout. Never throws; returns empty strings on any failure.
async function resolveCountry(req: NextRequest, ip: string): Promise<{ country: string; countryCode: string }> {
  const cf = req.headers.get('cf-ipcountry')?.trim().toUpperCase() || ''
  let code = cf.length === 2 && cf !== 'XX' && cf !== 'T1' ? cf : ''

  if (!code && !isPrivateIp(ip)) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 3000)
      const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=success,country_code`, {
        signal: controller.signal
      })
      clearTimeout(timer)
      if (res.ok) {
        const j = (await res.json()) as { success?: boolean; country_code?: string }
        if (j?.success && typeof j.country_code === 'string') code = j.country_code.toUpperCase()
      }
    } catch {
      // geo lookup is best-effort — swallow and return whatever we have
    }
  }

  return { country: countryName(code), countryCode: code }
}

// Per-instance IP rate limit: 5 requests / 60s (mirrors the free-score guard).
const g = globalThis as unknown as { __clvNewsletterRL?: Map<string, { n: number; t: number }> }
if (!g.__clvNewsletterRL) g.__clvNewsletterRL = new Map()
const RL = g.__clvNewsletterRL

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    'unknown'
  const now = Date.now()
  const rec = RL.get(ip)
  if (rec && now - rec.t < 60_000) {
    if (rec.n >= 5) return NextResponse.json({ error: 'too many requests', code: 'rate_limited' }, { status: 429 })
    rec.n += 1
  } else {
    RL.set(ip, { n: 1, t: now })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid request', code: 'bad_json' }, { status: 400 })
  }

  const email = (typeof body.email === 'string' ? body.email.trim().slice(0, MAX_FIELD) : '').toLowerCase()
  const metaEventId = typeof body.metaEventId === 'string' ? body.metaEventId : ''
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'enter a valid email', code: 'bad_email' }, { status: 400 })
  }

  // Enrich the lead: name from the email local-part, country from the IP.
  const { firstName, lastName } = deriveName(email)
  const { country, countryCode } = await resolveCountry(req, ip)

  // Server copy of the conversion (deduped against the browser Pixel via
  // metaEventId). Fires whether or not a forwarding webhook is configured, since
  // a valid submit is the conversion. No-ops without META_CAPI_TOKEN; never throws.
  // Passing name improves Meta Event Match Quality.
  await sendMetaConversion({
    req,
    eventName: 'Lead',
    eventId: metaEventId || undefined,
    email,
    firstName: firstName || undefined,
    lastName: lastName || undefined
  })

  if (!WEBHOOK_URL) {
    // Capture not wired yet — accept so the popup confirms; record for now.
    // TODO: set NEWSLETTER_WEBHOOK_URL to forward these to the newsletter list.
    console.log('[newsletter] pending signup (no webhook configured):', email)
    return NextResponse.json({ ok: true })
  }

  const payload = [
    {
      event: 'newsletter_subscribe',
      timestamp: isoUtc(new Date()),
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        country,
        country_code: countryCode,
        source: 'home_popup',
        user_type: 'newsletter_subscriber',
        event: 'newsletter_subscribed'
      }
    }
  ]

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 10_000)
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
    clearTimeout(timer)
    if (!res.ok) {
      console.warn('[newsletter] webhook returned non-2xx', res.status)
      return NextResponse.json({ error: 'could not submit', code: 'upstream' }, { status: 502 })
    }
  } catch (err) {
    console.warn('[newsletter] webhook request failed', err)
    return NextResponse.json({ error: 'could not submit', code: 'network' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

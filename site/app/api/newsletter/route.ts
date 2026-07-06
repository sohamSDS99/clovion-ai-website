import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Newsletter subscribe endpoint for the homepage "Weekly AI Visibility Insights"
// popup. Validates the email and forwards it server-side to a webhook (keeps the
// URL out of the client bundle and sidesteps browser CORS) — same pattern as
// /api/lead. Prefers a dedicated newsletter destination; falls back to the
// shared lead webhook, tagged with a DISTINCT event so the Make.com scenario can
// route newsletter signups separately (add a filter on event === 'newsletter_subscribe').
const WEBHOOK_URL = process.env.NEWSLETTER_WEBHOOK_URL || process.env.LEAD_WEBHOOK_URL || ''

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FIELD = 200

function isoUtc(d: Date): string {
  return d.toISOString().replace('Z', '+00:00')
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
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'enter a valid email', code: 'bad_email' }, { status: 400 })
  }

  if (!WEBHOOK_URL) {
    console.warn('[newsletter] no webhook configured — set NEWSLETTER_WEBHOOK_URL (or LEAD_WEBHOOK_URL)')
    return NextResponse.json({ error: 'not configured', code: 'not_configured' }, { status: 503 })
  }

  const payload = [
    {
      event: 'newsletter_subscribe',
      timestamp: isoUtc(new Date()),
      data: {
        email,
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

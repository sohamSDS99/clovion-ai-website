import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Lead-capture endpoint for the "Get Free Score" popup form.
// Validates the four user-supplied fields, assembles the EXACT payload shape
// the Make.com scenario expects, and forwards it server-side (keeps the
// webhook URL out of the client bundle and sidesteps browser CORS).
//
// Webhook payload contract (do not change keys without re-mapping the Make
// scenario):
//   [ { event: "trial_start", timestamp, data: {
//         first_name, last_name, email, country,
//         trial_start_date, trial_end_date,
//         user_type: "trial", event: "email_verified_trial_started" } } ]

const WEBHOOK_URL =
  process.env.LEAD_WEBHOOK_URL ||
  'https://hook.eu1.make.com/yjknb52uqisoi9j2fzn45gmb4ljokbgq'

// Free trial window, in days. Mirrors the example payload (2026-06-23 → 2026-07-08).
const TRIAL_DAYS = 15

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FIELD = 200

// ISO-8601 with an explicit +00:00 offset (the example uses +00:00, not "Z").
function isoUtc(d: Date): string {
  return d.toISOString().replace('Z', '+00:00')
}

function clean(v: unknown): string {
  return typeof v === 'string' ? v.trim().slice(0, MAX_FIELD) : ''
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid request', code: 'bad_json' }, { status: 400 })
  }

  const first_name = clean(body.first_name)
  const last_name = clean(body.last_name)
  const email = clean(body.email).toLowerCase()
  const country = clean(body.country)

  if (!first_name || !last_name || !email || !country) {
    return NextResponse.json({ error: 'all fields are required', code: 'missing_fields' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'enter a valid email', code: 'bad_email' }, { status: 400 })
  }

  const now = new Date()
  const trialEnd = new Date(now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000)

  const payload = [
    {
      event: 'trial_start',
      timestamp: isoUtc(now),
      data: {
        first_name,
        last_name,
        email,
        country,
        trial_start_date: isoUtc(now),
        trial_end_date: isoUtc(trialEnd),
        user_type: 'trial',
        event: 'email_verified_trial_started'
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
      console.warn('[lead] webhook returned non-2xx', res.status)
      return NextResponse.json({ error: 'could not submit', code: 'upstream' }, { status: 502 })
    }
  } catch (err) {
    console.warn('[lead] webhook request failed', err)
    return NextResponse.json({ error: 'could not submit', code: 'network' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

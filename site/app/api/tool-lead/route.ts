import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstile } from '@/lib/freeScore/turnstile'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Lead-capture endpoint for the free tools (robots checker, AI crawlability
// checker, fanout query, llms.txt generator) — everything EXCEPT the bigger
// free-score gate, which has its own /api/lead flow.
//
// Collects just { name, email } plus a Cloudflare Turnstile token, verifies the
// challenge server-side, and forwards the lead to the SAME Make.com webhook the
// free-score uses (so every lead lands in one place). The forwarded `event`
// differs per tool so the downstream scenario can tell which tool was used.
//
// Webhook payload contract:
//   [ { event: "free_tool", timestamp, data: {
//         name, first_name, last_name, email,
//         tool, user_type: "free_tool_lead", event: <per-tool event> } } ]

const WEBHOOK_URL =
  process.env.LEAD_WEBHOOK_URL ||
  'https://hook.eu1.make.com/yjknb52uqisoi9j2fzn45gmb4ljokbgq'

// Per-tool event names. Keys are the `tool` slug the client sends.
const TOOL_EVENTS: Record<string, string> = {
  'robots-checker': 'robots_txt_checked',
  'ai-crawlability-checker': 'ai_crawlability_checked',
  fanout: 'fanout_query_run',
  'llms-txt-generator': 'llms_txt_generated'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FIELD = 200

// ISO-8601 with an explicit +00:00 offset (matches the free-score payload).
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

  const name = clean(body.name)
  const email = clean(body.email).toLowerCase()
  const tool = clean(body.tool)
  const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken : ''

  if (!name || !email) {
    return NextResponse.json({ error: 'name and email are required', code: 'missing_fields' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'enter a valid email', code: 'bad_email' }, { status: 400 })
  }
  if (!TOOL_EVENTS[tool]) {
    return NextResponse.json({ error: 'unknown tool', code: 'bad_tool' }, { status: 400 })
  }

  // Cloudflare Turnstile — required whenever the secret is configured (prod).
  // When TURNSTILE_SECRET_KEY is unset (local dev with no keys), skip the gate
  // so the tools stay usable; verifyTurnstile fails closed on a real secret.
  if (process.env.TURNSTILE_SECRET_KEY) {
    if (!turnstileToken) {
      return NextResponse.json({ error: 'please complete the human check', code: 'challenge_missing' }, { status: 400 })
    }
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip')?.trim() ||
      undefined
    const ok = await verifyTurnstile(turnstileToken, ip)
    if (!ok) {
      return NextResponse.json({ error: 'challenge failed, please retry', code: 'challenge_failed' }, { status: 400 })
    }
  }

  // Split the single name field into first/last for downstream compatibility.
  const parts = name.split(/\s+/).filter(Boolean)
  const first_name = parts[0] || name
  const last_name = parts.slice(1).join(' ')

  const now = new Date()
  const payload = [
    {
      event: 'free_tool',
      timestamp: isoUtc(now),
      data: {
        name,
        first_name,
        last_name,
        email,
        tool,
        user_type: 'free_tool_lead',
        event: TOOL_EVENTS[tool]
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
      console.warn('[tool-lead] webhook returned non-2xx', res.status)
      return NextResponse.json({ error: 'could not submit', code: 'upstream' }, { status: 502 })
    }
  } catch (err) {
    console.warn('[tool-lead] webhook request failed', err)
    return NextResponse.json({ error: 'could not submit', code: 'network' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}

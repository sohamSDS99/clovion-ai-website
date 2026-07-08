import { createHash } from 'crypto'

// Meta Conversions API (server-side) sender.
//
// Sends a SERVER copy of a conversion straight to Meta, tagged with the same
// `event_id` the browser Pixel uses so Meta deduplicates the two into one
// event. This recovers conversions the browser Pixel loses to iOS/Safari
// privacy, ad blockers, and closed tabs, and lifts Event Match Quality via
// hashed customer data (email/name) + IP + user-agent + the fbp/fbc cookies.
//
// Safe by design:
//   • No-ops when META_CAPI_TOKEN is unset (any env without the secret).
//   • Never throws — a CAPI failure must never break the lead flow it rides on.
//   • Accepts a plain `Request` so it works in both NextRequest and Request
//     route handlers.

const GRAPH_VERSION = 'v21.0'
const PIXEL_ID = process.env.META_PIXEL_ID || '1059601186732604'
const TOKEN = process.env.META_CAPI_TOKEN || ''
// Set only while testing in Events Manager → Test Events. Leave unset in prod.
const TEST_CODE = process.env.META_CAPI_TEST_CODE || ''

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

// Meta requires PII normalized (trim + lowercase) then SHA-256 hashed. Raw
// values never leave the server.
function hashed(value: string | undefined | null): string | undefined {
  if (!value) return undefined
  const norm = value.trim().toLowerCase()
  return norm ? sha256(norm) : undefined
}

// Parse a single cookie out of the request's Cookie header (works for both
// NextRequest and the Web Request used by some route handlers).
function readCookie(req: Request, name: string): string | undefined {
  const header = req.headers.get('cookie')
  if (!header) return undefined
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return undefined
}

function clientIp(req: Request): string | undefined {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip')?.trim() ||
    undefined
  )
}

export interface MetaConversionInput {
  req: Request
  /** Standard Meta event. Must match the browser Pixel event for dedup. */
  eventName?: string
  /** Shared with the browser Pixel (its `eventID`) so Meta dedupes to one. */
  eventId?: string
  eventSourceUrl?: string
  email?: string
  firstName?: string
  lastName?: string
}

export async function sendMetaConversion(input: MetaConversionInput): Promise<void> {
  if (!TOKEN) return // CAPI not configured on this environment — no-op.

  const { req, eventName = 'Lead', eventId, email, firstName, lastName } = input

  const userData: Record<string, unknown> = {}
  const em = hashed(email)
  if (em) userData.em = [em]
  const fn = hashed(firstName)
  if (fn) userData.fn = [fn]
  const ln = hashed(lastName)
  if (ln) userData.ln = [ln]

  const ip = clientIp(req)
  if (ip) userData.client_ip_address = ip
  const ua = req.headers.get('user-agent') || undefined
  if (ua) userData.client_user_agent = ua
  const fbp = readCookie(req, '_fbp')
  if (fbp) userData.fbp = fbp
  const fbc = readCookie(req, '_fbc')
  if (fbc) userData.fbc = fbc

  const eventSourceUrl = input.eventSourceUrl || req.headers.get('referer') || undefined

  const event: Record<string, unknown> = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    user_data: userData,
  }
  if (eventId) event.event_id = eventId
  if (eventSourceUrl) event.event_source_url = eventSourceUrl

  const payload: Record<string, unknown> = { data: [event] }
  if (TEST_CODE) payload.test_event_code = TEST_CODE

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(TOKEN)}`

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 5_000)
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.warn('[meta-capi] non-2xx', res.status, detail.slice(0, 500))
    }
  } catch (err) {
    console.warn('[meta-capi] send failed', err)
  }
}

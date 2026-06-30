// Signed, short-lived scan authorization token (P2 gate).
//
// Minted by /api/lead after a Turnstile-verified gate submit, set as an
// httpOnly cookie, and required by /api/scan. HMAC-signed (not encrypted) — it
// carries only the user's own email + issued-at, so signing (tamper-proofing)
// is sufficient; httpOnly keeps it out of page JS.

import crypto from 'crypto'

export const SCAN_COOKIE = 'clv_scan'
const TTL_MS = 30 * 60 * 1000 // 30 minutes

function secret(): string {
  return process.env.SCAN_TOKEN_SECRET || ''
}

export function mintScanToken(email: string): string {
  const payload = Buffer.from(JSON.stringify({ email, iat: Date.now() })).toString('base64url')
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyScanToken(token: string | undefined): { email: string } | null {
  const s = secret()
  if (!token || !s) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expected = crypto.createHmac('sha256', s).update(payload).digest('base64url')
  const sigBuf = Buffer.from(sig)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { email?: unknown; iat?: unknown }
    if (typeof data.iat !== 'number' || Date.now() - data.iat > TTL_MS) return null
    return { email: typeof data.email === 'string' ? data.email : '' }
  } catch {
    return null
  }
}

// Parse a single cookie value out of a Cookie header (avoids next/headers in
// the plain-Request scan route).
export function readCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined
  for (const part of cookieHeader.split(';')) {
    const [k, ...v] = part.trim().split('=')
    if (k === name) return decodeURIComponent(v.join('='))
  }
  return undefined
}

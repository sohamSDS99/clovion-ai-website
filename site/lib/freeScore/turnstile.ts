// Cloudflare Turnstile server-side verification (P2 gate anti-abuse).
// Returns true only on a confirmed human challenge. Fails closed.

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret || !token) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (ip && ip !== 'unknown') body.set('remoteip', ip)
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
    })
    if (!res.ok) return false
    const data = (await res.json()) as { success?: boolean }
    return Boolean(data.success)
  } catch (e) {
    console.warn('[free-score] turnstile verify failed:', (e as Error).message)
    return false
  }
}

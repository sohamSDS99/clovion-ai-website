// SSRF-safe server-side fetcher for the free crawler tools.
//
// These tools fetch arbitrary user-supplied URLs server-side, which is a real
// SSRF surface (unlike the LLM scan, which only passes the domain as text). So
// every request is guarded:
//   1. URL must be http(s) with a public hostname (no IP literals, no private
//      hostnames) — reuses validateDomain from the scan pipeline.
//   2. The hostname is DNS-resolved and EVERY resolved address is checked
//      against private / loopback / link-local ranges (blocks DNS rebinding).
//   3. Redirects are followed manually (max 5) and each hop is re-validated, so
//      a public URL can't 30x-redirect into the internal network.
//   4. Hard timeout (AbortController) + response-size cap (streamed, bounded).

import { lookup } from 'node:dns/promises'
import { normalizeDomain, validateDomain } from '@/lib/freeScore/validate'

export type FetchResult = {
  ok: boolean
  status: number
  finalUrl: string
  contentType: string
  /** Decoded body, truncated to maxBytes. Empty string on a non-2xx with no body. */
  body: string
  /** Raw Retry-After header from the final response, if present. */
  retryAfter?: string | null
}

export class FetchError extends Error {
  code: 'bad_url' | 'blocked' | 'timeout' | 'network' | 'too_many_redirects'
  constructor(code: FetchError['code'], message: string) {
    super(message)
    this.code = code
  }
}

const DEFAULT_TIMEOUT_MS = 10_000
const DEFAULT_MAX_BYTES = 2_000_000 // 2 MB — plenty for HTML / robots.txt / sitemaps
const MAX_REDIRECTS = 5
const DEFAULT_RETRIES = 2 // up to 3 attempts total

// Real Chrome UA. Many WAF/CDN front-ends (Cloudflare, Akamai, Imperva) serve a
// 403/503 challenge to non-browser user-agents while letting a browser through,
// so a legitimate on-demand tool has to look like a browser to get the data a
// human would see. See TOOL_USER_AGENT below for the honest-bot identifier we
// still expose to site owners who want to allowlist us.
const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

// Kept exported for reference / robots allowlisting; no longer the default UA.
export const TOOL_USER_AGENT =
  'ClovionBot/1.0 (+https://www.clovion.ai/tools; free AI-readiness checker)'

// Full modern-Chrome header set. WAFs increasingly gate on the presence and
// shape of these client hints + fetch-metadata headers, not just the UA. We
// deliberately do NOT set Accept-Encoding — undici adds it and transparently
// decompresses; setting it manually would hand us back raw gzip bytes.
function browserHeaders(accept: string | undefined, referer: string | undefined): Record<string, string> {
  const h: Record<string, string> = {
    'User-Agent': BROWSER_USER_AGENT,
    Accept: accept ?? 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'sec-ch-ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': referer ? 'same-origin' : 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  }
  if (referer) h.Referer = referer
  return h
}

// Transient statuses worth a retry: rate-limits, gateway/upstream hiccups, and
// the Cloudflare-specific 52x family. 403 is intentionally NOT here — it's a
// deliberate refusal, not a transient blip, so retrying just wastes the budget.
const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504, 521, 522, 523, 524, 525, 526, 527, 529])

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/** Parse a Retry-After header (delta-seconds or HTTP-date) into ms, capped. */
function retryAfterMs(header: string | null, capMs: number): number | null {
  // A blank/whitespace header (some CDNs emit "Retry-After:" with no value)
  // must fall back to backoff — Number('') is 0, which would busy-retry.
  if (!header || !header.trim()) return null
  const secs = Number(header)
  if (Number.isFinite(secs)) return Math.min(Math.max(secs, 0) * 1000, capMs)
  const date = Date.parse(header)
  if (Number.isFinite(date)) return Math.min(Math.max(date - Date.now(), 0), capMs)
  return null
}

/** Exponential backoff with jitter for attempt N (0-based). */
function backoffMs(attempt: number): number {
  const base = 400 * 2 ** attempt // 400, 800, 1600…
  const jitter = Math.floor(Math.random() * 250)
  return Math.min(base + jitter, 3000)
}

/** Clamp a wait to the remaining budget (never wait past the deadline). */
function clampWait(wait: number, deadlineMs?: number): number {
  if (deadlineMs == null) return wait
  return Math.min(wait, Math.max(0, deadlineMs - Date.now()))
}

const DNS_TIMEOUT_MS = 5_000

/** Race a promise against a timeout that rejects with a FetchError. */
async function withTimeout<T>(p: Promise<T>, ms: number, code: FetchError['code'], msg: string): Promise<T> {
  let t: ReturnType<typeof setTimeout>
  const timeout = new Promise<never>((_, reject) => {
    t = setTimeout(() => reject(new FetchError(code, msg)), ms)
  })
  try {
    return await Promise.race([p, timeout])
  } finally {
    clearTimeout(t!)
  }
}

// ── Private / internal IP detection ────────────────────────────────────────

function ipv4IsPrivate(ip: string): boolean {
  const parts = ip.split('.').map((p) => parseInt(p, 10))
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true // malformed → treat as unsafe
  }
  const [a, b] = parts
  if (a === 10) return true // 10.0.0.0/8
  if (a === 127) return true // loopback
  if (a === 0) return true // 0.0.0.0/8
  if (a === 169 && b === 254) return true // link-local
  if (a === 172 && b >= 16 && b <= 31) return true // 172.16.0.0/12
  if (a === 192 && b === 168) return true // 192.168.0.0/16
  if (a === 192 && b === 0 && parts[2] === 2) return true // TEST-NET
  if (a >= 224) return true // multicast / reserved
  if (a === 100 && b >= 64 && b <= 127) return true // CGNAT 100.64.0.0/10
  return false
}

function ipv6IsPrivate(ip: string): boolean {
  const lower = ip.toLowerCase()
  if (lower === '::1' || lower === '::') return true // loopback / unspecified
  if (lower.startsWith('fe80')) return true // link-local
  if (lower.startsWith('fc') || lower.startsWith('fd')) return true // unique-local fc00::/7
  if (lower.startsWith('64:ff9b:')) return true // NAT64 — can embed a private v4
  // IPv4-mapped (::ffff:a.b.c.d) or IPv4-compatible (::a.b.c.d) — check the v4 part.
  const embedded = lower.match(/(?:::ffff:|::)(\d+\.\d+\.\d+\.\d+)$/)
  if (embedded) return ipv4IsPrivate(embedded[1])
  return false
}

function addrIsPrivate(address: string, family: number): boolean {
  return family === 6 ? ipv6IsPrivate(address) : ipv4IsPrivate(address)
}

/** Throws FetchError('blocked'|'bad_url') if the hostname isn't a safe public host. */
async function assertSafeHost(hostname: string): Promise<void> {
  const norm = normalizeDomain(hostname)
  const check = validateDomain(norm)
  if (!check.ok) throw new FetchError('bad_url', check.reason)

  let records: { address: string; family: number }[]
  try {
    // Bound DNS: getaddrinfo has no per-call timeout, so a black-holed NS could
    // otherwise hang ~10-20s inside a single attempt, past the caller's deadline.
    records = await withTimeout(lookup(hostname, { all: true }), DNS_TIMEOUT_MS, 'timeout', 'dns lookup timed out')
  } catch (e) {
    if (e instanceof FetchError) throw e
    throw new FetchError('network', 'could not resolve host')
  }
  if (records.length === 0) throw new FetchError('network', 'could not resolve host')
  for (const r of records) {
    if (addrIsPrivate(r.address, r.family)) {
      throw new FetchError('blocked', 'host resolves to a private address')
    }
  }
}

// ── Public fetch ────────────────────────────────────────────────────────────

export type SafeFetchOptions = {
  timeoutMs?: number
  maxBytes?: number
  accept?: string
  /** Retry count for transient failures (network / timeout / 5xx / 429). Default 2. */
  retries?: number
  /**
   * Retry network errors + timeouts (not just retryable statuses). Default true.
   * Set false for bulk per-page fetches: a hung page rarely recovers on retry, so
   * retrying just doubles the wall-clock cost — but a 503/429 still gets retried.
   */
  retryNetwork?: boolean
  /** Referer header — helps some WAFs treat sub-page fetches as in-session navigation. */
  referer?: string
  /**
   * Absolute epoch-ms deadline for this whole call (all attempts + backoffs).
   * Per-attempt timeout and retry waits are clamped to the remaining budget, and
   * once passed we return the best result so far (or throw). Lets a caller bound
   * total wall-clock across retries instead of retries × timeoutMs.
   */
  deadlineMs?: number
}

/**
 * Fetch a user-supplied URL with SSRF protection, manual redirect re-validation,
 * a timeout, and a size cap. Retries transient failures with backoff (honoring
 * Retry-After). Returns the (truncated) body even for 4xx/5xx so callers can
 * branch on `status` (e.g. a 404 robots.txt means "default allow").
 */
export async function safeFetch(rawUrl: string, opts: SafeFetchOptions = {}): Promise<FetchResult> {
  const retries = opts.retries ?? DEFAULT_RETRIES
  const retryNetwork = opts.retryNetwork ?? true
  const deadlineMs = opts.deadlineMs
  const baseTimeout = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS

  let last: FetchResult | null = null
  for (let attempt = 0; ; attempt++) {
    // Clamp this attempt's timeout to the remaining budget so retries can't
    // multiply past the caller's overall deadline.
    let timeoutMs = baseTimeout
    if (deadlineMs != null) {
      const remaining = deadlineMs - Date.now()
      if (remaining <= 0) {
        if (last) return last // out of time → return the best retryable result we saw
        throw new FetchError('timeout', 'deadline exceeded')
      }
      timeoutMs = Math.min(baseTimeout, remaining)
    }

    let result: FetchResult
    try {
      result = await attemptFetch(rawUrl, { ...opts, timeoutMs })
    } catch (e) {
      // Permanent errors: never retry (bad URL / SSRF block / redirect loop).
      if (e instanceof FetchError && (e.code === 'bad_url' || e.code === 'blocked' || e.code === 'too_many_redirects')) {
        throw e
      }
      // Transient (timeout / network): retry with backoff unless the caller opted
      // out or the budget is spent (clampWait → 0 once the deadline passes).
      const wait = clampWait(backoffMs(attempt), deadlineMs)
      if (retryNetwork && attempt < retries && wait > 0) {
        await sleep(wait)
        continue
      }
      throw e
    }

    // A retryable status (503/429/5xx…) gets one more shot after a backoff.
    if (RETRYABLE_STATUS.has(result.status) && attempt < retries) {
      last = result
      const wait = clampWait(retryAfterMs(result.retryAfter ?? null, 6000) ?? backoffMs(attempt), deadlineMs)
      if (wait <= 0) return result // no budget left to wait/retry → return what we have
      await sleep(wait)
      continue
    }
    return result
  }
}

/** One fetch attempt: SSRF-checked, redirect-following, timed, size-bounded. */
async function attemptFetch(rawUrl: string, opts: SafeFetchOptions): Promise<FetchResult> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const maxBytes = opts.maxBytes ?? DEFAULT_MAX_BYTES

  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new FetchError('bad_url', 'invalid URL')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new FetchError('bad_url', 'only http and https URLs are supported')
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    let current = url
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      await assertSafeHost(current.hostname)

      let res: Response
      try {
        res = await fetch(current.toString(), {
          method: 'GET',
          redirect: 'manual',
          signal: controller.signal,
          headers: browserHeaders(opts.accept, hop === 0 ? opts.referer : `${current.protocol}//${current.hostname}`),
        })
      } catch (e) {
        if (controller.signal.aborted) throw new FetchError('timeout', 'request timed out')
        throw new FetchError('network', (e as Error)?.message || 'network error')
      }

      // Manual redirect handling so we can re-validate every hop's host.
      if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        if (hop === MAX_REDIRECTS) throw new FetchError('too_many_redirects', 'too many redirects')
        const loc = res.headers.get('location') as string
        try {
          current = new URL(loc, current) // resolve relative redirects
        } catch {
          throw new FetchError('bad_url', 'invalid redirect target')
        }
        if (current.protocol !== 'http:' && current.protocol !== 'https:') {
          throw new FetchError('blocked', 'redirect to non-http(s) scheme')
        }
        continue
      }

      const contentType = res.headers.get('content-type') || ''
      const body = await readBounded(res, maxBytes)
      return {
        ok: res.ok,
        status: res.status,
        finalUrl: current.toString(),
        contentType,
        body,
        retryAfter: res.headers.get('retry-after'),
      }
    }
    throw new FetchError('too_many_redirects', 'too many redirects')
  } finally {
    clearTimeout(timer)
  }
}

// Read a response body up to maxBytes, then stop (don't buffer a huge file).
async function readBounded(res: Response, maxBytes: number): Promise<string> {
  if (!res.body) {
    try {
      const t = await res.text()
      return t.slice(0, maxBytes)
    } catch {
      return ''
    }
  }
  const reader = res.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        chunks.push(value)
        total += value.length
        if (total >= maxBytes) {
          // Cancel just the body stream (distinct from the request-timeout abort).
          await reader.cancel().catch(() => {})
          break
        }
      }
    }
  } catch {
    // stream error — return whatever we have
  }
  const merged = new Uint8Array(Math.min(total, maxBytes))
  let offset = 0
  for (const c of chunks) {
    if (offset >= merged.length) break
    const slice = c.subarray(0, merged.length - offset)
    merged.set(slice, offset)
    offset += slice.length
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(merged)
}

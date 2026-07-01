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

// A descriptive, honest UA so site owners can identify the tool in their logs.
export const TOOL_USER_AGENT =
  'ClovionBot/1.0 (+https://www.clovion.ai/tools; free AI-readiness checker)'

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
  // IPv4-mapped (::ffff:a.b.c.d) — extract and check the v4 part.
  const mapped = lower.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  if (mapped) return ipv4IsPrivate(mapped[1])
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
    records = await lookup(hostname, { all: true })
  } catch {
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
}

/**
 * Fetch a user-supplied URL with SSRF protection, manual redirect re-validation,
 * a timeout, and a size cap. Returns the (truncated) body even for 4xx/5xx so
 * callers can branch on `status` (e.g. a 404 robots.txt means "default allow").
 */
export async function safeFetch(rawUrl: string, opts: SafeFetchOptions = {}): Promise<FetchResult> {
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
          headers: {
            'User-Agent': TOOL_USER_AGENT,
            Accept: opts.accept ?? 'text/html,text/plain,*/*',
            'Accept-Language': 'en-US,en;q=0.9',
          },
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
      const body = await readBounded(res, maxBytes, controller)
      clearTimeout(timer)
      return {
        ok: res.ok,
        status: res.status,
        finalUrl: current.toString(),
        contentType,
        body,
      }
    }
    throw new FetchError('too_many_redirects', 'too many redirects')
  } finally {
    clearTimeout(timer)
  }
}

// Read a response body up to maxBytes, then stop (don't buffer a huge file).
async function readBounded(res: Response, maxBytes: number, controller: AbortController): Promise<string> {
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
          controller.abort() // stop the transfer
          break
        }
      }
    }
  } catch {
    // aborted or stream error — return whatever we have
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

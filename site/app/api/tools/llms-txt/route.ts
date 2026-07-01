// llms.txt Generator — real site crawler (thin HTTP wrapper).
//
// Crawl logic lives in lib/tools/llmsCrawl.ts (shared + eval-testable). This
// route only does transport concerns: rate-limit, input validation, and mapping
// the crawl result to a response. It never returns an error for a reachable-but-
// bot-walled site — the crawler degrades to a clean file and we attach a notice.

import { normalizeDomain, validateDomain } from '@/lib/freeScore/validate'
import { checkRateLimit } from '@/lib/freeScore/store'
import { FetchError } from '@/lib/tools/fetch'
import { crawlForLlmsTxt, minimalResult, type CrawlResult } from '@/lib/tools/llmsCrawl'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Hard wall-clock cap below maxDuration. The crawl self-bounds well under this;
// this is belt-and-suspenders so a pathological stall still returns a usable file
// instead of the platform killing the function with a 502.
const HARD_CAP_MS = 52_000

function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
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

  let body: { url?: unknown; brand?: unknown; what?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid JSON body', code: 'bad_json' }, { status: 400 })
  }
  if (typeof body.url !== 'string' || !body.url.trim()) {
    return Response.json({ error: 'url is required', code: 'bad_input' }, { status: 400 })
  }
  const domain = normalizeDomain(body.url)
  const check = validateDomain(domain)
  if (!check.ok) {
    return Response.json({ error: check.reason, code: 'bad_domain' }, { status: 400 })
  }
  const brandOverride = typeof body.brand === 'string' ? body.brand.trim() : ''
  const whatOverride = typeof body.what === 'string' ? body.what.trim() : ''

  // Guard timer declared outside the try so `finally` always clears it, even on
  // the crawl-reject (SSRF) path — otherwise it leaks a 52s timer per request.
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const guard = new Promise<CrawlResult>((resolve) => {
      timer = setTimeout(() => resolve(minimalResult(domain, brandOverride, whatOverride)), HARD_CAP_MS)
    })
    const result = await Promise.race([crawlForLlmsTxt(domain, { brandOverride, whatOverride }), guard])

    // Bot-walled site: we still return a usable (if thin) file plus a notice,
    // rather than a scary error — the user always gets something.
    const notice = result.protectedSite
      ? 'This site is protected by a bot firewall (e.g. Cloudflare/Akamai) that blocks automated crawlers, so we built this from the pages we could discover. Publish it as a starting point and expand it by hand.'
      : undefined

    return Response.json({
      brand: result.brand,
      url: result.url,
      summary: result.summary,
      llmsTxt: result.llmsTxt,
      pageCount: result.pageCount,
      source: result.source,
      protectedSite: result.protectedSite,
      ...(notice ? { notice } : {}),
    })
  } catch (e) {
    // Only SSRF/validation failures reach here — the crawl degrades internally
    // for everything else.
    if (e instanceof FetchError) {
      const status = e.code === 'bad_url' || e.code === 'blocked' ? 400 : 502
      console.warn(`[tools/llms-txt] crawl failed domain=${domain} code=${e.code}: ${e.message}`)
      return Response.json({ error: `could not crawl ${domain} (${e.code})`, code: e.code }, { status })
    }
    console.warn(`[tools/llms-txt] unexpected error domain=${domain}: ${(e as Error)?.message}`)
    return Response.json({ error: 'crawl failed', code: 'upstream' }, { status: 502 })
  } finally {
    clearTimeout(timer)
  }
}

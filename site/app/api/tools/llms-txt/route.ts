// llms.txt Generator — real site crawler.
//
// Crawls the actual site (sitemap-first, link-fallback), fetches each page's
// title + meta description, groups pages into sections, and emits a real
// llms.txt (per llmstxt.org). No more "local preview from typed values".

import { normalizeDomain, validateDomain } from '@/lib/freeScore/validate'
import { checkRateLimit } from '@/lib/freeScore/store'
import { safeFetch, FetchError } from '@/lib/tools/fetch'
import { parseRobots } from '@/lib/tools/robots'
import {
  extractTitle,
  extractDescription,
  extractSiteName,
  extractInternalLinks,
  extractSitemapLocs,
  isSitemapIndex,
} from '@/lib/tools/html'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_PAGES = 25
const CONCURRENCY = 6
const MAX_CHILD_SITEMAPS = 3

type Page = { url: string; title: string; desc: string; path: string }

function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

// Bounded-concurrency map.
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await fn(items[idx])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

// Discover candidate page URLs: robots Sitemap → /sitemap.xml → homepage links.
async function discoverUrls(domain: string, homepageHtml: string): Promise<{ urls: string[]; source: string }> {
  const origin = `https://${domain}`
  const sitemapCandidates: string[] = []

  // 1. Sitemaps declared in robots.txt.
  try {
    const r = await safeFetch(`${origin}/robots.txt`, { timeoutMs: 6000, maxBytes: 256_000, accept: 'text/plain,*/*' })
    if (r.ok) parseRobots(r.body).sitemaps.forEach((s) => sitemapCandidates.push(s))
  } catch {
    /* ignore */
  }
  // 2. Conventional location.
  sitemapCandidates.push(`${origin}/sitemap.xml`)

  for (const sm of sitemapCandidates) {
    try {
      const res = await safeFetch(sm, { timeoutMs: 8000, maxBytes: 2_000_000, accept: 'application/xml,text/xml,*/*' })
      if (!res.ok || !res.body.includes('<loc>')) continue
      let locs: string[]
      if (isSitemapIndex(res.body)) {
        const children = extractSitemapLocs(res.body).slice(0, MAX_CHILD_SITEMAPS)
        const childBodies = await mapLimit(children, MAX_CHILD_SITEMAPS, async (c) => {
          try {
            const cr = await safeFetch(c, { timeoutMs: 8000, maxBytes: 2_000_000, accept: 'application/xml,*/*' })
            return cr.ok ? cr.body : ''
          } catch {
            return ''
          }
        })
        locs = childBodies.flatMap((b) => extractSitemapLocs(b))
      } else {
        locs = extractSitemapLocs(res.body)
      }
      if (locs.length > 0) return { urls: locs, source: 'sitemap' }
    } catch {
      /* try next candidate */
    }
  }

  // 3. Fall back to internal links on the homepage.
  return { urls: extractInternalLinks(homepageHtml, origin, 200), source: 'links' }
}

// Prefer the homepage and shallow, content-y pages; cap the count.
function prioritize(urls: string[], origin: string): string[] {
  const seen = new Set<string>()
  const cleaned: string[] = []
  for (const u of [origin, ...urls]) {
    let url: URL
    try {
      url = new URL(u)
    } catch {
      continue
    }
    url.hash = ''
    const norm = url.toString()
    if (seen.has(norm)) continue
    // Skip obvious non-content assets.
    if (/\.(xml|json|pdf|png|jpe?g|gif|svg|webp|ico|css|js|zip|mp4|webm)$/i.test(url.pathname)) continue
    seen.add(norm)
    cleaned.push(norm)
  }
  cleaned.sort((a, b) => {
    const da = new URL(a).pathname.split('/').filter(Boolean).length
    const db = new URL(b).pathname.split('/').filter(Boolean).length
    if (da !== db) return da - db
    return a.length - b.length
  })
  return cleaned.slice(0, MAX_PAGES)
}

function titleFromPath(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean).pop() || 'Home'
  return seg.replace(/[-_]+/g, ' ').replace(/\.\w+$/, '').replace(/\b\w/g, (c) => c.toUpperCase())
}

function sectionFor(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean)[0]
  if (!seg) return 'Main'
  const map: Record<string, string> = {
    blog: 'Blog',
    news: 'News',
    docs: 'Documentation',
    doc: 'Documentation',
    guide: 'Guides',
    guides: 'Guides',
    pricing: 'Pricing',
    about: 'Company',
    company: 'Company',
    product: 'Product',
    products: 'Product',
    features: 'Features',
    feature: 'Features',
    solutions: 'Solutions',
    customers: 'Customers',
    resources: 'Resources',
    legal: 'Legal',
    support: 'Support',
    help: 'Support',
  }
  return map[seg.toLowerCase()] || seg.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function buildLlmsTxt(brand: string, summary: string, pages: Page[]): string {
  const lines: string[] = [`# ${brand}`, '']
  if (summary) lines.push(`> ${summary}`, '')

  // Group by section, "Main" first.
  const groups = new Map<string, Page[]>()
  for (const p of pages) {
    const sec = sectionFor(p.path)
    if (!groups.has(sec)) groups.set(sec, [])
    groups.get(sec)!.push(p)
  }
  const order = ['Main', ...[...groups.keys()].filter((k) => k !== 'Main').sort()]
  for (const sec of order) {
    const items = groups.get(sec)
    if (!items || items.length === 0) continue
    lines.push(`## ${sec}`)
    for (const p of items) {
      const title = p.title || titleFromPath(p.path)
      lines.push(p.desc ? `- [${title}](${p.url}): ${p.desc}` : `- [${title}](${p.url})`)
    }
    lines.push('')
  }
  return lines.join('\n').trim() + '\n'
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

  const origin = `https://${domain}`
  try {
    // Fetch the homepage first (brand + summary + link fallback).
    const home = await safeFetch(origin, { timeoutMs: 12_000, maxBytes: 2_000_000, accept: 'text/html,*/*' })
    if (!home.ok) {
      return Response.json({ error: `site returned ${home.status}`, code: 'unreachable' }, { status: 502 })
    }
    const brand = brandOverride || extractSiteName(home.body) || domain
    const summary = whatOverride || extractDescription(home.body) || ''

    // Discover + prioritize page URLs.
    const { urls, source } = await discoverUrls(domain, home.body)
    const targets = prioritize(urls, origin)

    // Fetch each page's title + description (homepage is reused from `home`).
    const pages = await mapLimit(targets, CONCURRENCY, async (u): Promise<Page | null> => {
      const path = new URL(u).pathname || '/'
      try {
        const html = u === origin || u === `${origin}/` ? home.body : (await safeFetch(u, { timeoutMs: 7000, maxBytes: 1_000_000, accept: 'text/html,*/*' })).body
        const title = extractTitle(html) || titleFromPath(path)
        const desc = extractDescription(html)
        return { url: u, title, desc, path }
      } catch {
        // Keep the URL even if the page fetch failed — better a link than a gap.
        return { url: u, title: titleFromPath(path), desc: '', path }
      }
    })

    const validPages = pages.filter((p): p is Page => p !== null)
    const llmsTxt = buildLlmsTxt(brand, summary, validPages)

    return Response.json({
      brand,
      url: origin,
      summary,
      llmsTxt,
      pageCount: validPages.length,
      source,
    })
  } catch (e) {
    if (e instanceof FetchError) {
      const status = e.code === 'timeout' ? 504 : e.code === 'bad_url' || e.code === 'blocked' ? 400 : 502
      console.warn(`[tools/llms-txt] crawl failed domain=${domain} code=${e.code}: ${e.message}`)
      return Response.json({ error: `could not crawl ${domain} (${e.code})`, code: e.code }, { status })
    }
    console.warn(`[tools/llms-txt] unexpected error domain=${domain}: ${(e as Error)?.message}`)
    return Response.json({ error: 'crawl failed', code: 'upstream' }, { status: 502 })
  }
}

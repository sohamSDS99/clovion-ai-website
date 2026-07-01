// llms.txt site crawler (shared, testable core).
//
// Extracted from app/api/tools/llms-txt/route.ts so it can be exercised by an
// eval harness against real sites. Design goals, in priority order:
//   1. NEVER emit an error/challenge page's <title> as real content. A transient
//      503 or a WAF interstitial must never leak "503 Service Temporarily
//      Unavailable" into the output — it degrades to a clean path-derived title.
//   2. Recover transient failures (503/429/5xx) via safeFetch's retry+backoff.
//   3. Get a browser's-eye view (safeFetch sends a full browser header set), so
//      UA-gated sites (Swiggy, Zomato) return real data.
//   4. Always finish within the route's time budget (hard overall deadline) and
//      always return SOMETHING usable, even for a fully bot-walled site.

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
import { isUsableContent, isErrorTitle } from '@/lib/tools/blockDetect'

const MAX_PAGES = 25
const CONCURRENCY = 4 // polite against a single origin; was 6 (which provoked rate-limits)
const MAX_CHILD_SITEMAPS = 3
const OVERALL_DEADLINE_MS = 40_000 // route maxDuration is 60s — leave headroom for the tail
const HOME_TIMEOUT_MS = 12_000
const PAGE_TIMEOUT_MS = 7_000

export type CrawledPage = { url: string; title: string; desc: string; path: string }

/** Per-page diagnostics (eval only — never shipped in the llms.txt). */
export type PageDebug = { url: string; status: number | 'error' | 'skipped'; via: 'scraped' | 'fallback' }

export type CrawlResult = {
  brand: string
  url: string
  summary: string
  llmsTxt: string
  pageCount: number
  source: 'sitemap' | 'links' | 'minimal'
  /** True when the homepage itself couldn't be read (hard bot-wall / down). */
  protectedSite: boolean
  stats: {
    discovered: number
    fetched: number
    scraped: number
    fallback: number
    elapsedMs: number
  }
  debug?: PageDebug[]
}

export type CrawlOptions = {
  brandOverride?: string
  whatOverride?: string
  maxPages?: number
  /** Collect per-page diagnostics into the result. */
  debug?: boolean
}

// Bounded-concurrency map.
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await fn(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

// Derive a readable brand from a bare domain: "daraz.com.bd" → "Daraz".
function brandFromDomain(domain: string): string {
  const label = domain.replace(/^www\./, '').split('.')[0] || domain
  return label.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function titleFromPath(pathname: string): string {
  const seg = pathname.split('/').filter(Boolean).pop() || 'Home'
  return seg
    .replace(/\.\w+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

const TITLE_MAX = 100
const DESC_MAX = 250

// Truncate at a word boundary with an ellipsis so bullets don't run 2-3KB long.
function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1) // reserve one char for the ellipsis so we stay ≤ max
  const sp = cut.lastIndexOf(' ')
  let out = sp > max * 0.6 ? cut.slice(0, sp) : cut
  // Don't leave a lone high surrogate (would render as �) if we cut mid-emoji/CJK.
  if (/[\uD800-\uDBFF]$/.test(out)) out = out.slice(0, -1)
  return out.trimEnd() + '…'
}

// Strip characters that break `[title](url)` markdown, collapse ws, cap length.
function sanitizeTitle(s: string): string {
  return truncate(s.replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim(), TITLE_MAX)
}

// Sanitize an extracted title: never return an error/challenge-looking title.
function cleanTitle(raw: string, path: string): string {
  const t = raw.trim()
  if (!t || isErrorTitle(t)) return titleFromPath(path)
  return sanitizeTitle(t)
}

// A description gets the SAME error-string guard as a title (requirement #1 is
// absolute) plus a length cap. extractDescription already collapses whitespace.
function cleanDesc(raw: string): string {
  const d = (raw || '').trim()
  if (!d || isErrorTitle(d)) return ''
  return truncate(d, DESC_MAX)
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
    'about-us': 'Company',
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
    terms: 'Legal',
    privacy: 'Legal',
    contact: 'Company',
  }
  if (map[seg.toLowerCase()]) return map[seg.toLowerCase()]
  let label = seg
  try {
    label = decodeURIComponent(seg)
  } catch {
    /* keep raw on malformed %-encoding */
  }
  label = label.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  return truncate(label, 40)
}

export function buildLlmsTxt(brand: string, summary: string, pages: CrawledPage[]): string {
  const lines: string[] = [`# ${brand}`, '']
  if (summary) lines.push(`> ${summary}`, '')

  const groups = new Map<string, CrawledPage[]>()
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

// A URL worth listing as a page: not an asset, feed, or (gzipped) sitemap file.
function isCrawlablePageUrl(u: URL): boolean {
  if (/\.(xml|gz|json|pdf|png|jpe?g|gif|svg|webp|ico|css|js|mjs|zip|mp4|webm|rss|atom|txt|csv|woff2?|ttf)$/i.test(u.pathname)) return false
  if (/sitemap/i.test(u.pathname)) return false
  return true
}

// Keep only real content URLs from a batch of sitemap <loc>s.
function contentUrls(locs: string[]): string[] {
  const out: string[] = []
  for (const l of locs) {
    try {
      if (isCrawlablePageUrl(new URL(l))) out.push(l)
    } catch {
      /* skip malformed */
    }
  }
  return out
}

// Discover candidate page URLs: robots Sitemap → /sitemap.xml → homepage links.
// deadlineMs bounds the whole discovery phase so a slow/flaky site can't run the
// serial candidate loop past the route budget.
async function discoverUrls(domain: string, homepageHtml: string, deadlineMs: number): Promise<{ urls: string[]; source: 'sitemap' | 'links' }> {
  const origin = `https://${domain}`
  const sitemapCandidates: string[] = []

  if (Date.now() < deadlineMs) {
    try {
      const r = await safeFetch(`${origin}/robots.txt`, { timeoutMs: 6000, maxBytes: 256_000, accept: 'text/plain,*/*', retries: 1, deadlineMs })
      if (r.ok) parseRobots(r.body).sitemaps.forEach((s) => sitemapCandidates.push(s))
    } catch {
      /* ignore */
    }
  }
  sitemapCandidates.push(`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`)

  for (const sm of sitemapCandidates) {
    if (Date.now() > deadlineMs) break // out of discovery budget → fall to links
    try {
      const res = await safeFetch(sm, { timeoutMs: 8000, maxBytes: 2_000_000, accept: 'application/xml,text/xml,*/*', retries: 1, deadlineMs })
      if (!res.ok || !res.body.includes('<loc>')) continue
      let locs: string[]
      if (isSitemapIndex(res.body)) {
        const children = extractSitemapLocs(res.body).slice(0, MAX_CHILD_SITEMAPS)
        const childBodies = await mapLimit(children, MAX_CHILD_SITEMAPS, async (c) => {
          // undici won't auto-decompress a .gz FILE body — parsing it is binary
          // noise. Skip it; contentUrls will then fall through to links.
          if (/\.gz(?:$|\?)/i.test(c)) return ''
          try {
            const cr = await safeFetch(c, { timeoutMs: 8000, maxBytes: 2_000_000, accept: 'application/xml,*/*', retries: 1, deadlineMs })
            return cr.ok ? cr.body : ''
          } catch {
            return ''
          }
        })
        locs = childBodies.flatMap((b) => extractSitemapLocs(b))
      } else {
        locs = extractSitemapLocs(res.body)
      }
      // Keep only real pages — a sitemap-index whose children are gzipped (Daraz)
      // yields only .xml.gz locs we can't parse; fall through to links instead of
      // emitting a near-empty, sitemap-file-only list.
      const content = contentUrls(locs)
      if (content.length > 0) return { urls: content, source: 'sitemap' }
    } catch {
      /* try next candidate */
    }
  }

  return { urls: extractInternalLinks(homepageHtml, origin, 200), source: 'links' }
}

// Prefer the homepage and shallow, content-y pages; cap the count.
function prioritize(urls: string[], origin: string, maxPages: number): string[] {
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
    url.search = '' // drop tracking/query params so ?utm variants don't dup
    // Skip non-content assets, gzipped/plain sitemaps, and feed files.
    if (!isCrawlablePageUrl(url)) continue
    // Dedup on host-without-www + path so apex/www and trailing-slash variants collapse.
    const key = url.hostname.replace(/^www\./, '') + (url.pathname.replace(/\/+$/, '') || '/')
    if (seen.has(key)) continue
    seen.add(key)
    cleaned.push(url.toString())
  }
  // Shallow paths first, then shorter URLs. Precompute depth so the comparator
  // doesn't re-parse each URL O(n log n) times.
  return cleaned
    .map((u) => ({ u, depth: new URL(u).pathname.split('/').filter(Boolean).length }))
    .sort((a, b) => a.depth - b.depth || a.u.length - b.u.length)
    .slice(0, maxPages)
    .map((x) => x.u)
}

/**
 * Crawl a domain and produce an llms.txt. Never throws for a reachable-but-
 * blocked site — it degrades to a clean, complete file. Throws FetchError only
 * for a bad/blocked URL (SSRF) so the route can return a 400.
 */
export async function crawlForLlmsTxt(domain: string, opts: CrawlOptions = {}): Promise<CrawlResult> {
  const started = Date.now()
  const deadlineAt = started + OVERALL_DEADLINE_MS
  // Sub-budgets so the homepage fetch + discovery can't each eat the whole clock.
  const homeDeadline = Math.min(deadlineAt, started + 14_000)
  const discoverDeadline = Math.min(deadlineAt, started + 24_000)
  const origin = `https://${domain}`
  const maxPages = opts.maxPages ?? MAX_PAGES
  const debug: PageDebug[] = []

  // ── Homepage ────────────────────────────────────────────────────────────
  let homeBody = ''
  let homeUsable = false
  let homeStatus: number | 'error' = 'error'
  try {
    const home = await safeFetch(origin, { timeoutMs: HOME_TIMEOUT_MS, maxBytes: 2_000_000, accept: 'text/html,*/*', retries: 2, deadlineMs: homeDeadline })
    homeBody = home.body
    homeStatus = home.status
    homeUsable = isUsableContent(home.status, home.ok, home.body, extractTitle(home.body))
  } catch (e) {
    // A bad/blocked URL is an SSRF/validation failure — surface it. A transient
    // network/timeout after retries just means "homepage unreadable" → degrade.
    if (e instanceof FetchError && (e.code === 'bad_url' || e.code === 'blocked')) throw e
  }

  const protectedSite = !homeUsable
  // Brand feeds the H1 + summary, so guard it like a title: extractSiteName can
  // prefer an unvalidated og:site_name/application-name (could be an error string
  // or arbitrarily long). Drop error-looking values and cap length.
  const rawBrand = opts.brandOverride || (homeUsable ? extractSiteName(homeBody) : '')
  const brand = (rawBrand && !isErrorTitle(rawBrand) ? sanitizeTitle(rawBrand) : '') || brandFromDomain(domain)
  let summary = opts.whatOverride || (homeUsable ? cleanDesc(extractDescription(homeBody)) : '')
  // Make the downloaded file self-describing when we couldn't read a real summary
  // from a bot-walled homepage (the notice otherwise only lives in the JSON).
  if (!summary && protectedSite) {
    summary = `${brand} — generated from the limited public pages we could read; expand this by hand.`
  }

  // ── Discover URLs (robots/sitemap work even when HTML is soft-blocked) ────
  const { urls, source } = await discoverUrls(domain, homeUsable ? homeBody : '', discoverDeadline)
  const targets = prioritize(urls, origin, maxPages)

  // ── Fetch each page (status-aware; degrade, never leak error titles) ──────
  const pages = await mapLimit(targets, CONCURRENCY, async (u): Promise<CrawledPage> => {
    const path = new URL(u).pathname || '/'
    const isHome = u === origin || u === `${origin}/`

    // Reuse the homepage response we already fetched — never fetch origin twice
    // (this matters most on the slowest bot-walled sites).
    if (isHome) {
      if (homeUsable) {
        // Prefer the real <title>; if the homepage has none, use the brand (not "Home").
        const rawTitle = extractTitle(homeBody)
        const title = rawTitle && !isErrorTitle(rawTitle) ? sanitizeTitle(rawTitle) : brand
        if (opts.debug) debug.push({ url: u, status: 200, via: 'scraped' })
        return { url: u, title, desc: cleanDesc(extractDescription(homeBody)), path }
      }
      if (opts.debug) debug.push({ url: u, status: homeStatus, via: 'fallback' })
      return { url: u, title: brand, desc: '', path }
    }

    // Past the overall deadline → don't start new fetches; degrade cleanly.
    if (Date.now() > deadlineAt) {
      if (opts.debug) debug.push({ url: u, status: 'skipped', via: 'fallback' })
      return { url: u, title: titleFromPath(path), desc: '', path }
    }

    try {
      const res = await safeFetch(u, { timeoutMs: PAGE_TIMEOUT_MS, maxBytes: 1_000_000, accept: 'text/html,*/*', retries: 1, retryNetwork: false, referer: origin, deadlineMs: deadlineAt })
      const rawTitle = extractTitle(res.body)
      if (isUsableContent(res.status, res.ok, res.body, rawTitle)) {
        if (opts.debug) debug.push({ url: u, status: res.status, via: 'scraped' })
        return { url: u, title: cleanTitle(rawTitle, path), desc: cleanDesc(extractDescription(res.body)), path }
      }
      // Reachable but blocked/errored → clean path-derived title, no error text.
      if (opts.debug) debug.push({ url: u, status: res.status, via: 'fallback' })
      return { url: u, title: titleFromPath(path), desc: '', path }
    } catch {
      if (opts.debug) debug.push({ url: u, status: 'error', via: 'fallback' })
      return { url: u, title: titleFromPath(path), desc: '', path }
    }
  })

  const resolvedSource: CrawlResult['source'] = targets.length <= 1 && protectedSite ? 'minimal' : source
  const llmsTxt = buildLlmsTxt(brand, summary, pages)
  const scraped = debug.filter((d) => d.via === 'scraped').length

  return {
    brand,
    url: origin,
    summary,
    llmsTxt,
    pageCount: pages.length,
    source: resolvedSource,
    protectedSite,
    stats: {
      discovered: urls.length,
      fetched: targets.length,
      scraped: opts.debug ? scraped : pages.length,
      fallback: opts.debug ? debug.length - scraped : 0,
      elapsedMs: Date.now() - started,
    },
    debug: opts.debug ? debug : undefined,
  }
}

/**
 * A minimal, always-valid result built from just the domain — used as the
 * route's last-resort fallback if the crawl ever stalls past its budget, so the
 * user still gets a usable file instead of a platform timeout.
 */
export function minimalResult(domain: string, brandOverride?: string, whatOverride?: string): CrawlResult {
  const origin = `https://${domain}`
  const brand = (brandOverride && !isErrorTitle(brandOverride) ? sanitizeTitle(brandOverride) : '') || brandFromDomain(domain)
  const summary = whatOverride || `${brand} — generated from the limited public pages we could read; expand this by hand.`
  const pages: CrawledPage[] = [{ url: `${origin}/`, title: brand, desc: '', path: '/' }]
  return {
    brand,
    url: origin,
    summary,
    llmsTxt: buildLlmsTxt(brand, summary, pages),
    pageCount: 1,
    source: 'minimal',
    protectedSite: true,
    stats: { discovered: 0, fetched: 1, scraped: 0, fallback: 1, elapsedMs: 0 },
  }
}

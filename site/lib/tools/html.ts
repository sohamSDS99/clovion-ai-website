// Lightweight HTML / sitemap extraction helpers for the crawler tools.
// Regex-based (no DOM dep) — tolerant enough for title/meta/link/sitemap scraping.

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, '/')
    .replace(/&nbsp;/g, ' ')
    .trim()
}

export function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  return m ? decodeEntities(m[1].replace(/\s+/g, ' ')) : ''
}

// Parse all <meta> tags into a list of attribute maps.
function metaTags(html: string): Record<string, string>[] {
  const tags: Record<string, string>[] = []
  const re = /<meta\b[^>]*>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    const attrs: Record<string, string> = {}
    const attrRe = /([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g
    let a: RegExpExecArray | null
    while ((a = attrRe.exec(m[0]))) {
      attrs[a[1].toLowerCase()] = decodeEntities(a[3] ?? a[4] ?? '')
    }
    tags.push(attrs)
  }
  return tags
}

/** Get a meta value by name= or property= (e.g. "description", "og:site_name"). */
export function getMeta(html: string, key: string): string {
  const k = key.toLowerCase()
  for (const t of metaTags(html)) {
    if ((t.name?.toLowerCase() === k || t.property?.toLowerCase() === k) && t.content) {
      return t.content
    }
  }
  return ''
}

/** Best-effort one-line site description: meta description → og:description. */
export function extractDescription(html: string): string {
  return getMeta(html, 'description') || getMeta(html, 'og:description') || ''
}

/** Best-effort brand/site name: og:site_name → application-name → <title> head. */
export function extractSiteName(html: string): string {
  const og = getMeta(html, 'og:site_name') || getMeta(html, 'application-name')
  if (og) return og
  const title = extractTitle(html)
  // "Brand — tagline" / "Brand | tagline" → take the leading segment.
  const head = title.split(/\s*[|–—\-:]\s*/)[0]?.trim()
  return head || title
}

// Same-host internal links, normalized (no fragment/query), deduped.
export function extractInternalLinks(html: string, baseUrl: string, max = 100): string[] {
  let base: URL
  try {
    base = new URL(baseUrl)
  } catch {
    return []
  }
  const seen = new Set<string>()
  const out: string[] = []
  const re = /<a\b[^>]*\bhref\s*=\s*("([^"]*)"|'([^']*)')/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) && out.length < max) {
    const raw = (m[2] ?? m[3] ?? '').trim()
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.startsWith('javascript:')) {
      continue
    }
    let u: URL
    try {
      u = new URL(raw, base)
    } catch {
      continue
    }
    if (u.protocol !== 'http:' && u.protocol !== 'https:') continue
    if (u.hostname.replace(/^www\./, '') !== base.hostname.replace(/^www\./, '')) continue
    u.hash = ''
    u.search = ''
    const norm = u.toString().replace(/\/$/, '') || u.toString()
    if (seen.has(norm)) continue
    seen.add(norm)
    out.push(norm)
  }
  return out
}

/** Extract <loc> URLs from a sitemap or sitemap-index XML. */
export function extractSitemapLocs(xml: string, max = 5000): string[] {
  const out: string[] = []
  const re = /<loc>\s*([\s\S]*?)\s*<\/loc>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(xml)) && out.length < max) {
    const loc = decodeEntities(m[1])
    if (/^https?:\/\//i.test(loc)) out.push(loc)
  }
  return out
}

/** True if the XML looks like a sitemap index (points at child sitemaps). */
export function isSitemapIndex(xml: string): boolean {
  return /<sitemapindex[\s>]/i.test(xml)
}

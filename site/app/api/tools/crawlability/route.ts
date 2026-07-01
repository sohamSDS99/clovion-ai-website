// AI Crawlability Checker — real crawler endpoint.
//
// Fetches the site's actual robots.txt and reports, per AI engine, whether its
// crawler can read the site root. Backed by the same RFC-9309 matcher as the
// robots checker; output varies per site (no mock data).

import { normalizeDomain, validateDomain } from '@/lib/freeScore/validate'
import { checkRateLimit } from '@/lib/freeScore/store'
import { safeFetch, FetchError } from '@/lib/tools/fetch'
import { parseRobots, evaluateBot } from '@/lib/tools/robots'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 20

// Curated 10-engine view (matches the tool's display labels). Status is
// computed live from the fetched robots.txt.
const ENGINES: { engine: string; ua: string; detail: string }[] = [
  { engine: 'ChatGPT (training)', ua: 'GPTBot', detail: 'Used by OpenAI to collect training data.' },
  { engine: 'ChatGPT (browsing)', ua: 'ChatGPT-User', detail: 'Fetches live pages when ChatGPT users browse.' },
  { engine: 'Claude (training)', ua: 'anthropic-ai', detail: 'Anthropic training-data collector.' },
  { engine: 'Claude (live)', ua: 'ClaudeBot', detail: 'Powers Claude’s live answer retrieval.' },
  { engine: 'Claude (crawler)', ua: 'Claude-Web', detail: 'General Anthropic web crawler.' },
  { engine: 'Perplexity', ua: 'PerplexityBot', detail: 'Indexes pages for Perplexity citations.' },
  { engine: 'Google AI Overviews', ua: 'Google-Extended', detail: 'Controls Google AI Overviews and Gemini access.' },
  { engine: 'Common Crawl', ua: 'CCBot', detail: 'Bulk dataset used by many open-source models.' },
  { engine: 'Apple Intelligence', ua: 'Applebot-Extended', detail: 'Controls Apple Intelligence access.' },
  { engine: 'Bytespider (TikTok)', ua: 'Bytespider', detail: 'ByteDance / TikTok crawler.' },
]

type Bot = { engine: string; ua: string; status: 'Allowed' | 'Blocked'; detail: string }

function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

function buildBots(robotsText: string, exists: boolean): Bot[] {
  const parsed = parseRobots(robotsText)
  return ENGINES.map(({ engine, ua, detail }) => {
    if (!exists) {
      return { engine, ua, status: 'Allowed' as const, detail: `${detail} · no robots.txt — allowed by default` }
    }
    const v = evaluateBot(parsed, ua, '/')
    // Conflicting (indeterminate) rules resolve to "allow" per the spec tie-break.
    const status: 'Allowed' | 'Blocked' = v.status === 'blocked' ? 'Blocked' : 'Allowed'
    const note = v.status === 'indeterminate' ? `${v.rule} (resolves to allow)` : v.rule
    return { engine, ua, status, detail: `${detail} · ${note}` }
  })
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

  let body: { url?: unknown }
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

  const robotsUrl = `https://${domain}/robots.txt`
  try {
    const res = await safeFetch(robotsUrl, { timeoutMs: 10_000, maxBytes: 512_000, accept: 'text/plain,*/*' })
    const looksHtml =
      /text\/html/i.test(res.contentType) ||
      res.body.trimStart().toLowerCase().startsWith('<!doctype') ||
      res.body.trimStart().startsWith('<')
    const exists = res.ok && !looksHtml && !!res.body.trim()
    const robotsText = exists ? res.body : ''
    const bots = buildBots(robotsText, exists)
    const allowedCount = bots.filter((b) => b.status === 'Allowed').length
    return Response.json({
      url: `https://${domain}`,
      exists,
      robotsUrl: exists ? res.finalUrl : robotsUrl,
      bots,
      allowedCount,
      total: bots.length,
    })
  } catch (e) {
    if (e instanceof FetchError) {
      const status = e.code === 'timeout' ? 504 : e.code === 'bad_url' || e.code === 'blocked' ? 400 : 502
      console.warn(`[tools/crawlability] fetch failed domain=${domain} code=${e.code}: ${e.message}`)
      return Response.json({ error: `could not reach ${domain} (${e.code})`, code: e.code }, { status })
    }
    console.warn(`[tools/crawlability] unexpected error domain=${domain}: ${(e as Error)?.message}`)
    return Response.json({ error: 'check failed', code: 'upstream' }, { status: 502 })
  }
}

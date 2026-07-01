// A real robots.txt parser + AI-bot matcher (RFC 9309 / Google's spec).
//
// Used by both the Robots.txt AI Bot Checker and the AI Crawlability Checker.
// Given the raw robots.txt text and a list of bot user-agent tokens, it returns
// per-bot access for the site root ("/") using:
//   - group selection: most-specific matching User-agent token, else "*"
//   - longest-match precedence between Allow / Disallow
//   - Allow-wins on equal-length ties (per spec); equal-length Allow+Disallow
//     conflict is surfaced as "indeterminate" for human review
//   - wildcard "*" and end-anchor "$" support in rule paths

export type RobotsRule = { type: 'allow' | 'disallow'; path: string }
export type RobotsGroup = { agents: string[]; rules: RobotsRule[] }
export type ParsedRobots = { groups: RobotsGroup[]; sitemaps: string[] }

export type BotStatus = 'allowed' | 'blocked' | 'indeterminate'

export type BotVerdict = {
  status: BotStatus
  /** Human-readable matched-rule label, e.g. "Allow: /" or "wildcard · Disallow: /". */
  rule: string
  /** Which group matched: a named token, "*", or null (no robots / no rule). */
  matchedAgent: string | null
  via: 'named' | 'wildcard' | 'default'
}

// ── Parser ──────────────────────────────────────────────────────────────────

export function parseRobots(text: string): ParsedRobots {
  const groups: RobotsGroup[] = []
  const sitemaps: string[] = []
  let current: RobotsGroup | null = null
  let lastWasUserAgent = false

  for (const rawLine of text.split(/\r?\n/)) {
    // Strip comments and surrounding whitespace.
    const line = rawLine.replace(/#.*$/, '').trim()
    if (!line) continue
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const field = line.slice(0, colon).trim().toLowerCase()
    const value = line.slice(colon + 1).trim()

    if (field === 'user-agent') {
      if (!current || !lastWasUserAgent) {
        current = { agents: [value], rules: [] }
        groups.push(current)
      } else {
        current.agents.push(value)
      }
      lastWasUserAgent = true
    } else if (field === 'allow' || field === 'disallow') {
      if (current) current.rules.push({ type: field, path: value })
      lastWasUserAgent = false
    } else if (field === 'sitemap') {
      if (value) sitemaps.push(value)
      // sitemap is a global directive — does not close a user-agent block
    }
    // other fields (crawl-delay, host, etc.) are ignored for matching
  }

  return { groups, sitemaps }
}

// ── Path matching ─────────────────────────────────────────────────────────

// Compile a robots path pattern (with "*" wildcard and trailing "$" anchor)
// into a RegExp anchored at the start of the URL path.
function patternToRegExp(pattern: string): RegExp {
  let p = pattern
  let anchorEnd = false
  if (p.endsWith('$')) {
    anchorEnd = true
    p = p.slice(0, -1)
  }
  // Escape regex metacharacters, then restore "*" as ".*".
  const escaped = p.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')
  return new RegExp('^' + escaped + (anchorEnd ? '$' : ''))
}

// "Effective length" for longest-match precedence: wildcards count as 0 chars,
// everything else counts literally (matches Google's specificity heuristic).
function effectiveLength(pattern: string): number {
  return pattern.replace(/\*/g, '').replace(/\$$/, '').length
}

// ── Group selection ─────────────────────────────────────────────────────────

function selectGroup(parsed: ParsedRobots, botUa: string): {
  rules: RobotsRule[]
  matchedAgent: string | null
  via: 'named' | 'wildcard' | 'default'
} {
  const bot = botUa.toLowerCase()

  // Find the longest named agent token that is a prefix of the bot's token.
  let bestAgent: string | null = null
  let bestLen = -1
  for (const g of parsed.groups) {
    for (const agent of g.agents) {
      const a = agent.toLowerCase()
      if (a === '*') continue
      if (bot.startsWith(a) && a.length > bestLen) {
        bestAgent = a
        bestLen = a.length
      }
    }
  }

  if (bestAgent) {
    const rules = parsed.groups
      .filter((g) => g.agents.some((a) => a.toLowerCase() === bestAgent))
      .flatMap((g) => g.rules)
    return { rules, matchedAgent: bestAgent, via: 'named' }
  }

  // Fall back to the "*" catch-all group(s).
  const wildcardGroups = parsed.groups.filter((g) => g.agents.some((a) => a === '*'))
  if (wildcardGroups.length > 0) {
    return { rules: wildcardGroups.flatMap((g) => g.rules), matchedAgent: '*', via: 'wildcard' }
  }

  return { rules: [], matchedAgent: null, via: 'default' }
}

// ── Verdict for a single bot ──────────────────────────────────────────────

export function evaluateBot(
  parsed: ParsedRobots,
  botUa: string,
  path = '/'
): BotVerdict {
  const { rules, matchedAgent, via } = selectGroup(parsed, botUa)
  const prefix = via === 'wildcard' ? 'wildcard · ' : ''

  // Rules that match the target path, with their specificity.
  const matches: { rule: RobotsRule; len: number }[] = []
  for (const r of rules) {
    if (r.path === '') continue // empty value = no restriction; ignore
    if (patternToRegExp(r.path).test(path)) {
      matches.push({ rule: r, len: effectiveLength(r.path) })
    }
  }

  if (matches.length === 0) {
    // No matching rule → default allow.
    const label = via === 'default' ? 'no rule · allow' : `${prefix}allowed · no matching rule`
    return { status: 'allowed', rule: label, matchedAgent, via }
  }

  const maxLen = Math.max(...matches.map((m) => m.len))
  const atMax = matches.filter((m) => m.len === maxLen)
  const hasAllow = atMax.some((m) => m.rule.type === 'allow')
  const hasDisallow = atMax.some((m) => m.rule.type === 'disallow')

  if (hasAllow && hasDisallow) {
    return { status: 'indeterminate', rule: `${prefix}conflicting`, matchedAgent, via }
  }

  const winner = atMax[0].rule
  const verb = winner.type === 'allow' ? 'Allow' : 'Disallow'
  return {
    status: winner.type === 'allow' ? 'allowed' : 'blocked',
    rule: `${prefix}${verb}: ${winner.path}`,
    matchedAgent,
    via,
  }
}

// ── AI bot catalog ──────────────────────────────────────────────────────────

export type AiBot = {
  /** Display name. */
  bot: string
  /** User-agent token used for robots.txt matching. */
  ua: string
  /** Friendly engine label (used by the crawlability checker). */
  engine: string
  /** One-line description of what the bot does. */
  detail: string
}

// Current, public AI crawler user-agents. Tokens match what each vendor
// documents in their robots.txt guidance.
export const AI_BOTS: AiBot[] = [
  { bot: 'GPTBot', ua: 'GPTBot', engine: 'ChatGPT (training)', detail: 'OpenAI’s crawler that collects training data.' },
  { bot: 'ChatGPT-User', ua: 'ChatGPT-User', engine: 'ChatGPT (browsing)', detail: 'Fetches live pages when ChatGPT users browse.' },
  { bot: 'OAI-SearchBot', ua: 'OAI-SearchBot', engine: 'ChatGPT Search', detail: 'Indexes pages for ChatGPT’s search results.' },
  { bot: 'ClaudeBot', ua: 'ClaudeBot', engine: 'Claude (training)', detail: 'Anthropic’s crawler for training data.' },
  { bot: 'Claude-Web', ua: 'Claude-Web', engine: 'Claude (browsing)', detail: 'Fetches pages for Claude’s live answers.' },
  { bot: 'anthropic-ai', ua: 'anthropic-ai', engine: 'Anthropic (legacy)', detail: 'Legacy Anthropic user-agent.' },
  { bot: 'PerplexityBot', ua: 'PerplexityBot', engine: 'Perplexity', detail: 'Crawls pages for Perplexity’s answer engine.' },
  { bot: 'Google-Extended', ua: 'Google-Extended', engine: 'Gemini / AI Overviews', detail: 'Controls use of your content for Google’s AI.' },
  { bot: 'Applebot-Extended', ua: 'Applebot-Extended', engine: 'Apple Intelligence', detail: 'Controls Apple’s use of content for AI training.' },
  { bot: 'Amazonbot', ua: 'Amazonbot', engine: 'Amazon (Alexa/AI)', detail: 'Amazon’s crawler powering Alexa and AI features.' },
  { bot: 'Meta-ExternalAgent', ua: 'Meta-ExternalAgent', engine: 'Meta AI', detail: 'Meta’s crawler for AI products.' },
  { bot: 'CCBot', ua: 'CCBot', engine: 'Common Crawl', detail: 'Open dataset many AI models train on.' },
  { bot: 'Bytespider', ua: 'Bytespider', engine: 'ByteDance / TikTok', detail: 'ByteDance crawler used for AI training.' },
  { bot: 'Diffbot', ua: 'Diffbot', engine: 'Diffbot', detail: 'Structured-data crawler used by AI products.' },
  { bot: 'cohere-ai', ua: 'cohere-ai', engine: 'Cohere', detail: 'Cohere’s crawler for model data.' },
  { bot: 'YouBot', ua: 'YouBot', engine: 'You.com', detail: 'Crawler for the You.com answer engine.' },
  { bot: 'AI2Bot', ua: 'AI2Bot', engine: 'Allen Institute (AI2)', detail: 'Allen Institute for AI research crawler.' },
]

export function botByUa(ua: string): AiBot | undefined {
  return AI_BOTS.find((b) => b.ua.toLowerCase() === ua.toLowerCase())
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Container, Button, Eyebrow, Tag, ArrowRight, Check, HeroShade } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Changelog | Clovion AI',
  description:
    'Every release, fix, and research drop from Clovion AI, in reverse chronological order. Subscribe to get the weekly digest in your inbox.'
}

// Rich, page-local changelog entries. The lib/content.ts version is shorter and
// lacks the type/body/contributors/improvements fields needed by this layout —
// keeping these inline so the page stays self-contained per the blueprint.
type EntryType = 'Features' | 'Fixes' | 'Research' | 'Performance' | 'Integrations' | 'Security'

type ChangelogEntry = {
  id: string
  date: string
  dateLabel: string
  type: EntryType
  title: string
  body: string
  contributors: string[]
  mock?: 'daily-refresh' | 'auto-apply' | 'engine-grid' | 'csv' | 'mcp' | 'webhook' | 'citation' | 'soc2'
  stat?: { label: string; value: string }
  improvements?: string[]
  fixes?: string[]
  learnMore?: string
}

const entries: ChangelogEntry[] = [
  {
    id: 'daily-refresh',
    date: '2026-11-06',
    dateLabel: 'NOV 6, 2026',
    type: 'Features',
    title: 'Daily refresh is live',
    body: 'Tracking now runs every 24 hours by default on Growth and Scale, no scheduling required. Engines that previously ran on a 72-hour cycle (DeepSeek, Mistral, Llama-Index) are caught up to the same cadence. The dashboard surfaces a "last refreshed" timestamp on each prompt so you always know how fresh the citation count is.',
    contributors: ['MP', 'JL', 'SR'],
    mock: 'daily-refresh',
    stat: { label: 'Median scan time', value: '60s → 22s (-63%)' },
    improvements: [
      'Per-engine retry queue isolates flaky vendors without blocking the rest of the run.',
      'Dashboard now caches the previous run for instant compare while the next one fetches.'
    ],
    fixes: [
      'ChatGPT runs no longer time out when a prompt returns more than 12 citations.',
      'Sentiment scoring respects punctuation in non-English locales.'
    ],
    learnMore: '/docs/how-tracking-works'
  },
  {
    id: 'wp-auto-apply',
    date: '2026-10-30',
    dateLabel: 'OCT 30, 2026',
    type: 'Features',
    title: 'Suggestion auto-apply for WordPress',
    body: 'Approve a schema or content fix in the Clovion dashboard and it lands as a draft post (or page update) in your connected WordPress site. The connector preserves your editor of choice — Gutenberg, Classic, or Elementor — and never publishes without a human approval step.',
    contributors: ['AN', 'KT'],
    mock: 'auto-apply',
    stat: { label: 'Average time to ship a fix', value: '11 days → 2 days' },
    learnMore: '/docs/cms'
  },
  {
    id: 'claude-3-7',
    date: '2026-10-23',
    dateLabel: 'OCT 23, 2026',
    type: 'Features',
    title: 'Claude 3.7 added to the engine grid',
    body: 'Tracked separately from Claude 3.5 so you can watch the migration as it happens. Both versions are scored on the same prompt set with identical sentiment models; the comparison view in your dashboard now defaults to showing them side by side.',
    contributors: ['JL'],
    mock: 'engine-grid',
    learnMore: '/docs/per-engine'
  },
  {
    id: 'bulk-import',
    date: '2026-10-16',
    dateLabel: 'OCT 16, 2026',
    type: 'Features',
    title: 'Bulk prompt import (CSV)',
    body: 'Drop a CSV with up to 5,000 prompts and Clovion handles deduping, locale detection, and intent classification automatically. Useful if you have years of search query logs you want to graduate from keyword research to prompt research.',
    contributors: ['SR', 'MP'],
    mock: 'csv',
    stat: { label: 'Largest import processed', value: '4,812 prompts in 38s' },
    learnMore: '/docs/prompts'
  },
  {
    id: 'oct-9-cleanup',
    date: '2026-10-09',
    dateLabel: 'OCT 9, 2026',
    type: 'Fixes',
    title: 'Improvements & fixes',
    body: 'A maintenance week focused on the dashboard and the suggestion queue. Nothing flashy, but enough quality-of-life polish that the team felt it deserved its own entry rather than burying it inside the next release.',
    contributors: ['KT', 'AN', 'JL'],
    improvements: [
      'Prompt list now remembers scroll position when you navigate into a detail page and back.',
      'Suggestion queue badge updates without a full page refresh.',
      'CSV export of citations now includes the engine name as a column.'
    ],
    fixes: [
      'Fixed an off-by-one in the 30-day rolling average chart.',
      'Schema diff viewer no longer collapses code blocks longer than 200 lines.',
      'Resolved a redirect loop when signing in with Google from a fresh incognito session.',
      'Slack alerts respect the workspace timezone instead of UTC.'
    ]
  },
  {
    id: 'mcp-beta',
    date: '2026-10-02',
    dateLabel: 'OCT 2, 2026',
    type: 'Integrations',
    title: 'MCP support, public beta',
    body: 'The Clovion AI MCP server is public beta. Point Claude or ChatGPT at your workspace and they can query your visibility data, pull the suggestion queue, and ship approved fixes — all from inside the assistant you already use. Authentication uses scoped API tokens and respects the same RBAC as the dashboard.',
    contributors: ['MP', 'AN', 'JL', 'SR'],
    mock: 'mcp',
    stat: { label: 'Tools exposed', value: '14 read · 4 write' },
    improvements: [
      'Token scopes can be limited to a single workspace or a single prompt set.',
      'Rate limits are per-token, not per-user, so personal and shared tokens coexist cleanly.'
    ],
    learnMore: '/docs/mcp'
  },
  {
    id: 'citation-weighting',
    date: '2026-09-24',
    dateLabel: 'SEP 24, 2026',
    type: 'Research',
    title: 'New citation weighting model',
    body: 'A citation in the first sentence of a Perplexity answer is worth more than a citation in the footnote list. Our previous model treated them equally; the new one weights position, paraphrase depth, and answer prominence. Existing scores have been recomputed and historical charts updated.',
    contributors: ['SR'],
    mock: 'citation',
    stat: { label: 'Score variance reduction', value: '-18% week-over-week' },
    learnMore: '/blog/citation-weighting-2026'
  },
  {
    id: 'soc-2-type-ii',
    date: '2026-09-17',
    dateLabel: 'SEP 17, 2026',
    type: 'Security',
    title: 'SOC 2 Type II completed',
    body: 'Our Type II audit covering October 2025 through September 2026 wrapped with zero exceptions. The report is available under NDA from the Trust Center; ISO 27001 is mid-audit and tracking for Q1 2027. Nothing in the product changes — this is paperwork that lets larger buyers move faster.',
    contributors: ['KT'],
    mock: 'soc2',
    learnMore: '/docs/trust'
  },
  {
    id: 'sep-10-cleanup',
    date: '2026-09-10',
    dateLabel: 'SEP 10, 2026',
    type: 'Fixes',
    title: 'Improvements & fixes',
    body: 'Mid-month polish before the bigger MCP work landed. Mostly papercuts surfaced by the customer team — the kind of thing one person hits once and never reports, but seven people hit and quietly route around.',
    contributors: ['AN', 'JL'],
    improvements: [
      'Workspace switcher remembers the last visited tab per workspace.',
      'Onboarding wizard skips the engine picker for users on the free tier.',
      'Empty-state copy on the prompt page reads less like an error.'
    ],
    fixes: [
      'Avatar uploads larger than 4MB now downscale client-side instead of failing silently.',
      'Markdown export preserves nested lists.',
      'Date pickers respect Monday-as-first-day in European locales.'
    ]
  },
  {
    id: 'webhooks',
    date: '2026-09-01',
    dateLabel: 'SEP 1, 2026',
    type: 'Features',
    title: 'Webhooks for suggestions',
    body: 'A new endpoint fires when a suggestion is created, approved, shipped, or measured. Wire it to your build system, CMS, or Slack and the loop closes without anyone tabbing into the dashboard. Signatures are HMAC-SHA256 and replay-safe with a 5-minute window.',
    contributors: ['MP', 'SR'],
    mock: 'webhook',
    stat: { label: 'Event types', value: '7 · created, approved, shipped, measured, dismissed, edited, expired' },
    learnMore: '/docs/webhooks'
  }
]

const categories: { label: string; type?: EntryType }[] = [
  { label: 'All' },
  { label: 'Features', type: 'Features' },
  { label: 'Fixes', type: 'Fixes' },
  { label: 'Research', type: 'Research' },
  { label: 'Performance', type: 'Performance' },
  { label: 'Integrations', type: 'Integrations' },
  { label: 'Security', type: 'Security' }
]

function Avatar({ initials }: { initials: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-ink text-white text-[10px] font-semibold tracking-tight ring-2 ring-bg"
      aria-label={`Contributor ${initials}`}
    >
      {initials}
    </span>
  )
}

function ContributorRow({ initials }: { initials: string[] }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-1.5">
        {initials.map((i) => (
          <Avatar key={i} initials={i} />
        ))}
      </div>
      <span className="text-xs text-ink/50 font-mono uppercase tracking-wider">
        {initials.length} {initials.length === 1 ? 'contributor' : 'contributors'}
      </span>
    </div>
  )
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="my-6 border border-line bg-subtle/60 rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] divide-y sm:divide-y-0 sm:divide-x divide-line">
        <div className="px-4 py-3 text-[11px] uppercase tracking-wider text-ink/50 font-mono">
          {label}
        </div>
        <div className="px-4 py-3 font-mono text-sm text-ink">{value}</div>
      </div>
    </div>
  )
}

// Typographic mock hero — no images, no color, just type and structure.
function Mock({ kind }: { kind: NonNullable<ChangelogEntry['mock']> }) {
  const base =
    'mb-7 relative overflow-hidden rounded-xl border border-line bg-white shadow-[0_1px_0_rgba(0,0,0,0.03),0_18px_36px_-22px_rgba(0,0,0,0.18)]'

  if (kind === 'daily-refresh') {
    const bars = [38, 52, 41, 67, 49, 73, 81]
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    return (
      <div className={base}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-line">
          <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider">Refresh status</span>
          <span className="font-mono text-[11px] text-ink flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ink inline-block" /> Live · every 24h
          </span>
        </div>
        <div className="px-5 py-6">
          <div className="flex items-end gap-2 h-24 mb-3">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div
                  className="w-full bg-ink rounded-sm"
                  style={{ height: `${h}%` }}
                />
                <span className="font-mono text-[10px] text-ink/40">{days[i]}</span>
              </div>
            ))}
          </div>
          <div className="font-mono text-xs text-ink/60 flex justify-between border-t border-line pt-3">
            <span>Citations / week</span>
            <span className="text-ink">+24%</span>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'auto-apply') {
    return (
      <div className={base}>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-line">
          <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider">WordPress draft</span>
          <span className="ml-auto font-mono text-[10px] px-2 py-0.5 rounded bg-ink/5 text-ink/70">/wp-admin</span>
        </div>
        <div className="px-5 py-5 space-y-3">
          <div className="font-mono text-[11px] text-ink/40 uppercase tracking-wider">Suggested edit · schema</div>
          <div className="bg-subtle border border-line rounded-md p-3 font-mono text-xs leading-relaxed text-ink/80">
            <div className="text-ink/40 mb-1">@@ -12,4 +12,8 @@</div>
            <div><span className="text-ink/40">  </span>{'"@context":'} <span>{'"https://schema.org"'}</span>,</div>
            <div><span className="text-ink/40">  </span>{'"@type":'} <span>{'"Article"'}</span>,</div>
            <div className="bg-ink/5 -mx-3 px-3"><span className="text-ink mr-1">+</span>{'"author":'} {'{ "@type": "Person", "name": "..." }'},</div>
            <div className="bg-ink/5 -mx-3 px-3"><span className="text-ink mr-1">+</span>{'"datePublished":'} <span>{'"2026-10-30"'}</span></div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="font-mono text-[11px] text-ink/50">Status: draft · awaiting approval</span>
            <span className="font-mono text-[11px] text-ink">Approve →</span>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'engine-grid') {
    const engines = ['ChatGPT', 'Claude 3.7', 'Claude 3.5', 'Gemini', 'Perplexity', 'DeepSeek', 'AI Mode', 'AI Overviews', 'Mistral', 'Grok']
    return (
      <div className={base}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-line">
          <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider">Engine coverage</span>
          <span className="font-mono text-[11px] text-ink">10 of 10</span>
        </div>
        <div className="px-5 py-5 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {engines.map((e) => (
            <div
              key={e}
              className="border border-line rounded px-2 py-2 text-center font-mono text-[10px] text-ink/80 truncate"
            >
              {e}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (kind === 'csv') {
    return (
      <div className={base}>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-line">
          <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider">prompts_import.csv</span>
          <span className="ml-auto font-mono text-[10px] text-ink/60">4,812 rows</span>
        </div>
        <div className="font-mono text-xs">
          <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.8fr] px-5 py-2 border-b border-line text-ink/50 uppercase text-[10px] tracking-wider bg-subtle/60">
            <span>prompt</span>
            <span>locale</span>
            <span>intent</span>
            <span>cluster</span>
          </div>
          {[
            ['best AI visibility tracker 2026', 'en-US', 'compare', 'core'],
            ['how to optimize for ChatGPT citations', 'en-US', 'how-to', 'GEO'],
            ['Clovion vs Profound', 'en-US', 'compare', 'brand'],
            ['schema markup for AI search', 'en-GB', 'how-to', 'GEO']
          ].map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.8fr] px-5 py-2 border-b border-line/60 last:border-0 text-ink/80"
            >
              <span className="truncate">{r[0]}</span>
              <span className="text-ink/50">{r[1]}</span>
              <span className="text-ink/50">{r[2]}</span>
              <span className="text-ink/50">{r[3]}</span>
            </div>
          ))}
          <div className="px-5 py-2 text-ink/40 text-[11px]">+ 4,808 more</div>
        </div>
      </div>
    )
  }

  if (kind === 'mcp') {
    return (
      <div className={base}>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-line">
          <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider">claude.ai · MCP client</span>
          <span className="ml-auto font-mono text-[10px] text-ink/60">clovion.mcp.run</span>
        </div>
        <div className="p-5 space-y-3 font-mono text-xs">
          <div className="text-ink/60">$ list_prompts --workspace acme --status declining</div>
          <div className="bg-subtle border border-line rounded p-3 text-ink/80 leading-relaxed">
            <div className="text-ink/40 mb-1.5">Returned 12 prompts:</div>
            <div>1. "best email marketing platform" — share -8%</div>
            <div>2. "alternatives to Mailchimp" — share -6%</div>
            <div>3. "ESP for small business" — share -5%</div>
            <div className="text-ink/40 mt-1">…</div>
          </div>
          <div className="flex items-center gap-2 text-ink/60">
            <span className="w-1.5 h-1.5 rounded-full bg-ink inline-block" />
            <span>14 tools available · 4 require write scope</span>
          </div>
        </div>
      </div>
    )
  }

  if (kind === 'webhook') {
    return (
      <div className={base}>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-line">
          <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider">POST /hooks/clovion</span>
          <span className="ml-auto font-mono text-[10px] px-1.5 py-0.5 rounded bg-ink text-white">200 OK</span>
        </div>
        <div className="p-5 font-mono text-xs leading-relaxed text-ink/80 bg-subtle/40">
          <div className="text-ink/40">{'// suggestion.shipped'}</div>
          <div>{'{'}</div>
          <div className="pl-3">{'"event":'} <span className="text-ink">"suggestion.shipped"</span>,</div>
          <div className="pl-3">{'"id":'} <span className="text-ink">"sg_8aFv3kR2"</span>,</div>
          <div className="pl-3">{'"prompt":'} <span className="text-ink">"best ESP 2026"</span>,</div>
          <div className="pl-3">{'"engines":'} <span className="text-ink">["ChatGPT", "Perplexity"]</span>,</div>
          <div className="pl-3">{'"shippedAt":'} <span className="text-ink">"2026-09-01T14:22:08Z"</span></div>
          <div>{'}'}</div>
        </div>
      </div>
    )
  }

  if (kind === 'citation') {
    return (
      <div className={base}>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-line">
          <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider">Citation weighting · model v3</span>
        </div>
        <div className="p-5 space-y-2.5 font-mono text-xs">
          {[
            { label: 'Sentence 1 · paraphrased', weight: 1.0 },
            { label: 'Sentence 2-3 · paraphrased', weight: 0.7 },
            { label: 'Footnote list · linked', weight: 0.35 },
            { label: 'Source dropdown only', weight: 0.15 }
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-3">
              <span className="text-ink/70 w-56 truncate">{row.label}</span>
              <div className="flex-1 h-1.5 bg-ink/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-ink rounded-full"
                  style={{ width: `${row.weight * 100}%` }}
                />
              </div>
              <span className="text-ink w-12 text-right">{row.weight.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (kind === 'soc2') {
    return (
      <div className={base}>
        <div className="flex items-center gap-2 px-5 py-3 border-b border-line">
          <span className="font-mono text-[11px] text-ink/50 uppercase tracking-wider">SOC 2 · Type II · Report</span>
          <span className="ml-auto font-mono text-[10px] text-ink">Oct 2025 – Sep 2026</span>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
          {['Security', 'Availability', 'Confidentiality', 'Processing'].map((c) => (
            <div
              key={c}
              className="border border-line rounded-md px-3 py-3 flex flex-col gap-2"
            >
              <span className="text-ink/50 uppercase tracking-wider text-[10px]">{c}</span>
              <span className="text-ink text-base">0 exceptions</span>
              <span className="text-ink/40 text-[10px]">✓ tested</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

function EntryBlock({ entry }: { entry: ChangelogEntry }) {
  return (
    <article id={entry.id} className="relative scroll-mt-28">
      {/* Date header — sticky within the entry */}
      <div className="sticky top-20 z-10 -mx-4 px-4 py-3 bg-bg/85 backdrop-blur-md flex items-center justify-between border-b border-line/60 mb-7">
        <div className="font-mono text-xs uppercase tracking-wider text-ink/60">{entry.dateLabel}</div>
        <Tag>{entry.type}</Tag>
      </div>

      <div className="space-y-1 mb-6">
        <h2 className="display-md text-ink group flex items-start gap-3">
          <Link
            href={`#${entry.id}`}
            className="font-mono text-ink/20 hover:text-ink/60 text-base mt-3 transition opacity-0 group-hover:opacity-100"
            aria-label={`Anchor link to ${entry.title}`}
          >
            #
          </Link>
          <span className="flex-1">{entry.title}</span>
        </h2>
      </div>

      {entry.mock && <Mock kind={entry.mock} />}

      <p className="lead text-ink/70 mb-6">{entry.body}</p>

      {entry.stat && <StatBlock label={entry.stat.label} value={entry.stat.value} />}

      {entry.improvements && entry.improvements.length > 0 && (
        <div className="mb-6">
          <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink/50 mb-3">
            Improvements
          </h3>
          <ul className="space-y-2.5">
            {entry.improvements.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink/80 leading-relaxed">
                <Check className="w-4 h-4 mt-1 text-ink/60 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {entry.fixes && entry.fixes.length > 0 && (
        <div className="mb-6">
          <h3 className="font-mono text-[11px] uppercase tracking-wider text-ink/50 mb-3">Fixes</h3>
          <ul className="space-y-2.5">
            {entry.fixes.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink/80 leading-relaxed">
                <span className="font-mono text-ink/40 mt-0.5 select-none">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t border-line">
        <ContributorRow initials={entry.contributors} />
        {entry.learnMore && (
          <Link
            href={entry.learnMore}
            className="inline-flex items-center gap-1.5 text-sm text-ink hover:text-ink/70 font-semibold transition"
          >
            Learn more <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </article>
  )
}

export default function ChangelogPage() {
  return (
    <>
      {/* Hero band — compact, with inline subscribe */}
      <Section tight className="relative overflow-hidden border-b border-line">
        <HeroShade />
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Changelog</Eyebrow>
            <h1 className="display-md text-ink mt-4 mb-5">Every change, dated.</h1>
            <p className="lead text-ink/70 mb-7 max-w-2xl">
              Real changes, weekly, with the data they affected. Subscribe to get them in your inbox.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-2 max-w-md"
              action="#"
              method="post"
              aria-label="Subscribe to the changelog"
            >
              <label htmlFor="changelog-email" className="sr-only">
                Email address
              </label>
              <input
                id="changelog-email"
                type="email"
                required
                placeholder="you@company.com"
                className="flex-1 px-4 py-2.5 rounded-md border border-line bg-white text-ink text-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/15 focus:border-ink/40 transition"
              />
              <Button type="submit" size="md">
                Subscribe
              </Button>
            </form>
            <div className="mt-3 font-mono text-[11px] uppercase tracking-wider text-ink/40">
              Weekly · no spam · unsubscribe with one click
            </div>
          </div>
        </Container>
      </Section>

      {/* Feed with sticky category sidebar */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,720px)_1fr] gap-10 lg:gap-14">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink/40 mb-4 px-3">
                  Filter
                </div>
                <nav className="flex flex-col gap-0.5" aria-label="Category filter">
                  {categories.map((c, i) => (
                    <a
                      key={c.label}
                      href={c.type ? `#type-${c.type.toLowerCase()}` : '#top'}
                      className={
                        i === 0
                          ? 'font-mono text-xs uppercase tracking-wider text-ink py-2 px-3 border-l-2 border-ink bg-ink/[0.03]'
                          : 'font-mono text-xs uppercase tracking-wider text-ink/50 hover:text-ink py-2 px-3 border-l-2 border-transparent hover:border-ink/30 transition'
                      }
                    >
                      {c.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 px-3 border-t border-line pt-6">
                  <div className="font-mono text-[11px] uppercase tracking-wider text-ink/40 mb-3">
                    Releases
                  </div>
                  <div className="font-mono text-xs text-ink/70 space-y-1.5">
                    <div>2026 · {entries.length} ship days</div>
                    <div>2025 · 48 ship days</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile category bar */}
            <div className="lg:hidden -mx-4 px-4 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {categories.map((c, i) => (
                  <a
                    key={c.label}
                    href={c.type ? `#type-${c.type.toLowerCase()}` : '#top'}
                    className={
                      i === 0
                        ? 'shrink-0 font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-ink text-white'
                        : 'shrink-0 font-mono text-[11px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-ink/[0.05] text-ink/70'
                    }
                  >
                    {c.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Entries column */}
            <div id="top" className="min-w-0">
              <div className="space-y-20">
                {entries.map((entry, idx) => (
                  <div key={entry.id}>
                    <EntryBlock entry={entry} />
                    {idx < entries.length - 1 && (
                      <div className="mt-20 flex items-center gap-4" aria-hidden>
                        <div className="h-px flex-1 bg-line" />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ink/30">
                          ·
                        </span>
                        <div className="h-px flex-1 bg-line" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* End marker */}
              <div className="mt-20 pt-10 border-t border-line">
                <div className="font-mono text-xs uppercase tracking-wider text-ink/40 mb-3">
                  End of feed
                </div>
                <p className="text-sm text-ink/60 max-w-md">
                  Older releases live in the API archive. Subscribers get the next entry the moment it ships.
                </p>
              </div>
            </div>

            {/* Right rail spacer (kept empty for breathing room on wide displays) */}
            <div className="hidden lg:block" />
          </div>
        </Container>
      </Section>

      {/* Subscribe band */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <Eyebrow>Subscribe</Eyebrow>
            <h2 className="display-md text-ink mt-4 mb-4">The weekly Clovion digest.</h2>
            <p className="lead text-ink/70 mb-7">
              One email, every Friday. Just what shipped, what we learned, and the one chart from the data team we couldn't stop talking about.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
              action="#"
              method="post"
              aria-label="Subscribe to the weekly digest"
            >
              <label htmlFor="digest-email" className="sr-only">
                Email address
              </label>
              <input
                id="digest-email"
                type="email"
                required
                placeholder="you@company.com"
                className="flex-1 px-4 py-2.5 rounded-md border border-line bg-white text-ink text-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/15 focus:border-ink/40 transition"
              />
              <Button type="submit" size="md">
                Subscribe
              </Button>
            </form>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-ink/40">
              <span>2,400+ subscribers</span>
              <span>·</span>
              <span>Avg read time: 4 min</span>
              <span>·</span>
              <span>One click unsubscribe</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA banner — thin, ink */}
      <Section tight bg="ink">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="display-sm text-white mb-2">Build with Clovion.</h3>
              <p className="text-white/70 text-base">
                See releases land in your stack via webhook, MCP, or the REST API.
              </p>
            </div>
            <Button href="/docs" variant="invert" size="lg">
              Read API docs <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

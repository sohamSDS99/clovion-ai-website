import Link from 'next/link'
import {
  Section,
  Container,
  Button,
  Eyebrow,
  Tag,
  ArrowRight,
  Check,
  HeroShade
} from '@/components/ui'
import { FAQ, CTABanner, AIEngineStrip } from '@/components/sections'
import { SpotlightCard } from '@/components/SpotlightCard'
import { faqs, customerOutcomes } from '@/lib/content'

export const metadata = {
  title: 'AI Visibility Tracking | Clovion AI',
  description:
    'Track how ChatGPT, Claude, Gemini, Perplexity, and six other AI engines describe your brand. Daily refresh, real consumer prompts, sentiment, citations.'
}

// ---------------------------------------------------------------------------
// Local data — capability deep dives
// ---------------------------------------------------------------------------

const capabilities = [
  {
    n: '01',
    slug: 'multi-engine',
    short: 'Multi-engine tracking',
    title: 'Ten engines watched the way buyers actually use them.'
  },
  {
    n: '02',
    slug: 'sentiment',
    short: 'Sentiment intelligence',
    title: 'How each model characterizes you, and why.'
  },
  {
    n: '03',
    slug: 'citations',
    short: 'Citation analysis',
    title: 'The exact sources AI engines reach for when they answer about you.'
  },
  {
    n: '04',
    slug: 'refresh',
    short: 'Daily refresh',
    title: 'A 1.8B prompt dataset, refreshed every twenty-four hours.'
  }
]

// Engines for the hero mock — Clovion rank + sentiment per engine
const heroEngines = [
  { engine: 'ChatGPT', present: true, rank: 1, sentiment: 0.92 },
  { engine: 'Claude', present: true, rank: 1, sentiment: 0.88 },
  { engine: 'Perplexity', present: true, rank: 2, sentiment: 0.81 },
  { engine: 'Gemini', present: true, rank: 1, sentiment: 0.84 },
  { engine: 'Copilot', present: true, rank: 3, sentiment: 0.74 },
  { engine: 'AI Overviews', present: true, rank: 2, sentiment: 0.77 },
  { engine: 'AI Mode', present: true, rank: 2, sentiment: 0.79 },
  { engine: 'Grok', present: false, rank: null, sentiment: 0.42 },
  { engine: 'Meta AI', present: true, rank: 4, sentiment: 0.66 },
  { engine: 'DeepSeek', present: true, rank: 3, sentiment: 0.71 }
]

// Citation panel mock
const citations = [
  { domain: 'docs.clovion.ai', path: '/quickstart', count: 412 },
  { domain: 'g2.com', path: '/products/clovion-ai/reviews', count: 287 },
  { domain: 'producthunt.com', path: '/posts/clovion-ai', count: 196 },
  { domain: 'reddit.com', path: '/r/saas/clovion-vs-profound', count: 144 },
  { domain: 'wired.com', path: '/story/generative-engine-optimization', count: 121 }
]

// Sentiment timeline mock (weeks 1..18)
const sentimentBars = [
  62, 64, 61, 65, 68, 70, 72, 71, 74, 76, 75, 78, 80, 82, 81, 83, 85, 86
]

const trackingFaqs = faqs.filter((f) =>
  ['Which AI engines', 'collect the data', 'fast can I see', 'free score actually', 'How is Clovion AI different from a'].some(
    (m) => f.q.includes(m)
  )
).slice(0, 5)

const fallbackFaqs = trackingFaqs.length >= 4 ? trackingFaqs : faqs.slice(0, 5)

// Helper — tiny SVG bar
function Bar({ pct }: { pct: number }) {
  return (
    <span className="inline-block h-1 bg-ink/15 rounded-full overflow-hidden align-middle" style={{ width: '64px' }}>
      <span className="block h-full bg-ink" style={{ width: `${pct}%` }} />
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AIVisibilityTrackingPage() {
  return (
    <main>
      {/* ───────────────────── HERO ───────────────────── */}
      <Section className="section-y-xl relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
        <HeroShade />
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.05fr] gap-14 lg:gap-20 items-center">
            {/* Left */}
            <div>
              <Eyebrow>01 — Tracking</Eyebrow>
              <h1 className="display-lg mt-6 text-balance">
                See every AI mention.
              </h1>
              <p className="lead mt-7 max-w-xl text-balance">
                Multi-engine visibility, refreshed daily, built on real consumer prompts — not synthetic API calls. The dataset other GEO tools wish they had.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/pricing" trackLocation="ai_visibility_hero" size="lg">
                  Start free trial <ArrowRight />
                </Button>
                <Button href="/free-ai-visibility-score" trackLocation="ai_visibility_hero" variant="secondary" size="lg">
                  Get free score
                </Button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-[0.85rem] text-ink-60">
                <span className="inline-flex items-center gap-1.5"><Check className="text-ink" /> No card required</span>
                <span className="inline-flex items-center gap-1.5"><Check className="text-ink" /> First score in 24h</span>
                <span className="inline-flex items-center gap-1.5"><Check className="text-ink" /> 10 engines</span>
              </div>
            </div>

            {/* Right — hero product mock */}
            <div className="relative">
              <SpotlightCard className="bg-white p-6 md:p-7 ring-1 ring-line/80">
                <div className="flex items-center justify-between text-[0.78rem] text-ink-60">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-ink" />
                    Tracking
                  </span>
                  <span className="font-mono text-[0.72rem] tracking-wide text-ink-40">v 2.14 · today 04:12 UTC</span>
                </div>

                <div className="mt-5 rounded-card border border-line bg-subtle/60 px-4 py-3">
                  <div className="text-[0.7rem] uppercase tracking-[0.12em] text-ink-40">Prompt</div>
                  <div className="font-mono text-[0.92rem] text-ink mt-1">&ldquo;Best AI visibility platform&rdquo;</div>
                </div>

                <ul className="mt-5 divide-y divide-line text-[0.82rem]">
                  {heroEngines.map((row) => (
                    <li key={row.engine} className="flex items-center gap-3 py-2.5">
                      <span
                        aria-hidden
                        className={
                          row.present
                            ? 'h-2 w-2 rounded-full bg-ink shrink-0'
                            : 'h-2 w-2 rounded-full border border-ink/30 shrink-0'
                        }
                      />
                      <span className="font-mono text-ink w-[110px] truncate">{row.engine}</span>
                      <span className="text-ink-60 w-[58px] text-[0.78rem]">
                        {row.present ? (
                          <>rank <span className="text-ink font-semibold">{row.rank}</span></>
                        ) : (
                          <span className="text-ink-40">absent</span>
                        )}
                      </span>
                      <Bar pct={Math.round(row.sentiment * 100)} />
                      <span className="ml-auto font-mono text-[0.78rem] text-ink-70">
                        {row.sentiment.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-card bg-subtle/70 px-3 py-2.5">
                    <div className="font-mono text-[0.72rem] uppercase tracking-wider text-ink-40">Engines</div>
                    <div className="font-display text-[1.1rem] mt-1">9 / 10</div>
                  </div>
                  <div className="rounded-card bg-subtle/70 px-3 py-2.5">
                    <div className="font-mono text-[0.72rem] uppercase tracking-wider text-ink-40">SoV</div>
                    <div className="font-display text-[1.1rem] mt-1">38.4%</div>
                  </div>
                  <div className="rounded-card bg-subtle/70 px-3 py-2.5">
                    <div className="font-mono text-[0.72rem] uppercase tracking-wider text-ink-40">Δ 7d</div>
                    <div className="font-display text-[1.1rem] mt-1">+4.1</div>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </Container>
      </Section>

      {/* ───────────────────── CAPABILITY NAV ───────────────────── */}
      <Section className="border-t border-line">
        <Container>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-8">
            {capabilities.map((c) => (
              <Link
                key={c.slug}
                href={`#${c.slug}`}
                className="group block border-t border-ink/15 pt-5 hover:border-ink transition-colors"
              >
                <div className="font-mono text-[0.78rem] tracking-wider text-ink-60">{c.n}.</div>
                <div className="font-display text-[1.05rem] tracking-[-0.02em] mt-2 leading-snug">{c.short}</div>
                <div className="mt-3 inline-flex items-center gap-1.5 text-[0.8rem] text-ink-60 group-hover:text-ink">
                  Jump <ArrowRight />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───────────────────── CAPABILITY 01 — MULTI-ENGINE ───────────────────── */}
      <Section id="multi-engine" className="border-t border-line">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <div className="font-mono text-[0.78rem] tracking-wider text-ink-60">01 — Multi-engine</div>
              <h2 className="display-md mt-3 text-balance">
                Ten engines watched the way buyers actually use them.
              </h2>
              <div className="mt-6 space-y-5 text-[1rem] leading-relaxed text-ink-70 max-w-xl">
                <p>
                  Most tools watch one or two surfaces. Clovion follows every place an AI answer can land — ChatGPT, Claude, Perplexity, Gemini, Copilot, Grok, Meta AI, DeepSeek, and Google&rsquo;s two new surfaces tracked apart from each other.
                </p>
                <p>
                  Engines are run with browsing on and off, with and without web search, signed in and out — because that&rsquo;s the matrix a buyer touches. Same prompt, every surface, side by side.
                </p>
                <p>
                  When a new engine ships publicly, it lands in your dashboard within thirty days. No upgrade, no extra line item, no waiting for a roadmap.
                </p>
              </div>
              <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {[
                  '10 live engines, refreshed daily',
                  'AI Overviews and AI Mode tracked apart',
                  'Browsing on and off variants',
                  'New surfaces inside 30 days of launch'
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[0.92rem] text-ink-80">
                    <Check className="text-ink mt-1 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Engine grid mock */}
            <SpotlightCard className="bg-white p-6 md:p-7 ring-1 ring-line/80">
              <div className="flex items-center justify-between text-[0.78rem]">
                <span className="font-mono text-ink-60">engines / live · 10</span>
                <span className="font-mono text-ink-40">{`{ refresh: "24h" }`}</span>
              </div>
              <ul className="mt-4 grid grid-cols-2 gap-px bg-line border border-line rounded-card overflow-hidden">
                {heroEngines.map((row) => (
                  <li key={row.engine} className="bg-white p-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          row.present
                            ? 'h-1.5 w-1.5 rounded-full bg-ink'
                            : 'h-1.5 w-1.5 rounded-full border border-ink/30'
                        }
                      />
                      <span className="font-mono text-[0.82rem] text-ink">{row.engine}</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-[1.4rem] tracking-[-0.02em] text-ink">
                        {row.present ? `#${row.rank}` : '—'}
                      </span>
                      <span className="font-mono text-[0.72rem] text-ink-50">
                        s {row.sentiment.toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-[0.78rem] text-ink-60 flex items-center justify-between">
                <span>Same prompt set across all 10</span>
                <span className="font-mono text-ink-40">build · 04:12 UTC</span>
              </div>
            </SpotlightCard>
          </div>
        </Container>
      </Section>

      {/* ───────────────────── CAPABILITY 02 — SENTIMENT ───────────────────── */}
      <Section id="sentiment" bg="subtle">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Sentiment timeline mock */}
            <SpotlightCard className="order-2 lg:order-1 bg-white p-6 md:p-7 ring-1 ring-line/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-40">Sentiment trend</div>
                  <div className="font-display text-[1rem] mt-1">Claude · &ldquo;Clovion AI&rdquo; · 18 weeks</div>
                </div>
                <Tag>+24 pts</Tag>
              </div>

              <div className="mt-6 h-44 flex items-end gap-1.5">
                {sentimentBars.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-stretch gap-px">
                    <div className="flex-1 bg-ink/5 rounded-t-sm" />
                    <div className="bg-ink rounded-b-sm" style={{ height: `${v}%` }} />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-[0.72rem] font-mono text-ink-50">
                <span>W1</span>
                <span>W6</span>
                <span>W12</span>
                <span>W18</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-card bg-subtle/70 px-3 py-2.5 border border-line">
                  <div className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-40">Positive</div>
                  <div className="font-display text-[1.05rem] mt-1 text-ink">86%</div>
                </div>
                <div className="rounded-card bg-subtle/70 px-3 py-2.5 border border-line">
                  <div className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-40">Neutral</div>
                  <div className="font-display text-[1.05rem] mt-1 text-ink-70">11%</div>
                </div>
                <div className="rounded-card bg-subtle/70 px-3 py-2.5 border border-line">
                  <div className="font-mono text-[0.7rem] uppercase tracking-wider text-ink-40">Negative</div>
                  <div className="font-display text-[1.05rem] mt-1 text-ink-40">3%</div>
                </div>
              </div>
            </SpotlightCard>

            <div className="order-1 lg:order-2">
              <div className="font-mono text-[0.78rem] tracking-wider text-ink-60">02 — Sentiment</div>
              <h2 className="display-md mt-3 text-balance">
                How each model characterizes you, and why.
              </h2>
              <div className="mt-6 space-y-5 text-[1rem] leading-relaxed text-ink-70 max-w-xl">
                <p>
                  A score in isolation is a wall poster. Clovion reads every answer the engines give about your brand, classifies the tone, and ties each shift back to the underlying conversation and source.
                </p>
                <p>
                  Engines disagree more than people expect. Claude can be warm while Perplexity stays cool on the same brand. The dashboard surfaces those splits so you know which surface to work on.
                </p>
                <p>
                  Trend lines are weekly, with annotations on the moments that moved the line — a product launch, a piece of press, a fix you shipped. Cause and effect, not vibes.
                </p>
              </div>
              <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {[
                  'Per-engine sentiment, not blended',
                  'Per-prompt conversation pull',
                  'Weekly trend with annotations',
                  'Tied back to specific sources'
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[0.92rem] text-ink-80">
                    <Check className="text-ink mt-1 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* ───────────────────── CAPABILITY 03 — CITATIONS ───────────────────── */}
      <Section id="citations" className="border-t border-line">
        <Container>
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <div className="font-mono text-[0.78rem] tracking-wider text-ink-60">03 — Citations</div>
              <h2 className="display-md mt-3 text-balance">
                The exact sources AI engines reach for when they answer about you.
              </h2>
              <div className="mt-6 space-y-5 text-[1rem] leading-relaxed text-ink-70 max-w-xl">
                <p>
                  We log every cited URL on every answer, by engine and by prompt. You see the canonical sources that move citations, the ones decaying, and the third-party pages you do not yet own a foothold on.
                </p>
                <p>
                  Quotes are pulled verbatim. You can read the exact passage an engine pulled from a page — the framing, the tone, the surrounding context — and decide whether that framing is the one you want propagated.
                </p>
                <p>
                  Pair this with the citation path recommendations and you have the full picture: which sources matter, where you&rsquo;re missing, and the order to fix them in.
                </p>
              </div>
              <ul className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                {[
                  'Cited URLs logged per answer',
                  'Verbatim quote extraction',
                  'Per-engine source attribution',
                  'Gap analysis vs competitors'
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[0.92rem] text-ink-80">
                    <Check className="text-ink mt-1 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Citation panel */}
            <SpotlightCard className="bg-white p-6 md:p-7 ring-1 ring-line/80">
              <div className="flex items-center justify-between text-[0.78rem] text-ink-60">
                <span className="font-mono">cited / 30d · top 5</span>
                <span className="font-mono text-ink-40">Perplexity</span>
              </div>

              <ul className="mt-5 divide-y divide-line">
                {citations.map((c) => (
                  <li key={c.domain} className="flex items-center gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[0.82rem] text-ink truncate">
                        {c.domain}<span className="text-ink-50">{c.path}</span>
                      </div>
                      <div className="mt-1 text-[0.74rem] text-ink-50">{c.count} citations · last cited 2h ago</div>
                    </div>
                    <span className="font-display text-[1.05rem] tracking-[-0.02em] text-ink-70">{c.count}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-card border border-line bg-subtle/60 px-4 py-4">
                <div className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-40">Extracted passage</div>
                <p className="mt-2 font-serif italic text-[0.95rem] leading-relaxed text-ink-80">
                  &ldquo;Clovion AI is the platform we recommend for marketing teams who want a real number on AI visibility — they track ten engines and refresh daily.&rdquo;
                </p>
                <div className="mt-3 text-[0.74rem] text-ink-50 font-mono">— g2.com/products/clovion-ai/reviews</div>
              </div>
            </SpotlightCard>
          </div>
        </Container>
      </Section>

      {/* ───────────────────── CAPABILITY 04 — REFRESH ───────────────────── */}
      <Section id="refresh" bg="ink" className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '22px 22px'
          }}
        />
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-end">
            <div>
              <div className="font-mono text-[0.78rem] tracking-wider text-white/60">04 — Refresh & dataset</div>
              <h2 className="display-md mt-3 text-balance text-white">
                1.8B real prompts. Refreshed daily.
              </h2>
              <div className="mt-6 space-y-5 text-[1rem] leading-relaxed text-white/70 max-w-xl">
                <p>
                  Synthetic queries miss the actual mess of how people ask AI for things. We run on a panel of opt-in consumers and rotated keys across geographies — the prompts you see are the prompts buyers wrote, not the prompts a clean-room test imagined.
                </p>
                <p>
                  The pipeline rebuilds every twenty-four hours. New prompts in, results re-run, scores recalculated. Weekly batches are someone else&rsquo;s product.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/pricing" trackLocation="ai_visibility_final_cta" variant="invert" size="lg">
                  Start free trial <ArrowRight />
                </Button>
                <Link
                  href="/free-ai-visibility-score"
                  className="btn h-12 px-6 text-base text-white border border-white/15 hover:bg-white/5"
                >
                  Get free score
                </Link>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-[0.78rem] uppercase tracking-[0.14em] text-white/40">Live prompt count</div>
              <div
                className="font-mono text-white tracking-[-0.02em] mt-3 leading-none"
                style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
              >
                1,847,392,118
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-left">
                <div className="border border-white/10 rounded-card p-4">
                  <div className="font-mono text-[0.7rem] uppercase tracking-wider text-white/40">Cadence</div>
                  <div className="font-display text-[1.05rem] mt-1 text-white">24h</div>
                </div>
                <div className="border border-white/10 rounded-card p-4">
                  <div className="font-mono text-[0.7rem] uppercase tracking-wider text-white/40">Engines</div>
                  <div className="font-display text-[1.05rem] mt-1 text-white">10</div>
                </div>
                <div className="border border-white/10 rounded-card p-4">
                  <div className="font-mono text-[0.7rem] uppercase tracking-wider text-white/40">Geos</div>
                  <div className="font-display text-[1.05rem] mt-1 text-white">38</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ───────────────────── HOW WE'RE DIFFERENT ───────────────────── */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Versus the alternatives</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              Why Clovion tracking is different from Profound.
            </h2>
            <p className="lead mt-5 max-w-2xl">
              Three differences that matter once you have lived with both. The full breakdown sits on the compare page.
            </p>
          </div>

          <ul className="mt-14 border-t border-ink/15">
            {[
              {
                n: '01',
                title: 'Real consumer prompts, not synthetic queries.',
                body: 'Profound runs API keys against canned prompt lists. We run a panel of opt-in consumers across geographies, so the scores reflect the questions buyers actually type.'
              },
              {
                n: '02',
                title: 'Daily refresh, not weekly batches.',
                body: 'Profound rebuilds most plans weekly. We rebuild every twenty-four hours. AI engines move faster than week-old data can chase.'
              },
              {
                n: '03',
                title: 'Browser capture from opt-in panels, not API scraping.',
                body: 'API responses and what users see in a browser are not the same. Clovion captures the browser experience, including the surfaces and citations a user actually meets.'
              }
            ].map((row) => (
              <li
                key={row.n}
                className="border-b border-ink/15 py-9 grid grid-cols-[auto_1fr] md:grid-cols-[80px_1fr_auto] gap-x-8 gap-y-2 items-baseline"
              >
                <div className="font-mono text-[0.82rem] tracking-wider text-ink-50">{row.n}.</div>
                <div>
                  <h3 className="font-display text-[1.3rem] md:text-[1.45rem] tracking-[-0.02em] leading-tight">{row.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-70 max-w-2xl">{row.body}</p>
                </div>
                <Link
                  href="/compare"
                  className="hidden md:inline-flex items-center gap-1.5 text-[0.85rem] text-ink-60 hover:text-ink whitespace-nowrap"
                >
                  Full comparison <ArrowRight />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 md:hidden">
            <Button href="/compare" variant="secondary" size="md">
              Full comparison <ArrowRight />
            </Button>
          </div>
        </Container>
      </Section>

      {/* ───────────────────── ENGINE STRIP ───────────────────── */}
      <Section bg="subtle" tight>
        <Container>
          <div className="text-center max-w-xl mx-auto mb-10">
            <Eyebrow>Engine coverage</Eyebrow>
            <h2 className="display-sm mt-4 text-balance">Every surface a buyer touches.</h2>
          </div>
          <AIEngineStrip />
        </Container>
      </Section>

      {/* ───────────────────── MINI CASE STUDIES ───────────────────── */}
      <Section className="section-y-sm">
        <Container>
          <div className="grid md:grid-cols-2 gap-5">
            {customerOutcomes.slice(0, 2).map((o) => (
              <SpotlightCard key={o.name} className="bg-white p-8 md:p-9 ring-1 ring-line/80">
                <div className="flex items-center justify-between">
                  <div className="font-display text-[1.1rem] tracking-[-0.02em]">{o.name}</div>
                  <Tag>Case study</Tag>
                </div>
                <div className="mt-6">
                  <div className="font-display text-[2.6rem] md:text-[3rem] tracking-[-0.03em] leading-none">{o.detail.split(' ')[0]}</div>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-70 max-w-md">
                    {o.name === 'Linear'
                      ? 'Linear went from a quiet middle of the pack to the default project tool AI engines recommend for engineering teams, in ninety days.'
                      : 'Vercel turned their developer docs into the canonical deployment source — 5.2x more citations per developer query, measured.'}
                  </p>
                </div>
                <Link
                  href="/customers"
                  className="mt-6 inline-flex items-center gap-1.5 text-[0.88rem] text-ink-70 hover:text-ink"
                >
                  Read the story <ArrowRight />
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </Container>
      </Section>

      {/* ───────────────────── FAQ ───────────────────── */}
      <FAQ
        items={fallbackFaqs as unknown as { q: string; a: string }[]}
        heading="Tracking, answered."
        sub="The five questions that come up most when teams evaluate visibility tracking."
      />

      {/* ───────────────────── CTA ───────────────────── */}
      <CTABanner
        sub="Start free"
        heading="See your visibility before the trial. Free score in 60s."
        body="Sign up with a brand and a domain. Within 24 hours you have a real score, top 10 fixes, and a comparison against three competitors. No card, no trial timer."
        primary="Get free score"
        primaryHref="/free-ai-visibility-score"
        secondary="Start free trial"
        secondaryHref="/pricing"
      />
    </main>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Container, Button, Eyebrow, Tag, ArrowRight, HaloMark, HeroShade } from '@/components/ui'
import { CTABanner, TestimonialRail } from '@/components/sections'
import { cn } from '@/lib/cn'
import { customers, testimonials, homeMetrics } from '@/lib/content'

// Note: metadata is set in app/layout.tsx and overridden by parent route segments.
// This page is a client component because of the interactive filter bar, so we
// cannot export const metadata here — Next.js 14 rejects metadata exports from
// client components. The title falls back to the layout default plus the route.

// ---------------------------------------------------------------------------
// Local data — categories, featured cases, dense grid rows
// ---------------------------------------------------------------------------

const categories = [
  'All',
  'Featured',
  'SaaS',
  'AI',
  'Fintech',
  'Consumer',
  'Ecommerce',
  'Enterprise'
] as const

type Category = (typeof categories)[number]

type FeaturedCase = {
  id: string
  company: string
  headline: string
  body: string
  industry: string
  useCase: string
  featured: boolean
}

const featuredCases: FeaturedCase[] = [
  {
    id: 'linear',
    company: 'Linear',
    headline: '8.4x AI mentions in 90 days',
    body: 'Linear used multi-engine tracking to surface dev-tooling queries they were missing. Schema gaps on pricing pages, citation paths on developer forums — all ranked and shipped in two sprints.',
    industry: 'SaaS',
    useCase: 'Tracking',
    featured: true
  },
  {
    id: 'vercel',
    company: 'Vercel',
    headline: '5.2x citations per dev query',
    body: 'A citation path audit revealed Vercel docs were structured for humans, not retrieval. Heading depth, sectioning, and schema patches turned their guides into the canonical source LLMs reach for.',
    industry: 'SaaS',
    useCase: 'Docs',
    featured: true
  },
  {
    id: 'webflow',
    company: 'Webflow',
    headline: '4.6x share of voice lift',
    body: "A competitor twenty times their size dominated AI answers for 'no-code website builder.' We mapped the citation gap and Webflow worked the third-party list. Six months later, head-to-head wins.",
    industry: 'SaaS',
    useCase: 'Competitive',
    featured: true
  },
  {
    id: 'ramp',
    company: 'Ramp',
    headline: '3.2x citation share of voice',
    body: 'Finance prompts on ChatGPT and Perplexity were citing legacy incumbents by default. Ramp shipped the prioritized fix list across pricing, comparison, and integrations pages over six weeks.',
    industry: 'Fintech',
    useCase: 'GEO fixes',
    featured: true
  },
  {
    id: 'notion',
    company: 'Notion',
    headline: '4 vendors replaced, 1 dashboard',
    body: 'Notion consolidated three monitoring tools plus a generic SEO platform onto Clovion. One schema, one prompt set, one fix queue — and the team finally agrees on what to ship next.',
    industry: 'SaaS',
    useCase: 'Consolidation',
    featured: true
  },
  {
    id: 'figma',
    company: 'Figma',
    headline: 'Industry-leading sentiment',
    body: "Sentiment intelligence flagged that Claude was characterizing Figma as 'enterprise-only' for design queries. Two quarters of reshaped third-party narrative later, Figma scores highest in its category.",
    industry: 'SaaS',
    useCase: 'Sentiment',
    featured: true
  }
]

type Row = {
  name: string
  industry: string
  outcome: string
  hasStory: boolean
}

// 9 testimonial customers + 15 wordmark-only rows = 24 total
const gridRows: Row[] = [
  { name: 'Linear', industry: 'SaaS', outcome: '+8.4x AI mentions', hasStory: true },
  { name: 'Notion', industry: 'SaaS', outcome: '+3.1x share of voice', hasStory: true },
  { name: 'Ramp', industry: 'Fintech', outcome: '+3.2x citation share', hasStory: true },
  { name: 'Brex', industry: 'Fintech', outcome: '10 engines tracked', hasStory: true },
  { name: 'Vercel', industry: 'SaaS', outcome: '+5.2x dev citations', hasStory: true },
  { name: 'Figma', industry: 'SaaS', outcome: 'Sentiment #1 in category', hasStory: true },
  { name: 'Loom', industry: 'SaaS', outcome: 'ChatGPT category recovered', hasStory: true },
  { name: 'Webflow', industry: 'SaaS', outcome: '+4.6x share of voice', hasStory: true },
  { name: 'Hone', industry: 'Consumer', outcome: 'Score in 24h, board brief', hasStory: true },
  { name: 'Mercury', industry: 'Fintech', outcome: '+2.4x AI citations', hasStory: false },
  { name: 'Retool', industry: 'SaaS', outcome: '+6.1x dev queries', hasStory: false },
  { name: 'Airbase', industry: 'Fintech', outcome: 'AI Overviews lift', hasStory: false },
  { name: 'Lattice', industry: 'SaaS', outcome: 'Sentiment turnaround', hasStory: false },
  { name: 'Pulley', industry: 'Fintech', outcome: 'New engine coverage', hasStory: false },
  { name: 'Posthog', industry: 'SaaS', outcome: '+3.4x Perplexity SoV', hasStory: false },
  { name: 'Supabase', industry: 'SaaS', outcome: 'Docs cited 2.8x more', hasStory: false },
  { name: 'Modal', industry: 'AI', outcome: 'Category leader on Claude', hasStory: false },
  { name: 'Anthropic Labs', industry: 'AI', outcome: 'Schema patches shipped', hasStory: false },
  { name: 'Sourcegraph', industry: 'SaaS', outcome: '+4.1x code-tool queries', hasStory: false },
  { name: 'Replit', industry: 'AI', outcome: 'Citation paths mapped', hasStory: false },
  { name: 'Glean', industry: 'Enterprise', outcome: 'Enterprise SoV doubled', hasStory: false },
  { name: 'Census', industry: 'SaaS', outcome: 'Gemini visibility +210%', hasStory: false },
  { name: 'Plain', industry: 'SaaS', outcome: 'AI Mode entry tracked', hasStory: false },
  { name: 'Resend', industry: 'SaaS', outcome: '+5.0x dev citations', hasStory: false }
]

export default function CustomersPage() {
  const [active, setActive] = useState<Category>('All')

  const filteredFeatured = featuredCases.filter((c) => {
    if (active === 'All') return true
    if (active === 'Featured') return c.featured
    return c.industry === active
  })

  const filteredRows = gridRows.filter((r) => {
    if (active === 'All' || active === 'Featured') return true
    return r.industry === active
  })

  return (
    <>
      {/* Hero band ----------------------------------------------------------*/}
      <section className="relative isolate overflow-hidden">
        <div className="hero-bg absolute inset-0 -z-10" aria-hidden />
        <HeroShade />
        <Container className="pt-20 md:pt-24 pb-14 md:pb-16">
          <div className="max-w-4xl">
            <Eyebrow>Customers</Eyebrow>
            <h1 className="display-lg mt-6 text-balance">
              200+ brands. Found by AI.
            </h1>
            <p className="lead mt-7 max-w-2xl text-balance">
              From Linear&apos;s docs to Notion&apos;s category leadership — see how teams use Clovion to win the AI visibility race.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/pricing" trackLocation="customers_hero" variant="primary" size="lg">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="#stories" variant="secondary" size="lg">
                Browse stories
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Sticky category filter bar ----------------------------------------*/}
      <div className="sticky top-0 z-30 bg-bg/95 backdrop-blur border-y border-line">
        <Container className="py-4">
          <div
            role="tablist"
            aria-label="Filter customers by category"
            className="flex items-center gap-2 overflow-x-auto scrollbar-none"
          >
            {categories.map((cat) => {
              const isActive = active === cat
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(cat)}
                  className={cn(
                    'h-9 shrink-0 inline-flex items-center px-3.5 rounded-pill text-[0.85rem] font-semibold transition-all duration-200 ease-out',
                    isActive
                      ? 'bg-ink text-white border border-ink'
                      : 'bg-transparent text-ink-70 border border-line hover:border-ink/30 hover:text-ink'
                  )}
                >
                  {cat}
                </button>
              )
            })}
            <div className="ml-auto hidden md:flex items-center gap-2 font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink-50 pl-4 shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-ink animate-pulse" />
              {active === 'All'
                ? `${gridRows.length} customers`
                : `${filteredFeatured.length + filteredRows.length} matches`}
            </div>
          </div>
        </Container>
      </div>

      {/* Featured case spotlight grid --------------------------------------*/}
      <section id="stories" className="section-y bg-white">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
            <div className="lg:col-span-7">
              <Eyebrow>Featured stories</Eyebrow>
              <h2 className="display-md mt-5 text-balance">
                Six teams. Six numbers worth borrowing.
              </h2>
            </div>
            <p className="lg:col-span-5 lead text-balance">
              Each story has a baseline, a fix list, and a 90-day result. No anonymized case studies — real brands, real numbers.
            </p>
          </div>

          {filteredFeatured.length === 0 ? (
            <EmptyState category={active} onReset={() => setActive('All')} />
          ) : (
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFeatured.map((c, i) => (
                <li key={c.id}>
                  <article className="group relative h-full p-7 md:p-8 rounded-card bg-white border border-line transition-all duration-300 hover:border-ink/30 hover:-translate-y-0.5 hover:shadow-soft flex flex-col">
                    {/* Brand + index */}
                    <div className="flex items-center justify-between">
                      <div className="font-display text-[1.5rem] font-semibold tracking-[-0.025em]">
                        {c.company}
                      </div>
                      <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-40">
                        {String(i + 1).padStart(2, '0')} / {filteredFeatured.length.toString().padStart(2, '0')}
                      </span>
                    </div>

                    {/* Mono headline outcome — signature numeral */}
                    <div className="mt-7 pb-6 border-b border-line">
                      <div className="font-mono text-[1.7rem] md:text-[1.85rem] font-semibold tracking-[-0.03em] text-ink leading-tight tabular-nums">
                        {c.headline}
                      </div>
                    </div>

                    {/* Context */}
                    <p className="mt-6 text-[0.95rem] leading-relaxed text-ink-70 flex-1">
                      {c.body}
                    </p>

                    {/* Tags + CTA */}
                    <div className="mt-7 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Tag>{c.industry}</Tag>
                        <span className="text-ink-30 text-[0.78rem]">·</span>
                        <Tag>{c.useCase}</Tag>
                      </div>
                      <a
                        href={`#row-${c.id}`}
                        className="inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-ink whitespace-nowrap transition-all group-hover:gap-2.5"
                      >
                        Read story <ArrowRight />
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      {/* Aggregate metrics block — signature -------------------------------*/}
      <AggregateMetricsBlock />

      {/* Dense logo + outcome grid -----------------------------------------*/}
      <section className="section-y">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <Eyebrow>The roster</Eyebrow>
              <h2 className="display-md mt-5 text-balance">
                Every customer, every outcome.
              </h2>
              <p className="lead mt-5 text-balance">
                A dense view of who runs Clovion in production — with one micro-outcome each, refreshed quarterly.
              </p>
            </div>
            <div className="font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink-50">
              {filteredRows.length.toString().padStart(2, '0')} rows
              <span className="text-ink-30 mx-2">·</span>
              sorted by tenure
            </div>
          </div>

          {filteredRows.length === 0 ? (
            <EmptyState category={active} onReset={() => setActive('All')} />
          ) : (
            <div className="-mx-4 overflow-x-auto md:mx-0 md:overflow-visible">
              <div className="min-w-[640px] md:min-w-0 px-4 md:px-0">
                <div className="border-t border-b border-line">
                  {/* Header row */}
                  <div className="grid grid-cols-12 gap-4 py-3 px-2 border-b border-line font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-50">
                    <div className="col-span-5 md:col-span-3">Customer</div>
                    <div className="col-span-3 md:col-span-2">Industry</div>
                    <div className="hidden md:block md:col-span-5">Outcome</div>
                    <div className="col-span-4 md:col-span-2 text-right">Link</div>
                  </div>

                  <ul>
                    {filteredRows.map((row, i) => (
                      <li
                        key={row.name}
                        id={`row-${row.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className={cn(
                          'grid grid-cols-12 gap-4 py-4 px-2 items-center transition-colors hover:bg-subtle/60',
                          i !== filteredRows.length - 1 && 'border-b border-line'
                        )}
                      >
                        <div className="col-span-5 md:col-span-3 flex items-center gap-3 min-w-0">
                          <span className="font-mono text-[0.7rem] tabular-nums text-ink-40 hidden md:inline">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-display text-[1.05rem] md:text-[1.15rem] tracking-[-0.02em] truncate">
                            {row.name}
                          </span>
                        </div>
                        <div className="col-span-3 md:col-span-2">
                          <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-ink-60">
                            {row.industry}
                          </span>
                        </div>
                        <div className="hidden md:block md:col-span-5">
                          <span className="font-mono text-[0.82rem] tabular-nums text-ink-80">
                            {row.outcome}
                          </span>
                        </div>
                        <div className="col-span-4 md:col-span-2 text-right">
                          {row.hasStory ? (
                            <Link
                              href="#stories"
                              className="inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-ink hover:gap-2 transition-all"
                            >
                              Read <ArrowRight />
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[0.82rem] text-ink-50">
                              Visit site
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" aria-hidden>
                                <path d="M5 11l6-6M11 5H6m5 0v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </span>
                          )}
                        </div>
                        {/* Mobile outcome row */}
                        <div className="col-span-12 md:hidden -mt-2">
                          <span className="font-mono text-[0.78rem] tabular-nums text-ink-70">
                            {row.outcome}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Bonus wordmark roster */}
          <div className="mt-16 pt-10 border-t border-line">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
              <h3 className="display-sm">And another 176 you would recognize.</h3>
              <p className="font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink-50">
                Logos shown when contracts permit
              </p>
            </div>
            <div className="flex flex-wrap gap-x-4 md:gap-x-8 gap-y-3 text-ink-40">
              {customers.map((name) => (
                <span
                  key={name}
                  className="font-display text-[1.1rem] tracking-[-0.02em] hover:text-ink transition-colors"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonial rail --------------------------------------------------*/}
      <TestimonialRail
        items={testimonials}
        eyebrow="In their words"
        heading="Nine quick notes from the inside."
        sub="Growth, product, and marketing leaders on what changed after the score moved."
      />

      {/* CTA banner --------------------------------------------------------*/}
      <CTABanner
        sub="Your story next"
        heading="Join the brands buyers ask AI about."
        body="Free score in 24 hours. The same engine our paid customers use, narrowed to the four largest models. No card, no trial timer."
        primary="Start Free Trial"
        primaryHref="/pricing"
        secondary="Get Free Score"
        secondaryHref="/free-ai-visibility-score"
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Aggregate metrics block — signature moment, huge mono numerals on dark bg
// ---------------------------------------------------------------------------

function AggregateMetricsBlock() {
  const metrics = [
    { value: '7.1x', label: 'Average AI mention lift across the customer base' },
    { value: '71%', label: 'Median agent-resolution rate at production scale' },
    { value: '1.4M', label: 'Average new pipeline from AI-sourced visitors' }
  ]

  return (
    <section className="relative section-y-xl bg-ink text-white overflow-hidden isolate">
      {/* Soft single radial */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 50% 30%, rgba(255,255,255,0.04), transparent 60%)'
        }}
      />
      {/* Dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      {/* Top hairline */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <Container>
        <div className="max-w-3xl mb-20">
          <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/5 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            The numbers
          </span>
          <h2 className="display-lg mt-7 text-balance text-white">
            Pulled from 200+ production deployments.
          </h2>
          <p className="lead mt-6 text-balance text-white/60 max-w-xl">
            Not curated, not annualized, not rounded up. The median across every customer running Clovion today.
          </p>
        </div>

        {/* Massive mono numerals — the signature visual */}
        <div className="grid md:grid-cols-3 gap-y-20 md:gap-x-10">
          {metrics.map((m, i) => (
            <div key={m.value} className="relative">
              {/* Index marker */}
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40 block mb-5">
                0{i + 1} / 03
              </span>

              {/* The numeral — the largest text on the entire site */}
              <div
                className="font-mono font-semibold text-white leading-[0.9] tracking-[-0.04em] tabular-nums"
                style={{ fontSize: 'clamp(4rem, 9vw, 7rem)' }}
              >
                {m.value}
              </div>

              {/* Label */}
              <p className="mt-7 font-mono text-[0.82rem] leading-relaxed text-white/60 max-w-[28ch]">
                {m.label}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom note row — secondary stats */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-white/50">
          <p className="font-mono text-[0.78rem] uppercase tracking-[0.14em]">
            Refreshed quarterly · 200+ workspaces · production data
          </p>
          <div className="flex items-center gap-6">
            {homeMetrics.slice(0, 2).map((m) => (
              <div key={m.value} className="flex items-baseline gap-2">
                <span className="font-mono text-[1.1rem] font-semibold text-white tabular-nums">
                  {m.value}
                </span>
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-white/40">
                  {m.label.split(' ').slice(0, 3).join(' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Empty state — shown when filter has no matches
// ---------------------------------------------------------------------------

function EmptyState({
  category,
  onReset
}: {
  category: Category
  onReset: () => void
}) {
  return (
    <div className="rounded-card border border-line bg-subtle/40 px-8 py-14 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white mb-5">
        <HaloMark size={20} />
      </div>
      <h3 className="display-sm font-semibold">No {category} stories yet.</h3>
      <p className="mt-3 text-[0.95rem] text-ink-70 max-w-md mx-auto">
        Pick another category above, or reset to see the full list — most customers have a public outcome on the roster.
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={onReset}
          className="btn btn-secondary h-9 px-3.5 text-sm"
        >
          Show all
        </button>
      </div>
    </div>
  )
}

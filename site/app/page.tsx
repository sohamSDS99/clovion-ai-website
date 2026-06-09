import Link from 'next/link'
import type { Metadata } from 'next'
import { HomeHero } from '@/components/Hero'
import {
  Container,
  Section,
  Button,
  Eyebrow,
  ArrowRight
} from '@/components/ui'
import { TestimonialRail, CTABanner } from '@/components/sections'
import { SpotlightCard } from '@/components/SpotlightCard'
import {
  LiveAIDemo,
  MetricsTickerStrip,
  AIEngineMarquee
} from '@/components/HomeInteractive'
import { features, customers, aiEngines } from '@/lib/content'

export const metadata: Metadata = {
  title: 'AI Visibility & GEO Platform | Clovion AI',
  description:
    'Clovion AI tracks how ChatGPT, Claude, Perplexity, Gemini, and six other engines describe your brand — then hands you the GEO fixes that actually move citation share. Free score in 60 seconds.'
}

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <AIEngineMarquee engines={aiEngines} />

      <ThreePillarsSection />

      <LiveAIDemo />

      <MetricsTickerStrip />

      <CustomerLogoGrid />

      <TestimonialRail
        eyebrow="Customer stories"
        heading="Teams running GEO as a real channel."
        sub="Nine quick notes from growth, product, and marketing leaders shipping fixes with Clovion AI."
      />

      <FlywheelSection />

      <CTABanner
        sub="07 — Start"
        heading="Find out where AI says you stand."
        body="60 seconds. No signup. The same engine our paid customers use, narrowed down to the four largest models."
        primary="Get free score"
        primaryHref="/free-ai-visibility-score"
        secondary="Start free trial"
        secondaryHref="/pricing"
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Section 3 — Three pillars (the actual product features)
// ---------------------------------------------------------------------------
function ThreePillarsSection() {
  const sku = ['01 — Tracking', '02 — Suggestions', '03 — Coverage']
  const hrefs = [
    '/features/ai-visibility-tracking',
    '/features/geo-improvement-suggestions',
    '/features/platform-coverage'
  ]

  return (
    <Section>
      <Container>
        <div className="grid lg:grid-cols-12 gap-12 items-end mb-16">
          <div className="lg:col-span-7">
            <Eyebrow>02 — Product</Eyebrow>
            <h2 className="display-lg mt-5 text-balance">
              Three problems. One platform.
            </h2>
          </div>
          <p className="lg:col-span-5 lead text-balance">
            Tracking shows where you stand. Suggestions move the number. Coverage makes sure neither blind spot wins.
          </p>
        </div>

        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <li key={feature.id} className="contents">
              <SpotlightCard className="p-8 flex flex-col">
                <span className="font-mono text-[0.74rem] uppercase tracking-[0.14em] text-ink-50">
                  {sku[i]}
                </span>
                <h3 className="display-sm mt-5 leading-[1.15]">{feature.name}</h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-70">
                  {feature.tagline}
                </p>

                <div className="mt-7 flex-1">
                  {i === 0 && <TrackingMiniVisual />}
                  {i === 1 && <SuggestionsMiniVisual />}
                  {i === 2 && <CoverageMiniVisual />}
                </div>

                <Link
                  href={hrefs[i]}
                  className="mt-7 inline-flex items-center gap-1.5 text-[0.88rem] font-semibold text-ink hover:gap-2 transition-all"
                >
                  Read the spec <ArrowRight className="opacity-80" />
                </Link>
              </SpotlightCard>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

function TrackingMiniVisual() {
  const engines = ['ChatGPT', 'Claude', 'Perplexity', 'Gemini', 'Grok']
  return (
    <div className="rounded-2xl border border-line bg-subtle/60 p-4 space-y-2">
      {engines.map((e, i) => (
        <div key={e} className="flex items-center gap-3">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-60 w-[5.5rem]">
            {e}
          </span>
          <div className="flex-1 h-1 rounded-full bg-white overflow-hidden border border-line">
            <div
              className={i === 0 ? 'h-full bg-ink' : 'h-full bg-ink/40'}
              style={{ width: `${88 - i * 12}%` }}
            />
          </div>
          <span className="font-mono text-[0.7rem] tabular-nums text-ink-60 w-8 text-right">
            {88 - i * 12}
          </span>
        </div>
      ))}
    </div>
  )
}

function SuggestionsMiniVisual() {
  const fixes = [
    { label: 'Add Product schema to /pricing', lift: '+8.2%' },
    { label: 'Cite source on G2 comparison', lift: '+6.1%' },
    { label: 'Restructure FAQ heading depth', lift: '+4.4%' }
  ]
  return (
    <div className="space-y-2">
      {fixes.map((fix, i) => (
        <div
          key={fix.label}
          className="rounded-xl border border-line bg-subtle/60 px-3 py-2.5 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-mono text-[0.66rem] tabular-nums text-ink-50 shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-[0.82rem] text-ink-80 truncate">{fix.label}</span>
          </div>
          <span className="font-mono text-[0.72rem] font-semibold text-ink shrink-0">
            {fix.lift}
          </span>
        </div>
      ))}
    </div>
  )
}

function CoverageMiniVisual() {
  return (
    <div className="grid grid-cols-2 gap-px bg-line border border-line rounded-2xl overflow-hidden">
      {aiEngines.map((e, i) => (
        <div
          key={e}
          className="bg-subtle/60 px-3 py-2.5 flex items-center gap-2"
        >
          <span
            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
              i < 9 ? 'bg-ink' : 'bg-ink/30'
            }`}
          />
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-70 truncate">
            {e}
          </span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section 6 — Customer logo grid (4x2, mono wordmarks)
// ---------------------------------------------------------------------------
function CustomerLogoGrid() {
  return (
    <Section bg="subtle" tight>
      <Container>
        <div className="text-center mb-12">
          <p className="font-mono text-[0.78rem] uppercase tracking-[0.14em] text-ink-50">
            Trusted by teams shipping the AI era
          </p>
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line rounded-2xl overflow-hidden">
          {customers.map((name) => (
            <li
              key={name}
              className="bg-subtle px-6 py-10 md:py-14 flex items-center justify-center transition-colors hover:bg-white"
            >
              <span className="font-display text-[1.5rem] md:text-[1.75rem] font-semibold tracking-[-0.03em] text-ink-60 hover:text-ink transition-colors">
                {name}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 text-[0.9rem] font-semibold text-ink hover:gap-2 transition-all"
          >
            Read three customer stories <ArrowRight className="opacity-80" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Section 8 — Flywheel loop (dark)
// ---------------------------------------------------------------------------
function FlywheelSection() {
  const nodes = [
    {
      label: 'Track',
      title: 'AI Visibility Tracking',
      body: 'Daily scoring across 10 engines on real consumer prompts.'
    },
    {
      label: 'Improve',
      title: 'GEO Suggestions',
      body: 'Prioritized fix list ranked by expected lift, with drafted code.'
    },
    {
      label: 'Cover',
      title: 'Platform Coverage',
      body: 'New engines added inside 30 days of launch, automatically.'
    }
  ]

  return (
    <section className="relative section-y-xl bg-ink text-white overflow-hidden isolate">
      {/* Soft single radial */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 50% 30%, rgba(255,255,255,0.05), transparent 60%)'
        }}
      />
      {/* Dot grid at 6% white */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-60"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      {/* Top inset highlight */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <Container>
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/5 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            05 — The loop
          </span>
          <h2 className="display-lg mt-7 text-balance text-white">
            Tracking. Suggestions. Coverage. One loop.
          </h2>
          <p className="lead mt-6 text-balance text-white/60">
            Each part sharpens the next. Better tracking surfaces better fixes. Better fixes prove the lift. Better coverage finds the next blind spot.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connector arcs — SVG, hidden on mobile */}
          <svg
            aria-hidden
            viewBox="0 0 1000 360"
            className="hidden md:block absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <marker
                id="flywheel-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <path d="M0 0 L8 4 L0 8 z" fill="rgba(255,255,255,0.55)" />
              </marker>
            </defs>
            <path
              d="M 220 110 Q 500 30 780 110"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              markerEnd="url(#flywheel-arrow)"
            />
            <path
              d="M 820 160 Q 880 240 780 320"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              markerEnd="url(#flywheel-arrow)"
            />
            <path
              d="M 720 330 Q 500 380 220 230"
              fill="none"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              markerEnd="url(#flywheel-arrow)"
            />
          </svg>

          <ul className="relative grid md:grid-cols-3 gap-6 md:gap-10">
            {nodes.map((n, i) => (
              <li
                key={n.label}
                className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-7 md:p-8 backdrop-blur-sm hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/50">
                    Node 0{i + 1}
                  </span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white">
                    {n.label}
                  </span>
                </div>
                <h3 className="font-display text-[1.4rem] mt-6 font-semibold tracking-[-0.02em] text-white">
                  {n.title}
                </h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-white/60">
                  {n.body}
                </p>
                <div className="mt-7 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40">
                    {i === 0 ? 'Input' : i === 1 ? 'Action' : 'Expansion'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 flex flex-wrap justify-center gap-3">
          <Button href="/pricing" variant="invert" size="lg">
            Start free trial <ArrowRight />
          </Button>
          <Link
            href="/product"
            className="btn h-12 px-6 text-base text-white border border-white/20 hover:bg-white/5"
          >
            See the product
          </Link>
        </div>
      </Container>
    </section>
  )
}

import Link from 'next/link'
import {
  Section,
  Container,
  Button,
  Card,
  Eyebrow,
  ArrowRight,
  Check,
  HairlineDivider,
  HeroShade
} from '@/components/ui'
import { CTABanner } from '@/components/sections'

export const metadata = {
  title: 'Compare Clovion AI to every major GEO platform | Clovion AI',
  description:
    'Honest side-by-side comparisons of Clovion AI against Profound, Otterly, Peec.ai, and AthenaHQ. Feature parity, where we win, where they win, and what to ask in a demo.'
}

// ---------------------------------------------------------------------------
// Local data — kept inline so the page is self-contained and survives content edits.
// Profound entry mirrors the live page; the other three are placeholders that link
// to the same page until their dedicated comparisons ship.
// ---------------------------------------------------------------------------

const competitorPages = [
  {
    slug: 'profound',
    name: 'Profound',
    href: '/compare/clovion-vs-profound',
    status: 'Live',
    positioning:
      'Profound is the enterprise incumbent. Strong brand awareness, narrow engine coverage, generic recommendations.',
    bullets: [
      'We track 10 engines. They track 3.',
      'Our fixes ship ranked by lift with drafted code. Theirs ship as a checklist.',
      'Starts at $99/mo. They start at $499/mo.'
    ]
  },
  {
    slug: 'otterly',
    name: 'Otterly',
    href: '/compare/clovion-vs-profound',
    status: 'Coming soon',
    positioning:
      'Otterly is the playful self-serve tool. Friendly UI, light analytics, built for solo founders rather than teams with prompt volume over 200/mo.',
    bullets: [
      'We refresh daily on every paid plan. Otterly refreshes weekly.',
      'Our reports include schema patches and code. Otterly stops at observations.',
      'Built for teams of 5+. Otterly is built for an audience of one.'
    ]
  },
  {
    slug: 'peec',
    name: 'Peec.ai',
    href: '/compare/clovion-vs-profound',
    status: 'Coming soon',
    positioning:
      'Peec leans into agentic dashboards. Heavy on visualization, light on the actual fix workflow. Great if you already know what to do.',
    bullets: [
      'We deliver ranked fixes with proof-of-lift. Peec hands back a dashboard.',
      'Our crawler analytics cover Vercel, Cloudflare, CloudFront, Fastly. Peec relies on third-party logs.',
      'We bundle the MCP server on Growth. Peec sells it as a separate SKU.'
    ]
  },
  {
    slug: 'athenahq',
    name: 'AthenaHQ',
    href: '/compare/clovion-vs-profound',
    status: 'Coming soon',
    positioning:
      'AthenaHQ is the agency play. Multi-tenant, white-label, retainer-friendly. Less suited to in-house teams running their own GEO program.',
    bullets: [
      'We are priced for in-house teams. Athena is priced for agency margins.',
      'Our recommendations carry a confidence score. Athena hands you raw signal.',
      'Our free score returns in 24 hours. Athena requires a sales call to start.'
    ]
  }
] as const

const switchingCosts = [
  {
    numeral: '01',
    title: 'Import your prompts in one upload.',
    body: 'CSV import accepts competitor prompt lists. We normalize the format, dedupe variants, and run the first scan within an hour of import.'
  },
  {
    numeral: '02',
    title: 'No long contract.',
    body: 'Monthly billing on Starter and Visibility. Cancel anytime in the dashboard. Annual plans get a 20% discount but they are never required.'
  },
  {
    numeral: '03',
    title: '30-day side-by-side trial.',
    body: 'Run Clovion next to your current tool for thirty days. Compare the scores, the fixes, the refresh cadence. Decide on real data, not a sales deck.'
  }
] as const

const methodologyPoints = [
  'Public pricing pages, captured the week of publication.',
  'Public docs, changelogs, and API references read in full.',
  'Side-by-side test runs on the same 50-prompt fixture.',
  'Updated quarterly. Last refresh: April 2026.'
] as const

export default function ComparePage() {
  return (
    <>
      {/* -----------------------------------------------------------------
          HERO
          ----------------------------------------------------------------- */}
      <Section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
        <HeroShade />
        <Container className="relative">
          <div className="max-w-3xl">
            <Eyebrow>COMPARE</Eyebrow>
            <h1 className="display-lg mt-5">
              Compare every GEO tool.
            </h1>
            <p className="lead mt-6 text-[rgb(var(--ink-rgb)/70%)] max-w-2xl">
              Honest comparisons against every major AI visibility tool. Feature parity, where we win, where they win, and what to ask in a demo.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/pricing" trackLocation="compare_hero" variant="primary" size="lg">
                Start Free Trial
              </Button>
              <Button href="/free-ai-visibility-score" trackLocation="compare_hero" variant="secondary" size="lg">
                Get Free Score
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* -----------------------------------------------------------------
          SECTION 2 — COMPARISON GRID
          ----------------------------------------------------------------- */}
      <Section className="bg-[var(--white)] border-y border-[#eceae5]">
        <Container>
          <div className="max-w-2xl mb-12">
            <h2 className="display-md">Four head-to-head comparisons.</h2>
            <p className="lead mt-5 text-[rgb(var(--ink-rgb)/70%)]">
              Each comparison runs the same fixture: real prompts, current pricing, and the workflow you would actually run on a Tuesday.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {competitorPages.map((c) => {
              const isLive = c.status === 'Live'
              return (
                <Link
                  key={c.slug}
                  href={c.href}
                  className="group relative block"
                  aria-label={`Compare Clovion AI vs ${c.name}`}
                >
                  <Card className="h-full flex flex-col gap-6 p-5 md:p-8 transition-colors duration-200 group-hover:border-[rgb(var(--ink-rgb)/30%)]">
                    {/* status pill */}
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-mono uppercase tracking-[0.2em] text-[rgb(var(--ink-rgb)/50%)]">
                        Clovion AI <span className="text-[rgb(var(--ink-rgb)/30%)] mx-1.5">vs</span> {c.name}
                      </div>
                      <span
                        className={[
                          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em]',
                          isLive
                            ? 'border-[rgb(var(--ink-rgb)/20%)] bg-ink text-white'
                            : 'border-[rgb(var(--ink-rgb)/15%)] bg-[#F5F3EF] text-[rgb(var(--ink-rgb)/60%)]'
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'h-1 w-1 rounded-full',
                            isLive ? 'bg-[var(--white)]' : 'bg-[rgb(var(--ink-rgb)/40%)]'
                          ].join(' ')}
                        />
                        {c.status}
                      </span>
                    </div>

                    {/* Name + positioning */}
                    <div>
                      <div className="display-sm">
                        <span className="text-[rgb(var(--ink-rgb)/40%)]">vs.</span>{' '}
                        <span className="text-[var(--ink)]">{c.name}</span>
                      </div>
                      <p className="mt-4 text-[rgb(var(--ink-rgb)/70%)] leading-relaxed">{c.positioning}</p>
                    </div>

                    {/* Bullets */}
                    <ul className="space-y-2.5 mt-auto">
                      {c.bullets.map((b) => (
                        <li key={b} className="flex gap-3 text-sm text-[rgb(var(--ink-rgb)/80%)]">
                          <Check className="mt-0.5 shrink-0 text-[var(--ink)]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA row */}
                    <div className="pt-2 mt-2 border-t border-[#eceae5] flex items-center justify-between">
                      <span className="text-sm font-semibold text-[var(--ink)]">
                        {isLive ? 'See full comparison' : 'Notify me when live'}
                      </span>
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-[#eceae5] text-[var(--ink)] transition-colors group-hover:border-[var(--ink)] group-hover:bg-ink group-hover:text-white">
                        <ArrowRight />
                      </span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* -----------------------------------------------------------------
          SECTION 3 — SWITCHING COST BAND
          ----------------------------------------------------------------- */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-2xl mb-12">
            <Eyebrow>SWITCHING</Eyebrow>
            <h2 className="display-md mt-5">Migrating is the smaller worry.</h2>
            <p className="lead mt-5 text-[rgb(var(--ink-rgb)/70%)]">
              Most teams overestimate the cost of switching. Three guardrails make the move boring on purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {switchingCosts.map((s, i) => (
              <div
                key={s.numeral}
                className="card bg-[var(--white)] p-5 md:p-8 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm tracking-[0.2em] text-[rgb(var(--ink-rgb)/40%)]">
                    {s.numeral}
                  </span>
                  {i < switchingCosts.length - 1 && (
                    <span className="hidden md:block font-mono text-xs text-[rgb(var(--ink-rgb)/30%)]">
                      step
                    </span>
                  )}
                </div>
                <HairlineDivider />
                <h3 className="text-lg font-semibold text-[var(--ink)] leading-snug tracking-[-0.01em]">
                  {s.title}
                </h3>
                <p className="text-[rgb(var(--ink-rgb)/65%)] text-[15px] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* -----------------------------------------------------------------
          SECTION 4 — ALTERNATIVES STRIP
          ----------------------------------------------------------------- */}
      <Section tight className="bg-[var(--white)]">
        <Container>
          <Link
            href="/alternatives/profound"
            className="group block"
            aria-label="Read the Profound alternative guide"
          >
            <Card className="flex flex-col md:flex-row items-stretch gap-6 md:gap-10 p-7 md:p-9 transition-colors duration-200 group-hover:border-[rgb(var(--ink-rgb)/30%)]">
              <div className="flex md:items-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgb(var(--ink-rgb)/15%)] bg-[#F5F3EF] px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.22em] text-[rgb(var(--ink-rgb)/60%)]">
                  <span className="h-1 w-1 rounded-full bg-[rgb(var(--ink-rgb)/50%)]" />
                  Alternative
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-[var(--ink)] tracking-[-0.02em] leading-tight">
                    Looking specifically for a Profound alternative? Read our complete guide.
                  </h3>
                  <p className="mt-3 text-[rgb(var(--ink-rgb)/65%)] max-w-2xl text-[15px] leading-relaxed">
                    A longer-form walkthrough: migration path, contract comparison, the parts of Profound we respect, and the parts we built around.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-[var(--ink)]">Read the guide</span>
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-[#eceae5] text-[var(--ink)] transition-colors group-hover:border-[var(--ink)] group-hover:bg-ink group-hover:text-white">
                    <ArrowRight />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        </Container>
      </Section>

      {/* -----------------------------------------------------------------
          SECTION 5 — METHODOLOGY
          ----------------------------------------------------------------- */}
      <Section className="bg-[var(--white)] border-t border-[#eceae5]">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <Eyebrow>METHODOLOGY</Eyebrow>
              <h2 className="display-md mt-5">How we wrote these comparisons.</h2>
              <p className="lead mt-5 text-[rgb(var(--ink-rgb)/70%)]">
                Most comparison pages quietly stack the deck. Ours show the work.
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <p className="text-[rgb(var(--ink-rgb)/75%)] text-[17px] leading-relaxed">
                We compare against the version of each competitor that exists on the day we publish, not the one in their last fundraising deck. Pricing is pulled from the live page. Features are read from public docs. The recommendation quality is judged from a real test run on the same 50-prompt fixture we use for our own QA.
              </p>
              <p className="text-[rgb(var(--ink-rgb)/75%)] text-[17px] leading-relaxed">
                Where they win, we say so. Profound has a longer track record in finance and pharma. Otterly has a friendlier onboarding for a first-time user. Calling that out is what makes the rest of the comparison worth reading.
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                {methodologyPoints.map((p) => (
                  <li
                    key={p}
                    className="flex gap-3 rounded-lg border border-[#eceae5] bg-[#FAFAF7] px-4 py-3.5 text-sm text-[rgb(var(--ink-rgb)/75%)]"
                  >
                    <Check className="mt-0.5 shrink-0 text-[var(--ink)]" />
                    <span className="leading-snug">{p}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Button href="/about" variant="secondary" size="md">
                  Read full methodology
                </Button>
                <span className="text-xs font-mono uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/40%)]">
                  Have a correction? hello@clovion.ai
                </span>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* -----------------------------------------------------------------
          SECTION 6 — NEWSLETTER BAND
          ----------------------------------------------------------------- */}
      <Section bg="subtle" tight>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
            <div className="md:col-span-7">
              <Eyebrow>NEWSLETTER</Eyebrow>
              <h3 className="display-sm mt-4">
                One comparison a quarter, in your inbox.
              </h3>
              <p className="mt-4 text-[rgb(var(--ink-rgb)/70%)] max-w-xl leading-relaxed">
                Each issue is a single competitor teardown — feature delta, pricing changes, and the one workflow that shifted. No drip sequence. No upsell. Unsubscribe in a click.
              </p>
            </div>

            <form
              className="md:col-span-5 flex flex-col sm:flex-row gap-2 w-full"
              action="/api/subscribe"
              method="post"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="you@company.com"
                required
                className="flex-1 h-12 rounded-full border border-[#eceae5] bg-[var(--white)] px-5 text-sm text-[var(--ink)] placeholder:text-[rgb(var(--ink-rgb)/40%)] focus:outline-none focus:border-[var(--ink)] transition-colors"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-ink text-white text-sm font-semibold hover:bg-[rgb(var(--ink-rgb)/90%)] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </Section>

      {/* -----------------------------------------------------------------
          CTA BANNER
          ----------------------------------------------------------------- */}
      <CTABanner
        sub="GET STARTED"
        heading="The fastest comparison is your own score."
        body="Twenty-four hours, real prompts, real engines. See where you sit before you decide who to buy from."
        primary="Get Free Score"
        primaryHref="/free-ai-visibility-score"
        secondary="Start Free Trial"
        secondaryHref="/pricing"
      />
    </>
  )
}

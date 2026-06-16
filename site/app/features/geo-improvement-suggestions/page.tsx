import Link from 'next/link'
import {
  Container,
  Section,
  Button,
  Eyebrow,
  Tag,
  ArrowRight,
  Check,
  HaloMark,
  HeroShade
} from '@/components/ui'
import { FAQ, CTABanner, TestimonialRail } from '@/components/sections'
import { customerOutcomes, faqs } from '@/lib/content'
import { WalkthroughSection } from './walkthrough'

export const metadata = {
  title: 'GEO Improvement Suggestions | Clovion AI',
  description:
    'Prioritized GEO fixes ranked by visibility lift. Schema patches, citation paths, content gaps, and technical issues — each tagged with the engine and prompt it affects.'
}

// -----------------------------------------------------------------------------
// Local data (hardcoded — keeps the page self-contained, no content.ts changes)
// -----------------------------------------------------------------------------

const suggestions = [
  {
    severity: 'HIGH',
    title: 'No JSON-LD on /pricing',
    fix: 'Generate Product + Offer schema, paste into <head>.',
    impact: '+8 pts visibility',
    engine: 'ChatGPT · Perplexity'
  },
  {
    severity: 'HIGH',
    title: 'Missing FAQ schema on /docs/integrations',
    fix: 'We drafted FAQPage JSON-LD from your top 12 doc questions.',
    impact: '+6 pts visibility',
    engine: 'Gemini · AI Overviews'
  },
  {
    severity: 'MED',
    title: 'Absent from "best CMS for AI search" roundups',
    fix: 'Pitch G2, TrustRadius, and TechRadar — outreach drafts attached.',
    impact: '+4 pts visibility',
    engine: 'Perplexity · Claude'
  },
  {
    severity: 'MED',
    title: 'AI-bot user-agent blocked in robots.txt',
    fix: 'Remove the GPTBot, ClaudeBot, and PerplexityBot Disallow lines.',
    impact: '+3 pts visibility',
    engine: 'All engines'
  },
  {
    severity: 'LOW',
    title: 'Content gap: "is X compliant with HIPAA"',
    fix: 'No published page answers this. Draft attached.',
    impact: '+2 pts visibility',
    engine: 'ChatGPT · Claude'
  },
  {
    severity: 'LOW',
    title: 'Stale comparison page vs Profound',
    fix: 'Update with current pricing and add a citation block.',
    impact: '+1 pt visibility',
    engine: 'Gemini'
  }
] as const

const pillars = [
  {
    num: '01',
    title: 'Schema fixes',
    body: 'Auto-generated JSON-LD patches for Product, FAQ, How-To, and Article schemas. Paste them in, ship a build, watch the score move.'
  },
  {
    num: '02',
    title: 'Citation opportunities',
    body: 'Specific industry roundups, comparison pages, and Reddit threads where you should appear. Each one ranked by the engine that uses it most.'
  },
  {
    num: '03',
    title: 'Content gaps',
    body: 'Prompts AI engines answer about your category that you have not published about. We score the gap, draft the page, and track the lift.'
  },
  {
    num: '04',
    title: 'Technical issues',
    body: 'Crawlability checks, robots.txt audits, and AI-bot user-agent exclusions silently dropping you from the index. The boring fixes that move the most.'
  }
]

const rankingSteps = [
  {
    num: '01',
    title: 'We track which prompts you appear in.',
    body: 'Daily, across ten engines. Every appearance is logged with the engine, the prompt, the position, and the sources cited alongside you.'
  },
  {
    num: '02',
    title: 'We score the visibility delta of each potential action.',
    body: 'Each candidate fix is simulated against your current footprint. The score is the share-of-voice change we expect once the fix ships.'
  },
  {
    num: '03',
    title: 'We weight by prompt volume.',
    body: 'Using our 1.8B-prompt dataset, fixes that affect high-volume queries rank above fixes that only move one rare edge case.'
  },
  {
    num: '04',
    title: 'We rank by lift-per-hour-of-work.',
    body: 'A 30-minute schema patch with +6 pts beats a 40-hour content rewrite with +8 pts. The list is sorted by what ships first.'
  }
]

const integrationLogos = [
  'WordPress',
  'Sanity',
  'Contentful',
  'Webflow',
  'Shopify',
  'Notion',
  'WooCommerce',
  'Drive'
]

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function GeoImprovementSuggestionsPage() {
  return (
    <>
      <SuggestionsHero />
      <PillarsSection />
      <RankingSection />
      <WalkthroughSection />
      <IntegrationsStrip />
      <CustomerOutcomesSection />
      <TestimonialRail
        eyebrow="From the suggestion queue"
        heading="Teams who shipped the list."
        sub="Six quick notes from growth and product leaders who ran the queue top-to-bottom."
      />
      <SuggestionFAQ />
      <CTABanner
        sub="Free score, free fixes"
        heading="Get your first ten fixes free."
        body="No card, no trial timer. We score your visibility, hand you the prioritized fix list, and let you ship the easy wins before you decide whether to upgrade."
        primary="Get free score"
        primaryHref="/free-ai-visibility-score"
        secondary="Talk to sales"
        secondaryHref="/contact"
      />
    </>
  )
}

// -----------------------------------------------------------------------------
// Hero
// -----------------------------------------------------------------------------

function SuggestionsHero() {
  return (
    <section className="relative isolate overflow-hidden section-y-xl">
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
      <HeroShade />
      <Container>
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-14 items-center">
          <div className="max-w-2xl">
            <Eyebrow>02 — SUGGESTIONS</Eyebrow>
            <h1 className="display-lg mt-6 text-balance">
              Fixes that get cited.
            </h1>
            <p className="lead mt-7 max-w-xl text-balance">
              Prioritized actions, ranked by visibility lift. Schema patches, citation opportunities, content gaps — each one tagged with the engine and prompt it affects.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/pricing" trackLocation="geo_suggestions_hero" variant="primary" size="lg">
                Start free trial <ArrowRight />
              </Button>
              <Button href="/free-ai-visibility-score" trackLocation="geo_suggestions_hero" variant="secondary" size="lg">
                Get free score
              </Button>
            </div>
            <div className="mt-9 flex items-center gap-4 text-[0.82rem] text-ink-60">
              <span className="inline-flex items-center gap-2">
                <Check className="text-ink" /> Drafted code on every fix
              </span>
              <span className="h-4 w-px bg-line" aria-hidden />
              <span className="inline-flex items-center gap-2">
                <Check className="text-ink" /> Lift estimates per engine
              </span>
            </div>
          </div>

          <SuggestionsInbox />
        </div>
      </Container>
    </section>
  )
}

function SuggestionsInbox() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-x-6 -inset-y-10 -z-10 rounded-[36px] bg-gradient-to-br from-subtle via-white to-subtle/40 border border-line/60"
      />
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-white">
          <div className="flex items-center gap-2.5">
            <HaloMark size={20} />
            <div>
              <div className="text-[0.78rem] font-semibold tracking-tight">Suggestions</div>
              <div className="text-[0.7rem] text-ink-50 font-mono">6 open · sorted by lift</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink/30" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink/30" />
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink/30" />
          </div>
        </div>

        <ul className="divide-y divide-line">
          {suggestions.map((s) => (
            <li
              key={s.title}
              className="px-5 py-4 hover:bg-subtle/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <SeverityPill severity={s.severity} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="text-[0.92rem] font-semibold leading-snug truncate">
                      {s.title}
                    </div>
                    <div className="font-mono text-[0.72rem] text-ink shrink-0">
                      {s.impact}
                    </div>
                  </div>
                  <div className="mt-1 text-[0.82rem] text-ink-60 leading-relaxed line-clamp-1">
                    {s.fix}
                  </div>
                  <div className="mt-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-ink-50">
                    {s.engine}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-line bg-subtle/50">
          <div className="font-mono text-[0.7rem] text-ink-60">Total lift if shipped · +24 pts</div>
          <div className="inline-flex items-center gap-1 text-[0.76rem] font-semibold">
            View all 47 <ArrowRight />
          </div>
        </div>
      </div>
    </div>
  )
}

function SeverityPill({ severity }: { severity: 'HIGH' | 'MED' | 'LOW' }) {
  if (severity === 'HIGH') {
    return (
      <span className="inline-flex h-5 items-center rounded-full bg-ink text-white px-2 font-mono text-[0.62rem] tracking-wider shrink-0 mt-0.5">
        HIGH
      </span>
    )
  }
  if (severity === 'MED') {
    return (
      <span className="inline-flex h-5 items-center rounded-full border border-ink/30 text-ink px-2 font-mono text-[0.62rem] tracking-wider shrink-0 mt-0.5">
        MED
      </span>
    )
  }
  return (
    <span className="inline-flex h-5 items-center px-1 font-mono text-[0.62rem] tracking-wider text-ink-50 shrink-0 mt-0.5">
      LOW
    </span>
  )
}

// -----------------------------------------------------------------------------
// Section 2 — Four pillars
// -----------------------------------------------------------------------------

function PillarsSection() {
  return (
    <Section>
      <Container>
        <div className="max-w-3xl mb-14">
          <Eyebrow>What gets suggested</Eyebrow>
          <h2 className="display-md mt-5 text-balance">
            Four kinds of fixes, ranked into one queue.
          </h2>
          <p className="lead mt-5 text-balance max-w-2xl">
            Most GEO advice is a generic checklist. Ours is your site, your engines, your queue. Every item tagged so you know what you are shipping.
          </p>
        </div>

        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {pillars.map((p) => (
            <li
              key={p.num}
              className="card p-7 hover:border-ink/20 transition-colors"
            >
              <div className="font-mono text-[0.72rem] text-ink-50 tracking-wider mb-5">
                {p.num}
              </div>
              <h3 className="font-display text-[1.15rem] font-semibold tracking-[-0.02em]">
                {p.title}
              </h3>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-70">
                {p.body}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

// -----------------------------------------------------------------------------
// Section 3 — How the engine ranks
// -----------------------------------------------------------------------------

function RankingSection() {
  return (
    <Section bg="subtle">
      <Container>
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-14 items-start">
          <div>
            <Eyebrow>The ranking engine</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              How a fix earns the top of your list.
            </h2>
            <p className="lead mt-5 max-w-md">
              Lift is measurable. We score every candidate fix four ways before it reaches you.
            </p>

            <div className="mt-10 code-block">
              <div className="text-[0.72rem] uppercase tracking-wider mb-3 text-stone-400 font-mono">
                // how we compute lift
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-white">
{'lift = Δshare × promptVolume × engineWeight\n       / effortHours'}
              </pre>
              <div className="mt-5 text-[0.72rem] text-stone-500 leading-relaxed font-mono">
                <div>// Δshare: simulated change in citation share of voice</div>
                <div>// promptVolume: queries per month from our panel data</div>
                <div>// engineWeight: search market share by engine</div>
                <div>// effortHours: drafted by our team for every candidate</div>
              </div>
            </div>
          </div>

          <ol className="space-y-px bg-line/70 border border-line rounded-card overflow-hidden">
            {rankingSteps.map((step) => (
              <li key={step.num} className="bg-white p-7 md:p-8">
                <div className="flex items-baseline gap-5">
                  <div className="font-mono text-[1.6rem] font-semibold text-ink-40 tracking-tight">
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-[1.1rem] font-semibold tracking-[-0.02em] text-balance">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-70">
                      {step.body}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  )
}

// -----------------------------------------------------------------------------
// Section 5 — Integrations strip
// -----------------------------------------------------------------------------

function IntegrationsStrip() {
  return (
    <Section bg="subtle" className="section-y-sm">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-9">
          <div>
            <Eyebrow>Where fixes land</Eyebrow>
            <h2 className="display-sm mt-4 font-semibold tracking-[-0.02em] text-balance max-w-xl">
              Push fixes straight to your stack.
            </h2>
          </div>
          <p className="text-[0.95rem] text-ink-60 max-w-sm">
            One-click deploys to your CMS, or download a patch. Whichever fits the next sprint.
          </p>
        </div>
        <ul className="grid grid-cols-4 md:grid-cols-8 gap-px bg-line border border-line rounded-card overflow-hidden">
          {integrationLogos.map((logo) => (
            <li
              key={logo}
              className="bg-white py-7 px-4 flex items-center justify-center font-mono text-[0.78rem] uppercase tracking-[0.14em] text-ink-70 hover:text-ink hover:bg-subtle/40 transition-colors"
            >
              {logo}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

// -----------------------------------------------------------------------------
// Section 6 — Customer outcomes
// -----------------------------------------------------------------------------

function CustomerOutcomesSection() {
  const notion = customerOutcomes.find((c) => c.name === 'Notion')
  const linear = customerOutcomes.find((c) => c.name === 'Linear')

  const cases = [
    notion && {
      name: notion.name,
      headline: notion.detail,
      outcome: notion.outcome,
      quote:
        'Once Clovion ranked our fix list, the choice was obvious. We shipped schema and content patches first. By month four we had retired four other vendors and routed everything through one dashboard.'
    },
    linear && {
      name: linear.name,
      headline: linear.detail,
      outcome: linear.outcome,
      quote:
        'The fix list reads like a tech-debt board. Each item has a lift, an engine, a snippet to paste. Our growth team shipped 18 fixes in a sprint. Mentions across ChatGPT lifted 8.4x in 90 days.'
    }
  ].filter(Boolean) as Array<{ name: string; headline: string; outcome: string; quote: string }>

  return (
    <Section>
      <Container>
        <div className="max-w-3xl mb-14">
          <Eyebrow>Customer outcomes</Eyebrow>
          <h2 className="display-md mt-5 text-balance">
            Teams who shipped the list.
          </h2>
          <p className="lead mt-5 max-w-2xl">
            Two teams, two starting positions, two queues. Same engine ranking them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {cases.map((c) => (
            <article
              key={c.name}
              className="card p-9 md:p-10 relative overflow-hidden"
            >
              <div className="flex items-baseline justify-between">
                <Tag>{c.outcome}</Tag>
                <div className="font-mono text-[0.72rem] text-ink-50">{c.name}</div>
              </div>
              <div className="mt-7 display-md font-display tracking-[-0.03em] text-balance">
                {c.headline}
              </div>
              <p className="mt-7 text-[0.98rem] leading-relaxed text-ink-70">
                &ldquo;{c.quote}&rdquo;
              </p>
              <div className="mt-9 hairline" />
              <Link
                href="/customers"
                className="mt-5 inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-ink"
              >
                Read the case study <ArrowRight />
              </Link>
            </article>
          ))}
        </div>

      </Container>
    </Section>
  )
}

// -----------------------------------------------------------------------------
// Section 7 — FAQ (filtered to suggestion-relevant)
// -----------------------------------------------------------------------------

function SuggestionFAQ() {
  const relevantQuestions = [
    'How fast can I see results?',
    'How does the free score actually work?',
    'Do I need a technical team to use this?',
    'Are you SOC 2 compliant? What about EU data residency?',
    'What integrations are included?'
  ]
  const filtered = faqs.filter((f) => relevantQuestions.includes(f.q))
  return (
    <FAQ
      items={filtered}
      heading="Questions about suggestions."
      sub="Most teams ask the same five things. Here they are, answered plainly."
    />
  )
}

import type { CSSProperties } from 'react'
import { Fragment } from 'react'
import { Section, Container, Button, Eyebrow, ArrowRight } from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'

export const metadata = {
  title: 'Clovion vs Searchable: Multi-engine AI visibility comparison',
  description:
    'Clovion vs Searchable compared. Both track brand visibility across AI answers; Searchable is a broad AEO platform with content publishing, while Clovion focuses on diagnosing gaps and proving fixes. Features, pricing, and best fit.'
}

// ---------------------------------------------------------------------------
// Brand palette — light homepage theme (#FAF9F7) + the "Clove" orange accent
// (#C2410C). Orange marks the Clovion side + CTAs; the Searchable side + neutral
// areas stay ink-on-warm-white, so "ours" always reads as the branded column.
// See COMPARISON_TEMPLATE.md — tokens pulled from the vs Peec AI page, NOT from
// the source HTML's placeholder hexes.
// ---------------------------------------------------------------------------
const BRAND = '#C2410C'
const BRAND_TINT = '#FBEEE7'
const BRAND_BORDER = 'rgba(194,65,12,0.22)'

// ---------------------------------------------------------------------------
// Content — verbatim from clovion-vs-searchable.html. Do not paraphrase.
// ---------------------------------------------------------------------------

const searchableFlow = ['Measure', 'Analyze', 'Publish']
const clovionFlow = ['Measure', 'Diagnose', 'Recommend', 'Prove']

const glance: { cat: string; clovion: string; searchable: string }[] = [
  {
    cat: 'Core focus',
    clovion: 'AI visibility tracking, diagnosis, recommendations, and improvement workflow',
    searchable: 'Broad AEO platform — visibility tracking, analytics, and content publishing'
  },
  {
    cat: 'AI engines / models',
    clovion: '1 on Starter, 3 on Growth, up to 6 on Enterprise',
    searchable: 'Select from up to 9 engines at onboarding; all models on Custom'
  },
  { cat: 'Prompt tracking', clovion: 'Included', searchable: 'Included' },
  {
    cat: 'Brands / projects',
    clovion: '1 brand on Starter, 2 on Growth, custom on Enterprise',
    searchable: '1 project on Pro, 10 on Scale, unlimited on Enterprise'
  },
  {
    cat: 'Recommendations',
    clovion: 'Limited on Starter, 20/month on Growth, custom on Enterprise',
    searchable: 'Not highlighted as a dedicated feature'
  },
  {
    cat: 'Brand perception',
    clovion: 'Available from Growth; shows how AI describes and positions your brand',
    searchable: 'Not positioned as a dedicated brand perception module'
  },
  {
    cat: 'Competitor analysis',
    clovion: '5 competitors on Starter, 10 on Growth, custom on Enterprise',
    searchable: 'Included on all plans'
  },
  {
    cat: 'Proof loop',
    clovion: 'Helps track whether fixes landed, had no impact, backfired, or remain inconclusive',
    searchable: 'Not highlighted as a dedicated workflow'
  },
  {
    cat: 'Natural-language analytics',
    clovion: 'Ask Clove available by plan',
    searchable: 'Available via MCP server on all plans'
  },
  { cat: 'Citation tracking', clovion: 'Included', searchable: 'Included' },
  {
    cat: 'Google Analytics',
    clovion: 'Included on all plans',
    searchable: 'Not highlighted; data exports on all plans, Looker Studio on Scale and up'
  }
]

const clovionPlans = [
  { name: 'Starter', price: '$119 / mo' },
  { name: 'Growth', price: '$319 / mo' },
  { name: 'Enterprise', price: 'Custom' }
]
const searchablePlans = [
  { name: 'Pro', price: '$125 / mo' },
  { name: 'Scale', price: '$400 / mo' },
  { name: 'Enterprise', price: '$999 / mo' },
  { name: 'Custom', price: 'Custom' }
]

const chooseClovion = [
  'You want the specific fix to make and proof it worked, not just tracking and content volume.',
  'You want per-brand depth — brand perception, fanout, and Ask Clove analytics.',
  'You want Google Analytics tied in on every plan.',
  'You prefer a focused fix-and-prove workflow over a broad all-in-one platform.'
]
const chooseSearchable = [
  'You want AEO content creation built in — Searchable publishes optimized articles, not just tracks visibility.',
  'You need the widest engine coverage (up to 9) plus agent analytics and AI shopping data.',
  'You want white-label reports and a dedicated AEO specialist for client work.'
]

// Visible FAQ copy — verbatim from the source HTML's FAQ section.
const faqs = [
  {
    q: 'Is Clovion a Searchable alternative?',
    a: 'Yes. Both track how your brand appears in AI answers across engines like ChatGPT, Claude, Perplexity, and Google AI Overviews. The difference is focus: Searchable is a broad AEO platform that also publishes optimized content, while Clovion concentrates on the improvement loop — diagnosing each gap, prescribing an earnable fix, and re-measuring to prove it worked.'
  },
  {
    q: 'What is the main difference between Clovion and Searchable?',
    a: 'Searchable tracks visibility across up to 9 engines, provides analytics, and publishes optimized content through its Content Studio. Clovion focuses on the fix-and-prove workflow — it diagnoses why a gap exists, recommends only fixes you can realistically earn, and gives each fix a verdict: Landed, Null, Backfired, or Inconclusive.'
  },
  {
    q: 'Which platform is cheaper to start with?',
    a: "Entry pricing is close: Clovion's Starter is $119/month and Searchable's Pro is $125/month. Searchable's Pro includes more raw capacity and content publishing, while Clovion's plans include the diagnosis-and-proof loop and per-brand depth like brand perception and Ask Clove that Searchable doesn't frame as a dedicated feature."
  },
  {
    q: 'Which AI engines does each platform track?',
    a: 'Clovion tracks up to 6 AI engines — ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews. Searchable tracks up to 9, selected at onboarding, adding Microsoft Copilot, DeepSeek, and Google AI Mode, with all models on its Custom plan. Searchable covers more engines; the two differ most in what happens after measurement.'
  },
  {
    q: 'Which platform is better for agencies?',
    a: 'Searchable offers white-label reports, a dedicated AEO specialist, and unlimited seats, suiting agencies running content-led AEO across many clients. Clovion fits agencies that need to show each client exactly what to fix and prove the result.'
  }
]

// FAQPage JSON-LD — preserved verbatim from the source HTML <head>. (The source's
// schema wording differs slightly from the visible FAQ copy above, so it is kept
// as its own object rather than derived, to honor "preserve the JSON-LD".)
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Clovion a Searchable alternative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Both platforms track how your brand appears in AI answers across engines like ChatGPT, Claude, Perplexity, and Google AI Overviews. The difference is focus: Searchable is a broad Answer Engine Optimization platform that also publishes optimized content, while Clovion concentrates on the improvement loop — diagnosing the specific gap behind each drop, prescribing an earnable fix, and re-measuring to prove it worked.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the main difference between Clovion and Searchable?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Searchable is a broad AEO platform: it tracks visibility across up to 9 answer engines, provides analytics, and publishes optimized content through its Content Studio. Clovion focuses on the fix-and-prove workflow — it diagnoses why a gap exists, recommends only fixes you can realistically earn, and tracks each fix as an experiment with a verdict of Landed, Null, Backfired, or Inconclusive.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which platform is cheaper to start with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Entry pricing is close: Clovion's Starter is $119/month and Searchable's Pro is $125/month. Searchable's Pro includes more raw capacity (100 prompts per model, 200 audits, and content publishing), while Clovion's plans include the diagnosis-and-proof loop and per-brand depth such as brand perception and Ask Clove analytics that Searchable does not frame as a dedicated feature."
      }
    },
    {
      '@type': 'Question',
      name: 'Which AI engines does each platform track?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clovion tracks up to 6 AI engines — ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews. Searchable tracks up to 9, selected at onboarding, adding Microsoft Copilot, DeepSeek, and Google AI Mode, with all models available on its Custom plan. On engine breadth, Searchable covers more; the two differ most in what happens after measurement.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which platform is better for agencies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Searchable offers white-label reports, a dedicated AEO specialist, and unlimited seats, which suits agencies running content-led AEO across many clients. Clovion fits agencies that need to show each client exactly what to fix and prove the result, rather than only tracking visibility and producing content volume.'
      }
    }
  ]
}

// ---------------------------------------------------------------------------
// Shared cell styles
// ---------------------------------------------------------------------------
const headCell: CSSProperties = {
  padding: '16px 20px',
  fontSize: '0.74rem',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  fontWeight: 600,
  color: 'var(--ink-60)'
}
const bodyCell: CSSProperties = { padding: '17px 20px', fontSize: '0.92rem', lineHeight: 1.55 }

// ---------------------------------------------------------------------------
// Small presentational helpers
// ---------------------------------------------------------------------------

function Flow({ steps, accent }: { steps: string[]; accent?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-y-2.5">
      {steps.map((s, i) => (
        <Fragment key={s}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              fontWeight: 600,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              padding: '8px 15px',
              borderRadius: 9,
              background: accent ? BRAND_TINT : 'var(--subtle)',
              color: accent ? BRAND : 'var(--ink-70)',
              border: `1px solid ${accent ? BRAND_BORDER : 'var(--line)'}`
            }}
          >
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: accent ? BRAND : 'var(--ink-40)'
              }}
            />
            {s}
          </span>
          {i < steps.length - 1 && (
            <span
              aria-hidden
              style={{
                width: 22,
                height: 2,
                margin: '0 7px',
                flex: '0 0 auto',
                background: accent ? BRAND : 'var(--ink-25)'
              }}
            />
          )}
        </Fragment>
      ))}
    </div>
  )
}

function Track({
  name,
  desc,
  steps,
  accent
}: {
  name: string
  desc: string
  steps: string[]
  accent?: boolean
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        border: `1px solid ${accent ? BRAND_BORDER : 'var(--line)'}`,
        borderLeft: `3px solid ${accent ? BRAND : 'var(--ink-25)'}`,
        background: 'var(--white)',
        padding: '24px 26px'
      }}
    >
      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: accent ? BRAND : 'var(--ink)' }}>{name}</div>
      <p style={{ margin: '5px 0 18px', fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--ink-60)' }}>{desc}</p>
      <Flow steps={steps} accent={accent} />
    </div>
  )
}

function PriceCard({
  name,
  who,
  plans,
  note,
  featured
}: {
  name: string
  who: string
  plans: { name: string; price: string }[]
  note: string
  featured?: boolean
}) {
  return (
    <div
      style={{
        borderRadius: 20,
        border: featured ? `1px solid ${BRAND}` : '1px solid var(--line)',
        boxShadow: featured ? `0 0 0 1px ${BRAND}, var(--shadow-soft)` : 'none',
        background: 'var(--white)',
        padding: 28
      }}
    >
      <h3
        style={{
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem',
          fontWeight: 600,
          color: 'var(--ink)'
        }}
      >
        {featured && <span aria-hidden style={{ width: 12, height: 12, borderRadius: 3, background: BRAND }} />}
        {name}
      </h3>
      <p style={{ margin: '6px 0 18px', fontSize: '0.85rem', color: 'var(--ink-60)' }}>{who}</p>
      {plans.map((p, i) => (
        <div
          key={p.name}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            padding: '11px 0',
            borderTop: i === 0 ? 'none' : '1px solid var(--line)',
            fontSize: '0.95rem'
          }}
        >
          <span style={{ color: 'var(--ink-80)' }}>{p.name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: featured ? BRAND : 'var(--ink)' }}>
            {p.price}
          </span>
        </div>
      ))}
      <p style={{ margin: '16px 0 0', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--ink-60)' }}>{note}</p>
    </div>
  )
}

function ChooseCard({ title, items, accent }: { title: string; items: string[]; accent?: boolean }) {
  return (
    <div
      style={{
        borderRadius: 20,
        border: '1px solid var(--line)',
        borderTop: `3px solid ${accent ? BRAND : 'var(--ink-25)'}`,
        background: 'var(--white)',
        padding: '28px 30px'
      }}
    >
      <h3
        style={{
          margin: '0 0 16px',
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: accent ? BRAND : 'var(--ink)'
        }}
      >
        {title}
      </h3>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((it, i) => (
          <li
            key={it}
            style={{
              position: 'relative',
              padding: '11px 0 11px 26px',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              color: 'var(--ink-80)',
              borderTop: i === 0 ? 'none' : '1px solid var(--line)'
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: 2,
                top: 18,
                width: 9,
                height: 9,
                borderRadius: 999,
                background: accent ? BRAND : 'var(--ink-30)'
              }}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}

const COLS = '1fr 1.25fr 1.25fr'

function TableHead({ label }: { label: string }) {
  return (
    <div
      className="grid"
      style={{ gridTemplateColumns: COLS, borderBottom: '1px solid var(--line)', background: 'var(--subtle)' }}
    >
      <div style={headCell}>{label}</div>
      <div
        style={{
          ...headCell,
          color: BRAND,
          background: BRAND_TINT,
          borderLeft: `1px solid ${BRAND_BORDER}`,
          borderRight: `1px solid ${BRAND_BORDER}`
        }}
      >
        Clovion
      </div>
      <div style={headCell}>Searchable</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClovionVsSearchablePage() {
  return (
    <div
      className="clv-searchable-light"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.clv-searchable-light .eyebrow { color: ${BRAND}; }
.clv-searchable-light .eyebrow-dot::before { background: ${BRAND}; box-shadow: 0 0 0 4px rgba(194,65,12,0.12); }
`
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO --------------------------------------------------------------- */}
      <Section className="section-y-xl">
        <Container>
          <div className="text-center" data-track-location="compare_searchable_hero">
            <h1
              className="mx-auto text-balance"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.12,
                fontSize: 'clamp(2.15rem, 4.6vw, 3.15rem)',
                maxWidth: 900
              }}
            >
              Clovion vs Searchable: <span style={{ color: BRAND }}>multi-engine AI visibility comparison</span>
            </h1>
            <p
              className="mt-6 mx-auto"
              style={{ color: 'var(--ink-70)', fontSize: '1.02rem', lineHeight: 1.65, maxWidth: 720 }}
            >
              Clovion and Searchable both track how your brand shows up in AI answers. The difference: Clovion
              diagnoses each visibility gap, prescribes an earnable fix, and proves whether it worked. Searchable is a
              broader AEO platform that also publishes optimized content and tracks a wider set of engines.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="compare_searchable_hero">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="#pricing" variant="secondary" size="lg" trackLocation="compare_searchable_hero">
                Compare pricing
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* CORE DIFFERENCE ---------------------------------------------------- */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>How they differ</Eyebrow>
            <h2 className="display-md mt-5 text-balance">Both measure. Then they diverge.</h2>
            <p className="lead mt-5" style={{ color: 'var(--ink-70)' }}>
              Searchable is a broad AEO platform — it tracks visibility across engines and publishes optimized content
              to improve it. Clovion focuses on the improvement loop: it diagnoses the specific gap behind each drop,
              prescribes an earnable fix, and re-measures to prove it worked.
            </p>
          </div>
          <div className="mt-11 grid grid-cols-1 gap-4">
            <Track
              name="Searchable"
              desc="Tracks visibility across up to 9 engines, analyzes citations and competitors, and publishes optimized content."
              steps={searchableFlow}
            />
            <Track
              name="Clovion"
              desc="Diagnoses each gap and adds a proof step — every fix is re-measured against a baseline and given a clear verdict."
              steps={clovionFlow}
              accent
            />
          </div>
        </Container>
      </Section>

      {/* AT A GLANCE -------------------------------------------------------- */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>At a glance</Eyebrow>
            <h2 className="display-md mt-5 text-balance">Feature by feature.</h2>
            <p className="lead mt-5" style={{ color: 'var(--ink-70)' }}>
              How Clovion and Searchable line up across the capabilities that matter most.
            </p>
          </div>
          <div className="mt-11 -mx-4 overflow-x-auto md:mx-0 md:overflow-visible">
            <div className="min-w-[640px] px-4 md:min-w-0 md:px-0">
              <div style={{ overflow: 'hidden', borderRadius: 18, border: '1px solid var(--line)', background: 'var(--white)' }}>
                <TableHead label="Category" />
                {glance.map((row, idx) => (
                  <div
                    key={row.cat}
                    className="grid"
                    style={{
                      gridTemplateColumns: COLS,
                      borderBottom: idx === glance.length - 1 ? 'none' : '1px solid var(--line)'
                    }}
                  >
                    <div style={{ ...bodyCell, fontWeight: 600, color: 'var(--ink)' }}>{row.cat}</div>
                    <div
                      style={{
                        ...bodyCell,
                        color: 'var(--ink-80)',
                        background: BRAND_TINT,
                        borderLeft: `1px solid ${BRAND_BORDER}`,
                        borderRight: `1px solid ${BRAND_BORDER}`
                      }}
                    >
                      {row.clovion}
                    </div>
                    <div style={{ ...bodyCell, color: 'var(--ink-60)' }}>{row.searchable}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* PRICING ------------------------------------------------------------ */}
      <Section id="pricing">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="display-md mt-5 text-balance">Side by side.</h2>
            <p className="lead mt-5" style={{ color: 'var(--ink-70)' }}>
              Entry pricing is close. Searchable&apos;s tiers scale on prompts, audits, and articles; note the
              Enterprise tier is a fixed $999/mo rather than custom.
            </p>
          </div>
          <div className="mt-11 grid grid-cols-1 gap-5 md:grid-cols-2">
            <PriceCard
              name="Clovion"
              who="All plans include the fix & proof loop"
              plans={clovionPlans}
              note="Starter: 1 engine, 50 prompts. Growth: 3 engines, brand perception, fanout, integrations. Enterprise: 6 engines, AI agents, custom everything."
              featured
            />
            <PriceCard
              name="Searchable"
              who="Broad AEO platform · unlimited seats"
              plans={searchablePlans}
              note="Prompts per model: 100 / 500 / 1,250. Articles per month: 20 / 80 / 200. MCP on all plans; Looker Studio and white-label reports from Scale."
            />
          </div>
        </Container>
      </Section>

      {/* CHOOSE WHICH ------------------------------------------------------- */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Which to choose</Eyebrow>
            <h2 className="display-md mt-5 text-balance">The right fit for your team.</h2>
          </div>
          <div className="mt-11 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ChooseCard title="When to choose Clovion" items={chooseClovion} accent />
            <ChooseCard title="When to choose Searchable" items={chooseSearchable} />
          </div>
        </Container>
      </Section>

      {/* FAQ ---------------------------------------------------------------- */}
      <FAQAccordion headline="Common questions" items={faqs} />

      {/* CTA ---------------------------------------------------------------- */}
      <Section>
        <Container>
          <div
            className="clv-dark relative isolate overflow-hidden rounded-[28px] px-8 md:px-14 py-16 md:py-20 text-center"
            data-track-location="compare_searchable_final_cta"
            style={{ background: 'var(--ink-surface, var(--ink))', color: 'var(--on-ink)' }}
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                opacity: 0.6,
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
            <h2
              className="mx-auto text-balance"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.12,
                fontSize: 'clamp(1.8rem, 3.4vw, 2.5rem)',
                maxWidth: 640,
                color: 'var(--on-ink)'
              }}
            >
              See what to fix — not just where you stand.
            </h2>
            <p className="mt-5 mx-auto" style={{ fontSize: '1.02rem', lineHeight: 1.55, maxWidth: 520, color: 'var(--on-ink-70)' }}>
              Start a free trial and see exactly what to fix. No card required.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="compare_searchable_final_cta">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="compare_searchable_final_cta">
                Get Free Score
              </Button>
            </div>
          </div>

          <p className="mt-10 text-center" style={{ fontSize: '0.8rem', color: 'var(--ink-40)' }}>
            <strong style={{ color: 'var(--ink-60)', fontWeight: 600 }}>Searchable details</strong> sourced from
            searchable.com/pricing · <strong style={{ color: 'var(--ink-60)', fontWeight: 600 }}>Last verified:</strong>{' '}
            July 2026. Competitor pricing and features change frequently.
          </p>
        </Container>
      </Section>
    </div>
  )
}

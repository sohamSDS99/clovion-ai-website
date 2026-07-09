import type { CSSProperties } from 'react'
import { Fragment } from 'react'
import { Section, Container, Button, Eyebrow, ArrowRight, Check } from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'

export const metadata = {
  title: 'Clovion vs Profound: Multi-engine AI visibility comparison',
  description:
    'Clovion vs Profound compared. Both track brand visibility across AI answers; Profound is an enterprise AEO platform that gates most engines to its custom plan, while Clovion is self-serve and proves each fix. Engines, pricing, and best fit.'
}

// ---------------------------------------------------------------------------
// Brand palette — light homepage theme (#FAF9F7) + the "Clove" orange accent
// (#C2410C). Orange marks the Clovion side + CTAs; the Profound side + neutral
// areas stay ink-on-warm-white, so "ours" always reads as the branded column.
// See COMPARISON_TEMPLATE.md — tokens pulled from the vs Peec AI page, NOT from
// the source HTML's placeholder hexes.
// ---------------------------------------------------------------------------
const BRAND = '#C2410C'
const BRAND_TINT = '#FBEEE7'
const BRAND_BORDER = 'rgba(194,65,12,0.22)'

// ---------------------------------------------------------------------------
// Content — verbatim from clovion-vs-profound.html. Do not paraphrase.
// ---------------------------------------------------------------------------

const profoundFlow = ['Measure', 'Analyze', 'Automate']
const clovionFlow = ['Measure', 'Diagnose', 'Recommend', 'Prove']

const glance: { cat: string; clovion: string; profound: string }[] = [
  {
    cat: 'Core focus',
    clovion: 'AI visibility tracking, diagnosis, recommendations, and improvement workflow',
    profound: 'Enterprise AEO platform — visibility tracking, AI agents, and traffic attribution'
  },
  {
    cat: 'AI engines / models',
    clovion: '1 on Starter, 3 on Growth, up to 6 on Enterprise',
    profound: 'ChatGPT only on Starter, 3 on Growth, up to 10 on Enterprise'
  },
  { cat: 'Prompt tracking', clovion: 'Included', profound: 'Included' },
  {
    cat: 'Brands / projects',
    clovion: '1 brand on Starter, 2 on Growth, custom on Enterprise',
    profound: '1 company on Starter and Growth, multiple on Enterprise'
  },
  {
    cat: 'Recommendations',
    clovion: 'Limited on Starter, 20/month on Growth, custom on Enterprise',
    profound: 'Opportunities — none on Starter, 4/week on Growth, custom on Enterprise'
  },
  {
    cat: 'Brand perception',
    clovion: 'Available from Growth; shows how AI describes and positions your brand',
    profound: 'Not positioned as a dedicated brand perception module'
  },
  {
    cat: 'Competitor analysis',
    clovion: '5 competitors on Starter, 10 on Growth, custom on Enterprise',
    profound: 'Included on all plans'
  },
  {
    cat: 'Proof loop',
    clovion: 'Helps track whether fixes landed, had no impact, backfired, or remain inconclusive',
    profound: 'Not highlighted as a dedicated workflow'
  },
  {
    cat: 'Natural-language analytics',
    clovion: 'Ask Clove available by plan',
    profound: 'Not highlighted as a dedicated feature (offers AI content agents)'
  },
  { cat: 'Citation tracking', clovion: 'Included', profound: 'Included' },
  {
    cat: 'Google Analytics',
    clovion: 'Included on all plans',
    profound: 'Included on all plans (via Agent Analytics integrations)'
  }
]

// Profound cell may be a "yes" (supported) or a plain-text limitation.
const engines: { name: string; profound: true | string }[] = [
  { name: 'ChatGPT', profound: true },
  { name: 'Google AI Overviews', profound: 'Yes (Growth+)' },
  { name: 'Perplexity', profound: 'Yes (Growth+)' },
  { name: 'Gemini', profound: 'Enterprise only' },
  { name: 'Claude', profound: 'Enterprise only' },
  { name: 'Grok', profound: 'Enterprise only' }
]

const clovionPlans = [
  { name: 'Starter', price: '$119 / mo' },
  { name: 'Growth', price: '$319 / mo' },
  { name: 'Enterprise', price: 'Custom' }
]
const profoundPlans = [
  { name: 'Starter', price: '$99 / mo*' },
  { name: 'Growth', price: '$399 / mo*' },
  { name: 'Enterprise', price: 'Custom' }
]

const chooseClovion = [
  "You want to see how AI describes and positions your brand — Clovion's brand perception shows the narrative behind the numbers.",
  'You want a built-in brand audit of your AI visibility, included from Growth.',
  'You want the specific fix to make and proof it worked — not just data and content agents.',
  'You want to choose an engine like Claude or Grok on Growth, without a custom Enterprise plan.'
]
const chooseProfound = [
  "You're an enterprise wanting the deepest platform — up to 10 engines and search-volume data.",
  'You want autonomous AI agents that generate and optimize content at scale.',
  'You need AI-traffic attribution across your domains plus SSO/SAML and SOC2.'
]

// Visible FAQ copy — verbatim from the source HTML's FAQ section.
const faqs = [
  {
    q: 'Is Clovion a Profound alternative?',
    a: 'Yes — and for most teams, a more practical one. Both track your brand across AI answers, but Profound locks its best engine coverage and data behind a custom-priced Enterprise plan, while Clovion gives you engines like Claude and Grok on self-serve plans and goes a step further: it diagnoses each visibility gap, prescribes the fix to make, and proves whether it worked. You get the action and the proof without an enterprise contract.'
  },
  {
    q: 'What is the main difference between Clovion and Profound?',
    a: "Profound shows you data and generates content; Clovion turns visibility into results you can verify. Profound is enterprise-oriented and powerful, but its full engine coverage sits on a custom plan and it doesn't offer a dedicated proof loop. Clovion diagnoses why a gap exists, recommends only fixes you can realistically earn, and gives each one a clear verdict — Landed, Null, Backfired, or Inconclusive — so you know what actually moved your visibility."
  },
  {
    q: 'Which platform is cheaper to start with?',
    a: "Clovion is the better value for growing teams. Profound's $99 Starter (billed yearly) tracks ChatGPT only, so to follow more than one engine you jump to its $399 Growth plan — where Clovion's Growth is $319 and lets you choose engines like Claude and Grok. You get broader coverage and the fix-and-prove workflow for less, with no custom Enterprise upgrade required."
  },
  {
    q: 'Which AI engines does each platform track?',
    a: 'Clovion gives you more engine choice without going enterprise. It tracks up to 6 engines — ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews — selectable on its regular plans. Profound covers up to 10 engines in total, but only on its custom Enterprise plan: its Starter is ChatGPT-only and Growth is limited to three fixed engines, so Claude, Grok, and Gemini stay out of reach unless you upgrade to enterprise.'
  },
  {
    q: 'Which platform is better for agencies and growing teams?',
    a: "Clovion, in most cases. It's self-serve, covers Claude and Grok without an enterprise contract, and lets agencies show each client exactly what to fix and prove the result — not just report where visibility stands. Profound is a strong fit for large enterprises that need content agents and traffic attribution at scale with custom pricing, but for growing teams and agencies that want results without enterprise overhead, Clovion is the more practical choice."
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
      name: 'Is Clovion a Profound alternative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, and for most teams a more practical one. Both track your brand across AI answers, but Profound locks its best engine coverage and data behind a custom-priced Enterprise plan, while Clovion gives you engines like Claude and Grok on self-serve plans and goes a step further: it diagnoses each visibility gap, prescribes the fix to make, and proves whether it worked. You get the action and the proof without an enterprise contract.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the main difference between Clovion and Profound?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Profound shows you data and generates content; Clovion turns visibility into results you can verify. Profound is enterprise-oriented and powerful, but its full engine coverage sits on a custom plan and it does not offer a dedicated proof loop. Clovion diagnoses why a gap exists, recommends only fixes you can realistically earn, and gives each one a clear verdict — Landed, Null, Backfired, or Inconclusive — so you know what actually moved your visibility.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which platform is cheaper to start with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Clovion is the better value for growing teams. Profound's $99 Starter (billed yearly) tracks ChatGPT only, so to follow more than one engine you jump to its $399 Growth plan — where Clovion's Growth is $319 and lets you choose engines like Claude and Grok. You get broader coverage and the fix-and-prove workflow for less, with no custom Enterprise upgrade required."
      }
    },
    {
      '@type': 'Question',
      name: 'Which AI engines does each platform track?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clovion gives you more engine choice without going enterprise. It tracks up to 6 engines — ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews — selectable on its regular plans. Profound covers up to 10 engines in total, but only on its custom Enterprise plan: its Starter is ChatGPT-only and Growth is limited to three fixed engines, so Claude, Grok, and Gemini stay out of reach unless you upgrade to enterprise.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which platform is better for agencies and growing teams?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clovion, in most cases. It is self-serve, covers Claude and Grok without an enterprise contract, and lets agencies show each client exactly what to fix and prove the result — not just report where visibility stands. Profound is a strong fit for large enterprises that need content agents and traffic attribution at scale with custom pricing, but for growing teams and agencies that want results without enterprise overhead, Clovion is the more practical choice.'
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

function EngineProfoundCell({ value }: { value: true | string }) {
  if (value === true) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.92rem', color: 'var(--ink-70)' }}>
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            height: 22,
            width: 22,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 999,
            background: 'var(--subtle)',
            border: '1px solid var(--line)',
            color: 'var(--ink-70)'
          }}
        >
          <Check className="h-3 w-3" />
        </span>
        Yes
      </span>
    )
  }
  return <span style={{ fontSize: '0.9rem', color: 'var(--ink-50)' }}>{value}</span>
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
      <div style={headCell}>Profound</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClovionVsProfoundPage() {
  return (
    <div
      className="clv-profound-light"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.clv-profound-light .eyebrow { color: ${BRAND}; }
.clv-profound-light .eyebrow-dot::before { background: ${BRAND}; box-shadow: 0 0 0 4px rgba(194,65,12,0.12); }
`
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO --------------------------------------------------------------- */}
      <Section className="section-y-xl">
        <Container>
          <div className="text-center" data-track-location="compare_profound_hero">
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
              Clovion vs Profound: <span style={{ color: BRAND }}>multi-engine AI visibility comparison</span>
            </h1>
            <p
              className="mt-6 mx-auto"
              style={{ color: 'var(--ink-70)', fontSize: '1.02rem', lineHeight: 1.65, maxWidth: 720 }}
            >
              Clovion and Profound both track how your brand shows up in AI answers. The difference: Profound is an
              enterprise platform — engines like Claude and Grok sit behind its custom Enterprise plan. Clovion is
              self-serve, includes those engines on regular plans, and proves whether each fix worked.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="compare_profound_hero">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="#pricing" variant="secondary" size="lg" trackLocation="compare_profound_hero">
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
              Profound is an enterprise-grade AEO platform — it tracks visibility, runs AI agents that generate
              content, and attributes AI-sourced traffic across your domains. Clovion focuses on the improvement loop:
              it diagnoses the specific gap behind each drop, prescribes an earnable fix, and re-measures to prove it
              worked.
            </p>
          </div>
          <div className="mt-11 grid grid-cols-1 gap-4">
            <Track
              name="Profound"
              desc="Tracks visibility, benchmarks competitors, runs autonomous content agents, and attributes AI-sourced traffic."
              steps={profoundFlow}
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
              How Clovion and Profound line up across the capabilities that matter most.
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
                    <div style={{ ...bodyCell, color: 'var(--ink-60)' }}>{row.profound}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ENGINE COVERAGE ---------------------------------------------------- */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Engine coverage</Eyebrow>
            <h2 className="display-md mt-5 text-balance">Which AI models each one watches.</h2>
            <p className="lead mt-5" style={{ color: 'var(--ink-70)' }}>
              Both cover the major engines, but Profound gates most of them to its enterprise tier. On Clovion, engines
              like Claude and Grok are available on regular plans; on Profound they require the custom-priced Enterprise
              plan.
            </p>
          </div>
          <div className="mt-11 -mx-4 overflow-x-auto md:mx-0 md:overflow-visible">
            <div className="min-w-[560px] px-4 md:min-w-0 md:px-0">
              <div style={{ overflow: 'hidden', borderRadius: 18, border: '1px solid var(--line)', background: 'var(--white)' }}>
                <TableHead label="AI engine" />
                {engines.map((e, idx) => (
                  <div
                    key={e.name}
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: COLS,
                      borderBottom: idx === engines.length - 1 ? 'none' : '1px solid var(--line)'
                    }}
                  >
                    <div style={{ ...bodyCell, fontWeight: 600, color: 'var(--ink)' }}>{e.name}</div>
                    <div
                      style={{
                        ...bodyCell,
                        background: BRAND_TINT,
                        borderLeft: `1px solid ${BRAND_BORDER}`,
                        borderRight: `1px solid ${BRAND_BORDER}`
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 600, color: BRAND }}>
                        <span
                          aria-hidden
                          style={{
                            display: 'inline-flex',
                            height: 22,
                            width: 22,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 999,
                            background: BRAND,
                            color: '#fff'
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        Yes
                      </span>
                    </div>
                    <div style={bodyCell}>
                      <EngineProfoundCell value={e.profound} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-3xl" style={{ fontSize: '0.85rem', color: 'var(--ink-50)' }}>
            Clovion access scales by tier (1 / 3 / 6 engines), selectable from the six. Profound&apos;s Starter tracks
            ChatGPT only and Growth covers three fixed engines; Claude, Grok, Gemini and others require its custom
            Enterprise plan, which tracks up to 10.
          </p>
        </Container>
      </Section>

      {/* PRICING ------------------------------------------------------------ */}
      <Section id="pricing">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="display-md mt-5 text-balance">Side by side.</h2>
            <p className="lead mt-5" style={{ color: 'var(--ink-70)' }}>
              Profound&apos;s headline prices are billed yearly, and its Starter tracks ChatGPT only. Full engine
              coverage and search-volume data sit on the custom Enterprise plan.
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
              name="Profound"
              who="Enterprise AEO platform · agents & attribution"
              plans={profoundPlans}
              note="*Billed yearly. Starter: ChatGPT only, 50 prompts. Growth: 3 engines, 100 prompts, Opportunities, exports. Enterprise: up to 10 engines, prompt-volume data, API, SSO/SAML, SOC2."
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
            <ChooseCard title="When to choose Profound" items={chooseProfound} />
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
            data-track-location="compare_profound_final_cta"
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
              <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="compare_profound_final_cta">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="compare_profound_final_cta">
                Get Free Score
              </Button>
            </div>
          </div>

          <p className="mt-10 text-center" style={{ fontSize: '0.8rem', color: 'var(--ink-40)' }}>
            <strong style={{ color: 'var(--ink-60)', fontWeight: 600 }}>Profound details</strong> sourced from
            tryprofound.com/pricing · <strong style={{ color: 'var(--ink-60)', fontWeight: 600 }}>Last verified:</strong>{' '}
            July 2026. Competitor pricing and features change frequently.
          </p>
        </Container>
      </Section>
    </div>
  )
}

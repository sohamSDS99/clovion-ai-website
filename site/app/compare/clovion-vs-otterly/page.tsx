import type { CSSProperties } from 'react'
import { Fragment } from 'react'
import { Section, Container, Button, Eyebrow, ArrowRight, Check } from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'

export const metadata = {
  title: 'Clovion vs Otterly AI: Multi-engine AI visibility comparison',
  description:
    'Clovion vs Otterly AI compared. Both track brand visibility across AI answers; Clovion adds the diagnose, fix, and prove layer and includes engines Otterly charges extra for. Engines, pricing, and best fit.'
}

// ---------------------------------------------------------------------------
// Brand palette — light homepage theme (#FAF9F7) + the "Clove" orange accent
// (#C2410C). Orange marks the Clovion side + CTAs; the Otterly side + neutral
// areas stay ink-on-warm-white, so "ours" always reads as the branded column.
// See COMPARISON_TEMPLATE.md — tokens pulled from the vs Peec AI page, NOT from
// the source HTML's placeholder hexes.
// ---------------------------------------------------------------------------
const BRAND = '#C2410C'
const BRAND_TINT = '#FBEEE7'
const BRAND_BORDER = 'rgba(194,65,12,0.22)'

// ---------------------------------------------------------------------------
// Content — verbatim from clovion-vs-otterly.html. Do not paraphrase.
// ---------------------------------------------------------------------------

const otterlyFlow = ['Measure', 'Audit', 'Recommend']
const clovionFlow = ['Measure', 'Diagnose', 'Recommend', 'Prove']

const glance: { cat: string; clovion: string; otterly: string }[] = [
  {
    cat: 'Core focus',
    clovion: 'AI visibility tracking, diagnosis, recommendations, and improvement workflow',
    otterly: 'AI search visibility monitoring, GEO audits, and reporting'
  },
  {
    cat: 'AI engines / models',
    clovion: '1 on Starter, 3 on Growth, up to 6 on Enterprise',
    otterly: '4 core engines on every plan; Claude, Gemini, and AI Mode as paid add-ons'
  },
  { cat: 'Prompt tracking', clovion: 'Included', otterly: 'Included' },
  {
    cat: 'Brands / projects',
    clovion: '1 brand on Starter, 2 on Growth, custom on Enterprise',
    otterly: '1 workspace on Lite, unlimited on Standard and Premium'
  },
  {
    cat: 'Recommendations',
    clovion: 'Limited on Starter, 20/month on Growth, custom on Enterprise',
    otterly: '3 per week on Lite, unlimited on Standard and Premium (from GEO audits)'
  },
  {
    cat: 'Brand perception',
    clovion: 'Available from Growth; shows how AI describes and positions your brand',
    otterly: 'Tracks sentiment; not positioned as a dedicated brand perception module'
  },
  {
    cat: 'Competitor analysis',
    clovion: '5 competitors on Starter, 10 on Growth, custom on Enterprise',
    otterly: 'Included via competitor benchmarking and share of voice'
  },
  {
    cat: 'Proof loop',
    clovion: 'Helps track whether fixes landed, had no impact, backfired, or remain inconclusive',
    otterly: 'Not highlighted as a dedicated workflow'
  },
  {
    cat: 'Natural-language analytics',
    clovion: 'Ask Clove available by plan',
    otterly: 'Available via public API and MCP server on Standard and Premium'
  },
  { cat: 'Citation tracking', clovion: 'Included', otterly: 'Included' },
  {
    cat: 'Google Analytics',
    clovion: 'Included on all plans',
    otterly: 'Not highlighted on public pricing page (Looker Studio connector on Standard+)'
  }
]

// Otterly cell may be a "yes" (supported) or a plain-text limitation.
const engines: { name: string; otterly: true | string }[] = [
  { name: 'ChatGPT', otterly: true },
  { name: 'Google AI Overviews', otterly: true },
  { name: 'Perplexity', otterly: true },
  { name: 'Gemini', otterly: 'Paid add-on' },
  { name: 'Claude', otterly: 'Paid add-on' },
  { name: 'Grok', otterly: 'Not offered' }
]

const clovionPlans = [
  { name: 'Starter', price: '$119 / mo' },
  { name: 'Growth', price: '$319 / mo' },
  { name: 'Enterprise', price: 'Custom' }
]
const otterlyPlans = [
  { name: 'Lite', price: '$29 / mo' },
  { name: 'Standard', price: '$189 / mo' },
  { name: 'Premium', price: '$489 / mo' },
  { name: 'Enterprise', price: 'Custom' }
]

const chooseClovion = [
  'You want the specific fix to make, not just an audit score.',
  'You want proof a change actually moved your visibility.',
  'You track Claude or Grok without paying per-engine add-ons.',
  'You want Google Analytics tied in on every plan.'
]
const chooseOtterly = [
  'You want the lowest-cost way in — plans start at $29/month.',
  'You need unlimited team seats and 50+ country tracking on every plan.',
  'You want a public API, MCP server, and Looker Studio reporting for your own stack.'
]

// Visible FAQ copy — verbatim from the source HTML's FAQ section.
const faqs = [
  {
    q: 'Is Clovion an Otterly AI alternative?',
    a: 'Yes. Both track how your brand appears in AI answers across engines like ChatGPT, Perplexity, and Google AI Overviews. The difference is what happens next: Otterly monitors visibility and runs GEO audits that surface recommendations, while Clovion diagnoses each gap, prescribes an earnable fix, and re-measures to prove it worked. Clovion also includes engines like Claude and Gemini in-plan, where Otterly charges for them as add-ons.'
  },
  {
    q: 'What is the main difference between Clovion and Otterly AI?',
    a: 'Otterly AI tracks visibility across engines, analyzes citations, and runs GEO audits that suggest what to improve. Clovion runs the same measurement per model, then diagnoses why a gap exists, recommends only fixes you can realistically earn, and tracks each as an experiment with a verdict: Landed, Null, Backfired, or Inconclusive.'
  },
  {
    q: 'Which platform is cheaper to start with?',
    a: "Otterly AI is cheaper at entry: Lite is $29/month with 15 prompts and 4 engines, versus Clovion's $119/month Starter. But Otterly charges extra for Claude, Gemini, and AI Mode ($9–$439/month each), while Clovion includes its engines in-plan and adds the recommendation and proof loop Otterly doesn't offer."
  },
  {
    q: 'How many AI engines do Clovion and Otterly AI track?',
    a: "Clovion tracks up to 6 AI engines — ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews — with the full set on higher tiers. Otterly AI includes 4 core engines on every plan (ChatGPT, Google AI Overviews, Perplexity, Microsoft Copilot); Claude, Gemini, and Google AI Mode are paid add-ons ($9–$439/month each) and Grok isn't offered."
  },
  {
    q: 'Which platform is better for agencies?',
    a: 'Otterly AI has strong agency features — unlimited seats, unlimited client workspaces, white-labeled Looker Studio reporting, and an Agency Partner program — suiting agencies focused on multi-client monitoring. Clovion fits agencies that need to show each client exactly what to fix and prove the result.'
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
      name: 'Is Clovion an Otterly AI alternative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Both platforms track how your brand appears in AI answers across engines like ChatGPT, Perplexity, and Google AI Overviews. The difference is what happens next: Otterly monitors visibility and runs GEO audits that surface recommendations, while Clovion diagnoses the specific gap behind each one, prescribes an earnable fix, and re-measures to prove whether it worked. Clovion also includes engines such as Claude and Gemini in-plan, whereas Otterly charges for them as add-ons.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the main difference between Clovion and Otterly AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Otterly AI is an AI search monitoring and GEO tool: it tracks visibility across engines, analyzes citations, and runs GEO audits that suggest what to improve. Clovion runs the same measurement per model, then diagnoses why a gap exists, recommends only fixes you can realistically earn, and tracks each fix as an experiment with a verdict of Landed, Null, Backfired, or Inconclusive.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which platform is cheaper to start with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Otterly AI is cheaper at entry: its Lite plan is $29/month with 15 prompts and 4 AI engines, versus Clovion's $119/month Starter. Note that Otterly charges extra for Claude, Gemini, and Google AI Mode ($9 to $439/month each), while Clovion includes its engines within each plan and adds a ranked fix list and proof loop that Otterly does not offer."
      }
    },
    {
      '@type': 'Question',
      name: 'How many AI engines do Clovion and Otterly AI track?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Clovion tracks up to 6 AI engines — ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews — with the full set available on higher tiers. Otterly AI includes 4 core engines on every plan (ChatGPT, Google AI Overviews, Perplexity, and Microsoft Copilot); Claude, Google Gemini, and Google AI Mode are paid add-ons ($9 to $439/month each) and Grok is not offered.'
      }
    },
    {
      '@type': 'Question',
      name: 'Which platform is better for agencies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Otterly AI has strong agency features — unlimited team seats, unlimited client workspaces, white-labeled Looker Studio reporting, and an Agency Partner program — which suits agencies focused on multi-client monitoring and reporting. Clovion fits agencies that need to show each client exactly what to fix and prove the result, rather than only reporting where visibility stands.'
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

function EngineOtterlyCell({ value }: { value: true | string }) {
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
      <div style={headCell}>Otterly AI</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClovionVsOtterlyPage() {
  return (
    <div
      className="clv-otterly-light"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.clv-otterly-light .eyebrow { color: ${BRAND}; }
.clv-otterly-light .eyebrow-dot::before { background: ${BRAND}; box-shadow: 0 0 0 4px rgba(194,65,12,0.12); }
`
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO --------------------------------------------------------------- */}
      <Section className="section-y-xl">
        <Container>
          <div className="text-center" data-track-location="compare_otterly_hero">
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
              Clovion vs Otterly AI: <span style={{ color: BRAND }}>multi-engine AI visibility comparison</span>
            </h1>
            <p
              className="mt-6 mx-auto"
              style={{ color: 'var(--ink-70)', fontSize: '1.02rem', lineHeight: 1.65, maxWidth: 720 }}
            >
              Clovion and Otterly AI both track how your brand shows up in AI answers. The difference: Clovion covers 6
              AI engines — including Claude and Grok — and tells you what to fix and how much it should help. Otterly
              covers 4 engines on every plan (Claude, Gemini, and AI Mode cost extra) and focuses on visibility
              tracking and GEO audits.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="compare_otterly_hero">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="#pricing" variant="secondary" size="lg" trackLocation="compare_otterly_hero">
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
            <h2 className="display-md mt-5 text-balance">Both measure and recommend.</h2>
            <p className="lead mt-5" style={{ color: 'var(--ink-70)' }}>
              Otterly AI tracks visibility across engines and runs GEO audits that suggest what to improve. Clovion
              runs that same groundwork, then diagnoses the specific gap behind each recommendation and re-measures to
              confirm the fix moved your visibility.
            </p>
          </div>
          <div className="mt-11 grid grid-cols-1 gap-4">
            <Track
              name="Otterly AI"
              desc="Tracks visibility and citations, benchmarks competitors, and runs GEO audits that surface recommendations."
              steps={otterlyFlow}
            />
            <Track
              name="Clovion"
              desc="Adds a diagnosis for each gap and a proof step — every fix is re-measured against a baseline and given a clear verdict."
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
              How Clovion and Otterly AI line up across the capabilities that matter most.
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
                    <div style={{ ...bodyCell, color: 'var(--ink-60)' }}>{row.otterly}</div>
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
              Both cover the major AI engines. The difference is what&apos;s included: Clovion bundles Claude, Gemini,
              and Grok in its plans, while Otterly charges for Claude, Gemini, and AI Mode as add-ons and doesn&apos;t
              offer Grok.
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
                      <EngineOtterlyCell value={e.otterly} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-3xl" style={{ fontSize: '0.85rem', color: 'var(--ink-50)' }}>
            Clovion access scales by tier (1 / 3 / 6 engines). Otterly includes 4 core engines on every plan; Claude,
            Google Gemini, and Google AI Mode are paid add-ons ($9–$439/mo each).
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
              Both offer a custom Enterprise tier. Otterly is cheaper at entry, but its headline price covers 4
              engines — budget for add-ons if you need Claude, Gemini, or AI Mode.
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
              name="Otterly AI"
              who="Monitoring & GEO audits · unlimited seats"
              plans={otterlyPlans}
              note="4 core engines included. Add-ons: Claude, Gemini, or AI Mode at $9–$439/mo each; +100 prompts at $99/mo (Standard & Premium)."
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
            <ChooseCard title="When to choose Otterly AI" items={chooseOtterly} />
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
            data-track-location="compare_otterly_final_cta"
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
              <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="compare_otterly_final_cta">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="compare_otterly_final_cta">
                Get Free Score
              </Button>
            </div>
          </div>

          <p className="mt-10 text-center" style={{ fontSize: '0.8rem', color: 'var(--ink-40)' }}>
            <strong style={{ color: 'var(--ink-60)', fontWeight: 600 }}>Otterly AI details</strong> sourced from
            otterly.ai/pricing · <strong style={{ color: 'var(--ink-60)', fontWeight: 600 }}>Last verified:</strong>{' '}
            July 2026. Competitor pricing and features change frequently.
          </p>
        </Container>
      </Section>
    </div>
  )
}

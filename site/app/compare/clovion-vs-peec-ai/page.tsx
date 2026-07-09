import type { CSSProperties } from 'react'
import { Fragment } from 'react'
import { Section, Container, Button, Eyebrow, ArrowRight, Check, HeroShade } from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'

export const metadata = {
  title: 'Clovion vs Peec AI: Multi-engine AI visibility comparison',
  description:
    "Clovion vs Peec AI compared. Both track brand visibility across AI answers; Clovion adds the diagnose, fix, and prove layer Peec doesn't have. Engines, pricing, and best fit."
}

// ---------------------------------------------------------------------------
// Brand palette — light homepage theme (#FAF9F7) + the "Clove" orange accent
// (#C2410C). Orange marks the Clovion side + CTAs; the Peec side + neutral
// areas stay ink-on-warm-white, so "ours" always reads as the branded column.
// ---------------------------------------------------------------------------
const BRAND = '#C2410C'
const BRAND_TINT = '#FBEEE7'
const BRAND_BORDER = 'rgba(194,65,12,0.22)'

// ---------------------------------------------------------------------------
// Content — from the final source. Do not paraphrase.
// ---------------------------------------------------------------------------

const peecFlow = ['Measure', 'Benchmark', 'Recommend']
const clovionFlow = ['Measure', 'Diagnose', 'Recommend', 'Prove']

const glance: { cat: string; clovion: string; peec: string }[] = [
  {
    cat: 'Core focus',
    clovion: 'AI visibility tracking, diagnosis, recommendations, and improvement workflow',
    peec: 'AI visibility monitoring, prompt tracking, and reporting'
  },
  {
    cat: 'AI engines / models',
    clovion: '1 on Starter, 3 on Growth, up to 6 on Enterprise',
    peec: '3 selected models on Starter, Pro, and Advanced'
  },
  { cat: 'Prompt tracking', clovion: 'Included', peec: 'Included' },
  {
    cat: 'Brands / projects',
    clovion: '1 brand on Starter, 2 on Growth, custom on Enterprise',
    peec: '1 project on Starter, 2 on Pro, 5 on Advanced, unlimited on Enterprise'
  },
  {
    cat: 'Recommendations',
    clovion: 'Limited on Starter, 20/month on Growth, custom on Enterprise',
    peec: 'Provides visibility insights and general optimization opportunities'
  },
  {
    cat: 'Brand perception',
    clovion: 'Available from Growth; shows how AI describes and positions your brand',
    peec: 'Not positioned as a dedicated brand perception module'
  },
  {
    cat: 'Competitor analysis',
    clovion: '5 competitors on Starter, 10 on Growth, custom on Enterprise',
    peec: 'Included as part of AI visibility tracking'
  },
  {
    cat: 'Proof loop',
    clovion: 'Helps track whether fixes landed, had no impact, backfired, or remain inconclusive',
    peec: 'Not highlighted as a dedicated workflow'
  },
  {
    cat: 'Natural-language analytics',
    clovion: 'Ask Clove available by plan',
    peec: 'Not highlighted as a dedicated feature'
  },
  { cat: 'Citation tracking', clovion: 'Included', peec: 'Included' },
  {
    cat: 'Google Analytics',
    clovion: 'Included on all plans',
    peec: 'Not highlighted on public pricing page'
  }
]

// Peec cell may be a "yes" (supported) or a plain-text limitation.
const engines: { name: string; peec: true | string }[] = [
  { name: 'ChatGPT', peec: true },
  { name: 'Google AI Overviews', peec: true },
  { name: 'Perplexity', peec: true },
  { name: 'Gemini', peec: true },
  { name: 'Claude', peec: 'Enterprise only' },
  { name: 'Grok', peec: 'Not offered' }
]

const clovionPlans = [
  { name: 'Starter', price: '$119 / mo' },
  { name: 'Growth', price: '$319 / mo' },
  { name: 'Enterprise', price: 'Custom' }
]
const peecPlans = [
  { name: 'Starter', price: '$95 / mo' },
  { name: 'Pro', price: '$245 / mo' },
  { name: 'Advanced', price: '$495 / mo' },
  { name: 'Enterprise', price: 'Custom' }
]

const chooseClovion = [
  "You need to know what to fix, not just what's wrong.",
  'You want proof a change actually moved the needle.',
  'You track Claude or Grok, not only the big three.',
  'You want Google Analytics tied in from day one.'
]
const choosePeec = [
  'You need unlimited user seats across the team.',
  'You already have a content strategy and want clean tracking on top.',
  'You run an agency and want simple multi-client bundles.'
]

const faqs = [
  {
    q: 'Is Clovion a Peec AI alternative?',
    a: 'Yes. Both track how your brand appears in AI answers across engines like ChatGPT, Perplexity, Gemini, and Google AI Overviews. The difference is what happens next: Peec reports the data, while Clovion diagnoses each gap, prescribes an earnable fix, and re-measures to prove it worked.'
  },
  {
    q: 'What is the main difference between Clovion and Peec AI?',
    a: 'Peec AI measures visibility and reports sentiment, citations, and competitor benchmarks. Clovion runs the same measurement per model, then diagnoses why a gap exists, recommends only fixes you can realistically earn, and tracks each as an experiment with a verdict: Landed, Null, Backfired, or Inconclusive.'
  },
  {
    q: 'Which platform is cheaper to start with?',
    a: "Peec AI's Starter is $95/month and Clovion's is $119/month, so Peec is lower at entry. Peec's Starter includes 3 engines; adding more costs $35–$165 per model per month. Clovion's plans include the recommendation and proof loop Peec doesn't offer at any price."
  },
  {
    q: 'How many AI engines do Clovion and Peec AI track?',
    a: "Clovion tracks up to 6 AI engines — ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews — with the full set available on higher tiers. Peec AI includes 3 engines per plan chosen from ChatGPT, Google AI Overviews, Google AI Mode, Perplexity, Gemini, and Microsoft Copilot; Claude is Enterprise-only and Grok isn't offered. Peec lets you add extra engines as paid add-ons ($35–$165 per model per month)."
  },
  {
    q: 'Which platform is better for agencies?',
    a: 'Peec AI includes unlimited seats and agency bundles on every plan, which suits agencies that mainly need multi-client monitoring. Clovion fits agencies that need to show each client exactly what to fix and prove the result.'
  }
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
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

function EnginePeecCell({ value }: { value: true | string }) {
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
      <div style={headCell}>Peec AI</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClovionVsPeecAiPage() {
  return (
    <div
      className="clv-peec-light"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
.clv-peec-light .eyebrow { color: ${BRAND}; }
.clv-peec-light .eyebrow-dot::before { background: ${BRAND}; box-shadow: 0 0 0 4px rgba(194,65,12,0.12); }
`
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* HERO --------------------------------------------------------------- */}
      <Section className="section-y-xl relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
        <HeroShade />
        <Container>
          <div className="text-center" data-track-location="compare_peec_hero">
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
              Clovion vs Peec AI: <span style={{ color: BRAND }}>multi-engine AI visibility comparison</span>
            </h1>
            <p
              className="mt-6 mx-auto"
              style={{ color: 'var(--ink-70)', fontSize: '1.02rem', lineHeight: 1.65, maxWidth: 720 }}
            >
              Clovion and Peec AI both track how your brand shows up in AI answers. The difference: Clovion
              covers 6 AI engines — including Claude and Grok — and tells you what to fix and how much it should
              help. Peec covers 3 engines per plan and focuses on tracking and reporting.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="compare_peec_hero">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="#pricing" variant="secondary" size="lg" trackLocation="compare_peec_hero">
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
              Peec AI tracks visibility, benchmarks competitors, finds the sources shaping AI answers, and
              suggests actions to take. Clovion runs that same groundwork, then diagnoses the specific gap behind
              each recommendation and re-measures to confirm the fix moved your visibility.
            </p>
          </div>
          <div className="mt-11 grid grid-cols-1 gap-4">
            <Track
              name="Peec AI"
              desc="Tracks visibility and sentiment, benchmarks rivals, surfaces cited sources, and recommends opportunities to act on."
              steps={peecFlow}
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
              How Clovion and Peec AI line up across the capabilities that matter most.
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
                    <div style={{ ...bodyCell, color: 'var(--ink-60)' }}>{row.peec}</div>
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
              Both platforms cover the major AI engines. The difference is at the edges — Clovion adds Claude and
              Grok, which Peec limits or doesn&apos;t offer.
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
                      <EnginePeecCell value={e.peec} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-3xl" style={{ fontSize: '0.85rem', color: 'var(--ink-50)' }}>
            Clovion access scales by tier (1 / 3 / 6 engines). Peec includes 3 engines per plan; extra engines are
            paid add-ons ($35–$165/mo each).
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
              Both offer a custom Enterprise tier. Peec&apos;s headline price covers 3 engines — budget for add-ons
              if you need broad coverage.
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
              name="Peec AI"
              who="Monitoring & analytics · unlimited users"
              plans={peecPlans}
              note="3 engines per plan. Extra engines: +$35 (Starter), +$85 (Pro), +$165 (Advanced) per model, per month."
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
            <ChooseCard title="When to choose Peec AI" items={choosePeec} />
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
            data-track-location="compare_peec_final_cta"
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
              <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="compare_peec_final_cta">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="compare_peec_final_cta">
                Get Free Score
              </Button>
            </div>
          </div>

          <p className="mt-10 text-center" style={{ fontSize: '0.8rem', color: 'var(--ink-40)' }}>
            <strong style={{ color: 'var(--ink-60)', fontWeight: 600 }}>Peec AI details</strong> sourced from
            peec.ai/pricing · <strong style={{ color: 'var(--ink-60)', fontWeight: 600 }}>Last verified:</strong> July
            2026. Competitor pricing and features change frequently.
          </p>
        </Container>
      </Section>
    </div>
  )
}

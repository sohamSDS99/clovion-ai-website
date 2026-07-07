import type { CSSProperties } from 'react'
import {
  Section,
  Container,
  Button,
  Eyebrow,
  ArrowRight,
  Check,
  HeroShade
} from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'
import { DeepDive, type DeepDiveItem } from './DeepDive'

// ---------------------------------------------------------------------------
// Brand palette — light homepage theme (#FAF9F7) + the "Clove" orange accent
// (#C2410C) pulled from components/home/ClovAgent.tsx. Orange is the single
// accent: it marks the Clovion side, the improvement loop, and CTAs. Peec and
// neutral areas stay ink-on-warm-white so the brand side always reads as "ours".
// ---------------------------------------------------------------------------
const BRAND = '#C2410C' // Clove orange — primary accent (text + glyphs)
const BRAND_GLOW = '#EA580C' // brighter orange — gradient start
const BRAND_STRONG = '#9A3412' // deep orange — gradient end / on-white text
const BRAND_TINT = '#FBEEE7' // pale orange — Clovion-column fills
const BRAND_BORDER = 'rgba(194,65,12,0.22)' // orange hairline for the Clovion column

export const metadata = {
  title: 'Clovion vs Peec AI: Multi-engine AI visibility comparison | Clovion AI',
  description:
    'Clovion and Peec AI both help marketing teams track brand visibility across AI-generated answers. The core difference is what happens after measurement.'
}

// ---------------------------------------------------------------------------
// Content — VERBATIM from the source brief. Do not paraphrase.
// ---------------------------------------------------------------------------

// The improvement loop — clauses lifted verbatim from the brief's core paragraph.
const loop = [
  { k: 'Measure', d: 'measures visibility per model' },
  { k: 'Diagnose', d: 'diagnoses why a brand appears or disappears' },
  { k: 'Recommend', d: 'recommends the specific earnable fix' },
  { k: 'Prove', d: 'measures whether that fix actually worked' }
]

// Four possible outcomes, differentiated by FORM (not colour — brandbook is B&W).
const outcomes: { label: string; form: 'solid' | 'ring' | 'diamond' | 'dashed' }[] = [
  { label: 'Landed', form: 'solid' },
  { label: 'Null', form: 'ring' },
  { label: 'Backfired', form: 'diamond' },
  { label: 'Inconclusive', form: 'dashed' }
]

// Engine coverage — Clovion's standard six-engine set. Peec status per the brief.
const engines: { name: string; src: string; peec: string | boolean }[] = [
  { name: 'ChatGPT', src: '/logos/chatgpt.svg', peec: true },
  { name: 'Claude', src: '/logos/claude.svg', peec: 'Enterprise only (via API)' },
  { name: 'Perplexity', src: '/logos/perplexity.svg', peec: true },
  { name: 'Gemini', src: '/logos/gemini.svg', peec: true },
  { name: 'Grok', src: '/logos/grok.svg', peec: 'Not offered on any plan' },
  { name: 'Google AI Overviews', src: '/logos/google-ai.svg', peec: true }
]

const glance: { cat: string; clovion: string; peec: string }[] = [
  {
    cat: 'Engine coverage',
    clovion:
      'Clovion is built around leading AI search surfaces: ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews. Plan access depends on tier: Starter includes 2 models, Growth includes 3, and Enterprise includes all available models.',
    peec:
      'Peec AI self-serve plans include 3 selected models. Listed options include ChatGPT, AI Mode, AI Overviews, Microsoft Copilot, Perplexity, and Gemini. Claude is available only on Enterprise (via API), and Grok is not offered on any plan. Enterprise expands access to all models.'
  },
  { cat: 'Starting price', clovion: '$79/month', peec: '$95/month' },
  {
    cat: 'Fix recommendations',
    clovion:
      'Model-specific GEO recommendations with priority, difficulty, supporting evidence, expected impact, and confidence signals. Clovion is positioned around what to fix next and whether it worked.',
    peec:
      'Strong analytics around prompts, visibility, sources, citations, sentiment, and competitors. Teams can use the data to build their own optimization roadmap.'
  },
  {
    cat: 'Free score',
    clovion: 'Yes. Clovion offers a free AI Visibility Score with no card required.',
    peec:
      'Free trial is available. A public free visibility score is not positioned in the same way on the pricing page.'
  },
  {
    cat: 'Self-serve',
    clovion: 'Yes. Starter and Growth plans are self-serve, with Enterprise for custom needs.',
    peec: 'Yes. Starter, Pro, and Advanced are self-serve, with Enterprise for custom needs.'
  },
  {
    cat: 'Best fit',
    clovion:
      'Teams that want to measure, explain, improve, and prove AI visibility - not just report on it.',
    peec:
      'Teams that want AI search analytics, unlimited users, higher self-serve prompt volumes, and reporting workflows.'
  }
]

const chooseClovion = [
  {
    lead: 'You need actionability, not only reporting.',
    body:
      'Clovion is strongest when the team needs to know what changed, why it changed, and what to fix next.'
  },
  {
    lead: 'You want per-model diagnosis.',
    body:
      'Clovion does not rely on one blended AI score. It shows how visibility differs across models because each engine reads and weighs sources differently.'
  },
  {
    lead: 'You care about earnable fixes.',
    body:
      'Clovion separates source-presence gaps, substance gaps, framing gaps, and authority-locked prompts so the team does not waste time on recommendations it cannot realistically win.'
  },
  {
    lead: 'You want proof after the fix ships.',
    body:
      'Clovion is designed to re-measure recommendations against a baseline and control so teams can see whether a change landed, did nothing, backfired, or remained inconclusive.'
  }
]

const choosePeec = [
  {
    lead: 'You need unlimited users on self-serve plans.',
    body: 'Peec AI clearly includes unlimited users across its Starter, Pro, and Advanced tiers.'
  },
  {
    lead: 'You need higher prompt volume before Enterprise.',
    body:
      'Peec AI includes 150 prompts on Pro and 350 prompts on Advanced, which can be useful for teams running broader prompt sets.'
  },
  {
    lead: 'You prioritize reporting and access workflows.',
    body:
      'Peec AI is a strong fit when Looker Studio integration, API access, SSO, custom onboarding, or agency-style project tracking are central requirements.'
  }
]

const deepDive: DeepDiveItem[] = [
  {
    n: '01',
    title: 'AI engine and model coverage',
    clovion: [
      'Clovion supports a broader AI visibility strategy across ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews, with model access increasing by plan. Starter includes 2 models, Growth includes 3, and Enterprise includes all available models.'
    ],
    peec: [
      'Peec AI gives self-serve users a choose-your-model setup. Starter, Pro, and Advanced include 3 models, selected from options such as ChatGPT, AI Mode, AI Overviews, Microsoft Copilot, Perplexity, and Gemini. Enterprise expands access to all models, adding Claude Sonnet 4, GPT-5 Search, Qwen, and DeepSeek via API. Grok is not offered on any Peec plan, whereas Clovion includes it in its standard six-engine set.'
    ]
  },
  {
    n: '02',
    title: 'Visibility tracking',
    intro:
      'Both platforms help teams track whether their brand appears in AI answers and how that visibility changes over time.',
    clovion: [
      'Clovion goes further by treating measurement as the first step in an improvement loop. It tracks visibility per model, then connects movement to likely causes, specific prompts, cited sources, competitor movement, and recommended actions.'
    ],
    peec: [
      'Peec AI is strong for analytics views: prompts, models, countries, projects, source visibility, sentiment, and daily tracking frequency. This makes it useful for SEO and marketing teams that want a clear reporting layer.'
    ]
  },
  {
    n: '03',
    title: 'Recommendations and fix prioritization',
    intro: 'This is the biggest difference between the two platforms.',
    clovion: [
      'Clovion is designed to produce the roadmap inside the product. Each recommendation names the gap, targets specific prompts, explains why it matters, identifies the source or page involved, and ranks the fix by priority, difficulty, expected impact, and confidence.',
      'Clovion also avoids fake precision. If a prompt is authority-locked or not realistically winnable, the better answer is not to dress it up as a task. It should be dropped, monitored, and re-tested later.'
    ],
    peec: [
      'Peec AI provides strong data on prompts, visibility, sources, citations, competitors, and sentiment. For experienced SEO or GEO teams, that data can inform a manual optimization roadmap.'
    ]
  },
  {
    n: '04',
    title: 'Brand perception and AI positioning',
    intro:
      'AI visibility is not only about whether a brand appears. It is also about how the brand is described when it appears.',
    clovion: [
      'Clovion includes AI Perception as a core workflow. It surfaces recurring attributes AI engines associate with a brand, such as affordable, trusted, modern, enterprise-focused, easy to use, difficult to implement, or better suited to a specific audience.',
      'It also separates factual errors from evaluative framing. A factual error can be corrected. A subjective perception needs to be measured, traced to sources when possible, and improved through better evidence over time.'
    ],
    peec: [
      'Peec AI also includes sentiment and visibility insights, which help teams understand brand tone and performance across prompts.'
    ]
  },
  {
    n: '05',
    title: 'Competitor benchmarking',
    intro: 'Both Clovion and Peec AI support competitor analysis.',
    clovion: [
      'Clovion compares visibility against rivals at the prompt and model level. It helps teams identify where competitors win, where they lose, which prompt categories matter most, and which gaps are worth fixing.',
      'Clovion connects competitor movement to next steps, so teams can move from “competitor X is winning” to “here is the source, page, or substance gap we can fix.”'
    ],
    peec: [
      'Peec AI helps teams compare visibility, prompts, sources, and competitive presence across AI search platforms. This is useful for teams managing multiple projects or clients.'
    ]
  },
  {
    n: '06',
    title: 'Proof after implementation',
    clovion: [
      'Many visibility tools show movement over time. Clovion is positioned around proving whether the recommended fix caused a meaningful change.',
      'A Clovion recommendation is treated as a measured hypothesis. The baseline is captured before the change. The measurement clock starts when the change goes live. Results are compared against untouched prompts to avoid confusing brand movement with market-wide drift.',
      'The outcome can be Landed, Null, Backfired, or Inconclusive. That honesty matters because it prevents teams from over-crediting actions that did not actually move visibility.'
    ],
    peec: []
  },
  {
    n: '07',
    title: 'Reporting, users, and integrations',
    clovion: [
      'Clovion supports reporting, custom competitor tracking, custom AI visibility reporting, and priority support on Enterprise. Its stronger differentiation is not only how reports look, but how clearly the platform explains the next action.'
    ],
    peec: [
      'Peec AI has clear strengths in collaboration and reporting. Its public pricing page lists unlimited users on self-serve plans, plus Looker Studio integration on Advanced and API access, SSO, and custom onboarding on Enterprise.'
    ]
  },
  {
    n: '08',
    title: 'Measurement integrity',
    intro:
      'AI search results can be noisy. A single answer or one-off prompt result is not enough to guide strategy.',
    clovion: [
      'Clovion is designed to separate real movement from noise through repeated sampling, confidence signals, per-model tracking, and controls. It does not blend every model into one generic AI score because the same brand can perform differently on ChatGPT, Gemini, Perplexity, Claude, Grok, and Google AI Overviews.'
    ],
    peec: ['Peec AI provides daily tracking and visibility analytics, which are valuable for ongoing monitoring.']
  }
]

type PriceRow = {
  cat: string
  clovion: { plan?: string; body: string }
  peec: { plan?: string; body: string }
}

const pricing: PriceRow[] = [
  {
    cat: 'Entry plan',
    clovion: {
      plan: 'Starter - $79/month',
      body:
        'Includes 50 prompts, 2 AI models, AI Visibility Tracking, Brand Perception, Basic GEO Recommendations, brand mention tracking, sentiment breakdown, and entry-level reporting.'
    },
    peec: {
      plan: 'Starter - $95/month',
      body: 'Includes 50 prompts, choose 3 models, unlimited users, daily tracking, and 1 project.'
    }
  },
  {
    cat: 'Mid-tier plan',
    clovion: {
      plan: 'Growth - $229/month',
      body:
        'Includes 100 prompts, 3 AI models, Prompt Tracking, Competitor Analysis, Fanout Query Insights, AI Crawlability Checks, Prompt Volume Insights, Advanced GEO Recommendations, and deeper Brand Perception analysis.'
    },
    peec: {
      plan: 'Pro - $245/month',
      body: 'Includes 150 prompts, choose 3 models, unlimited users, daily tracking, and 2 projects.'
    }
  },
  {
    cat: 'Advanced plan',
    clovion: {
      plan: 'Not listed as a separate self-serve tier',
      body:
        'Teams that need full coverage can move from Growth to Enterprise for unlimited prompts, all available models, and custom reporting.'
    },
    peec: {
      plan: 'Advanced - $495/month',
      body:
        'Includes 350 prompts, choose 3 models, unlimited users, daily tracking, 5 projects, multi-country tracking, and Looker Studio integration.'
    }
  },
  {
    cat: 'Enterprise',
    clovion: {
      plan: 'Custom pricing',
      body:
        'Includes unlimited prompts, all available AI models, fully customizable prompt tracking, custom AI visibility reporting, custom competitor tracking, advanced GEO strategy support, enterprise-level prompt setup, scalable tracking, and priority support.'
    },
    peec: {
      plan: 'Custom pricing',
      body:
        'Includes fully customizable prompt tracking, all models, daily or weekly tracking frequency, unlimited projects, custom prompt setup, API access, and SSO.'
    }
  },
  {
    cat: 'Additional models',
    clovion: {
      body:
        'Model access expands by plan. Starter includes 2 models, Growth includes 3, and Enterprise includes all available models.'
    },
    peec: {
      body:
        'Additional model add-ons are listed on the pricing page: $35/month on Starter, $85/month on Pro, and $165/month on Advanced.'
    }
  },
  {
    cat: 'Best value for',
    clovion: {
      body:
        'Teams that want AI visibility tracking connected to model-specific diagnosis, prioritized GEO recommendations, and proof that fixes worked.'
    },
    peec: {
      body:
        'Teams that want higher self-serve prompt limits, unlimited users, multiple projects, and analytics/reporting workflows.'
    }
  }
]

const faqs = [
  {
    q: 'Is Clovion a Peec AI alternative?',
    a: 'Yes. Clovion is a Peec AI alternative for teams that want to track AI visibility and understand what actions can improve how their brand appears, gets cited, and is described across AI engines.'
  },
  {
    q: 'What is the biggest difference between Clovion and Peec AI?',
    a: 'Peec AI is strong for AI search analytics, prompt tracking, source visibility, and reporting. Clovion is stronger when teams need model-specific diagnosis, earnable GEO recommendations, and proof that recommended fixes actually improved visibility.'
  },
  {
    q: 'Which platform has the lower starting price?',
    a: 'Clovion has the lower starting price. Clovion starts at $79/month, while Peec AI starts at $95/month based on the pricing page reviewed for this draft.'
  },
  {
    q: 'Which platform is better for agencies?',
    a: 'Peec AI may be better for agencies that need unlimited users, multiple projects, higher self-serve prompt volumes, and reporting integrations. Clovion may be better for agencies that want to show clients not only where they stand in AI search, but also what to fix next and whether those fixes worked.'
  },
  {
    q: 'Why choose Clovion over Peec AI?',
    a: 'Choose Clovion if your team wants more than visibility dashboards. Clovion is built to measure AI visibility per model, diagnose the cause of visibility gaps, prescribe the specific earnable fix, and re-measure whether the fix worked.'
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
// Small presentational helpers
// ---------------------------------------------------------------------------

function OutcomeGlyph({ form }: { form: 'solid' | 'ring' | 'diamond' | 'dashed' }) {
  const base = { width: 9, height: 9, flexShrink: 0 } as CSSProperties
  if (form === 'solid') {
    // "Landed" — the positive outcome gets the brand orange.
    return <span aria-hidden style={{ ...base, borderRadius: 999, background: BRAND }} />
  }
  if (form === 'ring') {
    return (
      <span
        aria-hidden
        style={{ ...base, borderRadius: 999, border: '1.5px solid var(--ink-50)' }}
      />
    )
  }
  if (form === 'diamond') {
    return (
      <span
        aria-hidden
        style={{ width: 8, height: 8, flexShrink: 0, background: 'var(--ink)', transform: 'rotate(45deg)' }}
      />
    )
  }
  // dashed ring
  return (
    <span
      aria-hidden
      style={{ ...base, borderRadius: 999, border: '1.5px dashed var(--ink-50)' }}
    />
  )
}

function MatchupRow({
  name,
  price,
  note,
  emphasized
}: {
  name: string
  price: string
  note: string
  emphasized?: boolean
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.15rem',
            fontWeight: 600,
            color: emphasized ? BRAND : 'var(--ink-70)'
          }}
        >
          {name}
        </div>
        <div style={{ marginTop: 4, fontSize: '0.8rem', color: 'var(--ink-50)' }}>{note}</div>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.5rem',
          letterSpacing: '-0.01em',
          color: emphasized ? BRAND : 'var(--ink-60)',
          whiteSpace: 'nowrap'
        }}
      >
        {price}
      </div>
    </div>
  )
}

function GlanceCell({ value, emphasized }: { value: string; emphasized?: boolean }) {
  // Short values (prices) get the mono treatment; longer prose stays readable.
  const isShort = value.length < 16
  if (isShort) {
    return (
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.05rem',
          color: emphasized ? BRAND : 'var(--ink-70)'
        }}
      >
        {value}
      </span>
    )
  }
  return (
    <span style={{ fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--ink-70)' }}>{value}</span>
  )
}

function EngineCell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span
        aria-label="Supported"
        style={{
          display: 'inline-flex',
          height: 28,
          width: 28,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          background: BRAND,
          color: '#fff'
        }}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    )
  }
  return (
    <span style={{ fontSize: '0.9rem', color: 'var(--ink-60)' }}>{value as string}</span>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClovionVsPeecAiPage() {
  return (
    <div
      className="clv-peec-light"
      style={
        {
          ['--bg' as string]: '#FAF9F7',
          background: '#FAF9F7',
          color: 'var(--ink)'
        } as CSSProperties
      }
    >
      {/* Scoped recolor. Eyebrows adopt the Clove orange; the orange CTA band
          re-whitens its eyebrow + restyles its buttons. Class-based only —
          inline styles are recoloured directly in the JSX below. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
.clv-peec-light .eyebrow { color: ${BRAND}; }
.clv-peec-light .eyebrow-dot::before { background: ${BRAND}; box-shadow: 0 0 0 4px rgba(194,65,12,0.12); }
.clv-peec-light .clv-cta-orange .eyebrow { color: rgba(255,255,255,0.82); }
.clv-peec-light .clv-cta-orange .eyebrow-dot::before { background: rgba(255,255,255,0.82); box-shadow: 0 0 0 4px rgba(255,255,255,0.14); }
.clv-peec-light .clv-cta-orange .btn-primary { background: #fff; color: ${BRAND_STRONG}; }
.clv-peec-light .clv-cta-orange .btn-primary:hover { background: rgba(255,255,255,0.9); }
.clv-peec-light .clv-cta-orange .btn-secondary { background: rgba(255,255,255,0.12); color: #fff; border: 1px solid rgba(255,255,255,0.5); }
.clv-peec-light .clv-cta-orange .btn-secondary:hover { background: rgba(255,255,255,0.2); }
`
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* HERO --------------------------------------------------------------- */}
      <Section className="section-y-xl relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
        <HeroShade />
        <Container>
          <div
            className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
            data-track-location="compare_peec_hero"
          >
            {/* LEFT — copy */}
            <div>
              <div className="flex items-center gap-3">
                <Eyebrow>Comparison</Eyebrow>
                <span style={{ color: 'var(--ink-40)' }}>/</span>
                <span
                  style={{
                    fontSize: '0.85rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    color: BRAND,
                    fontWeight: 600
                  }}
                >
                  Clovion vs Peec AI
                </span>
              </div>
              <h1
                className="display-lg mt-7 lg:whitespace-nowrap"
                style={{ fontSize: 'clamp(2.25rem, 3.6vw, 3rem)' }}
              >
                Clovion vs Peec AI.
              </h1>
              <p
                className="mt-5"
                style={{
                  fontSize: '0.95rem',
                  letterSpacing: '0.02em',
                  color: 'var(--ink-60)',
                  fontFamily: 'var(--font-mono)',
                  textTransform: 'uppercase'
                }}
              >
                Multi-engine AI visibility comparison
              </p>
              <p className="lead mt-7" style={{ color: 'var(--ink-70)' }}>
                Both track brand visibility across AI-generated answers. The difference is what
                happens after measurement: Peec AI reports the data; Clovion is built for teams that
                need more than a dashboard.
              </p>
            </div>

            {/* RIGHT — head-to-head matchup card */}
            <div
              style={{
                borderRadius: 20,
                border: '1px solid var(--line)',
                borderTop: `3px solid ${BRAND}`,
                background: 'var(--white)',
                padding: 28,
                boxShadow: 'var(--shadow-soft)'
              }}
            >
              <MatchupRow name="Clovion AI" price="$79/month" note="Free score, no card required" emphasized />
              <div className="my-5 flex items-center gap-4" aria-hidden>
                <span style={{ height: 1, flex: 1, background: 'var(--line)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    color: 'var(--ink-40)'
                  }}
                >
                  VS
                </span>
                <span style={{ height: 1, flex: 1, background: 'var(--line)' }} />
              </div>
              <MatchupRow name="Peec AI" price="$95/month" note="Free trial available" />

              <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid var(--line)' }}>
                <div
                  style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.16em',
                    color: 'var(--ink-50)',
                    marginBottom: 14
                  }}
                >
                  Clovion engine coverage
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  {engines.map((e) => (
                    <span key={e.name} className="inline-flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={e.src}
                        alt=""
                        width={18}
                        height={18}
                        style={{ filter: 'var(--logo-filter)' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: 'var(--ink-70)' }}>{e.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* THE CORE DIFFERENCE — the loop ------------------------------------ */}
      <Section bg="subtle">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow className="justify-center">After measurement</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              The core difference is what happens after measurement.
            </h2>
            <p className="lead mt-5 mx-auto max-w-2xl" style={{ color: 'var(--ink-70)' }}>
              Clovion measures visibility per model, diagnoses why a brand appears or disappears,
              recommends the specific earnable fix, and then measures whether that fix actually
              worked. Clovion supports ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI
              Overviews, with model access depending on plan.
            </p>
          </div>

          {/* 4-node improvement loop */}
          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {loop.map((node, i) => {
              const last = i === loop.length - 1
              return (
                <div
                  key={node.k}
                  className="relative"
                  style={{
                    borderRadius: 20,
                    border: '1px solid var(--line)',
                    background: 'var(--white)',
                    padding: '24px 22px 26px'
                  }}
                >
                  {/* flow arrow into the next node (desktop only) */}
                  {!last && (
                    <span
                      aria-hidden
                      className="hidden lg:flex"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        right: -18,
                        transform: 'translateY(-50%)',
                        color: BRAND,
                        zIndex: 1
                      }}
                    >
                      <ArrowRight />
                    </span>
                  )}
                  <div
                    aria-hidden
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                      lineHeight: 1,
                      color: 'rgba(194,65,12,0.22)'
                    }}
                  >
                    {`0${i + 1}`}
                  </div>
                  <div
                    className="mt-3"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.35rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: 'var(--ink)'
                    }}
                  >
                    {node.k}
                  </div>
                  <p
                    className="mt-2"
                    style={{ fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--ink-60)' }}
                  >
                    {node.d}
                  </p>
                </div>
              )
            })}
          </div>

          {/* loop-back cue — signals the four steps repeat, no copy */}
          <div className="mt-8 flex items-center justify-center gap-4" aria-hidden>
            <span style={{ height: 1, width: 'min(120px, 22vw)', background: 'var(--line)' }} />
            <span
              style={{
                display: 'inline-flex',
                height: 40,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                border: `1px solid ${BRAND_BORDER}`,
                background: BRAND_TINT,
                color: BRAND
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
                <path
                  d="M20 12a8 8 0 1 1-2.3-5.6M20 4v3.5h-3.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span style={{ height: 1, width: 'min(120px, 22vw)', background: 'var(--line)' }} />
          </div>

          {/* outcome chips */}
          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p style={{ fontSize: '0.95rem', color: 'var(--ink-60)', maxWidth: 520 }}>
              The outcome can be Landed, Null, Backfired, or Inconclusive.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {outcomes.map((o) => (
                <span
                  key={o.label}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 9,
                    borderRadius: 999,
                    border: '1px solid var(--line)',
                    background: 'var(--white)',
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'var(--ink-70)'
                  }}
                >
                  <OutcomeGlyph form={o.form} />
                  {o.label}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ENGINE COVERAGE ---------------------------------------------------- */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Engine coverage</Eyebrow>
            <h2 className="display-md mt-5 text-balance">AI engine and model coverage.</h2>
            <p className="lead mt-5" style={{ color: 'var(--ink-70)' }}>
              Clovion is built around leading AI search surfaces: ChatGPT, Claude, Perplexity,
              Gemini, Grok, and Google AI Overviews.
            </p>
          </div>

          <div className="mt-12 -mx-4 overflow-x-auto md:mx-0 md:overflow-visible">
            <div className="min-w-[560px] px-4 md:min-w-0 md:px-0">
              <div
                style={{
                  overflow: 'hidden',
                  borderRadius: 20,
                  border: '1px solid var(--line)',
                  background: 'var(--white)'
                }}
              >
                <div
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: '1.6fr 1fr 1.4fr',
                    borderBottom: '1px solid var(--line)',
                    background: 'var(--subtle)'
                  }}
                >
                  <div style={headCell}>AI engine</div>
                  <div
                    style={{
                      ...headCell,
                      color: BRAND,
                      background: BRAND_TINT,
                      borderLeft: `1px solid ${BRAND_BORDER}`,
                      borderRight: `1px solid ${BRAND_BORDER}`
                    }}
                  >
                    Clovion AI
                  </div>
                  <div style={headCell}>Peec AI</div>
                </div>
                {engines.map((e, idx) => (
                  <div
                    key={e.name}
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: '1.6fr 1fr 1.4fr',
                      borderBottom: idx === engines.length - 1 ? 'none' : '1px solid var(--line)'
                    }}
                  >
                    <div style={{ ...bodyCell, display: 'flex', alignItems: 'center', gap: 12 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={e.src}
                        alt=""
                        width={22}
                        height={22}
                        style={{ filter: 'var(--logo-filter)', flexShrink: 0 }}
                      />
                      <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.95rem' }}>
                        {e.name}
                      </span>
                    </div>
                    <div
                      style={{
                        ...bodyCell,
                        background: BRAND_TINT,
                        borderLeft: `1px solid ${BRAND_BORDER}`,
                        borderRight: `1px solid ${BRAND_BORDER}`
                      }}
                    >
                      <EngineCell value={true} />
                    </div>
                    <div style={bodyCell}>
                      <EngineCell value={e.peec} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-3xl" style={{ fontSize: '0.9rem', color: 'var(--ink-50)' }}>
            Plan access depends on tier: Starter includes 2 models, Growth includes 3, and
            Enterprise includes all available models. Peec AI self-serve plans include 3 selected
            models. Listed options include ChatGPT, AI Mode, AI Overviews, Microsoft Copilot,
            Perplexity, and Gemini.
          </p>
        </Container>
      </Section>

      {/* AT A GLANCE -------------------------------------------------------- */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Side-by-side</Eyebrow>
            <h2 className="display-md mt-5 text-balance">At a glance comparison.</h2>
          </div>

          <div className="mt-12 -mx-4 overflow-x-auto md:mx-0 md:overflow-visible">
            <div className="min-w-[640px] px-4 md:min-w-0 md:px-0">
              <div
                style={{
                  overflow: 'hidden',
                  borderRadius: 20,
                  border: '1px solid var(--line)',
                  background: 'var(--white)'
                }}
              >
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: '0.8fr 1.3fr 1.3fr',
                    borderBottom: '1px solid var(--line)',
                    background: 'var(--subtle)'
                  }}
                >
                  <div style={headCell}>Category</div>
                  <div
                    style={{
                      ...headCell,
                      color: BRAND,
                      background: BRAND_TINT,
                      borderLeft: `1px solid ${BRAND_BORDER}`,
                      borderRight: `1px solid ${BRAND_BORDER}`
                    }}
                  >
                    Clovion AI
                  </div>
                  <div style={headCell}>Peec AI</div>
                </div>
                {glance.map((row, idx) => (
                  <div
                    key={row.cat}
                    className="grid"
                    style={{
                      gridTemplateColumns: '0.8fr 1.3fr 1.3fr',
                      borderBottom: idx === glance.length - 1 ? 'none' : '1px solid var(--line)'
                    }}
                  >
                    <div style={{ ...bodyCell, fontWeight: 600, color: 'var(--ink)', fontSize: '0.9rem' }}>
                      {row.cat}
                    </div>
                    <div style={{ ...bodyCell, background: BRAND_TINT, borderRight: `1px solid ${BRAND_BORDER}`, borderLeft: `1px solid ${BRAND_BORDER}` }}>
                      <GlanceCell value={row.clovion} emphasized />
                    </div>
                    <div style={bodyCell}>
                      <GlanceCell value={row.peec} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* WHEN TO CHOOSE ----------------------------------------------------- */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Best fit</Eyebrow>
            <h2 className="display-md mt-5 text-balance">When to choose which.</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Clovion */}
            <div
              style={{
                borderRadius: 20,
                border: '1px solid var(--line)',
                borderTop: `3px solid ${BRAND}`,
                background: 'var(--white)',
                boxShadow: 'var(--shadow-soft)',
                padding: '30px 30px 8px'
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  color: BRAND
                }}
              >
                When to choose Clovion
              </h3>
              <ul className="mt-6" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {chooseClovion.map((it) => (
                  <li
                    key={it.lead}
                    style={{ display: 'flex', gap: 14, paddingBottom: 22 }}
                  >
                    <span
                      aria-hidden
                      style={{
                        marginTop: 5,
                        flexShrink: 0,
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
                    <span style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--ink-70)' }}>
                      <strong style={{ color: 'var(--ink)' }}>{it.lead}</strong> {it.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Peec */}
            <div
              style={{
                borderRadius: 20,
                border: '1px solid var(--line)',
                background: 'var(--subtle)',
                padding: '30px 30px 8px'
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  color: 'var(--ink)'
                }}
              >
                When to choose Peec AI
              </h3>
              <ul className="mt-6" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {choosePeec.map((it) => (
                  <li key={it.lead} style={{ display: 'flex', gap: 14, paddingBottom: 22 }}>
                    <span
                      aria-hidden
                      style={{
                        marginTop: 5,
                        flexShrink: 0,
                        display: 'inline-flex',
                        height: 22,
                        width: 22,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 999,
                        background: 'var(--ink)',
                        color: 'var(--white)'
                      }}
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    <span style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--ink-70)' }}>
                      <strong style={{ color: 'var(--ink)' }}>{it.lead}</strong> {it.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* DETAILED FEATURE BREAKDOWN ----------------------------------------- */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>In depth</Eyebrow>
            <h2 className="display-md mt-5 text-balance">Detailed feature breakdown.</h2>
          </div>
          <div className="mt-12">
            <DeepDive items={deepDive} />
          </div>
        </Container>
      </Section>

      {/* PRICING ------------------------------------------------------------ */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="display-md mt-5 text-balance">Pricing comparison.</h2>
          </div>

          <div className="mt-12 -mx-4 overflow-x-auto md:mx-0 md:overflow-visible">
            <div className="min-w-[720px] px-4 md:min-w-0 md:px-0">
              <div
                style={{
                  overflow: 'hidden',
                  borderRadius: 20,
                  border: '1px solid var(--line)',
                  background: 'var(--white)'
                }}
              >
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: '0.8fr 1.3fr 1.3fr',
                    borderBottom: '1px solid var(--line)',
                    background: 'var(--subtle)'
                  }}
                >
                  <div style={headCell}>Plan / limit</div>
                  <div
                    style={{
                      ...headCell,
                      color: BRAND,
                      background: BRAND_TINT,
                      borderLeft: `1px solid ${BRAND_BORDER}`,
                      borderRight: `1px solid ${BRAND_BORDER}`
                    }}
                  >
                    Clovion AI
                  </div>
                  <div style={headCell}>Peec AI</div>
                </div>
                {pricing.map((row, idx) => (
                  <div
                    key={row.cat}
                    className="grid"
                    style={{
                      gridTemplateColumns: '0.8fr 1.3fr 1.3fr',
                      borderBottom: idx === pricing.length - 1 ? 'none' : '1px solid var(--line)'
                    }}
                  >
                    <div style={{ ...bodyCell, fontWeight: 600, color: 'var(--ink)', fontSize: '0.9rem' }}>
                      {row.cat}
                    </div>
                    <div style={{ ...bodyCell, background: BRAND_TINT, borderRight: `1px solid ${BRAND_BORDER}`, borderLeft: `1px solid ${BRAND_BORDER}` }}>
                      <PriceCell plan={row.clovion.plan} body={row.clovion.body} emphasized />
                    </div>
                    <div style={bodyCell}>
                      <PriceCell plan={row.peec.plan} body={row.peec.body} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ ---------------------------------------------------------------- */}
      <FAQAccordion headline="FAQ" items={faqs} />

      {/* FINAL CTA — centered ---------------------------------------------- */}
      <Section>
        <Container>
          <div
            className="clv-cta-orange relative isolate overflow-hidden rounded-[28px] text-white px-8 md:px-14 py-16 md:py-20 text-center"
            data-track-location="compare_peec_final_cta"
            style={{
              background: `linear-gradient(135deg, ${BRAND_GLOW} 0%, ${BRAND} 52%, ${BRAND_STRONG} 100%)`
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(ellipse 72% 82% at 50% 34%, rgba(255,255,255,0.18), transparent 62%)'
              }}
            />
            <div className="grid-bg absolute inset-0 -z-10 opacity-40 mix-blend-overlay" aria-hidden />
            <Eyebrow className="justify-center text-white/70">Why choose Clovion</Eyebrow>
            <h2
              className="mt-5 mx-auto text-balance"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.12,
                fontSize: 'clamp(1.9rem, 3.4vw, 2.6rem)',
                maxWidth: 760
              }}
            >
              Choose Clovion if your team wants more than visibility dashboards.
            </h2>
            <p
              className="mt-6 mx-auto text-white/70"
              style={{ fontSize: '1.02rem', lineHeight: 1.55, maxWidth: 840 }}
            >
              Clovion is built to measure AI visibility per model, diagnose the cause of visibility
              gaps, prescribe the specific earnable fix, and re-measure whether the fix worked.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button
                href="https://app.clovion.ai/signup"
                variant="primary"
                size="lg"
                trackLocation="compare_peec_final_cta"
              >
                Start Free Trial <ArrowRight />
              </Button>
              <Button
                href="/free-ai-visibility-score"
                variant="secondary"
                size="lg"
                trackLocation="compare_peec_final_cta"
              >
                Get Free Score
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared cell styles + price cell
// ---------------------------------------------------------------------------

const headCell: CSSProperties = {
  padding: '18px 22px',
  fontSize: '0.74rem',
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  fontWeight: 600,
  color: 'var(--ink-60)'
}

const bodyCell: CSSProperties = {
  padding: '20px 22px'
}

function PriceCell({
  plan,
  body,
  emphasized
}: {
  plan?: string
  body: string
  emphasized?: boolean
}) {
  return (
    <div>
      {plan && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.98rem',
            color: emphasized ? BRAND : 'var(--ink-80)',
            marginBottom: 8
          }}
        >
          {plan}
        </div>
      )}
      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--ink-60)' }}>{body}</p>
    </div>
  )
}

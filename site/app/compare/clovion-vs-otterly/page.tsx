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
import { CTABanner } from '@/components/sections'
import { DeepDive, type DeepDiveItem } from './DeepDive'

export const metadata = {
  title: 'Clovion vs Otterly AI: Multi-engine AI visibility comparison | Clovion AI',
  description:
    'Clovion and Otterly AI both help marketing teams track brand visibility across AI-generated answers. The core difference is engine economics and what happens after measurement.'
}

// Brand-accent palette — pulled from the homepage (single source of truth).
// Orange is the Clovion brand accent ("Clove" on the homepage); it is also the
// positive/affordance accent (RecoveryPlan). Everything else stays B&W.
const ORANGE = '#C2410C'
const ORANGE_BG = 'rgba(194, 65, 12, 0.07)'
const ORANGE_BORDER = 'rgba(194, 65, 12, 0.22)'

// ---------------------------------------------------------------------------
// Content — VERBATIM from the source PDF brief. Do not paraphrase.
// ---------------------------------------------------------------------------

// The improvement loop — clauses grounded in the brief's core paragraph and the
// "Proof after implementation" section.
const loop = [
  { k: 'Measure', d: 'tracks visibility per model' },
  { k: 'Diagnose', d: 'connects movement to likely causes, prompts, and cited sources' },
  { k: 'Recommend', d: 'ships a ranked fix list with expected lift' },
  { k: 'Prove', d: 're-measures whether each fix actually worked' }
]

// Four possible outcomes (verbatim from the brief). "Landed" is the positive
// case → Clove orange; the rest are differentiated by FORM.
const outcomes: { label: string; form: 'solid' | 'ring' | 'diamond' | 'dashed' }[] = [
  { label: 'Landed', form: 'solid' },
  { label: 'Null', form: 'ring' },
  { label: 'Backfired', form: 'diamond' },
  { label: 'Inconclusive', form: 'dashed' }
]

// Engine coverage — Clovion's included six-engine set. Otterly status derived
// strictly from the brief: ChatGPT / Perplexity / Google AI Overviews are on
// every plan; Claude + Gemini are paid add-ons; Grok is not offered.
const engines: { name: string; src: string; otterly: string | boolean }[] = [
  { name: 'ChatGPT', src: '/logos/chatgpt.svg', otterly: true },
  { name: 'Claude', src: '/logos/claude.svg', otterly: 'Paid add-on: $29 / $109 / $439' },
  { name: 'Perplexity', src: '/logos/perplexity.svg', otterly: true },
  { name: 'Gemini', src: '/logos/gemini.svg', otterly: 'Paid add-on: $9 / $59 / $149' },
  { name: 'Grok', src: '/logos/grok.svg', otterly: 'Not offered on any plan' },
  { name: 'Google AI Overviews', src: '/logos/google-ai.svg', otterly: true }
]

const glance: { cat: string; clovion: string; otterly: string }[] = [
  {
    cat: 'Engine coverage',
    clovion:
      'Six engines, included by tier: ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews. Starter includes 2 models, Growth includes 3, and Enterprise includes all available models.',
    otterly:
      'Four engines on every plan: ChatGPT, Google AI Overviews, Perplexity, and Microsoft Copilot. Claude, Gemini, and Google AI Mode are paid add-ons. Grok is not offered.'
  },
  { cat: 'Starting price', clovion: '$79/month', otterly: '$29/month' },
  {
    cat: 'Fix recommendations',
    clovion:
      'Model-specific GEO recommendations ranked by priority, difficulty, expected impact, and confidence - then re-measured against a baseline and control to prove the result.',
    otterly:
      'GEO Audit, content briefs, crawlability checks, and on-page recommendations. Strong diagnosis; execution and impact tracking happen outside the tool.'
  },
  {
    cat: 'Free score',
    clovion: 'Yes. Clovion offers a free AI Visibility Score with no card required.',
    otterly:
      'Free trial and several free standalone GEO tools. No equivalent no-card visibility score is positioned on the pricing page.'
  },
  {
    cat: 'Self-serve',
    clovion: 'Yes. Starter and Growth are self-serve, with Enterprise for custom needs.',
    otterly: 'Yes. Lite, Standard, and Premium are self-serve, with Enterprise for custom needs.'
  },
  {
    cat: 'Best fit',
    clovion:
      'Teams that want included multi-engine coverage, fixes prioritized by expected lift, and proof that a fix worked - not just monitoring.',
    otterly:
      'Budget-conscious teams and agencies that want low-cost monitoring, a detailed GEO and content audit, and multi-brand workspaces.'
  }
]

const chooseClovion = [
  {
    lead: 'You want Claude, Gemini, and Grok without metered add-ons.',
    body:
      'On Otterly, Claude and Gemini are paid add-ons - Claude runs up to $439/month - and Grok is not available at all. Clovion includes them in its six-engine set.'
  },
  {
    lead: 'You want fixes ranked by expected lift, not only an audit.',
    body:
      'Clovion ranks each recommendation by priority, difficulty, expected impact, and confidence, so the team knows what to do next and in what order.'
  },
  {
    lead: 'You want proof after the fix ships.',
    body:
      'Clovion re-measures recommendations against a baseline and control so teams can see whether a change landed, did nothing, backfired, or remained inconclusive.'
  },
  {
    lead: 'You want per-model diagnosis and measurement integrity.',
    body:
      'Clovion does not blend engines into one score; it tracks visibility per model with confidence signals because each engine reads and weighs sources differently.'
  }
]

const chooseOtterly = [
  {
    lead: 'Budget is the priority, or you are testing the category.',
    body:
      "At $29/month, Otterly's Lite plan is one of the lowest entry points available for AI search monitoring."
  },
  {
    lead: 'You want a content audit.',
    body:
      "Reviewers consistently rate Otterly's content scoring, crawlability checks, and content briefs among the most detailed in its price range."
  },
  {
    lead: 'You are an agency managing many brands.',
    body:
      'Otterly includes unlimited workspaces and team members, per-client separation, Looker Studio, and API and MCP access. It also covers Microsoft Copilot in the base plan and offers Google AI Mode as an add-on - surfaces Clovion does not cover.'
  }
]

const deepDive: DeepDiveItem[] = [
  {
    n: '01',
    title: 'AI engine and model coverage',
    clovion: [
      'Clovion supports a broader included engine set across ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews, with model access increasing by plan. Starter includes 2 models, Growth includes 3, and Enterprise includes all available models.'
    ],
    otterly: [
      'Otterly AI tracks four engines on every plan: ChatGPT, Google AI Overviews, Perplexity, and Microsoft Copilot. Claude, Gemini, and Google AI Mode are sold as paid add-ons - for example, Claude is $29, $109, or $439 per month on Lite, Standard, and Premium, and Gemini or Google AI Mode is $9, $59, or $149. Grok is not offered on any Otterly plan. This means matching Clovion\'s core Claude and Gemini coverage on Otterly adds meaningfully to the monthly cost.'
    ]
  },
  {
    n: '02',
    title: 'Visibility tracking',
    intro:
      'Both platforms track whether a brand appears in AI answers and how that visibility changes over time, with daily tracking frequency.',
    clovion: [
      'Clovion treats measurement as the first step in an improvement loop. It tracks visibility per model, then connects movement to likely causes, specific prompts, cited sources, competitor movement, and recommended actions.'
    ],
    otterly: [
      'Otterly AI is strong here: a Brand Visibility Index, Domain Ranking, Link Citations Analysis, and prompt-level history give SEO and marketing teams a clear, exportable reporting layer across engines.'
    ]
  },
  {
    n: '03',
    title: 'Recommendations and fix prioritization',
    clovion: [
      "Clovion's difference is what it does with that diagnosis. Each recommendation names the gap, targets specific prompts, identifies the source or page involved, and ranks the fix by priority, difficulty, expected impact, and confidence - producing an ordered roadmap inside the product.",
      'Clovion also avoids fake precision. If a prompt is authority-locked or not realistically winnable, it is dropped, monitored, and re-tested later rather than dressed up as a task.'
    ],
    otterly: [
      'Unlike a pure monitor, Otterly AI does offer optimization guidance: a GEO Audit with SWOT and competitor set, content scoring, crawlability checks, and content briefs that flag why a page may be skipped. For many teams this diagnostic layer is genuinely useful.'
    ]
  },
  {
    n: '04',
    title: 'Brand perception and AI positioning',
    intro:
      'AI visibility is not only about whether a brand appears. It is also about how the brand is described when it appears.',
    clovion: [
      'Clovion includes AI Perception as a core workflow and separates factual errors from evaluative framing. A factual error can be corrected; a subjective perception is measured, traced to sources when possible, and improved through better evidence over time.'
    ],
    otterly: [
      'Otterly AI includes a perception view that plots tracked brands by visibility and narrative strength, useful for seeing how a brand is positioned against competitors.'
    ]
  },
  {
    n: '05',
    title: 'Competitor benchmarking',
    intro: 'Both Clovion and Otterly AI support competitor analysis.',
    clovion: [
      'Clovion compares visibility against rivals at the prompt and model level, identifying where competitors win, where they lose, which prompt categories matter most, and which gaps are worth fixing.'
    ],
    otterly: [
      'Otterly AI compares brand coverage against competitors, surfaces competitors you may not be tracking, and shows which domains AI engines treat as authoritative in your category - useful for teams managing multiple projects or clients.'
    ]
  },
  {
    n: '06',
    title: 'Proof after implementation',
    clovion: [
      'Clovion is positioned around proving whether the recommended fix caused a meaningful change. A recommendation is treated as a measured hypothesis: the baseline is captured before the change, the measurement clock starts when the change goes live, and results are compared against untouched prompts to avoid confusing brand movement with market-wide drift.',
      'The outcome can be Landed, Null, Backfired, or Inconclusive. That honesty prevents teams from over-crediting actions that did not actually move visibility.'
    ],
    otterly: [
      'Many visibility tools show movement over time and stop there. Reviewers of Otterly AI note that it tells you where you stand and why a page may be skipped, but closing the gap - and confirming that a content change actually improved citation rate - happens outside the platform.'
    ]
  },
  {
    n: '07',
    title: 'Reporting, users, and integrations',
    clovion: [
      'Clovion supports custom AI visibility reporting, custom competitor tracking, and priority support on Enterprise. Its stronger differentiation is not how reports look, but how clearly the platform explains the next action and whether it worked.'
    ],
    otterly: [
      'Otterly AI has clear strengths in collaboration and reporting. It includes unlimited team members on every plan, unlimited workspaces on Standard and above, a Google Looker Studio connector, API access, MCP support, and CSV exports - a practical toolkit for agencies reporting across many brands.'
    ]
  },
  {
    n: '08',
    title: 'Measurement integrity',
    intro:
      'AI search results can be noisy. A single answer or one-off prompt result is not enough to guide strategy.',
    clovion: [
      'Clovion is designed to separate real movement from noise through repeated sampling, confidence signals, per-model tracking, and controls. It does not blend every model into one generic score, because the same brand can perform differently on ChatGPT, Gemini, Perplexity, Claude, Grok, and Google AI Overviews.'
    ],
    otterly: [
      'Otterly AI provides automated daily tracking and visibility analytics, valuable for ongoing monitoring.'
    ]
  }
]

type PriceRow = {
  cat: string
  clovion: { plan?: string; body: string }
  otterly: { plan?: string; body: string }
}

const pricing: PriceRow[] = [
  {
    cat: 'Entry plan',
    clovion: {
      plan: 'Starter - $79/month',
      body:
        'Includes 50 prompts, 2 AI models, AI Visibility Tracking, Brand Perception, Basic GEO Recommendations, brand mention tracking, sentiment breakdown, and entry-level reporting.'
    },
    otterly: {
      plan: 'Lite - $29/month',
      body:
        'Includes 15 search prompts, 4 engines, unlimited team members, daily tracking, 1 workspace, 3 recommendations per week, and 1,000 GEO URL audits per month. Claude, Gemini, and Google AI Mode available as add-ons. No API or MCP.'
    }
  },
  {
    cat: 'Mid-tier plan',
    clovion: {
      plan: 'Growth - $229/month',
      body:
        'Includes 100 prompts, 3 AI models, Prompt Tracking, Competitor Analysis, Fanout Query Insights, AI Crawlability Checks, Prompt Volume Insights, Advanced GEO Recommendations, and deeper Brand Perception analysis.'
    },
    otterly: {
      plan: 'Standard - $189/month (Most Popular)',
      body:
        'Includes 100 search prompts, 4 engines, unlimited workspaces, unlimited recommendations, 5,000 GEO URL audits per month, Google Looker Studio connector, and API and MCP access (2,000 requests each per month).'
    }
  },
  {
    cat: 'Upper plan',
    clovion: {
      plan: 'Not listed as a separate self-serve tier',
      body:
        'Teams that need full coverage move from Growth to Enterprise for unlimited prompts, all available models, and custom reporting.'
    },
    otterly: {
      plan: 'Premium - $489/month',
      body:
        'Includes 400 search prompts, 4 engines, unlimited workspaces, best AI recommendations, 10,000 GEO URL audits per month, Looker Studio connector, API and MCP access (5,000 requests each per month), and a personal onboarding session.'
    }
  },
  {
    cat: 'Enterprise',
    clovion: {
      plan: 'Custom pricing',
      body:
        'Includes unlimited prompts, all available AI models, fully customizable prompt tracking, custom AI visibility reporting, custom competitor tracking, advanced GEO strategy support, and priority support.'
    },
    otterly: {
      plan: 'Custom pricing',
      body:
        'Includes custom search prompts, everything in the plans above, single sign-on, custom payment options, a quarterly GEO health check, and a personalized onboarding session.'
    }
  },
  {
    cat: 'Engines and add-ons',
    clovion: {
      body:
        'Engine access expands by plan. Starter includes 2 models, Growth includes 3, and Enterprise includes all available models. No per-engine add-on fees.'
    },
    otterly: {
      body:
        'Extra engines are paid add-ons. Google AI Mode and Gemini: $9 / $59 / $149 per month. Claude: $29 / $109 / $439 per month (Lite / Standard / Premium). Extra prompts: +100 for $99/month on Standard and Premium.'
    }
  },
  {
    cat: 'Best value for',
    clovion: {
      body:
        'Teams that want included multi-engine coverage connected to model-specific diagnosis, prioritized GEO recommendations, and proof that fixes worked.'
    },
    otterly: {
      body:
        'Budget-conscious teams and agencies that want a low entry price, a detailed GEO and content audit, higher prompt limits, and multi-brand workspaces.'
    }
  }
]

const faqs = [
  {
    q: 'Is Clovion an Otterly AI alternative?',
    a: 'Yes. Clovion is an Otterly AI alternative for teams that want to track AI visibility and understand what actions can improve how their brand appears, gets cited, and is described across AI engines - with fixes ranked by expected impact and re-measured to prove they worked.'
  },
  {
    q: 'What is the biggest difference between Clovion and Otterly AI?',
    a: 'Otterly AI is an affordable AI search monitoring and GEO audit tool, strong on content audits, briefs, and citation analysis. Clovion includes more engines in its core set - notably Claude, Gemini, and Grok - ranks fixes by expected lift and confidence, and re-measures each fix against a baseline and control to prove whether it worked.'
  },
  {
    q: 'Does Otterly AI include Claude and Gemini?',
    a: 'Not in its base plans. Otterly tracks four engines on every plan (ChatGPT, Google AI Overviews, Perplexity, and Microsoft Copilot) and sells Claude, Gemini, and Google AI Mode as paid add-ons. Claude ranges from $29 to $439 per month depending on tier. Grok is not offered. Clovion includes Claude and Gemini in its six-engine set and covers Grok.'
  },
  {
    q: 'Which platform has the lower starting price?',
    a: "Otterly AI has the lower starting price at $29/month, versus $79/month for Clovion, based on the pricing pages reviewed for this draft. Once Claude or Gemini add-ons are included on Otterly to match Clovion's core engine set, the effective monthly cost rises; Clovion bundles those engines by tier."
  },
  {
    q: 'Which platform is better for agencies?',
    a: 'Otterly AI is a strong fit for agencies that want low-cost, multi-brand monitoring with unlimited workspaces, unlimited team members, Looker Studio, and API and MCP access. Clovion is a better fit for agencies that want to show clients not only where they stand in AI search, but which fixes to prioritize and whether those fixes actually moved visibility.'
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
    // "Landed" — the positive outcome → Clove orange.
    return <span aria-hidden style={{ ...base, borderRadius: 999, background: '#C2410C' }} />
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
            color: emphasized ? 'var(--ink)' : 'var(--ink-70)'
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
          color: emphasized ? 'var(--ink)' : 'var(--ink-60)',
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
          color: emphasized ? 'var(--ink)' : 'var(--ink-70)'
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
    // Included on Clovion → Clove orange affordance check.
    return (
      <span
        aria-label="Included"
        style={{
          display: 'inline-flex',
          height: 28,
          width: 28,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 999,
          background: '#C2410C',
          color: '#ffffff'
        }}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    )
  }
  return <span style={{ fontSize: '0.9rem', color: 'var(--ink-60)' }}>{value as string}</span>
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClovionVsOtterlyPage() {
  return (
    <div
      className="clv-otterly"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Brand-orange eyebrow pulse dot, scoped to this page. */
            .clv-otterly .eyebrow-dot::before {
              background: ${ORANGE};
              box-shadow: 0 0 0 4px ${ORANGE_BG};
            }
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
            data-track-location="compare_otterly_hero"
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
                    color: 'var(--ink-60)',
                    fontWeight: 600
                  }}
                >
                  Clovion vs Otterly AI
                </span>
              </div>
              <h1 className="display-lg mt-7 text-balance">
                <span style={{ color: ORANGE }}>Clovion</span> vs Otterly AI.
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
                Clovion and Otterly AI both help marketing teams track brand visibility across
                AI-generated answers. The core difference is engine economics and what happens after
                measurement. Otterly AI is an affordable, well-regarded GEO monitoring and audit
                platform. Clovion is built for teams that need multi-engine coverage and a proven
                improvement loop.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="https://app.clovion.ai/signup" trackLocation="compare_otterly_hero" size="lg">
                  Start Free Trial <ArrowRight />
                </Button>
                <Button
                  href="/free-ai-visibility-score"
                  trackLocation="compare_otterly_hero"
                  size="lg"
                  variant="secondary"
                >
                  Get Free Score
                </Button>
              </div>
            </div>

            {/* RIGHT — head-to-head matchup card */}
            <div
              style={{
                borderRadius: 20,
                border: '1px solid var(--line)',
                background: 'var(--white)',
                padding: 28,
                boxShadow: 'var(--shadow-soft)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* orange top accent bar — Clovion brand cue */}
              <span
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${ORANGE}, rgba(194,65,12,0))`
                }}
              />
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
              <MatchupRow name="Otterly AI" price="$29/month" note="Free trial available" />

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
              The core difference is engine economics and what happens after measurement.
            </h2>
            <p className="lead mt-5 mx-auto max-w-2xl" style={{ color: 'var(--ink-70)' }}>
              Clovion tracks 6 AI engines - ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI
              Overviews - with Claude and Gemini in the core set, and ships a ranked fix list with
              expected lift plus a re-measurement step that proves whether each fix worked. Model
              access depends on the plan.
            </p>
            <p className="mt-5 mx-auto max-w-2xl" style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'var(--ink-60)' }}>
              Otterly AI tracks 4 engines on every plan (ChatGPT, Google AI Overviews, Perplexity,
              and Microsoft Copilot) and sells Claude, Gemini, and Google AI Mode as paid add-ons; it
              does not cover Grok. Its GEO Audit and content briefs are a genuine strength, but the
              platform stops at diagnosis. Otterly starts at $29/month; Clovion starts at $79/month.
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
                        color: 'var(--ink-40)',
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
                      color: last ? ORANGE : 'rgb(var(--ink-rgb) / 10%)',
                      opacity: last ? 0.9 : 1
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
                border: `1px solid ${ORANGE_BORDER}`,
                background: 'var(--white)',
                color: ORANGE
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
                      color: ORANGE,
                      background: '#FBEEE7',
                      borderLeft: '1px solid rgba(194,65,12,0.22)',
                      borderRight: '1px solid rgba(194,65,12,0.22)'
                    }}
                  >
                    Clovion AI
                  </div>
                  <div style={headCell}>Otterly AI</div>
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
                        background: '#FBEEE7',
                        borderLeft: '1px solid rgba(194,65,12,0.22)',
                        borderRight: '1px solid rgba(194,65,12,0.22)'
                      }}
                    >
                      <EngineCell value={true} />
                    </div>
                    <div style={bodyCell}>
                      <EngineCell value={e.otterly} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-3xl" style={{ fontSize: '0.9rem', color: 'var(--ink-50)' }}>
            Clovion includes engines by tier: Starter includes 2 models, Growth includes 3, and
            Enterprise includes all available models, with no per-engine add-on fees. Otterly AI
            tracks four engines on every plan - ChatGPT, Google AI Overviews, Perplexity, and
            Microsoft Copilot - and sells Claude, Gemini, and Google AI Mode as paid add-ons; Grok is
            not offered on any plan.
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
                      color: ORANGE,
                      background: '#FBEEE7',
                      borderLeft: '1px solid rgba(194,65,12,0.22)',
                      borderRight: '1px solid rgba(194,65,12,0.22)'
                    }}
                  >
                    Clovion AI
                  </div>
                  <div style={headCell}>Otterly AI</div>
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
                    <div style={{ ...bodyCell, background: '#FBEEE7', borderRight: ' . qq(1px solid rgba(194,65,12,0.22)) . q(', borderLeft: '1px solid rgba(194,65,12,0.22)' }}>
                      <GlanceCell value={row.clovion} emphasized />
                    </div>
                    <div style={bodyCell}>
                      <GlanceCell value={row.otterly} />
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
                  color: 'var(--ink)'
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
                        background: '#C2410C',
                        color: '#ffffff'
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

            {/* Otterly */}
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
                When to choose Otterly AI
              </h3>
              <ul className="mt-6" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {chooseOtterly.map((it) => (
                  <li key={it.lead} style={{ display: 'flex', gap: 14, paddingBottom: 22 }}>
                    <span
                      aria-hidden
                      style={{
                        marginTop: 7,
                        flexShrink: 0,
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        background: 'var(--ink-25)'
                      }}
                    />
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
                      color: ORANGE,
                      background: '#FBEEE7',
                      borderLeft: '1px solid rgba(194,65,12,0.22)',
                      borderRight: '1px solid rgba(194,65,12,0.22)'
                    }}
                  >
                    Clovion AI
                  </div>
                  <div style={headCell}>Otterly AI</div>
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
                    <div style={{ ...bodyCell, background: '#FBEEE7', borderRight: ' . qq(1px solid rgba(194,65,12,0.22)) . q(', borderLeft: '1px solid rgba(194,65,12,0.22)' }}>
                      <PriceCell plan={row.clovion.plan} body={row.clovion.body} emphasized />
                    </div>
                    <div style={bodyCell}>
                      <PriceCell plan={row.otterly.plan} body={row.otterly.body} />
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

      {/* FINAL CTA ---------------------------------------------------------- */}
      <CTABanner
        heading="Choose Clovion if you want multi-engine coverage and proof that fixes worked."
        sub="Why choose Clovion"
        body="Clovion includes more engines in its core set - notably Claude, Gemini, and Grok - ranks fixes by expected lift and confidence, and re-measures each fix against a baseline and control to prove whether it worked."
        primary="Start Free Trial"
        primaryHref="https://app.clovion.ai/signup"
        secondary="Get Free Score"
        secondaryHref="/free-ai-visibility-score"
      />
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
            color: emphasized ? 'var(--ink)' : 'var(--ink-80)',
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

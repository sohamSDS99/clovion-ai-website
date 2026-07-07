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
  title: 'Clovion vs Searchable: Multi-engine AI visibility comparison',
  description:
    'Clovion and Searchable both help marketing teams track and improve brand visibility across AI-generated answers. The core difference is engine access and how each platform proves impact.'
}

// ---------------------------------------------------------------------------
// This page ships LIGHT (homepage palette) — it is registered as a light
// exception in ThemeShell / Chrome / the layout bootstrap, so var(--*) tokens
// resolve to their light values and the light Header/Footer render. Accents:
// orange #C2410C (brand energy) + emerald var(--positive) (Clovion affordance).
//
// Content — VERBATIM from the source comparison brief. Do not paraphrase.
// ---------------------------------------------------------------------------

const ORANGE = '#C2410C'

// The improvement loop — clauses lifted verbatim from the brief's core
// paragraph ("measure per model, diagnose the cause, prescribe the earnable
// fix, prove the result, and learn from what worked").
const loop = [
  { k: 'Measure', d: 'measure per model' },
  { k: 'Diagnose', d: 'diagnose the cause' },
  { k: 'Prescribe', d: 'prescribe the earnable fix' },
  { k: 'Prove', d: 'prove the result' }
]

// Four possible outcomes. "Landed" gets the emerald positive glyph; the rest
// are differentiated by FORM.
const outcomes: { label: string; form: 'landed' | 'ring' | 'diamond' | 'dashed' }[] = [
  { label: 'Landed', form: 'landed' },
  { label: 'Null', form: 'ring' },
  { label: 'Backfired', form: 'diamond' },
  { label: 'Inconclusive', form: 'dashed' }
]

// Engine coverage — Clovion's standard six-engine set. Searchable status per
// the brief: published plans track only ChatGPT, Google AI Overviews, and
// Perplexity; Claude, Gemini, and Grok require the Custom, talk-to-sales tier.
const engines: { name: string; src: string; searchable: string | boolean }[] = [
  { name: 'ChatGPT', src: '/logos/chatgpt.svg', searchable: true },
  { name: 'Claude', src: '/logos/claude.svg', searchable: 'Requires the Custom, talk-to-sales tier' },
  { name: 'Perplexity', src: '/logos/perplexity.svg', searchable: true },
  { name: 'Gemini', src: '/logos/gemini.svg', searchable: 'Requires the Custom, talk-to-sales tier' },
  { name: 'Grok', src: '/logos/grok.svg', searchable: 'Requires the Custom, talk-to-sales tier' },
  { name: 'Google AI Overviews', src: '/logos/google-ai.svg', searchable: true }
]

const glance: { cat: string; clovion: string; searchable: string }[] = [
  {
    cat: 'Engine coverage',
    clovion:
      'Six engines by tier: ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews. Starter includes 2 models, Growth includes 3 (Claude, Gemini, or Grok selectable), and Enterprise includes all six.',
    searchable:
      'Up to nine engines, but the published plans (Pro, Scale, Enterprise) track only ChatGPT, Google AI Overviews, and Perplexity. Claude, Gemini, Grok, Copilot, DeepSeek, and Google AI Mode require the Custom, talk-to-sales tier.'
  },
  { cat: 'Starting price', clovion: '$79/month', searchable: '$125/month' },
  {
    cat: 'Fix recommendations',
    clovion:
      'Model-specific fixes ranked by priority, difficulty, expected impact, and confidence - then re-measured against a baseline and control to prove the result.',
    searchable:
      'An AI agent generates recommendations, content briefs, and technical fixes, and can create articles. Strong on action; less focused on quantified expected lift or controlled proof of impact.'
  },
  {
    cat: 'Free score',
    clovion: 'Yes. Clovion offers a free AI Visibility Score with no card required.',
    searchable: 'Yes. Searchable offers a free AI visibility score plus a 14-day free trial.'
  },
  {
    cat: 'Self-serve',
    clovion: 'Yes. Starter and Growth are self-serve, with Enterprise for custom needs.',
    searchable: 'Yes. Pro, Scale, and Enterprise are self-serve; Custom is talk-to-sales.'
  },
  {
    cat: 'Best fit',
    clovion:
      'Teams that want accessible Claude, Gemini, and Grok coverage, fixes prioritized by expected lift, and proof that a fix worked.',
    searchable:
      'Teams that want a broad, all-in-one AEO platform with content creation, site audits, and - on Custom - the widest engine coverage.'
  }
]

const chooseClovion = [
  {
    lead: 'You want Claude, Gemini, or Grok without a sales call.',
    body:
      'Clovion offers these on self-serve plans, with Claude selectable from Growth. On Searchable, every published tier - up to the $999 Enterprise plan - tracks only ChatGPT, Google AI Overviews, and Perplexity; the rest are Custom-only.'
  },
  {
    lead: 'You want fixes ranked by expected lift, not only surfaced.',
    body:
      'Clovion ranks each recommendation by priority, difficulty, expected impact, and confidence, so teams act on the highest-value fixes first.'
  },
  {
    lead: 'You want controlled proof a fix worked.',
    body:
      'Clovion re-measures each recommendation against a baseline and control, returning a clear verdict: landed, null, backfired, or inconclusive.'
  },
  {
    lead: 'You want a lower entry price and per-model measurement integrity.',
    body:
      'Clovion starts at $79/month and tracks each engine separately with confidence signals rather than blending everything into one score.'
  }
]

const chooseSearchable = [
  {
    lead: 'You want an all-in-one AEO platform that also creates content.',
    body:
      "Searchable's Content Studio generates articles, landing pages, and product descriptions, and its agent produces briefs and technical fixes - execution Clovion does not offer."
  },
  {
    lead: 'You need the widest engine coverage or extra surfaces.',
    body:
      'On its Custom tier, Searchable tracks up to nine engines, including DeepSeek, Microsoft Copilot, and Google AI Mode, which Clovion does not currently cover.'
  },
  {
    lead: 'You want high tracking volume, site audits at scale, and white-label reporting.',
    body:
      'Searchable scales to 1,250 prompts per model, 3,000 site audits per month, unlimited projects, AI shopping data, and white-label client reports.'
  }
]

const deepDive: DeepDiveItem[] = [
  {
    n: '01',
    title: 'AI engine and model coverage',
    clovion: [
      'Clovion supports six engines - ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI Overviews - with access increasing by plan. Starter includes 2 models, Growth includes 3 (with Claude, Gemini, or Grok selectable as the third), and Enterprise includes all six.'
    ],
    searchable: [
      "Searchable supports a broader universe of up to nine engines, but gates access by tier. Its published Pro, Scale, and Enterprise plans track three fixed engines: ChatGPT, Google AI Overviews, and Perplexity. Claude, Gemini, Grok, Microsoft Copilot, DeepSeek, and Google AI Mode are unlocked only on the Custom, talk-to-sales tier. So a team that wants Claude coverage self-serve can get it on Clovion's Growth plan, but would need a Searchable Custom contract."
    ]
  },
  {
    n: '02',
    title: 'Visibility tracking',
    intro:
      'Both platforms run tracked prompts daily and report where a brand appears in AI answers over time.',
    clovion: [
      'Clovion treats measurement as the first step in an improvement loop. It tracks visibility per model, then connects movement to likely causes, specific prompts, cited sources, competitor movement, and recommended actions.'
    ],
    searchable: [
      'Searchable is strong on volume and analytics: rankings, visibility score, share of voice, sentiment, average position, historical trends, region and location analytics, agent analytics, and AI shopping data, scaling to tens of thousands of analyzed answers per month.'
    ]
  },
  {
    n: '03',
    title: 'Recommendations and fix prioritization',
    clovion: [
      "Clovion's difference is how it prioritizes and qualifies those actions. Each recommendation names the gap, targets specific prompts, identifies the source or page involved, and ranks the fix by priority, difficulty, expected impact, and confidence - producing an ordered roadmap.",
      'Clovion also avoids fake precision. If a prompt is authority-locked or not realistically winnable, it is dropped, monitored, and re-tested later rather than dressed up as a task.'
    ],
    searchable: [
      'Searchable is more than a monitor. Its AI agent analyzes visibility data and generates tailored recommendations, content briefs, and technical fixes, and can surface a daily set of top opportunities. For many teams this is a genuinely useful action layer.'
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
    searchable: [
      'Searchable measures brand perception, competitor framing, cited evidence, and brand fact accuracy across models, giving teams a clear read on positioning.'
    ]
  },
  {
    n: '05',
    title: 'Competitor benchmarking',
    intro: 'Both Clovion and Searchable support competitor analysis.',
    clovion: [
      'Clovion compares visibility against rivals at the prompt and model level, identifying where competitors win, where they lose, which prompt categories matter most, and which gaps are worth fixing.',
      'Clovion advantage: Clovion connects competitor movement to next steps, so teams can move from “competitor X is winning” to “here is the source, page, or substance gap we can fix.”'
    ],
    searchable: [
      'Searchable compares share of voice against competitors, surfaces visibility competitors you may not be tracking, and maps competitor citation gaps and the domains AI engines treat as authoritative in your category.'
    ]
  },
  {
    n: '06',
    title: 'Proof after implementation',
    clovion: [
      'Clovion is positioned around exactly that. A recommendation is treated as a measured hypothesis: the baseline is captured before the change, the measurement clock starts when the change goes live, and results are compared against untouched prompts to separate the fix from market-wide drift.',
      'The outcome can be Landed, Null, Backfired, or Inconclusive. That honesty prevents teams from over-crediting actions that did not actually move visibility.'
    ],
    searchable: [
      'Searchable tracks visibility trends over time and encourages a weekly review habit, which shows whether scores are moving. What it does not advertise is a controlled way to attribute a specific change to a specific fix.'
    ]
  },
  {
    n: '07',
    title: 'Reporting, users, integrations, and content',
    clovion: [
      'Clovion supports custom AI visibility reporting, custom competitor tracking, and priority support on Enterprise. Its stronger differentiation is not breadth of output, but how clearly it explains the next action and whether that action worked.'
    ],
    searchable: [
      'Searchable is well built-out for scaled and agency use: unlimited seats, white-label reports (Scale and above), a Looker Studio connector, MCP, API access, data exports, AI shopping data, and a Content Studio that generates publish-ready assets. Higher tiers add a dedicated AEO specialist.'
    ]
  },
  {
    n: '08',
    title: 'Measurement integrity',
    intro:
      'AI search results can be noisy. A single answer or one-off prompt result is not enough to guide strategy.',
    clovion: [
      'Clovion adds a layer of statistical discipline: repeated sampling, confidence signals, per-model tracking, and controls. It does not blend every model into one generic score, because the same brand can perform differently on ChatGPT, Gemini, Perplexity, Claude, Grok, and Google AI Overviews.',
      'Clovion advantage: Clovion gives teams a more rigorous improvement framework: measure per model, diagnose the cause, prescribe the earnable fix, prove the result, and learn from what worked.'
    ],
    searchable: [
      'Searchable runs systematic, continuous tracking across many prompts and models, which gives it a large, current dataset for trend analysis.'
    ]
  }
]

type PriceRow = {
  cat: string
  clovion: { plan?: string; body: string }
  searchable: { plan?: string; body: string }
}

const pricing: PriceRow[] = [
  {
    cat: 'Entry plan',
    clovion: {
      plan: 'Starter - $79/month',
      body:
        'Includes 50 prompts, 2 AI models, AI Visibility Tracking, Brand Perception, Basic GEO Recommendations, brand mention tracking, sentiment breakdown, and entry-level reporting.'
    },
    searchable: {
      plan: 'Pro - $125/month',
      body:
        'Includes 100 prompts per model across ChatGPT, Google AI Overviews, and Perplexity (9,000 answers analyzed/month), 200 site audits/month, 20 articles/month, 1 project, reports, MCP, and API access. 14-day free trial.'
    }
  },
  {
    cat: 'Mid-tier plan',
    clovion: {
      plan: 'Growth - $229/month',
      body:
        'Includes 100 prompts, 3 AI models (Claude, Gemini, or Grok selectable), Prompt Tracking, Competitor Analysis, Fanout Query Insights, AI Crawlability Checks, Advanced GEO Recommendations, and deeper Brand Perception analysis.'
    },
    searchable: {
      plan: 'Scale - $400/month (Popular)',
      body:
        'Includes 500 prompts per model (45,000 answers/month), 1,000 site audits/month, 80 articles/month, 10 projects, Looker Studio, white-label reports, MCP, and API access.'
    }
  },
  {
    cat: 'Upper plan',
    clovion: {
      plan: 'Not listed as a separate self-serve tier',
      body:
        'Teams that need full coverage move from Growth to Enterprise for unlimited prompts, all six models, and custom reporting.'
    },
    searchable: {
      plan: 'Enterprise - $999/month',
      body:
        'Includes 1,250 prompts per model (112,500 answers/month), 3,000 site audits/month, 200 articles/month, unlimited projects, Looker Studio, white-label reports, MCP, API access, and a dedicated AEO specialist.'
    }
  },
  {
    cat: 'Custom / Enterprise',
    clovion: {
      plan: 'Custom pricing',
      body:
        'Includes unlimited prompts, all six AI models, fully customizable prompt tracking, custom AI visibility reporting, custom competitor tracking, advanced GEO strategy support, and priority support.'
    },
    searchable: {
      plan: 'Custom pricing',
      body:
        'Everything in Enterprise, plus the ability to choose from all models (up to nine), fully customizable prompt tracking, daily or weekly frequency, unlimited projects, API access and SSO, and custom prompt setup.'
    }
  },
  {
    cat: 'Engines and add-ons',
    clovion: {
      body:
        'Engine access expands by plan. Starter includes 2 models, Growth includes 3, and Enterprise includes all six. No per-engine add-on fees.'
    },
    searchable: {
      body:
        'Published tiers track 3 fixed engines. Pro, Scale, and Enterprise track ChatGPT, Google AI Overviews, and Perplexity. Claude, Gemini, Grok, Copilot, DeepSeek, and Google AI Mode require the Custom tier. Annual billing saves 20%.'
    }
  },
  {
    cat: 'Best value for',
    clovion: {
      body:
        'Teams that want accessible multi-engine coverage - including Claude - connected to prioritized GEO recommendations and proof that fixes worked.'
    },
    searchable: {
      body:
        'Teams that want an all-in-one AEO platform with content creation, site audits at scale, high tracking volume, and the widest engine coverage on Custom.'
    }
  }
]

const faqs = [
  {
    q: 'Is Clovion a Searchable alternative?',
    a: 'Yes. Clovion is a Searchable alternative for teams that want to track AI visibility and improve how their brand appears, gets cited, and is described across AI engines - with premium engines available self-serve, fixes ranked by expected impact, and a re-measurement step that proves whether each fix worked.'
  },
  {
    q: 'What is the biggest difference between Clovion and Searchable?',
    a: 'Searchable is a broad, end-to-end AEO platform that also creates content, but its published plans track only ChatGPT, Google AI Overviews, and Perplexity. Clovion offers Claude, Gemini, and Grok on self-serve plans, ranks fixes by expected lift and confidence, and re-measures each fix against a baseline and control to prove it worked.'
  },
  {
    q: 'Does Searchable track Claude, Gemini, or Grok?',
    a: 'Not on its published Pro, Scale, or Enterprise plans - those track ChatGPT, Google AI Overviews, and Perplexity. Claude, Gemini, Grok, Microsoft Copilot, DeepSeek, and Google AI Mode require the Custom, talk-to-sales tier. Clovion includes Claude, Gemini, and Grok in its six-engine set, with Claude selectable from the Growth plan.'
  },
  {
    q: 'Which platform has the lower starting price?',
    a: "Clovion has the lower starting price at $79/month, versus $125/month for Searchable's Pro plan, based on the pricing pages reviewed for this draft. Searchable offers higher tracking volumes at its upper tiers, while Clovion offers premium-engine coverage and proof-of-impact at a lower entry point."
  },
  {
    q: 'Which platform is better for content and agency teams?',
    a: 'Searchable is a strong fit for teams that want an all-in-one platform with built-in content creation, site audits at scale, white-label reports, and the widest engine coverage on its Custom tier. Clovion is a better fit for teams that want accessible premium-engine tracking, fixes prioritized by expected lift, and proof that those fixes actually moved visibility.'
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

function OutcomeGlyph({ form }: { form: 'landed' | 'ring' | 'diamond' | 'dashed' }) {
  const base = { width: 9, height: 9, flexShrink: 0 } as CSSProperties
  if (form === 'landed') {
    // The one positive verdict — emerald filled dot.
    return <span aria-hidden style={{ ...base, borderRadius: 999, background: 'var(--positive)' }} />
  }
  if (form === 'ring') {
    return (
      <span aria-hidden style={{ ...base, borderRadius: 999, border: '1.5px solid var(--ink-50)' }} />
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
  return (
    <span aria-hidden style={{ ...base, borderRadius: 999, border: '1.5px dashed var(--ink-50)' }} />
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
          color: emphasized ? 'var(--positive)' : 'var(--ink-60)',
          whiteSpace: 'nowrap'
        }}
      >
        {price}
      </div>
    </div>
  )
}

function GlanceCell({ value, emphasized }: { value: string; emphasized?: boolean }) {
  const isShort = value.length < 16
  if (isShort) {
    return (
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.05rem',
          color: emphasized ? 'var(--positive)' : 'var(--ink-70)'
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
          background: 'var(--positive)',
          color: '#ffffff'
        }}
      >
        <Check className="h-3.5 w-3.5" />
      </span>
    )
  }
  return <span style={{ fontSize: '0.9rem', color: 'var(--ink-60)' }}>{value as string}</span>
}

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClovionVsSearchablePage() {
  return (
    <div
      className="clv-compare-searchable"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
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
            data-track-location="compare_searchable_hero"
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
                  Clovion vs Searchable
                </span>
              </div>
              <h1 className="display-lg mt-7 text-balance">
                Clovion <span style={{ color: ORANGE }}>vs</span> Searchable.
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
                Clovion and Searchable both help marketing teams track and improve brand visibility
                across AI-generated answers. Searchable is a broad, end-to-end AEO platform: it
                tracks visibility, audits sites, and can even generate content. The core difference
                is engine access and how each platform proves impact.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href="https://app.clovion.ai/signup" trackLocation="compare_searchable_hero" size="lg">
                  Start Free Trial <ArrowRight />
                </Button>
                <Button
                  href="/free-ai-visibility-score"
                  trackLocation="compare_searchable_hero"
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
                boxShadow: 'var(--shadow-soft)'
              }}
            >
              <MatchupRow
                name="Clovion AI"
                price="$79/month"
                note="Free AI Visibility Score, no card required"
                emphasized
              />
              <div className="my-5 flex items-center gap-4" aria-hidden>
                <span style={{ height: 1, flex: 1, background: 'var(--line)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    letterSpacing: '0.18em',
                    color: ORANGE,
                    fontWeight: 600
                  }}
                >
                  VS
                </span>
                <span style={{ height: 1, flex: 1, background: 'var(--line)' }} />
              </div>
              <MatchupRow name="Searchable" price="$125/month" note="14-day free trial available" />

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
            <Eyebrow className="justify-center">Engine access &amp; proof of impact</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              The core difference is engine access and how each platform proves impact.
            </h2>
            <p className="lead mt-5 mx-auto max-w-2xl" style={{ color: 'var(--ink-70)' }}>
              Clovion tracks 6 AI engines - ChatGPT, Claude, Perplexity, Gemini, Grok, and Google AI
              Overviews - with Claude, Gemini, and Grok available on self-serve plans. It ranks every
              fix by expected lift and confidence, then re-measures against a baseline and control to
              prove the fix worked.
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
                      color: ORANGE,
                      opacity: 0.85
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

          {/* loop-back cue — signals the steps repeat and the team learns from what worked */}
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
                border: '1px solid var(--line)',
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
                    border: o.form === 'landed' ? '1px solid var(--positive-border)' : '1px solid var(--line)',
                    background: o.form === 'landed' ? 'var(--positive-bg)' : 'var(--white)',
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: o.form === 'landed' ? 'var(--positive)' : 'var(--ink-70)'
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
              Clovion is built around six AI search surfaces: ChatGPT, Claude, Perplexity, Gemini,
              Grok, and Google AI Overviews.
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
                      color: 'var(--ink)',
                      background: 'var(--positive-bg)',
                      borderLeft: '1px solid var(--line)',
                      borderRight: '1px solid var(--line)'
                    }}
                  >
                    Clovion AI
                  </div>
                  <div style={headCell}>Searchable</div>
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
                        background: 'var(--positive-bg)',
                        borderLeft: '1px solid var(--line)',
                        borderRight: '1px solid var(--line)'
                      }}
                    >
                      <EngineCell value={true} />
                    </div>
                    <div style={bodyCell}>
                      <EngineCell value={e.searchable} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-3xl" style={{ fontSize: '0.9rem', color: 'var(--ink-50)' }}>
            Plan access depends on tier: Starter includes 2 models, Growth includes 3, and Enterprise
            includes all six. Searchable&apos;s published Pro, Scale, and Enterprise plans track
            three fixed engines - ChatGPT, Google AI Overviews, and Perplexity - and reserve Claude,
            Gemini, Grok, and its full model set for its Custom, talk-to-sales tier.
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
                      color: 'var(--ink)',
                      background: 'var(--positive-bg)',
                      borderLeft: '1px solid var(--line)',
                      borderRight: '1px solid var(--line)'
                    }}
                  >
                    Clovion AI
                  </div>
                  <div style={headCell}>Searchable</div>
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
                    <div
                      style={{
                        ...bodyCell,
                        background: 'var(--positive-bg)',
                        borderRight: '1px solid var(--line)',
                        borderLeft: '1px solid var(--line)'
                      }}
                    >
                      <GlanceCell value={row.clovion} emphasized />
                    </div>
                    <div style={bodyCell}>
                      <GlanceCell value={row.searchable} />
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
                border: '1px solid var(--positive-border)',
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
                        background: 'var(--positive)',
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

            {/* Searchable */}
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
                When to choose Searchable
              </h3>
              <ul className="mt-6" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {chooseSearchable.map((it) => (
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
                      color: 'var(--ink)',
                      background: 'var(--positive-bg)',
                      borderLeft: '1px solid var(--line)',
                      borderRight: '1px solid var(--line)'
                    }}
                  >
                    Clovion AI
                  </div>
                  <div style={headCell}>Searchable</div>
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
                    <div
                      style={{
                        ...bodyCell,
                        background: 'var(--positive-bg)',
                        borderRight: '1px solid var(--line)',
                        borderLeft: '1px solid var(--line)'
                      }}
                    >
                      <PriceCell plan={row.clovion.plan} body={row.clovion.body} emphasized />
                    </div>
                    <div style={bodyCell}>
                      <PriceCell plan={row.searchable.plan} body={row.searchable.body} />
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
        heading="See how Clovion compares as a Searchable alternative."
        sub="Why choose Clovion"
        body="Clovion is a Searchable alternative for teams that want to track AI visibility and improve how their brand appears, gets cited, and is described across AI engines - with premium engines available self-serve, fixes ranked by expected impact, and a re-measurement step that proves whether each fix worked."
        primary="Start Free Trial"
        primaryHref="https://app.clovion.ai/signup"
        secondary="Get Free Score"
        secondaryHref="/free-ai-visibility-score"
      />
    </div>
  )
}

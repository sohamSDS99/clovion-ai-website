'use client'

import { useState, useEffect, type CSSProperties, type ReactNode } from 'react'
import PricingTiers from './PricingTiers'
import ComparisonTable from './ComparisonTable'
import { openCalendly } from '@/lib/openCalendly'
import { FAQAccordion } from '@/components/FAQAccordion'

const P_CONTAINER: CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 2rem'
}

const P_DISPLAY_LG: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-lg)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-lg)',
  lineHeight: 1.02,
  textWrap: 'balance' as CSSProperties['textWrap']
}

const P_DISPLAY_MD: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.05,
  textWrap: 'balance' as CSSProperties['textWrap']
}

const P_LEAD: CSSProperties = {
  fontSize: 'var(--text-lead)',
  lineHeight: 1.55,
  fontWeight: 400,
  color: 'var(--ink-70)',
  textWrap: 'balance' as CSSProperties['textWrap']
}

const TYPE_DELAY = 58
const DELETE_DELAY = 26

type TypingHeadlineProps = {
  text: string
  style?: CSSProperties
  caretColor?: string
  as?: 'h1' | 'h2' | 'h3'
}

function TypingHeadline({ text, style, caretColor, as }: TypingHeadlineProps) {
  const reduce =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [n, setN] = useState<number>(reduce ? text.length : 0)
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing')

  useEffect(() => {
    if (reduce) return
    let timer: ReturnType<typeof setTimeout>
    if (phase === 'typing') {
      if (n < text.length) timer = setTimeout(() => setN(n + 1), TYPE_DELAY)
      else timer = setTimeout(() => setPhase('holding'), 80)
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('deleting'), 4200)
    } else {
      if (n > 0) timer = setTimeout(() => setN(n - 1), DELETE_DELAY)
      else timer = setTimeout(() => setPhase('typing'), 650)
    }
    return () => clearTimeout(timer)
  }, [n, phase, reduce, text])

  const blinking = reduce || phase === 'holding'
  const Tag = (as || 'h2') as 'h1' | 'h2' | 'h3'

  return (
    <Tag style={style}>
      {text.slice(0, n)}
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: '0.055em',
          height: '0.82em',
          marginLeft: '0.06em',
          verticalAlign: '-0.02em',
          background: caretColor || 'var(--ink)',
          animation: blinking ? 'clv-blink 1.05s steps(1) infinite' : 'none'
        }}
      />
    </Tag>
  )
}

/* ── Icons ─────────────────────────────────────────────────────── */
function Check({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10m-4-4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── Eyebrow (mono) ────────────────────────────────────────────── */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--ink-60)'
      }}
    >
      {children}
    </div>
  )
}

/* ── 01 — HERO + TIERS ─────────────────────────────────────────── */
function HeroTiers() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.5,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(10,10,15,0.06) 0%, rgba(10,10,15,0.02) 30%, transparent 70%)'
        }}
      />
      <div style={{ ...P_CONTAINER, padding: '3.5rem 2rem 5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}>
          <TypingHeadline
            as="h1"
            text="Pricing that scales with your AI visibility."
            style={{
              ...P_DISPLAY_LG,
              fontSize: 'clamp(2rem, 3vw + 0.3rem, 3.1rem)',
              margin: 0,
              minHeight: '1.04em'
            }}
          />
          <p style={{ ...P_LEAD, maxWidth: 600, margin: '1.5rem auto 0' }}>
            Start by understanding how AI engines describe your brand, then scale into competitor analysis, prompt tracking, and advanced GEO as your strategy grows. Upgrade anytime.
          </p>
        </div>
        <div style={{ marginTop: 48 }}>
          <PricingTiers />
        </div>
      </div>
    </section>
  )
}

/* ── 02 — ALL PLANS INCLUDE ────────────────────────────────────── */
const P_INCLUDE = [
  { t: 'No setup required', d: 'Connect your brand and start tracking AI-generated answers right away.' },
  { t: 'Upgrade anytime', d: 'Begin with Starter or Growth and move up as your tracking needs grow.' },
  { t: 'Cancel anytime', d: 'Your plan stays active until the end of the current billing cycle.' },
  { t: 'Refreshed daily', d: 'Visibility and sentiment tracking updates every day across every engine.' }
]

function AllPlansInclude() {
  return (
    <section style={{ padding: '0 0 var(--section)' }}>
      <div style={P_CONTAINER}>
        <div
          style={{
            borderRadius: 24,
            border: '1px solid var(--line)',
            background: 'var(--subtle)',
            padding: '2.25rem 2rem'
          }}
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
            {P_INCLUDE.map((it) => (
              <div key={it.t} style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
                <span
                  style={{
                    flexShrink: 0,
                    marginTop: 1,
                    height: 22,
                    width: 22,
                    borderRadius: 999,
                    background: 'var(--ink-surface, var(--ink))',
                    color: 'var(--on-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Check size={11} />
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.02rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: 'var(--ink)'
                    }}
                  >
                    {it.t}
                  </div>
                  <p
                    style={{
                      margin: '6px 0 0',
                      fontSize: '0.88rem',
                      lineHeight: 1.5,
                      color: 'var(--ink-60)'
                    }}
                  >
                    {it.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 03 — FEATURE COMPARISON ───────────────────────────────────── */
function Compare() {
  return (
    <section
      id="compare"
      style={{ padding: 'var(--section) 0', background: 'var(--subtle)', scrollMarginTop: 80 }}
    >
      <div style={P_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <Eyebrow>Compare plans</Eyebrow>
          <TypingHeadline
            as="h2"
            text="Every feature, side by side."
            style={{ ...P_DISPLAY_MD, margin: '18px 0 0', minHeight: '1.06em' }}
          />
          <p style={{ ...P_LEAD, margin: '24px 0 0' }}>
            See exactly what each plan tracks — prompts, models, sentiment, competitors, and GEO depth — so you can pick the tier that matches how far your AI search strategy needs to go.
          </p>
        </div>
        <div style={{ marginTop: 48 }}>
          <ComparisonTable />
        </div>
      </div>
    </section>
  )
}

/* ── 04 — FAQ ──────────────────────────────────────────────────── */
const P_FAQS = [
  { q: 'Which Clovion plan is right for my brand?', a: 'The Starter plan is best for small brands or teams that want to begin tracking their AI visibility. The Growth plan is ideal for marketing, SEO, and content teams that need deeper tracking across multiple AI models. Enterprise is designed for larger companies, agencies, or teams that need unlimited prompts, full model coverage, and custom tracking.' },
  { q: 'Which AI models does Clovion track?', a: 'Clovion tracks leading AI engines such as ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews. The number of models available depends on your plan. Starter includes 2 models, Growth includes 3 models, and Enterprise gives access to all available models.' },
  { q: 'Can I choose which AI models I want to track?', a: 'Yes. Growth and Enterprise users can track across multiple AI models. Enterprise users get the most flexibility, including access to all available models and fully customizable prompt tracking.' },
  { q: 'What is included in GEO recommendations?', a: 'GEO recommendations help you improve how AI engines understand and surface your brand. This may include content suggestions, positioning improvements, website optimization insights, and recommendations to strengthen topical authority around important prompts.' },
  { q: 'Can I track my competitors?', a: 'Yes. Competitor analysis is available in the Growth and Enterprise plans. It helps you compare your brand against competitors across relevant prompts and AI-generated answers.' },
  { q: 'Can I upgrade my plan later?', a: 'Yes. You can start with Starter or Growth and upgrade as your tracking needs grow. This is helpful if you want to begin with core visibility tracking and expand into competitor analysis, prompt tracking, and advanced GEO insights later.' },
  { q: 'Do you offer custom pricing?', a: 'Yes. Enterprise plans are available with custom pricing. This option is best for larger teams that need unlimited prompts, all AI models, fully customizable prompt tracking, and custom reporting.' },
  { q: 'Can I cancel my Clovion plan anytime?', a: 'Yes. You can cancel your Clovion plan anytime. After cancellation, your plan will remain active until the end of your current billing cycle.' },
  { q: 'What happens after I cancel my plan?', a: 'Once your billing cycle ends, access to paid features, tracked prompts, model coverage, and advanced reports may be limited based on your account status. Your existing data may be retained for a limited period in case you decide to reactivate your plan.' },
  { q: 'What happens to my prompts if I downgrade?', a: 'If you downgrade to a plan with fewer prompts, you may need to reduce the number of active tracked prompts to match your new plan limit. For example, moving from Growth to Starter would reduce your prompt allowance to 50 prompts, and features such as prompt tracking, competitor analysis, fanout query insights, AI crawlability, and prompt volume insights may no longer be available.' },
  { q: 'Can I switch from a monthly plan to an Enterprise plan?', a: 'Yes. If your team needs unlimited prompts, all AI models, fully customizable prompt tracking, or custom reporting, you can switch to an Enterprise plan by contacting our team.' },
  { q: 'Do plan changes take effect immediately?', a: 'Plan upgrades may take effect immediately so you can access additional prompts, models, and features right away. Downgrades may apply at the end of your current billing cycle, depending on your subscription settings.' }
]

/* ── 05 — FINAL CTA (dark) ─────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={P_CONTAINER}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 28,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            padding: '6rem 3.5rem'
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.6,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          <div
            style={{
              position: 'relative',
              maxWidth: 860,
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            <TypingHeadline
              as="h2"
              text="See your AI visibility before you pick a plan."
              caretColor="var(--on-ink)"
              style={{
                ...P_DISPLAY_LG,
                fontSize: 'clamp(1.4rem, 3.6vw, 2.7rem)',
                whiteSpace: 'nowrap',
                margin: 0,
                color: 'var(--on-ink)',
                minHeight: '1.1em'
              }}
            />
            <p
              style={{
                ...P_LEAD,
                color: 'var(--on-ink-70)',
                marginTop: 24,
                maxWidth: 720,
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              Get a free score on where you’re recommended, where you’re cautioned, and where you’re not mentioned at all — then choose the tier that fits. No card to start.
            </p>
            <div
              style={{
                marginTop: 36,
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              <a
                className="btn btn-primary"
                href="/free-ai-visibility-score"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  height: '3rem',
                  padding: '0 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  whiteSpace: 'nowrap',
                  borderRadius: 999,
                  background: '#ffffff',
                  color: '#000000',
                  border: '1px solid #ffffff',
                  textDecoration: 'none'
                }}
              >
                Get Free Score <ArrowRight />
              </a>
              <a
                className="btn btn-secondary"
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  openCalendly('pricing_final_cta')
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: '3rem',
                  padding: '0 1.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-body)',
                  whiteSpace: 'nowrap',
                  borderRadius: 999,
                  background: 'transparent',
                  color: 'var(--on-ink)',
                  border: '1px solid var(--on-ink-15)',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                Talk to Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── PAGE ──────────────────────────────────────────────────────── */
export default function FeatureContent() {
  return (
    <>
      <HeroTiers />
      <AllPlansInclude />
      <Compare />
      <FAQAccordion items={P_FAQS} />
      <FinalCTA />
    </>
  )
}

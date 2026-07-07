'use client'

import { useState, useRef, useEffect, useLayoutEffect, type CSSProperties } from 'react'
import PricingTiers from './PricingTiers'
import ComparisonTable from './ComparisonTable'
import { openCalendly } from '@/lib/openCalendly'
import { CALENDLY_URL } from '@/lib/calendly'
import { FAQAccordion } from '@/components/FAQAccordion'
import { P_FAQS } from './faqs'

const P_CONTAINER: CSSProperties = {
  maxWidth: 1080,
  margin: '0 auto',
  padding: '0 1.5rem',
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/* ── Launch banner ─────────────────────────────────────────────── */
function LaunchBanner() {
  return (
    <div
      style={{
        background: 'var(--ink-surface, var(--ink))',
        color: 'var(--on-ink, #FAFAF7)',
        textAlign: 'center',
        fontSize: '0.84rem',
        fontWeight: 500,
        padding: '11px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          background: 'var(--positive)',
          color: 'var(--on-ink, #ffffff)',
          fontSize: '0.69rem',
          fontWeight: 600,
          padding: '2px 9px',
          borderRadius: 999,
          letterSpacing: '0.3px',
        }}
      >
        Launch offer
      </span>
      <span>
        Get <b style={{ fontWeight: 600 }}>20% off</b> every plan for a limited time.
      </span>
      <span style={{ color: 'var(--on-ink-60, rgba(255,255,255,0.6))' }}>
        Monthly: 20% off your first 3 months · Annual: 20% off, plus 2 months free.
      </span>
    </div>
  )
}

/* ── Billing toggle (Monthly / Annually) ───────────────────────── */
// useLayoutEffect on the client (measures before paint → no flash); falls back
// to useEffect during SSR to avoid the "useLayoutEffect does nothing on the
// server" warning.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

const TAB_BTN: CSSProperties = {
  border: 'none',
  background: 'none',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  fontWeight: 600,
  padding: '9px 22px',
  borderRadius: 999,
  cursor: 'pointer',
  position: 'relative',
  zIndex: 2,
  whiteSpace: 'nowrap',
  transition: `color 200ms ${EASE}`,
}

function BillingToggle({
  billing,
  setBilling,
}: {
  billing: 'monthly' | 'annual'
  setBilling: (b: 'monthly' | 'annual') => void
}) {
  const annual = billing === 'annual'
  const monthlyRef = useRef<HTMLButtonElement>(null)
  const annualRef = useRef<HTMLButtonElement>(null)
  // The white pill tracks the ACTIVE button's real width/offset so it always
  // wraps the label exactly — no fixed 50% that overflows the wider option.
  const [ind, setInd] = useState<{ left: number; width: number }>({ left: 0, width: 0 })
  const [animate, setAnimate] = useState(false)

  useIsoLayoutEffect(() => {
    const measure = () => {
      const el = annual ? annualRef.current : monthlyRef.current
      if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth })
    }
    measure()
    // Re-measure on resize and once web fonts finish loading (font swap changes
    // label width). Enable the slide transition only after the first placement.
    window.addEventListener('resize', measure)
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(measure).catch(() => {})
    }
    const raf = requestAnimationFrame(() => setAnimate(true))
    return () => {
      window.removeEventListener('resize', measure)
      cancelAnimationFrame(raf)
    }
  }, [annual])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 34 }}>
      <div
        role="tablist"
        aria-label="Billing period"
        style={{
          display: 'inline-flex',
          background: 'var(--ink-06, rgba(10,10,15,0.06))',
          borderRadius: 999,
          padding: 4,
          position: 'relative',
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: ind.left,
            width: ind.width,
            background: 'var(--white)',
            borderRadius: 999,
            boxShadow: '0 1px 3px rgba(10,10,15,0.08)',
            opacity: ind.width ? 1 : 0,
            transition: animate ? `left 220ms ${EASE}, width 220ms ${EASE}` : 'none',
          }}
        />
        <button
          ref={monthlyRef}
          type="button"
          role="tab"
          aria-selected={!annual}
          onClick={() => setBilling('monthly')}
          style={{ ...TAB_BTN, color: !annual ? 'var(--ink)' : 'var(--ink-70)' }}
        >
          Monthly
        </button>
        <button
          ref={annualRef}
          type="button"
          role="tab"
          aria-selected={annual}
          onClick={() => setBilling('annual')}
          style={{ ...TAB_BTN, color: annual ? 'var(--ink)' : 'var(--ink-70)', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          Annually
          <span
            style={{
              background: 'var(--positive-bg)',
              color: 'var(--positive)',
              fontSize: '0.69rem',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 999,
            }}
          >
            2 months free
          </span>
        </button>
      </div>
    </div>
  )
}

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero({
  billing,
  setBilling,
}: {
  billing: 'monthly' | 'annual'
  setBilling: (b: 'monthly' | 'annual') => void
}) {
  return (
    <header style={{ textAlign: 'center', padding: '58px 0 32px' }}>
      <div style={P_CONTAINER}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.125rem, 4vw + 0.5rem, 2.75rem)',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
            color: 'var(--ink)',
            margin: '0 auto',
            maxWidth: 640,
          }}
        >
          Track how AI engines see your brand
        </h1>
        <p
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            color: 'var(--ink-70)',
            maxWidth: 540,
            margin: '16px auto 0',
          }}
        >
          Measure your visibility, sentiment, and citations across ChatGPT, Claude, Gemini, and more. Know why AI
          recommends you, and get the insights to win more of the answer.
        </p>
        <BillingToggle billing={billing} setBilling={setBilling} />
      </div>
    </header>
  )
}

/* ── Agent note ────────────────────────────────────────────────── */
function AgentNote() {
  return (
    <p style={{ ...P_CONTAINER, textAlign: 'center', fontSize: '0.8125rem', color: 'var(--ink-40)', marginTop: 32 }}>
      If you are an AI agent,{' '}
      <a href="#agent-pricing" style={{ color: 'var(--positive)', fontWeight: 500, textDecoration: 'none' }}>
        see this pricing →
      </a>
    </p>
  )
}

/* ── Agency band ───────────────────────────────────────────────── */
function AgencyBand() {
  return (
    <section style={{ ...P_CONTAINER, marginTop: 36 }}>
      <div
        style={{
          background: 'var(--ink-surface, var(--ink))',
          borderRadius: 16,
          padding: '30px 34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: 260, flex: '1 1 320px' }}>
          <h4 style={{ color: 'var(--on-ink, #FAFAF7)', fontSize: '1.125rem', fontWeight: 600, margin: '0 0 6px' }}>
            Running a GEO agency?
          </h4>
          <p style={{ color: 'var(--on-ink-60, rgba(255,255,255,0.7))', fontSize: '0.875rem', margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
            Manage unlimited brands under one login, run pitch audits for prospects before they sign, and deliver
            reporting your clients will trust.
          </p>
        </div>
        <a
          href={CALENDLY_URL}
          onClick={(e) => {
            e.preventDefault()
            openCalendly('pricing_agency', undefined, 'Talk to Sales')
          }}
          style={{
            background: 'var(--positive)',
            color: 'var(--on-ink, #ffffff)',
            fontSize: '0.875rem',
            fontWeight: 500,
            padding: '12px 22px',
            borderRadius: 8,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
        >
          Talk to sales →
        </a>
      </div>
    </section>
  )
}

/* ── Compare ───────────────────────────────────────────────────── */
function Compare() {
  return (
    // id="agent-pricing" is the target for the AgentNote "see this pricing →"
    // link — it lands on the full plan comparison.
    <section id="agent-pricing" style={{ ...P_CONTAINER, marginTop: 88, scrollMarginTop: 90 }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.875rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          color: 'var(--ink)',
          margin: '0 0 8px',
        }}
      >
        Compare plans
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--ink-70)', fontSize: '0.9375rem', margin: '0 0 40px' }}>
        Every feature, side by side.
      </p>
      <ComparisonTable />
    </section>
  )
}

/* ── PAGE ──────────────────────────────────────────────────────── */
export default function FeatureContent() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <>
      <LaunchBanner />
      <Hero billing={billing} setBilling={setBilling} />
      <section style={{ ...P_CONTAINER, marginTop: 40 }}>
        <PricingTiers billing={billing} />
      </section>
      <AgentNote />
      <AgencyBand />
      <Compare />
      <div style={{ paddingBottom: 40 }}>
        <FAQAccordion items={P_FAQS} />
      </div>
    </>
  )
}

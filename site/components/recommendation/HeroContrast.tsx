'use client'

/**
 * Hero visual — "fixes, not dashboards".
 *
 * Left: a passive dashboard of raw signals (muted, no action attached).
 * Right: those signals resolved into a single prioritized, actionable fix card.
 * A connector carries the eye from monitoring → action. On scroll the raw
 * signals settle in, the connector draws, and the fix card rises.
 */

import { type CSSProperties } from 'react'
import {
  Panel,
  Chip,
  Reveal,
  useInView,
  useReducedMotion,
  MONO,
  FIX_CLASS,
  ArrowRight,
  DotIcon,
  PinIcon,
} from './primitives'

const SIGNALS = [
  { k: 'Citation rate', v: '4.4%' },
  { k: 'Share of voice', v: '3.2%' },
  { k: 'Prompts missing you', v: '34 / 61' },
  { k: 'Sentiment', v: 'Neutral' },
]

function DashboardSide() {
  return (
    <Panel label="Dashboard" status="Read-only" pad={18} radius={20} cell={28}>
      <div style={{ display: 'grid', gap: 10 }}>
        {SIGNALS.map((s, i) => (
          <Reveal key={s.k} delay={i * 70} y={8}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 11,
                border: '1px solid var(--line)',
                background: 'var(--white)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                <span style={{ color: 'var(--ink-25)' }}>
                  <DotIcon size={7} />
                </span>
                <span style={{ fontFamily: 'var(--font-body-reg, var(--font-body))', fontSize: '0.82rem', color: 'var(--ink-60)' }}>
                  {s.k}
                </span>
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--ink-70)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {s.v}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ ...MONO, fontSize: '0.6rem', color: 'var(--ink-40)' }}>No action attached</span>
      </div>
    </Panel>
  )
}

function Connector() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const on = reduce || inView
  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--ink-40)',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 34,
          width: 34,
          borderRadius: 999,
          border: '1px solid var(--line)',
          background: 'var(--white)',
          boxShadow: 'var(--shadow-card)',
          opacity: on ? 1 : 0,
          transform: on ? 'none' : 'scale(0.7)',
          transition: reduce ? 'none' : 'opacity 0.5s cubic-bezier(0.16,1,0.3,1) 0.35s, transform 0.5s cubic-bezier(0.16,1,0.3,1) 0.35s',
        }}
      >
        <span className="rec-connector-arrow" style={{ color: 'var(--ink)' }}>
          <ArrowRight size={15} />
        </span>
      </span>
    </div>
  )
}

function FixSide() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const on = reduce || inView
  const fc = FIX_CLASS.source
  return (
    <div
      ref={ref}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(16px) scale(0.98)',
        transition: reduce
          ? 'none'
          : 'opacity 0.65s cubic-bezier(0.16,1,0.3,1) 0.5s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.5s',
      }}
    >
      <Panel
        label="Recommendation"
        status="Ready to act"
        pad={18}
        radius={20}
        cell={28}
        style={{ boxShadow: 'var(--shadow-soft)', borderColor: 'var(--ink)' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
          <Chip fg="#b45309" bg="#fffbeb" border="rgba(180,83,9,0.24)">High priority</Chip>
          <Chip fg={fc.fg} bg={fc.bg} border={fc.border}>{fc.label}</Chip>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
          Get cited in the G2 comparison set
        </div>
        <p
          style={{
            fontFamily: 'var(--font-body-reg, var(--font-body))',
            fontSize: '0.86rem',
            lineHeight: 1.55,
            color: 'var(--ink-70)',
            margin: '10px 0 14px',
          }}
        >
          Claim your G2 category profile and add verified reviews so AI stops recommending competitors without you.
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            padding: '9px 11px',
            borderRadius: 11,
            border: '1px solid var(--line)',
            background: 'var(--subtle)',
          }}
        >
          <span style={{ color: 'var(--ink-50)' }}>
            <PinIcon size={12} />
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-70)' }}>
            g2.com/categories/ai-visibility
          </span>
        </div>
      </Panel>
    </div>
  )
}

export function HeroContrast() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        alignItems: 'center',
        gridTemplateColumns: '1fr',
      }}
      className="rec-hero-contrast"
    >
      <DashboardSide />
      <Connector />
      <FixSide />
      <style>{`
        @media (min-width: 860px) {
          .rec-hero-contrast {
            grid-template-columns: 1fr auto 1fr !important;
            gap: 20px !important;
          }
        }
        @media (max-width: 859px) {
          .rec-connector-arrow { transform: rotate(90deg); }
        }
      `}</style>
    </div>
  )
}

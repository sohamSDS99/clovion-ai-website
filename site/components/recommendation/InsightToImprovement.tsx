'use client'

/**
 * "From Insight To Improvement" — the concise closing flow tying:
 *   identify the gap type → recommend the right fix → track whether it changed
 *   how AI represents your brand.
 *
 * Three steps in sequence with drawn connectors; reveals staggered on scroll.
 */

import { type CSSProperties } from 'react'
import {
  Panel,
  Reveal,
  useInView,
  useReducedMotion,
  MONO,
  ArrowRight,
} from './primitives'

const STEPS = [
  {
    n: '01',
    title: 'Identify the gap type',
    body: 'Source presence, substance, or framing — the cause behind weak AI visibility.',
  },
  {
    n: '02',
    title: 'Recommend the right fix',
    body: 'A prioritized action tied to the fix class and the exact surface to change.',
  },
  {
    n: '03',
    title: 'Track the change',
    body: 'Watch whether the fix changed how AI cites, ranks, and describes your brand.',
  },
]

const STEP_TITLE: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.02rem',
  fontWeight: 600,
  color: 'var(--ink)',
  margin: 0,
}
const STEP_BODY: CSSProperties = {
  fontFamily: 'var(--font-body-reg, var(--font-body))',
  fontSize: '0.86rem',
  lineHeight: 1.55,
  color: 'var(--ink-70)',
  margin: '8px 0 0',
}

function StepConnector() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const on = reduce || inView
  return (
    <div
      ref={ref}
      aria-hidden
      className="rec-step-connector"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-40)' }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 30,
          width: 30,
          borderRadius: 999,
          border: '1px solid var(--line)',
          background: 'var(--white)',
          opacity: on ? 1 : 0,
          transform: on ? 'none' : 'scale(0.6)',
          transition: reduce ? 'none' : 'opacity 0.45s cubic-bezier(0.16,1,0.3,1), transform 0.45s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <span className="rec-step-arrow">
          <ArrowRight size={14} />
        </span>
      </span>
    </div>
  )
}

function Step({ n, title, body, delay }: { n: string; title: string; body: string; delay: number }) {
  return (
    <Reveal delay={delay} y={16} style={{ height: '100%' }}>
      <Panel grid corners pad={18} radius={18} style={{ height: '100%' }}>
        <span
          style={{
            ...MONO,
            fontSize: '0.62rem',
            fontWeight: 700,
            color: 'var(--ink-40)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {n}
        </span>
        <h3 style={{ ...STEP_TITLE, marginTop: 12 }}>{title}</h3>
        <p style={STEP_BODY}>{body}</p>
      </Panel>
    </Reveal>
  )
}

export function InsightToImprovement() {
  return (
    <div
      className="rec-insight-flow"
      style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr', alignItems: 'stretch' }}
    >
      <Step {...STEPS[0]} delay={0} />
      <StepConnector />
      <Step {...STEPS[1]} delay={120} />
      <StepConnector />
      <Step {...STEPS[2]} delay={240} />
      <style>{`
        @media (min-width: 900px) {
          .rec-insight-flow { grid-template-columns: 1fr auto 1fr auto 1fr !important; gap: 14px !important; }
        }
        @media (max-width: 899px) {
          .rec-step-arrow { display: inline-flex; transform: rotate(90deg); }
        }
      `}</style>
    </div>
  )
}

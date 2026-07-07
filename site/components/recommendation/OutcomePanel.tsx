'use client'

/**
 * "Track The Outcome" — the four-part outcome panel:
 *   • Implementation lifecycle → visible pipeline Baselined → Issued →
 *     Implemented → Measuring → Resolved
 *   • Citation movement        → citation-frequency movement (rising)
 *   • Visibility trend         → trend line
 *   • Confidence signal        → confidence / data-sufficiency meter
 *
 * Each part's label + description is rendered verbatim. Visuals animate in on
 * scroll and snap to final under reduced motion.
 */

import { type CSSProperties, type ReactNode } from 'react'
import {
  Panel,
  Reveal,
  useInView,
  useReducedMotion,
  MONO,
  CheckIcon,
  PulseIcon,
} from './primitives'

const PART_LABEL: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '1rem',
  fontWeight: 600,
  color: 'var(--ink)',
}
const PART_DESC: CSSProperties = {
  fontFamily: 'var(--font-body-reg, var(--font-body))',
  fontSize: '0.9rem',
  lineHeight: 1.55,
  color: 'var(--ink-70)',
  margin: '6px 0 0',
}
const VIZ_LABEL: CSSProperties = { ...MONO, fontSize: '0.58rem', fontWeight: 600, color: 'var(--ink-50)' }

/* ── Implementation lifecycle pipeline ─────────────────────────── */
const STAGES = [
  { key: 'baselined', label: 'Baselined', state: 'done' },
  { key: 'issued', label: 'Issued', state: 'done' },
  { key: 'implemented', label: 'Implemented', state: 'done' },
  { key: 'measuring', label: 'Measuring', state: 'current' },
  { key: 'resolved', label: 'Resolved', state: 'pending' },
] as const

function Lifecycle() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const on = reduce || inView
  // progress fill reaches the "current" stage (index 3 of 5 → 3/4 of the track)
  const currentIdx = STAGES.findIndex((s) => s.state === 'current')
  const fillPct = (currentIdx / (STAGES.length - 1)) * 100

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* track */}
      <div
        className="rec-lifecycle"
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`,
        }}
      >
        {/* baseline rail */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 13,
            left: `calc(100% / ${STAGES.length * 2})`,
            right: `calc(100% / ${STAGES.length * 2})`,
            height: 2,
            background: 'var(--line)',
          }}
        />
        {/* progress rail */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 13,
            left: `calc(100% / ${STAGES.length * 2})`,
            height: 2,
            background: 'var(--ink)',
            width: on ? `calc((100% - 100% / ${STAGES.length}) * ${fillPct / 100})` : 0,
            transition: reduce ? 'none' : 'width 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
          }}
        />
        {STAGES.map((s, i) => {
          const done = s.state === 'done'
          const current = s.state === 'current'
          const dotBg = done ? 'var(--ink)' : current ? 'var(--positive)' : 'var(--white)'
          const dotBorder = done ? 'var(--ink)' : current ? 'var(--positive)' : 'var(--ink-25)'
          const dotColor = done || current ? 'var(--on-ink, #fff)' : 'var(--ink-40)'
          return (
            <div
              key={s.key}
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  height: 28,
                  width: 28,
                  borderRadius: 999,
                  background: dotBg,
                  border: `2px solid ${dotBorder}`,
                  color: dotColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: on || s.state === 'pending' ? 1 : 0,
                  transform: on ? 'scale(1)' : 'scale(0.6)',
                  transition: reduce ? 'none' : `opacity 0.4s ease ${0.15 + i * 0.13}s, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.13}s`,
                  boxShadow: current ? '0 0 0 4px var(--positive-bg)' : 'none',
                }}
              >
                {done ? <CheckIcon size={11} /> : current ? <PulseIcon size={12} /> : <span style={{ height: 5, width: 5, borderRadius: 999, background: 'var(--ink-25)' }} />}
              </span>
              <span
                className="rec-lc-label"
                style={{
                  ...MONO,
                  fontSize: '0.58rem',
                  fontWeight: 600,
                  color: current ? 'var(--positive)' : done ? 'var(--ink-70)' : 'var(--ink-40)',
                }}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Citation movement (rising frequency bars) ─────────────────── */
function CitationMovement() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const on = reduce || inView
  const bars = [22, 28, 26, 41, 55, 72]
  return (
    <div ref={ref}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, height: 92 }}>
        {bars.map((h, i) => {
          const recent = i >= 3
          return (
            <span
              key={i}
              style={{
                flex: 1,
                height: on ? `${h}%` : '4%',
                borderRadius: 5,
                background: recent ? 'var(--positive)' : 'var(--ink-25)',
                transition: reduce ? 'none' : `height 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s`,
              }}
            />
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9 }}>
        <span style={VIZ_LABEL}>Before</span>
        <span style={{ ...MONO, fontSize: '0.58rem', fontWeight: 600, color: 'var(--positive)' }}>+3.3&times; cited</span>
      </div>
    </div>
  )
}

/* ── Visibility trend (rising line) ────────────────────────────── */
function VisibilityTrend() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const on = reduce || inView
  const pts = '0,52 20,48 40,50 60,38 80,30 100,16'
  return (
    <div ref={ref}>
      <div style={{ position: 'relative', height: 92 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="rec-trend-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--positive)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--positive)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,60 ${pts} 100,60`} fill="url(#rec-trend-fill)" style={{ opacity: on ? 1 : 0, transition: reduce ? 'none' : 'opacity 0.8s ease 0.5s' }} />
          <polyline
            points={pts}
            fill="none"
            stroke="var(--positive)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            style={{
              strokeDasharray: 240,
              strokeDashoffset: on ? 0 : 240,
              transition: reduce ? 'none' : 'stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s',
            }}
          />
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9 }}>
        <span style={VIZ_LABEL}>Cited · ranked · recommended</span>
        <span style={{ ...MONO, fontSize: '0.58rem', fontWeight: 600, color: 'var(--positive)' }}>&uarr; trending</span>
      </div>
    </div>
  )
}

/* ── Confidence signal (segmented meter) ───────────────────────── */
function ConfidenceSignal() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const on = reduce || inView
  const segs = 5
  const filled = 4 // "Meaningful"
  return (
    <div ref={ref}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 92 }}>
        {Array.from({ length: segs }).map((_, i) => {
          const active = i < filled
          return (
            <span
              key={i}
              style={{
                flex: 1,
                height: `${28 + i * 16}%`,
                borderRadius: 5,
                background: active ? 'var(--positive)' : 'var(--subtle)',
                border: active ? 'none' : '1px solid var(--line)',
                opacity: on ? 1 : 0.25,
                transform: on ? 'scaleY(1)' : 'scaleY(0.4)',
                transformOrigin: 'bottom',
                transition: reduce ? 'none' : `opacity 0.4s ease ${i * 0.09}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s`,
              }}
            />
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 }}>
        <span style={VIZ_LABEL}>Data sufficiency</span>
        <span style={{ ...MONO, fontSize: '0.58rem', fontWeight: 600, color: 'var(--positive)' }}>Meaningful</span>
      </div>
    </div>
  )
}

/* ── outcome sub-part wrapper ──────────────────────────────────── */
function OutcomePart({
  label,
  desc,
  viz,
  delay,
  span2,
}: {
  label: string
  desc: ReactNode
  viz: ReactNode
  delay: number
  span2?: boolean
}) {
  return (
    <Reveal delay={delay} y={18} style={{ gridColumn: span2 ? '1 / -1' : 'auto', height: '100%' }} className={span2 ? 'rec-outcome-full' : undefined}>
      <Panel grid corners pad={18} radius={20} style={{ height: '100%' }}>
        <div style={{ marginBottom: 18 }}>
          <div style={PART_LABEL}>{label}</div>
          <p style={PART_DESC}>{desc}</p>
        </div>
        {viz}
      </Panel>
    </Reveal>
  )
}

export function OutcomePanel() {
  return (
    <div className="rec-outcome-grid" style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr' }}>
      <OutcomePart
        span2
        delay={0}
        label="Implementation lifecycle"
        desc="Follow every recommendation from Baselined to Issued, Implemented, Measuring, and Resolved."
        viz={<Lifecycle />}
      />
      <OutcomePart
        delay={90}
        label="Citation movement"
        desc="See whether the target sources start appearing more often in AI answers."
        viz={<CitationMovement />}
      />
      <OutcomePart
        delay={160}
        label="Visibility trend"
        desc="Track whether your brand is cited, ranked, or recommended more often after the fix."
        viz={<VisibilityTrend />}
      />
      <OutcomePart
        delay={230}
        label="Confidence signal"
        desc="Understand whether the change appears meaningful or still needs more data."
        viz={<ConfidenceSignal />}
      />
      <style>{`
        @media (min-width: 900px) {
          .rec-outcome-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .rec-outcome-full { grid-column: 1 / -1 !important; }
        }
        @media (max-width: 560px) {
          .rec-lifecycle .rec-lc-label { font-size: 0.5rem; }
        }
      `}</style>
    </div>
  )
}

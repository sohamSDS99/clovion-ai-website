'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Container, ArrowRight } from '@/components/ui'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

const STEPS = [
  'Measure your baseline before making any changes.',
  'Implement the recommendation and track its progress.',
  'See whether it improved your AI visibility over time.'
]

// Canonical reveal-on-scroll: fires once, snaps to final under reduced motion.
function useRevealOnce(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null)
  const hasRun = useRef(false)
  const [on, setOn] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setReduced(true)
      hasRun.current = true
      setOn(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !hasRun.current) {
            hasRun.current = true
            setOn(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, on, reduced }
}

export function MeasureExperiment() {
  const { ref, on, reduced } = useRevealOnce(0.2)

  return (
    <section ref={ref} className="py-12 md:py-20" data-track-location="home_measure">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.12fr] md:gap-16 items-center">
          {/* ── LEFT: narrative + stepper + CTAs ── */}
          <div
            style={{
              maxWidth: 560,
              opacity: on ? 1 : 0,
              transform: on ? 'none' : 'translateY(20px)',
              transition: reduced ? 'none' : `opacity 0.6s ${EASE}, transform 0.7s ${EASE}`
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-50)'
              }}
            >
              Measure the outcome
            </span>

            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--display-md)',
                fontWeight: 600,
                letterSpacing: 'var(--track-display-md)',
                lineHeight: 1.05,
                margin: '18px 0 0',
                textWrap: 'balance',
                color: 'var(--ink)'
              }}
            >
              Don&rsquo;t just implement recommendations. Measure them.
            </h2>

            <p
              style={{
                fontSize: 'var(--text-lead)',
                lineHeight: 1.55,
                color: 'var(--ink-70)',
                margin: '20px 0 0',
                maxWidth: 520,
                textWrap: 'balance'
              }}
            >
              Every recommendation becomes a measurable experiment. Benchmark where you started, implement the change, and see whether it actually improved your AI visibility.
            </p>

            {/* Stepper — the three locked strings appear exactly once, here. */}
            <ol style={{ listStyle: 'none', position: 'relative', margin: '32px 0 0', padding: 0 }}>
              <span
                aria-hidden
                style={{ position: 'absolute', left: 15, top: 16, bottom: 16, width: 1, background: 'var(--line)' }}
              />
              {STEPS.map((s, i) => {
                const isLast = i === STEPS.length - 1
                const isThird = i === 2
                return (
                  <li
                    key={i}
                    style={{
                      position: 'relative',
                      display: 'grid',
                      gridTemplateColumns: '32px 1fr',
                      gap: 14,
                      alignItems: 'start',
                      marginBottom: isLast ? 0 : 22,
                      opacity: on ? 1 : 0,
                      transform: on ? 'none' : 'translateY(8px)',
                      transition: reduced ? 'none' : `opacity 0.5s ${EASE} ${0.15 + i * 0.1}s, transform 0.55s ${EASE} ${0.15 + i * 0.1}s`
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        border: `1px solid ${isThird ? 'var(--positive-border)' : 'var(--ink-15)'}`,
                        background: 'var(--white)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        fontVariantNumeric: 'tabular-nums',
                        color: isThird ? 'var(--positive)' : 'var(--ink-70)'
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--ink-80)', paddingTop: 5 }}>{s}</span>
                  </li>
                )
              })}
            </ol>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="home_measure">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="home_measure">
                Get Free Score
              </Button>
            </div>
            <p
              className="mt-5"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-50)'
              }}
            >
              First score in 24h · No credit card
            </p>
          </div>

          {/* ── RIGHT: citation-share experiment chart ── */}
          <CitationShareChart on={on} reduced={reduced} />
        </div>
      </Container>
    </section>
  )
}

/* ── Chart geometry (viewBox 0 0 680 380; y = citation share 0–8%) ────────── */
const CW = 680
const PL = 46
const PR = 16
const PT = 44
const PB = 40
const CH = 380
const PLOT_B = CH - PB
const gx = (i: number) => PL + (i / 6) * (CW - PL - PR)
const gy = (p: number) => PLOT_B - (p / 8) * (PLOT_B - PT)
const pt = (i: number, p: number) => `${gx(i).toFixed(1)} ${gy(p).toFixed(1)}`

// 90% confidence band (upper left→right, then lower right→left, closed)
const BAND = `M ${pt(0, 5)} L ${pt(1, 5)} L ${pt(2, 7)} L ${pt(3, 8)} L ${pt(3, 2)} L ${pt(2, 1.5)} L ${pt(1, 1)} L ${pt(0, 1)} Z`
// Target prompt: flat 3% to w1, then rises to 5% at w3 (today)
const TARGET = `M ${pt(0, 3)} L ${pt(1, 3)} L ${pt(3, 5)}`
// Control (untouched prompts): flat at baseline 3% from w1 → w3
const CONTROL = `M ${pt(1, 3)} L ${pt(3, 3)}`
const GRID = [0, 2, 4, 6, 8]
const WEEKS = [0, 1, 2, 3, 4, 5, 6]

// A small circled "i" info affordance.
function InfoDot() {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 15,
        height: 15,
        borderRadius: 999,
        border: '1px solid var(--ink-30)',
        color: 'var(--ink-40)',
        fontSize: 9,
        fontStyle: 'italic',
        lineHeight: 1,
        marginLeft: 7,
        flexShrink: 0
      }}
    >
      i
    </span>
  )
}

function CitationShareChart({ on, reduced }: { on: boolean; reduced: boolean }) {
  const show = on || reduced
  const label = 'rgba(10,10,15,0.5)'
  const labelDim = 'rgba(10,10,15,0.4)'

  return (
    <div
      className="clv-cite-chart"
      style={{
        position: 'relative',
        background: 'var(--white)',
        border: '1px solid var(--line)',
        borderRadius: 20,
        boxShadow: 'var(--shadow-card)',
        padding: 'clamp(20px, 3vw, 30px)',
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(24px) scale(0.985)',
        transition: reduced ? 'none' : `opacity 0.7s ${EASE}, transform 0.9s ${EASE}`
      }}
    >
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: label }}>
          Citation share over time <InfoDot />
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.7rem', letterSpacing: '0.04em', color: label, whiteSpace: 'nowrap' }}>
          Baseline 3% (±2) <InfoDot />
        </span>
      </div>

      {/* chart */}
      <svg viewBox={`0 0 ${CW} ${CH}`} width="100%" style={{ display: 'block', marginTop: 14, overflow: 'visible' }} role="img" aria-label="Citation share over time: the target prompt climbs from a 3% baseline to 5% by today, while control prompts stay flat at 3%; a 90% confidence band widens over the weeks.">
        {/* horizontal gridlines + y labels */}
        {GRID.map((p) => (
          <g key={p}>
            <line x1={PL} y1={gy(p)} x2={CW - PR} y2={gy(p)} stroke="rgba(10,10,15,0.08)" strokeWidth={1} />
            <text x={PL - 10} y={gy(p) + 4} textAnchor="end" fontSize={13} fill={labelDim}>{p}%</text>
          </g>
        ))}

        {/* 90% confidence band */}
        <path d={BAND} fill="rgba(10,10,15,0.055)" style={{ opacity: show ? 1 : 0, transition: reduced ? 'none' : `opacity 0.8s ${EASE} 0.2s` }} />

        {/* "implemented" marker at w1 (dashed) */}
        <line x1={gx(1)} y1={PT} x2={gx(1)} y2={PLOT_B} stroke="rgba(10,10,15,0.28)" strokeWidth={1} strokeDasharray="3 4" />
        <text x={gx(1) + 8} y={PT - 12} fontSize={13} fill={label}>implemented</text>

        {/* "today" marker at w3 (solid) */}
        <line x1={gx(3)} y1={PT} x2={gx(3)} y2={PLOT_B} stroke="rgba(10,10,15,0.55)" strokeWidth={1.25} />
        <text x={gx(3)} y={PT - 12} textAnchor="middle" fontSize={13} fill="rgba(10,10,15,0.7)">today</text>

        {/* control (untouched) — dashed grey at baseline */}
        <path d={CONTROL} fill="none" stroke="rgba(10,10,15,0.4)" strokeWidth={1.75} strokeDasharray="5 5" strokeLinecap="round" style={{ opacity: show ? 1 : 0, transition: reduced ? 'none' : `opacity 0.5s ${EASE} 1.1s` }} />

        {/* target prompt — solid ink, draws on */}
        <path
          d={TARGET}
          fill="none"
          stroke="var(--ink)"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={show ? 0 : 1}
          style={{ transition: reduced ? 'none' : `stroke-dashoffset 1.2s ${EASE} 0.4s` }}
        />

        {/* endpoints */}
        <circle cx={gx(0)} cy={gy(3)} r={4.5} fill="var(--ink)" style={{ opacity: show ? 1 : 0, transition: reduced ? 'none' : `opacity 0.3s ${EASE} 0.4s` }} />
        <circle cx={gx(3)} cy={gy(5)} r={6} fill="var(--ink)" style={{ opacity: show ? 1 : 0, transition: reduced ? 'none' : `opacity 0.35s ${EASE} 1.4s` }} />

        {/* x labels */}
        {WEEKS.map((i) => (
          <text key={i} x={gx(i)} y={PLOT_B + 24} textAnchor="middle" fontSize={13} fill={labelDim}>w{i}</text>
        ))}
      </svg>

      {/* legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 22px', marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line)', fontSize: '0.7rem', color: 'var(--ink-60)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          <span aria-hidden style={{ width: 24, height: 2.5, borderRadius: 2, background: 'var(--ink)' }} />
          Target prompt
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          <span aria-hidden style={{ width: 24, height: 0, borderTop: '2px dashed var(--ink-40)' }} />
          Control · untouched prompts
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          <span aria-hidden style={{ width: 20, height: 13, borderRadius: 3, background: 'rgba(10,10,15,0.09)' }} />
          90% confidence band
        </span>
      </div>
    </div>
  )
}

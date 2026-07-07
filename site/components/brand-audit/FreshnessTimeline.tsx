'use client'

/**
 * Section 05 — "Always Up To Date".
 *
 * A fin.ai-style area chart of the Brand Audit re-running over time: each audit
 * validates prior findings and drives "Findings resolved" upward. Dashed grid
 * backdrop (from Panel) + rotated mono month labels + white/ink data dots +
 * emerald area fill + a dark tooltip callout on one highlighted re-run point,
 * attached to a thin vertical rule down to the axis. On scroll-in the area
 * reveals left-to-right and the headline value counts up; all motion snaps to
 * final under prefers-reduced-motion.
 */

import { useId } from 'react'
import {
  MONO,
  MonoEyebrow,
  Panel,
  RefreshIcon,
  Reveal,
  useInView,
} from '@/components/brand-audit/primitives'
import { cb, useCountUp, useReducedMotion, useReveal } from '@/components/home/mocks/motion'

/* ── Chart geometry ────────────────────────────────────────────── */
const VW = 820
const VH = 380
const PAD = { top: 26, right: 26, bottom: 54, left: 46 }
const PLOT_W = VW - PAD.left - PAD.right
const PLOT_H = VH - PAD.top - PAD.bottom

/* Monthly audit history — "Findings resolved" (%) climbing over 15 months as
   audits re-run and validate prior findings. Realistic AEO cadence. */
type Point = { label: string; value: number; rerun?: boolean }
const DATA: Point[] = [
  { label: 'JAN 2025', value: 21 },
  { label: 'FEB 2025', value: 27 },
  { label: 'MAR 2025', value: 33, rerun: true },
  { label: 'APR 2025', value: 38 },
  { label: 'MAY 2025', value: 41 },
  { label: 'JUN 2025', value: 47 },
  { label: 'JUL 2025', value: 52 },
  { label: 'AUG 2025', value: 55 },
  { label: 'SEP 2025', value: 61, rerun: true },
  { label: 'OCT 2025', value: 66 },
  { label: 'NOV 2025', value: 71 },
  { label: 'DEC 2025', value: 74 },
  { label: 'JAN 2026', value: 79 },
  { label: 'MAR 2026', value: 86, rerun: true },
  { label: 'JUL 2026', value: 92 },
]

const Y_TICKS = [0, 25, 50, 75, 100]
const HIGHLIGHT = 13 // MAR 2026 · Re-run — the one tooltip callout

const FINAL_VALUE = DATA[DATA.length - 1].value

const xAt = (i: number) => PAD.left + (i / (DATA.length - 1)) * PLOT_W
const yAt = (v: number) => PAD.top + (1 - v / 100) * PLOT_H

/** Smooth-ish path built with short line segments (keeps the emerald ridge
    calm and legible without overshoot). */
function buildLinePath(): string {
  return DATA.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(p.value).toFixed(1)}`).join(' ')
}
function buildAreaPath(): string {
  const top = buildLinePath()
  const lastX = xAt(DATA.length - 1)
  const firstX = xAt(0)
  const baseY = PAD.top + PLOT_H
  return `${top} L ${lastX.toFixed(1)} ${baseY} L ${firstX.toFixed(1)} ${baseY} Z`
}

export function FreshnessTimeline() {
  const uid = useId().replace(/:/g, '')
  const reduce = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.32 })
  const play = useReveal(inView)

  const count = useCountUp(FINAL_VALUE, play, { durationMs: 1100, startMs: 240 })
  const shownValue = reduce ? FINAL_VALUE : count

  // Left-to-right reveal via a clip-path that opens from 0% → 100% width.
  const revealPct = reduce ? 100 : play ? 100 : 0

  const linePath = buildLinePath()
  const areaPath = buildAreaPath()

  const hp = DATA[HIGHLIGHT]
  const hx = xAt(HIGHLIGHT)
  const hy = yAt(hp.value)
  const axisBaseY = PAD.top + PLOT_H

  // Tooltip box geometry (SVG units), placed above/left of the highlight point.
  const tipW = 168
  const tipH = 52
  const tipX = Math.min(hx + 12, VW - PAD.right - tipW)
  const tipY = Math.max(hy - tipH - 18, PAD.top + 2)

  return (
    <div ref={ref}>
      <Reveal>
        <Panel
          label="Audit history"
          status={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--positive)' }}>
              <RefreshIcon size={12} />
              <span style={{ ...MONO, fontSize: '0.62rem', fontWeight: 600 }}>Auto re-run</span>
            </span>
          }
          pad={26}
        >
          {/* Headline value moment */}
          <div
            className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
            style={{ marginBottom: 18 }}
          >
            <div>
              <MonoEyebrow color="var(--ink-50)">Findings resolved</MonoEyebrow>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.4rem, 5vw, 3.4rem)',
                    fontWeight: 600,
                    lineHeight: 0.95,
                    color: 'var(--ink)',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {shownValue}%
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    ...MONO,
                    fontSize: '0.64rem',
                    fontWeight: 600,
                    color: 'var(--positive)',
                  }}
                >
                  <RefreshIcon size={11} />
                  15 audits · JAN 2025—JUL 2026
                </span>
              </div>
            </div>

            {/* Cyclical re-run loop badge */}
            <span
              aria-hidden
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                alignSelf: 'flex-start',
                padding: '6px 11px',
                borderRadius: 999,
                border: '1px solid var(--line)',
                background: 'var(--subtle)',
                ...MONO,
                fontSize: '0.6rem',
                fontWeight: 600,
                color: 'var(--ink-60)',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  color: 'var(--positive)',
                  animation: reduce ? 'none' : 'clv-spin 4.5s linear infinite',
                }}
              >
                <RefreshIcon size={12} />
              </span>
              Re-run loop
            </span>
          </div>

          {/* The chart */}
          <div style={{ width: '100%' }}>
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              width="100%"
              height="auto"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Area chart of Brand Audit findings resolved climbing from 21 percent in January 2025 to 92 percent in July 2026, with three automatic re-runs marked along the way that validate previous findings."
              style={{ display: 'block' }}
            >
              <defs>
                <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--positive)" stopOpacity="0.28" />
                  <stop offset="60%" stopColor="var(--positive)" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="var(--positive)" stopOpacity="0" />
                </linearGradient>
                <clipPath id={`reveal-${uid}`}>
                  <rect
                    x={0}
                    y={0}
                    width={(VW * revealPct) / 100}
                    height={VH}
                    style={{
                      transition: reduce ? 'none' : `width 1.15s ${cb}`,
                    }}
                  />
                </clipPath>
              </defs>

              {/* Faint own gridlines (subtle — Panel's dashed grid is the backdrop) */}
              <g aria-hidden>
                {Y_TICKS.map((t) => {
                  const y = yAt(t)
                  return (
                    <g key={t}>
                      <line
                        x1={PAD.left}
                        x2={VW - PAD.right}
                        y1={y}
                        y2={y}
                        stroke="var(--ink)"
                        strokeOpacity={0.08}
                        strokeWidth={1}
                        strokeDasharray="2 6"
                      />
                      <text
                        x={PAD.left - 10}
                        y={y + 3.5}
                        textAnchor="end"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 10.5,
                          fill: 'var(--ink-40)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {t}
                      </text>
                    </g>
                  )
                })}
              </g>

              {/* Area fill + line, revealed left-to-right under the clip */}
              <g clipPath={`url(#reveal-${uid})`}>
                <path d={areaPath} fill={`url(#area-${uid})`} />
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--positive)"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>

              {/* Re-run markers: vertical tick + tiny refresh glyph */}
              <g aria-hidden>
                {DATA.map((p, i) =>
                  p.rerun && i !== HIGHLIGHT ? (
                    <g key={`rr-${i}`} opacity={play || reduce ? 1 : 0} style={{ transition: reduce ? 'none' : `opacity 0.5s ${cb}`, transitionDelay: `${700 + i * 30}ms` }}>
                      <line
                        x1={xAt(i)}
                        x2={xAt(i)}
                        y1={yAt(p.value)}
                        y2={axisBaseY}
                        stroke="var(--positive)"
                        strokeOpacity={0.34}
                        strokeWidth={1}
                        strokeDasharray="2 3"
                      />
                      <g transform={`translate(${xAt(i) - 6}, ${yAt(p.value) - 22})`} style={{ color: 'var(--positive)' }}>
                        <RefreshIcon size={12} />
                      </g>
                    </g>
                  ) : null
                )}
              </g>

              {/* Data-point dots */}
              <g>
                {DATA.map((p, i) => {
                  const isHi = i === HIGHLIGHT
                  return (
                    <circle
                      key={`dot-${i}`}
                      cx={xAt(i)}
                      cy={yAt(p.value)}
                      r={isHi ? 4.5 : 3}
                      fill={isHi ? 'var(--positive)' : 'var(--white)'}
                      stroke={isHi ? 'var(--white)' : 'var(--positive)'}
                      strokeWidth={isHi ? 1.5 : 1.2}
                      opacity={play || reduce ? 1 : 0}
                      style={{
                        transition: reduce ? 'none' : `opacity 0.4s ${cb}`,
                        transitionDelay: `${300 + i * 45}ms`,
                      }}
                    />
                  )
                })}
              </g>

              {/* X-axis rotated mono month labels */}
              <g aria-hidden>
                {DATA.map((p, i) => (
                  <text
                    key={`xl-${i}`}
                    x={xAt(i)}
                    y={axisBaseY + 14}
                    textAnchor="end"
                    transform={`rotate(-90 ${xAt(i)} ${axisBaseY + 14})`}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9.5,
                      letterSpacing: '0.08em',
                      fill: i === HIGHLIGHT ? 'var(--positive)' : 'var(--ink-40)',
                    }}
                  >
                    {p.label}
                  </text>
                ))}
              </g>

              {/* Tooltip callout — dark rounded box + thin vertical rule to axis */}
              <g opacity={play || reduce ? 1 : 0} style={{ transition: reduce ? 'none' : `opacity 0.5s ${cb}`, transitionDelay: '1150ms' }}>
                <line
                  x1={hx}
                  x2={hx}
                  y1={hy}
                  y2={axisBaseY}
                  stroke="var(--ink)"
                  strokeOpacity={0.55}
                  strokeWidth={1}
                />
                <rect
                  x={tipX}
                  y={tipY}
                  width={tipW}
                  height={tipH}
                  rx={9}
                  fill="var(--ink-surface)"
                  stroke="var(--on-ink)"
                  strokeOpacity={0.14}
                  strokeWidth={1}
                />
                <text
                  x={tipX + 13}
                  y={tipY + 20}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9.5,
                    letterSpacing: '0.1em',
                    fill: 'var(--on-ink-70)',
                    textTransform: 'uppercase',
                  }}
                >
                  MAR 2026 · Re-run
                </text>
                <text
                  x={tipX + 13}
                  y={tipY + 40}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 17,
                    fontWeight: 600,
                    fill: 'var(--on-ink)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {hp.value}%
                </text>
                <text
                  x={tipX + tipW - 13}
                  y={tipY + 40}
                  textAnchor="end"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.08em',
                    fill: 'var(--positive)',
                  }}
                >
                  VALIDATED
                </text>
              </g>
            </svg>
          </div>
        </Panel>
      </Reveal>
    </div>
  )
}

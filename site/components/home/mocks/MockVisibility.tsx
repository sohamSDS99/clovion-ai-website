'use client'

// Pillar 1 — "AI Visibility Insights" dashboard. Coded (no raster).
// Dark-surface, strict B&W + single emerald affordance. Scales via container
// query units (cqw) so it fills its aspect box at any width.

import { type CSSProperties } from 'react'
import { cb, useReducedMotion, useReveal, useCountUp, useStagger } from './motion'
import { EngineGlyph } from './glyphs'

const POSITIVE = 'var(--positive)'

const ENGINES = [
  { name: 'ChatGPT', pct: 15.9 },
  { name: 'Perplexity', pct: 8.9 },
  { name: 'Claude', pct: 5.1 },
  { name: 'Gemini', pct: 3.2 }
]

// Line-chart series across May 23 → Jun 22 (y = visibility %), Jun 12 pinned.
// 8 points; index 4 ≈ Jun 12 carries the reference values.
const X = [0, 1, 2, 3, 4, 5, 6, 7]
const SERIES = [
  { key: 'Monday', emphasis: true, dash: '', y: [12.1, 15.0, 18.4, 21.0, 24.8, 22.6, 25.9, 28.4] },
  { key: 'Pipedrive', emphasis: false, dash: '5 4', y: [30.2, 32.1, 33.6, 34.9, 36.1, 35.0, 35.8, 34.2] },
  { key: 'Salesforce', emphasis: false, dash: '1.5 4', y: [28.0, 30.4, 31.9, 32.8, 33.7, 32.1, 33.0, 31.5] }
]
const Y_MAX = 42

function KpiTile({
  label,
  value,
  suffix,
  prefix,
  positive,
  play,
  decimals,
  shown
}: {
  label: string
  value: number
  suffix?: string
  prefix?: string
  positive?: boolean
  play: boolean
  decimals?: number
  shown: boolean
}) {
  const reduced = useReducedMotion()
  const n = useCountUp(value, play, { decimals: decimals ?? 0, durationMs: 720 })
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: '1.4cqw 1.6cqw',
        borderRadius: '1.4cqw',
        background: 'var(--subtle)',
        border: '1px solid var(--line)',
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(1cqw)',
        transition: reduced ? 'none' : `opacity 0.5s ${cb}, transform 0.5s ${cb}`
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3cqw',
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: positive ? POSITIVE : 'var(--ink)',
          fontVariantNumeric: 'tabular-nums',
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.3cqw'
        }}
      >
        {prefix}
        {n.toFixed(decimals ?? 0)}
        {suffix && <span style={{ fontSize: '1.9cqw' }}>{suffix}</span>}
        {positive && <span style={{ fontSize: '1.7cqw' }}>↑</span>}
      </div>
      <div style={{ marginTop: '0.9cqw', fontSize: '1.15cqw', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--ink-50)' }}>
        {label}
      </div>
    </div>
  )
}

export function MockVisibility({ show }: { show: boolean }) {
  const play = useReveal(show)
  const reduced = useReducedMotion()
  const kpis = useStagger(4, play, 90, 80)
  const bars = useStagger(ENGINES.length, play, 80, 360)

  const root: CSSProperties = {
    width: '100%',
    height: '100%',
    containerType: 'size',
    background: 'var(--white)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-body-reg, var(--font-body))',
    overflow: 'hidden',
    padding: '2.4cqw 2.6cqw',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.8cqw'
  }

  return (
    <div style={root}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2cqw' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2cqw', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink)' }}>
            AI Visibility Insights
          </div>
          <div style={{ marginTop: '0.7cqw', fontSize: '1.3cqw', color: 'var(--ink-60)' }}>
            Monday · across 900 AI answers in the last 30 days
          </div>
        </div>
        <RangeToggle />
      </div>

      {/* KPI row */}
      <div style={{ display: 'flex', gap: '1.4cqw' }}>
        <KpiTile label="Total mentions" value={87} play={play} shown={kpis[0]} />
        <KpiTile label="Visibility share" value={9.7} suffix="%" decimals={1} play={play} shown={kpis[1]} />
        <KpiTile label="Avg. position" value={3.5} prefix="#" decimals={1} play={play} shown={kpis[2]} />
        <KpiTile label="Δ vs prev. period" value={76} suffix="%" positive play={play} shown={kpis[3]} />
      </div>

      {/* Lower: breakdown + chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '2cqw', flex: 1, minHeight: 0 }}>
        {/* Visibility breakdown */}
        <div style={{ border: '1px solid var(--line)', borderRadius: '1.4cqw', padding: '1.6cqw', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <SectionTitle>Visibility breakdown</SectionTitle>
          <div style={{ display: 'flex', gap: '1.2cqw', margin: '1cqw 0 1.4cqw', fontSize: '1.15cqw' }}>
            {['AI Engine', 'Audience', 'Intent', 'Topic'].map((t, i) => (
              <span
                key={t}
                style={{
                  color: i === 0 ? 'var(--ink)' : 'var(--ink-40)',
                  fontWeight: i === 0 ? 600 : 500,
                  borderBottom: i === 0 ? '1.5px solid var(--ink)' : '1.5px solid transparent',
                  paddingBottom: '0.5cqw'
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2cqw', justifyContent: 'center', flex: 1 }}>
            {ENGINES.map((e, i) => (
              <div key={e.name} style={{ display: 'grid', gridTemplateColumns: '6cqw 1fr 4cqw', alignItems: 'center', gap: '1cqw' }}>
                <span style={{ fontSize: '1.25cqw', color: 'var(--ink-70)', display: 'flex', alignItems: 'center', gap: '0.6cqw', whiteSpace: 'nowrap' }}>
                  <EngineGlyph size={11} style={{ color: 'var(--ink-40)' }} />
                  {e.name}
                </span>
                <span style={{ height: '1.2cqw', borderRadius: '999px', background: 'var(--ink-10, rgba(255,255,255,0.10))', overflow: 'hidden' }}>
                  <span
                    style={{
                      display: 'block',
                      height: '100%',
                      width: `${(e.pct / 18) * 100}%`,
                      background: 'var(--ink)',
                      borderRadius: '999px',
                      transformOrigin: 'left center',
                      transform: bars[i] ? 'scaleX(1)' : 'scaleX(0)',
                      transition: reduced ? 'none' : `transform 0.6s ${cb}`
                    }}
                  />
                </span>
                <span style={{ fontSize: '1.2cqw', fontVariantNumeric: 'tabular-nums', color: 'var(--ink)', textAlign: 'right' }}>{e.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visibility over time */}
        <div style={{ border: '1px solid var(--line)', borderRadius: '1.4cqw', padding: '1.6cqw', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <SectionTitle>Visibility over time</SectionTitle>
          <div style={{ position: 'relative', flex: 1, minHeight: 0, marginTop: '1cqw' }}>
            <LineChart play={play} />
            <Jun12Tooltip play={play} />
          </div>
          {/* Legend / footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1cqw' }}>
            <div style={{ display: 'flex', gap: '1.2cqw' }}>
              {SERIES.map((s, i) => (
                <span key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5cqw', fontSize: '1.05cqw', color: 'var(--ink-60)' }}>
                  <span style={{ width: '1.6cqw', height: '0.35cqw', borderRadius: 2, background: s.emphasis ? POSITIVE : i === 1 ? 'var(--ink-70)' : 'var(--ink-50)' }} />
                  {s.key}
                </span>
              ))}
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.6cqw', fontSize: '1.05cqw', color: 'var(--ink-60)' }}>
              <span style={{ width: '2.4cqw', height: '1.2cqw', borderRadius: '999px', background: POSITIVE, position: 'relative' }}>
                <span style={{ position: 'absolute', top: '50%', right: '0.15cqw', transform: 'translateY(-50%)', width: '0.9cqw', height: '0.9cqw', borderRadius: '999px', background: 'var(--white)' }} />
              </span>
              Compare competitors
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2cqw', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-50)' }}>
      {children}
    </div>
  )
}

function RangeToggle() {
  const opts = ['7d', '30d', '90d']
  return (
    <div style={{ display: 'flex', gap: '0.4cqw', padding: '0.4cqw', borderRadius: '999px', background: 'var(--subtle)', border: '1px solid var(--line)', fontSize: '1.1cqw' }}>
      {opts.map((o) => (
        <span
          key={o}
          style={{
            padding: '0.4cqw 1.1cqw',
            borderRadius: '999px',
            background: o === '30d' ? 'var(--ink)' : 'transparent',
            color: o === '30d' ? 'var(--white)' : 'var(--ink-50)',
            fontWeight: o === '30d' ? 600 : 500
          }}
        >
          {o}
        </span>
      ))}
    </div>
  )
}

function Jun12Tooltip({ play }: { play: boolean }) {
  const reduced = useReducedMotion()
  const rows = [
    { k: 'Monday', v: '24.8%', emphasis: true },
    { k: 'Pipedrive', v: '36.1%', emphasis: false },
    { k: 'Salesforce', v: '33.7%', emphasis: false }
  ]
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '4%',
        borderRadius: '1cqw',
        background: 'var(--ink-surface)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-soft)',
        padding: '0.9cqw 1.1cqw',
        minWidth: '13cqw',
        opacity: play ? 1 : 0,
        transform: play ? 'translateY(0) scale(1)' : 'translateY(0.8cqw) scale(0.96)',
        transition: reduced ? 'none' : `opacity 0.45s ${cb} 1s, transform 0.55s ${cb} 1s`,
        pointerEvents: 'none'
      }}
    >
      <div style={{ fontSize: '1.05cqw', color: 'var(--on-ink-60, var(--ink-50))', marginBottom: '0.5cqw' }}>Jun 12</div>
      {rows.map((r) => (
        <div key={r.k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.4cqw', fontSize: '1.15cqw', lineHeight: 1.5 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5cqw', color: 'var(--on-ink, #fff)' }}>
            <span style={{ width: '1.1cqw', height: '0.35cqw', borderRadius: 2, background: r.emphasis ? POSITIVE : 'rgba(255,255,255,0.45)' }} />
            {r.k}
          </span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: r.emphasis ? POSITIVE : 'var(--on-ink, #fff)' }}>{r.v}</span>
        </div>
      ))}
    </div>
  )
}

function LineChart({ play }: { play: boolean }) {
  const reduced = useReducedMotion()
  // viewBox space; paths drawn via stroke-dasharray. Jun 12 = index 4.
  const W = 100
  const H = 100
  const px = (i: number) => (i / (X.length - 1)) * W
  const py = (v: number) => H - (v / Y_MAX) * H
  const path = (ys: number[]) => ys.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ')
  const jun12 = 4

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }} aria-hidden>
      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line key={g} x1="0" y1={H * g} x2={W} y2={H * g} stroke="var(--line)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
      ))}
      {SERIES.map((s, si) => (
        <path
          key={s.key}
          d={path(s.y)}
          fill="none"
          stroke={s.emphasis ? POSITIVE : si === 1 ? 'var(--ink-70)' : 'var(--ink-50)'}
          strokeWidth={s.emphasis ? 1.8 : 1.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          // Solid lines distinguished by stroke colour (emerald emphasis /
          // ink-70 / ink-50) + the legend. Draw-in via stroke-dashoffset on a
          // single long dash (no resting dash pattern to clobber).
          style={
            reduced
              ? undefined
              : {
                  strokeDasharray: 220,
                  strokeDashoffset: play ? 0 : 220,
                  transition: `stroke-dashoffset 0.9s ${cb} ${si * 0.2}s`
                }
          }
        />
      ))}
      {/* Jun 12 tooltip marker on the emphasis (Monday) line */}
      <circle
        cx={px(jun12)}
        cy={py(SERIES[0].y[jun12])}
        r="1.8"
        fill={POSITIVE}
        vectorEffect="non-scaling-stroke"
        style={{ opacity: play ? 1 : 0, transition: reduced ? 'none' : `opacity 0.4s ${cb} 1s` }}
      />
    </svg>
  )
}

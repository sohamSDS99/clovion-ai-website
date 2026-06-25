'use client'

// Pillar 1 — "AI Visibility Insights" dashboard. Fully coded (JSX + CSS + SVG,
// zero raster). White surface, vibrant colour system: per-engine brand-coloured
// icon chips, a multi-hue bar ramp with a constant sheen sweep, and vibrant
// chart lines (Pipedrive sky / Salesforce violet / Monday emerald) with a
// gradient area fill, animated data dots and a pulsing endpoint.
//
// The dashboard runs a continuous, self-driving loop: the segmented tab pill
// slides AI Engine → Audience → Intent → Topic → … forever. Each tab change
// coordinates two morphs:
//   • the bar list fades/collapses out, swaps content, then staggers the new
//     rows back in (widths scaleX 0 → final);
//   • the line chart tweens between a "gently declining" shape (Engine/Audience)
//     and a "volatile, Monday-climbs-to-top" shape (Intent), then collapses out
//     of frame entirely on Topic so the 9-row list takes the space.
//
// Honors prefers-reduced-motion: snaps to the AI Engine tab, no cycle, no
// transitions/sheen. Scales via container-query units (cqw) inside its box.
//
// FOOTGUN (enforced): never put var(--*) inside a `transition` shorthand —
// React drops it on serialization and the transition silently never fires.
// Always inline the `cb` easing literal instead.

import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { cb, useReducedMotion, useReveal, useCountUp } from './motion'
import { LIGHT } from './palette'

const POSITIVE = 'var(--positive)'

// Vibrant chart line colours (inside-mock only).
const C_PIPE = '#0ea5e9' // Pipedrive — vivid sky
const C_SALES = '#8b5cf6' // Salesforce — vivid violet
const C_MONDAY = '#10b981' // Monday — vivid emerald (emphasis)

// Per-engine brand colours for the icon chips + bars.
const ENGINE_COLOR: Record<string, string> = {
  ChatGPT: '#10a37f',
  Perplexity: '#1fb8cd',
  Claude: '#d97757',
  Gemini: '#4285f4'
}

// Cool→warm vibrant ramp for non-engine bars / numbered badges (designed
// spectrum, not random rainbow). Index 0 = highest-ranked row.
const RAMP = ['#8b5cf6', '#7c3aed', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981', '#22c55e']

// ── Loop pacing ──────────────────────────────────────────────────────
const HOLD_MS = 3200
const TRANS_MS = 500
const TICK_MS = HOLD_MS + TRANS_MS
const BARS_OUT_MS = 260
const ROW_STAGGER_MS = 70

// ── Tabs ─────────────────────────────────────────────────────────────
type TabKey = 'engine' | 'audience' | 'intent' | 'topic'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'engine', label: 'AI Engine' },
  { key: 'audience', label: 'Audience' },
  { key: 'intent', label: 'Intent' },
  { key: 'topic', label: 'Topic' }
]

type Row = { name: string; pct: number; engine?: boolean }
const ROWS: Record<TabKey, Row[]> = {
  engine: [
    { name: 'ChatGPT', pct: 15.9, engine: true },
    { name: 'Perplexity', pct: 8.9, engine: true },
    { name: 'Claude', pct: 5.1, engine: true },
    { name: 'Gemini', pct: 3.2, engine: true }
  ],
  audience: [
    { name: 'Content Strategist', pct: 11.9 },
    { name: 'Insights Analyst', pct: 8.2 },
    { name: 'Research Specialist', pct: 6.3 }
  ],
  intent: [{ name: 'Informational', pct: 11.9 }],
  topic: [
    { name: 'Time Tracking Software', pct: 18.3 },
    { name: 'Project Management', pct: 17 },
    { name: 'Productivity Software', pct: 13.7 },
    { name: 'Workflows & Automation', pct: 12 },
    { name: 'Collaboration Tools', pct: 10.2 },
    { name: 'Integrations', pct: 8.1 },
    { name: 'Digital Workspaces', pct: 3.4 },
    { name: 'User Experience', pct: 3.4 },
    { name: 'AI in the Workplace', pct: 0.9 }
  ]
}

// ── Chart shapes ─────────────────────────────────────────────────────
const Y_MAX = 46
const SERIES_ORDER = ['pipedrive', 'salesforce', 'monday'] as const
type SeriesKey = (typeof SERIES_ORDER)[number]

const FLAT: Record<SeriesKey, number[]> = {
  pipedrive: [38.5, 38.1, 37.6, 37.2, 36.8, 36.4, 37.0, 37.6],
  salesforce: [36.4, 36.0, 35.6, 35.2, 34.8, 35.0, 35.2, 35.1],
  monday: [26.0, 26.8, 27.0, 27.2, 26.0, 25.2, 25.6, 26.2]
}
const VOLATILE: Record<SeriesKey, number[]> = {
  pipedrive: [38.5, 38.0, 37.0, 38.0, 35.5, 30.5, 36.0, 38.2],
  salesforce: [36.0, 35.4, 34.0, 33.5, 31.0, 34.0, 35.0, 35.0],
  monday: [26.5, 27.2, 27.8, 35.0, 38.5, 42.0, 38.8, 43.5]
}
const SERIES_META: Record<SeriesKey, { label: string; color: string; emphasis?: boolean }> = {
  pipedrive: { label: 'Pipedrive', color: C_PIPE },
  salesforce: { label: 'Salesforce', color: C_SALES },
  monday: { label: 'Monday', color: C_MONDAY, emphasis: true }
}

// Shared keyframes (constant sheen on bars, pulsing chart endpoint).
const KEYFRAMES =
  '@keyframes clvBarSheen{0%{background-position:140% 0}55%{background-position:-40% 0}100%{background-position:-40% 0}}' +
  '@keyframes clvDotPing{0%{transform:scale(1);opacity:.5}70%,100%{transform:scale(2.6);opacity:0}}' +
  '@keyframes clvDotCore{0%,100%{opacity:1}50%{opacity:.65}}'

// ── Brand engine icon chips (white glyph on brand-coloured chip) ─────
function EngineChip({ name }: { name: string }) {
  const color = ENGINE_COLOR[name] ?? '#0a0a0f'
  const glyph = (() => {
    switch (name) {
      case 'ChatGPT': // knot-ish sparkle
        return <path d="M12 4.5l1.4 4.6 4.6 1.4-4.6 1.4L12 16.5l-1.4-4.6L6 10.5l4.6-1.4L12 4.5z" fill="#fff" />
      case 'Claude': // sunburst
        return (
          <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
              const r = (a * Math.PI) / 180
              return <line key={a} x1={12 + Math.cos(r) * 2.4} y1={12 + Math.sin(r) * 2.4} x2={12 + Math.cos(r) * 5.4} y2={12 + Math.sin(r) * 5.4} />
            })}
          </g>
        )
      case 'Gemini': // 4-point spark
        return <path d="M12 4c.5 3.6 1.4 4.5 5 5-3.6.5-4.5 1.4-5 5-.5-3.6-1.4-4.5-5-5 3.6-.5 4.5-1.4 5-5z" fill="#fff" />
      case 'Perplexity': // concentric arcs
        return (
          <g fill="none" stroke="#fff" strokeWidth="1.5">
            <circle cx="12" cy="12" r="2.2" />
            <path d="M12 5.5v13M6 9.5l12 5M18 9.5l-12 5" strokeWidth="1.2" />
          </g>
        )
      default:
        return <circle cx="12" cy="12" r="4" fill="#fff" />
    }
  })()
  return (
    <span
      style={{
        width: '2.2cqw',
        height: '2.2cqw',
        borderRadius: '0.6cqw',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
        boxShadow: `0 0.3cqw 0.9cqw ${color}55`
      }}
    >
      <svg viewBox="0 0 24 24" width="70%" height="70%" aria-hidden>
        {glyph}
      </svg>
    </span>
  )
}

// rAF tween toward a target (0=flat, 1=volatile), with a setTimeout fallback so
// the final value always lands even if rAF frames are starved.
function useTween(target: number, durationMs: number, reduced: boolean): number {
  const [val, setVal] = useState(target)
  const fromRef = useRef(target)
  const raf = useRef<number | null>(null)
  useEffect(() => {
    if (reduced) {
      setVal(target)
      fromRef.current = target
      return
    }
    const from = fromRef.current
    if (from === target) return
    let start = 0
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min(1, (ts - start) / durationMs)
      const v = from + (target - from) * ease(p)
      setVal(v)
      fromRef.current = v
      if (p < 1) raf.current = requestAnimationFrame(step)
      else fromRef.current = target
    }
    raf.current = requestAnimationFrame(step)
    const settle = setTimeout(() => {
      setVal(target)
      fromRef.current = target
    }, durationMs + 80)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      clearTimeout(settle)
    }
  }, [target, durationMs, reduced])
  return val
}

export function MockVisibility({ show }: { show: boolean }) {
  const reduced = useReducedMotion()
  const reveal = useReveal(show)

  const [active, setActive] = useState(0)
  const [shownTab, setShownTab] = useState(0)
  const [barsIn, setBarsIn] = useState(false)

  // Self-driving loop. Resets to AI Engine whenever the pillar (re)activates.
  useEffect(() => {
    if (!show || reduced) {
      setActive(0)
      setShownTab(0)
      setBarsIn(true)
      return
    }
    setActive(0)
    const id = setInterval(() => setActive((p) => (p + 1) % TABS.length), TICK_MS)
    return () => clearInterval(id)
  }, [show, reduced])

  // Bar list out → swap → stagger in, re-run whenever `active` (or show) changes.
  useEffect(() => {
    if (reduced || !show) return
    setBarsIn(false)
    let r1 = 0
    let r2 = 0
    let fallback: ReturnType<typeof setTimeout>
    const t = setTimeout(() => {
      setShownTab(active)
      r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setBarsIn(true))
      })
      fallback = setTimeout(() => setBarsIn(true), 80)
    }, BARS_OUT_MS)
    return () => {
      clearTimeout(t)
      clearTimeout(fallback)
      if (r1) cancelAnimationFrame(r1)
      if (r2) cancelAnimationFrame(r2)
    }
  }, [active, reduced, show])

  const activeKey = TABS[active].key
  const isTopic = activeKey === 'topic'
  const morphTarget = activeKey === 'intent' ? 1 : 0
  const morph = useTween(morphTarget, TRANS_MS + 100, reduced)

  const root: CSSProperties = {
    ...LIGHT,
    width: '100%',
    height: '100%',
    containerType: 'size',
    background: 'var(--white)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-body-reg, var(--font-body))',
    overflow: 'hidden',
    padding: '2.2cqw 2.8cqw',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2cqw'
  }

  return (
    <div style={root}>
      <style>{KEYFRAMES}</style>
      <Header />
      <KpiStrip play={reveal} />

      {/* VISIBILITY BREAKDOWN */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: isTopic ? 1 : 'none' }}>
        <SectionHeading>Visibility breakdown</SectionHeading>
        <TabStrip active={active} />
        <BarList rows={ROWS[TABS[shownTab].key]} tabKey={TABS[shownTab].key} barsIn={barsIn} reduced={reduced} grow={isTopic} />
      </div>

      {/* VISIBILITY OVER TIME — collapses out on Topic */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          flex: isTopic ? 0 : 1,
          opacity: isTopic ? 0 : 1,
          transform: isTopic ? 'translateY(1.4cqw)' : 'none',
          overflow: 'hidden',
          pointerEvents: 'none',
          transition: reduced ? 'none' : `opacity 0.42s ${cb}, transform 0.5s ${cb}, flex 0.5s ${cb}`
        }}
        aria-hidden={isTopic}
      >
        <SectionHeading>Visibility over time</SectionHeading>
        <Chart morph={morph} flat={morphTarget === 0} reduced={reduced} />
        <ChartFooter />
      </div>
    </div>
  )
}

// ── Header ───────────────────────────────────────────────────────────
function Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2cqw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.1cqw' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5cqw', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)', lineHeight: 1 }}>
            AI Visibility Insights
          </div>
          <div style={{ marginTop: '0.8cqw', fontSize: '1.3cqw', color: 'var(--ink-50)' }}>Monday · across 900 AI answers in the last 30 days</div>
        </div>
      </div>
      <RangeToggle />
    </div>
  )
}

function RangeToggle() {
  const opts = ['7d', '30d', '90d']
  return (
    <div style={{ display: 'flex', gap: '0.3cqw', padding: '0.45cqw', borderRadius: '999px', background: 'var(--subtle)', border: '1px solid var(--line)', fontSize: '1.15cqw', flex: 'none' }}>
      {opts.map((o) => (
        <span
          key={o}
          style={{
            padding: '0.4cqw 1.2cqw',
            borderRadius: '999px',
            background: o === '30d' ? 'var(--ink)' : 'transparent',
            color: o === '30d' ? '#fff' : 'var(--ink-50)',
            fontWeight: o === '30d' ? 600 : 500
          }}
        >
          {o}
        </span>
      ))}
    </div>
  )
}

// ── KPI strip ────────────────────────────────────────────────────────
function KpiStrip({ play }: { play: boolean }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        border: '1px solid var(--line)',
        borderRadius: '1.6cqw',
        background: 'var(--white)',
        overflow: 'hidden',
        boxShadow: '0 0.5cqw 1.6cqw rgba(10,10,15,0.05)'
      }}
    >
      <Kpi label="Total mentions" value={87} accent="#6366f1" play={play} />
      <Kpi label="Visibility share" value={9.7} suffix="%" decimals={1} accent="#0ea5e9" play={play} divider />
      <Kpi label="Avg. position" value={3.5} prefix="#" decimals={1} accent="#8b5cf6" play={play} divider />
      <Kpi label="Δ vs prev. period" value={76} suffix="%" delta play={play} divider />
    </div>
  )
}

function Kpi({
  label,
  value,
  suffix,
  prefix,
  decimals,
  delta,
  divider,
  accent,
  play
}: {
  label: string
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  delta?: boolean
  divider?: boolean
  accent?: string
  play: boolean
}) {
  const n = useCountUp(value, play, { decimals: decimals ?? 0, durationMs: 820 })
  return (
    <div
      style={{
        padding: '1.4cqw 2.2cqw',
        borderLeft: divider ? '1px solid var(--line)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: delta ? 'center' : 'flex-start',
        minWidth: 0,
        position: 'relative'
      }}
    >
      {!delta && accent && (
        <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '0.45cqw', height: '52%', borderRadius: '999px', background: accent }} />
      )}
      {delta ? (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '0.5cqw',
            padding: '0.9cqw 1.6cqw',
            borderRadius: '999px',
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.32)',
            color: POSITIVE,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          <span style={{ fontSize: '3.4cqw', lineHeight: 1 }}>{n.toFixed(0)}</span>
          <span style={{ fontSize: '2.6cqw' }}>%</span>
          <span style={{ fontSize: '2.2cqw', marginLeft: '0.3cqw' }}>Δ</span>
          <span style={{ fontSize: '2.2cqw' }}>↑</span>
        </span>
      ) : (
        <>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3.4cqw',
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              fontVariantNumeric: 'tabular-nums',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.3cqw'
            }}
          >
            {prefix}
            {n.toFixed(decimals ?? 0)}
            {suffix && <span style={{ fontSize: '2.2cqw' }}>{suffix}</span>}
          </div>
          <div style={{ marginTop: '0.7cqw', fontSize: '1.15cqw', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-50)' }}>{label}</div>
        </>
      )}
    </div>
  )
}

// ── Section heading ──────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.45cqw', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '0.8cqw' }}>
      {children}
    </div>
  )
}

// ── Segmented tab strip with the sliding pill ────────────────────────
function TabStrip({ active }: { active: number }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        padding: '0.55cqw',
        borderRadius: '999px',
        background: 'var(--subtle)',
        border: '1px solid var(--line)',
        marginBottom: '1.1cqw'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '0.55cqw',
          bottom: '0.55cqw',
          left: '0.55cqw',
          width: `calc((100% - 1.1cqw) / ${TABS.length})`,
          borderRadius: '999px',
          background: 'linear-gradient(135deg, #1b1b22, #0a0a0f)',
          boxShadow: '0 0.3cqw 0.9cqw rgba(10,10,15,0.28)',
          transform: `translateX(${active * 100}%)`,
          transition: `transform 0.45s ${cb}`
        }}
      />
      {TABS.map((t, i) => (
        <span
          key={t.key}
          style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            textAlign: 'center',
            padding: '0.7cqw 0',
            fontSize: '1.35cqw',
            fontWeight: i === active ? 600 : 500,
            color: i === active ? '#fff' : 'var(--ink-50)',
            transition: `color 0.3s ${cb}`,
            whiteSpace: 'nowrap'
          }}
        >
          {t.label}
        </span>
      ))}
    </div>
  )
}

// ── Bar list ─────────────────────────────────────────────────────────
function BarList({
  rows,
  tabKey,
  barsIn,
  reduced,
  grow
}: {
  rows: Row[]
  tabKey: TabKey
  barsIn: boolean
  reduced: boolean
  grow: boolean
}) {
  const max = Math.max(...rows.map((r) => r.pct))
  const numbered = tabKey === 'topic'
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: numbered ? '0.85cqw' : '1.15cqw',
        flex: grow ? 1 : 'none',
        justifyContent: grow || rows.length <= 2 ? 'center' : 'flex-start'
      }}
    >
      {rows.map((r, i) => {
        const w = Math.max(3, (r.pct / max) * 94)
        const visible = reduced || barsIn
        const delay = reduced ? 0 : i * ROW_STAGGER_MS
        const color = r.engine ? ENGINE_COLOR[r.name] : RAMP[i % RAMP.length]
        return (
          <div
            key={`${tabKey}-${i}`}
            style={{
              display: 'grid',
              gridTemplateColumns: numbered ? '2.6cqw 14cqw 1fr 5cqw' : '15.5cqw 1fr 5cqw',
              alignItems: 'center',
              gap: '1.1cqw',
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(0.8cqw)',
              transition: reduced ? 'none' : `opacity 0.4s ${cb} ${delay}ms, transform 0.4s ${cb} ${delay}ms`
            }}
          >
            {numbered && (
              <span
                style={{
                  width: '2.4cqw',
                  height: '2.4cqw',
                  borderRadius: '0.65cqw',
                  background: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2cqw',
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  color: '#fff',
                  flex: 'none',
                  boxShadow: `0 0.25cqw 0.7cqw ${color}55`
                }}
              >
                {i + 1}
              </span>
            )}
            <span
              style={{
                fontSize: '1.5cqw',
                fontWeight: 600,
                color: 'var(--ink)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.8cqw',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {r.engine && <EngineChip name={r.name} />}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
            </span>
            <span style={{ height: '1.5cqw', borderRadius: '999px', background: 'var(--subtle)', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  width: `${w}%`,
                  backgroundColor: color,
                  backgroundImage: reduced ? undefined : `linear-gradient(100deg, ${color} 36%, rgba(255,255,255,0.7) 50%, ${color} 64%)`,
                  backgroundSize: '250% 100%',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '999px',
                  transformOrigin: 'left center',
                  transform: visible ? 'scaleX(1)' : 'scaleX(0)',
                  transition: reduced ? 'none' : `transform 0.55s ${cb} ${delay + 60}ms`,
                  animation: reduced ? 'none' : `clvBarSheen 2.8s ease-in-out ${i * 0.2}s infinite`,
                  boxShadow: `0 0.2cqw 0.7cqw ${color}40`
                }}
              />
            </span>
            <span style={{ fontSize: '1.4cqw', fontWeight: 600, fontVariantNumeric: 'tabular-nums', color: 'var(--ink)', textAlign: 'right' }}>{r.pct}%</span>
          </div>
        )
      })}
    </div>
  )
}

// ── Line chart (HTML axis gutters + SVG plot) ────────────────────────
function Chart({ morph, flat, reduced }: { morph: number; flat: boolean; reduced: boolean }) {
  const W = 100
  const H = 100
  const lerp = (a: number, b: number) => a + (b - a) * morph
  const seriesY = (key: SeriesKey) => FLAT[key].map((v, i) => lerp(v, VOLATILE[key][i]))
  const px = (i: number) => (i / 7) * W
  const py = (v: number) => H - (v / Y_MAX) * H
  const toPath = (ys: number[]) => ys.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(2)} ${py(v).toFixed(2)}`).join(' ')
  const toArea = (ys: number[]) => `M 0 ${H} L ${ys.map((v, i) => `${px(i).toFixed(2)} ${py(v).toFixed(2)}`).join(' L ')} L ${W} ${H} Z`

  const yTicks = [40, 20, 0]
  const gridTicks = [40, 30, 20, 10, 0]
  const xTicks = [
    { i: 0, label: 'May 23' },
    { i: 2.66, label: 'Jun 2' },
    { i: 5.33, label: 'Jun 12' },
    { i: 7, label: 'Jun 22' }
  ]
  const jun12 = 5.33
  const mondayY = seriesY('monday')
  const dotI = 5 // pulse sits mid-chart (Jun 12 region) — never clips at the edge
  const dotY = mondayY[dotI]

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0, marginTop: '0.4cqw', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1, minHeight: 0, paddingLeft: '3.4cqw' }}>
        {yTicks.map((t) => (
          <span
            key={t}
            style={{ position: 'absolute', left: 0, top: `${(1 - t / Y_MAX) * 100}%`, transform: 'translateY(-50%)', fontSize: '1.05cqw', color: 'var(--ink-40)', fontVariantNumeric: 'tabular-nums' }}
          >
            {t}%
          </span>
        ))}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }} aria-hidden>
          <defs>
            <linearGradient id="clvMondayArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C_MONDAY} stopOpacity="0.28" />
              <stop offset="100%" stopColor={C_MONDAY} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* gridlines */}
          {gridTicks.map((t) => (
            <line key={t} x1="0" y1={py(t)} x2={W} y2={py(t)} stroke="var(--line)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          ))}
          {/* Jun 12 reference line */}
          <line x1={px(jun12)} y1="0" x2={px(jun12)} y2={H} stroke="var(--ink-25)" strokeWidth="0.4" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          {/* emphasis area fill */}
          <path d={toArea(mondayY)} fill="url(#clvMondayArea)" preserveAspectRatio="none" />
          {/* Competitor lines first (muted, recede), then Monday on top (hero).
             Always solid — the morph animates via the path data, and the pillar
             fades in as a whole, so no per-line draw-in (a dash draw-in with
             non-scaling-stroke measures in screen px and repeats → gaps). */}
          {SERIES_ORDER.filter((k) => !SERIES_META[k].emphasis).map((key) => {
            const m = SERIES_META[key]
            return (
              <path
                key={key}
                d={toPath(seriesY(key))}
                fill="none"
                stroke={m.color}
                strokeOpacity={0.45}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
          {/* Monday — the hero line: brightest, thickest, drawn last (on top) */}
          <path
            d={toPath(mondayY)}
            fill="none"
            stroke={C_MONDAY}
            strokeWidth={2.9}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* solid hero data dots on Monday */}
          {mondayY.map((v, i) => (
            <circle key={i} cx={px(i)} cy={py(v)} r="1.25" fill={C_MONDAY} stroke="#fff" strokeWidth="0.85" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>

        {/* pulsing endpoint on the Monday line (HTML, percentage-positioned) */}
        <span
          style={{
            position: 'absolute',
            left: `calc(3.4cqw + (100% - 3.4cqw) * ${dotI / 7})`,
            top: `${(1 - dotY / Y_MAX) * 100}%`,
            width: 0,
            height: 0,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
        >
          <span style={{ position: 'absolute', left: '-1.1cqw', top: '-1.1cqw', width: '2.2cqw', height: '2.2cqw', borderRadius: '999px', background: C_MONDAY, opacity: 0.5, animation: reduced ? 'none' : 'clvDotPing 2s ease-out infinite' }} />
          <span style={{ position: 'absolute', left: '-0.65cqw', top: '-0.65cqw', width: '1.3cqw', height: '1.3cqw', borderRadius: '999px', background: C_MONDAY, boxShadow: `0 0 1.2cqw ${C_MONDAY}`, animation: reduced ? 'none' : 'clvDotCore 2s ease-in-out infinite' }} />
        </span>

        <Tooltip jun12x={(jun12 / 7) * 100} show={flat} reduced={reduced} />
      </div>

      {/* x-axis labels */}
      <div style={{ position: 'relative', height: '1.6cqw', marginTop: '0.6cqw', marginLeft: '3.4cqw' }}>
        {xTicks.map((t) => (
          <span
            key={t.label}
            style={{ position: 'absolute', left: `${(t.i / 7) * 100}%`, transform: t.i === 0 ? 'none' : t.i === 7 ? 'translateX(-100%)' : 'translateX(-50%)', fontSize: '1.05cqw', color: 'var(--ink-40)', whiteSpace: 'nowrap' }}
          >
            {t.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function Tooltip({ jun12x, show, reduced }: { jun12x: number; show: boolean; reduced: boolean }) {
  const rows = [
    { k: 'Pipedrive', v: '36.1%', c: C_PIPE },
    { k: 'Salesforce', v: '33.7%', c: C_SALES },
    { k: 'Monday', v: '24.8%', c: C_MONDAY }
  ]
  return (
    <div
      style={{
        position: 'absolute',
        left: `calc(3.4cqw + (100% - 3.4cqw) * ${jun12x / 100} + 1.2cqw)`,
        top: '2%',
        borderRadius: '1cqw',
        background: 'var(--white)',
        border: '1px solid var(--line)',
        boxShadow: '0 0.8cqw 2.4cqw rgba(10,10,15,0.14)',
        padding: '1cqw 1.2cqw',
        minWidth: '15cqw',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(0.6cqw)',
        transition: reduced ? 'none' : `opacity 0.4s ${cb}, transform 0.45s ${cb}`,
        pointerEvents: 'none'
      }}
    >
      <div style={{ fontSize: '1.1cqw', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.7cqw' }}>Jun 12</div>
      {rows.map((r) => (
        <div key={r.k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.6cqw', fontSize: '1.15cqw', lineHeight: 1.6 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.6cqw', color: 'var(--ink-70)' }}>
            <span style={{ width: '0.9cqw', height: '0.9cqw', borderRadius: '999px', background: r.c, flex: 'none' }} />
            {r.k}
          </span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--ink)' }}>{r.v}</span>
        </div>
      ))}
    </div>
  )
}

function ChartFooter() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1cqw' }}>
      <div style={{ display: 'flex', gap: '1.2cqw' }}>
        {(['monday', 'pipedrive', 'salesforce'] as SeriesKey[]).map((key) => {
          const m = SERIES_META[key]
          const hero = !!m.emphasis
          return (
            <span
              key={key}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6cqw', fontSize: '1.2cqw', color: hero ? 'var(--ink)' : 'var(--ink-50)', fontWeight: hero ? 700 : 500, opacity: hero ? 1 : 0.8 }}
            >
              <span style={{ width: '1.7cqw', height: '1.7cqw', borderRadius: '0.4cqw', background: m.color, opacity: hero ? 1 : 0.55, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="1.1cqw" height="1.1cqw" aria-hidden>
                  <path d="M5 12.5l4 4 10-10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {m.label}
              {hero && (
                <span style={{ marginLeft: '0.2cqw', padding: '0.1cqw 0.7cqw', borderRadius: '999px', background: 'var(--positive-bg)', color: POSITIVE, fontSize: '0.95cqw', fontWeight: 700, letterSpacing: '0.04em' }}>YOU</span>
              )}
            </span>
          )
        })}
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.7cqw', fontSize: '1.2cqw', color: 'var(--ink-70)', fontWeight: 500 }}>
        <span style={{ width: '2.8cqw', height: '1.5cqw', borderRadius: '999px', background: C_MONDAY, position: 'relative', flex: 'none' }}>
          <span style={{ position: 'absolute', top: '50%', right: '0.2cqw', transform: 'translateY(-50%)', width: '1.1cqw', height: '1.1cqw', borderRadius: '999px', background: '#fff' }} />
        </span>
        Compare competitors
      </span>
    </div>
  )
}

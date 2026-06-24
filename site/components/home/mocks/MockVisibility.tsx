'use client'

// Pillar 1 — "AI Visibility Insights" dashboard. Fully coded (JSX + CSS + SVG,
// zero raster). White surface, strict B&W product chrome + a single emerald
// affordance for the Δ chip. The three chart lines carry their reference brand
// colours (Pipedrive sky / Salesforce violet / Monday green) — treated like
// --positive: colour confined to inside the mock, never bleeds to brand chrome.
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
// transitions. Scales via container-query units (cqw) inside its aspect box.
//
// FOOTGUN (enforced): never put var(--*) inside a `transition` shorthand —
// React drops it on serialization and the transition silently never fires.
// Always inline the `cb` easing literal instead.

import { type CSSProperties, useEffect, useRef, useState } from 'react'
import { cb, useReducedMotion, useReveal, useCountUp } from './motion'
import { LIGHT } from './palette'

const POSITIVE = 'var(--positive)'

// Chart line colours — reference brand hues, inside-mock only.
const C_PIPE = '#38bdf8' // Pipedrive — sky
const C_SALES = '#8b5cf6' // Salesforce — violet
const C_MONDAY = '#16a34a' // Monday — green
const BAR_FILL = 'linear-gradient(90deg, #4b4b54, #0a0a0f)'

// ── Loop pacing ──────────────────────────────────────────────────────
const HOLD_MS = 3200 // dwell on a tab
const TRANS_MS = 500 // morph window
const TICK_MS = HOLD_MS + TRANS_MS // 3.7s full step
const BARS_OUT_MS = 260 // fade/collapse current rows before swap
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
    { name: 'Workflows and Automation', pct: 12 },
    { name: 'Collaboration Tools', pct: 10.2 },
    { name: 'Integrations with Tools', pct: 8.1 },
    { name: 'Digital Workspaces', pct: 3.4 },
    { name: 'User Experience', pct: 3.4 },
    { name: 'AI in the Workplace', pct: 0.9 }
  ]
}

// ── Chart shapes ─────────────────────────────────────────────────────
// 8 points, May 23 → Jun 22; index 4 ≈ Jun 12. Same point count in both
// shapes so we can lerp point-for-point during the morph.
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

// ── Engine mark (neutral monochrome glyph; brand-safe) ───────────────
function EngineMark() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden style={{ flex: 'none', color: 'var(--ink-40)' }}>
      <path fill="currentColor" d="M12 3l1.9 5.6L19.5 10l-5.6 1.4L12 17l-1.9-5.6L4.5 10l5.6-1.4L12 3z" />
    </svg>
  )
}

// rAF tween toward a target value (0=flat, 1=volatile). Snaps under reduced.
// A setTimeout fallback guarantees the final value lands even if rAF frames are
// starved (proven rAF + timeout pattern used across the mocks), so the morph
// never gets stuck mid-shape.
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

  // active = tab the pill points at (drives chart morph + pill position).
  // shownTab = tab whose rows are currently rendered (lags during the swap).
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
      // double-rAF so the new rows paint hidden once before transitioning in
      r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setBarsIn(true))
      })
      // guaranteed reveal even if rAF is starved (backgrounded tab, etc.)
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
  // chart morph target: flat (0) for engine/audience, volatile (1) for intent.
  // On Topic the chart collapses out of frame, so its underlying shape (0) is
  // moot — we just let it settle back to flat behind the collapse.
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
    padding: '2.4cqw 2.8cqw',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.8cqw'
  }

  return (
    <div style={root}>
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
        <Chart morph={morph} flat={morphTarget === 0} reduced={reduced} play={reveal} />
        <ChartFooter />
      </div>
    </div>
  )
}

// ── Header ───────────────────────────────────────────────────────────
function Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2cqw' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1cqw' }}>
        <span
          style={{
            width: '3cqw',
            height: '3cqw',
            borderRadius: '0.7cqw',
            background: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none'
          }}
        >
          <svg viewBox="0 0 24 24" width="1.7cqw" height="1.7cqw" aria-hidden>
            <rect x="4" y="13" width="3.4" height="7" rx="1" fill="#fff" />
            <rect x="10.3" y="9" width="3.4" height="11" rx="1" fill="#fff" />
            <rect x="16.6" y="5" width="3.4" height="15" rx="1" fill="#fff" />
          </svg>
        </span>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.3cqw', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink)', lineHeight: 1 }}>
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
        overflow: 'hidden'
      }}
    >
      <Kpi label="Total mentions" value={87} play={play} />
      <Kpi label="Visibility share" value={9.7} suffix="%" decimals={1} play={play} divider />
      <Kpi label="Avg. position" value={3.5} prefix="#" decimals={1} play={play} divider />
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
  play
}: {
  label: string
  value: number
  suffix?: string
  prefix?: string
  decimals?: number
  delta?: boolean
  divider?: boolean
  play: boolean
}) {
  const n = useCountUp(value, play, { decimals: decimals ?? 0, durationMs: 760 })
  return (
    <div
      style={{
        padding: '2cqw 2.2cqw',
        borderLeft: divider ? '1px solid var(--line)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: delta ? 'center' : 'flex-start',
        minWidth: 0
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: delta ? '3.6cqw' : '3.4cqw',
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: delta ? POSITIVE : 'var(--ink)',
          fontVariantNumeric: 'tabular-nums',
          display: 'flex',
          alignItems: 'baseline',
          gap: '0.4cqw'
        }}
      >
        {prefix}
        {n.toFixed(decimals ?? 0)}
        {suffix && <span style={{ fontSize: delta ? '3cqw' : '2.2cqw' }}>{suffix}</span>}
        {delta && <span style={{ fontSize: '2.6cqw', marginLeft: '0.6cqw' }}>Δ</span>}
        {delta && <span style={{ fontSize: '2.4cqw' }}>↑</span>}
      </div>
      {!delta && (
        <div style={{ marginTop: '1cqw', fontSize: '1.15cqw', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-50)' }}>{label}</div>
      )}
    </div>
  )
}

// ── Section heading ──────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5cqw', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '1.2cqw' }}>
      {children}
    </div>
  )
}

// ── Segmented tab strip with the sliding black pill ──────────────────
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
        marginBottom: '1.6cqw'
      }}
    >
      {/* sliding pill */}
      <div
        style={{
          position: 'absolute',
          top: '0.55cqw',
          bottom: '0.55cqw',
          left: '0.55cqw',
          width: `calc((100% - 1.1cqw) / ${TABS.length})`,
          borderRadius: '999px',
          background: 'var(--ink)',
          boxShadow: '0 1px 3px rgba(10,10,15,0.18)',
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
            padding: '0.9cqw 0',
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
        gap: numbered ? '1cqw' : '1.5cqw',
        flex: grow ? 1 : 'none',
        justifyContent: grow || rows.length <= 2 ? 'center' : 'flex-start'
      }}
    >
      {rows.map((r, i) => {
        const w = Math.max(2, (r.pct / max) * 94)
        const visible = reduced || barsIn
        const delay = reduced ? 0 : i * ROW_STAGGER_MS
        return (
          <div
            key={`${tabKey}-${i}`}
            style={{
              display: 'grid',
              gridTemplateColumns: numbered ? '2.6cqw 13cqw 1fr 6cqw' : '15cqw 1fr 6cqw',
              alignItems: 'center',
              gap: '1cqw',
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
                  borderRadius: '999px',
                  border: '1px solid var(--ink-25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1cqw',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'var(--ink-60)',
                  flex: 'none'
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
                gap: '0.7cqw',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {r.engine && <EngineMark />}
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
            </span>
            <span style={{ height: '1.4cqw', borderRadius: '999px', background: 'var(--subtle)', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  width: `${w}%`,
                  background: BAR_FILL,
                  borderRadius: '999px',
                  transformOrigin: 'left center',
                  transform: visible ? 'scaleX(1)' : 'scaleX(0)',
                  transition: reduced ? 'none' : `transform 0.55s ${cb} ${delay + 60}ms`
                }}
              />
            </span>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.6cqw', fontSize: '1.4cqw', fontVariantNumeric: 'tabular-nums', color: 'var(--ink)' }}>
              {r.pct}%<span style={{ color: 'var(--ink-40)' }}>–</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── Line chart (HTML axis gutters + SVG plot) ────────────────────────
function Chart({ morph, flat, reduced, play }: { morph: number; flat: boolean; reduced: boolean; play: boolean }) {
  const W = 100
  const H = 100
  const lerp = (a: number, b: number) => a + (b - a) * morph
  const seriesY = (key: SeriesKey) => FLAT[key].map((v, i) => lerp(v, VOLATILE[key][i]))
  const px = (i: number) => (i / 7) * W
  const py = (v: number) => H - (v / Y_MAX) * H
  const toPath = (ys: number[]) => ys.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(2)} ${py(v).toFixed(2)}`).join(' ')

  const yTicks = [40, 30, 20, 10, 0]
  const xTicks = [
    { i: 0, label: 'May 23' },
    { i: 2.66, label: 'Jun 2' },
    { i: 5.33, label: 'Jun 12' },
    { i: 7, label: 'Jun 22' }
  ]
  const jun12 = 5.33

  return (
    <div style={{ position: 'relative', flex: 1, minHeight: 0, marginTop: '0.8cqw', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1, minHeight: 0, paddingLeft: '3.4cqw' }}>
        {/* y-axis labels */}
        {yTicks.map((t) => (
          <span
            key={t}
            style={{
              position: 'absolute',
              left: 0,
              top: `${(1 - t / Y_MAX) * 100}%`,
              transform: 'translateY(-50%)',
              fontSize: '1.05cqw',
              color: 'var(--ink-40)',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {t}%
          </span>
        ))}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }} aria-hidden>
          {/* gridlines */}
          {yTicks.map((t) => (
            <line key={t} x1="0" y1={py(t)} x2={W} y2={py(t)} stroke="var(--line)" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
          ))}
          {/* Jun 12 reference line */}
          <line x1={px(jun12)} y1="0" x2={px(jun12)} y2={H} stroke="var(--ink-25)" strokeWidth="0.4" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          {SERIES_ORDER.map((key) => {
            const m = SERIES_META[key]
            const ys = seriesY(key)
            return (
              <path
                key={key}
                d={toPath(ys)}
                fill="none"
                stroke={m.color}
                strokeWidth={m.emphasis ? 1.8 : 1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={
                  reduced || morph !== 0 // only run the draw-in on first reveal (flat), morph handles the rest
                    ? undefined
                    : {
                        strokeDasharray: 260,
                        strokeDashoffset: play ? 0 : 260,
                        transition: `stroke-dashoffset 0.9s ${cb}`
                      }
                }
              />
            )
          })}
          {/* Jun 12 marker on Monday line */}
          <circle cx={px(jun12)} cy={py(seriesY('monday')[5])} r="1.6" fill={C_MONDAY} vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Jun 12 tooltip — flat mode only */}
        <Tooltip jun12x={(jun12 / 7) * 100} show={flat} reduced={reduced} />
      </div>

      {/* x-axis labels */}
      <div style={{ position: 'relative', height: '1.6cqw', marginTop: '0.6cqw', marginLeft: '3.4cqw' }}>
        {xTicks.map((t) => (
          <span
            key={t.label}
            style={{
              position: 'absolute',
              left: `${(t.i / 7) * 100}%`,
              transform: t.i === 0 ? 'none' : t.i === 7 ? 'translateX(-100%)' : 'translateX(-50%)',
              fontSize: '1.05cqw',
              color: 'var(--ink-40)',
              whiteSpace: 'nowrap'
            }}
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
        left: `calc(${jun12x}% + 1.2cqw)`,
        top: '2%',
        borderRadius: '1cqw',
        background: 'var(--white)',
        border: '1px solid var(--line)',
        boxShadow: '0 6px 20px rgba(10,10,15,0.12)',
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
          return (
            <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.6cqw', fontSize: '1.2cqw', color: 'var(--ink-70)', fontWeight: 500 }}>
              <span
                style={{
                  width: '1.7cqw',
                  height: '1.7cqw',
                  borderRadius: '0.4cqw',
                  background: m.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg viewBox="0 0 24 24" width="1.1cqw" height="1.1cqw" aria-hidden>
                  <path d="M5 12.5l4 4 10-10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {m.label}
            </span>
          )
        })}
      </div>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.7cqw', fontSize: '1.2cqw', color: 'var(--ink-70)', fontWeight: 500 }}>
        <span style={{ width: '2.8cqw', height: '1.5cqw', borderRadius: '999px', background: 'var(--ink)', position: 'relative', flex: 'none' }}>
          <span style={{ position: 'absolute', top: '50%', right: '0.2cqw', transform: 'translateY(-50%)', width: '1.1cqw', height: '1.1cqw', borderRadius: '999px', background: '#fff' }} />
        </span>
        Compare competitors
      </span>
    </div>
  )
}

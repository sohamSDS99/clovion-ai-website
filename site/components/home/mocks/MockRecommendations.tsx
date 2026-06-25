'use client'

// Pillar 4 — "Opportunities" alert-list dashboard. Coded (no raster).

import { type ReactNode, useEffect, useState } from 'react'
import { cb, useReducedMotion, useReveal, useCountUp, useStagger } from './motion'
import { LIGHT } from './palette'

const POSITIVE = 'var(--positive)'
const NEG = '#e5484d'

type Row = { title: string; source: 'query' | 'alert'; desc: string }
const ROWS: Row[] = [
  { title: 'Optimize content for: Clockify', source: 'query', desc: 'This related query recurred 27 times around your prompts in the window, but none of those answ…' },
  { title: 'Competitor breakout: Salesforce', source: 'alert', desc: 'Salesforce was mentioned 617 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth a lo…' },
  { title: 'Competitor breakout: Asana', source: 'alert', desc: 'Asana was mentioned 244 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth a look …' },
  { title: 'Competitor breakout: Monday.com', source: 'alert', desc: 'Monday.com was mentioned 214 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth a…' },
  { title: 'Competitor breakout: Trello', source: 'alert', desc: 'Trello was mentioned 161 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth a look at …' },
  { title: 'Competitor breakout: Chanel', source: 'alert', desc: 'Chanel was mentioned 1305 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth a loo…' },
  { title: 'Competitor breakout: HubSpot', source: 'alert', desc: 'HubSpot was mentioned 217 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth a loo…' },
  { title: 'Competitor breakout: Hermès', source: 'alert', desc: 'Hermès was mentioned 1139 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth a loo…' },
  { title: 'Competitor breakout: Ferrari', source: 'alert', desc: 'Ferrari was mentioned 906 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth a look …' },
  { title: 'Competitor breakout: Porsche', source: 'alert', desc: 'Porsche was mentioned 933 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth a loo…' },
  { title: 'Competitor breakout: Louis Vuitton', source: 'alert', desc: 'Louis Vuitton was mentioned 733 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth …' },
  { title: 'Competitor breakout: Monday.com', source: 'alert', desc: 'Monday.com was mentioned 193 time(s) in the last 7 days vs. 0 in the preceding 28 days. Worth a…' }
]

const COLS = '2.6fr 6.5fr 1.4fr 1.6fr 0.4fr'

// Rows the drawer tours through, with the detail it reveals.
const TOUR = [0, 1, 4]
const DETAILS: Record<number, { what: string; fixes: string[] }> = {
  0: {
    what:
      "This related query recurred 27 times around your prompts this window — yet none of those AI answers cited or recommended you. It's an open lane to capture.",
    fixes: [
      'Publish a focused page that answers this query directly.',
      'Add FAQ / HowTo structured data so engines extract you cleanly.',
      'Cite first-party numbers the model can quote back.'
    ]
  },
  1: {
    what:
      'Salesforce was mentioned 617 times in the last 7 days versus 0 in the prior 28 — a sudden breakout in how often AI surfaces them for your prompts.',
    fixes: [
      'Open the prompts where Salesforce broke out.',
      'Counter the claims AI is rewarding with stronger first-party proof.',
      'Track share-of-voice weekly to confirm the gap is closing.'
    ]
  },
  4: {
    what:
      'Trello was mentioned 161 times in the last 7 days versus 0 in the prior 28 — a fresh surge worth a closer look across your tracked prompts.',
    fixes: [
      "Review the prompts and engines driving Trello's lift.",
      'Strengthen the pages those answers should be citing.',
      'Set an alert threshold so the next breakout pings sooner.'
    ]
  }
}

export function MockRecommendations({ show }: { show: boolean }) {
  const play = useReveal(show)
  const reduced = useReducedMotion()
  const count = useCountUp(49, play, { durationMs: 650 })
  const rows = useStagger(ROWS.length, play, 45, 320)

  // Self-driving drawer: open a row → hold → slide away → next row, forever.
  const [openState, setOpenState] = useState(false)
  const [displayIdx, setDisplayIdx] = useState<number | null>(null)
  useEffect(() => {
    if (!play || reduced) {
      setOpenState(false)
      return
    }
    let i = 0
    let hold: ReturnType<typeof setTimeout>
    let gap: ReturnType<typeof setTimeout>
    const open = () => {
      setDisplayIdx(TOUR[i])
      setOpenState(true)
      hold = setTimeout(() => {
        setOpenState(false)
        gap = setTimeout(() => {
          i = (i + 1) % TOUR.length
          open()
        }, 1500)
      }, 3600)
    }
    const start = setTimeout(open, 1600)
    return () => {
      clearTimeout(start)
      clearTimeout(hold)
      clearTimeout(gap)
    }
  }, [play, reduced])

  return (
    <div
      style={{
        ...LIGHT,
        position: 'relative',
        width: '100%',
        height: '100%',
        containerType: 'size',
        background: 'var(--white)',
        color: 'var(--ink)',
        fontFamily: 'var(--font-body-reg, var(--font-body))',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Breadcrumb */}
      <div style={{ padding: '1.6cqw 2.4cqw', borderBottom: '1px solid var(--line)', fontSize: '1.1cqw', color: 'var(--ink-50)' }}>
        AI Visibility / <span style={{ color: 'var(--ink)', fontWeight: 600 }}>Opportunities</span>
      </div>

      <div style={{ padding: '1.8cqw 2.4cqw 0', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.2cqw' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.6cqw', fontWeight: 600, letterSpacing: '-0.02em' }}>Opportunities</span>
          <span style={{ fontSize: '1.9cqw', fontWeight: 600, color: 'var(--ink-50)', fontVariantNumeric: 'tabular-nums' }}>{count}</span>
          <span style={{ fontSize: '1.2cqw', color: 'var(--ink-50)' }}>· Closed this month:</span>
          <ClosedPulse play={play} />
        </div>
        <p style={{ margin: '0.8cqw 0 0', fontSize: '1.2cqw', lineHeight: 1.45, color: 'var(--ink-60)', maxWidth: '78cqw' }}>
          Your highest-impact next moves across citations, alerts, on-page, crawl, and query signals — ranked. Open a row to see what it is and how to fix it.
        </p>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.8cqw', marginTop: '1.6cqw' }}>
          <SegTab active>Open <Num>49</Num></SegTab>
          <SegTab>Recently closed <Num>1</Num></SegTab>
        </div>
        <div style={{ display: 'flex', gap: '0.8cqw', marginTop: '0.8cqw' }}>
          <SegTab active small>All <Num>49</Num></SegTab>
          <SegTab small>Alerts <Num>41</Num></SegTab>
          <SegTab small>Query gaps <Num>8</Num></SegTab>
        </div>

        {/* Table */}
        <div style={{ marginTop: '1.4cqw', border: '1px solid var(--line)', borderRadius: '1.2cqw', overflow: 'hidden', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', padding: '1cqw 1.6cqw', background: 'var(--subtle)', borderBottom: '1px solid var(--line)', fontSize: '1.05cqw', fontWeight: 600, color: 'var(--ink-50)' }}>
            <span>Priority ↓</span>
            <span>Opportunity</span>
            <span>Source</span>
            <span>Impact</span>
            <span />
          </div>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            {ROWS.map((r, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: COLS,
                  alignItems: 'center',
                  padding: '1cqw 1.6cqw',
                  borderBottom: i < ROWS.length - 1 ? '1px solid var(--line)' : 'none',
                  background: openState && displayIdx === i ? 'var(--subtle)' : 'transparent',
                  boxShadow: openState && displayIdx === i ? 'inset 0.35cqw 0 0 var(--ink)' : 'inset 0 0 0 transparent',
                  opacity: rows[i] ? 1 : 0,
                  transform: rows[i] ? 'none' : 'translateY(0.6cqw)',
                  transition: reduced
                    ? 'none'
                    : `opacity 0.4s ${cb}, transform 0.4s ${cb}, background 0.35s ${cb}, box-shadow 0.35s ${cb}`
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6cqw', fontSize: '1.15cqw', fontWeight: 600 }}>
                  <PulseDot color={NEG} delay={i * 0.12} /> High
                </span>
                <span style={{ minWidth: 0, paddingRight: '1.6cqw' }}>
                  <span style={{ display: 'block', fontSize: '1.2cqw', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span>
                  <span style={{ display: 'block', marginTop: '0.3cqw', fontSize: '1.05cqw', color: 'var(--ink-50)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.desc}</span>
                </span>
                <span>
                  {r.source === 'query' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5cqw', fontSize: '1.05cqw', fontWeight: 600, color: POSITIVE, padding: '0.25cqw 0.8cqw', borderRadius: '999px', background: 'var(--positive-bg)', border: '1px solid var(--positive-border)' }}>
                      <Dot color={POSITIVE} /> Query gap
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5cqw', fontSize: '1.05cqw', fontWeight: 600, color: 'var(--ink-70)', padding: '0.25cqw 0.8cqw', borderRadius: '999px', border: '1px solid var(--line)' }}>
                      <Dot color={NEG} /> Alert
                    </span>
                  )}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.7cqw', fontSize: '1.15cqw', fontWeight: 600 }}>
                  <PulseDot color={NEG} delay={i * 0.12} /> High
                  <NewPill play={play} />
                </span>
                <span style={{ color: 'var(--ink-40)', fontSize: '1.4cqw', textAlign: 'right' }}>›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.2cqw 0.4cqw 1.6cqw' }}>
          <span style={{ fontSize: '1.1cqw', color: 'var(--ink-50)' }}>
            Showing <strong style={{ color: 'var(--ink)' }}>1–12</strong> of 49
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4cqw', fontSize: '1.1cqw', color: 'var(--ink-50)' }}>
            ‹
            {['1', '2', '3', '4', '5'].map((p) => (
              <span
                key={p}
                style={{
                  minWidth: '2.2cqw',
                  textAlign: 'center',
                  padding: '0.3cqw 0.6cqw',
                  borderRadius: '0.6cqw',
                  background: p === '1' ? 'var(--ink)' : 'transparent',
                  color: p === '1' ? 'var(--white)' : 'var(--ink-50)',
                  fontWeight: p === '1' ? 600 : 500
                }}
              >
                {p}
              </span>
            ))}
            ›
          </span>
        </div>
      </div>

      {/* Backdrop scrim — dims the table while the drawer is open. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,10,15,0.24)',
          opacity: openState ? 1 : 0,
          transition: reduced ? 'none' : `opacity 0.4s ${cb}`,
          zIndex: 5,
          pointerEvents: 'none'
        }}
      />

      {/* Side drawer — auto-opens to reveal "what it is / how to fix it". */}
      <Drawer
        open={openState}
        row={displayIdx != null ? ROWS[displayIdx] : null}
        detail={displayIdx != null ? DETAILS[displayIdx] : null}
      />
    </div>
  )
}

function Drawer({ open, row, detail }: { open: boolean; row: Row | null; detail: { what: string; fixes: string[] } | null }) {
  const reduced = useReducedMotion()
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: '54cqw',
        background: 'var(--white)',
        borderLeft: '1px solid var(--line)',
        boxShadow: open ? '-1.5cqw 0 5cqw rgba(10,10,15,0.16)' : 'none',
        transform: open ? 'translateX(0)' : 'translateX(108%)',
        transition: reduced ? 'none' : `transform 0.52s ${cb}`,
        zIndex: 6,
        display: 'flex',
        flexDirection: 'column',
        padding: '2cqw 2.2cqw',
        overflow: 'hidden'
      }}
    >
      {row && detail && (
        <>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1cqw' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95cqw', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>Opportunity</div>
              <div style={{ marginTop: '0.5cqw', fontFamily: 'var(--font-display)', fontSize: '2cqw', fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{row.title}</div>
            </div>
            <span style={{ fontSize: '1.6cqw', color: 'var(--ink-40)', lineHeight: 1, flexShrink: 0 }}>✕</span>
          </div>

          {/* Meta pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7cqw', marginTop: '1.1cqw' }}>
            <Pill kind={row.source} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5cqw', fontSize: '1.05cqw', fontWeight: 600 }}>
              <Dot color={NEG} /> High impact
            </span>
          </div>

          {/* What it is */}
          <DrawerSection label="WHAT IT IS">
            <p style={{ margin: 0, fontSize: '1.2cqw', lineHeight: 1.55, color: 'var(--ink-70)' }}>{detail.what}</p>
          </DrawerSection>

          {/* How to fix it */}
          <DrawerSection label="HOW TO FIX IT">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9cqw' }}>
              {detail.fixes.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '0.8cqw',
                    alignItems: 'flex-start',
                    opacity: open ? 1 : 0,
                    transform: open ? 'none' : 'translateY(0.8cqw)',
                    transition: reduced ? 'none' : `opacity 0.4s ${cb} ${0.14 + i * 0.08}s, transform 0.4s ${cb} ${0.14 + i * 0.08}s`
                  }}
                >
                  <Check />
                  <span style={{ fontSize: '1.15cqw', lineHeight: 1.5, color: 'var(--ink-80, var(--ink))' }}>{f}</span>
                </div>
              ))}
            </div>
          </DrawerSection>

          {/* Footer actions */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: '0.8cqw', paddingTop: '1.4cqw', borderTop: '1px solid var(--line)' }}>
            <span style={{ background: 'var(--ink)', color: 'var(--white)', fontSize: '1.15cqw', fontWeight: 600, padding: '0.8cqw 1.6cqw', borderRadius: '0.8cqw' }}>Apply fix</span>
            <span style={{ color: 'var(--ink-60)', fontSize: '1.15cqw', fontWeight: 600, padding: '0.8cqw 1.4cqw', borderRadius: '0.8cqw', border: '1px solid var(--line)' }}>Dismiss</span>
          </div>
        </>
      )}
    </div>
  )
}

function Pill({ kind }: { kind: 'query' | 'alert' }) {
  if (kind === 'query') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5cqw', fontSize: '1.05cqw', fontWeight: 600, color: POSITIVE, padding: '0.25cqw 0.8cqw', borderRadius: '999px', background: 'var(--positive-bg)', border: '1px solid var(--positive-border)' }}>
        <Dot color={POSITIVE} /> Query gap
      </span>
    )
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5cqw', fontSize: '1.05cqw', fontWeight: 600, color: 'var(--ink-70)', padding: '0.25cqw 0.8cqw', borderRadius: '999px', border: '1px solid var(--line)' }}>
      <Dot color={NEG} /> Alert
    </span>
  )
}

function DrawerSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: '1.6cqw' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95cqw', letterSpacing: '0.12em', color: 'var(--ink-40)', marginBottom: '0.7cqw' }}>{label}</div>
      {children}
    </div>
  )
}

function Check() {
  return (
    <span style={{ flexShrink: 0, marginTop: '0.1cqw', width: '1.7cqw', height: '1.7cqw', borderRadius: '999px', background: 'var(--positive-bg)', color: POSITIVE, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.05cqw', fontWeight: 700 }}>✓</span>
  )
}

function Dot({ color }: { color: string }) {
  return <span style={{ width: '0.9cqw', height: '0.9cqw', borderRadius: '999px', background: color, flexShrink: 0 }} />
}

// "High" priority/impact indicator — a continuously pulsing alert dot
// (expanding ring + soft core pulse). Never stops.
function PulseDot({ color, delay = 0 }: { color: string; delay?: number }) {
  const reduced = useReducedMotion()
  return (
    <span style={{ position: 'relative', width: '0.9cqw', height: '0.9cqw', flexShrink: 0, display: 'inline-block' }}>
      {!reduced && (
        <span style={{ position: 'absolute', inset: 0, borderRadius: '999px', background: color, animation: `clvPulseRing 1.8s ease-out ${delay}s infinite` }} />
      )}
      <span
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '999px',
          background: color,
          animation: reduced ? 'none' : `clvPulseCore 1.8s ease-in-out ${delay}s infinite`
        }}
      />
      <style>{'@keyframes clvPulseRing{0%{transform:scale(1);opacity:0.5}70%{opacity:0}100%{transform:scale(3.2);opacity:0}}@keyframes clvPulseCore{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.25);opacity:0.85}}'}</style>
    </span>
  )
}

function Num({ children }: { children: ReactNode }) {
  return <span style={{ marginLeft: '0.5cqw', fontSize: '0.95em', color: 'var(--ink-40)', fontWeight: 500 }}>{children}</span>
}

function SegTab({ children, active, small }: { children: ReactNode; active?: boolean; small?: boolean }) {
  const reduced = useReducedMotion()
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        padding: small ? '0.5cqw 1.1cqw' : '0.6cqw 1.3cqw',
        borderRadius: '0.8cqw',
        fontSize: small ? '1.15cqw' : '1.25cqw',
        fontWeight: 600,
        color: active ? 'var(--ink)' : 'var(--ink-50)',
        background: active ? 'var(--subtle)' : 'transparent',
        border: `1px solid ${active ? 'var(--line)' : 'transparent'}`,
        overflow: 'hidden'
      }}
    >
      {children}
      {active && (
        <span
          style={{
            position: 'absolute',
            left: '1.1cqw',
            right: '1.1cqw',
            bottom: 0,
            height: '0.2cqw',
            background: 'var(--ink)',
            borderRadius: '999px',
            transformOrigin: 'left center',
            transform: 'scaleX(1)',
            animation: reduced ? 'none' : 'clvSegIn 0.5s both'
          }}
        />
      )}
      <style>{'@keyframes clvSegIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}'}</style>
    </span>
  )
}

function NewPill({ play }: { play: boolean }) {
  const reduced = useReducedMotion()
  return (
    <span
      style={{
        fontSize: '0.95cqw',
        fontWeight: 600,
        color: 'var(--ink-60)',
        padding: '0.15cqw 0.7cqw',
        borderRadius: '999px',
        border: '1px solid var(--line)',
        animation: reduced || !play ? 'none' : 'clvNewPulse 1.2s ease-in-out infinite'
      }}
    >
      New
      <style>{'@keyframes clvNewPulse{0%,100%{opacity:1}50%{opacity:0.6}}'}</style>
    </span>
  )
}

function ClosedPulse({ play }: { play: boolean }) {
  const reduced = useReducedMotion()
  return (
    <span
      style={{
        fontSize: '1.3cqw',
        fontWeight: 700,
        color: POSITIVE,
        fontVariantNumeric: 'tabular-nums',
        animation: reduced || !play ? 'none' : 'clvClosed 1.6s ease-out 0.4s 1'
      }}
    >
      1
      <style>{'@keyframes clvClosed{0%{transform:scale(1)}30%{transform:scale(1.35)}100%{transform:scale(1)}}'}</style>
    </span>
  )
}

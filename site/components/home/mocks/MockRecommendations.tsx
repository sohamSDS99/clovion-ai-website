'use client'

// Pillar 4 — "Opportunities" alert-list dashboard. Coded (no raster).

import { type ReactNode } from 'react'
import { cb, useReducedMotion, useReveal, useCountUp, useStagger } from './motion'

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

export function MockRecommendations({ show }: { show: boolean }) {
  const play = useReveal(show)
  const reduced = useReducedMotion()
  const count = useCountUp(49, play, { durationMs: 650 })
  const rows = useStagger(ROWS.length, play, 45, 320)

  return (
    <div
      style={{
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
                  opacity: rows[i] ? 1 : 0,
                  transform: rows[i] ? 'none' : 'translateY(0.6cqw)',
                  transition: reduced ? 'none' : `opacity 0.4s ${cb}, transform 0.4s ${cb}`
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6cqw', fontSize: '1.15cqw', fontWeight: 600 }}>
                  <Dot color={NEG} /> High
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
                  <Dot color={NEG} /> High
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
    </div>
  )
}

function Dot({ color }: { color: string }) {
  return <span style={{ width: '0.9cqw', height: '0.9cqw', borderRadius: '999px', background: color, flexShrink: 0 }} />
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

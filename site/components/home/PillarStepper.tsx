'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react'
import Link from 'next/link'
import { Container, ArrowRight } from '@/components/ui'

const STEP_VH = 64

// ── glyph paths ───────────────────────────────────────────────────────
const G = {
  track: <path d="M12 4a8 8 0 100 16 8 8 0 000-16zm0 4a4 4 0 100 8 4 4 0 000-8zm0 3a1 1 0 100 2 1 1 0 000-2z" />,
  bulb: <path d="M9 18h6v1.5a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 19.5V18zm3-15a6 6 0 00-3.6 10.8c.4.3.6.7.6 1.2v.5h6v-.5c0-.5.2-.9.6-1.2A6 6 0 0012 3z" />,
  face: <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM8.5 10a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm7 0a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM8 15.5h8a4 4 0 01-8 0z" />,
  bars: <path d="M4 20V10h4v10H4zm6 0V4h4v16h-4zm6 0v-7h4v7h-4z" />
}

function Glyph({ d, color }: { d: ReactElement; color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={color} stroke="none" aria-hidden>
      {d}
    </svg>
  )
}

function StatTile({ value, label, pos }: { value: string; label: string; pos?: boolean }) {
  return (
    <div style={{ flex: 1, minWidth: 0, padding: '10px 12px', borderRadius: 12, background: 'var(--subtle)', border: '1px solid var(--line)' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: pos ? 'var(--positive)' : 'var(--ink)',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap'
        }}
      >
        {value}
      </div>
      <div style={{ marginTop: 5, fontSize: '0.72rem', color: 'var(--ink-60)', lineHeight: 1.25 }}>{label}</div>
    </div>
  )
}

function OppBulb() {
  return (
    <span
      style={{
        height: 22,
        width: 22,
        flexShrink: 0,
        borderRadius: 7,
        background: 'var(--positive-bg)',
        border: '1px solid var(--positive-border)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--positive)'
      }}
    >
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
        <path d="M9 18h6v1.3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 19.3V18zm3-15a6 6 0 00-3.6 10.8c.4.3.6.7.6 1.2v.5h6v-.5c0-.5.2-.9.6-1.2A6 6 0 0012 3z" />
      </svg>
    </span>
  )
}

function MiniCheck({ size = 18 }: { size?: number }) {
  return (
    <span
      style={{
        height: size,
        width: size,
        flexShrink: 0,
        borderRadius: 999,
        background: 'var(--positive)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg viewBox="0 0 12 12" width={size * 0.5} height={size * 0.5} aria-hidden>
        <path d="M2 6l3 3 5-6" stroke="#04261b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

// ── Mock 01 · AI Visibility Insights ─────────────────────────────────
const VIS_ENGINES = [
  { e: 'ChatGPT', v: 12.3, d: 22 },
  { e: 'Perplexity', v: 7.6, d: 15 },
  { e: 'Gemini', v: 6.1, d: 9 },
  { e: 'Claude', v: 4.8, d: 11 },
  { e: 'Copilot', v: 3.2, d: 7 }
]
const VIS_TABS = ['By AI Engine', 'By Audience', 'By Intent', 'By Topic']
const VIS_OPPS = [
  'Increase visibility in enterprise-focused prompts where competitors appear more often.',
  'Improve presence on Gemini and Copilot for project-management use cases.'
]

function MockVisibility() {
  const max = 12.3
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
          <span
            style={{
              height: 24,
              width: 24,
              borderRadius: 7,
              background: 'var(--positive-bg)',
              border: '1px solid var(--positive-border)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--positive)'
            }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden>
              <path d="M4 20V11h3.5v9H4zm6.25 0V4h3.5v16h-3.5zM16.5 20v-6H20v6h-3.5z" />
            </svg>
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, color: 'var(--ink)' }}>
            AI Visibility Insights
          </span>
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--ink-50)', whiteSpace: 'nowrap' }}>
          12,540 prompts · 6 engines
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <StatTile value="2.4K" label="Total mentions" />
        <StatTile value="8.7%" label="Visibility share" />
        <StatTile value="#3.6" label="Avg. position" />
        <StatTile value="+18%" label="vs last 30 days" pos />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, borderTop: '1px solid var(--line)', paddingTop: 10 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-50)', whiteSpace: 'nowrap' }}>
          Visibility breakdown
        </span>
        <span style={{ display: 'inline-flex', gap: 5 }}>
          {VIS_TABS.map((t, i) => (
            <span
              key={t}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.68rem',
                fontWeight: 600,
                padding: '3px 9px',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                background: i === 0 ? 'var(--ink-07)' : 'transparent',
                border: `1px solid ${i === 0 ? 'var(--line)' : 'transparent'}`,
                color: i === 0 ? 'var(--ink)' : 'var(--ink-50)'
              }}
            >
              {t}
            </span>
          ))}
        </span>
      </div>

      <div style={{ display: 'grid', gap: 6 }}>
        {VIS_ENGINES.map((r, i) => (
          <div key={r.e} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span style={{ width: 70, flexShrink: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{r.e}</span>
            <span style={{ flex: 1, height: 7, borderRadius: 999, background: 'var(--ink-06)', overflow: 'hidden' }}>
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  width: `${(r.v / max) * 100}%`,
                  borderRadius: 999,
                  background: i === 0 ? 'var(--positive)' : 'var(--ink-40)'
                }}
              />
            </span>
            <span style={{ width: 40, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
              {r.v}%
            </span>
            <span style={{ width: 38, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600, color: 'var(--positive)', fontVariantNumeric: 'tabular-nums' }}>
              ↑{r.d}%
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--line)', paddingTop: 9 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-50)', marginBottom: 7 }}>
          Top opportunities
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          {VIS_OPPS.map((o, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
              <OppBulb />
              <span style={{ fontSize: '0.78rem', lineHeight: 1.4, color: 'var(--ink-70)' }}>{o}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Mock 02 · Brand Perception ──────────────────────────────────────
const PERC_CATS = ['Audience', 'Intent', 'Industry', 'Use Case', 'Perception', 'Sentiment']
const PERC_YOURS = ['SMB', 'Ease of use', 'Fast implementation']
const PERC_COMP = ['Enterprise', 'Security', 'Scalability']

function Hl({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: 'var(--positive-bg)',
        borderRadius: 4,
        padding: '1px 4px',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone'
      }}
    >
      {children}
    </span>
  )
}

function MockPerception() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.7fr 1fr', gap: 14, height: '100%', overflow: 'hidden' }}>
      {/* col 1 — tagged AI answer */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--white)', padding: 14, overflow: 'hidden' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              height: 20,
              width: 20,
              borderRadius: 999,
              background: 'var(--ink-surface, var(--ink))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ height: 7, width: 7, borderRadius: 999, background: 'var(--on-ink)' }} />
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-50)' }}>
            Tagged AI response
          </span>
        </span>
        <p style={{ margin: '12px 0 0', fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--ink-80, var(--ink-70))' }}>
          Best CRM for a growing SaaS team? Often recommended for <Hl>small and mid-sized businesses</Hl> because it combines <Hl>CRM, marketing automation</Hl> in a <Hl>single platform</Hl>.
        </p>
        <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Audience', 'Use case', 'Perception'].map((k) => (
            <span
              key={k}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--ink-60)',
                background: 'var(--subtle)',
                border: '1px solid var(--line)',
                borderRadius: 999,
                padding: '3px 8px'
              }}
            >
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* col 2 — Clovion analyzes → categories */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--ink-70)', lineHeight: 1.4 }}>Clovion tags every AI response</span>
        <span
          aria-hidden
          style={{
            margin: '10px 0',
            height: 1,
            background: 'linear-gradient(90deg, var(--positive), transparent)'
          }}
        />
        <div style={{ display: 'grid', gap: 6 }}>
          {PERC_CATS.map((c) => (
            <span
              key={c}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--ink-70)',
                padding: '4px 9px',
                borderRadius: 7,
                background: 'var(--ink-04)',
                border: '1px solid var(--line)'
              }}
            >
              <span style={{ height: 5, width: 5, borderRadius: 999, background: 'var(--positive)' }} />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* col 3 — perception insights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--positive)', fontWeight: 600 }}>
            You&rsquo;re associated with
          </span>
          <div style={{ marginTop: 9, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {PERC_YOURS.map((p) => (
              <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.82rem', color: 'var(--ink-80, var(--ink-70))' }}>
                <MiniCheck size={17} />
                {p}
              </span>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 11 }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--ink-60)' }}>Competitors own</span>
          <div style={{ marginTop: 9, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PERC_COMP.map((c) => (
              <span
                key={c}
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: 'var(--ink-70)',
                  background: 'var(--ink-04)',
                  border: '1px solid var(--line)',
                  borderRadius: 999,
                  padding: '4px 11px'
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 9,
            padding: 11,
            borderRadius: 10,
            background: 'var(--positive-bg)',
            border: '1px solid var(--positive-border)'
          }}
        >
          <OppBulb />
          <span style={{ fontSize: '0.74rem', lineHeight: 1.4, color: 'var(--ink-80, var(--ink-70))' }}>
            Strengthen authority around <strong style={{ color: 'var(--ink)' }}>security</strong> &amp; <strong style={{ color: 'var(--ink)' }}>scalability</strong> to win enterprise prompts.
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Mock 03 · Rankings by topic ─────────────────────────────────────
const RANK_ROWS = [
  { topic: 'Centralized SDS Repository', rank: '1st', share: 28.4, delta: '+3.7', up: true, tag: 'Strong', comp: ['S', 'E', 'P', '3E'] },
  { topic: 'SDS Management', rank: '2nd', share: 22.3, delta: '+2.9', up: true, tag: 'Strong', comp: ['E', 'S', 'C', 'I'] },
  { topic: 'Regulatory Compliance', rank: '5th', share: 9.1, delta: '−0.8', up: false, tag: 'Needs work', comp: ['S', 'I', 'C', 'P'] },
  { topic: 'Compliance Reporting', rank: '6th', share: 8.7, delta: '−1.3', up: false, tag: 'Needs work', comp: ['C', 'I', 'S', 'E'] },
  { topic: 'Audit Readiness', rank: '7th', share: 6.2, delta: '−2.1', up: false, tag: 'Needs work', comp: ['I', 'S', 'C', 'P'] }
]
const NEG = '#fb7185'

function CompDot({ t }: { t: string }) {
  return (
    <span
      style={{
        height: 18,
        width: 18,
        borderRadius: 999,
        background: 'var(--ink-07)',
        border: '1px solid var(--line)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.52rem',
        fontWeight: 600,
        color: 'var(--ink-50)'
      }}
    >
      {t}
    </span>
  )
}

function MockRankings() {
  const max = 28.4
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 0.9fr', gap: 16, height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 9 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-50)' }}>
            Rankings by topic
          </span>
          <span style={{ display: 'inline-flex', gap: 5 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--ink-60)', background: 'var(--ink-04)', border: '1px solid var(--line)', borderRadius: 999, padding: '3px 8px', whiteSpace: 'nowrap' }}>
              May 12 – Jun 11
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--ink-60)', background: 'var(--ink-04)', border: '1px solid var(--line)', borderRadius: 999, padding: '3px 8px', whiteSpace: 'nowrap' }}>
              All engines
            </span>
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.45fr 0.85fr 1.2fr', padding: '0 2px 8px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)', borderBottom: '1px solid var(--line)' }}>
          <span>Topic</span>
          <span>Rank</span>
          <span>Top 4</span>
          <span style={{ textAlign: 'right' }}>Share</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {RANK_ROWS.map((r) => (
            <div
              key={r.topic}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 0.45fr 0.85fr 1.2fr',
                alignItems: 'center',
                gap: 6,
                padding: '0 2px',
                flex: 1,
                borderBottom: '1px solid var(--line)'
              }}
            >
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.topic}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', fontWeight: 600, color: r.tag === 'Strong' ? 'var(--positive)' : 'var(--ink-50)' }}>
                  {r.tag}
                </span>
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                {r.rank}
              </span>
              <span style={{ display: 'inline-flex', gap: 3 }}>
                {r.comp.map((c, ci) => (
                  <CompDot key={ci} t={c} />
                ))}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7, justifyContent: 'flex-end' }}>
                <span style={{ flex: 1, height: 6, borderRadius: 999, background: 'var(--ink-06)', overflow: 'hidden', minWidth: 22 }}>
                  <span
                    style={{
                      display: 'block',
                      height: '100%',
                      width: `${(r.share / max) * 100}%`,
                      borderRadius: 999,
                      background: r.tag === 'Strong' ? 'var(--positive)' : 'var(--ink-40)'
                    }}
                  />
                </span>
                <span style={{ width: 34, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                  {r.share}%
                </span>
                <span style={{ width: 38, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', fontWeight: 600, color: r.up ? 'var(--positive)' : NEG, fontVariantNumeric: 'tabular-nums' }}>
                  {r.delta}pp
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-50)' }}>
          Insights &amp; opportunities
        </span>
        <div style={{ padding: '10px 11px', borderRadius: 10, background: 'var(--positive-bg)', border: '1px solid var(--positive-border)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--positive)' }}>
            Where you win
          </span>
          <p style={{ margin: '5px 0 0', fontSize: '0.74rem', lineHeight: 1.4, color: 'var(--ink-80, var(--ink-70))' }}>
            Top 2 on <strong style={{ color: 'var(--ink)' }}>Repository</strong> &amp; <strong style={{ color: 'var(--ink)' }}>SDS Management</strong>.
          </p>
        </div>
        <div style={{ padding: '10px 11px', borderRadius: 10, background: 'rgba(251,113,133,0.10)', border: '1px solid rgba(251,113,133,0.30)' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: NEG }}>
            Where you lose
          </span>
          <p style={{ margin: '5px 0 0', fontSize: '0.74rem', lineHeight: 1.4, color: 'var(--ink-80, var(--ink-70))' }}>
            Competitors dominate <strong style={{ color: 'var(--ink)' }}>Audit Readiness</strong>.
          </p>
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, padding: '9px 10px', borderRadius: 10, background: 'var(--subtle)', border: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--positive)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              +18.7%
            </div>
            <div style={{ marginTop: 5, fontSize: '0.62rem', color: 'var(--ink-60)', lineHeight: 1.2 }}>Potential gain</div>
          </div>
          <div style={{ flex: 1, padding: '9px 10px', borderRadius: 10, background: 'var(--subtle)', border: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              1.6x
            </div>
            <div style={{ marginTop: 5, fontSize: '0.62rem', color: 'var(--ink-60)', lineHeight: 1.2 }}>More likely cited</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Mock 04 · Recommendations ───────────────────────────────────────
const REC_CATS = [
  { n: 'AI Visibility', c: 15 },
  { n: 'Brand Perception', c: 11 },
  { n: 'Competitive', c: 12 },
  { n: 'AEO / GEO Content', c: 6 },
  { n: 'Technical & Authority', c: 4 }
]
const REC_ITEMS = [
  { t: 'Win the citation for acs.org', c: 'AI Visibility', p: 'High' },
  { t: 'Improve association with “enterprise”', c: 'Perception', p: 'High' },
  { t: 'Close the gap on “SDS Management”', c: 'Competitive', p: 'High' },
  { t: 'Create content for “regulatory compliance”', c: 'AEO/GEO', p: 'Med' },
  { t: 'Get cited in AI Overviews', c: 'AI Visibility', p: 'Med' }
]
const REC_DO = [
  'Publish an answer-first page targeting the cited prompts.',
  'Match the cited source, then go deeper with specifics.',
  'Add clear headings so engines can lift a clean quote.'
]
const REC_PRI_COLOR: Record<string, string> = { High: '#fb7185', Med: '#fbbf24', Low: 'var(--ink-50)' }
const REC_PRI_BG: Record<string, string> = { High: 'rgba(251,113,133,0.12)', Med: 'rgba(251,191,36,0.12)', Low: 'var(--ink-04)' }

function MockRecommendations() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '0.82fr 1.05fr 1.05fr', gap: 13, height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)', marginBottom: 8 }}>
          48 recommendations
        </div>
        <div style={{ display: 'grid', gap: 5 }}>
          {REC_CATS.map((cat, i) => (
            <span
              key={cat.n}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
                padding: '7px 9px',
                borderRadius: 8,
                background: i === 0 ? 'var(--positive-bg)' : 'var(--ink-04)',
                border: `1px solid ${i === 0 ? 'var(--positive-border)' : 'var(--line)'}`
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: i === 0 ? 'var(--ink)' : 'var(--ink-70)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {cat.n}
              </span>
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.64rem', fontWeight: 600, color: i === 0 ? 'var(--positive)' : 'var(--ink-50)' }}>
                {cat.c}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '0 2px 7px', fontFamily: 'var(--font-mono)', fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)', borderBottom: '1px solid var(--line)' }}>
          <span>Recommendation</span>
          <span>Priority</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {REC_ITEMS.map((r, i) => (
            <div
              key={r.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '0 2px',
                flex: 1,
                borderBottom: i < REC_ITEMS.length - 1 ? '1px solid var(--line)' : 'none'
              }}
            >
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.t}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--ink-50)' }}>{r.c}</span>
              </span>
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: REC_PRI_COLOR[r.p],
                  background: REC_PRI_BG[r.p],
                  borderRadius: 999,
                  padding: '3px 9px'
                }}
              >
                {r.p}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--white)', padding: 13, minWidth: 0, overflow: 'hidden' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)', lineHeight: 1.2 }}>
          Win the citation for acs.org
        </span>
        <span style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)' }}>
          What to do
        </span>
        <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
          {REC_DO.map((d, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MiniCheck size={15} />
              <span style={{ fontSize: '0.72rem', lineHeight: 1.35, color: 'var(--ink-70)' }}>{d}</span>
            </span>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 11, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, padding: '8px 10px', borderRadius: 9, background: 'var(--subtle)', border: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--positive)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              +18.7%
            </div>
            <div style={{ marginTop: 4, fontSize: '0.6rem', color: 'var(--ink-60)' }}>Visibility gain</div>
          </div>
          <div style={{ flex: 1, padding: '8px 10px', borderRadius: 9, background: 'var(--subtle)', border: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              1.6x
            </div>
            <div style={{ marginTop: 4, fontSize: '0.6rem', color: 'var(--ink-60)' }}>More cited</div>
          </div>
        </div>
        <span
          style={{
            marginTop: 9,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            height: 30,
            borderRadius: 999,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            fontSize: '0.74rem',
            fontWeight: 600
          }}
        >
          Write a page targeting this <ArrowRight />
        </span>
      </div>
    </div>
  )
}

// ── PILLARS data ────────────────────────────────────────────────────
type Pillar = {
  sku: string
  name: string
  short: string
  headline: string
  body: string
  link: string
  tint: string
  fg: string
  glyph: ReactElement
  Mock: () => ReactElement
}

const PILLARS: Pillar[] = [
  {
    sku: '01 — Visibility',
    name: 'AI Visibility Tracking',
    short: 'See where, when, and how often AI recommends you.',
    headline: 'See where, when, and how often AI recommends you',
    body: 'Understand where, when, and how often AI recommends your brand across prompts, topics, engines, and audiences.',
    link: 'Explore AI Visibility Tracking',
    tint: '#ecfdf5',
    fg: '#047857',
    glyph: G.track,
    Mock: MockVisibility
  },
  {
    sku: '02 — Perception',
    name: 'Brand Perception',
    short: 'Understand how AI perceives your brand.',
    headline: 'Understand how AI perceives your brand',
    body: 'Understand how AI perceives your brand across audiences, industries, and use cases — and uncover the drivers shaping that perception.',
    link: 'Explore Brand Perception',
    tint: '#ecfdf5',
    fg: '#047857',
    glyph: G.face,
    Mock: MockPerception
  },
  {
    sku: '03 — Competitive',
    name: 'Competitive Positioning',
    short: 'See where competitors outperform you.',
    headline: 'See where competitors outperform you',
    body: 'Benchmark against competitors and see where they outperform you across topics, prompts, and AI engines.',
    link: 'Explore Competitive Positioning',
    tint: '#ecfdf5',
    fg: '#047857',
    glyph: G.bars,
    Mock: MockRankings
  },
  {
    sku: '04 — Recommendations',
    name: 'AEO/GEO Recommendations',
    short: 'Get a prioritized plan to get recommended more.',
    headline: 'Get prioritized recommendations that move visibility',
    body: 'Get prioritized recommendations to improve your visibility and increase how often AI recommends your brand.',
    link: 'Explore AEO/GEO Recommendations',
    tint: '#ecfdf5',
    fg: '#047857',
    glyph: G.bulb,
    Mock: MockRecommendations
  }
]

function PillarItem({
  s,
  i,
  active,
  prog,
  onClick
}: {
  s: Pillar
  i: number
  active: number
  prog: number
  onClick: () => void
}) {
  const isActive = i === active
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        borderTop: i === 0 ? 'none' : '1px solid var(--line)',
        padding: '16px 0',
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, opacity: isActive ? 1 : 0.45, transition: 'opacity 0.35s ease' }}>
        <span style={{ height: 34, width: 34, flexShrink: 0, borderRadius: 9, background: s.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Glyph d={s.glyph} color={s.fg} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--ink-40)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {s.sku.split(' — ')[0]}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.12rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
              {s.name}
            </span>
          </span>
          <span
            style={{
              display: 'grid',
              gridTemplateRows: isActive ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.4s var(--ease-out-expo)'
            }}
          >
            <span style={{ overflow: 'hidden' }}>
              <span style={{ display: 'block', marginTop: 8, fontSize: '0.9rem', fontWeight: 400, lineHeight: 1.5, color: 'var(--ink-70)' }}>
                {s.short}
              </span>
            </span>
          </span>
        </span>
      </div>
      <span
        style={{
          display: 'block',
          marginTop: 14,
          height: 2,
          borderRadius: 999,
          background: 'var(--ink-10)',
          overflow: 'hidden',
          opacity: isActive ? 1 : 0
        }}
      >
        <span style={{ display: 'block', height: '100%', width: `${(isActive ? prog : 0) * 100}%`, background: 'var(--ink)' }} />
      </span>
    </button>
  )
}

function MockPanel({ s, show }: { s: Pillar; show: boolean }) {
  const Mock = s.Mock
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: show ? 1 : 0,
        transform: show ? 'none' : 'translateY(14px) scale(0.985)',
        transition: 'opacity 0.5s ease, transform 0.55s var(--ease-out-expo)',
        pointerEvents: show ? 'auto' : 'none'
      }}
    >
      <div
        style={{
          height: '100%',
          borderRadius: 22,
          border: '1px solid var(--line)',
          background: 'var(--white)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div style={{ padding: '26px 28px 18px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.08,
              margin: 0,
              textWrap: 'balance',
              color: 'var(--ink)'
            }}
          >
            {s.headline}
          </h3>
          <p style={{ margin: '12px 0 0', fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.55, color: 'var(--ink-70)', maxWidth: 560 }}>
            {s.body}
          </p>
          <Link
            href="/features"
            className="mt-4 inline-flex items-center gap-1.5"
            style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}
          >
            {s.link} <ArrowRight />
          </Link>
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            margin: '0 18px 18px',
            borderRadius: 14,
            border: '1px solid var(--line)',
            background: 'var(--subtle)',
            padding: 16,
            overflow: 'hidden'
          }}
        >
          <Mock />
        </div>
      </div>
    </div>
  )
}

export function PillarStepper() {
  const pinRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [prog, setProg] = useState(0)
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1000px)')
    const onMq = () => setNarrow(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    return () => mq.removeEventListener('change', onMq)
  }, [])

  useEffect(() => {
    if (narrow) return
    const onScroll = () => {
      const el = pinRef.current
      if (!el) return
      const vh = window.innerHeight
      const total = el.offsetHeight - vh
      const scrolled = Math.min(Math.max(-el.getBoundingClientRect().top, 0), total)
      const p = total > 0 ? scrolled / total : 0
      const raw = p * PILLARS.length
      let idx = Math.floor(raw)
      if (idx >= PILLARS.length) idx = PILLARS.length - 1
      setActive(idx)
      setProg(Math.min(1, Math.max(0, raw - idx)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [narrow])

  const goto = (i: number) => {
    const el = pinRef.current
    if (!el) return
    const vh = window.innerHeight
    const total = el.offsetHeight - vh
    const absTop = window.scrollY + el.getBoundingClientRect().top
    const top = absTop + ((i + 0.5) / PILLARS.length) * total
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const Heading = (
    <div style={{ maxWidth: 880, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', marginBottom: narrow ? 40 : 'clamp(24px, 4vh, 44px)' }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--display-lg)',
          fontWeight: 600,
          letterSpacing: 'var(--track-display-lg)',
          lineHeight: 1.02,
          margin: '20px 0 0',
          textWrap: 'balance',
          color: 'var(--ink)'
        }}
      >
        Everything you need to understand and improve AI visibility.
      </h2>
      <p
        style={{
          fontSize: 'var(--text-lead)',
          lineHeight: 1.55,
          color: 'var(--ink-70)',
          marginTop: 20,
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: 760,
          textWrap: 'balance'
        }}
      >
        Millions of buying decisions now start with AI. Most brands don&rsquo;t know how they&rsquo;re represented — or whether AI recommends them at all. Clovion helps you earn more.
      </p>
    </div>
  )

  if (narrow) {
    return (
      <section style={{ padding: 'var(--section) 0' }}>
        <Container>
          {Heading}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {PILLARS.map((s) => (
              <div key={s.sku}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ height: 34, width: 34, borderRadius: 9, background: s.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Glyph d={s.glyph} color={s.fg} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
                    {s.name}
                  </span>
                </div>
                <div style={{ position: 'relative', height: 564 }}>
                  <MockPanel s={s} show={true} />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section style={{ position: 'relative', paddingTop: 'var(--section)' }}>
      <Container>{Heading}</Container>
      <div ref={pinRef} style={{ position: 'relative', height: `${PILLARS.length * STEP_VH}vh` }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <Container>
            <div
              style={
                {
                  display: 'grid',
                  gridTemplateColumns: 'minmax(240px, 0.5fr) 1.5fr',
                  gap: 44,
                  alignItems: 'center'
                } as CSSProperties
              }
            >
              <div>
                {PILLARS.map((s, i) => (
                  <PillarItem key={s.sku} s={s} i={i} active={active} prog={prog} onClick={() => goto(i)} />
                ))}
              </div>
              <div style={{ position: 'relative', height: 'clamp(380px, 56vh, 560px)' }}>
                {PILLARS.map((s, i) => (
                  <MockPanel key={s.sku} s={s} show={i === active} />
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  )
}

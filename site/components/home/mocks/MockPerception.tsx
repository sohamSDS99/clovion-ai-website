'use client'

// Pillar 2 — "Brand Perception" dashboard. Coded (no raster).
// Left feed (prompt -> thinking -> 3 ranked brand cards with brush-paint
// highlights) + right insights sidebar.

import { type ReactNode } from 'react'
import { cb, useReducedMotion, useReveal, useCountUp, useStagger, useTypewriter } from './motion'
import { MondayGlyph, PipedriveGlyph, ChatGptGlyph, UserGlyph } from './glyphs'
import { LIGHT, TAG_COLORS, HL } from './palette'

const POSITIVE = 'var(--positive)'
const NEG = '#e5484d'
type Tint = 'pos' | 'neg' | 'neu'

function paint(tint: Tint): string {
  if (tint === 'pos') return HL.pos
  if (tint === 'neg') return HL.neg
  return HL.neu
}

type Card = { rank: string; name: string; Glyph: (p: { size?: number; style?: React.CSSProperties }) => ReactNode; body: string; hl: { text: string; tint: Tint }[] }
const CARDS: Card[] = [
  {
    rank: '#1',
    name: 'Monday',
    Glyph: MondayGlyph,
    body:
      'Monday offers a strong free tier with contact management, email tracking, reporting and integrations with many integrations. It easily expands into Sales, Marketing, or Service Hubs as you grow. Paid plans can become expensive, and some advanced features are locked behind higher tiers.',
    hl: [
      { text: 'strong free tier', tint: 'pos' },
      { text: 'integrations with many integrations', tint: 'pos' },
      { text: 'easily expands', tint: 'pos' },
      { text: 'Paid plans can become expensive, and some advanced features are locked', tint: 'neg' }
    ]
  },
  {
    rank: '#2',
    name: 'Pipedrive',
    Glyph: PipedriveGlyph,
    body:
      "Pipedrive is a flexible modern CRM that works like a relational database, letting you design pipelines, views, and workflows around your process. It's highly customizable and connects with tools like Slack, Notion, and Segment. Pipedrive is ideal for teams that want power and flexibility without the complexity or cost of traditional CRMs.",
    hl: [
      { text: 'flexible modern CRM', tint: 'neu' },
      { text: 'highly customizable', tint: 'neu' },
      { text: 'power and flexibility', tint: 'neu' }
    ]
  }
]

const TAGS = ['Company Size: Startup', 'Industry: SaaS', 'Use Case: CRM', 'Buyer Persona: Founder', 'Intent: Easiest', 'Perception: Easy to use', 'Perception (Negative): Expensive']

const DRIVERS = [
  { label: 'Easy to use', pct: 38 },
  { label: 'Fast implementation', pct: 31 },
  { label: 'Good support', pct: 24 },
  { label: 'Affordable', pct: 22 },
  { label: 'Scalable', pct: 18 }
]
const GAPS2 = [
  { label: 'Enterprise-focused', you: 5, leader: 31 },
  { label: 'Most secure', you: 6, leader: 28 },
  { label: 'Scalable', you: 7, leader: 28 },
  { label: 'Advanced reporting', you: 8, leader: 22 },
  { label: 'Integrations', you: 9, leader: 25 }
]
const GAPS1 = [
  { label: 'Enterprise-focused', pct: 42 },
  { label: 'Most secure', pct: 28 },
  { label: 'Scalable', pct: 22 },
  { label: 'Advanced reporting', pct: 20 },
  { label: 'Integrations', pct: 18 }
]

// Total highlight count across all cards, for sequential brush stagger.
const HL_TOTAL = CARDS.reduce((n, c) => n + c.hl.length, 0)
const HL_OFFSET = CARDS.map((_, i) => CARDS.slice(0, i).reduce((n, c) => n + c.hl.length, 0))

export function MockPerception({ show }: { show: boolean }) {
  const play = useReveal(show)
  const reduced = useReducedMotion()
  const typed = useTypewriter('What is the best CRM for a growing SaaS company with 50 employees?', play, 38)
  const cards = useStagger(CARDS.length, play, 180, 1100)
  const brush = useStagger(HL_TOTAL, play, 150, 1500)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        ...LIGHT,
        containerType: 'size',
        background: 'var(--white)',
        color: 'var(--ink)',
        fontFamily: 'var(--font-body-reg, var(--font-body))',
        overflow: 'hidden',
        padding: '2cqw 2.2cqw',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2cqw'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2cqw' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.9cqw', fontWeight: 600, letterSpacing: '0.02em' }}>Brand Perception</div>
          <div style={{ marginTop: '0.5cqw', fontSize: '1.05cqw', color: 'var(--ink-60)', maxWidth: '70cqw' }}>
            Understand how AI perceives your brand across audiences, industries, and use cases — and uncover the drivers shaping that perception.
          </div>
        </div>
        <RangeToggle />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: '1.6cqw', flex: 1, minHeight: 0 }}>
        {/* LEFT feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1cqw', minHeight: 0, overflow: 'hidden' }}>
          {/* Prompt card */}
          <div style={{ display: 'flex', gap: '0.8cqw', alignItems: 'flex-start', background: 'var(--subtle)', border: '1px solid var(--line)', borderRadius: '1cqw', padding: '1cqw 1.2cqw' }}>
            <UserGlyph size={14} style={{ color: 'var(--ink-60)', marginTop: '0.2cqw' }} />
            <span style={{ fontSize: '1.25cqw', fontWeight: 600, lineHeight: 1.4 }}>
              {typed.text}
              {!typed.done && !reduced && <Caret />}
            </span>
          </div>
          {/* Thinking card */}
          <div style={{ display: 'flex', gap: '0.8cqw', alignItems: 'center', border: '1px solid var(--line)', borderRadius: '1cqw', padding: '1cqw 1.2cqw', minHeight: '3.4cqw' }}>
            <ChatGptGlyph size={15} style={{ color: 'var(--ink-70)' }} />
            {!cards[0] && !reduced && <ThinkingDots />}
          </div>
          {/* Brand cards */}
          {CARDS.map((c, ci) => (
            <div
              key={c.name}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '1cqw',
                padding: '1cqw 1.2cqw',
                opacity: cards[ci] ? 1 : 0,
                transform: cards[ci] ? 'none' : 'translateY(1.2cqw)',
                transition: reduced ? 'none' : `opacity 0.5s ${cb}, transform 0.5s ${cb}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7cqw', marginBottom: '0.6cqw' }}>
                <span style={{ fontSize: '0.95cqw', fontWeight: 600, color: 'var(--ink-50)', padding: '0.15cqw 0.6cqw', border: '1px solid var(--line)', borderRadius: '0.5cqw' }}>{c.rank}</span>
                <c.Glyph size={15} style={{ color: 'var(--ink-70)' }} />
                <span style={{ fontSize: '1.35cqw', fontWeight: 700 }}>{c.name}</span>
              </div>
              <p style={{ margin: 0, fontSize: '1.05cqw', lineHeight: 1.5, color: 'var(--ink-80, var(--ink))' }}>
                <Highlighted body={c.body} hl={c.hl} baseIndex={HL_OFFSET[ci]} brush={brush} />
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5cqw', marginTop: '0.8cqw' }}>
                {TAGS.map((t) => {
                  const c = TAG_COLORS[t] || { bg: 'var(--subtle)', fg: 'var(--ink-60)' }
                  return (
                    <span key={t} style={{ fontSize: '0.9cqw', color: c.fg, background: c.bg, borderRadius: '0.5cqw', padding: '0.15cqw 0.6cqw' }}>
                      {t}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1cqw', minHeight: 0, overflow: 'hidden' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5cqw', fontWeight: 700, letterSpacing: '0.1em' }}>AI VISIBILITY INSIGHTS</div>
            <div style={{ marginTop: '0.4cqw', fontSize: '1cqw', color: 'var(--ink-60)' }}>Insights based on 12,540 prompts across 6 AI engines</div>
          </div>

          <SideCard title="TOP PERCEPTION DRIVERS">
            {DRIVERS.map((d, i) => (
              <DriverRow key={d.label} label={d.label} pct={d.pct} play={play} delay={i} positive />
            ))}
          </SideCard>

          <SideCard title="PERCEPTION GAPS" sub="(vs category leaders)" cols>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2.2cqw', fontSize: '0.9cqw', color: 'var(--ink-50)', marginBottom: '0.4cqw' }}>
              <span>You</span>
              <span>Leader</span>
            </div>
            {GAPS2.map((g) => (
              <div key={g.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1cqw', padding: '0.25cqw 0' }}>
                <span style={{ color: NEG, background: 'rgba(229,72,77,0.12)', borderRadius: '0.4cqw', padding: '0.1cqw 0.5cqw' }}>{g.label}</span>
                <span style={{ display: 'flex', gap: '2.2cqw', fontVariantNumeric: 'tabular-nums' }}>
                  <span style={{ width: '3cqw', textAlign: 'right', color: 'var(--ink-70)' }}>{g.you}%</span>
                  <span style={{ width: '3cqw', textAlign: 'right', fontWeight: 600 }}>{g.leader}%</span>
                </span>
              </div>
            ))}
          </SideCard>

          <SideCard title="PERCEPTION GAPS" sub="(vs category leaders)">
            {GAPS1.map((g) => (
              <div key={g.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1cqw', padding: '0.25cqw 0' }}>
                <span style={{ color: 'var(--ink-70)' }}>{g.label}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{g.pct}%</span>
              </div>
            ))}
          </SideCard>
        </div>
      </div>
    </div>
  )
}

function Highlighted({ body, hl, baseIndex, brush }: { body: string; hl: { text: string; tint: Tint }[]; baseIndex: number; brush: boolean[] }) {
  const reduced = useReducedMotion()
  const segs: { t: string; tint?: Tint; gi?: number }[] = []
  let rest = body
  let gi = baseIndex
  for (const h of hl) {
    const idx = rest.indexOf(h.text)
    if (idx === -1) continue
    if (idx > 0) segs.push({ t: rest.slice(0, idx) })
    segs.push({ t: h.text, tint: h.tint, gi: gi++ })
    rest = rest.slice(idx + h.text.length)
  }
  if (rest) segs.push({ t: rest })
  return (
    <>
      {segs.map((s, i) =>
        s.tint ? (
          <span key={i} style={{ position: 'relative', display: 'inline', borderRadius: '0.3cqw' }}>
            <span
              aria-hidden
              style={{
                position: 'absolute',
                inset: '-0.1cqw -0.2cqw',
                background: paint(s.tint),
                borderRadius: '0.3cqw',
                clipPath: brush[s.gi as number] ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                transition: reduced ? 'none' : `clip-path 0.35s ${cb}`,
                zIndex: 0
              }}
            />
            <span style={{ position: 'relative', zIndex: 1 }}>{s.t}</span>
          </span>
        ) : (
          <span key={i}>{s.t}</span>
        )
      )}
    </>
  )
}

function DriverRow({ label, pct, play, delay, positive }: { label: string; pct: number; play: boolean; delay: number; positive?: boolean }) {
  const reduced = useReducedMotion()
  const n = useCountUp(pct, play, { durationMs: 700, startMs: 1500 + delay * 80 })
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1cqw', padding: '0.3cqw 0' }}>
      <span style={{ fontSize: '1cqw', color: positive ? POSITIVE : 'var(--ink-70)', background: positive ? 'var(--positive-bg)' : 'transparent', borderRadius: '0.4cqw', padding: positive ? '0.1cqw 0.5cqw' : 0 }}>{label}</span>
      <span style={{ flex: 1, height: '0.8cqw', borderRadius: '999px', background: 'var(--ink-10, rgba(255,255,255,0.1))', overflow: 'hidden', maxWidth: '12cqw' }}>
        <span
          style={{
            display: 'block',
            height: '100%',
            width: `${pct * 2}%`,
            background: 'var(--ink-40)',
            transformOrigin: 'left center',
            transform: play ? 'scaleX(1)' : 'scaleX(0)',
            transition: reduced ? 'none' : `transform 0.6s ${cb} ${1.5 + delay * 0.08}s`
          }}
        />
      </span>
      <span style={{ fontSize: '1cqw', fontVariantNumeric: 'tabular-nums', width: '3cqw', textAlign: 'right' }}>{n}%</span>
    </div>
  )
}

function SideCard({ title, sub, children, cols }: { title: string; sub?: string; children: ReactNode; cols?: boolean }) {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: '1cqw', padding: '1cqw 1.2cqw' }}>
      <div style={{ marginBottom: '0.6cqw' }}>
        <span style={{ fontSize: '1.1cqw', fontWeight: 700, color: 'var(--ink)' }}>{title}</span>
        {sub && <span style={{ fontSize: '0.9cqw', color: 'var(--ink-50)', marginLeft: '0.5cqw' }}>{sub}</span>}
      </div>
      {children}
    </div>
  )
}

function Caret() {
  const reduced = useReducedMotion()
  return (
    <span style={{ display: 'inline-block', width: '0.15cqw', height: '1.1em', background: 'var(--ink)', marginLeft: '0.15cqw', verticalAlign: 'text-bottom', animation: reduced ? 'none' : 'clvCaret 1s step-end infinite' }}>
      <style>{'@keyframes clvCaret{50%{opacity:0}}'}</style>
    </span>
  )
}

function ThinkingDots() {
  const reduced = useReducedMotion()
  return (
    <span style={{ display: 'inline-flex', gap: '0.5cqw' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: '0.8cqw', height: '0.8cqw', borderRadius: '999px', background: 'var(--ink-40)', animation: reduced ? 'none' : `clvThink 1s ease-in-out ${i * 0.16}s infinite` }} />
      ))}
      <style>{'@keyframes clvThink{0%,100%{opacity:0.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-0.3cqw)}}'}</style>
    </span>
  )
}

function RangeToggle() {
  const opts = ['7d', '30d', '90d']
  return (
    <div style={{ display: 'flex', gap: '0.4cqw', padding: '0.4cqw', borderRadius: '999px', background: 'var(--subtle)', border: '1px solid var(--line)', fontSize: '1cqw' }}>
      {opts.map((o) => (
        <span key={o} style={{ padding: '0.35cqw 1cqw', borderRadius: '999px', background: o === '30d' ? 'var(--ink)' : 'transparent', color: o === '30d' ? 'var(--white)' : 'var(--ink-50)', fontWeight: o === '30d' ? 600 : 500 }}>
          {o}
        </span>
      ))}
    </div>
  )
}

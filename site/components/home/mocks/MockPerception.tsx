'use client'

// Pillar 2 — "Brand Perception" dashboard. Coded (no raster).
// Left feed (prompt -> thinking -> 3 ranked brand cards with brush-paint
// highlights) + right insights sidebar.

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'
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

// Lighter band colour for the sweeping sheen on each highlight.
function sheen(tint: Tint): string {
  if (tint === 'pos') return '#eafbf1'
  if (tint === 'neg') return '#fdeaea'
  return '#fef8d2'
}

const INTRO =
  "Choosing the right CRM really comes down to how your startup sells, grows, and automates. Here's a curated breakdown of the top CRM platforms for startups in 2025."

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
      { text: 'integrations with many integrations', tint: 'neu' },
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
      { text: 'flexible modern CRM', tint: 'pos' },
      { text: 'highly customizable', tint: 'pos' },
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
const HL_OFFSET = CARDS.map((_, i) => CARDS.slice(0, i).reduce((n, c) => n + c.hl.length, 0))

// Small sentiment note per highlight (global order: Monday 0-3, Pipedrive 4-6).
const NOTES: { tone: Tint; score: number; desc: string }[] = [
  { tone: 'pos', score: 95, desc: 'Generous free tier — a key strength for early teams.' },
  { tone: 'neu', score: 78, desc: 'Broad integration ecosystem noted as flexible.' },
  { tone: 'pos', score: 88, desc: 'Scales smoothly into Sales, Marketing & Service.' },
  { tone: 'neg', score: 32, desc: 'Pricing & feature-gating flagged as the drawback.' },
  { tone: 'pos', score: 84, desc: 'Flexible, modern, pipeline-first CRM.' },
  { tone: 'pos', score: 86, desc: 'Strong customization across pipelines & views.' },
  { tone: 'neu', score: 75, desc: 'Power and flexibility without heavy complexity.' }
]

export function MockPerception({ show }: { show: boolean }) {
  const play = useReveal(show)
  const reduced = useReducedMotion()
  const typed = useTypewriter('What is the best CRM for a growing SaaS company with 50 employees?', play, 38)
  const cards = useStagger(CARDS.length, play, 180, 1100)
  const answer = useTypewriter(INTRO, cards[0], 55)
  const rootRef = useRef<HTMLDivElement>(null)
  const [noteIdx, setNoteIdx] = useState(0)
  const [notePos, setNotePos] = useState<{ left: number; top: number } | null>(null)
  const noteTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cycle a small sentiment note across the highlights, never stopping.
  useEffect(() => {
    if (!play || reduced) {
      setNotePos(null)
      return
    }
    let i = 0
    setNoteIdx(0)
    const startT = setTimeout(() => {
      noteTimer.current = setInterval(() => {
        i = (i + 1) % NOTES.length
        setNoteIdx(i)
      }, 2800)
    }, 1200)
    return () => {
      clearTimeout(startT)
      if (noteTimer.current) clearInterval(noteTimer.current)
    }
  }, [play, reduced])

  // Anchor the small note to its highlight — placed ABOVE it (fallback below),
  // clamped inside the dashboard, so it sits in line-gap whitespace and never
  // blankets the paragraph.
  useEffect(() => {
    if (!play || reduced) return
    const root = rootRef.current
    if (!root) return
    const el = root.querySelector(`[data-note-idx="${noteIdx}"]`) as HTMLElement | null
    if (!el) {
      setNotePos(null)
      return
    }
    const rr = root.getBoundingClientRect()
    const hr = el.getBoundingClientRect()
    const noteW = Math.min(260, rr.width * 0.26)
    const noteH = rr.width * 0.105
    let left = hr.left - rr.left + hr.width / 2 - noteW / 2
    left = Math.max(6, Math.min(left, rr.width - noteW - 6))
    let top = hr.top - rr.top - noteH - 7
    if (top < 6) top = hr.bottom - rr.top + 7
    setNotePos({ left, top })
  }, [noteIdx, play, reduced])

  return (
    <div
      ref={rootRef}
      style={{
        width: '100%',
        height: '100%',
        ...LIGHT,
        position: 'relative',
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
          {/* AI response card — thinks, then types the answer */}
          <div style={{ display: 'flex', gap: '0.8cqw', alignItems: 'flex-start', border: '1px solid var(--line)', borderRadius: '1cqw', padding: '1cqw 1.2cqw', minHeight: '3.4cqw' }}>
            <ChatGptGlyph size={15} style={{ marginTop: '0.2cqw', flexShrink: 0 }} />
            {cards[0] || reduced ? (
              <span style={{ fontSize: '1.1cqw', lineHeight: 1.5, color: 'var(--ink-80, var(--ink))' }}>
                {answer.text}
                {!answer.done && !reduced && <Caret />}
              </span>
            ) : (
              <ThinkingDots />
            )}
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
                <Highlighted body={c.body} hl={c.hl} baseIndex={HL_OFFSET[ci]} />
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
      {notePos && play && !reduced && <SentimentNote key={noteIdx} idx={noteIdx} left={notePos.left} top={notePos.top} />}
    </div>
  )
}

function SentimentNote({ idx, left, top }: { idx: number; left: number; top: number }) {
  const n = NOTES[idx]
  const bar = n.tone === 'neg' ? '#f5616a' : n.tone === 'neu' ? '#f5a623' : '#3fcf6e'
  const title = n.tone === 'neg' ? 'Negative' : n.tone === 'neu' ? 'Neutral' : 'Positive'
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: '26cqw',
        maxWidth: 260,
        zIndex: 30,
        background: '#18181c',
        color: '#fff',
        borderRadius: '0.9cqw',
        boxShadow: '0 10px 26px rgba(0,0,0,0.32)',
        padding: '0.7cqw 0.9cqw',
        pointerEvents: 'none',
        animation: `clvNotePop 0.4s ${cb} both`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6cqw' }}>
        <span style={{ width: '0.35cqw', height: '1.2cqw', borderRadius: 2, background: bar }} />
        <span style={{ fontSize: '0.95cqw', fontWeight: 600, letterSpacing: '0.02em' }}>{title} Sentiment</span>
        <span style={{ marginLeft: 'auto', fontSize: '1.15cqw', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{n.score}</span>
      </div>
      <p style={{ margin: '0.5cqw 0 0', fontSize: '0.88cqw', lineHeight: 1.4, color: 'rgba(255,255,255,0.7)' }}>{n.desc}</p>
      <style>{'@keyframes clvNotePop{from{opacity:0;transform:translateY(0.7cqw) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}'}</style>
    </div>
  )
}

function Highlighted({ body, hl, baseIndex }: { body: string; hl: { text: string; tint: Tint }[]; baseIndex: number }) {
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
      {/* Sweeping sheen across the highlight fill — uses background-position so
          it works across line wraps (box-decoration-break: clone). Never stops. */}
      <style>{'@keyframes clvSheenBg{0%{background-position:125% 0}55%{background-position:-25% 0}100%{background-position:-25% 0}}'}</style>
      {segs.map((s, i) => {
        if (!s.tint) return <span key={i}>{s.t}</span>
        const gi = s.gi as number
        // Highlight is painted directly on the inline text (not an absolute
        // overlay) so it covers EVERY line fragment when the phrase wraps.
        const style: CSSProperties = {
          color: 'inherit',
          borderRadius: '0.35cqw',
          padding: '0.04em 0.18em',
          WebkitBoxDecorationBreak: 'clone',
          boxDecorationBreak: 'clone',
          ...(reduced
            ? { backgroundColor: paint(s.tint) }
            : {
                backgroundImage: `linear-gradient(110deg, ${paint(s.tint)} 38%, ${sheen(s.tint)} 50%, ${paint(s.tint)} 62%)`,
                backgroundSize: '250% 100%',
                backgroundRepeat: 'no-repeat',
                animation: `clvSheenBg 3.2s ease-in-out ${(gi % 7) * 0.45}s infinite`
              })
        }
        return (
          <span key={i} data-note-idx={gi} style={style}>
            {s.t}
          </span>
        )
      })}
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

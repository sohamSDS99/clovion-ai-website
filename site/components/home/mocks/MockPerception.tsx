'use client'

// Pillar 2 — "Brand Perception" dashboard. Coded (no raster).
// Choreographed once-through reveal: prompt types -> Monday card types ->
// Pipedrive card types -> highlights paint in one by one -> 4 attribute notes
// pop -> right "AI Visibility Insights" sidebar types/reveals in. Plays once.

import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import { cb, useReducedMotion, useReveal, useCountUp, useTypewriter } from './motion'
import { MondayGlyph, PipedriveGlyph, UserGlyph } from './glyphs'
import { LIGHT, HL } from './palette'

const POSITIVE = 'var(--positive)'
const NEG = '#e5484d'
type Tint = 'pos' | 'neg' | 'neu'

function paint(tint: Tint): string {
  if (tint === 'pos') return HL.pos
  if (tint === 'neg') return HL.neg
  return HL.neu
}

const PROMPT = 'What is the best CRM for a growing SaaS company with 50 employees?'

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
      "Pipedrive is a flexible modern CRM that works like a relational database, letting you design pipelines, views, and workflows around your process. It's highly customizable and connects with tools like Slack, Notion, and Segment. Pipedrive is ideal for teams that want power and flexibility without the complexity or cost of traditional CRM.",
    hl: [
      { text: 'flexible modern CRM', tint: 'pos' },
      { text: 'highly customizable', tint: 'pos' },
      { text: 'power and flexibility', tint: 'neu' }
    ]
  }
]

// Black attribute notes per card, each anchored beside a highlight (by local
// highlight index) and placed above/below it. Pop once.
type CardNote = { text: string; hl: number; place: 'above' | 'below' }
const CARD_NOTES: CardNote[][] = [
  // Monday — hl: 0 strong free tier · 1 integrations · 2 easily expands · 3 Paid plans…locked
  [
    { text: 'Industry: SaaS', hl: 0, place: 'above' },
    { text: 'Buyer Persona: Founder', hl: 3, place: 'below' }
  ],
  // Pipedrive — hl: 0 flexible modern CRM · 1 highly customizable · 2 power and flexibility
  [
    { text: 'Buyer Persona: Founder', hl: 0, place: 'above' },
    { text: 'Perception: Easy to use', hl: 2, place: 'below' }
  ]
]

const DRIVERS = [
  { label: 'Easy to use', pct: 38 },
  { label: 'Fast implementation', pct: 31 },
  { label: 'Good support', pct: 24 }
]
const GAPS2 = [
  { label: 'Enterprise-focused', you: 5, leader: 31 },
  { label: 'Most secure', you: 6, leader: 28 },
  { label: 'Scalable', you: 7, leader: 28 }
]
// Highlight base index per card, for the global sequential paint stagger.
const HL_OFFSET = CARDS.map((_, i) => CARDS.slice(0, i).reduce((n, c) => n + c.hl.length, 0))
const HL_STEP = 0.24 // s between highlight paints (sequential)
const NOTES_GATE_MS = 1500 // notes begin while the highlight paint is finishing
const SIDE_GATE_MS = 750 // sidebar begins shortly after the notes pop

export function MockPerception({ show }: { show: boolean }) {
  const play = useReveal(show)
  const reduced = useReducedMotion()

  // Phases driven by a single setTimeout timeline (deterministic — not chained
  // on rAF completion): 0 prompt · 1 Monday · 2 Pipedrive · 3 highlights ·
  // 4 notes · 5 sidebar.
  const [phase, setPhase] = useState(0)
  useEffect(() => {
    if (!play) return
    if (reduced) {
      setPhase(5)
      return
    }
    const promptMs = Math.ceil((PROMPT.length / 48) * 1000) + 250
    const mondayMs = Math.ceil((CARDS[0].body.length / 170) * 1000) + 250
    const pipeMs = Math.ceil((CARDS[1].body.length / 170) * 1000) + 250
    const t1 = promptMs
    const t2 = t1 + mondayMs
    const t3 = t2 + pipeMs + 150
    const t4 = t3 + NOTES_GATE_MS
    const t5 = t4 + SIDE_GATE_MS
    const timers = [
      setTimeout(() => setPhase(1), t1),
      setTimeout(() => setPhase(2), t2),
      setTimeout(() => setPhase(3), t3),
      setTimeout(() => setPhase(4), t4),
      setTimeout(() => setPhase(5), t5)
    ]
    return () => timers.forEach(clearTimeout)
  }, [play, reduced])

  const prompt = useTypewriter(PROMPT, play, 48)
  const mBody = useTypewriter(CARDS[0].body, phase >= 1, 170)
  const pBody = useTypewriter(CARDS[1].body, phase >= 2, 170)
  const sideHead = useTypewriter('PERCEPTION DRIVERS AND GAPS', phase >= 5, 32)

  const cardShown = [phase >= 1, phase >= 2]
  const bodyDone = [mBody.done, pBody.done]
  const bodyText = [mBody.text, pBody.text]
  const hlOn = phase >= 3
  const notesOn = phase >= 4
  const sideOn = phase >= 5

  return (
    <div
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
        gap: '1.4cqw'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2cqw' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.2cqw', fontWeight: 600, letterSpacing: '0.02em' }}>Brand Perception</div>
          <div style={{ marginTop: '0.6cqw', fontSize: '1.25cqw', color: 'var(--ink-60)', maxWidth: '70cqw' }}>
            Understand how AI perceives your brand across audiences, industries, and use cases — and uncover the drivers shaping that perception.
          </div>
        </div>
        <RangeToggle />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: '1.8cqw', flex: 1, minHeight: 0 }}>
        {/* LEFT feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2cqw', minHeight: 0, overflow: 'hidden' }}>
          {/* Prompt card */}
          <div style={{ display: 'flex', gap: '0.8cqw', alignItems: 'flex-start', background: 'var(--subtle)', border: '1px solid var(--line)', borderRadius: '1cqw', padding: '1.1cqw 1.2cqw' }}>
            <UserGlyph size={14} style={{ color: 'var(--ink-60)', marginTop: '0.2cqw' }} />
            <span style={{ fontSize: '1.5cqw', fontWeight: 600, lineHeight: 1.45 }}>
              {prompt.text}
              {!prompt.done && !reduced && <Caret />}
            </span>
          </div>

          {/* Brand cards — each with one black attribute note */}
          {CARDS.map((c, ci) => (
            <div
              key={c.name}
              style={{
                border: '1px solid var(--line)',
                borderRadius: '1cqw',
                padding: '1.4cqw 1.6cqw',
                marginTop: ci === 1 ? '1.1cqw' : 0,
                opacity: cardShown[ci] || reduced ? 1 : 0,
                transform: cardShown[ci] || reduced ? 'none' : 'translateY(1cqw)',
                transition: reduced ? 'none' : `opacity 0.45s ${cb}, transform 0.45s ${cb}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7cqw', marginBottom: '0.7cqw' }}>
                <span style={{ fontSize: '1.15cqw', fontWeight: 600, color: 'var(--ink-50)', padding: '0.15cqw 0.6cqw', border: '1px solid var(--line)', borderRadius: '0.5cqw' }}>{c.rank}</span>
                <c.Glyph size={18} style={{ color: 'var(--ink-70)' }} />
                <span style={{ fontSize: '1.75cqw', fontWeight: 700 }}>{c.name}</span>
              </div>
              <p style={{ margin: 0, fontSize: '1.42cqw', lineHeight: 1.62, color: 'var(--ink-80, var(--ink))' }}>
                {bodyDone[ci] || reduced ? (
                  <Highlighted body={c.body} hl={c.hl} baseIndex={HL_OFFSET[ci]} hlOn={hlOn} reduced={reduced} notes={CARD_NOTES[ci]} noteOn={notesOn} />
                ) : (
                  <>
                    {bodyText[ci]}
                    {!reduced && <Caret />}
                  </>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* RIGHT sidebar — a faint skeleton reserves the space during the
            build-up, then the real insights cross-fade / type in last. */}
        <div style={{ position: 'relative', minHeight: 0, overflow: 'hidden' }}>
          {!reduced && (
            <div aria-hidden style={{ position: 'absolute', inset: 0, opacity: sideOn ? 0 : 1, transition: `opacity 0.5s ${cb}`, pointerEvents: 'none' }}>
              <SidebarSkeleton />
            </div>
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1cqw',
              opacity: sideOn || reduced ? 1 : 0,
              transform: sideOn || reduced ? 'none' : 'translateY(0.6cqw)',
              transition: reduced ? 'none' : `opacity 0.55s ${cb}, transform 0.55s ${cb}`
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.55cqw', fontWeight: 700, letterSpacing: '0.08em', minHeight: '2cqw' }}>
                {reduced ? 'PERCEPTION DRIVERS AND GAPS' : sideHead.text}
                {sideOn && !sideHead.done && !reduced && <Caret />}
              </div>
              <div style={{ marginTop: '0.5cqw', fontSize: '1.2cqw', color: 'var(--ink-60)' }}>Insights based on 12,540 prompts across 6 AI engines</div>
            </div>

            <SideCard title="TOP PERCEPTION DRIVERS">
              {DRIVERS.map((d, i) => (
                <DriverRow key={d.label} label={d.label} pct={d.pct} run={sideOn} delay={i} positive />
              ))}
            </SideCard>

            <SideCard title="PERCEPTION GAPS" sub="(vs category leaders)">
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2.2cqw', fontSize: '1.05cqw', color: 'var(--ink-50)', marginBottom: '0.5cqw' }}>
                <span>You</span>
                <span>Leader</span>
              </div>
              {GAPS2.map((g) => (
                <div key={g.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.2cqw', padding: '0.35cqw 0' }}>
                  <span style={{ color: NEG, background: 'rgba(229,72,77,0.12)', borderRadius: '0.4cqw', padding: '0.15cqw 0.6cqw' }}>{g.label}</span>
                  <span style={{ display: 'flex', gap: '2.2cqw', fontVariantNumeric: 'tabular-nums' }}>
                    <span style={{ width: '3.4cqw', textAlign: 'right', color: 'var(--ink-70)' }}>{g.you}%</span>
                    <span style={{ width: '3.4cqw', textAlign: 'right', fontWeight: 600 }}>{g.leader}%</span>
                  </span>
                </div>
              ))}
            </SideCard>
          </div>
        </div>
      </div>
    </div>
  )
}

function Highlighted({ body, hl, baseIndex, hlOn, reduced, notes, noteOn }: { body: string; hl: { text: string; tint: Tint }[]; baseIndex: number; hlOn: boolean; reduced: boolean; notes?: CardNote[]; noteOn?: boolean }) {
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
      {segs.map((s, i) => {
        if (!s.tint) return <span key={i}>{s.t}</span>
        const g = s.gi as number
        const localIdx = g - baseIndex
        const spanNotes = (notes || []).filter((n) => n.hl === localIdx)
        const style: CSSProperties = {
          position: spanNotes.length ? 'relative' : undefined,
          color: 'inherit',
          borderRadius: '0.35cqw',
          padding: '0.04em 0.18em',
          WebkitBoxDecorationBreak: 'clone',
          boxDecorationBreak: 'clone',
          backgroundColor: hlOn || reduced ? paint(s.tint) : 'transparent',
          transition: reduced ? 'none' : `background-color 0.4s ${cb} ${g * HL_STEP}s`
        }
        return (
          <span key={i} style={style}>
            {s.t}
            {spanNotes.map((n, ni) => {
              const delay = n.hl * 0.1
              return (
                <span
                  key={ni}
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: 0,
                    ...(n.place === 'above' ? { bottom: 'calc(100% + 0.55cqw)' } : { top: 'calc(100% + 0.55cqw)' }),
                    whiteSpace: 'nowrap',
                    zIndex: 20,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5cqw',
                    background: '#18181c',
                    color: '#fff',
                    fontSize: '1cqw',
                    fontWeight: 600,
                    borderRadius: '0.6cqw',
                    padding: '0.4cqw 0.8cqw',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.28)',
                    pointerEvents: 'none',
                    opacity: noteOn || reduced ? 1 : 0,
                    transform:
                      noteOn || reduced
                        ? 'translateY(0) scale(1)'
                        : `translateY(${n.place === 'above' ? '0.5cqw' : '-0.5cqw'}) scale(0.9)`,
                    transition: reduced ? 'none' : `opacity 0.35s ${cb} ${delay}s, transform 0.45s cubic-bezier(0.34, 1.55, 0.5, 1) ${delay}s`
                  }}
                >
                  <span style={{ width: '0.6cqw', height: '0.6cqw', borderRadius: '999px', background: '#fff', opacity: 0.85, flexShrink: 0 }} />
                  {n.text}
                </span>
              )
            })}
          </span>
        )
      })}
    </>
  )
}

function DriverRow({ label, pct, run, delay, positive }: { label: string; pct: number; run: boolean; delay: number; positive?: boolean }) {
  const reduced = useReducedMotion()
  const n = useCountUp(pct, run, { durationMs: 650, startMs: 250 + delay * 80 })
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1cqw', padding: '0.3cqw 0' }}>
      <span style={{ fontSize: '1.2cqw', color: positive ? POSITIVE : 'var(--ink-70)', background: positive ? 'var(--positive-bg)' : 'transparent', borderRadius: '0.4cqw', padding: positive ? '0.15cqw 0.6cqw' : 0 }}>{label}</span>
      <span style={{ flex: 1, height: '0.8cqw', borderRadius: '999px', background: 'var(--ink-10, rgba(255,255,255,0.1))', overflow: 'hidden', maxWidth: '12cqw' }}>
        <span
          style={{
            display: 'block',
            height: '100%',
            width: `${pct * 2}%`,
            background: 'var(--ink-40)',
            transformOrigin: 'left center',
            transform: run ? 'scaleX(1)' : 'scaleX(0)',
            transition: reduced ? 'none' : `transform 0.6s ${cb} ${0.25 + delay * 0.08}s`
          }}
        />
      </span>
      <span style={{ fontSize: '1.2cqw', fontVariantNumeric: 'tabular-nums', width: '3.4cqw', textAlign: 'right' }}>{n}%</span>
    </div>
  )
}

function SidebarSkeleton() {
  const bar = (w: string, h = '1.1cqw') => <span style={{ display: 'block', width: w, height: h, borderRadius: '0.4cqw', background: 'rgba(10,10,15,0.07)' }} />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1cqw' }}>
      <div>
        {bar('14cqw', '1.7cqw')}
        <span style={{ display: 'block', marginTop: '0.5cqw' }}>{bar('20cqw', '1cqw')}</span>
      </div>
      {[0, 1].map((c) => (
        <div key={c} style={{ border: '1px solid var(--line)', borderRadius: '1cqw', padding: '1cqw 1.2cqw', display: 'flex', flexDirection: 'column', gap: '0.7cqw' }}>
          {bar('10cqw', '1.2cqw')}
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1cqw' }}>
              {bar('7cqw')}
              {bar('9cqw')}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function SideCard({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: '1cqw', padding: '1cqw 1.2cqw' }}>
      <div style={{ marginBottom: '0.6cqw' }}>
        <span style={{ fontSize: '1.35cqw', fontWeight: 700, color: 'var(--ink)' }}>{title}</span>
        {sub && <span style={{ fontSize: '1.05cqw', color: 'var(--ink-50)', marginLeft: '0.5cqw' }}>{sub}</span>}
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

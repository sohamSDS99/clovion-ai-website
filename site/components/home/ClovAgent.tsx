'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ArrowRight, Button, Container, HaloMark } from '@/components/ui'
import { RecoveryPlan } from './RecoveryPlan'

/* ----------------------------------------------------------------------------
 * ClovAgent — "Clove AI Agent" section. A single LOOPING choreography driven by
 * one timeline (state machine) coordinating both columns:
 *   1. logo   — the Clovion twin-chevron mark draws on (left→right wipe)
 *   2. question — the user question types into the chat
 *   3. thinking — "Thinking…" → "Thought for 163s"
 *   4. answer   — the reply types in
 *   5. chart    — the Visibility Recovery Plan card reveals
 * …then it loops. The chat WAITS for the logo to finish drawing before starting.
 * Pauses off-screen; frozen (all shown, no typing) under reduced motion.
 *
 * The right column is a CUSTOM-CODED iPad Pro (portrait, Space Black) — the chat
 * runs on the device screen. The screen reserves its full height from the first
 * frame so the device never resizes; only the content types/reveals inside.
 * -------------------------------------------------------------------------- */

const QUESTION =
  'Why did our AI visibility drop by 12% this month, and what are the three highest-impact actions we should take to recover it?'
const ANSWER =
  'Your visibility declined primarily because competitors increased coverage across comparison content, while mentions of your pricing and enterprise capabilities decreased. Focus on creating comparison content for your top competitors, strengthening pages covering enterprise use cases, and improving authority around pricing topics.'

const SEQ = ['logo', 'question', 'thinking', 'answer', 'chart'] as const
type Phase = 'idle' | (typeof SEQ)[number]
const DUR: Record<(typeof SEQ)[number], number> = { logo: 1750, question: 1950, thinking: 1500, answer: 2950, chart: 4400 }

const STYLES = `
.clv-agent-section { background: #FAF9F7; padding: var(--section) 0; }
.clv-agent-grid { display: grid; grid-template-columns: 1.04fr 1fr; column-gap: clamp(48px, 6vw, 96px); align-items: center; }
.clv-logo-wipe { display: inline-flex; color: var(--ink); animation: clvLogoWipe 1.65s cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes clvLogoWipe { from { clip-path: inset(0 100% 0 0); opacity: 0; } 55% { opacity: 1; } to { clip-path: inset(0 0 0 0); opacity: 1; } }
.clv-caret { display: inline-block; width: 2px; height: 1em; background: currentColor; margin-left: 3px; vertical-align: -0.14em; animation: clvCaret 1s step-end infinite; }
@keyframes clvCaret { 50% { opacity: 0; } }
/* iPad Pro (portrait, Space Black) */
.clv-ipad { position: relative; width: 100%; max-width: 528px; margin-inline: auto; padding: 13px; border-radius: 40px;
  background: linear-gradient(155deg, #2d2d33 0%, #17171b 52%, #0b0b0e 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.05), 0 50px 100px -40px rgba(10,10,15,0.55); }
.clv-ipad-cam { position: absolute; top: 4px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 999px; background: #08080a; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.14); }
.clv-ipad-screen { position: relative; border-radius: 28px; overflow: hidden; background: var(--white); box-shadow: inset 0 0 0 1px rgba(10,10,15,0.06); }
@media (prefers-reduced-motion: reduce) { .clv-logo-wipe { animation: none; clip-path: none; opacity: 1; } .clv-caret { animation: none; } }
@media (max-width: 900px) {
  .clv-agent-grid { grid-template-columns: 1fr; row-gap: 44px; }
  .clv-ipad { max-width: 400px; padding: 11px; border-radius: 34px; }
  .clv-ipad-screen { border-radius: 25px; }
}
/* Short/wide desktop viewports (16:9 laptops & external monitors): the portrait
   iPad + tall left column overflow the fold. zoom shrinks the device's layout box
   (not just its paint) so the whole section frames between the sticky header and
   the fold; tighter section padding reclaims the rest. ponytail: zoom is the only
   lever that shrinks height without reflowing the chat text taller. */
@media (min-width: 901px) and (max-height: 900px) {
  .clv-agent-section { padding: clamp(2rem, 5vh, 4rem) 0; }
  .clv-ipad { zoom: 0.86; }
}
@media (min-width: 901px) and (max-height: 760px) {
  .clv-ipad { zoom: 0.74; }
}
`

function useReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    setR(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])
  return r
}

// Types `text` from 0→full over `dur` when `active`; holds full afterward.
function useTyper(text: string, active: boolean, dur: number) {
  const [out, setOut] = useState('')
  useEffect(() => {
    if (!active) return
    const total = text.length
    if (!total) return
    let i = 0
    setOut('')
    const step = Math.max(14, Math.floor(dur / total))
    const id = setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= total) clearInterval(id)
    }, step)
    return () => clearInterval(id)
  }, [active, text, dur])
  return out
}

function Caret() {
  return <span className="clv-caret" aria-hidden />
}

/* iPadOS-style status bar */
function StatusBar() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 22px 4px' }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.01em', fontVariantNumeric: 'tabular-nums' }}>9:41</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: 'var(--ink)' }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden>
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.7" y="4.8" width="3" height="6.2" rx="1" />
          <rect x="9.4" y="2.4" width="3" height="8.6" rx="1" />
          <rect x="14" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden>
          <path d="M8 11l2.15-2.6a3.35 3.35 0 00-4.3 0L8 11z" />
          <path d="M8 5.5c1.06 0 2.03.4 2.77 1.05l1.35-1.45A6 6 0 008 4.35 6 6 0 003.88 5.1l1.35 1.45A4.1 4.1 0 018 5.5z" />
          <path d="M8 2.2c1.96 0 3.75.75 5.1 2l1.35-1.46A9.35 9.35 0 008 0 9.35 9.35 0 00.55 2.74L1.9 4.2A7.42 7.42 0 018 2.2z" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden>
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.45" />
          <rect x="2" y="2" width="16" height="8" rx="1.6" fill="currentColor" />
          <rect x="23" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  )
}

/* Chat app header (replaces the old mac window bar) */
function AppHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 18px 13px', borderBottom: '1px solid var(--line)' }}>
      <span style={{ height: 32, width: 32, flexShrink: 0, borderRadius: 999, background: 'var(--subtle)', border: '1px solid var(--line)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' }}>
        <HaloMark size={15} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.005em' }}>Clove AI</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-50)', marginTop: 2 }}>AI visibility assistant</span>
      </span>
      <span aria-hidden style={{ display: 'inline-flex', gap: 3 }}>
        {[0, 1, 2].map((k) => (
          <span key={k} style={{ height: 4, width: 4, borderRadius: 999, background: 'var(--ink-30)' }} />
        ))}
      </span>
    </div>
  )
}

// The chat messages (no chrome — the iPad screen + AppHeader provide the frame).
function AnimatedChat({ phase, reduced }: { phase: Phase; reduced: boolean }) {
  const vis = reduced ? SEQ.length : SEQ.indexOf(phase as (typeof SEQ)[number])
  const typedQ = useTyper(QUESTION, phase === 'question', DUR.question)
  const typedA = useTyper(ANSWER, phase === 'answer', DUR.answer)
  const qShown = reduced ? QUESTION : vis > SEQ.indexOf('question') ? QUESTION : typedQ
  const aShown = reduced ? ANSWER : vis > SEQ.indexOf('answer') ? ANSWER : typedA
  const qIdx = SEQ.indexOf('question')
  const tIdx = SEQ.indexOf('thinking')
  const aIdx = SEQ.indexOf('answer')
  const cIdx = SEQ.indexOf('chart')
  // reveal = fade/rise only (opacity + transform never change layout), so every
  // block stays mounted and the screen keeps its full size from the first frame.
  const reveal = (on: boolean): CSSProperties => ({
    opacity: on ? 1 : 0,
    transform: on ? 'none' : 'translateY(6px)',
    transition: reduced ? 'none' : 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
  })

  return (
    <div style={{ padding: '17px 18px 19px', display: 'flex', flexDirection: 'column', gap: 13 }}>
      {/* User question */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', ...reveal(reduced || vis >= qIdx) }}>
        <div style={{ maxWidth: '88%', background: 'var(--ink)', color: 'var(--on-ink)', borderRadius: '15px 15px 4px 15px', padding: '11px 14px', fontSize: '0.88rem', lineHeight: 1.45, fontWeight: 500 }}>
          {qShown}
          {phase === 'question' && <Caret />}
          <span aria-hidden style={{ color: 'transparent' }}>{QUESTION.slice(qShown.length)}</span>
        </div>
      </div>

      {/* Agent reply */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', ...reveal(reduced || vis >= tIdx) }}>
        <div style={{ height: 26, width: 26, flexShrink: 0, borderRadius: 999, background: 'var(--white)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ height: 7, width: 7, borderRadius: 999, background: 'var(--ink)' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-70)' }}>Clove AI</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--ink-50)' }}>
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 8v4.4l3 1.8" />
            </svg>
            {phase === 'thinking' ? 'Thinking…' : 'Thought for 163s'}
          </span>

          <p style={{ margin: '9px 0 0', fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--ink-70)', ...reveal(reduced || vis >= aIdx) }}>
            {aShown}
            {phase === 'answer' && <Caret />}
            <span aria-hidden style={{ color: 'transparent' }}>{ANSWER.slice(aShown.length)}</span>
          </p>

          <div style={{ marginTop: 15, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--white)', padding: '14px 15px 15px', ...reveal(reduced || vis >= cIdx) }}>
            <RecoveryPlan show={reduced || vis >= cIdx} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ClovAgent() {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [loop, setLoop] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => setInView(entries[0]?.isIntersecting ?? false), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced) {
      setPhase('chart')
      return
    }
    if (!inView) {
      setPhase('idle')
      return
    }
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []
    const run = () => {
      setLoop((l) => l + 1) // remount logo + chat → replay draw / reset typers
      setPhase('logo')
      let acc = 0
      for (const p of SEQ) {
        if (p === 'logo') {
          acc += DUR.logo
          continue
        }
        const at = acc
        timers.push(setTimeout(() => { if (!cancelled) setPhase(p) }, at))
        acc += DUR[p]
      }
      timers.push(setTimeout(() => { if (!cancelled) run() }, acc))
    }
    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [inView, reduced])

  return (
    <section ref={ref} data-track-location="home_clov_agent" className="clv-agent-section">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <Container>
        <div className="clv-agent-grid">
          {/* LEFT COLUMN */}
          <div style={{ maxWidth: 460 }}>
            <h2 style={{ marginTop: 0, marginBottom: 0, fontSize: 'clamp(2rem, 3.4vw, 3.1rem)', lineHeight: 1.06, letterSpacing: '-0.02em', color: 'var(--ink)', textWrap: 'balance', maxWidth: '20ch' }}>
              <span style={{ color: '#C2410C' }}>Clove</span>, your personal AI Agent.
            </h2>

            {/* Animated Clovion mark — draws on (left→right wipe), then holds; replays each loop */}
            <div style={{ marginTop: 40, marginBottom: 40, minHeight: 168, display: 'flex', alignItems: 'center' }}>
              <span key={loop} className="clv-logo-wipe" aria-label="Clovion" role="img">
                <HaloMark size={150} />
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '1.0625rem', lineHeight: 1.5, color: 'var(--ink-70)', maxWidth: '38ch', textWrap: 'balance' }}>
              Clove watches every AI answer about you, then tells you exactly what to fix.
            </p>

            <div style={{ marginTop: 32 }}>
              <Button href="/free-ai-visibility-score" variant="primary" size="lg" trackLocation="home_clov_agent">
                Meet Clove <ArrowRight />
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN — custom-coded iPad Pro (portrait, Space Black) running the chat */}
          <div className="clv-ipad">
            <span className="clv-ipad-cam" aria-hidden />
            <div className="clv-chat-island clv-ipad-screen">
              <StatusBar />
              <AppHeader />
              <AnimatedChat key={loop} phase={phase} reduced={reduced} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default ClovAgent

'use client'

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { Button, Container, ArrowRight, HaloMark } from '@/components/ui'
import { LIGHT } from './mocks/palette'

const HERO_LOGOS = [
  { src: '/logos/chatgpt.svg', alt: 'ChatGPT' },
  { src: '/logos/claude.svg', alt: 'Claude' },
  { src: '/logos/gemini.svg', alt: 'Gemini' },
  { src: '/logos/perplexity.svg', alt: 'Perplexity' },
  { src: '/logos/grok-icon.svg', alt: 'Grok' },
  { src: '/logos/google-ai.svg', alt: 'Google AI Overviews' }
]

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

// Left panel — citation-score bars, each brand-tinted with a vibrant gradient.
const BARS = [
  { key: 'microsoft', h: 100, from: '#8a8f98', to: '#8a8f98' },
  { key: 'monday', h: 74, from: '#22c55e', to: '#22c55e' },
  { key: 'check', h: 80, from: '#f59e0b', to: '#f59e0b' },
  { key: 'atlassian', h: 62, from: '#7c6cf5', to: '#7c6cf5' },
  { key: 'asana', h: 55, from: '#22c55e', to: '#22c55e' }
]

// Right panel — citation categories (legend order).
const CATS = [
  { label: 'Other', pct: 82, count: '13,492', color: '#8a8f98' },
  { label: 'Social', pct: 10, count: '1,699', color: '#7c6cf5' },
  { label: 'Owned', pct: 7, count: '1,168', color: '#22c55e' },
  { label: 'Earned media', pct: 1, count: '183', color: '#f59e0b' }
]
// Donut draw order (indices into CATS), clockwise from top: colored arcs first,
// grey "Other" fills the rest.
const DONUT_ORDER = [1, 2, 3, 0]

export function HomeHero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.5,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, transparent 70%)'
        }}
      />
      <Container className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--display-xl)',
              fontWeight: 600,
              letterSpacing: 'var(--track-display-xl)',
              lineHeight: 1.08,
              margin: 0
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.28em',
                flexWrap: 'wrap'
              }}
            >
              <span>See how AI</span>
              <RotatingLogo />
            </span>
            <span style={{ display: 'block' }}>sees your brand</span>
          </h1>

          <p
            style={{
              fontSize: 'var(--text-lead)',
              lineHeight: 1.55,
              color: 'var(--ink-70)',
              maxWidth: 640,
              margin: '1.75rem auto 0',
              textWrap: 'balance'
            }}
          >
            Track your brand&rsquo;s visibility across AI engines and find the gaps stopping you from getting mentioned.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="home_hero">
              Start Free Trial <ArrowRight />
            </Button>
            <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="home_hero">
              Get Free Score
            </Button>
          </div>
          <p
            className="mt-5 text-[0.85rem]"
            style={{ color: 'var(--ink-50)' }}
          >
            Free score takes 60 seconds · No login required · No credit card
          </p>
        </div>

        <div className="mt-12 md:mt-20 max-w-6xl mx-auto -mx-4 md:mx-auto px-4 md:px-0 overflow-x-auto md:overflow-visible">
          <div className="min-w-[880px] md:min-w-0">
            <HeroBento />
          </div>
        </div>
      </Container>
    </section>
  )
}

function RotatingLogo() {
  const N = HERO_LOGOS.length
  const [i, setI] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const t = setInterval(() => setI((v) => (v + 1) % N), 2000)
    return () => clearInterval(t)
  }, [N])

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        height: '0.96em',
        margin: '0 0.18em'
      }}
    >
      {HERO_LOGOS.map((logo, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={idx}
          src={logo.src}
          alt={idx === i ? logo.alt : ''}
          style={{
            height: '0.92em',
            width: 'auto',
            display: 'block',
            position: idx === 0 ? 'relative' : 'absolute',
            left: idx === 0 ? 'auto' : '50%',
            top: '50%',
            transform: idx === 0 ? 'translateY(-50%)' : 'translate(-50%, -50%)',
            filter: 'var(--logo-filter, brightness(0))',
            opacity: idx === i ? 1 : 0,
            transition: 'opacity 0.55s ease'
          }}
        />
      ))}
    </span>
  )
}

function useCountUp(target: number, run: boolean, ms = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / ms)
      setV(Number(((1 - Math.pow(1 - t, 3)) * target).toFixed(1)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target, ms])
  return v
}

function useCountInt(target: number, run: boolean, ms = 1600) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / ms)
      setV(Math.round((1 - Math.pow(1 - t, 3)) * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target, ms])
  return v
}

function HeroBento() {
  const rootRef = useRef<HTMLDivElement>(null)
  const hasRunRef = useRef(false)
  const [on, setOn] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setReduced(true)
      hasRunRef.current = true
      setOn(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !hasRunRef.current) {
            hasRunRef.current = true
            setOn(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <div
        style={{
          ...LIGHT,
          position: 'relative',
          borderRadius: 24,
          border: '1px solid var(--line)',
          background: 'var(--white)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
          overflow: 'hidden'
        }}
      >
        {/* App chrome top bar */}
        <div style={{ height: 48, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
              <span key={c} style={{ height: 12, width: 12, borderRadius: 999, background: c }} />
            ))}
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-50)' }}>
            Workspaces / Clovion AI / Citations
          </div>
          <div style={{ width: 24 }} />
        </div>

        {/* Two panels in one frame */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1.15fr' }}>
          <div style={{ padding: 28, minWidth: 0 }}>
            <CitationScore on={on} reduced={reduced} />
          </div>
          <div aria-hidden style={{ background: 'var(--line)' }} />
          <div style={{ padding: 28, minWidth: 0 }}>
            <CitationCategories on={on} reduced={reduced} />
          </div>
        </div>

        {/* Fade the dashboard to white around the floating composer, so the
            card emerges from a bright mist (whiter shade, not a dark dim). */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(72% 52% at 50% 110%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.72) 40%, rgba(255,255,255,0) 72%)',
            opacity: on ? 1 : 0,
            transition: reduced ? 'none' : `opacity 0.6s ${EASE} 1.1s`,
            pointerEvents: 'none',
            zIndex: 5
          }}
        />
      </div>

      <Composer on={on} reduced={reduced} />
    </div>
  )
}

const LINES = ['Ask Clovion AI', 'Ask about your AI visibility']

// Types each line, holds, erases, then moves to the next — looping forever.
function useTypeLines(run: boolean, reduced: boolean) {
  const [text, setText] = useState('')
  useEffect(() => {
    if (!run) return
    if (reduced) {
      setText(LINES[1])
      return
    }
    let p = 0
    let i = 0
    let mode: 'type' | 'hold' | 'erase' = 'type'
    let timer: ReturnType<typeof setTimeout>
    const step = () => {
      const full = LINES[p]
      if (mode === 'type') {
        i += 1
        setText(full.slice(0, i))
        if (i >= full.length) {
          mode = 'hold'
          timer = setTimeout(step, 1500)
          return
        }
        timer = setTimeout(step, 55 + Math.random() * 45)
      } else if (mode === 'hold') {
        mode = 'erase'
        timer = setTimeout(step, 30)
      } else {
        i -= 1
        setText(full.slice(0, i))
        if (i <= 0) {
          p = (p + 1) % LINES.length
          mode = 'type'
          timer = setTimeout(step, 420)
          return
        }
        timer = setTimeout(step, 24)
      }
    }
    timer = setTimeout(step, 700)
    return () => clearTimeout(timer)
  }, [run, reduced])
  return text
}

function Composer({ on, reduced }: { on: boolean; reduced: boolean }) {
  const typed = useTypeLines(on, reduced)
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: -26,
        zIndex: 20,
        width: 510,
        maxWidth: '92%',
        pointerEvents: 'none',
        opacity: on ? 1 : 0,
        transform: `translate(-50%, ${on ? '0' : '28px'}) scale(${on ? 1 : 0.96})`,
        transition: reduced ? 'none' : `opacity 0.6s ${EASE} 1.2s, transform 0.75s ${EASE} 1.2s`
      }}
    >
      <div style={{ animation: reduced || !on ? 'none' : 'clvComposerFloat 5.5s ease-in-out 2s infinite' }}>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: 13,
            background: '#ffffff',
            borderRadius: 22,
            border: '1px solid rgba(10,10,15,0.08)',
            boxShadow: '0 26px 60px rgba(10,10,15,0.22), 0 4px 14px rgba(10,10,15,0.08)',
            padding: '14px 14px 14px 20px'
          }}
        >
          <div
            aria-hidden
            style={{ position: 'absolute', inset: '-22% -10% -34%', borderRadius: 34, background: 'radial-gradient(58% 60% at 50% 100%, rgba(124,108,245,0.16), transparent 70%)', filter: 'blur(16px)', zIndex: -1 }}
          />

          {/* Clovion mark inside the chatbox */}
          <span style={{ display: 'inline-flex', alignItems: 'center', color: '#0a0a0f', flexShrink: 0 }}>
            <HaloMark size={22} />
          </span>

          {/* Typewriter: cycles the two lines, caret at the end */}
          <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', fontSize: '1.05rem', fontWeight: 600, color: 'rgba(10,10,15,0.5)' }}>
            <span style={{ minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{typed}</span>
            {!reduced && (
              <span style={{ display: 'inline-block', width: 2.5, height: '1.3rem', marginLeft: 2, background: '#0a0a0f', borderRadius: 1, flexShrink: 0, animation: 'clvComposerCaret 1s step-end infinite' }} />
            )}
          </span>

          {/* Send */}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0, background: '#0a0a0f', color: '#fff', fontWeight: 600, fontSize: '0.95rem', padding: '11px 20px', borderRadius: 999 }}>
            Send
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </span>

          <style>{'@keyframes clvComposerFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}@keyframes clvComposerCaret{50%{opacity:0}}'}</style>
        </div>
      </div>
    </div>
  )
}

function CitationScore({ on, reduced }: { on: boolean; reduced: boolean }) {
  const score = useCountUp(4.4, on, 1400)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-50)', fontWeight: 600 }}>
        Citation Score
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: 'var(--font-display)',
          fontSize: '3rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          width: 'fit-content',
          backgroundImage: 'linear-gradient(135deg, var(--ink) 28%, #8b9bff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent'
        }}
      >
        {score.toFixed(1)}%
      </div>
      <div style={{ marginTop: 8, fontSize: '0.9rem', color: 'var(--ink-60)' }}>Cited in 46 of 1038 cited answers</div>

      <div style={{ marginTop: 'auto', paddingTop: 28, display: 'flex', alignItems: 'flex-end', gap: 18 }}>
        {BARS.map((b, i) => (
          <div key={b.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
            <div style={{ width: '100%', height: 184, display: 'flex', alignItems: 'flex-end' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: on || reduced ? `${b.h}%` : '0%',
                  borderRadius: '9px 9px 4px 4px',
                  overflow: 'hidden',
                  backgroundImage: `linear-gradient(180deg, ${b.from}, ${b.to})`,
                  boxShadow: `0 8px 22px ${b.from}45`,
                  transition: reduced ? 'none' : `height 1s ${EASE} ${0.3 + i * 0.1}s`
                }}
              >
                <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.4), transparent 42%)' }} />
                {!reduced && (
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      height: '45%',
                      top: '-45%',
                      background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.5), transparent)',
                      animation: `heroBarSheen ${2.6 + i * 0.25}s ease-in-out ${i * 0.2}s infinite`
                    }}
                  />
                )}
              </div>
            </div>
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 42, height: 42, borderRadius: 12, background: 'var(--ink-06)', border: '1px solid var(--line)', flexShrink: 0 }}>
              <BrandGlyph name={b.key} />
            </span>
          </div>
        ))}
      </div>
      <style>{'@keyframes heroBarSheen{0%{transform:translateY(0);opacity:0}25%{opacity:1}100%{transform:translateY(560%);opacity:0}}'}</style>
    </div>
  )
}

function CitationCategories({ on, reduced }: { on: boolean; reduced: boolean }) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>Citation categories</div>
      <div style={{ marginTop: 6, fontSize: '0.84rem', color: 'var(--ink-50)' }}>Where the engines pull citations from · this window</div>

      <div style={{ marginTop: 'auto', marginBottom: 'auto', paddingTop: 18, display: 'flex', alignItems: 'center', gap: 28 }}>
        <Donut on={on} reduced={reduced} hovered={hovered} setHovered={setHovered} tip={tip} setTip={setTip} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {CATS.map((c, i) => {
            const active = hovered === i
            const dim = hovered !== null && !active
            return (
              <div
                key={c.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 8px',
                  margin: '0 -8px',
                  borderRadius: 8,
                  cursor: 'default',
                  borderBottom: i < CATS.length - 1 ? '1px solid var(--line)' : 'none',
                  background: active ? 'var(--subtle)' : 'transparent',
                  opacity: on || reduced ? (dim ? 0.5 : 1) : 0,
                  transform: on || reduced ? 'none' : 'translateY(6px)',
                  transition: reduced
                    ? 'none'
                    : `opacity 0.35s ${EASE}${on ? '' : ` ${0.6 + i * 0.1}s`}, transform 0.5s ${EASE} ${0.6 + i * 0.1}s, background 0.2s ${EASE}`
                }}
              >
                <span style={{ width: 11, height: 11, borderRadius: 3, background: c.color, flexShrink: 0, boxShadow: `0 0 9px ${c.color}77` }} />
                <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink)' }}>{c.label}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.92rem', color: 'var(--ink)' }}>{c.pct}%</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', color: 'var(--ink-50)', minWidth: '3.6rem', textAlign: 'right' }}>{c.count}</span>
                <span style={{ color: 'var(--ink-40)', fontSize: '0.9rem' }}>›</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Donut({
  on,
  reduced,
  hovered,
  setHovered,
  tip,
  setTip
}: {
  on: boolean
  reduced: boolean
  hovered: number | null
  setHovered: (v: number | null) => void
  tip: { x: number; y: number } | null
  setTip: (v: { x: number; y: number } | null) => void
}) {
  const total = useCountInt(16542, on, 1700)
  const boxRef = useRef<HTMLDivElement>(null)
  const cx = 100
  const cy = 100
  const r = 80
  const C = 2 * Math.PI * r

  let cum = 0
  const segs = DONUT_ORDER.map((idx) => {
    const c = CATS[idx]
    const segLen = Math.max(3, (c.pct / 100) * C - 3)
    const rot = (cum / 100) * 360 - 90
    cum += c.pct
    return { idx, color: c.color, segLen, rot }
  })

  const onMove = (idx: number) => (e: ReactMouseEvent) => {
    const rect = boxRef.current?.getBoundingClientRect()
    if (!rect) return
    setHovered(idx)
    setTip({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={boxRef}
      style={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}
      onMouseLeave={() => {
        setHovered(null)
        setTip(null)
      }}
    >
      <div
        aria-hidden
        style={{ position: 'absolute', inset: '12%', borderRadius: '999px', background: 'radial-gradient(circle, rgba(124,108,245,0.20), rgba(52,211,153,0.08) 55%, transparent 72%)', filter: 'blur(10px)' }}
      />
      <svg viewBox="0 0 200 200" width="200" height="200" style={{ position: 'relative', display: 'block', overflow: 'visible' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--ink-06)" strokeWidth="22" />
        {segs.map((s, i) => {
          const active = hovered === s.idx
          const dim = hovered !== null && !active
          return (
            <circle
              key={s.idx}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={active ? 29 : 22}
              strokeLinecap="butt"
              strokeDasharray={`${s.segLen} ${C}`}
              strokeDashoffset={on || reduced ? 0 : s.segLen}
              transform={`rotate(${s.rot} ${cx} ${cy})`}
              onMouseMove={onMove(s.idx)}
              style={{
                cursor: 'pointer',
                opacity: dim ? 0.45 : 1,
                filter: active ? `drop-shadow(0 0 11px ${s.color})` : `drop-shadow(0 0 6px ${s.color}66)`,
                transition: reduced
                  ? 'none'
                  : `stroke-dashoffset 0.9s ${EASE} ${0.3 + i * 0.16}s, stroke-width 0.22s ${EASE}, opacity 0.22s ${EASE}, filter 0.22s ${EASE}`
              }}
            />
          )
        })}
      </svg>

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.3rem', fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
          {total.toLocaleString()}
        </div>
        <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: '0.64rem', letterSpacing: '0.18em', color: 'var(--ink-50)' }}>CITATIONS</div>
      </div>

      {tip && hovered !== null && <DonutTip cat={CATS[hovered]} x={tip.x} y={tip.y} />}
    </div>
  )
}

function DonutTip({ cat, x, y }: { cat: (typeof CATS)[number]; x: number; y: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -118%)',
        pointerEvents: 'none',
        zIndex: 12,
        background: '#18181c',
        color: '#fff',
        borderRadius: 11,
        padding: '9px 12px',
        minWidth: 124,
        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
        animation: 'clvTipPop 0.18s cubic-bezier(0.16, 1, 0.3, 1) both'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: 3, background: cat.color, flexShrink: 0, boxShadow: `0 0 8px ${cat.color}` }} />
        <span style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.01em' }}>{cat.label}</span>
      </div>
      <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, lineHeight: 1 }}>{cat.count}</div>
      <div style={{ marginTop: 3, fontSize: '0.74rem', color: 'rgba(255,255,255,0.62)' }}>{cat.pct}% of total citations</div>
      <style>{'@keyframes clvTipPop{from{opacity:0;transform:translate(-50%,-100%) scale(0.92)}to{opacity:1;transform:translate(-50%,-118%) scale(1)}}'}</style>
    </div>
  )
}

function BrandGlyph({ name }: { name: string }) {
  const s = 22
  if (name === 'microsoft') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="3" width="8" height="8" rx="1" fill="#f25022" />
        <rect x="13" y="3" width="8" height="8" rx="1" fill="#7fba00" />
        <rect x="3" y="13" width="8" height="8" rx="1" fill="#00a4ef" />
        <rect x="13" y="13" width="8" height="8" rx="1" fill="#ffb900" />
      </svg>
    )
  }
  if (name === 'monday') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="7" width="4.4" height="10" rx="2.2" fill="#ff3d57" />
        <rect x="9.8" y="7" width="4.4" height="10" rx="2.2" fill="#ffcb00" />
        <rect x="16.6" y="7" width="4.4" height="10" rx="2.2" fill="#00c875" />
      </svg>
    )
  }
  if (name === 'check') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M2 13l4.2 4.2L13 9.5" />
        <path d="M11 16.6l1.4 1.4L21.6 8.4" />
      </svg>
    )
  }
  if (name === 'atlassian') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden>
        <path d="M7.05 11.3a.62.62 0 00-1.07.08L2.07 19a.62.62 0 00.56.9h5.02a.6.6 0 00.55-.34c1.04-2.12.42-5.34-1.15-8.26z" fill="#2684ff" />
        <path d="M11.36 4.5a8.3 8.3 0 00-.48 8.18l2.6 5.2a.62.62 0 00.56.34h5.02a.62.62 0 00.56-.9S12.5 4.74 12.42 4.5a.6.6 0 00-1.06 0z" fill="#2684ff" />
      </svg>
    )
  }
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="#f06a6a" aria-hidden>
      <circle cx="12" cy="6.6" r="3.3" />
      <circle cx="6.6" cy="15.4" r="3.3" />
      <circle cx="17.4" cy="15.4" r="3.3" />
    </svg>
  )
}

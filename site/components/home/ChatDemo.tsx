'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const clamp01 = (x: number) => Math.max(0, Math.min(1, x))

const CARD_LOGOS = [
  '/logos/chatgpt.svg',
  '/logos/claude.svg',
  '/logos/gemini.svg',
  '/logos/perplexity.svg',
  '/logos/grok-icon.svg',
  '/logos/google-ai.svg'
]

const CATEGORY_ROWS = [
  { n: 'VelocityEHS', v: 82 },
  { n: 'Sphera', v: 58.7 },
  { n: 'Intelex', v: 49.3 },
  { n: 'Enablon', v: 44.7 },
  { n: 'SDS Manager', v: 17.3, you: true }
]

const RESPONSE_WORDS = 'I have all the data needed. Here is the complete deep-dive analysis.'.split(' ')

type Depth = 'lg' | 'md' | 'sm'

const CARDS: { top: number; left: number; w: number; depth: Depth; dx: string; dy: string; dur: number; delay: number; g: number }[] = [
  { top: -6, left: 4, w: 184, depth: 'lg', dx: '8px', dy: '-10px', dur: 19, delay: 0, g: 1 },
  { top: -8, left: 26, w: 116, depth: 'sm', dx: '-7px', dy: '9px', dur: 23, delay: 2, g: 3 },
  { top: -7, left: 45, w: 128, depth: 'md', dx: '9px', dy: '8px', dur: 21, delay: 1, g: 0 },
  { top: -4, left: 60, w: 164, depth: 'md', dx: '-8px', dy: '8px', dur: 22, delay: 1.4, g: 2 },
  { top: -9, left: 80, w: 148, depth: 'lg', dx: '-9px', dy: '-9px', dur: 25, delay: 0.5, g: 4 },
  { top: 8, left: 13, w: 122, depth: 'sm', dx: '7px', dy: '11px', dur: 27, delay: 3, g: 0 },
  { top: 12, left: 35, w: 94, depth: 'sm', dx: '-6px', dy: '8px', dur: 26, delay: 2.2, g: 5 },
  { top: 6, left: 69, w: 134, depth: 'md', dx: '-10px', dy: '7px', dur: 22, delay: 1.5, g: 5 },
  { top: 10, left: 90, w: 118, depth: 'sm', dx: '7px', dy: '12px', dur: 28, delay: 0.9, g: 0 },
  { top: 22, left: 1, w: 150, depth: 'md', dx: '12px', dy: '9px', dur: 24, delay: 2.4, g: 2 },
  { top: 26, left: 22, w: 108, depth: 'sm', dx: '-7px', dy: '-9px', dur: 26, delay: 0.8, g: 0 },
  { top: 20, left: 84, w: 156, depth: 'lg', dx: '-11px', dy: '11px', dur: 20, delay: 1.1, g: 1 },
  { top: 30, left: 66, w: 98, depth: 'sm', dx: '8px', dy: '10px', dur: 29, delay: 2.6, g: 3 },
  { top: 34, left: 10, w: 120, depth: 'sm', dx: '-8px', dy: '-10px', dur: 26, delay: 1.7, g: 0 },
  { top: 38, left: 30, w: 144, depth: 'md', dx: '-9px', dy: '-11px', dur: 23, delay: 1.8, g: 4 },
  { top: 32, left: 54, w: 126, depth: 'md', dx: '10px', dy: '8px', dur: 22, delay: 0.6, g: 5 },
  { top: 36, left: 86, w: 148, depth: 'lg', dx: '9px', dy: '-9px', dur: 21, delay: 1.3, g: 2 },
  { top: 44, left: 6, w: 132, depth: 'sm', dx: '8px', dy: '9px', dur: 27, delay: 0.4, g: 1 },
  { top: 46, left: 42, w: 156, depth: 'md', dx: '11px', dy: '8px', dur: 24, delay: 2.1, g: 0 },
  { top: 42, left: 72, w: 114, depth: 'sm', dx: '-7px', dy: '11px', dur: 28, delay: 1.0, g: 3 }
]

const DEPTH: Record<Depth, { blur: number; op: number; border: number; glyph: number; logo: number }> = {
  lg: { blur: 0, op: 0.95, border: 0.28, glyph: 0.5, logo: 0.95 },
  md: { blur: 0.6, op: 0.8, border: 0.2, glyph: 0.4, logo: 0.8 },
  sm: { blur: 2.2, op: 0.6, border: 0.14, glyph: 0.3, logo: 0.6 }
}

const CONVERGE_Y = 50

function WindowCard({ c, i, n }: { c: (typeof CARDS)[number]; i: number; n: number }) {
  const d = DEPTH[c.depth]
  const h = Math.round(c.w * 0.72)
  const fx = ((50 - c.left) * 0.5).toFixed(1)
  const fy = (CONVERGE_Y - c.top).toFixed(1)
  const delay = (i / Math.max(1, n - 1)) * 0.46
  const span = 0.54
  const cp = `clamp(0, calc((var(--pa, 0) - ${delay.toFixed(3)}) / ${span}), 1)`
  const rot = (((c.left % 7) - 3) * 1.6).toFixed(1)
  return (
    <div
      style={{
        position: 'absolute',
        top: `${c.top}%`,
        left: `${c.left}%`,
        width: c.w,
        transform: `translate(calc(${cp} * ${fx}vw), calc(${cp} * ${fy}vh)) scale(calc(1 - ${cp} * 0.7)) rotate(calc(${cp} * ${rot}deg))`,
        opacity: `calc(${d.op} * (1 - ${cp}))`,
        filter: d.blur ? `blur(${d.blur}px)` : 'none',
        willChange: 'transform, opacity'
      }}
    >
      <div
        style={
          {
            animation: `clv-drift ${c.dur}s ${c.delay}s ease-in-out infinite`,
            ['--dx' as string]: c.dx,
            ['--dy' as string]: c.dy
          } as CSSProperties
        }
      >
        <div
          style={{
            width: '100%',
            height: h,
            borderRadius: 14,
            border: `1px solid rgba(255,255,255,${d.border})`,
            background: 'linear-gradient(157deg, rgba(255,255,255,0.13), rgba(255,255,255,0.035) 55%, rgba(255,255,255,0.02))',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            boxShadow: `0 24px 50px -26px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,${d.border + 0.1})`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '0 11px',
              borderBottom: `1px solid rgba(255,255,255,${d.border * 0.6})`
            }}
          >
            {[0, 1, 2].map((j) => (
              <span key={j} style={{ height: 5, width: 5, borderRadius: 999, background: `rgba(255,255,255,${d.glyph})` }} />
            ))}
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CARD_LOGOS[c.g % CARD_LOGOS.length]}
              alt=""
              style={{
                height: Math.round(c.w * 0.27),
                width: 'auto',
                maxWidth: '72%',
                objectFit: 'contain',
                filter: `brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,${0.16 * d.logo}))`,
                opacity: d.logo
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FloatingField() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 3 }}>
      <div
        style={
          {
            position: 'absolute',
            top: '8%',
            left: '40%',
            transform: 'translateY(calc(var(--pa,0) * 18vh))',
            opacity: 'calc(1 - var(--pa,0) * 0.8)'
          } as CSSProperties
        }
      >
        <div
          style={
            {
              width: 480,
              height: 480,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.07), transparent 68%)',
              filter: 'blur(16px)',
              animation: 'clv-drift 30s ease-in-out infinite',
              ['--dx' as string]: '40px',
              ['--dy' as string]: '20px'
            } as CSSProperties
          }
        />
      </div>
      <div
        style={
          {
            position: 'absolute',
            top: '48%',
            left: '6%',
            transform: 'translateY(calc(var(--pa,0) * 12vh))',
            opacity: 'calc(1 - var(--pa,0) * 0.8)'
          } as CSSProperties
        }
      >
        <div
          style={
            {
              width: 400,
              height: 400,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent 68%)',
              filter: 'blur(18px)',
              animation: 'clv-drift 36s 2s ease-in-out infinite',
              ['--dx' as string]: '-30px',
              ['--dy' as string]: '20px'
            } as CSSProperties
          }
        />
      </div>
      <div
        style={
          {
            position: 'absolute',
            top: '56%',
            left: '80%',
            transform: 'translateY(calc(var(--pa,0) * 14vh))',
            opacity: 'calc(1 - var(--pa,0) * 0.8)'
          } as CSSProperties
        }
      >
        <div
          style={
            {
              width: 360,
              height: 360,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.045), transparent 68%)',
              filter: 'blur(18px)',
              animation: 'clv-drift 32s 1s ease-in-out infinite',
              ['--dx' as string]: '30px',
              ['--dy' as string]: '16px'
            } as CSSProperties
          }
        />
      </div>
      <div
        style={
          {
            position: 'absolute',
            top: '46%',
            left: '50%',
            width: '70vw',
            maxWidth: 900,
            height: 560,
            transform: 'translate(-50%, -22%)',
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,255,255,0.10), rgba(255,255,255,0.03) 45%, transparent 70%)',
            filter: 'blur(8px)',
            opacity: 'calc(var(--cardin, 0) * 0.9)',
            pointerEvents: 'none'
          } as CSSProperties
        }
      />
      {CARDS.map((c, i) => (
        <WindowCard key={i} c={c} i={i} n={CARDS.length} />
      ))}
    </div>
  )
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', height: 20 }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            height: 7,
            width: 7,
            borderRadius: 999,
            background: 'var(--ink-40)',
            animation: `clv-chatdot 1s ${i * 0.16}s ease-in-out infinite`
          }}
        />
      ))}
    </span>
  )
}

function ResponseText({ shownWords }: { shownWords: number }) {
  return (
    <span>
      {RESPONSE_WORDS.map((w, i) => {
        const visible = i < shownWords
        return (
          <span key={i} style={{ transition: 'opacity 0.2s ease', opacity: visible ? 1 : 0 }}>
            {w}{' '}
          </span>
        )
      })}
    </span>
  )
}

const reveal = (on: boolean, y = 10): CSSProperties => ({
  opacity: on ? 1 : 0,
  transform: on ? 'none' : `translateY(${y}px)`,
  transition: `opacity 0.45s ease, transform 0.5s ${EASE}`
})

export function ChatDemo() {
  const sectionRef = useRef<HTMLElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const [words, setWords] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 640px)')
    const apply = () => setIsMobile(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  useEffect(() => {
    const sec = sectionRef.current
    const sticky = stickyRef.current
    if (!sec || !sticky) return

    // Mobile: skip the 500vh scroll-pin animation entirely. Static fallback handled in render.
    if (isMobile) {
      setStep(6)
      setWords(RESPONSE_WORDS.length)
      return
    }

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      sticky.style.setProperty('--pa', '1')
      sticky.style.setProperty('--cardin', '1')
      sticky.style.setProperty('--copyout', '1')
      setStep(6)
      setWords(RESPONSE_WORDS.length)
      return
    }

    let lastStep = -1
    let lastWords = -1
    const apply = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight
      const rect = sec.getBoundingClientRect()
      const travel = sec.offsetHeight - vh
      const p = travel > 0 ? clamp01(-rect.top / travel) : 0

      const pa = clamp01(p / 0.5)
      // Sequenced handoff (not a cross-fade): the intro copy fully fades out
      // first (copyout 0.30→0.37), THEN the chat card fades in (cardin 0.39→
      // 0.54). The ~0.02 gap means the copy is gone the instant the box pops.
      const copyout = clamp01((p - 0.3) / 0.07)
      const cardin = clamp01((p - 0.39) / 0.15)
      sticky.style.setProperty('--pa', pa.toFixed(4))
      sticky.style.setProperty('--copyout', copyout.toFixed(4))
      sticky.style.setProperty('--cardin', cardin.toFixed(4))

      const pb = clamp01((p - 0.54) / 0.46)
      let st = 0
      let wd = 0
      if (pb <= 0) {
        st = 0
      } else if (pb < 0.12) {
        st = 1
      } else if (pb < 0.22) {
        st = 2
      } else if (pb < 0.34) {
        st = 3
      } else {
        st = 4
        const ws = clamp01((pb - 0.34) / 0.44)
        wd = Math.round(ws * RESPONSE_WORDS.length)
        if (pb >= 0.82) st = 5
        if (pb >= 0.9) st = 6
      }
      if (st !== lastStep) {
        lastStep = st
        setStep(st)
      }
      if (wd !== lastWords) {
        lastWords = wd
        setWords(wd)
      }
    }
    const onScroll = () => apply()
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isMobile])

  // Mobile fallback: simplified static layout — no 500vh pin, no floating cards
  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          padding: '4rem 0 5rem',
          background: 'radial-gradient(70% 55% at 50% 32%, rgba(255,255,255,0.055), rgba(255,255,255,0.022) 45%, transparent 80%), radial-gradient(48% 42% at 78% 80%, rgba(255,255,255,0.032), transparent 78%), radial-gradient(42% 38% at 20% 76%, rgba(255,255,255,0.026), transparent 80%), var(--bg)'
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', padding: '0 1.25rem 2rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.4rem, 6vw, 1.9rem)',
              fontWeight: 600,
              letterSpacing: 'var(--track-display-lg)',
              lineHeight: 1.12,
              margin: 0,
              color: '#ffffff',
              textWrap: 'balance'
            }}
          >
            The answer is in the data. You just shouldn&rsquo;t have to find it yourself.
          </h2>
          <p
            style={{
              fontSize: '0.96rem',
              lineHeight: 1.55,
              color: 'rgba(255,255,255,0.70)',
              margin: '14px auto 0',
              maxWidth: 560,
              textWrap: 'balance'
            }}
          >
            Ask Clovion questions about rankings, competitors, prompts, and perception — and get answers backed by your data.
          </p>
        </div>

        <div style={{ padding: '0 1rem', maxWidth: 640, margin: '0 auto' }}>
          <div
            className="clv-chat-island"
            style={{
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'var(--subtle)',
              overflow: 'hidden',
              boxShadow: '0 30px 60px -22px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)'
            }}
          >
            <div style={{ height: 38, borderBottom: '1px solid var(--line)', background: 'var(--white)', display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10 }}>
              <div style={{ display: 'flex', gap: 5 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ height: 9, width: 9, borderRadius: 999, background: 'var(--ink-15)' }} />
                ))}
              </div>
              <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-50)' }}>
                clovion.ai
              </div>
              <div style={{ width: 24 }} />
            </div>
            <div style={{ padding: '18px 18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    maxWidth: '88%',
                    background: 'var(--ink)',
                    color: 'var(--on-ink)',
                    borderRadius: '16px 16px 4px 16px',
                    padding: '11px 14px',
                    fontSize: '0.9rem',
                    lineHeight: 1.45,
                    fontWeight: 500
                  }}
                >
                  Go deep and research what is driving my visibility score.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                <div
                  style={{
                    height: 28,
                    width: 28,
                    flexShrink: 0,
                    borderRadius: 999,
                    background: 'var(--white)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ height: 7, width: 7, borderRadius: 999, background: 'var(--ink)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-50)' }}>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 8v4.4l3 1.8" />
                    </svg>
                    Thought for 163s
                  </span>
                  <p style={{ margin: '8px 0 0', fontSize: '0.92rem', lineHeight: 1.55, color: 'var(--ink-70)' }}>
                    I have all the data needed. Here is the complete deep-dive analysis.
                  </p>
                  <div
                    style={{
                      marginTop: 14,
                      borderRadius: 11,
                      border: '1px solid var(--line)',
                      background: 'var(--white)',
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '11px 13px 9px', borderBottom: '1px solid var(--line)' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
                        SDS Manager — Deep-Dive
                      </div>
                      <div style={{ marginTop: 4, fontFamily: 'var(--font-mono)', fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)' }}>
                        May 18 – Jun 15, 2026 · ChatGPT
                      </div>
                    </div>
                    <div style={{ padding: '10px 13px 12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                        {(
                          [
                            ['Visibility', '17.3%'],
                            ['Rank', '#11 / 147'],
                            ['SoV', '2.4%'],
                            ['Avg. pos', '5.4']
                          ] as const
                        ).map(([k, v]) => (
                          <div
                            key={k}
                            style={{
                              borderRadius: 8,
                              background: 'var(--subtle)',
                              border: '1px solid var(--line)',
                              padding: '7px 9px'
                            }}
                          >
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)' }}>
                              {k}
                            </div>
                            <div style={{ marginTop: 2, fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                              {v}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 11, display: 'grid', gap: 6 }}>
                        {CATEGORY_ROWS.map((c) => (
                          <div
                            key={c.n}
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '6rem 1fr auto',
                              alignItems: 'center',
                              gap: 8
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.74rem',
                                fontWeight: c.you ? 700 : 500,
                                color: c.you ? 'var(--ink)' : 'var(--ink-70)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              {c.n}
                            </span>
                            <span style={{ height: 5, borderRadius: 999, background: 'var(--ink-06)', overflow: 'hidden' }}>
                              <span
                                style={{
                                  display: 'block',
                                  height: '100%',
                                  width: `${c.v}%`,
                                  borderRadius: 999,
                                  background: c.you ? 'var(--ink)' : 'var(--ink-30)'
                                }}
                              />
                            </span>
                            <span
                              style={{
                                width: 38,
                                textAlign: 'right',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.68rem',
                                color: c.you ? 'var(--ink)' : 'var(--ink-60)',
                                fontVariantNumeric: 'tabular-nums'
                              }}
                            >
                              {c.v}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        height: '500vh',
        background: 'radial-gradient(60% 18% at 50% 30%, rgba(255,255,255,0.06), rgba(255,255,255,0.025) 45%, transparent 80%), radial-gradient(40% 12% at 22% 62%, rgba(255,255,255,0.028), transparent 78%), radial-gradient(46% 14% at 80% 70%, rgba(255,255,255,0.034), transparent 78%), radial-gradient(50% 8% at 50% 88%, rgba(255,255,255,0.02), transparent 75%), var(--bg)'
      }}
    >
      <div
        ref={stickyRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FloatingField />

        {/* Edge fades — blend the floating cards into the body tone so the
            seam with the section above (PillarStepper) and below isn't a hard
            clipped edge. Same var(--bg) fade approach used across the homepage. */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '22vh',
            background: 'linear-gradient(to bottom, var(--bg) 12%, transparent)',
            zIndex: 4,
            pointerEvents: 'none'
          }}
        />
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '18vh',
            background: 'linear-gradient(to top, var(--bg) 12%, transparent)',
            zIndex: 4,
            pointerEvents: 'none'
          }}
        />

        {/* Headline above the floating field */}
        <div
          style={
            {
              position: 'relative',
              zIndex: 4,
              maxWidth: 760,
              textAlign: 'center',
              padding: '0 2rem',
              marginTop: 400,
              marginBottom: 28,
              opacity: 'calc(1 - var(--copyout, 0))',
              transform: 'translateY(calc(var(--copyout, 0) * -44px))',
              willChange: 'opacity, transform'
            } as CSSProperties
          }
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 'min(150%, 1100px)',
              height: '320%',
              transform: 'translate(-50%, -50%)',
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(8,8,12,0.94), rgba(8,8,12,0.78) 32%, rgba(8,8,12,0.42) 56%, transparent 74%)',
              filter: 'blur(12px)',
              zIndex: -1,
              pointerEvents: 'none'
            }}
          />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 2.7vw, 2.35rem)',
              fontWeight: 600,
              letterSpacing: 'var(--track-display-lg)',
              lineHeight: 1.08,
              margin: '16px 0 0',
              color: '#ffffff',
              textWrap: 'balance',
              textShadow: '0 2px 32px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.45)'
            }}
          >
            The answer is in the data. You just shouldn&rsquo;t have to find it yourself.
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.70)',
              margin: '16px auto 0',
              maxWidth: 600,
              textWrap: 'balance',
              textShadow: '0 1px 18px rgba(0,0,0,0.55)'
            }}
          >
            Ask Clovion questions about rankings, competitors, prompts, and perception — and get answers backed by your data.
          </p>
        </div>

        {/* Chat card */}
        <div
          style={
            {
              position: 'absolute',
              left: '50%',
              top: '50%',
              zIndex: 2,
              width: 'min(680px, calc(100vw - 3rem))',
              opacity: 'var(--cardin, 0)',
              transform:
                'translate(-50%, calc(-50% + (1 - var(--cardin, 0)) * 36px)) scale(calc(0.94 + var(--cardin, 0) * 0.06))',
              willChange: 'transform, opacity'
            } as CSSProperties
          }
        >
          <div
            className="clv-chat-island"
            style={{
              borderRadius: 22,
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'var(--subtle)',
              overflow: 'hidden',
              boxShadow: '0 50px 110px -34px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)'
            }}
          >
            <div style={{ height: 42, borderBottom: '1px solid var(--line)', background: 'var(--white)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ height: 10, width: 10, borderRadius: 999, background: 'var(--ink-15)' }} />
                ))}
              </div>
              <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-50)' }}>
                clovion.ai · Assistant
              </div>
              <div style={{ width: 32 }} />
            </div>

            <div
              style={{
                padding: '24px 28px 22px',
                height: 'min(72vh, 560px)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: 16
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end', ...reveal(step >= 1) }}>
                <div
                  style={{
                    maxWidth: '82%',
                    background: 'var(--ink)',
                    color: 'var(--on-ink)',
                    borderRadius: '18px 18px 4px 18px',
                    padding: '13px 17px',
                    fontSize: '0.98rem',
                    lineHeight: 1.45,
                    fontWeight: 500
                  }}
                >
                  Go deep and research the topics, pieces of content, and overall changes in the data that are driving my visibility score.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start', flex: 1, minHeight: 0 }}>
                <div
                  style={{
                    height: 32,
                    width: 32,
                    flexShrink: 0,
                    borderRadius: 999,
                    background: 'var(--white)',
                    border: '1px solid var(--line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...reveal(step >= 2, 6)
                  }}
                >
                  <span style={{ height: 8, width: 8, borderRadius: 999, background: 'var(--ink)' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ minHeight: 22, display: 'flex', alignItems: 'center' }}>
                    {step === 2 && <TypingDots />}
                    {step >= 3 && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 8,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          color: 'var(--ink-50)',
                          ...reveal(step >= 3, 4)
                        }}
                      >
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <circle cx="12" cy="12" r="8.5" />
                          <path d="M12 8v4.4l3 1.8" />
                        </svg>
                        Thought for 163s
                      </span>
                    )}
                  </div>

                  {step >= 4 && (
                    <p style={{ margin: '10px 0 0', fontSize: '0.98rem', lineHeight: 1.55, color: 'var(--ink-80, var(--ink-70))' }}>
                      <ResponseText shownWords={words} />
                    </p>
                  )}

                  <div
                    style={{
                      marginTop: 16,
                      borderRadius: 13,
                      border: '1px solid var(--line)',
                      background: 'var(--white)',
                      overflow: 'hidden',
                      ...reveal(step >= 5, 14)
                    }}
                  >
                    <div style={{ padding: '13px 16px 11px', borderBottom: '1px solid var(--line)' }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
                        SDS Manager — Visibility Deep-Dive Analysis
                      </div>
                      <div style={{ marginTop: 5, fontFamily: 'var(--font-mono)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)' }}>
                        May 18 – Jun 15, 2026 · ChatGPT · United States
                      </div>
                    </div>
                    <div style={{ padding: '12px 16px 14px' }}>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {(
                          [
                            ['Visibility', '17.3%'],
                            ['Rank', '#11 / 147'],
                            ['Share of voice', '2.4%'],
                            ['Avg. position', '5.4']
                          ] as const
                        ).map(([k, v]) => (
                          <div
                            key={k}
                            style={{
                              flex: '1 1 0',
                              minWidth: 96,
                              borderRadius: 9,
                              background: 'var(--subtle)',
                              border: '1px solid var(--line)',
                              padding: '8px 11px'
                            }}
                          >
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)', whiteSpace: 'nowrap' }}>
                              {k}
                            </div>
                            <div style={{ marginTop: 3, fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                              {v}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-50)' }}>
                          Category share of voice
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '3px 9px',
                            borderRadius: 999,
                            background: 'var(--positive-bg)',
                            border: '1px solid var(--positive-border)',
                            color: 'var(--positive)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em'
                          }}
                        >
                          Rank #11 of 147
                        </span>
                      </div>
                      <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                        {CATEGORY_ROWS.map((c, i) => {
                          const on = step >= 6
                          return (
                            <div
                              key={c.n}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '7.5rem 1fr auto',
                                alignItems: 'center',
                                gap: 10,
                                opacity: on ? 1 : 0,
                                transform: on ? 'none' : 'translateY(6px)',
                                transition: `opacity 0.4s ease ${i * 0.07}s, transform 0.45s ${EASE} ${i * 0.07}s`
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '0.82rem',
                                  fontWeight: c.you ? 700 : 500,
                                  color: c.you ? 'var(--ink)' : 'var(--ink-70)',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {c.n}
                              </span>
                              <span style={{ height: 6, borderRadius: 999, background: 'var(--ink-06)', overflow: 'hidden' }}>
                                <span
                                  style={{
                                    display: 'block',
                                    height: '100%',
                                    width: on ? `${c.v}%` : '0%',
                                    borderRadius: 999,
                                    background: c.you ? 'var(--ink)' : 'var(--ink-30)',
                                    transition: `width 0.85s ${EASE} ${i * 0.07}s`
                                  }}
                                />
                              </span>
                              <span
                                style={{
                                  width: 44,
                                  textAlign: 'right',
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.74rem',
                                  color: c.you ? 'var(--ink)' : 'var(--ink-60)',
                                  fontVariantNumeric: 'tabular-nums'
                                }}
                              >
                                {c.v}%
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

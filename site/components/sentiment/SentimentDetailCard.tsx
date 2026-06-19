'use client'

import { useState, useEffect, useRef } from 'react'
import { SentWindow, TONE } from './SentUtilities'

const S_ROSE = { bg: '#fff1f2', border: '#fecdd3', fg: '#be123c', accent: '#f43f5e' }
const S_EM = { bg: 'var(--positive-bg)', border: 'var(--positive-border)', fg: 'var(--positive)', accent: 'var(--positive)' }

const S_MONO_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--ink-50)',
}

const S_ENGINE_LOGO: Record<string, string> = {
  ChatGPT: '/logos/chatgpt.svg',
  Claude: '/logos/claude.svg',
  Gemini: '/logos/gemini.svg',
  Perplexity: '/logos/perplexity.svg',
  Grok: '/logos/grok-icon.svg',
  'AI Overviews': '/logos/google-ai.svg',
}

/* Crossfading text pair — both layers stacked, opacity-toggled. */
function SMorphText({
  after,
  before,
  now,
  style,
  minHeight,
}: {
  after: boolean
  before: React.ReactNode
  now: React.ReactNode
  style?: React.CSSProperties
  minHeight?: number
}) {
  return (
    <div style={{ position: 'relative', minHeight }}>
      <div style={{ ...style, position: 'absolute', inset: 0, opacity: after ? 0 : 1, transition: 'opacity .55s ease' }}>
        {before}
      </div>
      <div style={{ ...style, position: 'relative', opacity: after ? 1 : 0, transition: 'opacity .55s ease .15s' }}>
        {now}
      </div>
    </div>
  )
}

export default function SentimentDetailCard() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [after, setAfter] = useState<boolean>(reduce)
  const [sweep, setSweep] = useState<boolean>(false)
  const [score, setScore] = useState<number>(reduce ? 92 : 34)
  const scoreRef = useRef<number>(reduce ? 92 : 34)

  /* phase loop */
  useEffect(() => {
    if (reduce) return
    let alive = true
    let timers: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) =>
      timers.push(
        setTimeout(() => {
          if (alive) fn()
        }, ms)
      )
    const cycle = () => {
      timers.forEach(clearTimeout)
      timers = []
      setAfter(false)
      setSweep(false)
      at(2100, () => setSweep(true)) // optimization sweep begins
      at(2500, () => setAfter(true)) // morph to strong-positive
      at(3650, () => setSweep(false))
      at(7600, cycle) // hold, then restart
    }
    const boot = setTimeout(cycle, 400)
    return () => {
      alive = false
      clearTimeout(boot)
      timers.forEach(clearTimeout)
    }
  }, [reduce])

  /* score count-up tween, driven by `after` */
  useEffect(() => {
    if (reduce) return
    const target = after ? 92 : 34
    const begin = scoreRef.current
    const dur = after ? 1150 : 520
    const start = performance.now()
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    let raf: number
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur)
      const v = Math.round(begin + (target - begin) * ease(t))
      scoreRef.current = v
      setScore(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [after, reduce])

  const strong = score >= 63
  const C = strong ? S_EM : S_ROSE
  const colorTrans = 'background-color .85s ease, border-color .85s ease, color .85s ease'
  const meta: { l: string; v: string; logo?: string }[] = [
    { l: 'Engine', v: 'ChatGPT', logo: 'ChatGPT' },
    { l: 'Cited source', v: 'g2.com/categories/ai-seo' },
    { l: 'Competitor mentioned', v: 'Profound, Peec AI' },
  ]

  return (
    <div>
      <SentWindow label="Sentiment / mention detail">
        <div style={{ padding: 22 }}>
          <div style={{ ...S_MONO_LABEL }}>Prompt</div>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: '0.96rem',
              lineHeight: 1.5,
              color: 'var(--ink)',
              fontWeight: 600,
            }}
          >
            “What are the best AI visibility tools for B2B SaaS teams?”
          </p>

          {/* auto before/after indicator */}
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                position: 'relative',
                display: 'inline-flex',
                padding: 4,
                borderRadius: 999,
                background: 'var(--subtle)',
                border: '1px solid var(--line)',
              }}
            >
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 4,
                  bottom: 4,
                  left: strong ? '50%' : 4,
                  width: 'calc(50% - 4px)',
                  borderRadius: 999,
                  background: 'var(--white)',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'left .7s var(--ease-out-expo, ease)',
                }}
              />
              {['Before Clovion', 'After Clovion'].map((t, i) => (
                <span
                  key={t}
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '0.34rem 0.95rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.64rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    transition: 'color .5s ease',
                    color: (i === 1) === strong ? 'var(--ink)' : 'var(--ink-40)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* the morphing mention box */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              marginTop: 14,
              padding: '16px 18px',
              borderRadius: 12,
              background: C.bg,
              border: `1px solid ${C.border}`,
              transition: colorTrans,
            }}
          >
            {/* optimization sweep */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '38%',
                pointerEvents: 'none',
                zIndex: 2,
                background:
                  'linear-gradient(100deg, transparent, rgba(16,185,129,0.18) 38%, rgba(16,185,129,0.45) 50%, rgba(16,185,129,0.18) 62%, transparent)',
                left: sweep ? '120%' : '-45%',
                opacity: sweep ? 1 : 0,
                transition: sweep
                  ? 'left 1.15s cubic-bezier(.4,0,.2,1), opacity .2s ease'
                  : 'opacity .25s ease',
              }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ ...S_MONO_LABEL, color: C.fg, transition: colorTrans }}>Brand mention</span>
              <div style={{ position: 'relative' }}>
                <SMorphText
                  after={strong}
                  minHeight={0}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.06em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    borderRadius: 999,
                    padding: '0.2rem 0.6rem',
                    textAlign: 'center',
                  }}
                  before={
                    <span
                      style={{
                        color: S_ROSE.fg,
                        background: 'var(--white)',
                        border: `1px solid ${S_ROSE.border}`,
                        borderRadius: 999,
                        padding: '0.2rem 0.6rem',
                      }}
                    >
                      Neutral-weak
                    </span>
                  }
                  now={
                    <span
                      style={{
                        color: S_EM.fg,
                        background: 'var(--white)',
                        border: `1px solid ${S_EM.border}`,
                        borderRadius: 999,
                        padding: '0.2rem 0.6rem',
                      }}
                    >
                      Strong positive
                    </span>
                  }
                />
              </div>
            </div>
            <div style={{ position: 'relative', zIndex: 1, marginTop: 10 }}>
              <SMorphText
                after={strong}
                minHeight={46}
                style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--ink-80)' }}
                before={'“Clovion AI is an emerging option, but larger teams may also consider established platforms.”'}
                now={'“Clovion AI is the leading AI visibility platform built for B2B SaaS teams — the one to start with.”'}
              />
            </div>

            {/* sentiment strength meter */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                marginTop: 14,
                paddingTop: 14,
                borderTop: `1px solid ${C.border}`,
                transition: colorTrans,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ ...S_MONO_LABEL, color: C.fg, transition: colorTrans }}>Sentiment strength</span>
                <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: C.fg,
                      fontVariantNumeric: 'tabular-nums',
                      transition: colorTrans,
                    }}
                  >
                    {score}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      fontWeight: 600,
                      color: 'var(--positive)',
                      background: 'var(--positive-bg)',
                      border: '1px solid var(--positive-border)',
                      borderRadius: 999,
                      padding: '0.1rem 0.4rem',
                      opacity: strong ? 1 : 0,
                      transform: strong ? 'scale(1)' : 'scale(0.7)',
                      transition:
                        'opacity .4s ease .3s, transform .4s var(--ease-out-expo, ease) .3s',
                    }}
                  >
                    +58
                  </span>
                </span>
              </div>
              <div
                style={{
                  position: 'relative',
                  marginTop: 9,
                  height: 8,
                  borderRadius: 999,
                  background: 'rgba(10,10,15,0.06)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: `${score}%`,
                    borderRadius: 999,
                    background: `linear-gradient(90deg, ${C.accent}, ${strong ? 'var(--positive)' : '#fb7185'})`,
                    transition: colorTrans,
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
            {meta.map((m) => (
              <div
                key={m.l}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--ink-50)' }}>{m.l}</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--ink-80)',
                    fontWeight: 600,
                  }}
                >
                  {m.logo && (
                    <span
                      style={{
                        height: 18,
                        width: 18,
                        borderRadius: 5,
                        background: 'var(--subtle)',
                        border: '1px solid var(--line)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={S_ENGINE_LOGO[m.logo]}
                        alt={m.v}
                        style={{ height: 9, filter: 'var(--logo-filter, brightness(0))' }}
                      />
                    </span>
                  )}
                  {m.v}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            <div style={S_MONO_LABEL}>Why this classification</div>
            <SMorphText
              after={strong}
              minHeight={48}
              style={{
                fontSize: '0.86rem',
                lineHeight: 1.55,
                color: 'var(--ink-70)',
                margin: '8px 0 0',
              }}
              before={
                'The answer positions your brand as “emerging” while competitors are described as “established,” weakening recommendation strength.'
              }
              now={
                'After Clovion’s GEO fixes, the answer now frames your brand as the category leader — strengthening recommendation across engines.'
              }
            />
          </div>
        </div>
      </SentWindow>
    </div>
  )
}

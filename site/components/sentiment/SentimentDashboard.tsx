'use client'

import { useState, useEffect, useRef } from 'react'
import { SentWindow, SentimentBar, Sparkline, TONE } from './SentUtilities'

const S_ENGINE_LOGO: Record<string, string> = {
  ChatGPT: '/logos/chatgpt.svg',
  Claude: '/logos/claude.svg',
  Gemini: '/logos/gemini.svg',
  Perplexity: '/logos/perplexity.svg',
  Grok: '/logos/grok-icon.svg',
  'AI Overviews': '/logos/google-ai.svg',
}

const S_MONO_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--ink-50)',
}

type ToneKey = 'pos' | 'neu' | 'neg'

const HERO_ENGINES: { e: string; tone: ToneKey; score: number; word: string }[] = [
  { e: 'ChatGPT', tone: 'pos', score: 78, word: 'Warm' },
  { e: 'Claude', tone: 'pos', score: 81, word: 'Warm' },
  { e: 'Gemini', tone: 'neu', score: 54, word: 'Neutral' },
  { e: 'Perplexity', tone: 'neg', score: 38, word: 'Cool' },
  { e: 'Grok', tone: 'neu', score: 50, word: 'Neutral' },
  { e: 'AI Overviews', tone: 'pos', score: 72, word: 'Warm' },
]

const TREND = [44, 46, 43, 48, 51, 49, 53, 55, 52, 58, 56, 60, 62, 59, 64, 66, 63, 68]

function useSentReveal() {
  const ref = useRef<HTMLDivElement | null>(null)
  const rafHolder = useRef<{ r2?: number }>({})
  const reduce =
    typeof window !== 'undefined' &&
    !!window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [on, setOn] = useState<boolean>(reduce ? true : false)

  useEffect(() => {
    if (reduce) return
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => setOn(true))
      rafHolder.current.r2 = r2
    })
    const t = setTimeout(() => setOn(true), 120)
    return () => {
      cancelAnimationFrame(r1)
      if (rafHolder.current.r2) cancelAnimationFrame(rafHolder.current.r2)
      clearTimeout(t)
    }
  }, [reduce])

  return [ref, on] as const
}

export default function SentimentDashboard() {
  const [ref, on] = useSentReveal()

  return (
    <div ref={ref} className="overflow-x-auto md:overflow-visible">
      <div className="min-w-[420px] md:min-w-0">
      <SentWindow label="Clovion AI / Sentiment / Overview">
        <div style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={S_MONO_LABEL}>Net sentiment score</div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.4rem',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: 'var(--ink)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  68
                </span>
                <span
                  style={{
                    marginBottom: 4,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    color: 'var(--positive)',
                  }}
                >
                  ↑ 6 <span style={{ color: 'var(--ink-50)', fontWeight: 400 }}>/ 18 wks</span>
                </span>
              </div>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--ink-50)',
              }}
            >
              <span style={{ height: 6, width: 6, borderRadius: 999, background: 'var(--positive)' }} />
              Refreshed today
            </span>
          </div>

          <div style={{ marginTop: 14 }}>
            <SentimentBar pos={58} neu={29} neg={13} />
            <div
              style={{
                marginTop: 8,
                display: 'flex',
                gap: 16,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                color: 'var(--ink-50)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ height: 8, width: 8, borderRadius: 999, background: 'var(--positive)' }} />
                58% positive
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    height: 8,
                    width: 8,
                    borderRadius: 999,
                    background: 'var(--ink-25, rgba(10,10,15,0.22))',
                  }}
                />
                29% neutral
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ height: 8, width: 8, borderRadius: 999, background: '#f43f5e' }} />
                13% negative
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: '1px solid var(--line)',
              display: 'grid',
              gap: 7,
            }}
          >
            {HERO_ENGINES.map((r, i) => {
              const t = TONE[r.tone]
              return (
                <div
                  key={r.e}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    alignItems: 'center',
                    gap: 12,
                    opacity: on ? 1 : 0,
                    transform: on ? 'none' : 'translateY(6px)',
                    transition: `all .5s ease ${i * 70}ms`,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span
                      style={{
                        height: 22,
                        width: 22,
                        borderRadius: 7,
                        background: 'var(--subtle)',
                        border: '1px solid var(--line)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={S_ENGINE_LOGO[r.e]}
                        alt={r.e}
                        style={{
                          height: r.e === 'Grok' ? 12 : 11,
                          width: 'auto',
                          filter: 'var(--logo-filter, brightness(0))',
                        }}
                      />
                    </span>
                    <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink)' }}>{r.e}</span>
                  </span>
                  <span
                    style={{
                      width: 96,
                      height: 6,
                      borderRadius: 999,
                      background: 'var(--subtle)',
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        height: '100%',
                        width: on ? `${r.score}%` : '0%',
                        background: t.dot,
                        transition: `width .7s var(--ease-out-expo, ease) ${i * 70 + 120}ms`,
                      }}
                    />
                  </span>
                  <span
                    style={{
                      minWidth: 64,
                      textAlign: 'right',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.66rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: t.fg,
                    }}
                  >
                    {r.word}
                  </span>
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={S_MONO_LABEL}>Net sentiment · 18 weeks</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  color: 'var(--positive)',
                  fontWeight: 600,
                }}
              >
                trending up
              </span>
            </div>
            <div style={{ marginTop: 10 }}>
              <Sparkline data={TREND} />
            </div>
          </div>
        </div>
      </SentWindow>
      </div>
    </div>
  )
}

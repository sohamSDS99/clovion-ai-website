'use client'

import { useState, useEffect, useRef } from 'react'
import { SentWindow, SentimentBar } from './SentUtilities'

const S_MONO_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--ink-50)'
}

function useSentReveal(): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [on, setOn] = useState<boolean>(reduce ? true : false)
  useEffect(() => {
    if (reduce) return
    let r2: number | undefined
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setOn(true))
    })
    const t = setTimeout(() => setOn(true), 120)
    return () => {
      cancelAnimationFrame(r1)
      if (r2) cancelAnimationFrame(r2)
      clearTimeout(t)
    }
  }, [reduce])
  return [ref, on]
}

function SBadgeSolid({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        borderRadius: 999,
        background: 'var(--ink-surface)',
        color: 'var(--on-ink)',
        fontSize: '0.66rem',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.08em'
      }}
    >
      {children}
    </span>
  )
}

export default function SentimentDiagnosed() {
  const [ref, on] = useSentReveal()
  const compare: { who: string; word: string; tone: 'pos' | 'neg' }[] = [
    { who: 'Your brand', word: 'Emerging', tone: 'neg' },
    { who: 'Competitor A', word: 'Established', tone: 'pos' },
    { who: 'Competitor B', word: 'Enterprise-ready', tone: 'pos' }
  ]
  return (
    <div ref={ref}>
      <SentWindow label="Tone / diagnosed" dark>
        <div style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ ...S_MONO_LABEL, color: 'var(--on-ink-50)' }}>Classified tone</div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.7rem',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#fda4af'
                }}
              >
                Neutral-weak
              </div>
            </div>
            <span>
              <SBadgeSolid>DIAGNOSED</SBadgeSolid>
            </span>
          </div>
          <div style={{ marginTop: 18 }}>
            <SentimentBar pos={24} neu={46} neg={30} dark />
          </div>
          <div style={{ marginTop: 18, display: 'grid', gap: 8 }}>
            {compare.map((r, i) => {
              const accent = r.tone === 'pos' ? 'var(--positive)' : '#fda4af'
              return (
                <div
                  key={r.who}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '11px 14px',
                    borderRadius: 10,
                    background: 'var(--on-ink-05)',
                    border: '1px solid var(--on-ink-15)',
                    opacity: on ? 1 : 0,
                    transform: on ? 'none' : 'translateX(8px)',
                    transition: `all .45s ease ${i * 70}ms`
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <span
                      style={{
                        height: 7,
                        width: 7,
                        borderRadius: 999,
                        background: accent
                      }}
                    />
                    <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--on-ink)' }}>
                      {r.who}
                    </span>
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      color: accent
                    }}
                  >
                    {r.word}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </SentWindow>
    </div>
  )
}

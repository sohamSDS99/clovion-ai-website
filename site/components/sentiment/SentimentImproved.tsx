'use client'

import { useState, useEffect, useRef } from 'react'
import { SentWindow } from './SentUtilities'

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

function SBadgePositive({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 8px',
        borderRadius: 999,
        background: 'var(--positive-bg)',
        border: '1px solid var(--positive-border)',
        color: 'var(--positive)',
        fontSize: '0.72rem',
        fontWeight: 600,
        fontFamily: 'var(--font-mono)'
      }}
    >
      {children}
    </span>
  )
}

function SCheck({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SentimentImproved() {
  const [ref, on] = useSentReveal()
  const done = [
    'Enterprise-readiness proof added',
    'Platform coverage page expanded',
    'Customer use cases + security',
    'Integrations + workflow depth'
  ]
  const metrics = [
    { v: '+22', l: 'Net sentiment' },
    { v: '61%', l: 'Positive share' },
    { v: '↑', l: 'Trend' }
  ]
  return (
    <div ref={ref}>
      <SentWindow label="Sentiment / improved">
        <div style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={S_MONO_LABEL}>Outcome to monitor</span>
            <span>
              <SBadgePositive>IMPROVED</SBadgePositive>
            </span>
          </div>
          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
            {metrics.map((m, i) => (
              <div
                key={m.l}
                style={{
                  padding: '0 14px',
                  borderRight: i < 2 ? '1px solid var(--line)' : 'none'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--positive)'
                  }}
                >
                  {m.v}
                </div>
                <div style={{ marginTop: 4, fontSize: '0.72rem', color: 'var(--ink-60)' }}>
                  {m.l}
                </div>
              </div>
            ))}
          </div>
          <ul
            style={{
              listStyle: 'none',
              margin: '18px 0 0',
              padding: 0,
              display: 'grid',
              gap: 8
            }}
          >
            {done.map((d, i) => (
              <li
                key={d}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateX(8px)',
                  transition: `all .45s ease ${i * 80}ms`
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    height: 20,
                    width: 20,
                    borderRadius: 999,
                    background: 'var(--ink-surface)',
                    color: 'var(--on-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <SCheck size={11} />
                </span>
                <span style={{ fontSize: '0.88rem', color: 'var(--ink-80)' }}>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </SentWindow>
    </div>
  )
}

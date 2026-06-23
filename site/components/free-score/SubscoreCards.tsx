'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import WindowChrome from './WindowChrome'

type Subscore = {
  label: string
  value: number
  note: string
}

type Props = {
  subscores: Subscore[]
}

function useReveal(): [React.RefObject<HTMLDivElement>, boolean] {
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
      if (r2 !== undefined) cancelAnimationFrame(r2)
      clearTimeout(t)
    }
  }, [reduce])
  return [ref, on]
}

function bucket(score: number): { label: string; color: string } {
  if (score >= 75) return { label: 'Strong', color: 'var(--positive)' }
  if (score >= 60) return { label: 'Above', color: 'var(--ink)' }
  return { label: 'Needs work', color: 'var(--ink-50)' }
}

export default function SubscoreCards({ subscores }: Props) {
  const [ref, on] = useReveal()
  return (
    <div ref={ref}>
      <WindowChrome label="Sub-scores / four signals">
        <div style={{ padding: 22 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-50)'
              }}
            >
              Four signals · /100
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--ink-50)'
              }}
            >
              <span
                style={{
                  height: 6,
                  width: 6,
                  borderRadius: 999,
                  background: 'var(--positive)'
                }}
              />
              All sampled
            </span>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {subscores.map((s, i) => {
              const b = bucket(s.value)
              return (
                <div
                  key={s.label}
                  style={{
                    borderRadius: 14,
                    border: '1px solid var(--line)',
                    background: 'var(--subtle)',
                    padding: '14px 16px',
                    opacity: on ? 1 : 0,
                    transform: on ? 'none' : 'translateY(8px)',
                    transition: `all .55s ease ${i * 90}ms`
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: 12
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--ink-70)'
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'baseline',
                        gap: 8
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.4rem',
                          fontWeight: 600,
                          letterSpacing: '-0.02em',
                          color: 'var(--ink)',
                          fontVariantNumeric: 'tabular-nums',
                          lineHeight: 1
                        }}
                      >
                        {s.value}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          color: b.color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em'
                        }}
                      >
                        {b.label}
                      </span>
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      height: 6,
                      borderRadius: 999,
                      background: 'var(--ink-07)',
                      overflow: 'hidden'
                    }}
                  >
                    <span
                      style={{
                        display: 'block',
                        height: '100%',
                        borderRadius: 999,
                        background: s.value >= 75 ? 'var(--positive)' : 'var(--ink)',
                        width: on ? `${s.value}%` : '0%',
                        transition: `width 1.1s var(--ease-out-expo) ${i * 100 + 200}ms`
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </WindowChrome>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import WindowChrome from './WindowChrome'

const ENGINE_LOGO: Record<string, string> = {
  ChatGPT: '/logos/chatgpt.svg',
  Claude: '/logos/claude.svg',
  Gemini: '/logos/gemini.svg',
  Perplexity: '/logos/perplexity.svg',
  Grok: '/logos/grok-icon.svg',
  'AI Overviews': '/logos/google-ai.svg'
}

type Platform = { name: string; score: number; strong: boolean }

type Props = {
  platforms: Platform[]
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

export default function PlatformPanel({ platforms }: Props) {
  const [ref, on] = useReveal()
  return (
    <div ref={ref}>
      <WindowChrome label="Engines / per-platform scores">
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
              {platforms.length} engines
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
              Live sample
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10
            }}
          >
            {platforms.map((p, i) => (
              <div
                key={p.name}
                style={{
                  borderRadius: 14,
                  border: '1px solid var(--line)',
                  background: 'var(--subtle)',
                  padding: 16,
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateY(8px)',
                  transition: `all .5s ease ${i * 80}ms`
                }}
              >
                <div
                  style={{
                    height: 40,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={ENGINE_LOGO[p.name]}
                    alt={p.name}
                    style={{
                      height: p.name === 'Grok' ? 36 : 30,
                      width: 'auto',
                      filter: 'var(--logo-filter, brightness(0))',
                      display: 'block'
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: 12,
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.4rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: 'var(--ink)',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {p.score}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.66rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: p.strong ? 'var(--positive)' : 'var(--ink-50)'
                    }}
                  >
                    {p.strong ? 'Strong' : 'Weak'}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    height: 5,
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
                      background: p.strong ? 'var(--ink)' : 'var(--ink-40)',
                      width: on ? `${p.score}%` : '0%',
                      transition: `width .9s var(--ease-out-expo) ${i * 80 + 120}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </WindowChrome>
    </div>
  )
}

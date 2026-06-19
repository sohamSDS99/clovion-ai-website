'use client'

import { useState, useEffect, useRef } from 'react'
import WindowChrome from './WindowChrome'

const ENGINE_LOGO: Record<string, string> = {
  ChatGPT: '/logos/chatgpt.svg',
  Claude: '/logos/claude.svg',
  Gemini: '/logos/gemini.svg',
  Perplexity: '/logos/perplexity.svg',
  Grok: '/logos/grok-icon.svg',
  'AI Overviews': '/logos/google-ai.svg',
}

const GRID_ENGINES = [
  { name: 'ChatGPT', rank: 1, conf: 94 },
  { name: 'Claude', rank: 2, conf: 86 },
  { name: 'Perplexity', rank: 2, conf: 89 },
  { name: 'Gemini', rank: 3, conf: 78 },
  { name: 'Grok', rank: 5, conf: 64 },
  { name: 'AI Overviews', rank: 4, conf: 71 },
]

function useReveal(): [React.MutableRefObject<any>, boolean] {
  const ref = useRef<any>(null)
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [on, setOn] = useState<boolean>(reduce ? true : false)
  useEffect(() => {
    if (reduce) return
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => setOn(true))
      ;(ref as any)._r2 = r2
    })
    const t = setTimeout(() => setOn(true), 120)
    return () => {
      cancelAnimationFrame(r1)
      if ((ref as any)._r2) cancelAnimationFrame((ref as any)._r2)
      clearTimeout(t)
    }
  }, [reduce])
  return [ref, on]
}

function EngineLogo({ name, height = 16 }: { name: string; height?: number }) {
  return (
    <img
      src={ENGINE_LOGO[name]}
      alt={name}
      style={{
        height,
        width: 'auto',
        display: 'block',
        filter: 'var(--logo-filter, brightness(0))',
      }}
    />
  )
}

export default function EngineGrid() {
  const [ref, on] = useReveal()
  return (
    <div ref={ref}>
      <WindowChrome label="Engine coverage · LLM rank">
        <div style={{ padding: 20 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-50)',
              }}
            >
              6 engines
            </span>
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
              <span
                style={{
                  height: 6,
                  width: 6,
                  borderRadius: 999,
                  background: 'var(--positive)',
                }}
              />
              Refreshed 24h ago
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2,1fr)',
              gap: 10,
            }}
          >
            {GRID_ENGINES.map((e, i) => (
              <div
                key={e.name}
                style={{
                  borderRadius: 14,
                  border: '1px solid var(--line)',
                  background: 'var(--subtle)',
                  padding: 16,
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateY(8px)',
                  transition: `all .5s ease ${i * 80}ms`,
                }}
              >
                <div
                  style={{
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <EngineLogo name={e.name} height={e.name === 'Grok' ? 42 : 38} />
                </div>
                <div
                  style={{
                    marginTop: 14,
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    #{e.rank}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--ink-55, var(--ink-60))',
                    }}
                  >
                    {e.conf}% conf
                  </span>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    height: 5,
                    borderRadius: 999,
                    background: 'var(--ink-07)',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      height: '100%',
                      borderRadius: 999,
                      background: 'var(--ink)',
                      width: on ? `${e.conf}%` : '0%',
                      transition: `width .9s var(--ease-out-expo) ${i * 80 + 120}ms`,
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

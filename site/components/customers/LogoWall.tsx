'use client'

import { useEffect, useState } from 'react'
import { Window } from './utils'

const TILES = [
  { name: 'Linear', industry: 'SaaS', metric: '8.4x', label: 'AI mentions' },
  { name: 'Vercel', industry: 'SaaS', metric: '5.2x', label: 'citations' },
  { name: 'Notion', industry: 'SaaS', metric: '3.1x', label: 'share of voice' },
  { name: 'Ramp', industry: 'Fintech', metric: '3.2x', label: 'citation share' },
  { name: 'Webflow', industry: 'SaaS', metric: '4.6x', label: 'lift' },
  { name: 'Figma', industry: 'SaaS', metric: '#1', label: 'sentiment' },
  { name: 'Brex', industry: 'Fintech', metric: '10', label: 'engines' },
  { name: 'Loom', industry: 'SaaS', metric: 'Won', label: 'on ChatGPT' },
  { name: 'Hone', industry: 'Consumer', metric: '24h', label: 'first score' }
] as const

export default function LogoWall() {
  const [active, setActive] = useState(0)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(m.matches)
  }, [])

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => {
      setActive((a) => (a + 1) % TILES.length)
    }, 1800)
    return () => clearInterval(id)
  }, [reduce])

  return (
    <div className="overflow-x-auto md:overflow-visible">
      <div className="min-w-[420px] md:min-w-0">
        <Window label="Clovion AI / Customers / Production roster">
          <div style={{ padding: 22 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                marginBottom: 14
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--ink-50)'
                }}
              >
                Live roster
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.64rem',
                  color: 'var(--positive)'
                }}
              >
                <span
                  style={{
                    height: 6,
                    width: 6,
                    borderRadius: 999,
                    background: 'var(--positive)',
                    animation: reduce ? 'none' : 'clv-pulse 1.4s ease-in-out infinite'
                  }}
                />
                Tracking 200+ workspaces
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8
              }}
            >
              {TILES.map((t, i) => {
                const isActive = i === active
                return (
                  <div
                    key={t.name}
                    style={{
                      position: 'relative',
                      aspectRatio: '1.15',
                      borderRadius: 14,
                      background: isActive ? 'var(--ink)' : 'var(--subtle)',
                      border: '1px solid var(--line)',
                      padding: 12,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'background .45s var(--ease-out-expo), color .45s var(--ease-out-expo), transform .45s var(--ease-out-expo)',
                      transform: isActive ? 'translateY(-2px)' : 'none',
                      color: isActive ? 'var(--white)' : 'var(--ink)',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1
                      }}
                    >
                      {t.name}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          letterSpacing: '-0.02em',
                          fontVariantNumeric: 'tabular-nums',
                          color: isActive ? 'var(--positive)' : 'var(--ink)'
                        }}
                      >
                        {t.metric}
                      </div>
                      <div
                        style={{
                          marginTop: 2,
                          fontSize: '0.66rem',
                          color: isActive ? 'rgba(255,255,255,0.65)' : 'var(--ink-55, var(--ink-60))',
                          lineHeight: 1.25
                        }}
                      >
                        {t.label}
                      </div>
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.56rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.12em',
                        color: isActive ? 'rgba(255,255,255,0.5)' : 'var(--ink-40)'
                      }}
                    >
                      {t.industry}
                    </div>
                  </div>
                )
              })}
            </div>

            <div
              style={{
                marginTop: 16,
                paddingTop: 14,
                borderTop: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  color: 'var(--ink-50)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em'
                }}
              >
                {TILES[active].name} · {TILES[active].industry}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  color: 'var(--ink-50)',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {String(active + 1).padStart(2, '0')} / {String(TILES.length).padStart(2, '0')}
              </div>
            </div>
          </div>
        </Window>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

type SamplePrompt = {
  prompt: string
  excerpt: string
  engines: string[]
  brandMentioned: boolean
  brandWord: string
}

type Props = {
  prompts: SamplePrompt[]
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

// Escape regex special chars before constructing the highlight RegExp.
// Without this, brand names containing characters like "." or "+" (e.g.
// "Booking.com") throw or mis-match.
const REGEX_ESCAPE = /[.*+?^${}()|[\]\\]/g
function escapeForRegex(s: string): string {
  return s.replace(REGEX_ESCAPE, '\\$&')
}

function HighlightedExcerpt({ text, brand }: { text: string; brand: string }) {
  if (!brand || !text) return <span>{text || ''}</span>
  const parts = text.split(new RegExp(`(${escapeForRegex(brand)})`, 'gi'))
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === brand.toLowerCase() ? (
          <span
            key={i}
            style={{
              background: 'var(--positive-bg)',
              border: '1px solid var(--positive-border)',
              color: 'var(--positive)',
              borderRadius: 6,
              padding: '1px 6px',
              fontWeight: 600
            }}
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

export default function PromptCards({ prompts }: Props) {
  const [ref, on] = useReveal()
  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
    >
      {prompts.map((p, i) => (
        <article
          key={i}
          style={{
            background: 'var(--white)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-card)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-card)',
            opacity: on ? 1 : 0,
            transform: on ? 'none' : 'translateY(10px)',
            transition: `all .6s ease ${i * 110}ms`
          }}
        >
          <div
            style={{
              padding: '18px 22px',
              borderBottom: '1px solid var(--line)',
              background: 'var(--subtle)'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-50)',
                marginBottom: 8
              }}
            >
              Buyer prompt · {String(i + 1).padStart(2, '0')}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.02rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                lineHeight: 1.35
              }}
            >
              “{p.prompt}”
            </div>
          </div>

          <div
            style={{
              padding: '20px 22px',
              flex: 1,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              lineHeight: 1.6,
              color: 'var(--ink-70)'
            }}
          >
            {p.brandMentioned ? (
              <HighlightedExcerpt text={p.excerpt} brand={p.brandWord} />
            ) : (
              <>
                <span>{p.excerpt}</span>
                <div
                  style={{
                    marginTop: 14,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--ink-50)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                >
                  [brand not mentioned]
                </div>
              </>
            )}
          </div>

          <div
            style={{
              padding: '14px 22px',
              borderTop: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-50)'
              }}
            >
              Engines:
            </span>
            {p.engines.map((e) => (
              <span
                key={e}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--ink-70)',
                  border: '1px solid var(--line)',
                  borderRadius: 999,
                  padding: '3px 9px'
                }}
              >
                {e}
              </span>
            ))}
            <span
              style={{
                marginLeft: 'auto',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: p.brandMentioned ? 'var(--positive)' : 'var(--ink-50)'
              }}
            >
              {p.brandMentioned ? '✓ Mentioned' : '— Not mentioned'}
            </span>
          </div>
        </article>
      ))}
    </div>
  )
}

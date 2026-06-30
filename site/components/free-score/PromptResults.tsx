'use client'

// Single-engine (ChatGPT) per-prompt summary — replaces PlatformPanel in the
// v2 page. Derives a mention/citation summary from the ~10 scored prompts and
// lists each with a hit / miss / cited marker. On-brand: var(--*) tokens,
// emerald for affordance, the single muted red for misses.

import { useEffect, useRef, useState } from 'react'
import WindowChrome from './WindowChrome'

type PromptRow = {
  prompt: string
  brandMentioned: boolean
  cited?: boolean
}

type Props = {
  prompts: PromptRow[]
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

const MONO_LABEL: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--ink-50)',
}

export default function PromptResults({ prompts }: Props) {
  const [ref, on] = useReveal()
  const total = prompts.length
  const mentioned = prompts.filter((p) => p.brandMentioned).length
  const cited = prompts.filter((p) => p.cited).length

  return (
    <div ref={ref}>
      <WindowChrome label="ChatGPT / per-prompt visibility">
        <div style={{ padding: 22 }}>
          {/* header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
            }}
          >
            <span style={MONO_LABEL}>{total} buyer prompts</span>
            <span style={{ ...MONO_LABEL, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{ height: 6, width: 6, borderRadius: 999, background: 'var(--positive)' }}
              />
              ChatGPT · live sample
            </span>
          </div>

          {/* summary stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
            <Stat label="Mentions you" value={`${mentioned}/${total}`} on={on} delay={0} />
            <Stat label="Cites your domain" value={`${cited}/${total}`} on={on} delay={80} />
          </div>

          {/* per-prompt list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {prompts.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: 'var(--subtle)',
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateY(6px)',
                  transition: `all .45s ease ${i * 45}ms`,
                }}
              >
                <Marker hit={p.brandMentioned} />
                <span
                  style={{
                    flex: 1,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--ink-70)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={p.prompt}
                >
                  {p.prompt}
                </span>
                {p.cited ? (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--positive)',
                      border: '1px solid var(--positive-border)',
                      background: 'var(--positive-bg)',
                      borderRadius: 999,
                      padding: '2px 7px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    cited
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </WindowChrome>
    </div>
  )
}

function Stat({ label, value, on, delay }: { label: string; value: string; on: boolean; delay: number }) {
  return (
    <div
      style={{
        borderRadius: 14,
        border: '1px solid var(--line)',
        background: 'var(--subtle)',
        padding: 16,
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(8px)',
        transition: `all .5s ease ${delay}ms`,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.6rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </div>
      <div style={{ ...MONO_LABEL, marginTop: 6 }}>{label}</div>
    </div>
  )
}

function Marker({ hit }: { hit: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        height: 18,
        width: 18,
        flexShrink: 0,
        borderRadius: 999,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: hit ? 'var(--positive)' : '#e5484d',
        background: hit ? 'var(--positive-bg)' : 'rgba(229,72,77,0.12)',
        border: `1px solid ${hit ? 'var(--positive-border)' : 'rgba(229,72,77,0.34)'}`,
      }}
    >
      {hit ? '✓' : '–'}
    </span>
  )
}

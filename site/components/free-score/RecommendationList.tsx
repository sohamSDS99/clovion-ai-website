'use client'

import { useEffect, useRef, useState } from 'react'

type Recommendation = {
  severity: string
  problem: string
  fix: string
  lift: string
}

type Props = {
  items: Recommendation[]
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

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 8h10m-4-4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SeverityPill({ severity }: { severity: string }) {
  if (severity === 'HIGH') {
    return (
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.66rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          background: 'var(--ink)',
          color: 'var(--on-ink, #fff)',
          padding: '4px 10px',
          borderRadius: 6,
          fontWeight: 600
        }}
      >
        HIGH
      </span>
    )
  }
  if (severity === 'MED') {
    return (
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.66rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          border: '1px solid var(--ink)',
          color: 'var(--ink)',
          padding: '4px 10px',
          borderRadius: 6,
          fontWeight: 600
        }}
      >
        MED
      </span>
    )
  }
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.66rem',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        border: '1px solid var(--ink-30)',
        color: 'var(--ink-60)',
        padding: '4px 10px',
        borderRadius: 6,
        fontWeight: 600
      }}
    >
      LOW
    </span>
  )
}

export default function RecommendationList({ items }: Props) {
  const [ref, on] = useReveal()
  return (
    <div ref={ref} style={{ display: 'grid', gap: 14 }}>
      {items.map((r, i) => (
        <article
          key={i}
          style={{
            background: 'var(--white)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-card)',
            padding: '22px 26px',
            boxShadow: 'var(--shadow-card)',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            alignItems: 'center',
            gap: 24,
            opacity: on ? 1 : 0,
            transform: on ? 'none' : 'translateY(8px)',
            transition: `all .55s ease ${i * 110}ms`
          }}
          className="md:gap-6"
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SeverityPill severity={r.severity} />
          </div>
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                color: 'var(--ink)',
                margin: 0
              }}
            >
              {r.problem}
            </h3>
            <p
              style={{
                marginTop: 8,
                fontSize: '0.95rem',
                lineHeight: 1.55,
                color: 'var(--ink-70)'
              }}
            >
              {r.fix}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-50)'
              }}
            >
              Est. lift
            </div>
            <div
              style={{
                marginTop: 4,
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {r.lift}
            </div>
            <a
              href="/pricing"
              style={{
                marginTop: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--ink)',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              See plan <ArrowRight />
            </a>
          </div>
        </article>
      ))}
    </div>
  )
}

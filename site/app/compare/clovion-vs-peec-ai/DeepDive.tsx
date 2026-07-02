'use client'

import { useEffect, useState } from 'react'

/**
 * DeepDive — collapsible "Detailed feature breakdown" for the Clovion vs Peec AI
 * comparison page. Progressive disclosure keeps the page scannable instead of a
 * wall of text: each of the 8 breakdown points opens to show the Clovion side
 * and the Peec AI side. All copy is verbatim from the source brief.
 *
 * Dark-theme rules (Clovion brandbook): colours via var(--*) tokens only so they
 * flip correctly under .clv-dark. Never put var(--*) inside a transition
 * shorthand — inline the literal cubic-bezier instead.
 */

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

export type DeepDiveItem = {
  n: string
  title: string
  intro?: string
  clovion: string[]
  peec: string[]
}

function PlusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function SideBlock({
  label,
  paragraphs,
  emphasized
}: {
  label: string
  paragraphs: string[]
  emphasized?: boolean
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: '1px solid var(--line)',
        background: emphasized ? 'var(--subtle)' : 'var(--white)',
        padding: '20px 22px'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: emphasized ? 'var(--ink)' : 'var(--ink-50)',
          marginBottom: 12
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: emphasized ? 'var(--ink)' : 'var(--ink-25)'
          }}
        />
        {label}
      </div>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            margin: i === 0 ? 0 : '12px 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.62,
            color: 'var(--ink-70)'
          }}
        >
          {p}
        </p>
      ))}
    </div>
  )
}

function Row({
  item,
  open,
  onToggle,
  reduceMotion
}: {
  item: DeepDiveItem
  open: boolean
  onToggle: () => void
  reduceMotion: boolean
}) {
  const iconTransition = reduceMotion ? 'none' : `transform .25s ${EASE}`
  const panelTransition = reduceMotion ? 'none' : `max-height .4s ${EASE}, opacity .4s ${EASE}`

  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '24px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'var(--font-display)',
          color: 'var(--ink)'
        }}
      >
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            letterSpacing: '0.02em',
            color: open ? 'var(--ink)' : 'var(--ink-40)',
            width: 28,
            transition: reduceMotion ? 'none' : `color .25s ${EASE}`
          }}
        >
          {item.n}
        </span>
        <span
          style={{
            flex: 1,
            fontSize: '1.12rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--ink)'
          }}
        >
          {item.title}
        </span>
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            color: 'var(--ink-60)',
            transform: open ? 'rotate(45deg)' : 'none',
            transition: iconTransition
          }}
        >
          <PlusIcon size={18} />
        </span>
      </button>
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? 1600 : 0,
          opacity: open ? 1 : 0,
          transition: panelTransition
        }}
      >
        <div style={{ padding: '0 0 28px', paddingLeft: 48 }}>
          {item.intro && (
            <p
              style={{
                margin: '0 0 18px',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'var(--ink)',
                maxWidth: 720
              }}
            >
              {item.intro}
            </p>
          )}
          <div className="dd-grid">
            <SideBlock label="Clovion AI" paragraphs={item.clovion} emphasized />
            {item.peec.length > 0 && <SideBlock label="Peec AI" paragraphs={item.peec} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export function DeepDive({ items }: { items: DeepDiveItem[] }) {
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set())
  const reduceMotion = useReducedMotion()

  const toggle = (i: number) => {
    setOpenSet((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div>
      {/* Local responsive rule for the two-up side blocks — single column on
          mobile, Clovion + Peec side-by-side from the md breakpoint up. */}
      <style>{`
        .dd-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 768px) { .dd-grid { grid-template-columns: 1fr 1fr; gap: 16px; } }
      `}</style>
      {items.map((item, i) => (
        <Row
          key={item.n}
          item={item}
          open={openSet.has(i)}
          onToggle={() => toggle(i)}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  )
}

export default DeepDive

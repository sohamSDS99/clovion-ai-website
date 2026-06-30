'use client'

import { useEffect, useState, type CSSProperties } from 'react'

/**
 * FAQAccordion — the canonical FAQ section for the Clovion marketing site.
 *
 * Visual contract (locked by the user):
 *   • Headline "Frequently Asked Questions" centered above the accordion.
 *     Large white Saans display weight. No eyebrow, no subtitle, no side link.
 *   • Single column, max-width ~760px, centered horizontally on a dark page bg
 *     (no card wrapper).
 *   • Every row starts CLOSED.
 *   • Multi-open — clicking a row toggles ITS state independently. Opening one
 *     does NOT close the others. State is a Set<number> of open indices.
 *   • Each row: question text left, plus icon right (rotates to × on open),
 *     thin hairline divider below.
 *   • Section padding: var(--section) 0.
 *   • prefers-reduced-motion: reduce → snaps to final (no transitions).
 *   • NEVER puts var(--*) inside a transition shorthand (React drops the
 *     longhand and nothing animates). Uses the literal cubic-bezier value.
 *   • No Tailwind color utilities — everything inline-style via var(--*).
 *
 * Reference visual: site/components/blog/FeatureContent.tsx (the FAQ section).
 * That file stays as-is — every OTHER FAQ on the site migrates to this one.
 */

export type FAQAccordionItem = { q: string; a: string }

export type FAQAccordionProps = {
  /** Override the default headline. Locked to "Frequently Asked Questions" if omitted. */
  headline?: string
  items: FAQAccordionItem[]
}

/** Cubic-bezier literal — inline this in transition shorthands instead of var(--ease-out-expo). */
const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'

const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 2rem',
}

const DISPLAY_MD: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.1,
  color: 'var(--ink)',
  textWrap: 'balance' as CSSProperties['textWrap'],
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

function FAQRow({
  q,
  a,
  open,
  onToggle,
  reduceMotion,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
  reduceMotion: boolean
}) {
  // Transition shorthands must NEVER reference var(--*) — React drops the
  // longhand and the transition silently never fires. Inline the literal.
  const iconTransition = reduceMotion ? 'none' : `transform .25s ${EASE_OUT_EXPO}`
  const panelTransition = reduceMotion ? 'none' : `max-height .35s ${EASE_OUT_EXPO}`

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
          justifyContent: 'space-between',
          gap: 24,
          padding: '22px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'var(--font-display)',
          color: 'var(--ink)',
        }}
      >
        <span
          style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
          }}
        >
          {q}
        </span>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            display: 'inline-flex',
            color: 'var(--ink-60)',
            transform: open ? 'rotate(45deg)' : 'none',
            transition: iconTransition,
          }}
        >
          <PlusIcon size={18} />
        </span>
      </button>
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? 600 : 0,
          transition: panelTransition,
        }}
      >
        <p
          style={{
            margin: 0,
            padding: '0 48px 24px 0',
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--ink-70)',
          }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

export function FAQAccordion({
  headline = 'Frequently Asked Questions',
  items,
}: FAQAccordionProps) {
  // Multi-open — each row tracks its own state independently. Opening one
  // does NOT close the others. Set<number> of open indices, ALL closed at mount.
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
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <h2 style={{ ...DISPLAY_MD, margin: 0, textAlign: 'center' }}>{headline}</h2>
        <div style={{ maxWidth: 760, margin: '40px auto 0' }}>
          {items.map((item, i) => (
            <FAQRow
              key={i}
              q={item.q}
              a={item.a}
              open={openSet.has(i)}
              onToggle={() => toggle(i)}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQAccordion

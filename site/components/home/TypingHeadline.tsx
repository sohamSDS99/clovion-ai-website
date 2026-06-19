'use client'

import { useEffect, useState, type CSSProperties, type ElementType } from 'react'

/**
 * Continuously cycling type-out / hold / delete / retype headline with a
 * blinking caret. Mirrors the design handoff's LandTypingHeadline behavior.
 * Honors prefers-reduced-motion (static full text, blinking caret only).
 */
export function TypingHeadline({
  text,
  style,
  as = 'h2',
  caretColor
}: {
  text: string
  style?: CSSProperties
  as?: ElementType
  caretColor?: string
}) {
  const [reduce, setReduce] = useState(false)
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing')

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(m.matches)
    if (m.matches) setN(text.length)
  }, [text])

  useEffect(() => {
    if (reduce) return
    let t: ReturnType<typeof setTimeout>
    if (phase === 'typing') {
      if (n < text.length) t = setTimeout(() => setN(n + 1), 58)
      else t = setTimeout(() => setPhase('holding'), 80)
    } else if (phase === 'holding') {
      t = setTimeout(() => setPhase('deleting'), 4200)
    } else {
      if (n > 0) t = setTimeout(() => setN(n - 1), 26)
      else t = setTimeout(() => setPhase('typing'), 650)
    }
    return () => clearTimeout(t)
  }, [n, phase, reduce, text])

  const blinking = reduce || phase === 'holding'
  const Tag = as

  return (
    <Tag style={style}>
      {text.slice(0, n)}
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: '0.055em',
          height: '0.82em',
          marginLeft: '0.06em',
          verticalAlign: '-0.02em',
          background: caretColor || 'currentColor',
          animation: blinking ? 'clv-blink 1.05s steps(1) infinite' : 'none'
        }}
      />
    </Tag>
  )
}

'use client'

/**
 * Recommendation Engine — shared visual system.
 *
 * Adopts fin.ai's editorial layout (numbered sections + large "technical
 * drawing" visualization panels with dashed grids and corner registration
 * marks) rendered strictly in Clovion's LIGHT-scope tokens — the same locked
 * palette the homepage and the Brand Audit / Brand Perception feature pages
 * ship. NO off-palette colors: ink + alphas of ink, emerald `--positive` for
 * affordance / "resolved", and three restrained semantic hues (source /
 * substance / framing fix classes) used ONLY inside product mocks (pills, dots,
 * tags), exactly as the brand book permits.
 *
 * The page is NOT wrapped in `.clv-dark` — tokens default to their light values
 * and `--bg` is scoped to #FAF9F7 so the tone matches the homepage. Motion
 * degrades to a static final state under prefers-reduced-motion.
 */

import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

/* ── Layout / type constants ───────────────────────────────────── */
export const S_CONTAINER: CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 1.5rem',
}
export const S_DISPLAY_LG: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-lg)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-lg)',
  lineHeight: 1.02,
  textWrap: 'balance' as CSSProperties['textWrap'],
  color: 'var(--ink)',
}
export const S_DISPLAY_MD: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.06,
  textWrap: 'balance' as CSSProperties['textWrap'],
  color: 'var(--ink)',
}
export const S_LEAD: CSSProperties = {
  fontFamily: 'var(--font-body-reg, var(--font-body))',
  fontSize: 'var(--text-lead)',
  lineHeight: 1.6,
  fontWeight: 400,
  color: 'var(--ink-70)',
}
export const S_BODY: CSSProperties = {
  fontFamily: 'var(--font-body-reg, var(--font-body))',
  fontSize: '0.95rem',
  lineHeight: 1.62,
  fontWeight: 400,
  color: 'var(--ink-70)',
}
export const MONO: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
}

/* ── Fix-class semantics (the three gap / fix classes) ─────────────
   Restrained hues the brand book permits INSIDE product mocks only —
   used for the fix-class tag, gap dots, and the lifecycle accents. Emerald
   is the brand `--positive`; the other two are tuned to read on cream/white. */
export const FIX_CLASS = {
  source: { fg: '#b45309', bg: '#fffbeb', border: 'rgba(180,83,9,0.24)', label: 'Source presence' },
  substance: { fg: '#0369a1', bg: '#f0f9ff', border: 'rgba(3,105,161,0.22)', label: 'Substance' },
  framing: { fg: '#7c3aed', bg: '#f5f3ff', border: 'rgba(124,58,237,0.20)', label: 'Framing' },
} as const
export type FixClassKey = keyof typeof FIX_CLASS

/* Positive / negative affordance shortcuts (brand emerald + restrained red) */
export const POS = { fg: 'var(--positive)', bg: 'var(--positive-bg)', border: 'var(--positive-border)' }
export const NEG = { fg: '#dc2626', bg: '#fef2f2', border: 'rgba(220,38,38,0.24)' }

/* ── Inline icons ──────────────────────────────────────────────── */
export function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function ArrowDown({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10m-4-4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function CheckIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
export function CrossIcon({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
export function DotIcon({ size = 8, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <circle cx="4" cy="4" r="4" fill={color} />
    </svg>
  )
}
export function PinIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1.5c-2.5 0-4.5 2-4.5 4.5 0 3.2 4.5 8 4.5 8s4.5-4.8 4.5-8c0-2.5-2-4.5-4.5-4.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="8" cy="6" r="1.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
export function PulseIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M1 8h3l2-4.5L9 12l2-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Mono eyebrow ──────────────────────────────────────────────── */
export function MonoEyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span style={{ ...MONO, fontSize: '0.72rem', fontWeight: 600, color: color || 'var(--ink-60)' }}>{children}</span>
  )
}

/* ── Kicker chip (small labeled tag used inside mocks) ─────────── */
export function Chip({
  children,
  fg = 'var(--ink-70)',
  bg = 'var(--subtle)',
  border = 'var(--line)',
  mono = true,
}: {
  children: ReactNode
  fg?: string
  bg?: string
  border?: string
  mono?: boolean
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 9px',
        borderRadius: 999,
        border: `1px solid ${border}`,
        background: bg,
        color: fg,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body-reg, var(--font-body))',
        fontSize: '0.66rem',
        fontWeight: 600,
        letterSpacing: mono ? '0.08em' : '0',
        textTransform: mono ? 'uppercase' : 'none',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}
    >
      {children}
    </span>
  )
}

/* ── In-view hook (scroll trigger, reduced-motion aware) ───────── */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  opts: { threshold?: number; once?: boolean; rootMargin?: string } = {}
): [React.RefObject<T>, boolean] {
  const { threshold = 0.24, once = true, rootMargin = '0px 0px -8% 0px' } = opts
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true)
            if (once) io.unobserve(e.target)
          } else if (!once) {
            setInView(false)
          }
        })
      },
      { threshold, rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once, rootMargin])

  return [ref, inView]
}

/** Reduced-motion flag (client-only). */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const on = () => setReduce(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return reduce
}

/**
 * Scroll-triggered fade + rise wrapper. Snaps to final immediately under
 * reduced motion (the transition literal is dropped and opacity starts at 1).
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  style,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  style?: CSSProperties
  className?: string
  as?: keyof JSX.IntrinsicElements
}) {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const T = Tag as any
  const on = reduce || inView
  return (
    <T
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : `translateY(${y}px)`,
        transition: reduce
          ? 'none'
          : 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
        ...style,
      }}
    >
      {children}
    </T>
  )
}

/* ── Typing headline (matches sibling feature pages) ───────────── */
export function TypingHeadline({
  text,
  style,
  caretColor,
  as = 'h2',
  reserve,
}: {
  text: string
  style?: CSSProperties
  caretColor?: string
  as?: keyof JSX.IntrinsicElements
  reserve?: boolean
}) {
  const [reduce, setReduce] = useState(false)
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    if (mq.matches) setN(text.length)
  }, [text])

  useEffect(() => {
    if (reduce) return
    let timer: ReturnType<typeof setTimeout> | undefined
    if (phase === 'typing') {
      if (n < text.length) timer = setTimeout(() => setN(n + 1), 42)
      else timer = setTimeout(() => setPhase('holding'), 80)
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('deleting'), 5200)
    } else {
      if (n > 0) timer = setTimeout(() => setN(n - 1), 22)
      else timer = setTimeout(() => setPhase('typing'), 700)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [n, phase, reduce, text])

  const blinking = reduce || phase === 'holding'
  const Tag = as as any

  return (
    <Tag style={reserve ? { ...style, position: 'relative' } : style}>
      {reserve && (
        <span aria-hidden style={{ visibility: 'hidden' }}>
          {text}
        </span>
      )}
      <span style={reserve ? { position: 'absolute', inset: 0 } : undefined}>
        {text.slice(0, n)}
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: '0.055em',
            height: '0.82em',
            marginLeft: '0.06em',
            verticalAlign: '-0.02em',
            background: caretColor || 'var(--ink)',
            animation: blinking ? 'clv-blink 1.05s steps(1) infinite' : 'none',
          }}
        />
      </span>
    </Tag>
  )
}

/* ── Grid field (dashed technical grid + corner registration) ──── */
function CornerMarks({ color = 'var(--ink-25)', inset = 12, len = 9 }: { color?: string; inset?: number; len?: number }) {
  const base: CSSProperties = { position: 'absolute', width: len, height: len, pointerEvents: 'none' }
  return (
    <>
      <span aria-hidden style={{ ...base, top: inset, left: inset, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <span aria-hidden style={{ ...base, top: inset, right: inset, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
      <span aria-hidden style={{ ...base, bottom: inset, left: inset, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <span aria-hidden style={{ ...base, bottom: inset, right: inset, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
    </>
  )
}

export function GridField({ cell = 34, opacity = 0.5 }: { cell?: number; opacity?: number }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg
      aria-hidden
      width="100%"
      height="100%"
      style={{ position: 'absolute', inset: 0, opacity }}
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id={`rec-${id}`} width={cell} height={cell} patternUnits="userSpaceOnUse">
          <path
            d={`M ${cell} 0 L 0 0 0 ${cell}`}
            fill="none"
            stroke="var(--ink)"
            strokeOpacity="0.14"
            strokeWidth="1"
            strokeDasharray="2 5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#rec-${id})`} />
    </svg>
  )
}

/* ── Panel (the fin.ai technical-drawing frame) ────────────────── */
export function Panel({
  children,
  label,
  status,
  background = 'var(--white)',
  pad = 22,
  grid = true,
  corners = true,
  cell,
  radius = 22,
  style,
  className,
}: {
  children: ReactNode
  label?: ReactNode
  status?: ReactNode
  background?: string
  pad?: number
  grid?: boolean
  corners?: boolean
  cell?: number
  radius?: number
  style?: CSSProperties
  className?: string
}) {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        borderRadius: radius,
        border: '1px solid var(--line)',
        background,
        overflow: 'hidden',
        ...style,
      }}
    >
      {grid && <GridField cell={cell} />}
      {corners && <CornerMarks />}
      <div style={{ position: 'relative', padding: pad }}>
        {(label || status) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              paddingBottom: 14,
              marginBottom: 16,
              borderBottom: '1px solid var(--line)',
            }}
          >
            <span style={{ ...MONO, fontSize: '0.66rem', fontWeight: 600, color: 'var(--ink-50)' }}>{label}</span>
            {status != null && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-40)', fontVariantNumeric: 'tabular-nums' }}>
                {status}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

/* ── Numbered editorial section (fin.ai composition) ───────────── */
export function NumberedSection({
  n,
  title,
  children,
  visual,
  background,
  id,
}: {
  n: string
  title: string
  children?: ReactNode
  visual?: ReactNode
  background?: string
  id?: string
}) {
  return (
    <section id={id} style={{ padding: 'var(--section) 0', background, position: 'relative' }}>
      <div style={S_CONTAINER}>
        <div className="grid grid-cols-[1.75rem_1fr] gap-x-4 md:grid-cols-[5rem_1fr] md:gap-x-10 items-start">
          <span
            aria-hidden
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.1rem, 1.4vw + 0.4rem, 1.6rem)',
              fontWeight: 600,
              color: 'var(--ink-40)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
              paddingTop: '0.35em',
            }}
          >
            {n}
          </span>
          <div style={{ maxWidth: 760 }}>
            <h2 style={{ ...S_DISPLAY_MD, margin: 0 }}>{title}</h2>
            {children && <div style={{ marginTop: 24 }}>{children}</div>}
          </div>
        </div>
        {visual && <div style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>{visual}</div>}
      </div>
    </section>
  )
}

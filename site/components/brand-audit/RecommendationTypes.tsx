'use client'

/**
 * Brand Audit — Section 04 · "Recommendations Start Here".
 *
 * Three visually-distinct finding-type cards, each tied to an improvement
 * class, each with a small emblematic mini-viz. All strictly on Clovion's dark
 * brand tokens (ink + alphas of ink, emerald `--positive` as the only accent);
 * severity hues are not used here. Cards read as three classes purely via
 * layout + emblem + a restrained emerald-vs-neutral emphasis. Motion is a
 * staggered scroll reveal; emblems settle in on reveal and snap to final under
 * prefers-reduced-motion.
 */

import { useEffect, useState, type CSSProperties } from 'react'
import {
  MONO,
  Panel,
  Reveal,
  useInView,
} from '@/components/brand-audit/primitives'
import { cb } from '@/components/home/mocks/motion'

/* ── Reduced-motion (local, matches the primitives' Reveal semantics) ── */
function usePrefersReduce(): boolean {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const on = () => setReduce(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return reduce
}

/* ── Emblem 1 · Source Presence — a constellation of source nodes with one
   obvious GAP (a hollow / absent node). ────────────────────────────────── */
function SourcePresenceEmblem({ play }: { play: boolean }) {
  const reduce = usePrefersReduce()
  const on = reduce || play
  // Small dot-map: mostly filled source nodes, one obvious hollow gap ring.
  const nodes: { x: number; y: number; gap?: boolean }[] = [
    { x: 14, y: 22 },
    { x: 42, y: 12 },
    { x: 70, y: 26 },
    { x: 96, y: 16 },
    { x: 24, y: 52 },
    { x: 58, y: 46, gap: true },
    { x: 88, y: 56 },
    { x: 16, y: 82 },
    { x: 48, y: 78 },
    { x: 82, y: 86 },
  ]
  // Faint connective lines to the missing node emphasise the absence.
  const links: [number, number][] = [
    [4, 5],
    [5, 1],
    [5, 6],
    [5, 8],
  ]
  return (
    <svg
      viewBox="0 0 110 100"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {links.map(([a, b], i) => {
        const na = nodes[a]
        const nb = nodes[b]
        return (
          <line
            key={i}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke="var(--ink)"
            strokeOpacity={0.16}
            strokeWidth={1}
            strokeDasharray="2 3"
            style={{
              opacity: on ? 1 : 0,
              transition: reduce ? 'none' : `opacity 0.6s ${cb}`,
              transitionDelay: `${260 + i * 60}ms`,
            }}
          />
        )
      })}
      {nodes.map((n, i) =>
        n.gap ? (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={4.4}
            fill="none"
            stroke="var(--ink-40)"
            strokeWidth={1.2}
            strokeDasharray="2.4 2.4"
            style={{
              opacity: on ? 1 : 0,
              transformOrigin: `${n.x}px ${n.y}px`,
              transform: on ? 'scale(1)' : 'scale(0.5)',
              transition: reduce
                ? 'none'
                : `opacity 0.5s ${cb}, transform 0.5s ${cb}`,
              transitionDelay: `${420}ms`,
            }}
          />
        ) : (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={2.6}
            fill="var(--ink-70)"
            style={{
              opacity: on ? 1 : 0,
              transformOrigin: `${n.x}px ${n.y}px`,
              transform: on ? 'scale(1)' : 'scale(0.4)',
              transition: reduce
                ? 'none'
                : `opacity 0.45s ${cb}, transform 0.45s ${cb}`,
              transitionDelay: `${120 + i * 40}ms`,
            }}
          />
        )
      )}
    </svg>
  )
}

/* ── Emblem 2 · Content Substance — a page glyph with content-depth bars that
   are only partially filled (thin): found, but too thin to cite. ────────── */
function ContentSubstanceEmblem({ play }: { play: boolean }) {
  const reduce = usePrefersReduce()
  const on = reduce || play
  // Each bar: full track (faint) + a thin filled portion (how deep the content is).
  const bars = [0.52, 0.34, 0.44, 0.24, 0.4]
  const barX = 44
  const barW = 54
  const top = 24
  const gap = 12
  return (
    <svg
      viewBox="0 0 110 100"
      width="100%"
      height="100%"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      {/* page glyph with a folded corner */}
      <path
        d="M12 12 h18 l6 6 v52 a2 2 0 0 1 -2 2 h-22 a2 2 0 0 1 -2 -2 v-56 a2 2 0 0 1 2 -2 z"
        fill="none"
        stroke="var(--ink-40)"
        strokeWidth={1.2}
        strokeLinejoin="round"
        style={{
          opacity: on ? 1 : 0,
          transition: reduce ? 'none' : `opacity 0.6s ${cb}`,
          transitionDelay: '120ms',
        }}
      />
      <path
        d="M30 12 v6 h6"
        fill="none"
        stroke="var(--ink-40)"
        strokeWidth={1.2}
        strokeLinejoin="round"
        style={{
          opacity: on ? 1 : 0,
          transition: reduce ? 'none' : `opacity 0.6s ${cb}`,
          transitionDelay: '160ms',
        }}
      />
      {bars.map((frac, i) => {
        const y = top + i * gap
        return (
          <g key={i}>
            {/* empty track */}
            <rect
              x={barX}
              y={y}
              width={barW}
              height={4}
              rx={2}
              fill="var(--ink)"
              fillOpacity={0.1}
              style={{
                opacity: on ? 1 : 0,
                transition: reduce ? 'none' : `opacity 0.4s ${cb}`,
                transitionDelay: `${200 + i * 50}ms`,
              }}
            />
            {/* thin filled portion — grows on reveal */}
            <rect
              x={barX}
              y={y}
              width={barW}
              height={4}
              rx={2}
              fill="var(--ink-70)"
              style={{
                transformOrigin: `${barX}px ${y}px`,
                transform: on ? `scaleX(${frac})` : 'scaleX(0)',
                transition: reduce ? 'none' : `transform 0.6s ${cb}`,
                transitionDelay: `${320 + i * 60}ms`,
              }}
            />
          </g>
        )
      })}
    </svg>
  )
}

/* ── Emblem 3 · Brand Framing — two conflicting description chips that disagree
   (a diff / mismatch mark between them). ────────────────────────────────── */
function BrandFramingEmblem({ play }: { play: boolean }) {
  const reduce = usePrefersReduce()
  const on = reduce || play
  const chip: CSSProperties = {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 9px',
    borderRadius: 8,
    border: '1px solid var(--line)',
    background: 'var(--subtle)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.02em',
    color: 'var(--ink-70)',
    whiteSpace: 'nowrap',
  }
  const line = (w: string, alpha: number): CSSProperties => ({
    display: 'inline-block',
    width: w,
    height: 4,
    borderRadius: 2,
    background: 'var(--ink)',
    opacity: alpha,
  })
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* top chip */}
      <div
        style={{
          ...chip,
          top: 6,
          left: 0,
          transform: on ? 'none' : 'translateX(-8px)',
          opacity: on ? 1 : 0,
          transition: reduce
            ? 'none'
            : `opacity 0.5s ${cb}, transform 0.5s ${cb}`,
          transitionDelay: '160ms',
        }}
      >
        <span style={line('24px', 0.6)} aria-hidden />
        <span style={line('16px', 0.35)} aria-hidden />
      </div>
      {/* bottom chip — offset the other way, deliberately disagreeing */}
      <div
        style={{
          ...chip,
          bottom: 6,
          right: 0,
          transform: on ? 'none' : 'translateX(8px)',
          opacity: on ? 1 : 0,
          transition: reduce
            ? 'none'
            : `opacity 0.5s ${cb}, transform 0.5s ${cb}`,
          transitionDelay: '280ms',
        }}
      >
        <span style={line('14px', 0.35)} aria-hidden />
        <span style={line('26px', 0.6)} aria-hidden />
      </div>
      {/* mismatch mark — a not-equal glyph between the two chips */}
      <svg
        viewBox="0 0 24 24"
        width={26}
        height={26}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: on
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.4)',
          opacity: on ? 1 : 0,
          transition: reduce
            ? 'none'
            : `opacity 0.45s ${cb}, transform 0.45s ${cb}`,
          transitionDelay: '420ms',
        }}
      >
        <circle cx="12" cy="12" r="10" fill="var(--white)" stroke="var(--ink-40)" strokeWidth="1.2" />
        <path d="M7 9.5h10M7 14.5h10" stroke="var(--ink-70)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M15.5 6l-7 12" stroke="var(--ink)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  )
}

/* ── Card model ────────────────────────────────────────────────────────── */
type CardDef = {
  index: string
  name: string
  body: string
  emblem: (p: { play: boolean }) => JSX.Element
  emerald: boolean
}

const CARDS: CardDef[] = [
  {
    index: 'TYPE 01',
    name: 'Source Presence',
    body: 'Your brand is missing from trusted sources AI frequently cites. Recommendations focus on expanding your presence across those surfaces.',
    emblem: SourcePresenceEmblem,
    emerald: true,
  },
  {
    index: 'TYPE 02',
    name: 'Content Substance',
    body: 'Your pages are being found, but they don’t provide enough information for AI engines to confidently cite them. Recommendations focus on strengthening existing content.',
    emblem: ContentSubstanceEmblem,
    emerald: false,
  },
  {
    index: 'TYPE 03',
    name: 'Brand Framing',
    body: 'AI engines are describing your company inaccurately or inconsistently because of conflicting information across the web. Recommendations focus on correcting the sources shaping that perception.',
    emblem: BrandFramingEmblem,
    emerald: false,
  },
]

const STATUS = ['EXPAND', 'STRENGTHEN', 'CORRECT'] as const

function TypeCard({ card, delay }: { card: CardDef; delay: number }) {
  const [ref, inView] = useInView<HTMLDivElement>()
  const cls = card.index.replace('TYPE ', '')
  return (
    <Reveal delay={delay} y={20} style={{ height: '100%' }}>
      <Panel
        label={card.index}
        status={STATUS[Number(cls) - 1]}
        pad={22}
        cell={30}
        style={{ height: '100%' }}
      >
        <div
          ref={ref}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            height: '100%',
          }}
        >
          {/* emblem — the one decisive visual moment per card */}
          <div
            aria-hidden="true"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '100%',
              height: 108,
              borderRadius: 14,
              border: `1px solid ${
                card.emerald ? 'var(--positive-border)' : 'var(--line)'
              }`,
              background: card.emerald ? 'var(--positive-bg)' : 'var(--subtle)',
              padding: 16,
              overflow: 'hidden',
            }}
          >
            <card.emblem play={inView} />
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            {card.emerald && (
              <span
                aria-hidden="true"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--positive)',
                  flexShrink: 0,
                }}
              />
            )}
            {card.name}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-body-reg, var(--font-body))',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              fontWeight: 400,
              color: 'var(--ink-70)',
              margin: 0,
            }}
          >
            {card.body}
          </p>

          <div style={{ flex: 1 }} />

          <div
            style={{
              ...MONO,
              fontSize: '0.62rem',
              fontWeight: 600,
              color: card.emerald ? 'var(--positive)' : 'var(--ink-40)',
              paddingTop: 12,
              borderTop: '1px solid var(--line)',
            }}
          >
            Improvement class {cls}
          </div>
        </div>
      </Panel>
    </Reveal>
  )
}

export function RecommendationTypes() {
  return (
    <div role="group" aria-label="Three types of brand-audit recommendations">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
        {CARDS.map((c, i) => (
          <TypeCard key={c.index} card={c} delay={i * 130} />
        ))}
      </div>
    </div>
  )
}

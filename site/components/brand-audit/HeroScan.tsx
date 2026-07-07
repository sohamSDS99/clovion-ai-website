'use client'

/**
 * Brand Audit — HERO visualization: an animated "AI footprint scan".
 *
 * One wide Panel framing a left→right flow: a column of SOURCE NODES on the
 * left, a middle scan zone (vertical sweep + faint converging connectors) where
 * Clovion reads them, and a resolved BRAND PROFILE card on the right that fills
 * in as the scan completes — a visibility score count-up plus resolved
 * attribute rows, footed by the four engines analyzed.
 *
 * Palette locked to Clovion's dark brand book: ink + alphas of ink on near-black,
 * emerald --positive as the only affordance hue, severity only as tiny badges.
 * All motion degrades to a static final state under prefers-reduced-motion.
 */

import { CSSProperties } from 'react'
import {
  MONO,
  Panel,
  useInView,
  CheckIcon,
} from '@/components/brand-audit/primitives'
import {
  cb,
  useReducedMotion,
  useCountUp,
  useStagger,
} from '@/components/home/mocks/motion'

/* ── Illustrative sample data (mock content, on-brand for AEO) ─────── */
const SOURCES = [
  { label: 'Website', hint: 'clovion.ai' },
  { label: 'Review platforms', hint: 'G2 · Capterra' },
  { label: 'Analyst reports', hint: 'Forrester · Gartner' },
  { label: 'Communities', hint: 'Reddit · Hacker News' },
  { label: 'Directories', hint: 'Crunchbase · Product Hunt' },
  { label: 'Editorial sites', hint: 'TechCrunch · The Verge' },
] as const

const ATTRIBUTES = [
  { label: 'Source presence', value: 'Broad', positive: true },
  { label: 'Content depth', value: 'Adequate', positive: true },
  { label: 'Consistency', value: 'Mixed', positive: false },
  { label: 'Factual accuracy', value: 'Verified', positive: true },
] as const

const ENGINES = [
  { src: '/logos/chatgpt.svg', name: 'ChatGPT' },
  { src: '/logos/claude.svg', name: 'Claude' },
  { src: '/logos/gemini.svg', name: 'Gemini' },
  { src: '/logos/perplexity.svg', name: 'Perplexity' },
] as const

const S_ROW_LABEL: CSSProperties = {
  fontFamily: 'var(--font-body-reg, var(--font-body))',
  fontSize: '0.82rem',
  fontWeight: 500,
  color: 'var(--ink-90)',
  lineHeight: 1.2,
}
const S_ROW_HINT: CSSProperties = {
  ...MONO,
  fontSize: '0.6rem',
  fontWeight: 600,
  color: 'var(--ink-40)',
  marginTop: 3,
}

export function HeroScan() {
  const reduce = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.32 })
  const play = reduce || inView

  const nodes = useStagger(SOURCES.length, play, 90, 120)
  const attrs = useStagger(ATTRIBUTES.length, play, 110, 640)
  const score = useCountUp(62, play, { durationMs: 1400, startMs: 300 })

  return (
    <div ref={ref} role="img" aria-label="Clovion scanning website and third-party sources into a brand profile">
      {!reduce && (
        <style>{'@keyframes clv-hs-sweep{0%{top:0%;opacity:0}12%{opacity:0.85}88%{opacity:0.85}100%{top:100%;opacity:0}}'}</style>
      )}
      <Panel label="AI footprint scan" status={play ? 'Complete' : 'Scanning'}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:gap-8 items-stretch">
          {/* ── Left + scan zone ─────────────────────────────────── */}
          <div style={{ position: 'relative' }}>
            <span style={{ ...MONO, fontSize: '0.6rem', fontWeight: 600, color: 'var(--ink-50)' }}>
              Sources reviewed
            </span>

            <div
              style={{
                position: 'relative',
                marginTop: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {/* Faint converging connectors (decorative) */}
              <svg
                aria-hidden
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, opacity: play ? 0.5 : 0, transition: `opacity 0.9s ${cb}`, pointerEvents: 'none' }}
              >
                {SOURCES.map((_, i) => {
                  const y = ((i + 0.5) / SOURCES.length) * 100
                  return (
                    <path
                      key={i}
                      d={`M2 ${y} C 46 ${y}, 60 50, 100 50`}
                      fill="none"
                      stroke="var(--ink)"
                      strokeOpacity="0.16"
                      strokeWidth="0.5"
                      strokeDasharray="1.4 2.2"
                      vectorEffect="non-scaling-stroke"
                    />
                  )
                })}
              </svg>

              {/* Vertical sweeping scan line (top → bottom loop) */}
              {!reduce && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: -2,
                    right: -2,
                    top: 0,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, var(--positive), transparent)',
                    animation: 'clv-hs-sweep 3.4s ease-in-out infinite',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
              )}

              {SOURCES.map((s, i) => {
                const on = nodes[i]
                return (
                  <div
                    key={s.label}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 11,
                      border: '1px solid var(--line)',
                      background: 'var(--subtle)',
                      opacity: on ? 1 : 0,
                      transform: on ? 'none' : 'translateX(-10px)',
                      transition: reduce
                        ? 'none'
                        : `opacity 0.5s ${cb}, transform 0.5s ${cb}`,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        flexShrink: 0,
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: 'var(--positive)',
                        boxShadow: '0 0 0 3px rgba(52,211,153,0.14)',
                      }}
                    />
                    <span style={{ minWidth: 0 }}>
                      <span style={{ ...S_ROW_LABEL, display: 'block' }}>{s.label}</span>
                      <span style={{ ...S_ROW_HINT, display: 'block' }}>{s.hint}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Right: resolved brand profile ─────────────────────── */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              padding: 18,
              borderRadius: 14,
              border: '1px solid var(--line)',
              background: 'var(--subtle)',
              opacity: play ? 1 : 0.35,
              transition: reduce ? 'none' : `opacity 0.8s ${cb}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ ...MONO, fontSize: '0.6rem', fontWeight: 600, color: 'var(--ink-50)' }}>
                Brand profile
              </span>
              <span
                style={{
                  ...MONO,
                  fontSize: '0.55rem',
                  fontWeight: 600,
                  color: 'var(--positive)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 8px',
                  borderRadius: 999,
                  border: '1px solid var(--positive-border)',
                  background: 'var(--positive-bg)',
                }}
              >
                <CheckIcon size={9} />
                Resolved
              </span>
            </div>

            {/* Visibility score count-up */}
            <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.6rem, 6vw, 3.4rem)',
                  fontWeight: 600,
                  lineHeight: 1,
                  color: 'var(--ink)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {score}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--ink-50)' }}>
                / 100
              </span>
            </div>
            <span style={{ ...MONO, fontSize: '0.6rem', fontWeight: 600, color: 'var(--ink-40)', marginTop: 4 }}>
              Visibility score
            </span>

            {/* Score track */}
            <span
              aria-hidden
              style={{
                position: 'relative',
                display: 'block',
                marginTop: 12,
                height: 4,
                borderRadius: 999,
                background: 'var(--ink-10)',
                overflow: 'hidden',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: 'left center',
                  width: '62%',
                  borderRadius: 999,
                  background: 'var(--positive)',
                  transform: play ? 'scaleX(1)' : 'scaleX(0)',
                  transition: reduce ? 'none' : `transform 1.4s ${cb}`,
                  transitionDelay: reduce ? '0ms' : '300ms',
                }}
              />
            </span>

            {/* Resolved attribute rows */}
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {ATTRIBUTES.map((a, i) => {
                const on = attrs[i]
                return (
                  <div
                    key={a.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '8px 0',
                      borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                      opacity: on ? 1 : 0,
                      transform: on ? 'none' : 'translateY(6px)',
                      transition: reduce ? 'none' : `opacity 0.45s ${cb}, transform 0.45s ${cb}`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-body-reg, var(--font-body))',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        color: 'var(--ink-80)',
                      }}
                    >
                      {a.label}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.66rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: a.positive ? 'var(--positive)' : 'var(--ink-50)',
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: a.positive ? 'var(--positive)' : 'var(--ink-25)',
                        }}
                      />
                      {a.value}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Engines analyzed */}
            <div
              style={{
                marginTop: 'auto',
                paddingTop: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                borderTop: '1px solid var(--line)',
              }}
            >
              <span style={{ ...MONO, fontSize: '0.55rem', fontWeight: 600, color: 'var(--ink-40)' }}>
                Engines analyzed
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
                {ENGINES.map((e) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={e.name}
                    src={e.src}
                    alt={e.name}
                    height={15}
                    style={{ height: 15, width: 'auto', filter: 'var(--logo-filter)', opacity: 0.9 }}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

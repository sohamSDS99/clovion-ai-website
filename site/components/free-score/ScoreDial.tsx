'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import WindowChrome from './WindowChrome'

const ENGINE_LOGO: Record<string, string> = {
  ChatGPT: '/logos/chatgpt.svg',
  Claude: '/logos/claude.svg',
  Gemini: '/logos/gemini.svg',
  Perplexity: '/logos/perplexity.svg',
  Grok: '/logos/grok-icon.svg',
  'AI Overviews': '/logos/google-ai.svg'
}

const ANALYSIS_STEPS = [
  'Fetching brand context',
  'Querying ChatGPT with buyer prompts',
  'Querying Claude, Perplexity, AI Overviews',
  'Analyzing sentiment and citations',
  'Benchmarking against competitors'
]

type Stage = 'idle' | 'analyzing' | 'result'

type Platform = { name: string; score: number; strong: boolean }

type Props = {
  stage: Stage
  score: number
  subscoreSummary: { label: string; value: number }[]
  platforms: Platform[]
  submittedDomain: string
  stepIndex: number
}

/* easeOutCubic count-up on the headline score */
function useCountUp(target: number, play: boolean, duration = 1100) {
  const [v, setV] = useState<number>(play ? 0 : target)
  useEffect(() => {
    if (!play) return
    const start = Date.now()
    setV(0)
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / duration)
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p >= 1) {
        setV(target)
        clearInterval(id)
      }
    }, 32)
    return () => clearInterval(id)
  }, [play, target, duration])
  return v
}

export default function ScoreDial({
  stage,
  score,
  subscoreSummary,
  platforms,
  submittedDomain,
  stepIndex
}: Props) {
  const filled = stage === 'result'
  // Clamp to [0,100] and guard against NaN/undefined/Infinity. Without
  // this the arc math goes negative or NaN and the dial fails to render.
  const clampedScore = Number.isFinite(score) ? Math.max(0, Math.min(100, score)) : 0
  const displayedScore = useCountUp(clampedScore, filled, 1200)

  // Arc math
  const RADIUS = 130
  const STROKE = 9
  const CIRC = 2 * Math.PI * RADIUS
  const ARC_FRACTION = 0.75
  const ARC_LEN = CIRC * ARC_FRACTION
  const fillLen = filled ? ARC_LEN * (clampedScore / 100) : 0

  const label = stage === 'idle'
    ? 'Awaiting domain'
    : stage === 'analyzing'
      ? `Scanning ${submittedDomain || 'domain'}…`
      : `Scored ${submittedDomain}`

  return (
    <div className="overflow-x-auto md:overflow-visible">
      <div className="min-w-[420px] md:min-w-0">
        <WindowChrome label="Clovion AI / Free Visibility Score">
          <div style={{ padding: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12
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
                AI visibility score
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.64rem',
                  color: stage === 'analyzing' ? 'var(--ink-50)' : 'var(--positive)',
                  transition: 'color .3s ease'
                }}
              >
                <span
                  style={{
                    height: 6,
                    width: 6,
                    borderRadius: 999,
                    background: stage === 'analyzing' ? 'var(--ink-40)' : 'var(--positive)',
                    animation: stage === 'analyzing' ? 'clv-pulse 1s ease-in-out infinite' : 'none'
                  }}
                />
                {label}
              </span>
            </div>

            {/* DIAL */}
            <div
              style={{
                marginTop: 20,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 220
              }}
            >
              <svg viewBox="-160 -160 320 320" width={260} height={220} aria-hidden>
                <circle
                  cx="0"
                  cy="0"
                  r={RADIUS}
                  fill="none"
                  stroke="var(--ink-07)"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${ARC_LEN} ${CIRC}`}
                  transform="rotate(135)"
                />
                <circle
                  cx="0"
                  cy="0"
                  r={RADIUS}
                  fill="none"
                  stroke="var(--ink)"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${fillLen} ${CIRC}`}
                  transform="rotate(135)"
                  style={{
                    transition: 'stroke-dasharray 1.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {stage === 'analyzing' ? (
                  <AnalyzingDots />
                ) : (
                  <>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '4rem',
                        fontWeight: 600,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        color: 'var(--ink)',
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {stage === 'result' ? displayedScore : '—'}
                    </span>
                    <span
                      style={{
                        marginTop: 8,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--ink-50)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase'
                      }}
                    >
                      / 100
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* PLATFORM ROWS */}
            <div style={{ marginTop: 16, display: 'grid', gap: 6 }}>
              {platforms.map((p, i) => (
                <PlatformRow
                  key={p.name}
                  name={p.name}
                  score={p.score}
                  strong={p.strong}
                  filled={filled}
                  index={i}
                />
              ))}
            </div>

            {/* Analyzing step indicator (replaces the bottom area during scan) */}
            {stage === 'analyzing' && (
              <div
                style={{
                  marginTop: 18,
                  padding: '14px 16px',
                  borderTop: '1px solid var(--line)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--ink-70)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <Spinner />
                <span>{ANALYSIS_STEPS[Math.min(stepIndex, ANALYSIS_STEPS.length - 1)]}…</span>
              </div>
            )}

            {/* Stats row (when scored) */}
            {stage === 'result' && (
              <div
                style={{
                  marginTop: 18,
                  paddingTop: 16,
                  borderTop: '1px solid var(--line)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2,1fr)',
                  gap: 4
                }}
              >
                {subscoreSummary.slice(0, 2).map((s, i) => (
                  <div
                    key={s.label}
                    style={{
                      padding: '0 16px',
                      borderRight: i === 0 ? '1px solid var(--line)' : 'none'
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.35rem',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        color: 'var(--ink)',
                        fontVariantNumeric: 'tabular-nums'
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        marginTop: 4,
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--ink-50)'
                      }}
                    >
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </WindowChrome>
      </div>
    </div>
  )
}

function PlatformRow({
  name,
  score,
  strong,
  filled,
  index
}: {
  name: string
  score: number
  strong: boolean
  filled: boolean
  index: number
}) {
  const rowStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '100px 1fr 44px',
    alignItems: 'center',
    gap: 12,
    opacity: filled ? 1 : 0.45,
    transform: filled ? 'none' : 'translateY(3px)',
    transition: `opacity .5s ease ${index * 80}ms, transform .5s ease ${index * 80}ms`
  }
  return (
    <div style={rowStyle}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <img
          src={ENGINE_LOGO[name]}
          alt={name}
          style={{
            height: name === 'Grok' ? 16 : 12,
            width: 'auto',
            display: 'block',
            filter: 'var(--logo-filter, brightness(0))'
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            color: 'var(--ink-70)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {name}
        </span>
      </span>
      <span
        style={{
          height: 6,
          borderRadius: 999,
          background: 'var(--ink-07)',
          overflow: 'hidden'
        }}
      >
        <span
          style={{
            display: 'block',
            height: '100%',
            borderRadius: 999,
            background: strong ? 'var(--ink)' : 'var(--ink-40)',
            width: filled ? `${score}%` : '0%',
            transition: `width 1.1s var(--ease-out-expo) ${index * 95 + 220}ms`
          }}
        />
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--ink-70)',
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums'
        }}
      >
        {filled ? score : '—'}
      </span>
    </div>
  )
}

function AnalyzingDots() {
  return (
    <div
      style={{
        display: 'inline-flex',
        gap: 8,
        alignItems: 'center'
      }}
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            height: 12,
            width: 12,
            borderRadius: 999,
            background: 'var(--ink-40)',
            animation: `clv-chatdot 1.2s ease-in-out ${i * 0.18}s infinite`
          }}
        />
      ))}
    </div>
  )
}

function Spinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" className="animate-spin" aria-hidden>
      <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(10,10,15,0.15)" strokeWidth="2" />
      <path d="M10 2 a8 8 0 0 1 8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

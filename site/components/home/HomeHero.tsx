'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Container, ArrowRight, HaloMark } from '@/components/ui'
import { LIGHT } from './mocks/palette'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

export function HomeHero() {
  return (
    <section data-track-location="home_hero" style={{ position: 'relative', overflow: 'hidden' }}>
      <Container className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-5xl mx-auto text-center">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              // ~58-char headline kept to two balanced lines within the
              // max-w-5xl (1024px) hero column. text-wrap: balance splits it
              // evenly (~33 / ~26 chars); 3.5rem is the largest size that still
              // fits the longer line (~33ch) inside 1024px, so it stays 2 lines.
              fontSize: 'clamp(2.25rem, 4.8vw, 3.5rem)',
              fontWeight: 600,
              letterSpacing: 'var(--track-display-lg)',
              lineHeight: 1.12,
              margin: 0,
              textWrap: 'balance'
            }}
          >
            Everything you need to understand and improve AI visibility.
          </h1>

          <p
            style={{
              fontSize: 'var(--text-lead)',
              lineHeight: 1.55,
              color: 'var(--ink-70)',
              maxWidth: 640,
              margin: '1.75rem auto 0',
              textWrap: 'balance'
            }}
          >
            Measure how AI recommends your brand, understand why, uncover opportunities to improve, and track what changes over time.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="home_hero">
              Start Free Trial <ArrowRight />
            </Button>
            <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="home_hero">
              Get Free Score
            </Button>
          </div>
          <p
            className="mt-5 text-[0.85rem]"
            style={{ color: 'var(--ink-50)' }}
          >
            Free score takes 60 seconds · No login required · No credit card
          </p>
        </div>

        <div className="mt-12 md:mt-20 max-w-5xl mx-auto">
          <HeroMedia />
        </div>
      </Container>
    </section>
  )
}

function HeroMedia() {
  const rootRef = useRef<HTMLDivElement>(null)
  const hasRunRef = useRef(false)
  const [on, setOn] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setReduced(true)
      hasRunRef.current = true
      setOn(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !hasRunRef.current) {
            hasRunRef.current = true
            setOn(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={rootRef}
      style={{
        ...LIGHT,
        position: 'relative',
        borderRadius: 24,
        border: '1px solid var(--line)',
        background: 'var(--white)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.28)',
        overflow: 'hidden',
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(24px) scale(0.985)',
        transition: reduced ? 'none' : `opacity 0.7s ${EASE}, transform 0.9s ${EASE}`
      }}
    >
      {/* Custom-coded static illustration — "AI visibility tracking for brands":
          a brand's AI Visibility score gauge, ringed by the major AI engines it's
          tracked across. White, monochrome, one emerald accent. Replaced the
          video placeholder. The 16:9 wrapper keeps layout/CLS stable. */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--white)' }}>
        <HeroVisual />
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * HeroVisual — a fully coded (zero-raster) static illustration for the hero.
 * One self-contained SVG on a 1120×630 (16:9) canvas so the whole composition
 * scales as a unit and never crowds. B&W with a single emerald accent (the
 * score arc + "tracked" status dots), per the brand book.
 * ------------------------------------------------------------------------- */

const EMERALD = '#047857'
const CX = 560
const CY = 315

// The AI engines the brand is tracked across — nodes on the orbit ring (R=205).
const HERO_ENGINES = [
  { name: 'ChatGPT', logo: '/logos/chatgpt.svg', x: 560, y: 110, tracked: true },
  { name: 'Claude', logo: '/logos/claude.svg', x: 755, y: 252, tracked: true },
  { name: 'Gemini', logo: '/logos/gemini.svg', x: 681, y: 481, tracked: true },
  { name: 'Perplexity', logo: '/logos/perplexity.svg', x: 439, y: 481, tracked: false },
  { name: 'Google AI', logo: '/logos/google-ai.svg', x: 365, y: 252, tracked: true }
]

// 72% score arc on an R=60 ring (circumference ≈ 377), drawn from top.
const GAUGE_R = 60
const GAUGE_C = 2 * Math.PI * GAUGE_R
const GAUGE_ON = GAUGE_C * 0.72

function HeroVisual() {
  return (
    <svg
      viewBox="0 0 1120 630"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="A brand's AI Visibility score, tracked across ChatGPT, Claude, Gemini, Perplexity and Google AI."
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <pattern id="hvDots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.4" cy="1.4" r="1.4" fill="rgba(10,10,15,0.06)" />
        </pattern>
        <radialGradient id="hvGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(4,120,87,0.10)" />
          <stop offset="100%" stopColor="rgba(4,120,87,0)" />
        </radialGradient>
        <mask id="hvDotMask">
          <rect x="0" y="0" width="1120" height="630" fill="black" />
          <ellipse cx={CX} cy={CY} rx="470" ry="300" fill="url(#hvSoftMask)" />
        </mask>
        <radialGradient id="hvSoftMask" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" />
          <stop offset="60%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <filter id="hvShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="7" stdDeviation="11" floodColor="rgba(10,10,15,0.14)" />
        </filter>
        <filter id="hvShadowSoft" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="10" stdDeviation="18" floodColor="rgba(10,10,15,0.16)" />
        </filter>
      </defs>

      {/* faint dot-grid, feathered to the centre (inside the card tile) */}
      <rect x="0" y="0" width="1120" height="630" fill="url(#hvDots)" mask="url(#hvDotMask)" />
      {/* soft emerald glow behind the gauge */}
      <ellipse cx={CX} cy={CY} rx="300" ry="230" fill="url(#hvGlow)" />

      {/* orbit rings */}
      <circle cx={CX} cy={CY} r="205" fill="none" stroke="rgba(10,10,15,0.07)" strokeWidth="1" />
      <circle cx={CX} cy={CY} r="150" fill="none" stroke="rgba(10,10,15,0.06)" strokeWidth="1" strokeDasharray="2 7" />

      {/* connectors: each engine wired to the central score */}
      {HERO_ENGINES.map((e) => (
        <line key={`c-${e.name}`} x1={CX} y1={CY} x2={e.x} y2={e.y} stroke="rgba(10,10,15,0.12)" strokeWidth="1.5" />
      ))}

      {/* engine nodes on the orbit */}
      {HERO_ENGINES.map((e) => (
        <g key={e.name}>
          <rect x={e.x - 36} y={e.y - 36} width="72" height="72" rx="18" fill="#ffffff" stroke="rgba(10,10,15,0.10)" strokeWidth="1" filter="url(#hvShadow)" />
          <image
            href={e.logo}
            xlinkHref={e.logo}
            x={e.x - 18}
            y={e.y - 18}
            width="36"
            height="36"
            preserveAspectRatio="xMidYMid meet"
            style={{ filter: 'var(--logo-filter, brightness(0))', opacity: 0.9 }}
          />
          {/* "tracked" status dot */}
          <circle cx={e.x + 25} cy={e.y - 25} r="6" fill="#ffffff" />
          <circle cx={e.x + 25} cy={e.y - 25} r="4" fill={e.tracked ? EMERALD : 'rgba(10,10,15,0.22)'} />
        </g>
      ))}

      {/* central AI Visibility score gauge */}
      <circle cx={CX} cy={CY} r="66" fill="#ffffff" filter="url(#hvShadowSoft)" />
      <circle cx={CX} cy={CY} r={GAUGE_R} fill="none" stroke="rgba(10,10,15,0.09)" strokeWidth="8" />
      <circle
        cx={CX}
        cy={CY}
        r={GAUGE_R}
        fill="none"
        stroke={EMERALD}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${GAUGE_ON.toFixed(1)} ${GAUGE_C.toFixed(1)}`}
        transform={`rotate(-90 ${CX} ${CY})`}
      />
      {/* brand mark */}
      <g transform={`translate(${CX - 9}, ${CY - 42})`} style={{ color: '#0a0a0f' }}>
        <HaloMark size={18} />
      </g>
      {/* score number */}
      <text x={CX} y={CY + 6} textAnchor="middle" style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 600, fill: '#0a0a0f', letterSpacing: '-0.02em' }}>
        72
      </text>
      {/* label */}
      <text x={CX} y={CY + 28} textAnchor="middle" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'rgba(10,10,15,0.5)', letterSpacing: '0.18em' }}>
        AI VISIBILITY
      </text>

      {/* tracking delta — the "tracked over time" signal, below the gauge */}
      <g transform={`translate(${CX}, ${CY + 118})`}>
        <path d="M-46 4 L-39 -6 L-32 4 Z" fill={EMERALD} />
        <text x="-26" y="4" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 600, fill: EMERALD }}>
          +8.2%
        </text>
        <text x="26" y="4" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fill: 'rgba(10,10,15,0.5)' }}>
          this month
        </text>
      </g>
    </svg>
  )
}

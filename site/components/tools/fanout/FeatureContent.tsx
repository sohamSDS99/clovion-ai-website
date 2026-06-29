'use client'

import { useState, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { Container, Section, Button, Eyebrow, HeroShade, ArrowRight } from '@/components/ui'
import { LIGHT, TAG_COLORS } from '@/components/home/mocks/palette'
import { cb, useReducedMotion, useStagger, useCountUp } from '@/components/home/mocks/motion'
import { openCalendly } from '@/lib/openCalendly'
import { FAQS } from './faqs'

/* ── Shared style tokens ─────────────────────────────────────────── */
const DISPLAY_LG: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-lg)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-lg)',
  lineHeight: 1.02,
  textWrap: 'balance' as CSSProperties['textWrap']
}
const DISPLAY_MD: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.05,
  textWrap: 'balance' as CSSProperties['textWrap']
}
const LEAD: CSSProperties = {
  fontSize: 'var(--text-lead)',
  lineHeight: 1.55,
  color: 'var(--ink-70)',
  textWrap: 'balance' as CSSProperties['textWrap']
}
const MONO_LABEL: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.72rem',
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase'
}

/* ── Mock fan-out payload (intent-grouped, no backend) ───────────── */
type IntentKey = 'Reformulation' | 'Comparative' | 'Procedural' | 'Pricing'

type Category = {
  key: IntentKey
  title: string
  eyebrow: string
  rows: string[]
  blurb: string
}

const CATEGORIES: Category[] = [
  {
    key: 'Reformulation',
    title: 'Reformulation',
    eyebrow: 'Same intent · reworded',
    blurb: 'Different surface phrasing for the same underlying question.',
    rows: [
      'Best CRM platforms for SaaS startups',
      'Top SaaS CRMs 2026',
      'SaaS CRM ranking'
    ]
  },
  {
    key: 'Comparative',
    title: 'Comparative',
    eyebrow: 'Head-to-head · alternatives',
    blurb: 'Engines test vendor-vs-vendor framings to surface trade-offs.',
    rows: [
      'HubSpot vs Salesforce for SaaS',
      'Pipedrive vs Monday CRM',
      'CRM comparison for 50-person teams'
    ]
  },
  {
    key: 'Procedural',
    title: 'Procedural',
    eyebrow: 'How to · workflow',
    blurb: 'How-to questions that pull in implementation and evaluation guides.',
    rows: ['How to migrate to a new CRM', 'How to evaluate a CRM trial']
  },
  {
    key: 'Pricing',
    title: 'Pricing',
    eyebrow: 'Cost · tiers',
    blurb: 'Cost and budget angles — usually the deciding branch for buyers.',
    rows: ['Cheapest CRM for small SaaS', 'CRM pricing tiers explained']
  }
]

const TOTAL_QUERIES = CATEGORIES.reduce((sum, c) => sum + c.rows.length, 0)

/* ── Local primitives ────────────────────────────────────────────── */
function FqArrow({ size = 14 }: { size?: number }) {
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

function FqPlus({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function FqSpark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ── 01 — HERO (centered, with inline textarea form) ─────────────── */
type Stage = 'idle' | 'submitting' | 'result'

function Hero({
  stage,
  setStage,
  query,
  setQuery,
  setSubmittedQuery
}: {
  stage: Stage
  setStage: (s: Stage) => void
  query: string
  setQuery: (q: string) => void
  setSubmittedQuery: (q: string) => void
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [error, setError] = useState<string>('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length < 4) {
      setError('Enter a query of at least 4 characters.')
      inputRef.current?.focus()
      return
    }
    setError('')
    setSubmittedQuery(trimmed)
    setStage('submitting')
    // Local-only feel-good delay before result reveal.
    setTimeout(() => setStage('result'), 480)
  }

  const handleReset = () => {
    setStage('idle')
    setQuery('')
    setSubmittedQuery('')
    setError('')
  }

  const tryExample = () => {
    if (stage === 'submitting') return
    const sample = 'best CRM for a growing SaaS company with 50 employees'
    setQuery(sample)
    setSubmittedQuery(sample)
    setError('')
    setStage('submitting')
    setTimeout(() => setStage('result'), 480)
  }

  return (
    <Section className="relative overflow-hidden">
      <HeroShade />
      {/* Subtle scanline glow above the form */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 60% 40% at 50% 18%, rgba(255,255,255,0.04) 0%, transparent 60%)'
        }}
      />
      <Container>
        <div
          className="max-w-3xl mx-auto text-center"
          style={{ paddingTop: '2rem', paddingBottom: '0.5rem' }}
        >
          <div style={{ display: 'inline-block', marginBottom: 22 }}>
            <Eyebrow>FREE TOOL</Eyebrow>
          </div>

          <h1
            style={{
              ...DISPLAY_LG,
              fontSize: 'clamp(2.1rem, 4.4vw + 0.4rem, 3.6rem)',
              margin: 0,
              color: 'var(--ink)'
            }}
          >
            Query Fan-Out Generator.
          </h1>

          <p
            style={{
              ...LEAD,
              margin: '20px auto 0',
              maxWidth: 640,
              color: 'var(--ink-70)'
            }}
          >
            See how ChatGPT, Perplexity, and Google AI fan a single query into 8+ sub-queries behind the scenes. Use it to plan content briefs, SEO clusters, and GEO strategies.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              marginTop: 36,
              maxWidth: 640,
              marginInline: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              textAlign: 'left'
            }}
            aria-label="Query fan-out form"
          >
            <label
              htmlFor="fanout-query"
              style={{
                ...MONO_LABEL,
                color: 'var(--ink-60)',
                paddingLeft: 4
              }}
            >
              Enter a query
            </label>
            <div
              style={{
                position: 'relative',
                borderRadius: 18,
                background: 'var(--ink-surface)',
                border: `1px solid ${
                  error ? '#e5484d' : focused ? 'var(--white)' : 'var(--ink-25)'
                }`,
                transition: `border-color 0.18s ${cb}, box-shadow 0.18s ${cb}`,
                boxShadow: focused
                  ? '0 0 0 3px rgba(255,255,255,0.10)'
                  : 'none'
              }}
            >
              <textarea
                id="fanout-query"
                ref={inputRef}
                rows={3}
                value={query}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onChange={(e) => {
                  setQuery(e.target.value)
                  if (error) setError('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder="best CRM for a growing SaaS company with 50 employees"
                spellCheck={false}
                autoComplete="off"
                disabled={stage === 'submitting'}
                aria-label="Seed query"
                style={{
                  width: '100%',
                  minHeight: 110,
                  padding: '18px 20px',
                  background: 'transparent',
                  color: 'var(--white)',
                  border: 'none',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.04rem',
                  lineHeight: 1.45
                }}
              />
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  right: 14,
                  bottom: 12,
                  ...MONO_LABEL,
                  fontSize: '0.66rem',
                  color: 'var(--ink-50)'
                }}
              >
                {query.length} char{query.length === 1 ? '' : 's'}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                marginTop: 4
              }}
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                trackEvent="cta_click"
                trackLocation="tools_fanout_hero"
                disabled={stage === 'submitting'}
                aria-busy={stage === 'submitting'}
              >
                {stage === 'submitting' ? 'Expanding…' : 'Expand'} <ArrowRight />
              </Button>

              <button
                type="button"
                onClick={tryExample}
                disabled={stage === 'submitting'}
                style={{
                  ...MONO_LABEL,
                  fontSize: '0.72rem',
                  color: 'var(--ink-60)',
                  background: 'transparent',
                  border: '1px solid var(--ink-25)',
                  borderRadius: 999,
                  padding: '8px 14px',
                  cursor: stage === 'submitting' ? 'not-allowed' : 'pointer',
                  opacity: stage === 'submitting' ? 0.5 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <FqSpark size={12} />
                Try example
              </button>

              {stage === 'result' && (
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    ...MONO_LABEL,
                    fontSize: '0.72rem',
                    color: 'var(--white)',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    textDecoration: 'underline',
                    textUnderlineOffset: 3,
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            {error && (
              <p
                role="alert"
                style={{
                  margin: 0,
                  paddingLeft: 4,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: '#e5484d'
                }}
              >
                {error}
              </p>
            )}
          </form>
        </div>
      </Container>
    </Section>
  )
}

/* ── 02 — RESULT CARD (LIGHT palette island on dark page) ────────── */
function CategoryCard({
  category,
  cardRevealed,
  index
}: {
  category: Category
  cardRevealed: boolean
  index: number
}) {
  const reduce = useReducedMotion()
  // Stagger rows inside the card, starting after the card itself reveals.
  const rowStartMs = reduce ? 0 : 220 + index * 180 + 120
  const rowFlags = useStagger(category.rows.length, cardRevealed, 60, rowStartMs)
  const count = useCountUp(category.rows.length, cardRevealed, {
    durationMs: 520,
    startMs: rowStartMs
  })

  const tagColor = TAG_COLORS[
    category.key === 'Reformulation'
      ? 'Industry: SaaS'
      : category.key === 'Comparative'
      ? 'Buyer Persona: Founder'
      : category.key === 'Procedural'
      ? 'Use Case: CRM'
      : 'Intent: Easiest'
  ] || { bg: '#ede9fe', fg: '#6d28d9' }

  return (
    <div
      style={{
        background: 'var(--white)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: 'clamp(18px, 2.2cqw, 26px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
        opacity: cardRevealed ? 1 : 0,
        transform: cardRevealed ? 'translateY(0)' : 'translateY(14px)',
        transition: `opacity 0.5s ${cb}, transform 0.5s ${cb}`
      }}
    >
      {/* Subtle corner accent */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 60,
          height: 60,
          background:
            'radial-gradient(circle at 100% 0%, rgba(10,10,15,0.05), transparent 70%)'
        }}
      />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <span
          style={{
            ...MONO_LABEL,
            color: 'var(--ink-50)'
          }}
        >
          {category.title}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            ...MONO_LABEL,
            fontSize: '0.66rem',
            color: 'var(--ink-70)',
            background: 'var(--subtle)',
            border: '1px solid var(--line)',
            borderRadius: 999,
            padding: '4px 10px',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {count}
          <span style={{ color: 'var(--ink-50)' }}>×</span>
        </span>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: '0.86rem',
          lineHeight: 1.5,
          color: 'var(--ink-70)'
        }}
      >
        {category.blurb}
      </p>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}
      >
        {category.rows.map((row, i) => (
          <li
            key={row}
            style={{
              opacity: rowFlags[i] ? 1 : 0,
              transform: rowFlags[i] ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.4s ${cb}, transform 0.4s ${cb}`
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                background: 'var(--subtle)',
                border: '1px solid var(--line)',
                borderRadius: 12
              }}
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  height: 22,
                  width: 22,
                  borderRadius: 6,
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  color: 'var(--ink-60)',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: '0.94rem',
                  lineHeight: 1.4,
                  color: 'var(--ink)',
                  letterSpacing: '-0.005em'
                }}
              >
                {row}
              </span>
              <span
                style={{
                  flexShrink: 0,
                  ...MONO_LABEL,
                  fontSize: '0.62rem',
                  background: tagColor.bg,
                  color: tagColor.fg,
                  border: 'none',
                  borderRadius: 999,
                  padding: '4px 9px',
                  letterSpacing: '0.08em'
                }}
              >
                {category.title}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ResultCard({
  visible,
  submittedQuery
}: {
  visible: boolean
  submittedQuery: string
}) {
  const reduce = useReducedMotion()
  // Card root reveal — gates the inner stagger.
  const [rootRevealed, setRootRevealed] = useState(false)
  useEffect(() => {
    if (!visible) {
      setRootRevealed(false)
      return
    }
    if (reduce) {
      setRootRevealed(true)
      return
    }
    const t = setTimeout(() => setRootRevealed(true), 30)
    return () => clearTimeout(t)
  }, [visible, reduce])

  // Stagger the 4 category cards, 180ms apart, starting after root reveals.
  const cardFlags = useStagger(CATEGORIES.length, rootRevealed, 180, reduce ? 0 : 220)
  const totalCount = useCountUp(TOTAL_QUERIES, rootRevealed, {
    durationMs: 900,
    startMs: reduce ? 0 : 180
  })

  if (!visible) return null

  return (
    <Section
      className="relative"
      tight
      id="result"
    >
      <Container>
        <div
          style={{
            ...(LIGHT as React.CSSProperties),
            containerType: 'size',
            background: 'var(--white)',
            color: 'var(--ink)',
            border: '1px solid var(--line)',
            borderRadius: 24,
            padding: 'clamp(22px, 3cqw, 40px)',
            boxShadow: '0 32px 80px -28px rgba(10,10,15,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
            maxWidth: 1040,
            margin: '0 auto',
            opacity: rootRevealed ? 1 : 0,
            transform: rootRevealed ? 'translateY(0)' : 'translateY(12px)',
            transition: `opacity 0.48s ${cb}, transform 0.48s ${cb}`
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 18,
              paddingBottom: 22,
              borderBottom: '1px solid var(--line)'
            }}
          >
            <div style={{ flex: '1 1 320px', minWidth: 0 }}>
              <span style={{ ...MONO_LABEL, color: 'var(--ink-50)' }}>
                Seed query
              </span>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: 'clamp(1rem, 2.2cqw, 1.18rem)',
                  lineHeight: 1.45,
                  color: 'var(--ink)',
                  fontWeight: 600,
                  letterSpacing: '-0.005em',
                  wordBreak: 'break-word'
                }}
              >
                “{submittedQuery}”
              </p>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                background: 'var(--subtle)',
                border: '1px solid var(--line)',
                borderRadius: 999,
                ...MONO_LABEL,
                fontSize: '0.72rem',
                color: 'var(--ink-70)',
                whiteSpace: 'nowrap',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              <span
                aria-hidden
                style={{
                  height: 7,
                  width: 7,
                  borderRadius: 999,
                  background: 'var(--positive)'
                }}
              />
              1 query
              <span style={{ color: 'var(--ink-40)' }}>→</span>
              <span style={{ color: 'var(--ink)', fontWeight: 700 }}>
                {totalCount}
              </span>
              sub-queries
              <span style={{ color: 'var(--ink-40)' }}>·</span>
              4 intents
            </div>
          </div>

          {/* Summary strip */}
          <p
            style={{
              margin: '20px 0 0',
              ...MONO_LABEL,
              fontSize: '0.72rem',
              color: 'var(--ink-70)',
              letterSpacing: '0.1em'
            }}
          >
            <span style={{ color: 'var(--ink)' }}>1 query</span>{' '}
            <span style={{ color: 'var(--ink-40)' }}>→</span>{' '}
            <span style={{ color: 'var(--ink)' }}>{TOTAL_QUERIES} sub-queries</span>{' '}
            <span style={{ color: 'var(--ink-40)' }}>across</span>{' '}
            <span style={{ color: 'var(--ink)' }}>4 intent types</span>
          </p>

          {/* Grid of categories */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
            style={{ marginTop: 22 }}
          >
            {CATEGORIES.map((c, i) => (
              <CategoryCard
                key={c.key}
                category={c}
                index={i}
                cardRevealed={cardFlags[i]}
              />
            ))}
          </div>

          {/* Footer note */}
          <div
            style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: '1px solid var(--line)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.86rem',
                lineHeight: 1.5,
                color: 'var(--ink-60)',
                maxWidth: 560
              }}
            >
              Sample output — illustrative of how ChatGPT, Perplexity, and Google AI rewrite a single buyer query before answering.
            </p>
            <a
              href="/free-ai-visibility-score"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                ...MONO_LABEL,
                fontSize: '0.74rem',
                color: 'var(--ink)',
                textDecoration: 'none'
              }}
            >
              Get your full score <FqArrow size={12} />
            </a>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/* ── 03 — EDUCATIONAL: What is query fan-out? ────────────────────── */
const EDU_TILES = [
  {
    title: 'AI rewrites every query',
    body:
      'Modern engines never run your exact prompt and stop. They expand it into reformulations, comparisons, procedurals, and pricing angles before retrieving sources.'
  },
  {
    title: 'Each variation is a chance to be cited',
    body:
      'Every branch of the fan-out is its own micro-search with its own winning page. Your brand can be cited on any of them — or missed on all of them.'
  },
  {
    title: 'Win the variations, win the answer',
    body:
      'AI engines blend findings from every sub-query into one final answer. Covering more branches with strong content tilts the synthesis toward your brand.'
  }
]

function Educational() {
  return (
    <Section className="relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16 items-start">
          <div>
            <Eyebrow>The mechanic</Eyebrow>
            <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0', color: 'var(--ink)' }}>
              What is query fan-out?
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <p style={{ ...LEAD, margin: 0, color: 'var(--ink-70)' }}>
              Behind every AI answer is a silent retrieval step. Instead of running your exact prompt once and stopping, ChatGPT, Perplexity, Gemini, and AI Overviews rewrite the question into many sub-queries — broader, narrower, comparative, procedural, pricing — and run them in parallel.
            </p>
            <p style={{ ...LEAD, margin: 0, color: 'var(--ink-70)' }}>
              Each sub-query has its own ranking surface and its own winning pages. The model then blends the most useful evidence from every branch into one synthesized answer that names a handful of brands and cites a handful of sources.
            </p>
            <p style={{ ...LEAD, margin: 0, color: 'var(--ink-70)' }}>
              Mapping that fan-out is now table stakes for SEO and GEO. One ranking goal becomes a content cluster: a canonical category page, head-to-head comparison pages, how-to guides, and a transparent pricing surface — each tuned for a specific branch.
            </p>
          </div>
        </div>

        {/* 3-tile grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          style={{ marginTop: 56 }}
        >
          {EDU_TILES.map((tile, i) => (
            <div
              key={tile.title}
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: 24,
                background: 'var(--ink-surface, rgba(255,255,255,0.02))',
                border: '1px solid var(--ink-25)',
                borderRadius: 18
              }}
            >
              <span
                style={{
                  ...MONO_LABEL,
                  fontSize: '0.68rem',
                  color: 'var(--ink-50)',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                0{i + 1}
              </span>
              <h3
                style={{
                  margin: '14px 0 0',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.18rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--ink)',
                  lineHeight: 1.25
                }}
              >
                {tile.title}
              </h3>
              <p
                style={{
                  margin: '12px 0 0',
                  fontSize: '0.95rem',
                  lineHeight: 1.55,
                  color: 'var(--ink-70)'
                }}
              >
                {tile.body}
              </p>
              {/* Decorative diagonal accent line */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 18,
                  right: 18,
                  height: 1,
                  width: 28,
                  background: 'var(--ink-25)',
                  transform: 'rotate(-45deg)',
                  transformOrigin: 'right center'
                }}
              />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

/* ── 04 — FAQ ────────────────────────────────────────────────────── */
function FAQItem({
  q,
  a,
  open,
  onToggle
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
  return (
    <div style={{ borderBottom: '1px solid var(--ink-25)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          padding: '24px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'var(--font-display)',
          color: 'var(--ink)'
        }}
        aria-expanded={open}
      >
        <span style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
          {q}
        </span>
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            color: 'var(--ink-60)',
            transform: open ? 'rotate(45deg)' : 'none',
            transition: `transform 0.25s ${cb}`,
            display: 'inline-flex'
          }}
        >
          <FqPlus size={18} />
        </span>
      </button>
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? 480 : 0,
          transition: `max-height 0.35s ${cb}`
        }}
      >
        <p
          style={{
            margin: 0,
            padding: '0 48px 26px 0',
            fontSize: '1rem',
            lineHeight: 1.6,
            color: 'var(--ink-70)'
          }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

function ToolFAQ() {
  const [open, setOpen] = useState<number>(0)
  return (
    <Section id="faq">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <Eyebrow>FAQ</Eyebrow>
            <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0', color: 'var(--ink)' }}>
              Questions, answered.
            </h2>
            <p style={{ ...LEAD, margin: '20px 0 0', maxWidth: 360, color: 'var(--ink-70)' }}>
              Quick answers on how fan-out works, why it matters, and how to use this output for content planning.
            </p>
            <a
              href="/free-ai-visibility-score"
              style={{
                marginTop: 24,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--ink)',
                textDecoration: 'none'
              }}
            >
              Get your full score <FqArrow />
            </a>
          </div>
          <div>
            {FAQS.map((f, i) => (
              <FAQItem
                key={i}
                q={f.q}
                a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

/* ── 05 — FINAL CTA ──────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <Section>
      <Container>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 24,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            padding: 'clamp(2.25rem, 6vw, 6rem) clamp(1.25rem, 4vw, 3.5rem)',
            border: '1px solid var(--ink-25)'
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.6,
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 60% 70% at 90% 50%, rgba(255,255,255,0.04), transparent 60%)'
            }}
          />
          <div style={{ position: 'relative', maxWidth: 720 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--on-ink-70)'
              }}
            >
              Get your score
            </span>
            <h2
              style={{
                ...DISPLAY_LG,
                margin: '20px 0 0',
                color: 'var(--on-ink)'
              }}
            >
              Know your full AI visibility score.
            </h2>
            <p
              style={{
                fontSize: 'var(--text-lead)',
                lineHeight: 1.55,
                color: 'var(--on-ink-70)',
                marginTop: 24,
                maxWidth: 560
              }}
            >
              Fan-out tells you which questions matter. The full score tells you where you stand on each one — mentions, sentiment, citations, and share of voice across ChatGPT, Claude, Perplexity, and AI Overviews.
            </p>
            <div
              style={{
                marginTop: 36,
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap'
              }}
            >
              <Button
                href="/free-ai-visibility-score"
                variant="primary"
                size="lg"
                trackLocation="tools_fanout_final_cta"
              >
                Get Free Score <ArrowRight />
              </Button>
              <Button
                variant="invert"
                size="lg"
                onClick={(e) => {
                  e.preventDefault()
                  openCalendly('tools_fanout_final_cta')
                }}
              >
                Talk to an Expert
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

/* ── Page composition ────────────────────────────────────────────── */
export default function FeatureContent() {
  const [stage, setStage] = useState<Stage>('idle')
  const [query, setQuery] = useState<string>('')
  const [submittedQuery, setSubmittedQuery] = useState<string>('')

  return (
    <>
      <Hero
        stage={stage}
        setStage={setStage}
        query={query}
        setQuery={setQuery}
        setSubmittedQuery={setSubmittedQuery}
      />
      <ResultCard
        visible={stage === 'result'}
        submittedQuery={submittedQuery}
      />
      <Educational />
      <ToolFAQ />
      <FinalCTA />
    </>
  )
}

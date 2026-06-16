'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Container,
  Section,
  Button,
  Tag,
  ArrowRight,
  Check,
  HairlineDivider,
  HeroShade
} from '@/components/ui'
import { analytics } from '@/lib/analytics'

// ---------- Mock result data (hardcoded until backend exists) ----------

const SCORE = 73
const SUBSCORES = [
  { label: 'Mention Rate', value: 82, note: 'How often your brand appears when buyers ask AI about your category.' },
  { label: 'Sentiment', value: 71, note: 'How positively AI describes your brand across answers.' },
  { label: 'Citation Strength', value: 64, note: 'How often AI cites your own domain as a source.' },
  { label: 'Competitive Position', value: 75, note: 'Your share of voice versus the top three competitors.' }
]

const PLATFORMS = [
  { name: 'ChatGPT', score: 78, strong: true },
  { name: 'Claude', score: 65, strong: false },
  { name: 'Perplexity', score: 42, strong: false },
  { name: 'AI Overviews', score: 71, strong: true }
]

const SAMPLE_PROMPTS = [
  {
    prompt: 'What is the best AI visibility platform?',
    excerpt:
      'Several platforms track how your brand surfaces in AI answers. Notion is a strong all-in-one workspace tool, but for AI visibility specifically you would want a dedicated GEO platform. Tools like Clovion AI, Profound, and Athena AI focus on tracking citations across ChatGPT, Claude, and Perplexity.',
    engines: ['ChatGPT', 'AI Overviews'],
    brandMentioned: true,
    brandWord: 'Notion'
  },
  {
    prompt: 'Which collaboration tools do AI startups use?',
    excerpt:
      'AI startups typically reach for tools like Linear for project tracking, Slack for communication, and Figma for design. For documentation, options include GitBook, Confluence, and a few newer entrants. The tooling stack varies widely depending on team size and stage.',
    engines: ['Claude', 'Perplexity'],
    brandMentioned: false,
    brandWord: 'Notion'
  },
  {
    prompt: 'Best wiki software for engineering teams in 2026?',
    excerpt:
      'For engineering wikis the leading choices are GitBook, Confluence, and Notion. Notion offers strong AI features, flexible databases, and an active developer ecosystem. Smaller teams often prefer it for its lower setup cost; larger teams sometimes outgrow it.',
    engines: ['ChatGPT', 'Perplexity', 'AI Overviews'],
    brandMentioned: true,
    brandWord: 'Notion'
  }
]

const RECOMMENDATIONS = [
  {
    severity: 'HIGH',
    problem: 'Your brand is not cited on Perplexity.',
    fix: 'Get listed in two industry roundups. We found four candidates ready to pitch.',
    lift: '+8 visibility points'
  },
  {
    severity: 'MED',
    problem: 'Sentiment trails competitors by 12 points.',
    fix: 'Refresh three review pages where outdated language is dragging the average down.',
    lift: '+6 visibility points'
  },
  {
    severity: 'LOW',
    problem: 'Wikipedia entry is missing.',
    fix: 'A short, sourced entry tends to lift citation strength inside three monthly crawls.',
    lift: '+4 visibility points'
  }
]

const ANALYSIS_STEPS = [
  'Fetching brand context...',
  'Querying ChatGPT with 12 buyer prompts...',
  'Querying Perplexity, Claude, Gemini, AI Overviews...',
  'Analyzing sentiment and citations...',
  'Benchmarking against three competitors...'
]

// ---------- Helpers ----------

function normalizeDomain(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '')
}

function isValidDomain(d: string) {
  if (!d || d.length > 253) return false
  if (/\s/.test(d)) return false
  if (!d.includes('.')) return false
  return true
}

function bucket(score: number) {
  if (score >= 70) return 'Strong'
  if (score >= 40) return 'Above'
  return 'Needs work'
}

// ---------- Page ----------

type Stage = 'idle' | 'analyzing' | 'result'

export default function FreeAIVisibilityScorePage() {
  const [stage, setStage] = useState<Stage>('idle')
  const [domain, setDomain] = useState('')
  const [submittedDomain, setSubmittedDomain] = useState('')
  const [stepIndex, setStepIndex] = useState(0)
  const [showPrompts, setShowPrompts] = useState(false)
  const [reportEmail, setReportEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Autofocus on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Drive the analysis step animation
  useEffect(() => {
    if (stage !== 'analyzing') return
    setStepIndex(0)
    const tick = (i: number) => {
      if (i >= ANALYSIS_STEPS.length) {
        setStage('result')
        return
      }
      const delay = i === ANALYSIS_STEPS.length - 1 ? 1800 : 2400
      const t = setTimeout(() => {
        setStepIndex(i + 1)
        tick(i + 1)
      }, delay)
      return t
    }
    const t = tick(0)
    return () => {
      if (t) clearTimeout(t)
    }
  }, [stage])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const clean = normalizeDomain(domain)
    if (!isValidDomain(clean)) {
      inputRef.current?.focus()
      return
    }
    setSubmittedDomain(clean)
    setStage('analyzing')
    analytics.formSubmit('free_ai_visibility_score', 'free_score_page')
  }

  const handleTryExample = () => {
    setDomain('notion.so')
    setSubmittedDomain('notion.so')
    setStage('analyzing')
  }

  const handleEmailReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (reportEmail.includes('@')) setEmailSent(true)
  }

  const scoreLabel = bucket(SCORE)
  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
    []
  )

  // ----- 270deg arc math for the dial -----
  // Sweep starts at 135deg, ends at 405deg (270deg total).
  const RADIUS = 160
  const STROKE = 8
  const CIRC = 2 * Math.PI * RADIUS
  const ARC_FRACTION = 0.75 // 270/360
  const ARC_LEN = CIRC * ARC_FRACTION
  const fillLen = ARC_LEN * (SCORE / 100)

  return (
    <>
      {/* =========================================================
          ABOVE-THE-FOLD — switches between idle / analyzing / result
         ========================================================= */}
      <section
        className={
          stage === 'result'
            ? 'section-y-xl relative overflow-hidden'
            : 'section-y relative overflow-hidden'
        }
      >
        <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
        <HeroShade />
        <Container>
          {/* ---------- STATE A: idle ---------- */}
          {stage === 'idle' && (
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="display-xl text-ink">
                Get your AI score.
              </h1>
              <p className="lead mt-6 mx-auto max-w-xl">
                Check your visibility across ChatGPT, Claude, Perplexity, and
                Google AI Overviews. Free. No signup. Score in 60 seconds.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-10 mx-auto max-w-[680px]"
              >
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="your-brand.com"
                      autoComplete="off"
                      spellCheck={false}
                      className="w-full h-14 px-5 bg-white border border-ink/15 rounded-2xl text-base font-mono text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/60 transition-colors"
                      aria-label="Your domain"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-14 px-7 rounded-2xl bg-ink text-white font-semibold text-base hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2"
                  >
                    Check visibility
                    <ArrowRight />
                  </button>
                </div>

                <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink/60">
                  Free &middot; No credit card &middot; No signup
                </p>

                <button
                  type="button"
                  onClick={handleTryExample}
                  className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink/50 hover:text-ink transition-colors border border-ink/10 hover:border-ink/30 rounded-full px-3 py-1.5"
                >
                  Try: notion.so
                  <ArrowRight />
                </button>
              </form>
            </div>
          )}

          {/* ---------- STATE B: analyzing ---------- */}
          {stage === 'analyzing' && (
            <div className="mx-auto max-w-2xl">
              <h2 className="display-md text-ink text-center">
                Analyzing {submittedDomain}
              </h2>
              <p className="mt-4 text-center font-mono text-xs uppercase tracking-wider text-ink/60">
                Typical time: 20 seconds. Don&rsquo;t refresh.
              </p>

              <ol className="mt-12 space-y-5">
                {ANALYSIS_STEPS.map((label, i) => {
                  const done = i < stepIndex
                  const active = i === stepIndex
                  return (
                    <li
                      key={i}
                      className={`flex items-center gap-4 transition-opacity duration-500 ${
                        done || active ? 'opacity-100' : 'opacity-30'
                      }`}
                    >
                      <span className="font-mono text-xs text-ink/40 tabular-nums">
                        {String(i + 1).padStart(2, '0')} &rarr;
                      </span>
                      <span className="shrink-0 w-6 h-6 inline-flex items-center justify-center">
                        {done ? (
                          <span className="w-5 h-5 rounded-full bg-ink text-white inline-flex items-center justify-center">
                            <Check />
                          </span>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            className={active ? 'animate-spin' : ''}
                            aria-hidden
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="8"
                              fill="none"
                              stroke="rgba(10,10,15,0.15)"
                              strokeWidth="2"
                            />
                            <path
                              d="M10 2 a8 8 0 0 1 8 8"
                              fill="none"
                              stroke="#0a0a0f"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="font-mono text-sm text-ink/80">{label}</span>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}

          {/* ---------- STATE C: result (the dial) ---------- */}
          {stage === 'result' && (
            <div className="mx-auto max-w-4xl text-center">
              <div className="relative inline-block">
                <svg
                  viewBox="-200 -200 400 400"
                  width="360"
                  height="360"
                  className="block mx-auto"
                  aria-hidden
                >
                  {/* Background arc (270deg) */}
                  <circle
                    cx="0"
                    cy="0"
                    r={RADIUS}
                    fill="none"
                    stroke="rgba(10,10,15,0.08)"
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    strokeDasharray={`${ARC_LEN} ${CIRC}`}
                    transform="rotate(135)"
                  />
                  {/* Filled arc */}
                  <circle
                    cx="0"
                    cy="0"
                    r={RADIUS}
                    fill="none"
                    stroke="#0a0a0f"
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    strokeDasharray={`${fillLen} ${CIRC}`}
                    transform="rotate(135)"
                    style={{
                      transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className="font-mono font-semibold text-ink leading-none tabular-nums"
                    style={{ fontSize: 'clamp(5rem, 11vw, 9rem)' }}
                  >
                    {SCORE}
                  </div>
                  <div className="mt-2 font-mono text-sm tracking-wider text-ink/40">
                    / 100
                  </div>
                </div>
              </div>

              <p className="display-sm mt-10 text-ink">
                {scoreLabel === 'Needs work' ? (
                  <>
                    <em className="font-serif italic text-ink">Needs work</em>{' '}
                    for your category.
                  </>
                ) : scoreLabel === 'Strong' ? (
                  <>
                    <em className="font-serif italic text-ink">Strong</em>{' '}
                    visibility for your category.
                  </>
                ) : (
                  <>
                    <em className="font-serif italic text-ink">Above</em>{' '}
                    average for your category.
                  </>
                )}
              </p>
              <p className="mt-3 font-mono text-xs uppercase tracking-wider text-ink/60">
                Scored on {submittedDomain} &middot; {today}
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* The rest of the page renders in idle and result, hidden during analysis */}
      {stage !== 'analyzing' && stage === 'result' && (
        <>
          {/* ============================================
              SUB-SCORES — 2x2 / 4-col data cards
             ============================================ */}
          <Section bg={undefined}>
            <Container>
              <div className="mb-12 flex items-end justify-between flex-wrap gap-4">
                <h2 className="display-md text-ink max-w-xl">
                  The four signals behind the score.
                </h2>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/50">
                  Sub-scores / 100
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
                {SUBSCORES.map((s) => (
                  <div key={s.label} className="bg-white p-7">
                    <div className="font-mono text-[11px] uppercase tracking-widest text-ink/60">
                      {s.label}
                    </div>
                    <div
                      className="mt-4 font-mono font-semibold text-ink tabular-nums leading-none"
                      style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)' }}
                    >
                      {s.value}
                    </div>
                    <div className="mt-5 h-1 w-full bg-ink/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-ink rounded-full"
                        style={{
                          width: `${s.value}%`,
                          transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                    </div>
                    <p className="mt-5 text-sm text-ink/70 leading-relaxed">
                      {s.note}
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </Section>

          {/* ============================================
              PER-PLATFORM STRIP
             ============================================ */}
          <Section bg="subtle">
            <Container>
              <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
                <h2 className="display-md text-ink">By platform.</h2>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/50">
                  Where you show up. Where you don&rsquo;t.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-ink/10">
                {PLATFORMS.map((p, i) => (
                  <div
                    key={p.name}
                    className={`p-7 ${
                      i < PLATFORMS.length - 1 ? 'md:border-r border-ink/10' : ''
                    } ${i % 2 === 0 ? 'border-r md:border-r border-ink/10' : ''} ${
                      i < 2 ? 'border-b md:border-b-0 border-ink/10' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-mono text-[11px] uppercase tracking-widest text-ink/70">
                        {p.name}
                      </div>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          p.strong ? 'bg-ink' : 'border border-ink/40'
                        }`}
                        aria-hidden
                      />
                    </div>
                    <div
                      className="mt-5 font-mono font-semibold text-ink tabular-nums leading-none"
                      style={{ fontSize: 'clamp(2.25rem, 3.5vw, 3rem)' }}
                    >
                      {p.score}
                    </div>
                    <div className="mt-2 font-mono text-[11px] text-ink/50">
                      {p.strong ? 'Strong signal' : 'Weak signal'}
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </Section>

          {/* ============================================
              SAMPLE PROMPTS — collapsible
             ============================================ */}
          <Section>
            <Container>
              <button
                type="button"
                onClick={() => setShowPrompts((v) => !v)}
                className="group flex items-center gap-3 font-mono text-sm uppercase tracking-wider text-ink hover:text-ink/70 transition-colors"
              >
                <span>
                  {showPrompts ? 'Hide' : 'Show'} the actual AI responses
                </span>
                <span
                  className={`transition-transform ${
                    showPrompts ? 'rotate-90' : ''
                  }`}
                >
                  <ArrowRight />
                </span>
              </button>

              {showPrompts && (
                <div className="mt-10 space-y-6">
                  {SAMPLE_PROMPTS.map((p, i) => (
                    <article
                      key={i}
                      className="border border-ink/10 bg-white rounded-2xl overflow-hidden"
                    >
                      <div className="px-6 py-4 border-b border-ink/10 bg-subtle">
                        <div className="font-mono text-[11px] uppercase tracking-widest text-ink/50 mb-2">
                          Buyer prompt &middot; #{String(i + 1).padStart(2, '0')}
                        </div>
                        <div className="text-ink text-base">
                          &ldquo;{p.prompt}&rdquo;
                        </div>
                      </div>
                      <div className="code-block px-6 py-5 text-sm leading-relaxed">
                        {p.brandMentioned ? (
                          <ResponseWithBrand
                            text={p.excerpt}
                            brand={p.brandWord}
                          />
                        ) : (
                          <>
                            <span className="opacity-80">{p.excerpt}</span>
                            <div className="mt-4 font-mono text-xs text-neutral-400">
                              [brand not mentioned]
                            </div>
                          </>
                        )}
                      </div>
                      <div className="px-6 py-3 border-t border-ink/10 flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-ink/50">
                          Engines:
                        </span>
                        {p.engines.map((e) => (
                          <span
                            key={e}
                            className="font-mono text-[11px] uppercase tracking-wider text-ink/80 border border-ink/15 rounded px-2 py-0.5"
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Container>
          </Section>

          {/* ============================================
              RECOMMENDATIONS — three prioritized fixes
             ============================================ */}
          <Section>
            <Container>
              <div className="mb-10 flex items-end justify-between flex-wrap gap-4">
                <h2 className="display-md text-ink max-w-xl">
                  Three fixes that move the score.
                </h2>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/50">
                  Estimated lift, ordered by impact
                </p>
              </div>

              <div className="space-y-4">
                {RECOMMENDATIONS.map((r, i) => (
                  <article
                    key={i}
                    className="border border-ink/10 bg-white rounded-2xl p-7 flex flex-col md:flex-row md:items-center gap-6"
                  >
                    <div className="shrink-0">
                      <SeverityPill severity={r.severity} />
                    </div>
                    <div className="flex-1">
                      <h3 className="display-sm text-ink">{r.problem}</h3>
                      <p className="mt-2 text-ink/70 max-w-2xl">{r.fix}</p>
                    </div>
                    <div className="md:text-right shrink-0">
                      <div className="font-mono text-xs uppercase tracking-wider text-ink/50">
                        Estimated lift
                      </div>
                      <div className="font-mono font-semibold text-ink text-xl mt-1 tabular-nums">
                        {r.lift}
                      </div>
                      <Link
                        href="/features"
                        className="mt-3 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-ink hover:text-ink/70"
                      >
                        See candidates <ArrowRight />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </Container>
          </Section>

          {/* ============================================
              CONVERSION BAND — single CTA on dark
             ============================================ */}
          <Section bg="ink">
            <Container>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="display-md text-white">This is one snapshot.</h2>
                <p className="lead mt-5 text-white/80 max-w-2xl mx-auto">
                  Clovion AI tracks 500+ prompts daily, alerts you when your
                  visibility shifts, and ships fixes that actually move the
                  score.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="invert" size="lg" href="/pricing">
                    Start free trial
                    <ArrowRight />
                  </Button>
                </div>

                <div className="mt-12 max-w-md mx-auto">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-white/50 mb-3">
                    Or email me this report
                  </div>
                  {emailSent ? (
                    <div className="border border-white/15 rounded-2xl px-5 py-4 font-mono text-sm text-white/80">
                      Sent to {reportEmail}. Check your inbox in ~60 seconds.
                    </div>
                  ) : (
                    <form
                      onSubmit={handleEmailReport}
                      className="flex flex-col sm:flex-row gap-2"
                    >
                      <input
                        type="email"
                        required
                        value={reportEmail}
                        onChange={(e) => setReportEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="flex-1 h-12 px-4 bg-transparent border border-white/20 rounded-xl text-white placeholder:text-white/30 font-mono text-sm focus:outline-none focus:border-white/60"
                      />
                      <button
                        type="submit"
                        className="h-12 px-5 rounded-xl bg-white text-ink font-semibold text-sm hover:bg-neutral-200 transition-colors"
                      >
                        Send report
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </Container>
          </Section>
        </>
      )}

      {/* ============================================
          IDLE-STATE EDUCATION ROW (only on idle)
         ============================================ */}
      {stage === 'idle' && (
        <>
          {/* X1 — What we check */}
          <section className="section-y-sm">
            <Container>
              <div className="mb-8 flex items-end justify-between flex-wrap gap-3">
                <h2 className="display-sm text-ink">What we check.</h2>
                <p className="font-mono text-xs uppercase tracking-wider text-ink/50">
                  Four engines &middot; one snapshot
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ink/10 border border-ink/10">
                {[
                  {
                    name: 'ChatGPT',
                    note: 'Twelve buyer prompts across your category, run on the latest GPT model.'
                  },
                  {
                    name: 'Claude',
                    note: 'The same prompts, captured from Anthropic with citation tracking on.'
                  },
                  {
                    name: 'Perplexity',
                    note: 'Cited sources, source domains, and how your URL ranks in answers.'
                  },
                  {
                    name: 'AI Overviews',
                    note: 'Google&rsquo;s generative answers, parsed for brand mention and link.'
                  }
                ].map((p) => (
                  <div key={p.name} className="bg-white p-6">
                    <div className="font-mono text-[11px] uppercase tracking-widest text-ink/70">
                      {p.name}
                    </div>
                    <p
                      className="mt-3 text-sm text-ink/70 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: p.note }}
                    />
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* X2 — What you get */}
          <section className="section-y-sm bg-white">
            <Container>
              <h2 className="display-sm text-ink mb-8">What you get.</h2>
              <div className="border-t border-ink/10">
                {[
                  {
                    n: '01',
                    t: 'An overall score out of 100',
                    d: 'One number that tells you where you stand. Strong, average, or behind.'
                  },
                  {
                    n: '02',
                    t: 'Four sub-scores',
                    d: 'Mention rate, sentiment, citation strength, and competitive position. Each scored independently.'
                  },
                  {
                    n: '03',
                    t: 'Three prioritized fixes',
                    d: 'The smallest set of moves that lift your number the most. Ordered by estimated impact.'
                  }
                ].map((row) => (
                  <div
                    key={row.n}
                    className="grid grid-cols-12 gap-4 py-6 border-b border-ink/10 items-baseline"
                  >
                    <div className="col-span-2 md:col-span-1 font-mono text-xs text-ink/40 tabular-nums">
                      {row.n}
                    </div>
                    <div className="col-span-10 md:col-span-4">
                      <div className="text-ink font-semibold">{row.t}</div>
                    </div>
                    <div className="col-span-12 md:col-span-7 text-ink/70">
                      {row.d}
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>

          {/* X3 — Why it matters */}
          <section className="section-y-sm bg-subtle">
            <Container>
              <p className="font-mono text-base md:text-lg text-ink/80 max-w-3xl leading-relaxed">
                <span className="text-ink/40">&rarr;</span>{' '}
                60% of B2B buyers ask AI before vendors. If you&rsquo;re
                invisible there, you&rsquo;re invisible.
              </p>
            </Container>
          </section>
        </>
      )}
    </>
  )
}

// ---------- Small helper components ----------

function SeverityPill({ severity }: { severity: string }) {
  if (severity === 'HIGH') {
    return (
      <span className="font-mono text-[11px] uppercase tracking-widest bg-ink text-white px-2.5 py-1 rounded">
        HIGH
      </span>
    )
  }
  if (severity === 'MED') {
    return (
      <span className="font-mono text-[11px] uppercase tracking-widest border border-ink text-ink px-2.5 py-1 rounded">
        MED
      </span>
    )
  }
  return (
    <span className="font-mono text-[11px] uppercase tracking-widest border border-ink/30 text-ink/60 px-2.5 py-1 rounded">
      LOW
    </span>
  )
}

function ResponseWithBrand({ text, brand }: { text: string; brand: string }) {
  const parts = text.split(new RegExp(`(${brand})`, 'g'))
  return (
    <span className="opacity-90">
      {parts.map((part, i) =>
        part === brand ? (
          <span
            key={i}
            className="inline-block bg-white text-ink px-1.5 py-0.5 rounded font-semibold mx-0.5"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

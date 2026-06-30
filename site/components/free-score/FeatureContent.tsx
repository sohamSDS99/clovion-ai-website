'use client'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from 'react'
import ScoreDial from './ScoreDial'
import SubscoreCards from './SubscoreCards'
import PlatformPanel from './PlatformPanel'
import PromptCards from './PromptCards'
import RecommendationList from './RecommendationList'
import { analytics } from '@/lib/analytics'
import { openCalendly } from '@/lib/openCalendly'
import { FAQAccordion } from '@/components/FAQAccordion'
import { LeadCaptureModal } from '@/components/LeadCaptureModal'
import type { FreeScoreResult } from '@/app/api/free-score/route'

/* ── Lead-gate constants ─────────────────────────────────────────────
 * Page-level lead gate: the visitor must submit the lead form before
 * the scan UI unlocks. State persists in localStorage under
 * LEAD_CAPTURED_KEY so the gate only fires once per browser.
 */
const LEAD_CAPTURED_KEY = 'clv_lead_captured'

/* ── Shared style tokens ─────────────────────────────────────────── */
const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 2rem'
}
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

/* ── Mock result data (hardcoded until backend exists) ───────────── */
const SCORE = 73

const SUBSCORES = [
  {
    label: 'Mention Rate',
    value: 82,
    note: 'How often your brand appears when buyers ask AI about your category.'
  },
  {
    label: 'Sentiment',
    value: 71,
    note: 'How positively AI describes your brand across answers.'
  },
  {
    label: 'Citation Strength',
    value: 64,
    note: 'How often AI cites your own domain as a source.'
  },
  {
    label: 'Competitive Position',
    value: 75,
    note: 'Your share of voice versus the top three competitors.'
  }
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

/* ── Helpers ─────────────────────────────────────────────────────── */
function normalizeDomain(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/+$/, '')
}
// Mirror the backend validation so we don't round-trip obviously-invalid
// domains and return a generic 400. Reject IPs, localhost, RFC1918 ranges,
// missing TLD, length > 253.
function isValidDomain(d: string) {
  if (!d || d.length > 253) return false
  if (/\s/.test(d)) return false
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(d)) return false
  if (/^\d+\.\d+\.\d+\.\d+/.test(d)) return false
  if (/^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/i.test(d)) return false
  return true
}

/* ── Inline icons ─────────────────────────────────────────────────── */
function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
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
/* ── Eyebrow ─────────────────────────────────────────────────────── */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: 'var(--ink-50)'
      }}
    >
      {children}
    </span>
  )
}

/* ── Inline TypingHeadline (cycle, like other feature pages) ─────── */
function TypingHeadline({
  text,
  style,
  caretColor,
  as = 'h2'
}: {
  text: string
  style?: CSSProperties
  caretColor?: string
  as?: keyof JSX.IntrinsicElements
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
      if (n < text.length) timer = setTimeout(() => setN(n + 1), 62)
      else timer = setTimeout(() => setPhase('holding'), 80)
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('deleting'), 4200)
    } else {
      if (n > 0) timer = setTimeout(() => setN(n - 1), 28)
      else timer = setTimeout(() => setPhase('typing'), 650)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [n, phase, reduce, text])

  const blinking = reduce || phase === 'holding'
  const Tag = as as keyof JSX.IntrinsicElements

  return (
    <Tag style={style}>
      <span>
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
            animation: blinking ? 'clv-blink 1.05s steps(1) infinite' : 'none'
          }}
        />
      </span>
    </Tag>
  )
}

/* ── Analysis step animation ─────────────────────────────────────── */
const ANALYSIS_STEPS_COUNT = 5

/* ── 01 — HERO with integrated form ──────────────────────────────── */
type Stage = 'idle' | 'analyzing' | 'result'

function Hero({
  stage,
  setStage,
  domain,
  setDomain,
  submittedDomain,
  setSubmittedDomain,
  stepIndex,
  scanResult,
  scanError,
  onRequestUnlock
}: {
  stage: Stage
  setStage: (s: Stage) => void
  domain: string
  setDomain: (s: string) => void
  submittedDomain: string
  setSubmittedDomain: (s: string) => void
  stepIndex: number
  scanResult: FreeScoreResult | null
  scanError: string
  onRequestUnlock: (cleanDomain: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>('')

  // Form is live on page load — no hydration gate. The lead-capture modal
  // is triggered at submit time if the visitor hasn't yet captured.
  const inputDisabled = stage === 'analyzing'

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    const clean = normalizeDomain(domain)
    if (!isValidDomain(clean)) {
      setError('Enter a domain like example.com.')
      inputRef.current?.focus()
      return
    }
    setError('')
    analytics.formSubmit('free_ai_visibility_score', 'free_score_page')
    analytics.getFreeScore('free_score_hero')

    // Gate at submit: if returning visitor (localStorage flag), run scan
    // immediately. Else hand the domain to the parent — it opens the modal
    // and resumes the scan after a successful capture.
    let captured = false
    if (typeof window !== 'undefined') {
      try {
        captured = window.localStorage.getItem(LEAD_CAPTURED_KEY) === '1'
      } catch {
        captured = false
      }
    }
    if (captured) {
      setSubmittedDomain(clean)
      setStage('analyzing')
    } else {
      onRequestUnlock(clean)
    }
  }

  const handleReset = () => {
    setStage('idle')
    setSubmittedDomain('')
    setDomain('')
    setError('')
  }

  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.5,
          background:
            'radial-gradient(ellipse 70% 55% at 70% 0%, rgba(10,10,15,0.06) 0%, rgba(10,10,15,0.02) 30%, transparent 70%)'
        }}
      />
      <div style={{ ...CONTAINER, padding: '7rem 2rem 5rem' }}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.02fr_1fr] md:gap-16 items-center">
          <div>
            <p
              style={{
                margin: '0 0 0',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--ink-50)'
              }}
            >
              Free AI visibility check · No signup
            </p>
            <TypingHeadline
              as="h1"
              text="See your AI visibility score."
              style={{
                ...DISPLAY_LG,
                fontSize: 'clamp(1.85rem, 2.8vw + 0.3rem, 2.7rem)',
                margin: '14px 0 0'
              }}
            />
            <p style={{ ...LEAD, maxWidth: 540, margin: '1.5rem 0 0' }}>
              Find out how ChatGPT, Claude, Perplexity, and Google AI Overviews describe
              your brand. Free score in about a minute, no card required.
            </p>

            {/* Domain input form */}
            <form onSubmit={handleSubmit} style={{ marginTop: 28, maxWidth: 540 }}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    ref={inputRef}
                    type="text"
                    value={domain}
                    onChange={(e) => {
                      setDomain(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="your-brand.com"
                    autoComplete="off"
                    spellCheck={false}
                    disabled={inputDisabled}
                    aria-label="Your domain"
                    aria-disabled={inputDisabled}
                    style={{
                      width: '100%',
                      height: 54,
                      padding: '0 18px',
                      background: 'var(--white)',
                      border: `1px solid ${error ? 'var(--ink-60)' : 'var(--line)'}`,
                      borderRadius: 16,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.95rem',
                      color: 'var(--ink)',
                      outline: 'none',
                      boxShadow: 'var(--shadow-card)',
                      cursor: inputDisabled ? 'not-allowed' : 'text',
                      transition: 'border-color .2s ease'
                    }}
                  />
                </div>
                <button
                    type="submit"
                    disabled={stage === 'analyzing'}
                    className="btn btn-primary"
                    style={{
                      height: 54,
                      padding: '0 22px',
                      borderRadius: 16,
                      fontSize: '0.95rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      whiteSpace: 'nowrap',
                      cursor: stage === 'analyzing' ? 'wait' : 'pointer',
                      opacity: stage === 'analyzing' ? 0.7 : 1
                    }}
                  >
                    {stage === 'analyzing' ? 'Scanning…' : 'Get my free score'}
                    {stage !== 'analyzing' && <ArrowRight size={14} />}
                  </button>
              </div>

              {(error || scanError) && (
                <p
                  role="alert"
                  style={{
                    margin: '10px 4px 0',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--ink-70)'
                  }}
                >
                  {error || scanError}
                </p>
              )}
              <div
                  style={{
                    marginTop: 14,
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 14,
                    alignItems: 'center'
                  }}
                >
                  <button
                    type="button"
                    disabled={stage === 'analyzing'}
                    onClick={() => {
                      if (stage === 'analyzing') return
                      setError('')
                      setDomain('notion.so')
                      setSubmittedDomain('notion.so')
                      setStage('analyzing')
                      analytics.getFreeScore('free_score_hero_example')
                    }}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--ink-60)',
                      border: '1px solid var(--line)',
                      borderRadius: 999,
                      padding: '6px 14px',
                      cursor: stage === 'analyzing' ? 'not-allowed' : 'pointer',
                      background: 'transparent',
                      opacity: stage === 'analyzing' ? 0.5 : 1
                    }}
                  >
                    Try: notion.so <ArrowRight size={12} />
                  </button>
                  {stage === 'result' && (
                    <button
                      type="button"
                      onClick={handleReset}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        color: 'var(--ink)',
                        textDecoration: 'underline',
                        textUnderlineOffset: 3,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Run another scan
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openCalendly('free_score_hero')}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--ink-60)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    Talk to an expert <ArrowRight size={12} />
                  </button>
                </div>
            </form>

            {/* Trust pills */}
            <div
              style={{
                marginTop: 28,
                display: 'flex',
                gap: 20,
                flexWrap: 'wrap',
                fontSize: '0.86rem',
                color: 'var(--ink-60)'
              }}
            >
              {['Free score', 'No credit card', '~60 second scan'].map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span
                    style={{
                      height: 16,
                      width: 16,
                      borderRadius: 999,
                      background: '#ffffff',
                      color: '#0a0a0f',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckIcon size={10} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <ScoreDial
              stage={stage}
              score={typeof scanResult?.score === 'number' ? scanResult.score : SCORE}
              subscoreSummary={(scanResult?.subscores && scanResult.subscores.length === 4 ? scanResult.subscores : SUBSCORES).map((s) => ({ label: s.label, value: s.value }))}
              platforms={scanResult?.platforms && scanResult.platforms.length === 4 ? scanResult.platforms : PLATFORMS}
              submittedDomain={submittedDomain}
              stepIndex={stepIndex}
            />
        </div>
      </div>
    </section>
  )
}

/* ── 02 — JUMP LINKS ──────────────────────────────────────────────── */
const JUMPS = [
  { n: '01', label: 'What we measure', href: '#measure' },
  { n: '02', label: 'Where we look', href: '#where' },
  { n: '03', label: 'What you get', href: '#deliverable' }
]

function JumpLinks() {
  return (
    <section style={{ padding: '0 0 1rem' }}>
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {JUMPS.map((j) => (
            <a key={j.n} href={j.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-card)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        color: 'var(--ink-50)'
                      }}
                    >
                      {j.n}
                    </span>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--ink)'
                      }}
                    >
                      {j.label}
                    </div>
                  </div>
                  <span style={{ color: 'var(--ink)', display: 'inline-flex' }}>
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Reusable feature block ─────────────────────────────────────── */
function FeatureBlock({
  id,
  eyebrow,
  headline,
  body,
  bullets,
  visual,
  flip
}: {
  id: string
  eyebrow?: string
  headline: string
  body: string[]
  bullets?: string[]
  visual: ReactNode
  flip?: boolean
}) {
  const copy = (
    <div>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 style={{ ...DISPLAY_MD, margin: eyebrow ? '18px 0 0' : '0' }}>{headline}</h2>
      {body.map((p, i) => (
        <p key={i} style={{ ...LEAD, fontSize: '16px', margin: i === 0 ? '24px 0 0' : '18px 0 0' }}>
          {p}
        </p>
      ))}
      {bullets && (
        <ul style={{ listStyle: 'none', margin: '32px 0 0', padding: 0, display: 'grid', gap: 14 }}>
          {bullets.map((t, i) => (
            <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span
                style={{
                  flexShrink: 0,
                  height: 20,
                  width: 20,
                  borderRadius: 999,
                  marginTop: 1,
                  background: '#ffffff',
                  color: '#0a0a0f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CheckIcon size={11} />
              </span>
              <span style={{ fontSize: '14px', lineHeight: 1.55, color: 'var(--ink-70)' }}>{t}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
  return (
    <section id={id} style={{ padding: 'var(--section) 0', scrollMarginTop: 80 }}>
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-center">
          {flip ? (
            <>
              <div>{visual}</div>
              {copy}
            </>
          ) : (
            <>
              {copy}
              <div>{visual}</div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

/* ── 05 — REAL PROMPTS ───────────────────────────────────────────── */
function RealPrompts({ prompts }: { prompts: typeof SAMPLE_PROMPTS }) {
  return (
    <section
      style={{ padding: 'var(--section) 0', background: 'var(--subtle)', scrollMarginTop: 80 }}
      id="prompts"
    >
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[5fr_7fr] md:gap-16 items-end mb-12">
          <div>
            <Eyebrow>Real prompts we ran</Eyebrow>
            <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0' }}>The exact AI answers, side by side.</h2>
          </div>
          <p style={{ ...LEAD, fontSize: '16px', color: 'var(--ink-70)' }}>
            We show the prompt, the AI response, the engine, and whether your brand was
            mentioned. No black box. The free score includes a deeper sample on request.
          </p>
        </div>
        <PromptCards prompts={prompts} />
      </div>
    </section>
  )
}

/* ── 06 — RECOMMENDATIONS ───────────────────────────────────────── */
function RecommendationsSection({
  recommendations
}: {
  recommendations: typeof RECOMMENDATIONS
}) {
  return (
    <section style={{ padding: 'var(--section) 0', scrollMarginTop: 80 }} id="deliverable">
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[5fr_7fr] md:gap-16 items-end mb-12">
          <div>
            <Eyebrow>What you do next</Eyebrow>
            <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0' }}>Three fixes that move the score.</h2>
          </div>
          <p style={{ ...LEAD, fontSize: '16px', color: 'var(--ink-70)' }}>
            Every free score comes with the smallest set of moves likely to lift your visibility
            the most, ranked by estimated impact. Pick the ones that fit your team this quarter.
          </p>
        </div>
        <RecommendationList items={recommendations} />
      </div>
    </section>
  )
}

/* ── 07 — METRICS STRIP (dark) ───────────────────────────────────── */
const REFRESH_STATS = [
  { k: 'Engines sampled', v: '4 engines' },
  { k: 'Prompts run', v: '12 buyer prompts' },
  { k: 'Output', v: '0–100 score' },
  { k: 'Signals', v: 'Mentions · sentiment · citations · SOV' }
]

function MetricsBand() {
  return (
    <section
      style={{
        position: 'relative',
        padding: 'var(--section) 0',
        background: 'var(--ink-surface, var(--ink))',
        color: 'var(--on-ink)',
        overflow: 'hidden'
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.6,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div style={{ ...CONTAINER, position: 'relative' }}>
        <div style={{ maxWidth: 720 }}>
          <TypingHeadline
            text="One snapshot. Four engines. Twelve prompts."
            caretColor="var(--on-ink)"
            style={{ ...DISPLAY_LG, margin: '0', color: 'var(--on-ink)' }}
          />
          <p style={{ ...LEAD, color: 'var(--on-ink-70)', marginTop: 24 }}>
            The free score samples a fixed buyer-prompt set on a single day. It is enough to see
            where you stand, which engines describe you well, and where competitors win.
          </p>
          <p style={{ ...LEAD, color: 'var(--on-ink-70)', marginTop: 18 }}>
            The full Clovion product tracks the same signals daily, alerts when visibility shifts,
            and connects each finding to a fix.
          </p>
        </div>
        <div
          style={{
            marginTop: 56,
            borderTop: '1px solid var(--on-ink-15)',
            borderBottom: '1px solid var(--on-ink-15)',
            overflow: 'hidden',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'clv-marquee 26s linear infinite'
            }}
          >
            {[...REFRESH_STATS, ...REFRESH_STATS].map((s, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: 320,
                  padding: '28px 24px',
                  borderRight: '1px solid var(--on-ink-15)'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--on-ink-50)'
                  }}
                >
                  {s.k}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: 'var(--on-ink)'
                  }}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a
            href="#hero"
            className="btn btn-primary btn-lg"
            onClick={(e) => {
              e.preventDefault()
              if (typeof window !== 'undefined')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              analytics.getFreeScore('free_score_metrics')
            }}
          >
            Get my free score <ArrowRight />
          </a>
          <button
            type="button"
            onClick={() => openCalendly('free_score_metrics')}
            className="btn btn-secondary btn-lg"
            style={{ cursor: 'pointer' }}
          >
            Talk to an expert
          </button>
        </div>
      </div>
    </section>
  )
}

/* ── 08 — FAQ ─────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'What does the free AI visibility score actually measure?',
    a: 'Four signals: how often your brand appears in AI answers, how positively those answers describe you, how often your domain is cited as a source, and your share of voice against the top three competitors. Each is scored 0–100 and combined into a single overall score.'
  },
  {
    q: 'Which AI engines do you check?',
    a: 'ChatGPT, Claude, Perplexity, and Google AI Overviews. The free score uses a fixed buyer-prompt set; the full Clovion product expands coverage to Gemini and Grok and runs the prompts daily.'
  },
  {
    q: 'How is this different from a paid plan?',
    a: 'The free score is one snapshot from one prompt batch. Paid plans run the same prompts daily across more engines, track changes over time, send alerts when your visibility shifts, and connect every finding to a recommended fix.'
  },
  {
    q: 'Is the score accurate enough to make decisions on?',
    a: 'The free score is directional. It is enough to see where you stand and which fixes likely matter most. Teams making roadmap or budget decisions usually move to the paid plan for daily refresh, longer prompt sets, and competitor benchmarks.'
  },
  {
    q: 'What counts as a citation?',
    a: 'A citation is a source link AI engines like Perplexity and AI Overviews attach to their answers. Citation strength tracks how often your domain appears as a cited source for category prompts, not just how often your brand name appears in the text.'
  },
  {
    q: 'Do I need to enter a credit card or sign up?',
    a: 'No. The free score requires only a domain. We do ask for an email if you want the full report sent over, but the on-screen result is free and immediate.'
  }
]

/* ── 09 — FINAL CTA (dark) ────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 28,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            padding: '6rem 3.5rem'
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.6,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          <div style={{ position: 'relative', maxWidth: 640 }}>
            <span style={{ color: 'var(--on-ink-70)' }}>
              <Eyebrow>Start free</Eyebrow>
            </span>
            <h2 style={{ ...DISPLAY_LG, margin: '20px 0 0', color: 'var(--on-ink)' }}>
              Get your free score now.
            </h2>
            <p style={{ ...LEAD, color: 'var(--on-ink-70)', marginTop: 24, maxWidth: 520 }}>
              A minute of your time, a domain in the box, and a score that tells you where
              your AI visibility stands today. No signup, no card.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                href="#hero"
                className="btn btn-primary btn-lg"
                onClick={(e) => {
                  e.preventDefault()
                  if (typeof window !== 'undefined')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  analytics.getFreeScore('free_score_final_cta')
                }}
              >
                Get my free score <ArrowRight />
              </a>
              <button
                type="button"
                onClick={() => openCalendly('free_score_final_cta')}
                className="btn btn-secondary btn-lg"
                style={{ cursor: 'pointer' }}
              >
                Talk to an expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FEATURE CONTENT (default export) ─────────────────────────────── */
export default function FeatureContent() {
  const [stage, setStage] = useState<Stage>('idle')
  const [domain, setDomain] = useState('')
  const [submittedDomain, setSubmittedDomain] = useState('')
  const [stepIndex, setStepIndex] = useState(0)
  const [scanResult, setScanResult] = useState<FreeScoreResult | null>(null)
  const [scanError, setScanError] = useState('')

  /* ── Lead-gate machine ─────────────────────────────────────────────
   * No friction on page load — the hero + scan UI render fully live.
   * The gate triggers ONLY when the visitor clicks the scan submit
   * button. If they've already captured (localStorage flag), the scan
   * fires immediately. Otherwise we stash the typed domain, open the
   * modal, and resume the scan automatically once the form submits.
   */
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingDomain, setPendingDomain] = useState<string>('')

  const handleRequestUnlock = (cleanDomain: string) => {
    setPendingDomain(cleanDomain)
    setModalOpen(true)
  }

  const handleUnlockSuccess = () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LEAD_CAPTURED_KEY, '1')
      } catch {
        // ignore — gate falls back to in-memory unlock for this session.
      }
    }
    setModalOpen(false)
    // Resume the deferred scan with the domain the visitor typed before
    // hitting the gate. If there's no pendingDomain, the modal was
    // opened some other way — just close and let them re-submit.
    if (pendingDomain) {
      setSubmittedDomain(pendingDomain)
      setStage('analyzing')
      setPendingDomain('')
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setPendingDomain('')
  }

  // Walk the analysis-step indicator while we wait on the API. Holds at
  // the last step until the fetch effect below transitions stage.
  useEffect(() => {
    if (stage !== 'analyzing') return
    setStepIndex(0)
    let cancelled = false
    const tick = (i: number) => {
      if (cancelled) return
      if (i >= ANALYSIS_STEPS_COUNT - 1) return
      setTimeout(() => {
        if (cancelled) return
        setStepIndex(i + 1)
        tick(i + 1)
      }, 1100)
    }
    tick(0)
    return () => {
      cancelled = true
    }
  }, [stage])

  // Call the real /api/free-score endpoint when the form submits.
  // The mock step walker above keeps the loading UX alive in parallel;
  // this effect owns the stage transition to 'result' (or back to 'idle'
  // on error).
  useEffect(() => {
    if (stage !== 'analyzing' || !submittedDomain) return
    let cancelled = false
    setScanResult(null)
    setScanError('')
    ;(async () => {
      try {
        const res = await fetch('/api/free-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: submittedDomain })
        })
        const data: { error?: string; result?: FreeScoreResult } = await res
          .json()
          .catch(() => ({}))
        if (cancelled) return
        if (!res.ok || !data.result) {
          setScanError(data.error || 'Scan failed. Try again.')
          setStage('idle')
          return
        }
        setScanResult(data.result)
        setStage('result')
      } catch {
        if (cancelled) return
        setScanError('Network error. Try again.')
        setStage('idle')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [stage, submittedDomain])

  const today = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
    []
  )

  return (
    <>
      <div id="hero" />
      <Hero
        stage={stage}
        setStage={setStage}
        domain={domain}
        setDomain={setDomain}
        submittedDomain={submittedDomain}
        setSubmittedDomain={setSubmittedDomain}
        stepIndex={stepIndex}
        scanResult={scanResult}
        scanError={scanError}
        onRequestUnlock={handleRequestUnlock}
      />

      <JumpLinks />

          <FeatureBlock
            id="measure"
            eyebrow="What we measure"
            headline="Four signals behind one visibility score."
            body={[
              'A single 0–100 number is useful only when you know what it represents. The free score breaks down into four named signals so you can see which part of your AI visibility is strong, which is weak, and where the biggest fix lives.',
              'Each signal is sampled the same way across engines, which means your scores stay comparable as you make changes and run the scan again next quarter.'
            ]}
            bullets={[
              'Mention Rate: how often your brand surfaces in category prompts.',
              'Sentiment: how AI engines describe you when you do appear.',
              'Citation Strength: how often your domain is cited as a source.',
              'Competitive Position: your share of voice against the top three rivals.'
            ]}
            visual={<SubscoreCards subscores={scanResult?.subscores && scanResult.subscores.length === 4 ? scanResult.subscores : SUBSCORES} />}
          />

          <FeatureBlock
            id="where"
            flip
            eyebrow="Where we look"
            headline="Four engines, twelve prompts, one snapshot."
            body={[
              'The free check runs the same buyer-style prompt set across the AI engines most buyers actually use during the early stages of a purchase decision.',
              'Prompts are category-level, not branded. That keeps the scan honest: you only score when AI surfaces you organically, the way a real prospect would find you.'
            ]}
            bullets={[
              'ChatGPT for the broadest reach in conversational answers.',
              'Claude for sentiment and reasoning-heavy responses.',
              'Perplexity for cited, source-linked answers.',
              'Google AI Overviews for generative results inside search.'
            ]}
            visual={<PlatformPanel platforms={scanResult?.platforms && scanResult.platforms.length === 4 ? scanResult.platforms : PLATFORMS} />}
          />

          <RealPrompts prompts={scanResult?.prompts && scanResult.prompts.length > 0 ? scanResult.prompts : SAMPLE_PROMPTS} />
          <RecommendationsSection
            recommendations={scanResult?.recommendations && scanResult.recommendations.length > 0 ? scanResult.recommendations : RECOMMENDATIONS}
          />
      <MetricsBand />
      <FAQAccordion items={FAQS} />
      <FinalCTA />

      {/* Lead-gate modal — always mounted, controlled by modalOpen. Opens
          when the visitor clicks the scan submit button without having
          previously captured (no localStorage flag). */}
      <LeadCaptureModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleUnlockSuccess}
      />
    </>
  )
}

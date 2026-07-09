'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from 'react'
import { Button, ArrowRight } from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'
import { RED } from '@/components/home/mocks/palette'
import { cb, useReducedMotion, useStagger, useCountUp } from '@/components/home/mocks/motion'
import { openCalendly } from '@/lib/openCalendly'
import ToolLeadModal from '@/components/tools/shared/ToolLeadModal'
import ToolResultModal from '@/components/tools/shared/ToolResultModal'
import { useToolLeadGate } from '@/components/tools/shared/useToolLeadGate'
import { FAQS } from './faqs'

/* ─────────────────────────────────────────────────────────────────────
 *  Shared style tokens — all colors via var(--*) so .clv-dark flips work.
 * ────────────────────────────────────────────────────────────────────── */
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

/* ── Tiny eyebrow that follows the dark page's mono treatment ───────── */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: 'var(--ink-60)'
      }}
    >
      {children}
    </span>
  )
}

/* ── Inline icons (kept local to avoid an extra round-trip) ─────────── */
function ArrowRightSmall({ size = 14 }: { size?: number }) {
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

function ExportIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 2v8M5 7l3-3 3 3M3 12v1a1 1 0 001 1h8a1 1 0 001-1v-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckTiny({ size = 10 }: { size?: number }) {
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

function XTiny({ size = 9 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  Result shape — from /api/tools/crawlability (real robots.txt fetch).
 * ────────────────────────────────────────────────────────────────────── */
type Bot = {
  engine: string
  ua: string
  status: 'Allowed' | 'Blocked'
  detail: string
}

type CrawlResult = {
  url: string
  exists: boolean
  robotsUrl: string
  bots: Bot[]
  allowedCount: number
  total: number
}

/* ─────────────────────────────────────────────────────────────────────
 *  URL validation — mirrors the spec's "Your website URL" expectation.
 *  Accepts bare domain (clovion.ai), www.clovion.ai, and https://clovion.ai.
 * ────────────────────────────────────────────────────────────────────── */
function normalizeUrl(raw: string) {
  return raw.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '').toLowerCase()
}

function isValidUrl(raw: string) {
  const v = normalizeUrl(raw)
  if (!v || v.length > 253) return false
  if (/\s/.test(v)) return false
  if (!/^[a-z0-9.-]+\.[a-z]{2,}/i.test(v)) return false
  if (/^\d+\.\d+\.\d+\.\d+/.test(v)) return false
  if (/^(localhost|127\.|10\.|192\.168\.)/i.test(v)) return false
  return true
}

/* ─────────────────────────────────────────────────────────────────────
 *  01 — HERO + FORM
 *  Centered tool hero, plain static H1, single URL input, "Check now" CTA.
 *  ResultCard appears below on submit; form stays visible.
 * ────────────────────────────────────────────────────────────────────── */
type Stage = 'idle' | 'checking' | 'result'

function HeroWithForm({
  stage,
  url,
  setUrl,
  submittedUrl,
  error,
  setError,
  result,
  runCheck,
  onResetAll,
  gateRun
}: {
  stage: Stage
  url: string
  setUrl: (s: string) => void
  submittedUrl: string
  error: string
  setError: (s: string) => void
  result: CrawlResult | null
  runCheck: (rawUrl: string) => void | Promise<void>
  onResetAll: () => void
  gateRun: (action: () => void) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  const onSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (stage === 'checking') return
    if (!isValidUrl(url)) {
      setError('Enter a valid website URL, like https://yourbrand.com.')
      inputRef.current?.focus()
      return
    }
    setError('')
    // Gate the check behind the lead form; run the real fetch on success.
    gateRun(() => {
      void runCheck(url)
    })
  }

  const onReset = () => {
    onResetAll()
  }

  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      {/* HeroShade equivalent — 4 soft corner vignettes on the dark page */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: [
            'radial-gradient(circle at 0% 0%, rgba(10,10,15,0.05), transparent 42%)',
            'radial-gradient(circle at 100% 0%, rgba(10,10,15,0.05), transparent 42%)',
            'radial-gradient(circle at 0% 100%, rgba(10,10,15,0.04), transparent 42%)',
            'radial-gradient(circle at 100% 100%, rgba(10,10,15,0.04), transparent 42%)'
          ].join(', ')
        }}
      />
      <div style={{ ...CONTAINER, padding: 'clamp(4rem, 8vw, 7rem) 2rem clamp(3rem, 5vw, 4.5rem)' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>Free Tool</Eyebrow>
          <h1
            style={{
              ...DISPLAY_LG,
              fontSize: 'clamp(2rem, 3.6vw + 0.4rem, 3.3rem)',
              margin: '18px 0 0',
              color: 'var(--ink)'
            }}
          >
            AI Crawlability Checker
          </h1>
          <p style={{ ...LEAD, margin: '20px auto 0', maxWidth: 620 }}>
            Check if ChatGPT, Claude, Perplexity, Gemini, and Google AI Overviews can crawl your site — see exactly which AI bots your robots.txt blocks.
          </p>

          <form onSubmit={onSubmit} noValidate>
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                justifyContent: 'center',
                maxWidth: 560,
                margin: '36px auto 0'
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (error) setError('')
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="https://yourbrand.com"
                autoComplete="off"
                spellCheck={false}
                aria-label="Your website URL"
                disabled={stage === 'checking'}
                className="clv-form-field"
                style={{
                  flex: '1 1 320px',
                  height: 56,
                  padding: '0 20px',
                  background: 'var(--subtle)',
                  color: 'var(--ink)',
                  border: `1px solid ${
                    error ? RED : focused ? 'var(--ink)' : 'var(--ink-25)'
                  }`,
                  borderRadius: 'var(--radius-pill, 999px)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  outline: focused ? `2px solid var(--focus-ring, rgba(10,10,15,0.25))` : 'none',
                  outlineOffset: 2,
                  transition: `border-color 0.2s ${cb}, outline-color 0.2s ${cb}`
                }}
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                trackEvent="cta_click"
                trackLocation="tools_ai_crawler_checker_hero"
              >
                {stage === 'checking' ? 'Checking…' : 'Check now'} <ArrowRight />
              </Button>
            </div>

            {error && (
              <p
                role="alert"
                style={{
                  margin: '12px auto 0',
                  maxWidth: 560,
                  fontSize: 13,
                  color: RED,
                  textAlign: 'center'
                }}
              >
                {error}
              </p>
            )}

            {/* helper row under the form */}
            <div
              style={{
                marginTop: 20,
                display: 'flex',
                gap: 20,
                flexWrap: 'wrap',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-60)'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: 'var(--positive)'
                  }}
                />
                10 AI bots checked
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: 'var(--ink)'
                  }}
                />
                Instant readout
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: 'var(--ink)'
                  }}
                />
                No signup
              </span>
            </div>
          </form>

          {/* example pill + reset link */}
          <div
            style={{
              marginTop: 18,
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              disabled={stage === 'checking'}
              onClick={() => {
                if (stage === 'checking') return
                setError('')
                setUrl('https://notion.so')
                gateRun(() => {
                  void runCheck('https://notion.so')
                })
              }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--ink-60)',
                border: '1px solid var(--ink-25)',
                borderRadius: 999,
                padding: '6px 14px',
                cursor: stage === 'checking' ? 'wait' : 'pointer',
                background: 'transparent',
                opacity: stage === 'checking' ? 0.5 : 1
              }}
            >
              Try: notion.so <ArrowRightSmall size={12} />
            </button>
            {stage === 'result' && (
              <button
                type="button"
                onClick={onReset}
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
                Reset
              </button>
            )}
          </div>
        </div>

        {/* ── RESULT POPUP ── */}
        <ToolResultModal open={stage === 'checking' || stage === 'result'} onClose={onReset}>
          <ResultCard stage={stage} submittedUrl={submittedUrl} result={result} />
        </ToolResultModal>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  RESULT CARD — renders inside the dark ToolResultModal (dark tokens).
 *  Stagger-reveals header → summary strip → rows.
 * ────────────────────────────────────────────────────────────────────── */
function ResultCard({
  stage,
  submittedUrl,
  result
}: {
  stage: Stage
  submittedUrl: string
  result: CrawlResult | null
}) {
  const reduced = useReducedMotion()
  const play = stage === 'result'
  const bots = result?.bots ?? []

  const rowFlags = useStagger(bots.length, play, 60, 220)
  const allowedCount = useCountUp(result?.allowedCount ?? 0, play, { durationMs: 700, startMs: 120 })
  const summaryRevealed = useStagger(2, play, 100, 80) // [summary text, export pill]

  // checking: dotted loading shimmer card
  if (stage === 'checking') {
    return (
      <div style={{ color: 'var(--ink)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-50)'
              }}
            >
              Scanning robots.txt
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem',
                fontWeight: 600,
                color: 'var(--ink)'
              }}
            >
              {submittedUrl || 'your site'}
            </div>
          </div>
          <div
            aria-hidden
            style={{
              display: 'inline-flex',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 999,
              background: 'var(--subtle)',
              border: '1px solid var(--line)'
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: 'var(--ink-25)',
                  animation: reduced
                    ? 'none'
                    : `clv-chatdot 1.1s ${i * 0.15}s infinite ease-in-out`
                }}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            display: 'grid',
            gap: 10
          }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 44,
                borderRadius: 12,
                background: 'var(--subtle)',
                border: '1px solid var(--line)',
                opacity: 0.65 - i * 0.08
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ color: 'var(--ink)' }}>
      {/* header strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--ink-50)'
            }}
          >
            Results · robots.txt audit
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              wordBreak: 'break-all'
            }}
          >
            {submittedUrl || 'your-site.com'}
          </div>
        </div>
        <button
          type="button"
          aria-label="Export results"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 38,
            width: 38,
            borderRadius: 999,
            background: 'var(--subtle)',
            border: '1px solid var(--line)',
            color: 'var(--ink)',
            cursor: 'pointer',
            opacity: summaryRevealed[1] ? 1 : 0,
            transform: summaryRevealed[1] ? 'translateY(0)' : 'translateY(6px)',
            transition: `opacity 0.4s ${cb}, transform 0.4s ${cb}, background 0.2s ${cb}`
          }}
          onClick={(e) => e.preventDefault()}
        >
          <ExportIcon size={15} />
        </button>
      </div>

      {/* summary strip — emerald one-liner */}
      <div
        style={{
          marginTop: 22,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 999,
          background: 'var(--positive-bg)',
          border: '1px solid var(--positive-border)',
          color: 'var(--positive)',
          opacity: summaryRevealed[0] ? 1 : 0,
          transform: summaryRevealed[0] ? 'translateY(0)' : 'translateY(6px)',
          transition: `opacity 0.4s ${cb}, transform 0.4s ${cb}`
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 18,
            height: 18,
            borderRadius: 999,
            background: 'var(--positive)',
            color: '#ffffff'
          }}
        >
          <CheckTiny size={11} />
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '-0.01em'
          }}
        >
          {allowedCount} of {bots.length} AI bots can crawl your site
        </span>
      </div>

      {/* TABLE */}
      <div
        role="table"
        style={{
          marginTop: 22,
          border: '1px solid var(--line)',
          borderRadius: 16,
          overflow: 'hidden',
          background: 'var(--white)'
        }}
      >
        {/* header row */}
        <div
          role="row"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1.1fr) minmax(0, 0.9fr)',
            padding: '14px 18px',
            background: 'var(--subtle)',
            borderBottom: '1px solid var(--line)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--ink-60)',
            gap: 12
          }}
        >
          <span>AI Engine</span>
          <span>User-Agent</span>
          <span style={{ textAlign: 'right' }}>Status</span>
        </div>
        {bots.map((b, i) => (
          <div
            key={b.ua}
            role="row"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1.1fr) minmax(0, 0.9fr)',
              alignItems: 'center',
              gap: 12,
              padding: '14px 18px',
              borderBottom: i === bots.length - 1 ? 'none' : '1px solid var(--line)',
              opacity: rowFlags[i] ? 1 : 0,
              transform: rowFlags[i] ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.4s ${cb}, transform 0.4s ${cb}`,
              minWidth: 0
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  color: 'var(--ink)',
                  letterSpacing: '-0.01em'
                }}
              >
                {b.engine}
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontSize: '0.78rem',
                  color: 'var(--ink-60)',
                  lineHeight: 1.4
                }}
              >
                {b.detail}
              </div>
            </div>
            <code
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--ink-80)',
                background: 'var(--subtle)',
                padding: '4px 8px',
                borderRadius: 6,
                justifySelf: 'start',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}
            >
              {b.ua}
            </code>
            <div style={{ justifySelf: 'end' }}>
              <StatusPill status={b.status} />
            </div>
          </div>
        ))}
      </div>

      {/* footer note */}
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--ink-50)'
        }}
      >
        <span>Checked against /robots.txt at the URL root</span>
        <a
          href="/free-ai-visibility-score"
          style={{
            color: 'var(--ink)',
            textDecoration: 'underline',
            textUnderlineOffset: 3,
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          Get the full visibility score <ArrowRightSmall size={12} />
        </a>
      </div>
    </div>
  )
}

function StatusPill({ status }: { status: 'Allowed' | 'Blocked' }) {
  const isAllowed = status === 'Allowed'
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '5px 12px 5px 10px',
        borderRadius: 999,
        fontFamily: 'var(--font-display)',
        fontSize: '0.82rem',
        fontWeight: 600,
        letterSpacing: '-0.005em',
        background: isAllowed ? 'var(--positive-bg)' : 'rgba(248,113,113,0.13)',
        border: `1px solid ${isAllowed ? 'var(--positive-border)' : 'rgba(248,113,113,0.32)'}`,
        color: isAllowed ? 'var(--positive)' : '#f87171',
        whiteSpace: 'nowrap'
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 14,
          height: 14,
          borderRadius: 999,
          background: isAllowed ? 'var(--positive)' : '#f87171',
          color: '#ffffff'
        }}
      >
        {isAllowed ? <CheckTiny size={9} /> : <XTiny size={8} />}
      </span>
      {status}
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  02 — EDUCATIONAL SECTION
 *  "What are AI crawlers?" 3-paragraph explainer + 4-tile grid.
 * ────────────────────────────────────────────────────────────────────── */
const ENGINE_TILES: { name: string; ua: string; blurb: string }[] = [
  {
    name: 'ChatGPT uses GPTBot',
    ua: 'GPTBot · ChatGPT-User',
    blurb:
      'OpenAI runs two relevant agents: GPTBot collects training data, ChatGPT-User fetches pages when a ChatGPT user browses live.'
  },
  {
    name: 'Claude uses ClaudeBot family',
    ua: 'ClaudeBot · Claude-Web · anthropic-ai',
    blurb:
      'Anthropic ships three: ClaudeBot powers live answers, Claude-Web is the general crawler, anthropic-ai collects training data.'
  },
  {
    name: 'Perplexity uses PerplexityBot',
    ua: 'PerplexityBot',
    blurb:
      'Perplexity uses a single agent. Allowing it makes you eligible to appear as a cited source in Perplexity answers.'
  },
  {
    name: 'Gemini uses Google-Extended',
    ua: 'Google-Extended',
    blurb:
      'Google-Extended is the opt-out signal for Gemini and Google AI Overviews. Blocking it cuts you out of both.'
  }
]

function EducationalSection() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <Eyebrow>Background</Eyebrow>
            <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0', color: 'var(--ink)' }}>
              What are AI crawlers?
            </h2>
            <p style={{ ...LEAD, fontSize: '1rem', margin: '20px 0 0' }}>
              AI crawlers are the automated user-agents that AI products send to your site so they can read it, index it, or cite it back to a user.
            </p>
            <p style={{ ...LEAD, fontSize: '1rem', margin: '16px 0 0' }}>
              They are not all the same. Some bots collect training data. Some fetch pages live when a user asks a question. Some build the search index that powers AI Overviews. Your robots.txt controls each one independently.
            </p>
            <p style={{ ...LEAD, fontSize: '1rem', margin: '16px 0 0' }}>
              If you want to appear in AI answers, the live-answer and retrieval bots are the ones that matter. The training crawlers are a separate, slower, content-policy decision.
            </p>
          </div>
          <div
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            style={{ marginTop: 4 }}
          >
            {ENGINE_TILES.map((t) => (
              <div
                key={t.name}
                style={{
                  position: 'relative',
                  padding: 22,
                  borderRadius: 18,
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  color: 'var(--ink)',
                  overflow: 'hidden'
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.5,
                    background:
                      'radial-gradient(ellipse 70% 60% at 100% 0%, rgba(10,10,15,0.05), transparent 60%)',
                    pointerEvents: 'none'
                  }}
                />
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: 'var(--ink)'
                    }}
                  >
                    {t.name}
                  </div>
                  <code
                    style={{
                      display: 'inline-block',
                      marginTop: 10,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      color: 'var(--ink-70)',
                      background: 'var(--subtle)',
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: '1px solid var(--line)'
                    }}
                  >
                    {t.ua}
                  </code>
                  <p
                    style={{
                      margin: '14px 0 0',
                      fontSize: '0.92rem',
                      lineHeight: 1.55,
                      color: 'var(--ink-70)'
                    }}
                  >
                    {t.blurb}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  03 — FINAL CTA
 *  Mirrors HomeCTA.tsx EXACTLY (cloned, not imported — different copy
 *  + tracking per tool).
 * ────────────────────────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 0' }}>
      <div style={CONTAINER}>
        <div
          className="clv-dark"
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 24,
            background: 'var(--white)',
            color: 'var(--on-ink)',
            padding: 'clamp(2.25rem, 6vw, 6rem) clamp(1.25rem, 4vw, 3.5rem)'
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
                maxWidth: 520,
                textWrap: 'balance' as CSSProperties['textWrap']
              }}
            >
              Crawler access is one signal. The full score adds mention rate, sentiment, citations, and competitive position across ChatGPT, Claude, Perplexity, and AI Overviews — in about a minute.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button
                href="/free-ai-visibility-score"
                variant="primary"
                size="lg"
                trackLocation="tools_ai_crawler_final_cta"
              >
                Get Free Score <ArrowRight />
              </Button>
              <Button
                variant="invert"
                size="lg"
                onClick={(e) => {
                  e.preventDefault()
                  openCalendly('tools_ai_crawler_final_cta', undefined, 'Talk to an Expert')
                }}
              >
                Talk to an Expert
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────────────
 *  DEFAULT EXPORT — composes the tool page.
 * ────────────────────────────────────────────────────────────────────── */
export default function FeatureContent() {
  const [stage, setStage] = useState<Stage>('idle')
  const [url, setUrl] = useState('')
  const [submittedUrl, setSubmittedUrl] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<CrawlResult | null>(null)
  const gate = useToolLeadGate()

  // Real robots.txt fetch + per-engine evaluation (runs after the lead gate).
  const runCheck = async (rawUrl: string) => {
    setSubmittedUrl(normalizeUrl(rawUrl))
    setStage('checking')
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/tools/crawlability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: rawUrl.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStage('idle')
        if (data?.code === 'rate_limited') setError('Too many checks — give it a minute and try again.')
        else if (data?.code === 'timeout') setError('That site took too long to respond. Try again.')
        else if (data?.code === 'bad_domain' || data?.code === 'bad_url')
          setError('That doesn’t look like a reachable website URL.')
        else if (data?.code === 'unreachable')
          setError('We couldn’t reach that site. Check the URL and try again.')
        else setError(data?.error || 'Could not check that site. Try again.')
        return
      }
      setResult(data as CrawlResult)
      setStage('result')
    } catch {
      setStage('idle')
      setError('Network error — please try again.')
    }
  }

  const onResetAll = () => {
    setStage('idle')
    setSubmittedUrl('')
    setError('')
    setResult(null)
  }

  return (
    <>
      <HeroWithForm
        stage={stage}
        url={url}
        setUrl={setUrl}
        submittedUrl={submittedUrl}
        error={error}
        setError={setError}
        result={result}
        runCheck={runCheck}
        onResetAll={onResetAll}
        gateRun={gate.request}
      />
      <ToolLeadModal open={gate.open} tool="ai-crawlability-checker" onClose={gate.close} onSuccess={gate.success} />
      <EducationalSection />
      <FAQAccordion items={FAQS} />
      <FinalCTA />
    </>
  )
}

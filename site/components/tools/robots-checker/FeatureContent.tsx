'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Button, Eyebrow, HeroShade, ArrowRight } from '@/components/ui'
import { openCalendly } from '@/lib/openCalendly'
import { RED } from '@/components/home/mocks/palette'
import { cb, useReducedMotion, useStagger } from '@/components/home/mocks/motion'
import { FAQAccordion } from '@/components/FAQAccordion'
import ToolLeadModal from '@/components/tools/shared/ToolLeadModal'
import { useToolLeadGate } from '@/components/tools/shared/useToolLeadGate'
import { FAQS } from './faqs'

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

/* Clovion white wordmark — used in the dark result modal header. */
const CLOVION_LOGO =
  'https://res.cloudinary.com/doajh6jwk/image/upload/v1782804104/Clovion-Logo-white_xoqx8t.png'

/* Dark-brand red for "Blocked" pills + Disallow tint (light pinks read wrong
   on the black modal surface). */
const RED_BRIGHT = '#f87171'
const RED_BG_DARK = 'rgba(248,113,113,0.13)'
const RED_BORDER_DARK = 'rgba(248,113,113,0.32)'
const GREEN_BRIGHT = '#4ade80'

/* ── Result shape (from /api/tools/robots) ────────────────────────── */
type Status = 'allowed' | 'blocked' | 'indeterminate'

type BotRow = {
  bot: string
  ua: string
  rule: string
  status: Status
}

type RobotsResult = {
  source: 'url' | 'paste'
  url?: string
  exists: boolean
  robotsUrl: string | null
  robotsText: string
  bots: BotRow[]
  counts: { allowed: number; blocked: number; indeterminate: number }
  fetchedStatus?: number
}

/* ── Icons ──────────────────────────────────────────────────────── */
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
function XIcon({ size = 11 }: { size?: number }) {
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
function PlusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
function CopyIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="3" y="3" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5.5 1.5h7a2 2 0 0 1 2 2v7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
function GlobeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
function CodeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── 01 — HERO with integrated form ───────────────────────────────── */
type Tab = 'url' | 'paste'
type Stage = 'idle' | 'submitting' | 'result'

function Hero({
  tab,
  setTab,
  url,
  setUrl,
  paste,
  setPaste,
  stage,
  serverError,
  onRun,
  onReset,
  showReset
}: {
  tab: Tab
  setTab: (t: Tab) => void
  url: string
  setUrl: (s: string) => void
  paste: string
  setPaste: (s: string) => void
  stage: Stage
  serverError: string
  onRun: () => void
  onReset: () => void
  showReset: boolean
}) {
  const [error, setError] = useState<string>('')
  const urlRef = useRef<HTMLInputElement>(null)
  const pasteRef = useRef<HTMLTextAreaElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [underline, setUnderline] = useState<{ left: number; width: number }>({ left: 0, width: 0 })

  // Position the sliding underline beneath the active tab.
  useEffect(() => {
    const idx = tab === 'url' ? 0 : 1
    const node = tabRefs.current[idx]
    if (!node) return
    setUnderline({ left: node.offsetLeft, width: node.offsetWidth })
  }, [tab])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (tab === 'url') {
      const v = url.trim()
      if (!v) {
        setError('Enter a URL like example.com.')
        urlRef.current?.focus()
        return
      }
    } else {
      const v = paste.trim()
      if (!v) {
        setError('Paste your robots.txt content above.')
        pasteRef.current?.focus()
        return
      }
    }
    setError('')
    // Gate the run behind the lead form; the composer kicks off the scan on
    // a successful submit.
    onRun()
  }

  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <HeroShade />
      <div style={{ ...CONTAINER, padding: '6rem 2rem 4rem' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>FREE TOOL</Eyebrow>
          <h1
            style={{
              ...DISPLAY_LG,
              fontSize: 'clamp(2rem, 3vw + 0.4rem, 3.1rem)',
              margin: '18px 0 0',
              color: 'var(--ink)'
            }}
          >
            Robots.txt AI Bot Checker.
          </h1>
          <p style={{ ...LEAD, margin: '20px auto 0', maxWidth: 580 }}>
            Paste your robots.txt or enter a URL. See exactly which of 15 AI bots are allowed,
            blocked, or fall through the cracks of your rules.
          </p>

          {/* Segmented tabs + sliding underline */}
          <div
            style={{
              marginTop: 36,
              display: 'inline-flex',
              gap: 4,
              padding: 4,
              background: 'var(--ink-surface)',
              border: '1px solid var(--ink-25)',
              borderRadius: 'var(--radius-pill)',
              position: 'relative'
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'absolute',
                top: 4,
                bottom: 4,
                left: underline.left,
                width: underline.width,
                background: 'var(--white)',
                borderRadius: 'var(--radius-pill)',
                transition: `left 250ms ${cb}, width 250ms ${cb}`,
                pointerEvents: 'none'
              }}
            />
            {(['url', 'paste'] as const).map((key, i) => (
              <button
                key={key}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                onClick={() => setTab(key)}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  border: 'none',
                  background: 'transparent',
                  padding: '10px 22px',
                  borderRadius: 'var(--radius-pill)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.92rem',
                  color: tab === key ? 'var(--ink)' : 'var(--ink-70)',
                  cursor: 'pointer',
                  transition: `color 220ms ${cb}`
                }}
              >
                {key === 'url' ? 'Fetch from URL' : 'Paste robots.txt'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
            {tab === 'url' ? (
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  maxWidth: 560,
                  margin: '0 auto'
                }}
              >
                <div style={{ flex: '1 1 320px', position: 'relative', minWidth: 0 }}>
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      left: 18,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--ink-50)',
                      pointerEvents: 'none'
                    }}
                  >
                    <GlobeIcon />
                  </span>
                  <input
                    ref={urlRef}
                    type="text"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="https://example.com"
                    autoComplete="off"
                    spellCheck={false}
                    disabled={stage === 'submitting'}
                    aria-label="URL to fetch robots.txt from"
                    className="clv-form-field"
                    style={{
                      width: '100%',
                      height: 56,
                      padding: '0 20px 0 46px',
                      background: 'var(--ink-surface)',
                      color: 'var(--ink)',
                      border: `1px solid ${error ? RED : 'var(--ink-25)'}`,
                      borderRadius: 'var(--radius-pill)',
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: `border-color 200ms ${cb}`
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  trackEvent="cta_click"
                  trackLocation="tools_robots_checker_hero"
                >
                  {stage === 'submitting' ? 'Checking…' : 'Check'} <ArrowRight />
                </Button>
              </div>
            ) : (
              <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <textarea
                  ref={pasteRef}
                  value={paste}
                  onChange={(e) => {
                    setPaste(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder={`# Paste your robots.txt here\nUser-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /`}
                  spellCheck={false}
                  disabled={stage === 'submitting'}
                  aria-label="robots.txt contents"
                  rows={12}
                  className="clv-form-field"
                  style={{
                    width: '100%',
                    minHeight: 240,
                    padding: '16px 18px',
                    background: 'var(--ink-surface)',
                    color: 'var(--ink)',
                    border: `1px solid ${error ? RED : 'var(--ink-25)'}`,
                    borderRadius: 18,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    outline: 'none',
                    resize: 'vertical',
                    transition: `border-color 200ms ${cb}`,
                    textAlign: 'left',
                    whiteSpace: 'pre'
                  }}
                />
                <div
                  style={{
                    marginTop: 14,
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}
                >
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    trackEvent="cta_click"
                    trackLocation="tools_robots_checker_hero"
                  >
                    {stage === 'submitting' ? 'Checking…' : 'Check'} <ArrowRight />
                  </Button>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: 'var(--ink-50)',
                      letterSpacing: '0.04em'
                    }}
                  >
                    {paste.length === 0 ? '0 lines' : `${paste.split('\n').length} lines`}
                  </span>
                </div>
              </div>
            )}

            {(error || serverError) && (
              <p
                style={{
                  marginTop: 12,
                  fontSize: '0.81rem',
                  color: RED,
                  textAlign: tab === 'url' ? 'center' : 'left',
                  maxWidth: tab === 'url' ? '100%' : 720,
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}
              >
                {error || serverError}
              </p>
            )}

            {showReset && (
              <button
                type="button"
                onClick={onReset}
                style={{
                  marginTop: 18,
                  background: 'none',
                  border: 'none',
                  color: 'var(--ink-70)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textUnderlineOffset: 4
                }}
              >
                Reset
              </button>
            )}
          </form>

        </div>
      </div>
    </section>
  )
}

/* ── 02 — RESULT MODAL (Clovion dark-brand popup) ─────────────────── */
function ResultModal({
  open,
  onClose,
  result
}: {
  open: boolean
  onClose: () => void
  result: RobotsResult | null
}) {
  const reduced = useReducedMotion()
  // `shown` drives the entrance transition: it flips true one frame after the
  // modal mounts so opacity/transform animate from their initial values.
  const [shown, setShown] = useState(false)
  const bots = result?.bots ?? []
  const rowFlags = useStagger(bots.length, shown, 45, 220)
  const [parsedOpen, setParsedOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const allowed = result?.counts.allowed ?? 0
  const blocked = result?.counts.blocked ?? 0
  const indeterminate = result?.counts.indeterminate ?? 0

  // Trigger parsed-rules slide-in after table rows finish staggering.
  const [parsedReveal, setParsedReveal] = useState(false)

  // Body scroll lock + Esc to close while the modal is open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  // Reset + replay the reveal each time the modal opens.
  useEffect(() => {
    if (!open) {
      setShown(false)
      setParsedReveal(false)
      setParsedOpen(false)
      return
    }
    if (reduced) {
      setShown(true)
      setParsedReveal(true)
      return
    }
    const raf = requestAnimationFrame(() => setShown(true))
    const t = window.setTimeout(() => setParsedReveal(true), 220 + bots.length * 45 + 80)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
    }
  }, [open, reduced, bots.length])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result?.robotsText ?? '')
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore — clipboard unavailable */
    }
  }

  if (!open || !result) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="robots-result-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(8,8,11,0.55)',
        backdropFilter: 'blur(4px)',
        opacity: shown ? 1 : 0,
        transition: `opacity 240ms ${cb}`
      }}
    >
      <div
        style={{
          containerType: 'inline-size',
          position: 'relative',
          background: 'var(--white)',
          color: 'var(--ink)',
          border: '1px solid var(--line)',
          borderRadius: 24,
          padding: 'clamp(22px, 3.2cqw, 44px)',
          boxShadow: '0 40px 120px -24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
          width: '100%',
          maxWidth: 1080,
          maxHeight: '90vh',
          overflowY: 'auto',
          textAlign: 'left',
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 360ms ${cb}, transform 360ms ${cb}`
        }}
      >
        {/* Brand bar — Clovion logo + close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 22
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CLOVION_LOGO}
            alt="Clovion AI"
            style={{ height: 26, width: 'auto', display: 'block' }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 999,
              border: '1px solid var(--line)',
              background: 'var(--ink-surface)',
              color: 'var(--ink-60)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: `color 160ms ${cb}, border-color 160ms ${cb}`
            }}
          >
            <XIcon size={13} />
          </button>
        </div>

        {/* Audit header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            paddingBottom: 18,
            borderBottom: '1px solid var(--line)'
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                letterSpacing: '0.10em',
                color: 'var(--ink-50)'
              }}
            >
              Robots.txt audit
            </p>
            <h3
              id="robots-result-title"
              style={{
                margin: '6px 0 0',
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--ink)'
              }}
            >
              AI bot status
            </h3>
            {result.url && (
              <p
                style={{
                  margin: '6px 0 0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--ink-60)'
                }}
              >
                {result.robotsUrl || result.url}
                {!result.exists && (
                  <span style={{ color: 'var(--ink-50)' }}> · no robots.txt found — all bots allowed by default</span>
                )}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Pill tone="ok">{allowed} Allowed</Pill>
            <Pill tone="bad">{blocked} Blocked</Pill>
            <Pill tone="neutral">{indeterminate} Indeterminate</Pill>
          </div>
        </div>

        {/* Section A — bot table */}
        <div style={{ marginTop: 18, overflow: 'auto' }}>
          <div
            role="table"
            style={{
              minWidth: 560,
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr 1.3fr 0.9fr',
              fontSize: '0.86rem'
            }}
          >
            {/* head */}
            {['AI bot', 'User-agent', 'Matched rule', 'Status'].map((h) => (
              <div
                key={h}
                role="columnheader"
                style={{
                  padding: '10px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.10em',
                  color: 'var(--ink-50)',
                  borderBottom: '1px solid var(--line)'
                }}
              >
                {h}
              </div>
            ))}
            {/* rows */}
            {bots.map((b, i) => (
              <BotRowCells key={b.bot} row={b} revealed={rowFlags[i]} />
            ))}
          </div>
        </div>

        {/* Section B — parsed rules collapse (only when a robots.txt was found) */}
        {result.exists && result.robotsText.trim() && (
        <div
          style={{
            marginTop: 24,
            border: '1px solid var(--line)',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--subtle)',
            opacity: parsedReveal ? 1 : 0,
            transform: parsedReveal ? 'translateY(0)' : 'translateY(8px)',
            transition: `opacity 380ms ${cb}, transform 380ms ${cb}`
          }}
        >
          <button
            type="button"
            onClick={() => setParsedOpen((o) => !o)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--ink)'
              }}
            >
              <span style={{ color: 'var(--ink-60)' }}>
                <CodeIcon />
              </span>
              Parsed rules
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy()
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    e.stopPropagation()
                    handleCopy()
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-pill)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  letterSpacing: '0.04em',
                  color: copied ? 'var(--positive)' : 'var(--ink-70)',
                  cursor: 'pointer',
                  transition: `color 200ms ${cb}`
                }}
                aria-label="Copy robots.txt sample"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
                {copied ? 'Copied' : 'Copy'}
              </span>
              <span
                aria-hidden
                style={{
                  color: 'var(--ink-50)',
                  transform: parsedOpen ? 'rotate(45deg)' : 'none',
                  transition: `transform 250ms ${cb}`,
                  display: 'inline-flex'
                }}
              >
                <PlusIcon size={16} />
              </span>
            </span>
          </button>
          <div
            style={{
              overflow: 'hidden',
              maxHeight: parsedOpen ? 600 : 0,
              transition: `max-height 380ms ${cb}`
            }}
          >
            <pre
              style={{
                margin: 0,
                padding: '4px 18px 18px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                lineHeight: 1.65,
                color: 'var(--ink-80)',
                background: 'transparent',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {tintRobots(result.robotsText)}
            </pre>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

function BotRowCells({ row, revealed }: { row: BotRow; revealed: boolean }) {
  const cellBase: CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid var(--line)',
    fontSize: '0.86rem',
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateY(0)' : 'translateY(6px)',
    transition: `opacity 0.4s ${cb}, transform 0.4s ${cb}`
  }
  return (
    <>
      <div role="cell" style={{ ...cellBase, fontWeight: 600, color: 'var(--ink)' }}>
        {row.bot}
      </div>
      <div
        role="cell"
        style={{
          ...cellBase,
          fontFamily: 'var(--font-mono)',
          color: 'var(--ink-70)',
          fontSize: '0.79rem'
        }}
      >
        {row.ua}
      </div>
      <div
        role="cell"
        style={{
          ...cellBase,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.78rem',
          color: 'var(--ink-60)'
        }}
      >
        {row.rule}
      </div>
      <div role="cell" style={cellBase}>
        <StatusPill status={row.status} />
      </div>
    </>
  )
}

function StatusPill({ status }: { status: Status }) {
  if (status === 'allowed') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: 'var(--positive-bg)',
          border: '1px solid var(--positive-border)',
          color: 'var(--positive)',
          borderRadius: 'var(--radius-pill)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.02em'
        }}
      >
        <CheckIcon size={10} />
        Allowed
      </span>
    )
  }
  if (status === 'blocked') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: RED_BG_DARK,
          border: `1px solid ${RED_BORDER_DARK}`,
          color: RED_BRIGHT,
          borderRadius: 'var(--radius-pill)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.02em'
        }}
      >
        <XIcon size={9} />
        Blocked
      </span>
    )
  }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid var(--ink-25)',
        color: 'var(--ink-60)',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.02em'
      }}
    >
      <span
        aria-hidden
        style={{
          width: 5,
          height: 5,
          borderRadius: 999,
          background: 'var(--ink-50)'
        }}
      />
      Indeterminate
    </span>
  )
}

function Pill({ tone, children }: { tone: 'ok' | 'bad' | 'neutral'; children: React.ReactNode }) {
  const styles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 12px',
    borderRadius: 'var(--radius-pill)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.04em'
  }
  if (tone === 'ok')
    return (
      <span style={{ ...styles, background: 'var(--positive-bg)', color: 'var(--positive)', border: '1px solid var(--positive-border)' }}>
        {children}
      </span>
    )
  if (tone === 'bad')
    return (
      <span style={{ ...styles, background: RED_BG_DARK, color: RED_BRIGHT, border: `1px solid ${RED_BORDER_DARK}` }}>
        {children}
      </span>
    )
  return (
    <span
      style={{
        ...styles,
        background: 'rgba(255,255,255,0.06)',
        color: 'var(--ink-60)',
        border: '1px solid var(--ink-25)'
      }}
    >
      {children}
    </span>
  )
}

/* Syntax-tint a robots.txt block. Returns React fragments so we can color
   per line without dangerouslySetInnerHTML. */
function tintRobots(src: string): React.ReactNode {
  const lines = src.split('\n')
  return lines.map((line, i) => {
    const trimmed = line.trim()
    let node: React.ReactNode = line
    if (trimmed.startsWith('#')) {
      node = (
        <span style={{ color: 'var(--ink-50)', fontStyle: 'italic' }}>{line}</span>
      )
    } else if (/^user-agent:/i.test(trimmed)) {
      const [head, rest] = splitAtColon(line)
      node = (
        <>
          <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{head}</span>
          <span style={{ color: 'var(--ink-80)' }}>{rest}</span>
        </>
      )
    } else if (/^allow:/i.test(trimmed)) {
      const [head, rest] = splitAtColon(line)
      node = (
        <>
          <span style={{ color: GREEN_BRIGHT, fontWeight: 600 }}>{head}</span>
          <span style={{ color: 'var(--ink-80)' }}>{rest}</span>
        </>
      )
    } else if (/^disallow:/i.test(trimmed)) {
      const [head, rest] = splitAtColon(line)
      node = (
        <>
          <span style={{ color: RED_BRIGHT, fontWeight: 600 }}>{head}</span>
          <span style={{ color: 'var(--ink-80)' }}>{rest}</span>
        </>
      )
    }
    return (
      <span key={i}>
        {node}
        {'\n'}
      </span>
    )
  })
}

function splitAtColon(line: string): [string, string] {
  const idx = line.indexOf(':')
  if (idx === -1) return [line, '']
  return [line.slice(0, idx + 1), line.slice(idx + 1)]
}

/* ── 03 — EDUCATIONAL ─────────────────────────────────────────────── */
function Educational() {
  const tiles = [
    {
      title: 'User-agent blocks',
      body:
        'Each block targets one crawler. "User-agent: *" applies to anything without a more specific block. Most AI bots will pick up their own named block if present.'
    },
    {
      title: 'Allow / Disallow rules',
      body:
        'Allow opens a path, Disallow closes one. Modern crawlers honor the longest, most specific matching rule — so order is less important than precision.'
    },
    {
      title: 'AI bots respect robots.txt (mostly)',
      body:
        'Major AI crawlers — GPTBot, ClaudeBot, PerplexityBot, Google-Extended — publicly commit to honoring robots.txt. A small minority ignore it; for those, network-level controls are the only reliable answer.'
    }
  ]
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        {/* Centered heading */}
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>The basics</Eyebrow>
          <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0', color: 'var(--ink)' }}>
            What is robots.txt for AI?
          </h2>
          <div style={{ display: 'grid', gap: 18, marginTop: 24 }}>
            <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.65, color: 'var(--ink-70)' }}>
              Robots.txt is a 30-year-old text file sitting at the root of your site. It was
              designed for search-engine spiders, but AI engines inherited the same protocol.
              Today it is the front door of your domain for every AI crawler that respects
              standards — which is most of them.
            </p>
            <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.65, color: 'var(--ink-70)' }}>
              A bot that is disallowed at the door cannot read your pages, which means it cannot
              quote, summarize, or recommend them in AI answers. A bot that is allowed gets to
              read — but reading is still only step one of being cited.
            </p>
            <p style={{ margin: 0, fontSize: '1rem', lineHeight: 1.65, color: 'var(--ink-70)' }}>
              The checker walks every line of your robots.txt against a list of 15 known AI
              agents and tells you, per bot, whether you currently let them in.
            </p>
          </div>
        </div>

        {/* Tiles */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" style={{ marginTop: 40 }}>
          {tiles.map((t) => (
            <div
              key={t.title}
              style={{
                padding: 24,
                background: 'var(--ink-surface)',
                border: '1px solid var(--ink-25)',
                borderRadius: 16,
                textAlign: 'center'
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--ink)'
                }}
              >
                {t.title}
              </h3>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: '0.84rem',
                  lineHeight: 1.55,
                  color: 'var(--ink-70)'
                }}
              >
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 04 — FINAL CTA ───────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 24,
            background: 'var(--ink-surface, var(--ink))',
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
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
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
                margin: '24px auto 0',
                maxWidth: 540
              }}
            >
              robots.txt is the front door. The full scan goes inside: which AI engines surface
              your brand, where competitors win, and the three highest-lift fixes to close the
              gap — free, no card.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                href="/free-ai-visibility-score"
                variant="primary"
                size="lg"
                trackLocation="tools_robots_checker_final_cta"
              >
                Get Free Score <ArrowRight />
              </Button>
              <Button
                variant="invert"
                size="lg"
                onClick={(e) => {
                  e.preventDefault()
                  openCalendly('tools_robots_checker_final_cta', undefined, 'Talk to an Expert')
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

/* ── COMPOSER ─────────────────────────────────────────────────────── */
export default function FeatureContent() {
  const [tab, setTab] = useState<Tab>('url')
  const [url, setUrl] = useState('')
  const [paste, setPaste] = useState('')
  const [stage, setStage] = useState<Stage>('idle')
  const [result, setResult] = useState<RobotsResult | null>(null)
  const [serverError, setServerError] = useState('')
  const gate = useToolLeadGate()

  // Real fetch + parse (runs after the lead gate is satisfied).
  const runScan = async () => {
    setStage('submitting')
    setResult(null)
    setServerError('')
    const payload = tab === 'url' ? { url: url.trim() } : { content: paste }
    try {
      const res = await fetch('/api/tools/robots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setStage('idle')
        if (data?.code === 'rate_limited') setServerError('Too many checks — give it a minute and try again.')
        else if (data?.code === 'timeout') setServerError('The site took too long to respond. Try again.')
        else if (data?.code === 'bad_domain' || data?.code === 'bad_url')
          setServerError('That doesn’t look like a reachable website URL.')
        else setServerError(data?.error || 'Could not fetch robots.txt. Check the URL and try again.')
        return
      }
      setResult(data as RobotsResult)
      setStage('result')
    } catch {
      setStage('idle')
      setServerError('Network error — please try again.')
    }
  }

  const handleReset = () => {
    setStage('idle')
    setResult(null)
    // Don't wipe the URL / paste — users often want to tweak and re-check.
  }

  return (
    <>
      <Hero
        tab={tab}
        setTab={setTab}
        url={url}
        setUrl={setUrl}
        paste={paste}
        setPaste={setPaste}
        stage={stage}
        serverError={serverError}
        onRun={() => gate.request(runScan)}
        onReset={handleReset}
        showReset={false}
      />
      <ResultModal open={stage === 'result'} onClose={handleReset} result={result} />
      <ToolLeadModal open={gate.open} tool="robots-checker" onClose={gate.close} onSuccess={gate.success} />
      <Educational />
      <FAQAccordion items={FAQS} />
      <FinalCTA />
    </>
  )
}

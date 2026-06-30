'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Button, Eyebrow, ArrowRight } from '@/components/ui'
import { FAQAccordion } from '@/components/FAQAccordion'
import { LIGHT } from '@/components/home/mocks/palette'
import { cb, useReducedMotion, useStagger, useTypewriter } from '@/components/home/mocks/motion'
import { openCalendly } from '@/lib/openCalendly'
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
const MONO_EYEBROW: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.72rem',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'var(--ink-60)'
}

/* ── Tiny inline icons ───────────────────────────────────────────── */
function ChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CopyIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="4.5" y="4.5" width="8.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M11.5 4.5V3.5A1 1 0 0 0 10.5 2.5H3.5A1 1 0 0 0 2.5 3.5V10.5A1 1 0 0 0 3.5 11.5H4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function DownloadIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2.5v8M4.5 7l3.5 3.5L11.5 7M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function RootIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7h6l2-2h10v13a1 1 0 0 1-1 1H3z" />
      <path d="M3 11h18" />
    </svg>
  )
}
function CrawlerIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="11" r="4" />
      <path d="M12 3v2M8 5l1.4 1.4M16 5l-1.4 1.4M5 12H3M21 12h-2M7 18l-2 2M17 18l2 2M9 21v-3M15 21v-3" />
    </svg>
  )
}
function RobotsIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="8" width="16" height="12" rx="2.5" />
      <path d="M12 5v3" />
      <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none" />
      <path d="M9 13h.01M15 13h.01" />
      <path d="M9 17h6" />
    </svg>
  )
}
function QuoteIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 7h4v4H7zM7 11s0 4 3 5" />
      <path d="M14 7h4v4h-4zM14 11s0 4 3 5" />
    </svg>
  )
}

/* ── Build a faux llms.txt from the form values ──────────────────── */
function buildLlmsTxt(brand: string, url: string, what: string, priority: string): string {
  const cleanBrand = brand.trim() || 'Acme'
  let cleanUrl = url.trim() || 'https://yourbrand.com'
  cleanUrl = cleanUrl.replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = 'https://' + cleanUrl
  const cleanWhat =
    (what.trim() ||
      'We build AI-native CRMs for B2B sales teams.').replace(/\n+/g, ' ')

  const userLines = priority
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 12)

  const fallbackPriority = [
    { path: '/pricing', label: 'Plans, billing, and what each tier unlocks' },
    { path: '/features', label: 'Product capabilities at a glance' },
    { path: '/docs', label: 'Setup, integrations, and reference material' }
  ]

  const priorityRows =
    userLines.length > 0
      ? userLines.map((path) => {
          const p = path.startsWith('/') ? path : '/' + path.replace(/^https?:\/\/[^/]+/, '')
          const last = p.split('/').filter(Boolean).pop() || 'home'
          const pretty = last.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())
          return `- [${pretty}](${cleanUrl}${p}): Primary entry point for ${pretty.toLowerCase()}.`
        })
      : fallbackPriority.map((r) => `- [${r.path.slice(1) || 'Home'}](${cleanUrl}${r.path}): ${r.label}.`)

  return [
    `# ${cleanBrand}`,
    '',
    `> ${cleanWhat}`,
    '',
    '## Priority pages',
    '',
    ...priorityRows,
    '',
    '## Documentation',
    '',
    `- [Getting started](${cleanUrl}/docs/getting-started): How to set up ${cleanBrand} in five minutes.`,
    `- [API reference](${cleanUrl}/docs/api): Endpoints, auth, and error codes.`,
    `- [Integrations](${cleanUrl}/docs/integrations): Supported tools and how to connect them.`,
    '',
    '## Pricing',
    '',
    `- [Plans](${cleanUrl}/pricing): Free, growth, and enterprise tiers.`,
    `- [Billing FAQ](${cleanUrl}/pricing#faq): Trials, taxes, and seat changes.`,
    '',
    '## Changelog',
    '',
    `- [Release notes](${cleanUrl}/changelog): What shipped, when, and why.`,
    '',
    '## Optional',
    '',
    `- [About ${cleanBrand}](${cleanUrl}/about): Team, mission, and customers.`,
    `- [Contact](${cleanUrl}/contact): How to reach support and sales.`,
    ''
  ].join('\n')
}

/* ── HERO + FORM ─────────────────────────────────────────────────── */
type FormValues = { brand: string; url: string; what: string; priority: string }
const EMPTY: FormValues = { brand: '', url: '', what: '', priority: '' }

function Hero({
  values,
  setValues,
  onSubmit,
  error,
  submitting
}: {
  values: FormValues
  setValues: (next: FormValues) => void
  onSubmit: () => void
  error: string | null
  submitting: boolean
}) {
  const set = (k: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues({ ...values, [k]: e.target.value })

  const inputStyle: CSSProperties = {
    width: '100%',
    height: 52,
    padding: '0 18px',
    background: 'var(--ink-surface)',
    color: 'var(--ink)',
    border: '1px solid var(--ink-25)',
    borderRadius: 14,
    fontFamily: 'var(--font-display)',
    fontSize: '0.98rem',
    outline: 'none',
    transition: `border-color .18s ${cb}, box-shadow .18s ${cb}`
  }
  const textareaStyle: CSSProperties = {
    width: '100%',
    minHeight: 86,
    padding: '14px 18px',
    background: 'var(--ink-surface)',
    color: 'var(--ink)',
    border: '1px solid var(--ink-25)',
    borderRadius: 14,
    fontFamily: 'var(--font-display)',
    fontSize: '0.98rem',
    lineHeight: 1.5,
    resize: 'vertical',
    outline: 'none',
    transition: `border-color .18s ${cb}, box-shadow .18s ${cb}`
  }
  const labelStyle: CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.13em',
    color: 'var(--ink-60)',
    marginBottom: 8
  }
  const hintStyle: CSSProperties = {
    margin: '8px 0 0',
    fontSize: '0.78rem',
    color: 'var(--ink-50)'
  }

  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Subtle corner vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          background: [
            'radial-gradient(circle at 0% 0%, rgba(255,255,255,0.05), transparent 42%)',
            'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.05), transparent 42%)',
            'radial-gradient(circle at 50% 100%, rgba(255,255,255,0.04), transparent 50%)'
          ].join(', ')
        }}
      />
      {/* Faint grid overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          pointerEvents: 'none',
          opacity: 0.35,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at top, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top, black 30%, transparent 70%)'
        }}
      />
      <div style={{ ...CONTAINER, padding: '4.5rem 2rem 4rem' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>FREE TOOL</Eyebrow>
          <h1
            style={{
              ...DISPLAY_LG,
              fontSize: 'clamp(2.25rem, 4vw + 0.3rem, 3.4rem)',
              margin: '20px 0 0',
              color: 'var(--ink)'
            }}
          >
            llms.txt Generator
          </h1>
          <p style={{ ...LEAD, margin: '20px auto 0', maxWidth: 600 }}>
            Generate the llms.txt file AI crawlers expect — so ChatGPT, Perplexity, Claude, and
            Google AI Overviews can read what you want them to read.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (submitting) return
            onSubmit()
          }}
          style={{
            maxWidth: 640,
            margin: '36px auto 0',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <div>
            <label htmlFor="lt-url" style={labelStyle}>
              Website URL
            </label>
            <input
              id="lt-url"
              type="text"
              autoComplete="url"
              spellCheck={false}
              placeholder="https://yourbrand.com"
              value={values.url}
              onChange={set('url')}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--ink)'
                e.currentTarget.style.boxShadow = '0 0 0 4px var(--focus-ring)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--ink-25)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="lt-brand" style={labelStyle}>
              Brand name
            </label>
            <input
              id="lt-brand"
              type="text"
              spellCheck={false}
              placeholder="e.g. Acme"
              value={values.brand}
              onChange={set('brand')}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--ink)'
                e.currentTarget.style.boxShadow = '0 0 0 4px var(--focus-ring)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--ink-25)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="lt-what" style={labelStyle}>
              What you do
            </label>
            <textarea
              id="lt-what"
              placeholder="We build AI-native CRMs for B2B sales teams."
              value={values.what}
              onChange={set('what')}
              style={textareaStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--ink)'
                e.currentTarget.style.boxShadow = '0 0 0 4px var(--focus-ring)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--ink-25)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <div>
            <label htmlFor="lt-priority" style={labelStyle}>
              Key pages to prioritize <span style={{ color: 'var(--ink-40)', textTransform: 'none', letterSpacing: 0 }}>· optional</span>
            </label>
            <textarea
              id="lt-priority"
              placeholder="One URL per line — /pricing, /features, /docs"
              value={values.priority}
              onChange={set('priority')}
              style={{ ...textareaStyle, minHeight: 96 }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--ink)'
                e.currentTarget.style.boxShadow = '0 0 0 4px var(--focus-ring)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--ink-25)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <p style={hintStyle}>We don’t fetch your site. This is a local preview from the values you enter.</p>
          </div>

          {error && (
            <div style={{ fontSize: '0.85rem', color: '#e5484d', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: 4 }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              trackEvent="cta_click"
              trackLocation="tools_llms_txt_generator_hero"
              className="w-full sm:w-auto"
            >
              {submitting ? 'Generating…' : 'Generate llms.txt'} <ArrowRight />
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

/* ── RESULT CARD ─────────────────────────────────────────────────── */
function ResultCard({
  text,
  brandLabel,
  onReset,
  revealed
}: {
  text: string
  brandLabel: string
  onReset: () => void
  revealed: boolean
}) {
  const reduced = useReducedMotion()

  // Typewriter reveal of the whole block (~600ms for a couple hundred chars).
  const cps = Math.max(180, Math.round(text.length / 0.6))
  const typed = useTypewriter(text, revealed && !reduced, cps)
  const display = reduced || !revealed ? text : typed.text

  const stagger = useStagger(4, revealed, 80, 80)

  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])

  const onCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else if (typeof document !== 'undefined') {
        const ta = document.createElement('textarea')
        ta.value = text
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const onDownload = () => {
    if (typeof window === 'undefined') return
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const u = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = u
    a.download = 'llms.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(u)
  }

  // The LIGHT spread retargets all `var(--*)` lookups inside this subtree
  // back to light values, so the card paints as a white product UI on the
  // dark page.
  const root: CSSProperties = {
    ...LIGHT,
    containerType: 'size',
    background: 'var(--white)',
    color: 'var(--ink)',
    border: '1px solid var(--line)',
    borderRadius: 22,
    padding: 'clamp(20px, 3cqw, 32px)',
    boxShadow: '0 24px 60px rgba(0,0,0,0.32)',
    maxWidth: 960,
    margin: '12px auto 0',
    opacity: revealed ? 1 : 0,
    transform: revealed ? 'translateY(0)' : 'translateY(12px)',
    transition: `opacity .48s ${cb}, transform .48s ${cb}`
  }

  const head: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    paddingBottom: 16,
    borderBottom: '1px solid var(--line)'
  }

  const pill: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 999,
    background: 'var(--positive-bg)',
    color: 'var(--positive)',
    border: '1px solid var(--positive-border)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontWeight: 600
  }

  const codeBlock: CSSProperties = {
    margin: '16px 0 0',
    background: '#0f0f14',
    color: '#f4f4f6',
    borderRadius: 14,
    padding: '20px 22px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.82rem',
    lineHeight: 1.6,
    overflowX: 'auto',
    border: '1px solid #1a1a22',
    minHeight: 360,
    position: 'relative'
  }

  const codeButtonRow: CSSProperties = {
    position: 'absolute',
    top: 12,
    right: 12,
    display: 'flex',
    gap: 8,
    zIndex: 2
  }

  const iconBtn: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 30,
    padding: '0 10px',
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.9)',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 8,
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: `background .18s ${cb}, border-color .18s ${cb}`
  }

  // Color-tone the rendered lines lightly: headings, blockquote, links.
  const formatted = display.split('\n').map((line, i) => {
    let color: string | undefined
    if (line.startsWith('# ')) color = '#ffd28a'
    else if (line.startsWith('## ')) color = '#9ae6b4'
    else if (line.startsWith('> ')) color = '#a3b5d1'
    else if (line.startsWith('- ')) color = '#f4f4f6'
    return (
      <span key={i} style={{ display: 'block', color, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {line || ' '}
      </span>
    )
  })

  return (
    <section style={{ padding: '0 0 1rem' }}>
      <div style={CONTAINER}>
        <div style={root} role="region" aria-label="Generated llms.txt preview">
          {/* Header row */}
          <div
            style={{
              ...head,
              opacity: stagger[0] ? 1 : 0,
              transform: stagger[0] ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity .4s ${cb}, transform .4s ${cb}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
              <span style={pill}>
                <CheckIcon size={12} /> Generated
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  color: 'var(--ink-60)',
                  letterSpacing: '0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {brandLabel} · llms.txt · {text.length} chars
              </span>
            </div>
            <button
              onClick={onReset}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--ink-70)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
                textDecorationColor: 'var(--ink-25)',
                textUnderlineOffset: 4
              }}
            >
              Reset
            </button>
          </div>

          {/* Code preview */}
          <div
            style={{
              ...codeBlock,
              opacity: stagger[1] ? 1 : 0,
              transform: stagger[1] ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity .42s ${cb}, transform .42s ${cb}`
            }}
          >
            <div style={codeButtonRow}>
              <button
                onClick={onCopy}
                aria-label="Copy to clipboard"
                style={{
                  ...iconBtn,
                  background: copied ? 'rgba(154,230,180,0.16)' : iconBtn.background,
                  color: copied ? '#9ae6b4' : iconBtn.color,
                  borderColor: copied ? 'rgba(154,230,180,0.36)' : iconBtn.borderColor as string
                }}
              >
                {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                color: 'inherit',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {formatted}
              {!typed.done && !reduced && revealed && (
                <span
                  aria-hidden
                  style={{
                    display: 'inline-block',
                    width: '0.55ch',
                    height: '1em',
                    verticalAlign: '-0.15em',
                    background: '#f4f4f6',
                    animation: 'clv-blink 0.9s steps(1) infinite',
                    marginLeft: 1
                  }}
                />
              )}
            </pre>
          </div>

          {/* Footer row */}
          <div
            style={{
              marginTop: 18,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              opacity: stagger[2] ? 1 : 0,
              transform: stagger[2] ? 'translateY(0)' : 'translateY(6px)',
              transition: `opacity .42s ${cb}, transform .42s ${cb}`
            }}
          >
            <button
              onClick={onDownload}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                height: 40,
                padding: '0 16px',
                background: 'var(--ink)',
                color: 'var(--white)',
                border: 'none',
                borderRadius: 999,
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: `transform .18s ${cb}, opacity .18s ${cb}`
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              <DownloadIcon size={13} /> Download .txt
            </button>
            <span style={{ fontSize: '0.82rem', color: 'var(--ink-60)' }}>
              Place this at <code style={{ fontFamily: 'var(--font-mono)', background: 'var(--subtle)', padding: '2px 6px', borderRadius: 5, color: 'var(--ink-80)' }}>/llms.txt</code> at your site root.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── EDUCATIONAL: What is llms.txt? ──────────────────────────────── */
function WhatIsLlmsTxt() {
  const tiles = [
    {
      icon: <RootIcon />,
      title: 'Sits at /llms.txt',
      body: 'Lives at your site root, the way robots.txt does.'
    },
    {
      icon: <CrawlerIcon />,
      title: 'AI crawlers read it',
      body: 'GPTBot, ClaudeBot, PerplexityBot, and others look for it.'
    },
    {
      icon: <RobotsIcon />,
      title: 'Like robots.txt for LLMs',
      body: 'Guides, not gates. It points to what matters most.'
    },
    {
      icon: <QuoteIcon />,
      title: 'Improves citation accuracy',
      body: 'A clean map helps AI quote the right pages, not the wrong ones.'
    }
  ]

  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <span style={MONO_EYEBROW}>What is llms.txt?</span>
          <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0', color: 'var(--ink)' }}>
            A small file with an outsized job.
          </h2>
          <p style={{ ...LEAD, margin: '24px 0 0' }}>
            llms.txt is a plain-text file you publish at your site root. It tells AI systems which
            pages on your domain matter most, in what order, and what each one is about. The format
            is markdown-flavored so any model can parse it the same way a person would.
          </p>
          <p style={{ ...LEAD, margin: '18px 0 0' }}>
            It does not replace robots.txt, sitemaps, or strong content. It complements them. Where
            robots.txt sets access permissions and sitemaps list URLs, llms.txt explains intent —
            here is what we want AI to know about us, and here is where to find it.
          </p>
          <p style={{ ...LEAD, margin: '18px 0 0' }}>
            Support is still emerging, so think of llms.txt as low-cost, forward-looking signal
            hygiene. The file is short, hand-curated, and easy to keep current as your site grows.
          </p>
        </div>

        <div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4"
          style={{ marginTop: 48 }}
        >
          {tiles.map((t) => (
            <div
              key={t.title}
              style={{
                padding: 22,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 18,
                transition: `transform .25s ${cb}, border-color .25s ${cb}, background .25s ${cb}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.045)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 44,
                  width: 44,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: 'var(--ink)'
                }}
              >
                {t.icon}
              </span>
              <h3
                style={{
                  margin: '16px 0 0',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--ink)'
                }}
              >
                {t.title}
              </h3>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: '0.92rem',
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

/* ── FINAL CTA ───────────────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: '0 0 var(--section)' }}>
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
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
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
              llms.txt helps AI find your pages. The full score tells you what AI actually says when
              buyers ask about your category — mentions, sentiment, citations, and share of voice.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button
                href="/free-ai-visibility-score"
                variant="primary"
                size="lg"
                trackLocation="tools_llms_txt_generator_final_cta"
              >
                Get Free Score <ArrowRight />
              </Button>
              <Button
                variant="invert"
                size="lg"
                trackEvent="book_demo"
                trackLocation="tools_llms_txt_generator_final_cta"
                onClick={(e) => {
                  e.preventDefault()
                  openCalendly('tools_llms_txt_generator_final_cta')
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

/* ── COMPOSER ────────────────────────────────────────────────────── */
export default function FeatureContent() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [stage, setStage] = useState<'idle' | 'submitting' | 'result'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [output, setOutput] = useState<string>('')
  const [submittedBrand, setSubmittedBrand] = useState<string>('')

  const resultRef = useRef<HTMLDivElement | null>(null)

  const onSubmit = () => {
    setError(null)
    const url = values.url.trim()
    const brand = values.brand.trim()
    const what = values.what.trim()
    if (!url) {
      setError('Add your website URL to get started.')
      return
    }
    if (!brand) {
      setError('Add your brand name so we can write the header.')
      return
    }
    if (!what) {
      setError('Describe what you do in one short sentence.')
      return
    }
    setStage('submitting')
    // 400ms feel-good delay before the result reveals.
    window.setTimeout(() => {
      const text = buildLlmsTxt(brand, url, what, values.priority)
      setOutput(text)
      setSubmittedBrand(brand)
      setStage('result')
    }, 400)
  }

  // Auto-scroll into the result on first reveal.
  useEffect(() => {
    if (stage === 'result' && resultRef.current) {
      const el = resultRef.current
      const id = window.setTimeout(() => {
        const top = el.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top, behavior: 'smooth' })
      }, 120)
      return () => window.clearTimeout(id)
    }
  }, [stage])

  const onReset = () => {
    setStage('idle')
    setOutput('')
    setError(null)
  }

  const showResult = stage === 'result' && output.length > 0

  return (
    <>
      <Hero
        values={values}
        setValues={setValues}
        onSubmit={onSubmit}
        error={error}
        submitting={stage === 'submitting'}
      />
      <div ref={resultRef}>
        {showResult && (
          <ResultCard
            text={output}
            brandLabel={submittedBrand}
            onReset={onReset}
            revealed={showResult}
          />
        )}
      </div>
      <WhatIsLlmsTxt />
      <FAQAccordion items={FAQS} />
      <FinalCTA />
    </>
  )
}

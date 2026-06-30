'use client'

// Shared lead-capture modal for the free tools (robots checker, AI crawlability
// checker, fanout query, llms.txt generator). NOT used by the free-score page —
// that has its own larger EmailGate flow.
//
// Collects just { name, email } + a Cloudflare Turnstile token, POSTs to
// /api/tool-lead (which verifies the challenge and forwards to the same Make
// webhook the free-score uses, with a per-tool event), then calls onSuccess()
// so the parent can run the tool. Clovion dark-brand styling.

import { useEffect, useRef, useState } from 'react'
import TurnstileWidget from '@/components/free-score/TurnstileWidget'
import { analytics } from '@/lib/analytics'

const CLOVION_LOGO =
  'https://res.cloudinary.com/doajh6jwk/image/upload/v1782804104/Clovion-Logo-white_xoqx8t.png'

// Inline literal — never put var(--*) inside a transition shorthand.
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Per-tool copy. `tool` matches the slug sent to /api/tool-lead.
const TOOL_COPY: Record<string, { title: string; cta: string }> = {
  'robots-checker': { title: 'See your robots.txt audit', cta: 'Check' },
  'ai-crawlability-checker': { title: 'See your crawlability report', cta: 'Check' },
  fanout: { title: 'See your query fan-out', cta: 'Expand' },
  'llms-txt-generator': { title: 'Generate your llms.txt', cta: 'Generate' }
}

export default function ToolLeadModal({
  open,
  tool,
  onClose,
  onSuccess
}: {
  open: boolean
  tool: string
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [shown, setShown] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  const copy = TOOL_COPY[tool] ?? { title: 'See your results', cta: 'Continue' }
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  // Entrance transition + scroll lock + Esc + autofocus while open.
  useEffect(() => {
    if (!open) {
      setShown(false)
      return
    }
    const raf = requestAnimationFrame(() => setShown(true))
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status !== 'submitting') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = window.setTimeout(() => nameRef.current?.focus(), 40)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      window.clearTimeout(t)
    }
  }, [open, onClose, status])

  // Reset transient state each time the modal closes.
  useEffect(() => {
    if (!open) {
      setName('')
      setEmail('')
      setToken('')
      setStatus('idle')
      setErrorMsg('')
    }
  }, [open])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'submitting') return
    if (!name.trim()) {
      setErrorMsg('Enter your name.')
      nameRef.current?.focus()
      return
    }
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg('Enter a valid email.')
      return
    }
    // When Turnstile is configured, require a verified token before submit.
    if (siteKey && !token) {
      setErrorMsg('Please complete the human check.')
      return
    }
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/tool-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), tool, turnstileToken: token })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Something went wrong. Please try again.')
      }
      analytics.formSubmit('tool_lead', tool)
      onSuccess()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (!open) return null
  const submitting = status === 'submitting'

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: 50,
    padding: '0 16px',
    background: 'var(--ink-surface)',
    color: 'var(--ink)',
    border: '1px solid var(--ink-25)',
    borderRadius: 12,
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    outline: 'none',
    transition: `border-color 180ms ${EASE}`
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-lead-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(8,8,11,0.6)',
        backdropFilter: 'blur(4px)',
        opacity: shown ? 1 : 0,
        transition: `opacity 220ms ${EASE}`
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 460,
          background: 'var(--white)',
          color: 'var(--ink)',
          border: '1px solid var(--line)',
          borderRadius: 22,
          padding: 'clamp(24px, 5vw, 34px)',
          boxShadow: '0 40px 120px -24px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
          textAlign: 'left',
          opacity: shown ? 1 : 0,
          transform: shown ? 'translateY(0)' : 'translateY(12px)',
          transition: `opacity 320ms ${EASE}, transform 320ms ${EASE}`
        }}
      >
        {/* Brand bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 20
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CLOVION_LOGO} alt="Clovion AI" style={{ height: 24, width: 'auto', display: 'block' }} />
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 34,
              height: 34,
              borderRadius: 999,
              border: '1px solid var(--line)',
              background: 'var(--ink-surface)',
              color: 'var(--ink-60)',
              cursor: submitting ? 'not-allowed' : 'pointer',
              flexShrink: 0
            }}
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <h2
          id="tool-lead-title"
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--ink)'
          }}
        >
          {copy.title}
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--ink-60)' }}>
          Enter your name and email to continue. Takes a few seconds.
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 22 }}>
          <label style={{ display: 'block' }}>
            <span style={labelStyle}>Name</span>
            <input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errorMsg) setErrorMsg('')
              }}
              placeholder="Ada Lovelace"
              autoComplete="name"
              disabled={submitting}
              className="clv-form-field"
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'block', marginTop: 14 }}>
            <span style={labelStyle}>Work email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errorMsg) setErrorMsg('')
              }}
              placeholder="ada@company.com"
              autoComplete="email"
              disabled={submitting}
              className="clv-form-field"
              style={inputStyle}
            />
          </label>

          {/* Cloudflare Turnstile — only when configured, so no dev placeholder shows. */}
          {siteKey && (
            <div style={{ marginTop: 16 }}>
              <TurnstileWidget onVerify={(t) => setToken(t)} onExpire={() => setToken('')} />
            </div>
          )}

          {errorMsg && (
            <p role="alert" style={{ marginTop: 12, fontSize: '0.84rem', color: '#f87171' }}>
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            style={{
              marginTop: 20,
              width: '100%',
              height: 52,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 999,
              border: '1px solid var(--ink-25)',
              background: 'var(--bg)',
              color: 'var(--ink)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              transition: `opacity 160ms ${EASE}`
            }}
          >
            {submitting ? 'Submitting…' : copy.cta}
          </button>
        </form>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 7,
  fontFamily: 'var(--font-mono)',
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--ink-50)'
}

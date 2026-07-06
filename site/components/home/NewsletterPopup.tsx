'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { analytics } from '@/lib/analytics'
import { HaloMark } from '@/components/ui'

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const STORAGE_KEY = 'clv_newsletter_dismissed'
const DELAY_MS = 3200

const REASSURANCE = ['No spam', 'No fluff', 'Just practical insights']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewsletterPopup({ previewOpen = false }: { previewOpen?: boolean }) {
  const [mounted, setMounted] = useState(previewOpen)
  const [shown, setShown] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'error' | 'submitting' | 'done'>('idle')
  const [errorMsg, setErrorMsg] = useState('Please enter a valid email address.')

  const cardRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    if (previewOpen) return
    let dismissed = false
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === '1'
    } catch {}
    if (dismissed) return
    const t = setTimeout(() => setMounted(true), DELAY_MS)
    return () => clearTimeout(t)
  }, [previewOpen])

  useEffect(() => {
    if (!mounted) return
    const r = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(r)
  }, [mounted])

  const persistDismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {}
  }, [])

  const close = useCallback(() => {
    persistDismiss()
    setShown(false)
    window.setTimeout(() => setMounted(false), reduced ? 0 : 300)
  }, [persistDismiss, reduced])

  useEffect(() => {
    if (!mounted) return
    lastFocused.current = (document.activeElement as HTMLElement) ?? null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 300)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key === 'Tab' && cardRef.current) {
        const nodes = cardRef.current.querySelectorAll<HTMLElement>('button, [href], input, [tabindex]:not([tabindex="-1"])')
        const list = Array.from(nodes).filter((n) => !n.hasAttribute('disabled'))
        if (list.length === 0) return
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(focusTimer)
      lastFocused.current?.focus?.()
    }
  }, [mounted, reduced, close])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'submitting' || status === 'done') return
    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setErrorMsg('Please enter a valid email address.')
      setStatus('error')
      inputRef.current?.focus()
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value })
      })
      if (!res.ok) throw new Error('subscribe failed')
      analytics.formSubmit('newsletter', 'home_newsletter_popup')
      persistDismiss()
      setStatus('done')
      window.setTimeout(() => close(), 2600)
    } catch {
      setErrorMsg('Something went wrong. Please try again.')
      setStatus('error')
      inputRef.current?.focus()
    }
  }

  if (!mounted) return null

  return (
    <div
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        background: 'rgba(10,10,15,0.45)',
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)',
        opacity: shown ? 1 : 0,
        transition: reduced ? 'none' : `opacity 0.28s ${EASE}`
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="clv-nl-title"
        aria-describedby="clv-nl-desc"
        className="clv-nl-card"
        style={{
          position: 'relative',
          width: 'min(720px, calc(100vw - 40px))',
          minWidth: 0,
          background: 'var(--white)',
          borderRadius: 22,
          border: '1px solid var(--line)',
          boxShadow: '0 34px 90px rgba(10,10,15,0.32)',
          overflow: 'hidden',
          opacity: shown ? 1 : 0,
          transform: shown ? 'none' : 'translateY(14px) scale(0.975)',
          transition: reduced ? 'none' : `opacity 0.35s ${EASE}, transform 0.4s ${EASE}`
        }}
      >
        {/* close */}
        <button type="button" aria-label="Close" onClick={close} className="clv-nl-x">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* ── LEFT: a realistic preview of the actual weekly email ── */}
        <aside className="clv-nl-aside" aria-hidden>
          <div className="clv-nl-mail">
            {/* mail header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-flex', color: 'var(--ink)' }}>
                <HaloMark size={16} />
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink)' }}>Clovion Weekly</span>
              <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--positive)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-50)' }}>New</span>
              </span>
            </div>

            <div style={{ height: 1, background: 'var(--line)', margin: '14px 0' }} />

            {/* hero metric + chart */}
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.54rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>AI answers citing sources</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 9, marginTop: 7 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>38%</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: 'var(--positive)' }}>
                <svg width="11" height="11" viewBox="0 0 13 13" fill="none" stroke="var(--positive)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 10 L10 3" />
                  <path d="M5 3 H10 V8" />
                </svg>
                <b style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontVariantNumeric: 'tabular-nums' }}>+6%</b>
              </span>
            </div>

            <div style={{ flex: 1, minHeight: 58, marginTop: 12, display: 'flex' }}>
              <svg viewBox="0 0 260 74" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }} aria-hidden>
                <defs>
                  <linearGradient id="clvNlSpark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(4,120,87,0.18)" />
                    <stop offset="100%" stopColor="rgba(4,120,87,0)" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="24" x2="260" y2="24" stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <line x1="0" y1="49" x2="260" y2="49" stroke="var(--line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <path d="M4 62 C 52 60, 92 52, 138 40 S 224 12, 256 7 L 256 74 L 4 74 Z" fill="url(#clvNlSpark)" />
                <path d="M4 62 C 52 60, 92 52, 138 40 S 224 12, 256 7" fill="none" stroke="var(--positive)" strokeWidth="2.2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                <circle cx="256" cy="7" r="3.4" fill="var(--positive)" />
              </svg>
            </div>

            <div style={{ height: 1, background: 'var(--line)', margin: '16px 0 13px' }} />

            {/* insight lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.74rem', color: 'var(--ink-80)' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--positive)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
                  <path d="M4 12l5 5L20 6" />
                </svg>
                Reddit &amp; G2 gaining citation share
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.74rem', color: 'var(--ink-80)' }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="var(--positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
                  <path d="M3 10 L10 3" />
                  <path d="M5 3 H10 V8" />
                </svg>
                ChatGPT citing more sources per answer
              </span>
            </div>
          </div>

          <span style={{ fontSize: '0.7rem', lineHeight: 1.5, color: 'var(--ink-50)', textAlign: 'center' }}>
            The state of AI search, distilled — every Monday.
          </span>
        </aside>

        {/* ── RIGHT: copy + form ── */}
        <div className="clv-nl-main">
          <span className="clv-nl-mobile-icon" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--positive)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="M3.6 7.2 12 13l8.4-5.8" />
            </svg>
          </span>

          <h2
            id="clv-nl-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.35rem, 3.6vw, 1.55rem)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: 'var(--ink)',
              margin: 0
            }}
          >
            Weekly AI Visibility Insights
          </h2>

          <p id="clv-nl-desc" style={{ fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--ink-70)', margin: '10px 0 0' }}>
            Get one useful email each week on what&rsquo;s working, what&rsquo;s not, and how brands are showing up in AI search.
          </p>

          <ul style={{ listStyle: 'none', margin: '18px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {REASSURANCE.map((r) => (
              <li key={r} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--ink-70)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--positive)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
                  <path d="M4 12l5 5L20 6" />
                </svg>
                {r}
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 22 }}>
            {status === 'done' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0' }}>
                <span aria-hidden style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 999, background: 'var(--positive-bg)', border: '1px solid var(--positive-border)', flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--positive)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M4 12l5 5L20 6" />
                  </svg>
                </span>
                <p role="status" style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                  You&rsquo;re in — check your inbox.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <input
                  ref={inputRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-label="Email address"
                  aria-invalid={status === 'error'}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  className="clv-nl-input"
                  style={{
                    width: '100%',
                    height: 48,
                    padding: '0 15px',
                    fontSize: '0.95rem',
                    color: 'var(--ink)',
                    background: 'var(--white)',
                    border: `1px solid ${status === 'error' ? 'var(--ink)' : 'var(--line)'}`,
                    borderRadius: 11,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button type="submit" className="clv-nl-submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
                </button>
                <p aria-live="polite" style={{ minHeight: '1rem', margin: '8px 0 0', fontSize: '0.78rem', color: 'var(--ink-70)', visibility: status === 'error' ? 'visible' : 'hidden' }}>
                  {errorMsg}
                </p>
              </form>
            )}
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--ink-40)', margin: status === 'done' ? '10px 0 0' : '2px 0 0' }}>
            You can unsubscribe anytime.
          </p>
        </div>

        <style>{`
          .clv-nl-card { display: grid; grid-template-columns: 1fr; }
          .clv-nl-aside { display: none; min-width: 0; }
          .clv-nl-mail {
            flex: 1; display: flex; flex-direction: column;
            background: var(--white); border: 1px solid var(--line);
            border-radius: 14px; box-shadow: 0 16px 38px rgba(10,10,15,0.12);
            padding: 18px;
          }
          .clv-nl-main { padding: clamp(28px, 4vw, 40px); min-width: 0; }
          .clv-nl-mobile-icon {
            display: inline-flex; align-items: center; justify-content: center;
            width: 48px; height: 48px; border-radius: 14px; margin-bottom: 16px;
            background: var(--positive-bg); border: 1px solid var(--positive-border);
          }
          .clv-nl-x {
            position: absolute; top: 12px; right: 12px; z-index: 2;
            display: inline-flex; align-items: center; justify-content: center;
            width: 34px; height: 34px; border-radius: 999px; border: none;
            background: transparent; color: var(--ink-40); cursor: pointer;
            transition: color 0.2s ${EASE}, background 0.2s ${EASE};
          }
          .clv-nl-x:hover { color: var(--ink); background: var(--subtle); }
          .clv-nl-input::placeholder { color: var(--ink-40); }
          .clv-nl-input:focus { border-color: var(--positive); box-shadow: 0 0 0 3px rgba(4,120,87,0.16); }
          .clv-nl-submit {
            width: 100%; height: 48px; margin-top: 10px;
            font-family: var(--font-display); font-size: 0.95rem; font-weight: 600;
            color: var(--white); background: var(--ink); border: none; border-radius: 11px; cursor: pointer;
            transition: background 0.2s ${EASE};
          }
          .clv-nl-submit:hover { background: #000; }
          .clv-nl-submit:disabled { opacity: 0.6; cursor: default; }
          @media (min-width: 640px) {
            .clv-nl-card { grid-template-columns: 0.82fr 1fr; }
            .clv-nl-aside {
              display: flex; flex-direction: column; gap: 16px;
              padding: 28px; border-right: 1px solid var(--line);
              background: linear-gradient(158deg, var(--subtle) 0%, #e8eaeb 100%);
            }
            .clv-nl-mobile-icon { display: none; }
          }
        `}</style>
      </div>
    </div>
  )
}

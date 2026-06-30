'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { countries } from '@/lib/countries'
import { analytics, track } from '@/lib/analytics'

// LeadCaptureModal — controlled-mode lead-capture dialog.
//
// This component is NO LONGER a global click interceptor. It does not install
// any document-level listeners. The parent fully owns visibility via the
// `open` prop, and reacts to the form lifecycle via `onClose` / `onSuccess`.
//
// API:
//   <LeadCaptureModal
//     open={boolean}                // parent decides when the dialog is visible
//     onClose={() => void}          // fired on X-click, Esc, or backdrop click
//     onSuccess={() => void}        // fired immediately after a successful
//                                   // POST /api/lead (2xx). Parent owns what
//                                   // happens next (close + reveal scan UI).
//   />
//
// Submit flow:
//   1. POST { first_name, last_name, email, country } → /api/lead
//   2. On 2xx: persist `clv_lead_captured=1` in localStorage, fire
//      `generate_lead` GA4 event via analytics.formSubmit(...), call onSuccess().
//   3. On non-2xx / network error: surface the error inline; the dialog stays
//      open so the user can retry.
//
// The component does NOT navigate after success (the user is already on
// /free-ai-visibility-score). Routing belongs to the parent.

type FormState = {
  first_name: string
  last_name: string
  email: string
  country: string
}

const EMPTY: FormState = { first_name: '', last_name: '', email: '', country: '' }

// Inline literal — never put var(--*) inside a transition shorthand.
const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'

export function LeadCaptureModal({
  open,
  onClose,
  onSuccess
}: {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const firstFieldRef = useRef<HTMLInputElement>(null)

  // Fire `lead_form_open` once each time the parent flips `open` false → true.
  // Preserves the telemetry the old global interceptor used to emit (it called
  // analytics.getFreeScore('lead_form_open') at the moment it intercepted the
  // click). Tracked here so the event still surfaces in GA4 without any global
  // listener.
  useEffect(() => {
    if (!open) return
    track({ event: 'lead_form_open' })
  }, [open])

  const close = useCallback(() => {
    // Don't let the user dismiss mid-submit — we have a request in flight.
    if (status === 'submitting') return
    onClose()
  }, [status, onClose])

  // Esc to close + body scroll lock while open + autofocus first field.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => firstFieldRef.current?.focus(), 30)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      clearTimeout(t)
    }
  }, [open, close])

  // Reset transient state whenever the dialog closes so the next open is clean.
  useEffect(() => {
    if (!open) {
      setStatus('idle')
      setErrorMsg('')
      setForm(EMPTY)
    }
  }, [open])

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Something went wrong. Please try again.')
      }
      // Persist the captured flag so the parent (and any future visit) can
      // skip the gate entirely.
      try {
        localStorage.setItem('clv_lead_captured', '1')
      } catch {
        // localStorage can throw in some privacy modes — ignore, the parent
        // can still proceed with the in-memory success signal.
      }
      // Fire GA4 lead-generation event before handing control back to parent.
      analytics.formSubmit('lead_capture', 'free_score_page')
      // Hand off to parent. Parent decides whether to close, reveal scan UI,
      // celebrate, etc. — this component does not navigate.
      onSuccess()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (!open) return null

  const submitting = status === 'submitting'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-form-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
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
        transition: `opacity 240ms ${EASE_OUT_EXPO}`
      }}
    >
      <div
        // Self-contained light card — fixed colors so it reads the same on
        // both light and dark routes. Saans (--font-saans) is inherited.
        className="w-full max-w-[440px] rounded-2xl bg-white text-neutral-900 shadow-2xl"
        style={{ border: '1px solid #eceae5' }}
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 id="lead-form-title" className="text-xl font-semibold tracking-tight text-neutral-900">
              Get your free AI visibility score
            </h2>
            <p className="mt-1.5 text-sm text-neutral-500">
              Tell us where to send it. Takes a few seconds.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="ml-3 -mr-1 -mt-1 rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            style={{ transition: `background-color 160ms ${EASE_OUT_EXPO}, color 160ms ${EASE_OUT_EXPO}` }}
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 pb-6 pt-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <input
                ref={firstFieldRef}
                type="text"
                required
                autoComplete="given-name"
                value={form.first_name}
                onChange={update('first_name')}
                className={inputCls}
                placeholder="Ada"
              />
            </Field>
            <Field label="Last name">
              <input
                type="text"
                required
                autoComplete="family-name"
                value={form.last_name}
                onChange={update('last_name')}
                className={inputCls}
                placeholder="Lovelace"
              />
            </Field>
          </div>

          <div className="mt-3">
            <Field label="Work email">
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={update('email')}
                className={inputCls}
                placeholder="ada@company.com"
              />
            </Field>
          </div>

          <div className="mt-3">
            <Field label="Country">
              <select required value={form.country} onChange={update('country')} className={inputCls}>
                <option value="" disabled>
                  Select your country
                </option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {status === 'error' && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-neutral-900 text-base font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ transition: `opacity 160ms ${EASE_OUT_EXPO}` }}
          >
            {submitting ? 'Submitting…' : 'Get my free score'}
          </button>

          <p className="mt-3 text-center text-xs text-neutral-400">
            No credit card. We&rsquo;ll never share your details.
          </p>
        </form>
      </div>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      {children}
    </label>
  )
}

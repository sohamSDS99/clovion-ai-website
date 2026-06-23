'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { countries } from '@/lib/countries'
import { analytics } from '@/lib/analytics'

// LeadCaptureModal — mounted ONCE in the root layout.
//
// Two responsibilities:
//  1. Global click interceptor. Every "Get Free Score" CTA across the site
//     ultimately renders an <a href="/free-ai-visibility-score"> (Button→Link,
//     plain <a>, FqBtn, CTABanner→Button). A single capture-phase click
//     listener on document catches them all — no need to edit ~20 call sites.
//     We preventDefault + stopPropagation so neither the native navigation nor
//     Next.js's <Link> handler fires; instead we open this modal.
//  2. The lead form itself. Fields mirror the webhook payload's user-supplied
//     data (first_name, last_name, email, country). On submit we POST to
//     /api/lead (which forwards the full trial_start payload to Make), then
//     send the visitor on to the score page they were originally headed to.

const SCORE_PATH = '/free-ai-visibility-score'

type FormState = {
  first_name: string
  last_name: string
  email: string
  country: string
}

const EMPTY: FormState = { first_name: '', last_name: '', email: '', country: '' }

export function LeadCaptureModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  // Where to send the visitor after a successful submit (the href they clicked).
  const destRef = useRef<string>(SCORE_PATH)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  // --- Global click interceptor -------------------------------------------
  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Only hijack a plain primary click. Let middle/right-click and the
      // browser's own new-tab modifiers behave normally.
      if (e.defaultPrevented || e.button !== 0) return

      const target = e.target as HTMLElement | null
      const anchor = target?.closest('a')
      if (!anchor) return

      const rawHref = anchor.getAttribute('href')
      if (!rawHref) return

      let path: string
      try {
        path = new URL(anchor.href, window.location.origin).pathname
      } catch {
        return
      }
      if (path.replace(/\/$/, '') !== SCORE_PATH) return

      // It's a Get-Free-Score destination — gate it behind the lead form.
      e.preventDefault()
      e.stopPropagation()
      destRef.current = rawHref.startsWith('http') ? path : rawHref
      analytics.getFreeScore('lead_form_open')
      setOpen(true)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  const close = useCallback(() => {
    // Don't let the user dismiss mid-submit or during the success hand-off
    // (we're about to redirect them to the score page).
    if (status === 'submitting' || status === 'success') return
    setOpen(false)
  }, [status])

  // Esc to close + body scroll lock while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // focus the first field once painted
    const t = setTimeout(() => firstFieldRef.current?.focus(), 30)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      clearTimeout(t)
    }
  }, [open, close])

  // Reset transient state when the modal closes.
  useEffect(() => {
    if (!open) {
      setStatus('idle')
      setErrorMsg('')
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
      analytics.formSubmit('free_score_lead', 'lead_form')
      // Show a brief thank-you, then hand the visitor to the score page they
      // were originally headed for.
      setStatus('success')
      const dest = destRef.current || SCORE_PATH
      setTimeout(() => {
        setOpen(false)
        setForm(EMPTY)
        router.push(dest)
      }, 1600)
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
        backdropFilter: 'blur(4px)'
      }}
    >
      <div
        // Self-contained light card — fixed colors so it reads the same on
        // both light and dark routes. Saans (--font-saans) is inherited.
        className="w-full max-w-[440px] rounded-2xl bg-white text-neutral-900 shadow-2xl"
        style={{ border: '1px solid #eceae5' }}
      >
        {status === 'success' ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 text-white">
              <svg width="26" height="26" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="mt-5 text-xl font-semibold tracking-tight text-neutral-900">Thanks — you&rsquo;re all set.</h2>
            <p className="mt-2 text-sm text-neutral-500">Taking you to your free AI visibility score&hellip;</p>
          </div>
        ) : (
          <>
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
            className="ml-3 -mr-1 -mt-1 rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
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
            className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-neutral-900 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Get my free score'}
          </button>

          <p className="mt-3 text-center text-xs text-neutral-400">
            No credit card. We&rsquo;ll never share your details.
          </p>
        </form>
          </>
        )}
      </div>
    </div>
  )
}

const inputCls =
  'w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</span>
      {children}
    </label>
  )
}

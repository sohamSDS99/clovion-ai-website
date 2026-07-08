'use client'

// Email gate for the free-score page (P2). Collects the lead + a Turnstile
// token, POSTs to /api/lead (which mints the scan-authorization cookie that
// /api/scan requires), then calls onGated() to run the scan. Self-contained
// light card — reads the same on light and dark routes.

import { useCallback, useState } from 'react'
import { countries } from '@/lib/countries'
import { analytics, newMetaEventId } from '@/lib/analytics'
import TurnstileWidget from './TurnstileWidget'

type FormState = {
  first_name: string
  last_name: string
  email: string
  country: string
  company: string
}

const EMPTY: FormState = { first_name: '', last_name: '', email: '', country: '', company: '' }

export default function EmailGate({
  domain,
  onClose,
  onGated,
}: {
  domain: string
  onClose: () => void
  onGated: (email: string) => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY)
  const [token, setToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onVerify = useCallback((t: string) => setToken(t), [])
  const update =
    (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'submitting') return
    if (!token) {
      setErrorMsg('Please complete the human check.')
      return
    }
    setStatus('submitting')
    setErrorMsg('')
    // Shared id for Meta Pixel⇄CAPI dedup (browser + server report the same id).
    const metaEventId = newMetaEventId('lead')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, domain, turnstileToken: token, metaEventId }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Something went wrong. Please try again.')
      }
      analytics.formSubmit('free_score_lead', 'free_score_gate', metaEventId)
      onGated(form.email)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  const submitting = status === 'submitting'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose()
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
      }}
    >
      <div
        className="w-full max-w-[440px] rounded-2xl bg-white text-neutral-900 shadow-2xl"
        style={{ border: '1px solid #eceae5' }}
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h2 id="gate-title" className="text-xl font-semibold tracking-tight text-neutral-900">
              Where should we send your score?
            </h2>
            <p className="mt-1.5 text-sm text-neutral-500">
              Your full report for <span className="font-semibold text-neutral-700">{domain}</span> is ready.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="ml-3 -mr-1 -mt-1 rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-40"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 pb-6 pt-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name">
              <input type="text" required autoComplete="given-name" value={form.first_name} onChange={update('first_name')} className={inputCls} placeholder="Ada" />
            </Field>
            <Field label="Last name">
              <input type="text" required autoComplete="family-name" value={form.last_name} onChange={update('last_name')} className={inputCls} placeholder="Lovelace" />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Work email">
              <input type="email" required autoComplete="email" value={form.email} onChange={update('email')} className={inputCls} placeholder="ada@company.com" />
            </Field>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Field label="Company">
              <input type="text" autoComplete="organization" value={form.company} onChange={update('company')} className={inputCls} placeholder="Acme" />
            </Field>
            <Field label="Country">
              <select required value={form.country} onChange={update('country')} className={inputCls}>
                <option value="" disabled>
                  Select
                </option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="mt-4">
            <TurnstileWidget onVerify={onVerify} onExpire={() => setToken('')} />
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
            {submitting ? 'Submitting…' : 'Email me my score'}
          </button>
          <p className="mt-3 text-center text-xs text-neutral-400">No credit card. We&rsquo;ll never share your details.</p>
        </form>
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

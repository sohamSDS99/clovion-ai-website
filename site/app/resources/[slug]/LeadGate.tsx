'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { analytics } from '@/lib/analytics'
import type { ResourceLeadField } from '@/lib/cms-types'

type Props = {
  slug: string
  resourceTitle: string
  /** When false, render a minimal email-only request (public resource, no PDF inline). */
  gated: boolean
  fields: ResourceLeadField[]
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Always collect an email even when the lead form omits it — the CMS lead
// endpoint requires it and it's the minimum gate before a download URL is issued.
const EMAIL_FIELD: ResourceLeadField = {
  name: 'email',
  label: 'Work email',
  type: 'email',
  required: true
}

function inputType(type: string): string {
  switch (type) {
    case 'email':
      return 'email'
    case 'tel':
    case 'phone':
      return 'tel'
    case 'url':
      return 'url'
    case 'number':
      return 'number'
    default:
      return 'text'
  }
}

export function LeadGate({ slug, resourceTitle, gated, fields }: Props) {
  // Ensure an email field exists exactly once, pinned first.
  const hasEmail = fields.some((f) => f.name === 'email' || f.type === 'email')
  const formFields: ResourceLeadField[] = hasEmail
    ? [...fields].sort((a, b) =>
        a.type === 'email' || a.name === 'email' ? -1 : b.type === 'email' || b.name === 'email' ? 1 : 0
      )
    : [EMAIL_FIELD, ...fields]

  const [values, setValues] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  function setField(name: string, value: string) {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }))
  }

  function validate(): boolean {
    const next: Record<string, string> = {}
    for (const f of formFields) {
      const raw = (values[f.name] ?? '').trim()
      const isEmail = f.type === 'email' || f.name === 'email'
      if ((f.required || isEmail) && !raw) {
        next[f.name] = `${f.label} is required.`
        continue
      }
      if (isEmail && raw && !EMAIL_RE.test(raw)) {
        next[f.name] = 'Enter a valid email address.'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    if (!validate()) return

    const email = (values['email'] ?? '').trim()
    // Everything except email goes in `data`.
    const data: Record<string, string> = {}
    for (const f of formFields) {
      if (f.name === 'email') continue
      const raw = (values[f.name] ?? '').trim()
      if (raw) data[f.name] = raw
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/resource-lead', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, email, data })
      })
      const body = (await res.json().catch(() => null)) as
        | { downloadUrl?: string; error?: string }
        | null
      if (!res.ok || !body?.downloadUrl) {
        setSubmitError(body?.error ?? 'Something went wrong. Please try again.')
        return
      }
      setDownloadUrl(body.downloadUrl)
      analytics.formSubmit('resource_lead', `resource_${slug}`)
      analytics.fileDownload(resourceTitle, body.downloadUrl)
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Success: the only place a download URL is ever exposed.
  if (downloadUrl) {
    return (
      <div className="rounded-card border border-[var(--line)] bg-[var(--subtle)] p-7">
        <p className="eyebrow eyebrow-dot text-[var(--ink-60)]">READY</p>
        <h3 className="display-sm mt-4 text-[var(--ink)]">Your download is ready.</h3>
        <p className="mt-3 text-[var(--ink-70)]">Thanks. The link below opens your copy of {resourceTitle}.</p>
        <div className="mt-6">
          <Button
            href={downloadUrl}
            variant="primary"
            size="lg"
            trackEvent="file_download"
            trackLocation={`resource_${slug}`}
          >
            Download now
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-card border border-[var(--line)] bg-[var(--white)] p-7">
      <p className="eyebrow eyebrow-dot text-[var(--ink-60)]">{gated ? 'GET THE DOWNLOAD' : 'DOWNLOAD'}</p>
      <h3 className="display-sm mt-4 text-[var(--ink)]">
        {gated ? 'Tell us where to send it.' : 'Get your copy.'}
      </h3>
      <p className="mt-3 text-[var(--ink-70)]">
        {gated
          ? 'Fill in the form and we’ll unlock your download right away.'
          : 'Enter your email and we’ll unlock the download.'}
      </p>

      <div className="mt-6 space-y-5">
        {formFields.map((f) => {
          const isEmail = f.type === 'email' || f.name === 'email'
          const required = f.required || isEmail
          const err = errors[f.name]
          const fieldId = `lead-${f.name}`
          return (
            <div key={f.name}>
              <label htmlFor={fieldId} className="block text-sm font-semibold text-[var(--ink)]">
                {f.label}
                {required ? <span className="text-[var(--ink-40)]"> *</span> : null}
              </label>
              {f.type === 'select' && f.options?.length ? (
                <select
                  id={fieldId}
                  value={values[f.name] ?? ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  aria-invalid={!!err}
                  aria-describedby={err ? `${fieldId}-err` : undefined}
                  className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--white)] px-3.5 text-[var(--ink)] outline-none focus:border-[var(--ink-40)] focus:ring-2 focus:ring-[var(--ink-10)]"
                >
                  <option value="" disabled>
                    Select…
                  </option>
                  {f.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea
                  id={fieldId}
                  value={values[f.name] ?? ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  rows={3}
                  aria-invalid={!!err}
                  aria-describedby={err ? `${fieldId}-err` : undefined}
                  className="mt-2 w-full rounded-lg border border-[var(--line)] bg-[var(--white)] px-3.5 py-2.5 text-[var(--ink)] outline-none focus:border-[var(--ink-40)] focus:ring-2 focus:ring-[var(--ink-10)]"
                />
              ) : (
                <input
                  id={fieldId}
                  type={inputType(f.type)}
                  inputMode={isEmail ? 'email' : undefined}
                  autoComplete={isEmail ? 'email' : undefined}
                  value={values[f.name] ?? ''}
                  onChange={(e) => setField(f.name, e.target.value)}
                  aria-invalid={!!err}
                  aria-describedby={err ? `${fieldId}-err` : undefined}
                  className="mt-2 h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--white)] px-3.5 text-[var(--ink)] outline-none focus:border-[var(--ink-40)] focus:ring-2 focus:ring-[var(--ink-10)]"
                />
              )}
              {err ? (
                <p id={`${fieldId}-err`} role="alert" className="mt-1.5 text-sm text-[var(--ink-70)]">
                  {err}
                </p>
              ) : null}
            </div>
          )
        })}
      </div>

      {submitError ? (
        <p role="alert" className="mt-5 rounded-lg border border-[var(--line)] bg-[var(--subtle)] px-3.5 py-3 text-sm text-[var(--ink)]">
          {submitError}
        </p>
      ) : null}

      <div className="mt-6">
        <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? 'Submitting…' : gated ? 'Unlock download' : 'Get the download'}
        </Button>
      </div>
    </form>
  )
}

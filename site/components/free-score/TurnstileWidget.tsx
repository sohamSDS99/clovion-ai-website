'use client'

// Cloudflare Turnstile widget (explicit render). Loads the script on demand
// and reports the token via onVerify. No-ops with a hint when the site key is
// unset, so dev without Turnstile still renders the gate.

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      remove: (id: string) => void
      reset: (id?: string) => void
    }
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let scriptPromise: Promise<void> | null = null

function loadTurnstile(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('turnstile script failed to load'))
    document.head.appendChild(s)
  })
  return scriptPromise
}

export default function TurnstileWidget({
  onVerify,
  onExpire,
}: {
  onVerify: (token: string) => void
  onExpire?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  // Keep callbacks in refs so the render effect doesn't re-run on each parent render.
  const onVerifyRef = useRef(onVerify)
  onVerifyRef.current = onVerify
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) return
    let cancelled = false
    loadTurnstile()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerifyRef.current(token),
          'expired-callback': () => onExpireRef.current?.(),
        })
      })
      .catch(() => {})
    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current)
        } catch {
          /* widget already gone */
        }
      }
    }
  }, [siteKey])

  if (!siteKey) {
    return (
      <p style={{ fontSize: 12, color: '#a1a1aa', margin: 0 }}>
        Human check unavailable (NEXT_PUBLIC_TURNSTILE_SITE_KEY not set).
      </p>
    )
  }
  return <div ref={ref} />
}

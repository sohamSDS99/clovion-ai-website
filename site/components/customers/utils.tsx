'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

export const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 2rem'
}

export const DISPLAY_LG: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-lg)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-lg)',
  lineHeight: 1.02,
  textWrap: 'balance' as CSSProperties['textWrap']
}

export const DISPLAY_MD: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.05,
  textWrap: 'balance' as CSSProperties['textWrap']
}

export const DISPLAY_SM: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-sm)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-sm)',
  lineHeight: 1.12,
  textWrap: 'balance' as CSSProperties['textWrap']
}

export const LEAD: CSSProperties = {
  fontSize: 'var(--text-lead)',
  lineHeight: 1.55,
  color: 'var(--ink-70)',
  textWrap: 'balance' as CSSProperties['textWrap']
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: 'var(--ink-50)'
      }}
    >
      {children}
    </span>
  )
}

export function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PlusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true)
            obs.disconnect()
          }
        })
      },
      { threshold }
    )
    obs.observe(el)
    const fallback = setTimeout(() => setSeen(true), 1200)
    return () => {
      obs.disconnect()
      clearTimeout(fallback)
    }
  }, [threshold])
  return { ref, seen }
}

export function Window({
  label,
  children,
  dark
}: {
  label: string
  children: ReactNode
  dark?: boolean
}) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: 'none',
        background: dark ? 'var(--ink-surface, var(--ink))' : 'var(--white)',
        boxShadow: '0 30px 80px -40px rgba(0,0,0,0.65)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          height: 44,
          borderBottom: `1px solid ${dark ? 'var(--on-ink-15)' : 'var(--line)'}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#fecdd3' }} />
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#fde68a' }} />
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#a7f3d0' }} />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: dark ? 'var(--on-ink-50)' : 'var(--ink-50)'
          }}
        >
          {label}
        </div>
        <div style={{ width: 24 }} />
      </div>
      {children}
    </div>
  )
}

export function trackCta(text: string, location: string) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> }
  w.dataLayer = w.dataLayer || []
  const lower = text.toLowerCase()
  const event = lower.includes('free trial')
    ? 'start_trial'
    : lower.includes('free score')
      ? 'get_free_score'
      : 'cta_click'
  w.dataLayer.push({ event, cta_location: location, cta_text: text })
}

export function CTAButtons({ location }: { location: string }) {
  const onClick = (text: string) => () => trackCta(text, location)
  return (
    <>
      <a
        href="https://app.clovion.ai/signup"
        className="btn btn-primary btn-lg"
        onClick={onClick('Start Free Trial')}
      >
        Start Free Trial <ArrowRight />
      </a>
      <a
        href="/free-ai-visibility-score"
        className="btn btn-secondary btn-lg"
        onClick={onClick('Get Free Score')}
      >
        Get Free Score
      </a>
    </>
  )
}

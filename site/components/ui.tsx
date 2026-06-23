'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'
import type { ComponentProps, ReactNode } from 'react'
import { analytics, track } from '@/lib/analytics'

// Recursively extract plain text from a ReactNode tree (e.g. Button children
// may be "Start free trial <ArrowRight/>" — we want just the text part).
function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as { props?: { children?: ReactNode } }).props?.children)
  }
  return ''
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('container-page', className)}>{children}</div>
}

export function Section({
  className,
  children,
  tight,
  bg,
  id
}: {
  className?: string
  children: ReactNode
  tight?: boolean
  bg?: 'subtle' | 'ink' | 'gradient'
  id?: string
}) {
  return (
    <section
      id={id}
      className={cn(
        tight ? 'section-y-tight' : 'section-y',
        bg === 'subtle' && 'bg-subtle',
        bg === 'ink' && 'bg-ink text-white',
        bg === 'gradient' && 'relative overflow-hidden',
        className
      )}
    >
      {bg === 'gradient' && (
        <div className="hero-bg absolute inset-0 -z-10" aria-hidden />
      )}
      {children}
    </section>
  )
}

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'invert' | 'ghost'
  size?: 'md' | 'lg' | 'sm'
  href?: string
  className?: string
  children: ReactNode
  // Adds a dataLayer push on click. trackLocation is the only required field
  // to enable tracking; the event name is auto-detected from the button text
  // (free trial → start_trial, free score → get_free_score, demo → book_demo,
  // else → cta_click). Override with trackEvent + trackPlan for pricing tiers.
  trackLocation?: string
  trackEvent?: string
  trackPlan?: string
} & Omit<ComponentProps<'button'>, 'children'>

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
  trackLocation,
  trackEvent,
  trackPlan,
  ...rest
}: ButtonProps) {
  const classes = cn(
    'btn',
    variant === 'primary' && 'btn-primary',
    variant === 'secondary' && 'btn-secondary',
    variant === 'invert' && 'btn-invert',
    variant === 'ghost' && 'btn-ghost',
    size === 'lg' && 'h-12 px-6 text-base',
    size === 'sm' && 'h-9 px-3.5 text-sm',
    className
  )

  const fireTracking = () => {
    if (!trackLocation) return
    const text = extractText(children).trim()
    if (trackEvent) {
      track({
        event: trackEvent,
        cta_text: text,
        cta_location: trackLocation,
        ...(trackPlan ? { plan_name: trackPlan } : {}),
        ...(href ? { link_url: href } : {})
      })
      return
    }
    if (!text) return
    const lower = text.toLowerCase()
    if (lower.includes('free trial')) analytics.startTrial(trackLocation, trackPlan)
    else if (lower.includes('free score')) analytics.getFreeScore(trackLocation)
    else if (lower.includes('demo')) analytics.bookDemo(trackLocation)
    else analytics.ctaClick(text, trackLocation, href)
  }

  if (href) {
    const isExternal = /^(https?:|mailto:|tel:)/i.test(href)
    if (isExternal) {
      // Same-tab for clovion.ai apex + subdomains (in-product navigation
      // like app.clovion.ai/login). New tab for fully external destinations
      // (calendly.com, social, etc).
      let sameTab = false
      try {
        const u = new URL(href)
        sameTab = u.hostname === 'clovion.ai' || u.hostname.endsWith('.clovion.ai')
      } catch {}
      return (
        <a
          href={href}
          className={classes}
          onClick={fireTracking}
          {...(sameTab ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        >
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={classes} onClick={fireTracking}>
        {children}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      {...rest}
      onClick={(e) => {
        fireTracking()
        rest.onClick?.(e)
      }}
    >
      {children}
    </button>
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('eyebrow eyebrow-dot', className)}>{children}</span>
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('tag', className)}>{children}</span>
}

export function Card({
  className,
  children,
  as: As = 'div'
}: {
  className?: string
  children: ReactNode
  as?: 'div' | 'article' | 'li' | 'a'
}) {
  return <As className={cn('card p-7', className)}>{children}</As>
}

export function GradientOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute -z-10 rounded-full opacity-80 blur-3xl animate-orb-pulse',
        'bg-[radial-gradient(closest-side,rgba(10,10,15,0.10),rgba(10,10,15,0.04),transparent_75%)]',
        className
      )}
    />
  )
}

export function HeroShade({
  intensity = 0.07,
  spread = 42,
  className
}: {
  intensity?: number
  spread?: number
  className?: string
}) {
  const bg = [
    `radial-gradient(circle at 0% 0%, rgba(10,10,15,${intensity}), transparent ${spread}%)`,
    `radial-gradient(circle at 100% 0%, rgba(10,10,15,${intensity}), transparent ${spread}%)`,
    `radial-gradient(circle at 0% 100%, rgba(10,10,15,${intensity}), transparent ${spread}%)`,
    `radial-gradient(circle at 100% 100%, rgba(10,10,15,${intensity}), transparent ${spread}%)`
  ].join(', ')
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{ background: bg }}
    />
  )
}

export function HairlineDivider({ className }: { className?: string }) {
  return <div className={cn('hairline w-full', className)} />
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" className={cn(className)} aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" className={cn(className)} aria-hidden>
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function HaloMark({ className, size = 28 }: { className?: string; size?: number }) {
  // Vector-traced from the canonical brand-mark PNG via potrace 1.16.
  // Source: logo-reference.png — large outer chevron + small inner accent
  // forming the Clovion "C" mark. Uses currentColor so it adapts to parent
  // text color (cream, ink-dark, anywhere).
  return (
    <svg
      viewBox="0 0 201.173 219.836"
      width={size}
      height={size}
      className={cn(className)}
      fill="currentColor"
      aria-hidden
    >
      <g transform="translate(-0.71, 221) scale(0.1, -0.1)">
        <path d="M544 1614 l-537 -596 29 -27 c71 -69 1044 -941 1049 -941 8 0 6 334 -3 345 -4 6 -164 152 -355 324 -191 173 -346 317 -345 321 2 5 162 184 356 400 l352 391 0 189 c0 105 -2 190 -5 190 -2 0 -246 -268 -541 -596z" />
        <path d="M1280 1939 l1 -174 260 -235 c143 -129 272 -244 286 -254 l26 -20 83 90 c46 49 83 94 83 99 -1 9 -675 622 -720 654 -19 13 -19 9 -19 -160z" />
        <path d="M1435 558 l-155 -172 0 -189 c0 -104 4 -187 8 -185 12 4 512 560 512 568 0 10 -187 150 -199 150 -6 0 -80 -77 -166 -172z" />
      </g>
    </svg>
  )
}

'use client'

import { useRef, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function SpotlightCard({
  className,
  children,
  as: As = 'div',
  href
}: {
  className?: string
  children: ReactNode
  as?: 'div' | 'article' | 'a'
  href?: string
}) {
  const ref = useRef<HTMLDivElement | HTMLAnchorElement | null>(null)

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        onMouseMove={handleMove}
        className={cn('card group relative overflow-hidden block', className)}
      >
        <span aria-hidden className="spotlight-overlay" />
        <span className="relative block">{children}</span>
      </a>
    )
  }

  return (
    <As
      ref={ref as React.RefObject<any>}
      onMouseMove={handleMove}
      className={cn('card group relative overflow-hidden', className)}
    >
      <span aria-hidden className="spotlight-overlay" />
      <span className="relative block">{children}</span>
    </As>
  )
}

import Link from 'next/link'
import { cn } from '@/lib/cn'
import type { ComponentProps, ReactNode } from 'react'

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
} & Omit<ComponentProps<'button'>, 'children'>

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className,
  children,
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

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} {...rest}>
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
  // Clovion brand mark — stylized "C" formed by two mirrored chevron halves
  // (top + bottom) that meet at a sharp left-pointing tip at the midline.
  // Each half has a horizontal cap flush with the canvas edge, an outer
  // diagonal tapering to the tip, and an inner edge with a bent "shoulder"
  // giving the chevron character. Uses currentColor so it adapts to parent
  // text color (cream, ink-dark, anywhere).
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={cn(className)}
      fill="currentColor"
      aria-hidden
    >
      {/* Top half */}
      <path d="M0 16 L8 0 L24 0 L16 8 Z" />
      {/* Bottom half (mirror) */}
      <path d="M0 16 L8 32 L24 32 L16 24 Z" />
    </svg>
  )
}

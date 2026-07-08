'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Button, Container, HaloMark } from './ui'
import { nav } from '@/lib/content'
import { cn } from '@/lib/cn'

export function Header() {
  const [open, setOpen] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setOpen(null)
  }, [pathname])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top)]',
        scrolled
          ? 'backdrop-blur-xl bg-white/80 border-b border-line/80'
          : 'bg-transparent'
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-display font-semibold tracking-[-0.02em] text-[1.05rem] text-ink"
        >
          <HaloMark size={24} />
          <span className="truncate max-w-[160px] md:max-w-none">Clovion AI</span>
        </Link>

        <nav
          className="hidden lg:flex items-center gap-1"
          onMouseLeave={() => setOpen(null)}
        >
          {nav.primary.map((item) => {
            const hasChildren = 'children' in item && Array.isArray(item.children) && item.children.length > 0
            const isActive = 'href' in item && typeof item.href === 'string'
              ? (pathname === item.href || pathname.startsWith(item.href + '/'))
              : false
            const triggerClassName = cn(
              'flex items-center gap-1 px-3 h-9 rounded-pill text-[0.95rem] font-semibold tracking-[-0.01em] text-ink transition-colors',
              isActive ? 'bg-ink/5' : 'hover:bg-ink/5'
            )
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => hasChildren && setOpen(item.label)}
              >
                {hasChildren ? (
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={open === item.label}
                    onFocus={() => setOpen(item.label)}
                    className={cn(triggerClassName, 'cursor-pointer bg-transparent border-0')}
                  >
                    {item.label}
                    <svg
                      viewBox="0 0 12 12"
                      width="9"
                      height="9"
                      fill="none"
                      aria-hidden
                      className={cn(
                        'transition-transform duration-200',
                        open === item.label && 'rotate-180'
                      )}
                    >
                      <path
                        d="M3 4.5L6 7.5L9 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link href={'href' in item ? item.href : '#'} className={triggerClassName}>
                    {item.label}
                  </Link>
                )}
                {hasChildren && (
                  <div
                    className={cn(
                      'hidden lg:block absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-200 ease-out origin-top',
                      open === item.label
                        ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                        : 'opacity-0 -translate-y-1 scale-[0.98] pointer-events-none'
                    )}
                  >
                    <div
                      className={cn(
                        'rounded-card bg-white border border-line shadow-card p-3',
                        // Long menus (Features has 9 items) go 3-column so the
                        // panel stays short enough for a laptop viewport; short
                        // menus (Resources) keep the single-column layout.
                        item.children!.length > 6
                          ? 'w-[min(920px,calc(100vw-2rem))] grid grid-cols-3 gap-x-1 gap-y-0.5'
                          : 'w-[min(480px,calc(100vw-2rem))]'
                      )}
                    >
                      {item.children!.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block p-3.5 rounded-2xl hover:bg-subtle transition-colors group"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold text-[0.95rem] text-ink">
                              {child.label}
                            </div>
                            <svg
                              viewBox="0 0 16 16"
                              width="12"
                              height="12"
                              fill="none"
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-ink shrink-0"
                              aria-hidden
                            >
                              <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          {'desc' in child && child.desc && (
                            <div className="text-[0.84rem] text-ink-60 mt-0.5">
                              {child.desc}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button href="https://app.clovion.ai/login" variant="ghost" size="sm" trackLocation="header">
            Log in
          </Button>
          <Button href="https://app.clovion.ai/signup" variant="primary" size="sm" trackLocation="header">
            Sign up
          </Button>
        </div>

        <button
          aria-label="Toggle menu"
          className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-ink/5 text-ink"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden>
            {mobileOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            ) : (
              <>
                <path
                  d="M4 8h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M4 16h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
        </button>
      </Container>

      {mobileOpen && (
        <div className="lg:hidden border-t border-line bg-white max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain">
          <Container className="py-4 flex flex-col gap-1">
            {nav.primary.map((item) => {
              if ('children' in item && Array.isArray(item.children) && item.children.length > 0) {
                return (
                  <div key={item.label}>
                    <div className="px-3 py-3 font-semibold text-ink">{item.label}</div>
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        href={c.href}
                        className="block px-6 py-2 text-[0.9rem] text-ink-70 hover:bg-subtle hover:text-ink rounded-2xl"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )
              }
              return (
                <Link
                  key={item.label}
                  href={'href' in item ? item.href : '#'}
                  className="px-3 py-3 rounded-2xl hover:bg-subtle font-semibold text-ink"
                >
                  {item.label}
                </Link>
              )
            })}
            <div className="mt-3 flex flex-col gap-2 px-2 pb-2">
              <Button href="https://app.clovion.ai/login" variant="secondary" trackLocation="header_mobile">
                Log in
              </Button>
              <Button href="https://app.clovion.ai/signup" variant="primary" trackLocation="header_mobile">
                Sign up
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}

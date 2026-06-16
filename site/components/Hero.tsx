'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Button, Container, ArrowRight, HeroShade } from './ui'

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="opacity-50 absolute inset-0 -z-10" aria-hidden>
        <div className="hero-bg absolute inset-0" />
      </div>
      <HeroShade />

      <Container className="relative pt-20 md:pt-28 lg:pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2.5 rounded-pill bg-white border border-line shadow-sm px-3.5 py-1.5 opacity-0 animate-rise"
            style={{ animationDelay: '0ms' }}
          >
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-ink animate-pulse" />
            <span className="text-[0.82rem] font-semibold tracking-[-0.02em]">
              <span className="text-ink-70">New in 2.6 —</span>{' '}
              <span>Platform coverage expanded to 10 engines.</span>
            </span>
            <Link href="/changelog" className="text-[0.82rem] font-semibold text-ink inline-flex items-center gap-0.5">
              Read changelog <ArrowRight className="opacity-80" />
            </Link>
          </div>

          <h1
            className="display-xl mt-8 text-balance opacity-0 animate-rise"
            style={{ animationDelay: '80ms' }}
          >
            How{' '}
            <span className="bg-gradient-to-br from-black via-neutral-700 to-neutral-400 bg-clip-text text-transparent">
              AI sees you.
            </span>
          </h1>

          <p
            className="lead mt-7 max-w-xl mx-auto text-balance opacity-0 animate-rise"
            style={{ animationDelay: '160ms' }}
          >
            Track your brand mentions across ChatGPT, Perplexity, Gemini, and AI Overviews. Get the fixes that actually move the needle.
          </p>

          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-3 opacity-0 animate-rise"
            style={{ animationDelay: '240ms' }}
          >
            <Button href="/pricing" variant="primary" size="lg" trackLocation="hero">
              Start free trial <ArrowRight />
            </Button>
            <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="hero">
              Get free score
            </Button>
          </div>
          <p
            className="mt-5 text-[0.85rem] text-ink-50 opacity-0 animate-rise"
            style={{ animationDelay: '320ms' }}
          >
            14-day free trial · No credit card · Set up in under 5 minutes
          </p>
        </div>

        <div
          className="mt-20 md:mt-28 max-w-6xl mx-auto opacity-0 animate-rise"
          style={{ animationDelay: '400ms' }}
        >
          <HeroBento />
        </div>
      </Container>
    </section>
  )
}

const CHART_HEIGHTS = [22, 26, 30, 28, 38, 34, 48, 44, 62, 78]
const ENGINES = [
  { name: 'ChatGPT', score: 92, change: '+18' },
  { name: 'Claude', score: 87, change: '+24' },
  { name: 'Perplexity', score: 81, change: '+12' },
  { name: 'Gemini', score: 74, change: '+9' },
  { name: 'AI Overviews', score: 69, change: '+6' }
]

function HeroBento() {
  const rootRef = useRef<HTMLDivElement>(null)
  const hasRunRef = useRef(false)
  const [activated, setActivated] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [metric, setMetric] = useState(0)

  useEffect(() => {
    const mql = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    if (mql?.matches) setReducedMotion(true)
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    if (reducedMotion) {
      hasRunRef.current = true
      setActivated(true)
      setMetric(28.4)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !hasRunRef.current) {
            hasRunRef.current = true
            setActivated(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [reducedMotion])

  useEffect(() => {
    if (!activated || reducedMotion) return
    const target = 28.4
    const duration = 1400
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setMetric(Number((eased * target).toFixed(1)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [activated, reducedMotion])

  // Engine row delays (ms) relative to activation
  const engineRowDelay = (i: number) => 1200 + i * 100
  const engineBarDelay = (i: number) => engineRowDelay(i) + 200

  return (
    <div ref={rootRef} className="relative">
      <div className="rounded-[24px] border border-line bg-white shadow-card overflow-hidden">
        {/* App chrome top bar */}
        <div className="h-12 border-b border-line flex items-center px-4 gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="font-mono text-[0.74rem] text-ink-50">
              Workspaces / Clovion AI / Visibility
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-6 w-6 rounded-full bg-[rgba(10,10,15,0.06)]">
              <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-ink" />
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex">
          {/* Left sidebar */}
          <aside className="w-44 bg-subtle border-r border-line p-3 hidden md:block">
            <div className="p-2 rounded-lg bg-white border border-line flex items-center justify-between text-[0.82rem] font-semibold">
              <span className="truncate">Clovion AI</span>
              <svg viewBox="0 0 16 16" width="12" height="12" className="text-ink-50" aria-hidden>
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <nav className="mt-4 space-y-0.5">
              <SidebarItem label="Dashboard" />
              <SidebarItem label="Visibility" active />
              <SidebarItem label="Discovery" />
              <SidebarItem label="Agents" />
              <SidebarItem label="Insights" />
              <div className="h-4" />
              <SidebarItem label="Settings" />
            </nav>
          </aside>

          {/* Main area */}
          <main className="flex-1 p-5 md:p-7 min-w-0">
            <div className="text-[0.74rem] uppercase tracking-[0.1em] font-semibold text-ink-50">
              VISIBILITY
            </div>

            <div className="mt-3 flex items-end gap-3 flex-wrap">
              <div>
                <div className="font-display text-[2.5rem] font-semibold tracking-[-0.02em] leading-none text-ink tabular-nums">
                  {metric.toFixed(1)}%
                </div>
                <div className="mt-1.5 text-[0.84rem] text-ink-60">
                  Share of voice · last 30 days
                </div>
              </div>
              <span
                className="inline-flex items-center rounded-pill border border-emerald-100 bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[0.74rem] font-semibold mb-1 transition-all duration-500 ease-out"
                style={{
                  opacity: activated ? 1 : 0,
                  transform: activated ? 'translateY(0)' : 'translateY(8px)',
                  transitionDelay: reducedMotion ? '0ms' : '1000ms'
                }}
              >
                ↑ 6.2 pts
              </span>
            </div>

            {/* Bar chart */}
            <div className="mt-6 relative">
              <div className="flex items-end gap-1.5 h-24">
                {CHART_HEIGHTS.map((h, i) => {
                  const isPeak = i === CHART_HEIGHTS.length - 1
                  const delay = i * 80
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm transition-[height] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isPeak ? 'bg-ink' : 'bg-ink/60'
                      }`}
                      style={{
                        height: activated ? `${h}%` : '0%',
                        transitionDuration: reducedMotion ? '0ms' : '1200ms',
                        transitionDelay: reducedMotion ? '0ms' : `${delay}ms`
                      }}
                    />
                  )
                })}
              </div>

              {/* Annotated callout */}
              <div className="hidden lg:block pointer-events-none absolute -top-2 right-0 w-[230px]">
                <svg viewBox="0 0 230 60" width="230" height="60" className="absolute inset-x-0 top-4" aria-hidden>
                  <path
                    d="M10 50 Q 80 50 110 28 T 210 12"
                    stroke="rgba(10,10,15,0.6)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="260"
                    strokeDashoffset={activated ? 0 : 260}
                    style={{
                      transition: reducedMotion
                        ? 'none'
                        : 'stroke-dashoffset 800ms cubic-bezier(0.16, 1, 0.3, 1)',
                      transitionDelay: reducedMotion ? '0ms' : '2200ms'
                    }}
                  />
                </svg>
                <div
                  className="absolute right-0 top-0 italic text-[0.78rem] text-ink-70 max-w-[170px] text-right transition-all duration-500 ease-out"
                  style={{
                    opacity: activated ? 1 : 0,
                    transform: activated ? 'translateY(0)' : 'translateY(6px)',
                    transitionDelay: reducedMotion ? '0ms' : '2400ms'
                  }}
                >
                  7.1× lift after Content Studio went live
                </div>
              </div>
            </div>

            {/* Engine breakdown */}
            <div className="mt-7 space-y-2">
              {ENGINES.map((e, i) => (
                <div
                  key={e.name}
                  className="grid grid-cols-[8.5rem_1fr_auto] items-center gap-3 transition-all duration-500 ease-out"
                  style={{
                    opacity: activated ? 1 : 0,
                    transform: activated ? 'translateY(0)' : 'translateY(6px)',
                    transitionDelay: reducedMotion ? '0ms' : `${engineRowDelay(i)}ms`
                  }}
                >
                  <span className="font-semibold text-[0.82rem] truncate">{e.name}</span>
                  <div className="h-1.5 rounded-full bg-subtle overflow-hidden">
                    <div
                      className="h-full rounded-full bg-ink/40 transition-[width] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        width: activated ? `${e.score}%` : '0%',
                        transitionDuration: reducedMotion ? '0ms' : '900ms',
                        transitionDelay: reducedMotion ? '0ms' : `${engineBarDelay(i)}ms`
                      }}
                    />
                  </div>
                  <div className="text-[0.82rem] tabular-nums text-ink-70 whitespace-nowrap">
                    <span className="font-semibold">{e.score}%</span>
                    <span className="text-ink font-semibold ml-2">{e.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 py-1.5 px-2 rounded-md text-[0.84rem] ${
        active ? 'bg-[rgba(10,10,15,0.04)] font-semibold' : 'text-ink-70'
      }`}
    >
      {active ? (
        <span className="h-1.5 w-1.5 rounded-full bg-ink" />
      ) : (
        <span className="h-1.5 w-1.5" />
      )}
      <span>{label}</span>
    </div>
  )
}

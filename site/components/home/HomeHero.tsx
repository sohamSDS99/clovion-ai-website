'use client'

import { useEffect, useRef, useState } from 'react'
import { Button, Container, ArrowRight } from '@/components/ui'

const HERO_LOGOS = [
  { src: '/logos/chatgpt.svg', alt: 'ChatGPT' },
  { src: '/logos/claude.svg', alt: 'Claude' },
  { src: '/logos/gemini.svg', alt: 'Gemini' },
  { src: '/logos/perplexity.svg', alt: 'Perplexity' },
  { src: '/logos/grok-icon.svg', alt: 'Grok' },
  { src: '/logos/google-ai.svg', alt: 'Google AI Overviews' }
]

const CHART = [22, 26, 30, 28, 38, 34, 48, 44, 62, 78]
const BENTO_ENGINES = [
  { name: 'ChatGPT', score: 92, change: '+18', peak: true },
  { name: 'Claude', score: 87, change: '+24' },
  { name: 'Perplexity', score: 81, change: '+12' },
  { name: 'Gemini', score: 74, change: '+9' },
  { name: 'AI Overviews', score: 69, change: '+6' }
]

export function HomeHero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.5,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, transparent 70%)'
        }}
      />
      <Container className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--display-xl)',
              fontWeight: 600,
              letterSpacing: 'var(--track-display-xl)',
              lineHeight: 1.08,
              margin: 0
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.28em',
                flexWrap: 'wrap'
              }}
            >
              <span>See how AI</span>
              <RotatingLogo />
            </span>
            <span style={{ display: 'block' }}>sees your brand</span>
          </h1>

          <p
            style={{
              fontSize: 'var(--text-lead)',
              lineHeight: 1.55,
              color: 'var(--ink-70)',
              maxWidth: 640,
              margin: '1.75rem auto 0',
              textWrap: 'balance'
            }}
          >
            Track your brand&rsquo;s visibility across AI engines and find the gaps stopping you from getting mentioned.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="home_hero">
              Start Free Trial <ArrowRight />
            </Button>
            <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="home_hero">
              Get Free Score
            </Button>
          </div>
          <p
            className="mt-5 text-[0.85rem]"
            style={{ color: 'var(--ink-50)' }}
          >
            Free score takes 60 seconds · No login required · No credit card
          </p>
        </div>

        <div className="mt-12 md:mt-20 max-w-6xl mx-auto -mx-4 md:mx-auto px-4 md:px-0 overflow-x-auto md:overflow-visible">
          <div className="min-w-[520px] md:min-w-0">
            <HeroBento />
          </div>
        </div>
      </Container>
    </section>
  )
}

function RotatingLogo() {
  const N = HERO_LOGOS.length
  const [i, setI] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const t = setInterval(() => setI((v) => (v + 1) % N), 2000)
    return () => clearInterval(t)
  }, [N])

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        height: '0.96em',
        margin: '0 0.18em'
      }}
    >
      {HERO_LOGOS.map((logo, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={idx}
          src={logo.src}
          alt={idx === i ? logo.alt : ''}
          style={{
            height: '0.92em',
            width: 'auto',
            display: 'block',
            position: idx === 0 ? 'relative' : 'absolute',
            left: idx === 0 ? 'auto' : '50%',
            top: '50%',
            transform: idx === 0 ? 'translateY(-50%)' : 'translate(-50%, -50%)',
            filter: 'var(--logo-filter, brightness(0))',
            opacity: idx === i ? 1 : 0,
            transition: 'opacity 0.55s ease'
          }}
        />
      ))}
    </span>
  )
}

function useCountUp(target: number, run: boolean, ms = 1400) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    let start = 0
    const tick = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / ms)
      setV(Number(((1 - Math.pow(1 - t, 3)) * target).toFixed(1)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target, ms])
  return v
}

function HeroBento() {
  const rootRef = useRef<HTMLDivElement>(null)
  const hasRunRef = useRef(false)
  const [on, setOn] = useState(false)
  const metric = useCountUp(28.4, on)

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      hasRunRef.current = true
      setOn(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !hasRunRef.current) {
            hasRunRef.current = true
            setOn(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <div
        style={{
          borderRadius: 24,
          border: '1px solid var(--line)',
          background: 'var(--white)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden'
        }}
      >
        {/* App chrome top bar */}
        <div style={{ height: 48, borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ height: 10, width: 10, borderRadius: 999, background: 'var(--ink-15)' }} />
            <span style={{ height: 10, width: 10, borderRadius: 999, background: 'var(--ink-15)' }} />
            <span style={{ height: 10, width: 10, borderRadius: 999, background: 'var(--ink-15)' }} />
          </div>
          <div style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-50)' }}>
            Workspaces / Clovion AI / Visibility
          </div>
          <div style={{ width: 24 }} />
        </div>

        <div style={{ display: 'flex' }}>
          {/* Sidebar */}
          <aside
            className="hidden md:block"
            style={{ width: 176, background: 'var(--subtle)', borderRight: '1px solid var(--line)', padding: 12 }}
          >
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                background: 'var(--white)',
                border: '1px solid var(--line)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--ink)'
              }}
            >
              <span>Clovion AI</span>
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden style={{ color: 'var(--ink-50)' }}>
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <nav style={{ marginTop: 16, display: 'grid', gap: 2 }}>
              {['Dashboard', 'Visibility', 'Discovery', 'Agents', 'Insights'].map((l) => {
                const active = l === 'Visibility'
                return (
                  <div
                    key={l}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '6px 8px',
                      borderRadius: 6,
                      fontSize: '0.84rem',
                      background: active ? 'var(--ink-04)' : 'transparent',
                      fontWeight: active ? 600 : 400,
                      color: active ? 'var(--ink)' : 'var(--ink-70)'
                    }}
                  >
                    <span style={{ height: 6, width: 6, borderRadius: 999, background: active ? 'var(--ink)' : 'transparent' }} />
                    {l}
                  </div>
                )
              })}
            </nav>
          </aside>

          {/* Main */}
          <main style={{ flex: 1, padding: 28, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: 'var(--ink-50)' }}>
              VISIBILITY
            </div>

            <div style={{ marginTop: 12, display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--ink)'
                  }}
                >
                  {metric.toFixed(1)}%
                </div>
                <div style={{ marginTop: 6, fontSize: '0.84rem', color: 'var(--ink-60)' }}>
                  Share of voice · last 30 days
                </div>
              </div>
              <span
                style={{
                  marginBottom: 4,
                  opacity: on ? 1 : 0,
                  transition: 'opacity 0.5s ease 0.8s',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: 'var(--positive-bg)',
                  border: '1px solid var(--positive-border)',
                  color: 'var(--positive)',
                  fontSize: '0.74rem',
                  fontWeight: 600
                }}
              >
                ↑ 6.2 pts
              </span>
            </div>

            {/* Bar chart */}
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'flex-end', gap: 6, height: 96 }}>
              {CHART.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    borderRadius: 2,
                    background: i === CHART.length - 1 ? 'var(--ink)' : 'var(--ink-60)',
                    height: on ? `${h}%` : '0%',
                    transition: `height 1.2s var(--ease-out-expo) ${i * 80}ms`
                  }}
                />
              ))}
            </div>

            {/* Engine breakdown */}
            <div style={{ marginTop: 28, display: 'grid', gap: 8 }}>
              {BENTO_ENGINES.map((e, i) => (
                <div
                  key={e.name}
                  className="grid grid-cols-[5.5rem_1fr_auto] sm:grid-cols-[8.5rem_1fr_auto] gap-3 items-center"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? 'none' : 'translateY(6px)',
                    transition: `all 0.5s ease ${1200 + i * 100}ms`
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--ink)' }}>{e.name}</span>
                  <span style={{ height: 6, borderRadius: 999, background: 'var(--ink-06)', overflow: 'hidden' }}>
                    <span
                      style={{
                        display: 'block',
                        height: '100%',
                        borderRadius: 999,
                        background: e.peak ? 'var(--ink)' : 'var(--ink-40)',
                        width: on ? `${e.score}%` : '0%',
                        transition: `width 0.9s var(--ease-out-expo) ${1400 + i * 100}ms`
                      }}
                    />
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontVariantNumeric: 'tabular-nums',
                      color: 'var(--ink-70)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{e.score}%</span>
                    <span style={{ color: 'var(--ink)', fontWeight: 600, marginLeft: 8 }}>{e.change}</span>
                  </span>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

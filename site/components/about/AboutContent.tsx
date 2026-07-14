'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { Button, Container, ArrowRight, HaloMark } from '@/components/ui'

// Homepage palette — the source of truth for the light brand book.
const ORANGE = '#C2410C'
const EMERALD = '#047857'
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/* ---------------------------------------------------------------------------
 * Motion primitives
 * ------------------------------------------------------------------------- */
function useReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setR(m.matches)
    const on = () => setR(m.matches)
    m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [])
  return r
}

// Reveals children when scrolled into view (once). Robust by design: anything
// already in/near the viewport at mount reveals immediately (so the hero and
// any above-the-fold content is never invisible), below-the-fold content
// reveals on scroll via IntersectionObserver, and a safety timer guarantees
// content is never left permanently hidden if IO misbehaves.
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const vh = window.innerHeight || 0
    if (el.getBoundingClientRect().top < vh * 0.95) {
      setShown(true)
      return
    }
    if (!('IntersectionObserver' in window)) {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    )
    io.observe(el)
    const safety = window.setTimeout(() => setShown(true), 2200)
    return () => {
      io.disconnect()
      window.clearTimeout(safety)
    }
  }, [])
  return { ref, shown }
}

// A section wrapper that fades/rises its content in on scroll.
function Reveal({
  children,
  delay = 0,
  as: As = 'div',
  className,
  style
}: {
  children: ReactNode
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
  className?: string
  style?: CSSProperties
}) {
  const reduced = useReducedMotion()
  const { ref, shown } = useReveal<HTMLDivElement>()
  const on = reduced || shown
  return (
    <As
      ref={ref as never}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(22px)',
        transition: reduced ? 'none' : `opacity 0.7s ${EASE} ${delay}ms, transform 0.7s ${EASE} ${delay}ms`,
        ...style
      }}
    >
      {children}
    </As>
  )
}

function Eyebrow({ children, color = ORANGE }: { children: ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        color
      }}
    >
      <span aria-hidden style={{ height: 6, width: 6, borderRadius: 999, background: color }} />
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------------------
 * Data
 * ------------------------------------------------------------------------- */
const CAPABILITIES = [
  {
    name: 'AI visibility tracking',
    desc: 'See where you appear across ChatGPT, Gemini, Claude, Perplexity, and AI Overviews.',
    href: '/features/ai-visibility-tracking'
  },
  {
    name: 'Brand perception',
    desc: 'Understand how AI engines describe your brand — not just whether they mention it.',
    href: '/features/brand-perception'
  },
  {
    name: 'Competitor monitoring',
    desc: 'Track which competitors surface instead of you, and where your share of voice moves.',
    href: '/compare'
  },
  {
    name: 'Prompt-level insights',
    desc: 'See which real buyer prompts trigger mentions, and how a single query fans out.',
    href: '/features/fanout-query'
  },
  {
    name: 'GEO recommendations',
    desc: 'Get prioritized, specific fixes to improve how AI engines read and cite you.',
    href: '/features/geo-improvement-suggestions'
  },
  {
    name: 'Brand audits',
    desc: 'A full read on your AI presence, scored and turned into a clear action list.',
    href: '/features/brand-audit'
  }
] as const

const LOOP = [
  { k: 'Measure', line: 'Measure where you stand.' },
  { k: 'Find', line: 'Find what is missing.' },
  { k: 'Implement', line: 'Implement the recommendation.' },
  { k: 'Monitor', line: 'Monitor whether it worked.' }
] as const

function LoopIcon({ i }: { i: number }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true
  }
  if (i === 0)
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    )
  if (i === 1)
    return (
      <svg {...common}>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M20 20l-4.7-4.7" />
      </svg>
    )
  if (i === 2)
    return (
      <svg {...common}>
        <path d="M4 20l5-5" />
        <path d="M14.5 4.5a3.5 3.5 0 004.8 4.8l-2.3-2.3 1.4-1.4-3.9-1.1z" />
        <path d="M9 15l6-6 .5.5" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M3 17l5-5 3.5 3.5L21 6" />
      <path d="M21 6v5M21 6h-5" />
    </svg>
  )
}

/* ---------------------------------------------------------------------------
 * The loop — a continuously cycling four-step diagram (the signature moment).
 * ------------------------------------------------------------------------- */
function LoopDiagram() {
  const reduced = useReducedMotion()
  const { ref, shown } = useReveal<HTMLDivElement>()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (reduced || !shown) return
    const id = setInterval(() => setActive((a) => (a + 1) % LOOP.length), 1500)
    return () => clearInterval(id)
  }, [reduced, shown])

  return (
    <div ref={ref}>
      {/* Desktop / tablet: horizontal rail */}
      <div className="clv-loop-row">
        {LOOP.map((step, i) => {
          // Cycles while visible; under reduced motion `active` stays 0, so a
          // single step reads as highlighted rather than all four at once.
          const isActive = i === active
          const isLast = i === LOOP.length - 1
          const accent = isLast ? EMERALD : ORANGE
          return (
            <div key={step.k} className="clv-loop-cell">
              <div
                className="clv-loop-node"
                style={{
                  borderColor: isActive ? accent : 'var(--line)',
                  boxShadow: isActive ? `0 12px 30px -14px ${accent}55` : '0 1px 2px rgba(10,10,15,0.04)',
                  transform: isActive && !reduced ? 'translateY(-4px)' : 'none',
                  transition: `all 0.5s ${EASE}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.14em',
                      color: isActive ? accent : 'var(--ink-40)',
                      transition: `color 0.5s ${EASE}`
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      height: 8,
                      width: 8,
                      borderRadius: 999,
                      background: isActive ? accent : 'var(--line)',
                      transition: `background 0.5s ${EASE}`
                    }}
                  />
                </div>
                <span
                  aria-hidden
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 44,
                    width: 44,
                    marginTop: 22,
                    borderRadius: 12,
                    color: isActive ? accent : 'var(--ink-40)',
                    background: isActive ? `${accent}12` : 'var(--subtle)',
                    transition: `all 0.5s ${EASE}`
                  }}
                >
                  <LoopIcon i={i} />
                </span>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    marginTop: 18,
                    color: 'var(--ink)'
                  }}
                >
                  {step.k}
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--ink-60)' }}>{step.line}</p>
              </div>
              {!isLast && (
                <span aria-hidden className="clv-loop-arrow" style={{ color: 'var(--ink-25)' }}>
                  <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
                    <path d="M0 6h23m0 0l-5-4.5M23 6l-5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Loop-back cue */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          marginTop: 26,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--ink-50)'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={EMERALD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12a9 9 0 1 1-2.64-6.36" />
          <path d="M21 3v5h-5" />
        </svg>
        Then it runs again — continuously
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */
export function AboutContent() {
  return (
    <>
      {/* Section 1 — Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
        <Container>
          <div className="section-y-xl">
            <div style={{ maxWidth: 940 }}>
              <Reveal delay={0}>
                <Eyebrow>About Clovion</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="display-xl text-balance" style={{ marginTop: 26 }}>
                  Clovion turns AI visibility into <span style={{ color: ORANGE }}>action</span>.
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="lead text-balance" style={{ marginTop: 28, maxWidth: '58ch', color: 'var(--ink-70)' }}>
                  Clovion helps brands understand how AI engines mention, cite, compare, and position them — then shows
                  what to improve.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div style={{ marginTop: 40, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
                  <Button href="https://app.clovion.ai/signup" variant="primary" size="lg" trackLocation="about_hero">
                    Start Free Trial <ArrowRight />
                  </Button>
                  <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="about_hero">
                    Get Free Score
                  </Button>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 2 — Platform capabilities */}
      <section className="section-y" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <Container>
          <Reveal>
            <div style={{ maxWidth: '62ch' }}>
              <Eyebrow>Our platform</Eyebrow>
              <h2 className="display-md text-balance" style={{ marginTop: 20 }}>
                One workflow. Everything that shapes how AI sees you.
              </h2>
              <p className="lead" style={{ marginTop: 20, color: 'var(--ink-70)' }}>
                The platform brings AI visibility tracking, brand perception, competitor monitoring, prompt-level
                insights, GEO recommendations, and brand audits together in one place.
              </p>
            </div>
          </Reveal>

          <div className="clv-cap-grid" style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)' }}>
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.name} delay={(i % 3) * 70} as="div">
                <Link href={c.href} className="clv-cap-card group" data-track-location="about_platform">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        letterSpacing: '0.14em',
                        color: ORANGE
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="clv-cap-arrow" aria-hidden style={{ color: 'var(--ink-40)' }}>
                      <ArrowRight />
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.22rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      marginTop: 22,
                      color: 'var(--ink)'
                    }}
                  >
                    {c.name}
                  </h3>
                  <p style={{ margin: '10px 0 0', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--ink-60)' }}>{c.desc}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Section 3 — The loop */}
      <section className="section-y" style={{ background: 'var(--subtle)' }}>
        <Container>
          <Reveal>
            <div style={{ maxWidth: '58ch' }}>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="display-md text-balance" style={{ marginTop: 20 }}>
                The loop is simple.
              </h2>
              <p className="lead" style={{ marginTop: 20, color: 'var(--ink-70)' }}>
                Four steps, run on repeat. Every pass sharpens how accurately AI engines understand and describe your
                brand.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120} style={{ marginTop: 'clamp(2.5rem, 5vw, 3.75rem)' }}>
            <LoopDiagram />
          </Reveal>
        </Container>
      </section>

      {/* Section 4 — Value statement */}
      <section className="section-y-xl" style={{ background: 'var(--white)', borderTop: '1px solid var(--line)' }}>
        <Container>
          <Reveal>
            <figure style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
              <span aria-hidden style={{ display: 'inline-flex', color: ORANGE }}>
                <HaloMark size={30} />
              </span>
              <blockquote
                className="text-balance"
                style={{
                  marginTop: 26,
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.45rem, 1rem + 1.5vw, 2.2rem)',
                  fontWeight: 600,
                  lineHeight: 1.32,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)'
                }}
              >
                Clovion helps teams see not just whether they appear in AI answers, but whether AI understands them
                accurately — and whether their content supports the way they want to be{' '}
                <span style={{ color: ORANGE }}>known</span>.
              </blockquote>
            </figure>
          </Reveal>
        </Container>
      </section>

      {/* Section 5 — Founders */}
      <section className="section-y" style={{ background: 'var(--subtle)' }}>
        <Container>
          <div className="clv-founders-grid">
            <Reveal className="clv-founders-aside">
              <Eyebrow>Our founders</Eyebrow>
              <h2 className="display-md text-balance" style={{ marginTop: 20 }}>
                Built by people working through the same shift.
              </h2>
              <p style={{ margin: '24px 0 0', fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--ink-80)', maxWidth: '42ch' }}>
                Clovion was created by founders working across AI search, product marketing, SEO, content strategy, and
                software.
              </p>
            </Reveal>
            <Reveal delay={120} className="clv-founders-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: '58ch' }}>
                <p style={{ margin: 0, fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--ink-70)' }}>
                  We started with a simple belief: AI engines are becoming part of how buyers form opinions before they
                  reach a website.
                </p>
                <p style={{ margin: 0, fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--ink-70)' }}>
                  Brands need a clearer way to understand that layer of visibility, correct what is wrong, and measure
                  whether their changes are working.
                </p>
                <p style={{ margin: 0, fontSize: '1.02rem', lineHeight: 1.7, color: 'var(--ink-70)' }}>
                  So we built Clovion as a practical system for the new search layer.
                </p>
              </div>

              <div className="clv-notjust">
                <p className="clv-notjust-neg">Not just another dashboard.</p>
                <p className="clv-notjust-neg">Not just another score.</p>
                <p className="clv-notjust-pos">
                  A way to see how AI understands your brand — <span style={{ color: ORANGE }}>and what to do next.</span>
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Section 6 — Final CTA */}
      <section className="section-y">
        <Container>
          <Reveal>
            <div className="clv-about-cta clv-dark">
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.5,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />
              <div style={{ position: 'relative' }}>
                <Eyebrow color="#F97316">Get started</Eyebrow>
                <h2 className="display-lg text-balance" style={{ marginTop: 22, color: 'var(--on-ink)', maxWidth: '18ch' }}>
                  See how AI understands your brand.
                </h2>
                <p style={{ marginTop: 20, fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--on-ink-60)', maxWidth: '52ch' }}>
                  Not just another dashboard. Not just another score. A practical system for the new search layer — and a
                  clear next step.
                </p>
                <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <Button href="https://app.clovion.ai/signup" variant="invert" size="lg" trackLocation="about_final_cta">
                    Start Free Trial <ArrowRight />
                  </Button>
                  <Button
                    href="/free-ai-visibility-score"
                    variant="ghost"
                    size="lg"
                    trackLocation="about_final_cta"
                    style={{ background: 'transparent', color: 'var(--on-ink)', border: '1px solid var(--on-ink-15)' }}
                  >
                    Get Free Score
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  )
}

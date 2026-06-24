'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react'
import Link from 'next/link'
import { Container, ArrowRight } from '@/components/ui'
import { MockVisibility } from './mocks/MockVisibility'
import { MockPerception } from './mocks/MockPerception'
import { MockRankings } from './mocks/MockRankings'
import { MockRecommendations } from './mocks/MockRecommendations'

const STEP_VH = 60

// ── glyph paths ───────────────────────────────────────────────────────
const G = {
  track: <path d="M12 4a8 8 0 100 16 8 8 0 000-16zm0 4a4 4 0 100 8 4 4 0 000-8zm0 3a1 1 0 100 2 1 1 0 000-2z" />,
  bulb: <path d="M9 18h6v1.5a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 19.5V18zm3-15a6 6 0 00-3.6 10.8c.4.3.6.7.6 1.2v.5h6v-.5c0-.5.2-.9.6-1.2A6 6 0 0012 3z" />,
  face: <path d="M12 3a9 9 0 100 18 9 9 0 000-18zM8.5 10a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zm7 0a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4zM8 15.5h8a4 4 0 01-8 0z" />,
  bars: <path d="M4 20V10h4v10H4zm6 0V4h4v16h-4zm6 0v-7h4v7h-4z" />
}

function Glyph({ d, color }: { d: ReactElement; color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={color} stroke="none" aria-hidden>
      {d}
    </svg>
  )
}

// ── PILLARS data ────────────────────────────────────────────────────
type Pillar = {
  sku: string
  name: string
  short: string
  headline: string
  body: string
  link: string
  tint: string
  fg: string
  glyph: ReactElement
  Mock: (props: { show: boolean }) => ReactElement
  mockAspect?: string
}

const PILLARS: Pillar[] = [
  {
    sku: '01 — Visibility',
    name: 'AI Visibility Tracking',
    short: 'See where, when, and how often AI recommends you.',
    headline: 'See where, when, and how often AI recommends you',
    body: 'Understand where, when, and how often AI recommends your brand across prompts, topics, engines, and audiences.',
    link: 'Explore AI Visibility Tracking',
    tint: '#ecfdf5',
    fg: '#047857',
    glyph: G.track,
    Mock: MockVisibility,
    mockAspect: '1864 / 1075'
  },
  {
    sku: '02 — Perception',
    name: 'Brand Perception',
    short: 'Understand how AI perceives your brand.',
    headline: 'Understand how AI perceives your brand',
    body: 'Understand how AI perceives your brand across audiences, industries, and use cases — and uncover the drivers shaping that perception.',
    link: 'Explore Brand Perception',
    tint: '#ecfdf5',
    fg: '#047857',
    glyph: G.face,
    Mock: MockPerception,
    mockAspect: '1834 / 961'
  },
  {
    sku: '03 — Competitive',
    name: 'Competitive Positioning',
    short: 'See where competitors outperform you.',
    headline: 'See where competitors outperform you',
    body: 'Benchmark against competitors and see where they outperform you across topics, prompts, and AI engines.',
    link: 'Explore Competitive Positioning',
    tint: '#ecfdf5',
    fg: '#047857',
    glyph: G.bars,
    Mock: MockRankings,
    mockAspect: '1920 / 1280'
  },
  {
    sku: '04 — Recommendations',
    name: 'AEO/GEO Recommendations',
    short: 'Get a prioritized plan to get recommended more.',
    headline: 'Get prioritized recommendations that move visibility',
    body: 'Get prioritized recommendations to improve your visibility and increase how often AI recommends your brand.',
    link: 'Explore AEO/GEO Recommendations',
    tint: '#ecfdf5',
    fg: '#047857',
    glyph: G.bulb,
    Mock: MockRecommendations,
    mockAspect: '1876 / 1192'
  }
]

function PillarItem({
  s,
  i,
  active,
  prog,
  onClick
}: {
  s: Pillar
  i: number
  active: number
  prog: number
  onClick: () => void
}) {
  const isActive = i === active
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: 'none',
        border: 'none',
        borderTop: i === 0 ? 'none' : '1px solid var(--line)',
        padding: '16px 0',
        cursor: 'pointer',
        font: 'inherit',
        color: 'inherit'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, opacity: isActive ? 1 : 0.45, transition: 'opacity 0.35s ease' }}>
        <span style={{ height: 34, width: 34, flexShrink: 0, borderRadius: 9, background: s.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Glyph d={s.glyph} color={s.fg} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--ink-40)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {s.sku.split(' — ')[0]}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.12rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
              {s.name}
            </span>
          </span>
          <span
            style={{
              display: 'grid',
              gridTemplateRows: isActive ? '1fr' : '0fr',
              transition: 'grid-template-rows 0.4s var(--ease-out-expo)'
            }}
          >
            <span style={{ overflow: 'hidden' }}>
              <span style={{ display: 'block', marginTop: 8, fontSize: '0.9rem', fontWeight: 400, lineHeight: 1.5, color: 'var(--ink-70)' }}>
                {s.short}
              </span>
            </span>
          </span>
        </span>
      </div>
      <span
        style={{
          display: 'block',
          marginTop: 14,
          height: 2,
          borderRadius: 999,
          background: 'var(--ink-10)',
          overflow: 'hidden',
          opacity: isActive ? 1 : 0
        }}
      >
        <span style={{ display: 'block', height: '100%', width: `${(isActive ? prog : 0) * 100}%`, background: 'var(--ink)' }} />
      </span>
    </button>
  )
}

function MockPanel({ s, show }: { s: Pillar; show: boolean }) {
  const Mock = s.Mock
  const isFullBleed = !!s.mockAspect
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: show ? 1 : 0,
        transform: show ? 'none' : 'translateY(14px) scale(0.985)',
        transition: 'opacity 0.5s ease, transform 0.55s var(--ease-out-expo)',
        pointerEvents: show ? 'auto' : 'none',
        ...(isFullBleed ? { display: 'flex', alignItems: 'flex-start', justifyContent: 'center' } : {})
      }}
    >
      <div
        style={{
          ...(isFullBleed && s.mockAspect
            ? { width: '100%', aspectRatio: s.mockAspect, maxHeight: '100%' }
            : { height: '100%' }),
          borderRadius: 22,
          border: '1px solid var(--line)',
          background: 'var(--white)',
          boxShadow: 'var(--shadow-card)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {isFullBleed ? (
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <Mock show={show} />
          </div>
        ) : (
          <>
            <div style={{ padding: '26px 28px 18px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 2.2vw, 2rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.08,
                  margin: 0,
                  textWrap: 'balance',
                  color: 'var(--ink)'
                }}
              >
                {s.headline}
              </h3>
              <p style={{ margin: '12px 0 0', fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.55, color: 'var(--ink-70)', maxWidth: 560 }}>
                {s.body}
              </p>
              <Link
                href="/features"
                className="mt-4 inline-flex items-center gap-1.5"
                style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)', textDecoration: 'none' }}
              >
                {s.link} <ArrowRight />
              </Link>
            </div>
            <div
              style={{
                flex: 1,
                minHeight: 0,
                margin: '0 18px 18px',
                borderRadius: 14,
                border: '1px solid var(--line)',
                background: 'var(--subtle)',
                padding: 16,
                overflow: 'hidden'
              }}
            >
              <Mock show={show} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function PillarStepper() {
  const pinRef = useRef<HTMLDivElement>(null)
  const idxRef = useRef(0)
  const [active, setActive] = useState(0)
  const [prog, setProg] = useState(1)
  const [narrow, setNarrow] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1000px)')
    const onMq = () => setNarrow(mq.matches)
    onMq()
    mq.addEventListener('change', onMq)
    return () => mq.removeEventListener('change', onMq)
  }, [])

  useEffect(() => {
    idxRef.current = active
  }, [active])

  useEffect(() => {
    if (narrow) return
    const el = pinRef.current
    if (!el) return

    // Scroll-driven pillar progression. No wheel hijack. Native scroll feels
    // natural for trackpad momentum, mouse wheel, and keyboard PageDown.
    // Active idx is derived from how far the pin parent has scrolled past
    // the viewport top: progress 0 → 1 across the engagement window
    // (parent height - 100vh). Each pillar occupies an equal slice of that.
    const N = PILLARS.length
    let rafPending = false
    let lastProg = -1

    const compute = () => {
      rafPending = false
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight

      // Pin fully above viewport → last pillar
      if (r.bottom <= 0) {
        const last = N - 1
        if (idxRef.current !== last) {
          idxRef.current = last
          setActive(last)
        }
        if (lastProg !== 1) {
          lastProg = 1
          setProg(1)
        }
        return
      }
      // Pin fully below viewport → first pillar
      if (r.top >= vh) {
        if (idxRef.current !== 0) {
          idxRef.current = 0
          setActive(0)
        }
        if (lastProg !== 0) {
          lastProg = 0
          setProg(0)
        }
        return
      }

      // Engagement zone: pin top has crossed viewport top, pin bottom not yet exited.
      const travel = el.offsetHeight - vh
      if (travel <= 0) {
        // Pin shorter than viewport — shouldn't happen with STEP_VH > 100/N.
        if (lastProg !== 1) {
          lastProg = 1
          setProg(1)
        }
        return
      }
      const scrolled = Math.max(0, -r.top)
      const progress = Math.min(1, scrolled / travel)
      const raw = progress * N
      const idx = Math.min(N - 1, Math.floor(raw))
      const within = Math.min(1, Math.max(0, raw - idx))
      if (idx !== idxRef.current) {
        idxRef.current = idx
        setActive(idx)
      }
      // Throttle prog updates to ~1% deltas to avoid render thrash
      if (Math.abs(within - lastProg) > 0.01) {
        lastProg = within
        setProg(within)
      }
    }

    const schedule = () => {
      if (rafPending) return
      rafPending = true
      requestAnimationFrame(compute)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [narrow])

  const goto = (i: number) => {
    const el = pinRef.current
    if (!el) return
    const vh = window.innerHeight
    const travel = el.offsetHeight - vh
    if (travel <= 0) return
    const pinAbsTop = window.scrollY + el.getBoundingClientRect().top
    const targetProgress = (i + 0.5) / PILLARS.length
    const targetScrollY = pinAbsTop + travel * targetProgress
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
  }

  const Heading = (
    <div style={{ maxWidth: 880, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', marginBottom: narrow ? 56 : 'clamp(40px, 5vh, 72px)' }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--display-md)',
          fontWeight: 600,
          letterSpacing: 'var(--track-display-md)',
          lineHeight: 1.2,
          margin: 0,
          textWrap: 'balance',
          color: 'var(--ink)'
        }}
      >
        Everything you need to understand and improve AI visibility.
      </h2>
      <p
        style={{
          fontSize: '1.075rem',
          lineHeight: 1.5,
          color: 'var(--ink-70)',
          marginTop: 16,
          marginLeft: 'auto',
          marginRight: 'auto',
          maxWidth: 1020,
          textWrap: 'balance'
        }}
      >
        Millions of buying decisions now start with AI. Most brands don&rsquo;t know how they&rsquo;re represented — or whether AI recommends them at all. Clovion helps you earn more.
      </p>
    </div>
  )

  if (narrow) {
    return (
      <section style={{ padding: 'var(--section) 0' }}>
        <Container>
          {Heading}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {PILLARS.map((s) => (
              <div key={s.sku}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ height: 34, width: 34, borderRadius: 9, background: s.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Glyph d={s.glyph} color={s.fg} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
                    {s.name}
                  </span>
                </div>
                <div style={{ position: 'relative', aspectRatio: s.mockAspect ?? '4 / 3' }}>
                  <MockPanel s={s} show={true} />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section style={{ position: 'relative' }}>
      <div ref={pinRef} style={{ position: 'relative', height: `${PILLARS.length * STEP_VH}vh` }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: 'clamp(64px, 11vh, 110px)',
            overflow: 'hidden'
          }}
        >
          <Container>
            {Heading}
            <div
              style={
                {
                  display: 'grid',
                  // Right column widened (Option A) so the visibility-insights
                  // slideshow has more room. Pillars list keeps a comfortable
                  // minimum of 220px to stay readable.
                  gridTemplateColumns: 'minmax(220px, 0.32fr) 1.68fr',
                  gap: 44,
                  alignItems: 'center'
                } as CSSProperties
              }
            >
              <div>
                {PILLARS.map((s, i) => (
                  <PillarItem key={s.sku} s={s} i={i} active={active} prog={prog} onClick={() => goto(i)} />
                ))}
              </div>
              {/* The slot tracks the ACTIVE pillar's image aspect ratio (same
                  approach as the mobile branch) so each dashboard fills the
                  frame edge-to-edge — no dark letterbox/gap — and stays fully
                  visible (object-fit: contain on an aspect-matched box, so no
                  crop). maxHeight keeps the slot inside the 100vh pin on short
                  viewports; if it caps there, the image letterboxes against the
                  white card surface, which is seamless (no black). */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: PILLARS[active].mockAspect,
                  maxHeight: 'calc(100vh - 300px)',
                  margin: '0 auto'
                }}
              >
                {PILLARS.map((s, i) => (
                  <MockPanel key={s.sku} s={s} show={i === active} />
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  )
}

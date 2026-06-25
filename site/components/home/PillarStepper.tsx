'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react'
import Link from 'next/link'
import { Container, ArrowRight } from '@/components/ui'
import { MockVisibility } from './mocks/MockVisibility'
import { MockPerception } from './mocks/MockPerception'
import { MockRankings } from './mocks/MockRankings'
import { MockRecommendations } from './mocks/MockRecommendations'

const STEP_VH = 60

// Single shared frame aspect for ALL four pillar mocks. Previously each pillar
// carried its own ratio (1.5 / 1.9 / 1.5 / 1.57), so the slot resized as you
// scrolled between pillars — the frame visibly jumped/misaligned. One uniform
// ratio keeps the frame box identical for every pillar; the cqw-fluid mocks
// reflow to fill it.
const FRAME_ASPECT = '16 / 10'

// ── glyph paths ───────────────────────────────────────────────────────
// Pillar glyphs — green line/fill icons (rendered on a white chip). Use
// currentColor so the chip's `color` (s.fg) drives them.
const G = {
  // 01 AI Visibility Tracking — bar chart
  track: (
    <g fill="currentColor" stroke="none">
      <rect x="4.4" y="13" width="3" height="6.6" rx="1.5" />
      <rect x="10.5" y="5.4" width="3" height="14.2" rx="1.5" />
      <rect x="16.6" y="9.4" width="3" height="10.2" rx="1.5" />
    </g>
  ),
  // 04 AEO/GEO Recommendations — AI chip with refresh arrows
  bulb: (
    <g>
      <path d="M4.7 10.3A7.6 7.6 0 0 1 17.8 6.7" />
      <path d="M17.9 6.7l.1-2.6 2.3 1.2" />
      <path d="M19.3 13.7A7.6 7.6 0 0 1 6.2 17.3" />
      <path d="M6.1 17.3l-.1 2.6-2.3-1.2" />
      <rect x="8.7" y="8.7" width="6.6" height="6.6" rx="1.4" strokeWidth="1.5" />
      <path
        d="M10.1 6.9v1.8M13.9 6.9v1.8M10.1 15.3v1.8M13.9 15.3v1.8M6.9 10.1h1.8M6.9 13.9h1.8M15.3 10.1h1.8M15.3 13.9h1.8"
        strokeWidth="1.3"
      />
      <text x="12" y="13.5" textAnchor="middle" fontSize="3.9" fontWeight="700" fill="currentColor" stroke="none" style={{ fontFamily: 'var(--font-mono)' }}>
        AI
      </text>
    </g>
  ),
  // 02 Brand Perception — orbit / rotate
  face: (
    <g>
      <ellipse cx="12" cy="12.2" rx="8.8" ry="3.6" />
      <path d="M12 3.6C8.6 6.8 8.6 17.6 12 20.8" />
      <path d="M9.3 18.3 12 20.9l2.7-2.6" />
    </g>
  ),
  // 03 Competitive Positioning — star seal / badge
  bars: (
    <>
      <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="4" strokeWidth="1.4" />
      <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="4" strokeWidth="1.4" transform="rotate(45 12 12)" />
      <path
        d="M12 8.4l1.13 2.29 2.53.37-1.83 1.78.43 2.52L12 14.74l-2.26 1.19.43-2.52-1.83-1.78 2.53-.37z"
        fill="currentColor"
        stroke="none"
      />
    </>
  )
}

function Glyph({ d, color }: { d: ReactElement; color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ color, display: 'block' }}
    >
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
    tint: '#ffffff',
    fg: '#047857',
    glyph: G.track,
    Mock: MockVisibility,
    mockAspect: FRAME_ASPECT
  },
  {
    sku: '02 — Perception',
    name: 'Brand Perception',
    short: 'Understand how AI perceives your brand.',
    headline: 'Understand how AI perceives your brand',
    body: 'Understand how AI perceives your brand across audiences, industries, and use cases — and uncover the drivers shaping that perception.',
    link: 'Explore Brand Perception',
    tint: '#ffffff',
    fg: '#047857',
    glyph: G.face,
    Mock: MockPerception,
    mockAspect: FRAME_ASPECT
  },
  {
    sku: '03 — Competitive',
    name: 'Competitive Positioning',
    short: 'See where competitors outperform you.',
    headline: 'See where competitors outperform you',
    body: 'Benchmark against competitors and see where they outperform you across topics, prompts, and AI engines.',
    link: 'Explore Competitive Positioning',
    tint: '#ffffff',
    fg: '#047857',
    glyph: G.bars,
    Mock: MockRankings,
    mockAspect: FRAME_ASPECT
  },
  {
    sku: '04 — Recommendations',
    name: 'AEO/GEO Recommendations',
    short: 'Get a prioritized plan to get recommended more.',
    headline: 'Get prioritized recommendations that move visibility',
    body: 'Get prioritized recommendations to improve your visibility and increase how often AI recommends your brand.',
    link: 'Explore AEO/GEO Recommendations',
    tint: '#ffffff',
    fg: '#047857',
    glyph: G.bulb,
    Mock: MockRecommendations,
    mockAspect: FRAME_ASPECT
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

  // Slot must preserve the active pillar's aspect even when maxHeight clamps it
  // on short viewports. Without a matching maxWidth the box goes wide-and-short
  // and the (cqw-sized) dashboards overflow — the chart crushes to a sliver and
  // tall lists clip. Capping width to (clampedHeight × aspect) keeps it 1.5:1,
  // shrinking + centering instead of distorting.
  const activeAspect = PILLARS[active].mockAspect ?? '4 / 3'
  const [aspW, aspH] = activeAspect.split('/').map((n) => parseFloat(n.trim()))
  const slotMaxWidth = `calc((100vh - 300px) * ${aspW} / ${aspH})`

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
                  // Stretch so the pillar list matches the mock frame's height —
                  // the 4 natural-height pillars distribute evenly via
                  // space-between (font sizes stay as-is; only the gaps grow).
                  alignItems: 'stretch'
                } as CSSProperties
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
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
                  maxWidth: slotMaxWidth,
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

'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactElement } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Container, ArrowRight } from '@/components/ui'

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

function StatTile({ value, label, pos }: { value: string; label: string; pos?: boolean }) {
  return (
    <div style={{ flex: 1, minWidth: 0, padding: '10px 12px', borderRadius: 12, background: 'var(--subtle)', border: '1px solid var(--line)' }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: pos ? 'var(--positive)' : 'var(--ink)',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap'
        }}
      >
        {value}
      </div>
      <div style={{ marginTop: 5, fontSize: '0.72rem', color: 'var(--ink-60)', lineHeight: 1.25 }}>{label}</div>
    </div>
  )
}

function OppBulb() {
  return (
    <span
      style={{
        height: 22,
        width: 22,
        flexShrink: 0,
        borderRadius: 7,
        background: 'var(--positive-bg)',
        border: '1px solid var(--positive-border)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--positive)'
      }}
    >
      <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
        <path d="M9 18h6v1.3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 19.3V18zm3-15a6 6 0 00-3.6 10.8c.4.3.6.7.6 1.2v.5h6v-.5c0-.5.2-.9.6-1.2A6 6 0 0012 3z" />
      </svg>
    </span>
  )
}

function MiniCheck({ size = 18 }: { size?: number }) {
  return (
    <span
      style={{
        height: size,
        width: size,
        flexShrink: 0,
        borderRadius: 999,
        background: 'var(--positive)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <svg viewBox="0 0 12 12" width={size * 0.5} height={size * 0.5} aria-hidden>
        <path d="M2 6l3 3 5-6" stroke="#04261b" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

// ── Mock 01 · AI Visibility Insights — animated 4-frame slideshow ──
//
// Auto-cycles through 4 hi-res Figma exports (1880×1075 PNGs, ~1.75:1
// — tightly cropped to the dashboard card so content reads larger).
// Container locks to the same aspect ratio so the full picture is always
// visible — no cropping. Full cycle ~3.2s (800ms per frame).
// Source images at /public/home/visibility-frame-{1..4}-*.png.

const VIS_FRAMES = [
  { id: 'engine', src: '/home/visibility-frame-1-engine.png', alt: 'AI Visibility Insights — By AI Engine' },
  { id: 'audience', src: '/home/visibility-frame-2-audience.png', alt: 'AI Visibility Insights — By Audience' },
  { id: 'intent', src: '/home/visibility-frame-3-intent.png', alt: 'AI Visibility Insights — By Intent' },
  { id: 'topic', src: '/home/visibility-frame-4-topic.png', alt: 'AI Visibility Insights — By Topic' }
]

const VIS_HOLD_MS = 800
const VIS_FADE = '0.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
const VIS_BLUR = '0.4s cubic-bezier(0.4, 0.0, 0.2, 1)'

function MockVisibility() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [reduce, setReduce] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reduce || hover) return
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % VIS_FRAMES.length), VIS_HOLD_MS)
    return () => clearInterval(id)
  }, [reduce, hover])

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        // Full-bleed inside the parent card — no padding, no negative
        // margin tricks; the parent in MockPanel renders us in a clean
        // edge-to-edge slot when isFullBleed is true.
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          aspectRatio: '1864 / 1075',
          maxHeight: '100%',
          background: '#ffffff',
          overflow: 'hidden'
        }}
      >
        {VIS_FRAMES.map((f, i) => {
          const on = i === activeIdx
          return (
            <Image
              key={f.id}
              src={f.src}
              alt={f.alt}
              width={1864}
              height={1075}
              priority={i === 0}
              loading={i === 0 ? 'eager' : 'lazy'}
              quality={95}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
              placeholder="empty"
              unoptimized
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                // Source aspect (1.5) matches container aspect — `contain`
                // shows the full picture with zero crop and zero letterbox.
                objectFit: 'contain',
                objectPosition: 'center',
                opacity: on ? 1 : 0,
                transform: reduce ? 'none' : on ? 'scale(1)' : 'scale(1.006)',
                filter: reduce ? 'none' : on ? 'blur(0px)' : 'blur(2px)',
                transition: reduce
                  ? 'none'
                  : `opacity ${VIS_FADE}, transform ${VIS_FADE}, filter ${VIS_BLUR}`,
                willChange: 'opacity, transform'
              }}
            />
          )
        })}
      </div>
    </div>
  )
}


// ── Mock 02 · Brand Perception — typing + sequential highlighting ──
//
// Two-phase reveal over the design-spec PNG.
//
//   Phase 1 — Typing. Every text section types in. The image is
//     fully covered by 6 horizontal white strips matching the
//     content rows (header → prompt + insights header → response +
//     drivers → monday + drivers tail → pipedrive + gaps1 → salesforce
//     + gaps2). Each strip scaleX-wipes left→right with `linear`
//     easing at constant velocity, staggered top→bottom — reads as
//     someone typing line by line. As wipes complete, the grayscale
//     image is exposed beneath.
//   Phase 2 — Highlights light up sequentially. A second image layer
//     (full color, identical position) sits above the grayscale base
//     with a clip-path that initially hides it. The clip-path's
//     bottom inset decreases in 6 discrete steps — each step uncovers
//     one strip's worth of color, making the highlighted text pills
//     "light up" section by section in reading order.
//
// Honors prefers-reduced-motion by jumping to the final state.

const BP_STRIPS = [
  // Horizontal rows that together cover the entire image (top + height in %).
  { top: 0,  height: 10 },  // Brand Perception header + subtitle
  { top: 10, height: 15 },  // Prompt input  |  AI VISIBILITY INSIGHTS header
  { top: 25, height: 19 },  // Response area |  TOP PERCEPTION DRIVERS
  { top: 44, height: 18 },  // Monday card   |  drivers tail / gaps top
  { top: 62, height: 15 },  // Pipedrive     |  PERCEPTION GAPS (vs leaders) 1
  { top: 77, height: 23 }   // Salesforce    |  PERCEPTION GAPS (vs leaders) 2
]

// Bottom-inset % per colorStage (-1 → 5). Each step uncovers one strip
// of the color layer from the top, so highlights light up top→down.
const BP_COLOR_INSETS = [100, 90, 75, 56, 38, 23, 0]

const BP_TYPING_MS = 700
const BP_TYPING_STAGGER_MS = 220
const BP_PHASE_GAP_MS = 320
const BP_COLOR_MS = 360
const BP_COLOR_STAGGER_MS = 240
const BP_COLOR_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

function MockPerception({ show = true }: { show?: boolean } = {}) {
  const [typingStage, setTypingStage] = useState(-1)
  const [colorStage, setColorStage] = useState(-1)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    }
  }, [])

  useEffect(() => {
    if (!show) {
      setTypingStage(-1)
      setColorStage(-1)
      return
    }
    if (reduce) {
      setTypingStage(BP_STRIPS.length - 1)
      setColorStage(BP_STRIPS.length - 1)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    // Phase 1 — typing wipes, staggered top→bottom.
    const phase1Start = 200
    for (let i = 0; i < BP_STRIPS.length; i++) {
      timers.push(setTimeout(() => setTypingStage(i), phase1Start + i * BP_TYPING_STAGGER_MS))
    }
    // Phase 2 — color strips light up sequentially after a brief gap.
    const phase1End = phase1Start + (BP_STRIPS.length - 1) * BP_TYPING_STAGGER_MS + BP_TYPING_MS
    const phase2Start = phase1End + BP_PHASE_GAP_MS
    for (let i = 0; i < BP_STRIPS.length; i++) {
      timers.push(setTimeout(() => setColorStage(i), phase2Start + i * BP_COLOR_STAGGER_MS))
    }
    return () => { timers.forEach(clearTimeout) }
  }, [show, reduce])

  const animate = !reduce
  const colorBottomInset = BP_COLOR_INSETS[colorStage + 1]

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Layer A — grayscale base. Always rendered; exposed as the
            phase-1 wipes peel back. */}
        <Image
          src="/home/brand-perception.png"
          alt="Brand Perception — how AI describes your brand across audiences, industries, and use cases"
          width={1834}
          height={961}
          priority={false}
          loading="lazy"
          quality={95}
          sizes="(max-width: 1000px) 100vw, 60vw"
          unoptimized
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            filter: animate ? 'grayscale(100%) saturate(0)' : 'none'
          }}
        />

        {/* Layer B — full-color overlay, clipped from the top so it
            lights up the highlights one strip at a time in phase 2. */}
        {animate && (
          <Image
            src="/home/brand-perception.png"
            alt=""
            aria-hidden
            width={1834}
            height={961}
            priority={false}
            loading="lazy"
            quality={95}
            sizes="(max-width: 1000px) 100vw, 60vw"
            unoptimized
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              clipPath: `inset(0 0 ${colorBottomInset}% 0)`,
              WebkitClipPath: `inset(0 0 ${colorBottomInset}% 0)`,
              transition: `clip-path ${BP_COLOR_MS}ms ${BP_COLOR_EASE}, -webkit-clip-path ${BP_COLOR_MS}ms ${BP_COLOR_EASE}`,
              willChange: 'clip-path',
              backfaceVisibility: 'hidden'
            }}
          />
        )}

        {/* Phase 1 — typing strips. One white overlay per content row,
            each wipes scaleX(1→0) right-anchored at constant velocity. */}
        {animate && BP_STRIPS.map((s, i) => (
          <div
            key={i}
            aria-hidden
            style={{
              position: 'absolute',
              top: `${s.top}%`,
              left: 0,
              width: '100%',
              height: `${s.height}%`,
              background: '#ffffff',
              transformOrigin: 'right center',
              transform: typingStage >= i ? 'scaleX(0)' : 'scaleX(1)',
              transition: `transform ${BP_TYPING_MS}ms linear`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              pointerEvents: 'none'
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ── Mock 03 · Rankings by topic — static image of the design spec ───
function MockRankings() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <Image
        src="/home/visibility-ranking.png"
        alt="Visibility Ranking by Topic — SDS Manager rankings vs Chemical Compliance Software brands"
        width={1804}
        height={880}
        priority={false}
        loading="lazy"
        quality={95}
        sizes="(max-width: 1000px) 100vw, 60vw"
        unoptimized
        style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
      />
    </div>
  )
}

// ── Mock 04 · Recommendations — static image of the Opportunities dashboard ─
//
// White background on the wrapper so when the dashboard image (1876×1226,
// aspect ~1.53) sits inside a slightly wider mock-panel slot, the
// horizontal letterbox blends seamlessly with the dashboard's own white
// background — visually the whole frame reads as one continuous surface.
function MockRecommendations() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#ffffff' }}>
      <Image
        src="/home/opportunities.png"
        alt="AEO/GEO Recommendations — prioritized opportunities across citations, alerts, on-page, crawl, and query signals"
        width={1876}
        height={1226}
        priority={false}
        loading="lazy"
        quality={95}
        sizes="(max-width: 1000px) 100vw, 60vw"
        unoptimized
        style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
      />
    </div>
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
  Mock: (props?: { show?: boolean }) => ReactElement
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
    mockAspect: '1804 / 880'
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
    mockAspect: '1876 / 1226'
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
                <div style={{ position: 'relative', height: 564 }}>
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
              {/* Card height bumped so the visibility-insights slideshow can
                  display the dashboard frames at a usable size. */}
              <div style={{ position: 'relative', height: 'clamp(480px, 58vh, 680px)' }}>
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

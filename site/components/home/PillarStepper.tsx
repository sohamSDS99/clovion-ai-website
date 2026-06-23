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
          aspectRatio: '1880 / 1075',
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
              width={1880}
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


// ── Mock 02 · Brand Perception ──────────────────────────────────────
const PERC_CATS = ['Audience', 'Intent', 'Industry', 'Use Case', 'Perception', 'Sentiment']
const PERC_YOURS = ['SMB', 'Ease of use', 'Fast implementation']
const PERC_COMP = ['Enterprise', 'Security', 'Scalability']

function Hl({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: 'var(--positive-bg)',
        borderRadius: 4,
        padding: '1px 4px',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone'
      }}
    >
      {children}
    </span>
  )
}

function MockPerception() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.7fr 1fr', gap: 14, height: '100%', overflow: 'hidden' }}>
      {/* col 1 — tagged AI answer */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--white)', padding: 14, overflow: 'hidden' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              height: 20,
              width: 20,
              borderRadius: 999,
              background: 'var(--ink-surface, var(--ink))',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <span style={{ height: 7, width: 7, borderRadius: 999, background: 'var(--on-ink)' }} />
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-50)' }}>
            Tagged AI response
          </span>
        </span>
        <p style={{ margin: '12px 0 0', fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--ink-80, var(--ink-70))' }}>
          Best CRM for a growing SaaS team? Often recommended for <Hl>small and mid-sized businesses</Hl> because it combines <Hl>CRM, marketing automation</Hl> in a <Hl>single platform</Hl>.
        </p>
        <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {['Audience', 'Use case', 'Perception'].map((k) => (
            <span
              key={k}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--ink-60)',
                background: 'var(--subtle)',
                border: '1px solid var(--line)',
                borderRadius: 999,
                padding: '3px 8px'
              }}
            >
              {k}
            </span>
          ))}
        </div>
      </div>

      {/* col 2 — Clovion analyzes → categories */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--ink-70)', lineHeight: 1.4 }}>Clovion tags every AI response</span>
        <span
          aria-hidden
          style={{
            margin: '10px 0',
            height: 1,
            background: 'linear-gradient(90deg, var(--positive), transparent)'
          }}
        />
        <div style={{ display: 'grid', gap: 6 }}>
          {PERC_CATS.map((c) => (
            <span
              key={c}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--ink-70)',
                padding: '4px 9px',
                borderRadius: 7,
                background: 'var(--ink-04)',
                border: '1px solid var(--line)'
              }}
            >
              <span style={{ height: 5, width: 5, borderRadius: 999, background: 'var(--positive)' }} />
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* col 3 — perception insights */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
        <div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--positive)', fontWeight: 600 }}>
            You&rsquo;re associated with
          </span>
          <div style={{ marginTop: 9, display: 'flex', flexDirection: 'column', gap: 7 }}>
            {PERC_YOURS.map((p) => (
              <span key={p} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '0.82rem', color: 'var(--ink-80, var(--ink-70))' }}>
                <MiniCheck size={17} />
                {p}
              </span>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: 11 }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--ink-60)' }}>Competitors own</span>
          <div style={{ marginTop: 9, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {PERC_COMP.map((c) => (
              <span
                key={c}
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: 'var(--ink-70)',
                  background: 'var(--ink-04)',
                  border: '1px solid var(--line)',
                  borderRadius: 999,
                  padding: '4px 11px'
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 9,
            padding: 11,
            borderRadius: 10,
            background: 'var(--positive-bg)',
            border: '1px solid var(--positive-border)'
          }}
        >
          <OppBulb />
          <span style={{ fontSize: '0.74rem', lineHeight: 1.4, color: 'var(--ink-80, var(--ink-70))' }}>
            Strengthen authority around <strong style={{ color: 'var(--ink)' }}>security</strong> &amp; <strong style={{ color: 'var(--ink)' }}>scalability</strong> to win enterprise prompts.
          </span>
        </div>
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
        width={1920}
        height={1280}
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

// ── Mock 04 · Recommendations ───────────────────────────────────────
const REC_CATS = [
  { n: 'AI Visibility', c: 15 },
  { n: 'Brand Perception', c: 11 },
  { n: 'Competitive', c: 12 },
  { n: 'AEO / GEO Content', c: 6 },
  { n: 'Technical & Authority', c: 4 }
]
const REC_ITEMS = [
  { t: 'Win the citation for acs.org', c: 'AI Visibility', p: 'High' },
  { t: 'Improve association with “enterprise”', c: 'Perception', p: 'High' },
  { t: 'Close the gap on “SDS Management”', c: 'Competitive', p: 'High' },
  { t: 'Create content for “regulatory compliance”', c: 'AEO/GEO', p: 'Med' },
  { t: 'Get cited in AI Overviews', c: 'AI Visibility', p: 'Med' }
]
const REC_DO = [
  'Publish an answer-first page targeting the cited prompts.',
  'Match the cited source, then go deeper with specifics.',
  'Add clear headings so engines can lift a clean quote.'
]
const REC_PRI_COLOR: Record<string, string> = { High: '#fb7185', Med: '#fbbf24', Low: 'var(--ink-50)' }
const REC_PRI_BG: Record<string, string> = { High: 'rgba(251,113,133,0.12)', Med: 'rgba(251,191,36,0.12)', Low: 'var(--ink-04)' }

function MockRecommendations() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '0.82fr 1.05fr 1.05fr', gap: 13, height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)', marginBottom: 8 }}>
          48 recommendations
        </div>
        <div style={{ display: 'grid', gap: 5 }}>
          {REC_CATS.map((cat, i) => (
            <span
              key={cat.n}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 6,
                padding: '7px 9px',
                borderRadius: 8,
                background: i === 0 ? 'var(--positive-bg)' : 'var(--ink-04)',
                border: `1px solid ${i === 0 ? 'var(--positive-border)' : 'var(--line)'}`
              }}
            >
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: i === 0 ? 'var(--ink)' : 'var(--ink-70)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {cat.n}
              </span>
              <span style={{ flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.64rem', fontWeight: 600, color: i === 0 ? 'var(--positive)' : 'var(--ink-50)' }}>
                {cat.c}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', padding: '0 2px 7px', fontFamily: 'var(--font-mono)', fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)', borderBottom: '1px solid var(--line)' }}>
          <span>Recommendation</span>
          <span>Priority</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {REC_ITEMS.map((r, i) => (
            <div
              key={r.t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '0 2px',
                flex: 1,
                borderBottom: i < REC_ITEMS.length - 1 ? '1px solid var(--line)' : 'none'
              }}
            >
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.t}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--ink-50)' }}>{r.c}</span>
              </span>
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: REC_PRI_COLOR[r.p],
                  background: REC_PRI_BG[r.p],
                  borderRadius: 999,
                  padding: '3px 9px'
                }}
              >
                {r.p}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 12, border: '1px solid var(--line)', background: 'var(--white)', padding: 13, minWidth: 0, overflow: 'hidden' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)', lineHeight: 1.2 }}>
          Win the citation for acs.org
        </span>
        <span style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: '0.56rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-50)' }}>
          What to do
        </span>
        <div style={{ marginTop: 8, display: 'grid', gap: 6 }}>
          {REC_DO.map((d, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <MiniCheck size={15} />
              <span style={{ fontSize: '0.72rem', lineHeight: 1.35, color: 'var(--ink-70)' }}>{d}</span>
            </span>
          ))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 11, display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, padding: '8px 10px', borderRadius: 9, background: 'var(--subtle)', border: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--positive)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              +18.7%
            </div>
            <div style={{ marginTop: 4, fontSize: '0.6rem', color: 'var(--ink-60)' }}>Visibility gain</div>
          </div>
          <div style={{ flex: 1, padding: '8px 10px', borderRadius: 9, background: 'var(--subtle)', border: '1px solid var(--line)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
              1.6x
            </div>
            <div style={{ marginTop: 4, fontSize: '0.6rem', color: 'var(--ink-60)' }}>More cited</div>
          </div>
        </div>
        <span
          style={{
            marginTop: 9,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            height: 30,
            borderRadius: 999,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            fontSize: '0.74rem',
            fontWeight: 600
          }}
        >
          Write a page targeting this <ArrowRight />
        </span>
      </div>
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
  Mock: () => ReactElement
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
    Mock: MockVisibility
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
    Mock: MockPerception
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
    Mock: MockRankings
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
    Mock: MockRecommendations
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
  // Visibility pillar is full-bleed: no internal headline/subtitle/link
  // chrome — the dashboard slideshow IS the visual, edge to edge.
  const isFullBleed = s.sku.startsWith('01 ')
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
          ...(isFullBleed
            ? { width: '100%', aspectRatio: '1880 / 1075', maxHeight: '100%' }
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
            <Mock />
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
              <Mock />
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

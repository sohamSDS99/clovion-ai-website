'use client'

/**
 * Brand Perception — feature page.
 *
 * Follows the Brand Audit page template: shared editorial primitives
 * (static display hero, numbered sections, technical-drawing Panels with
 * dashed grids + corner marks) reused from
 * `./primitives`, plus the shared motion helpers. Ships
 * LIGHT in the homepage's locked palette — cream #FAF9F7, ink + alphas, emerald
 * `--positive` as the only accent. Copy is verbatim and locked.
 */

import { type CSSProperties } from 'react'
import { analytics } from '@/lib/analytics'
import { openCalendly } from '@/lib/openCalendly'
import {
  S_CONTAINER,
  S_DISPLAY_LG,
  S_LEAD,
  MONO,
  ArrowRight,
  CheckIcon,
  MonoEyebrow,
  NumberedSection,
  Panel,
  useInView,
} from './primitives'
import { cb, useReducedMotion, useCountUp, useStagger } from '@/components/home/mocks/motion'

const bodyStyle: CSSProperties = { ...S_LEAD, margin: 0 }
const bodyStyle2: CSSProperties = { ...S_LEAD, margin: '16px 0 0' }

const S_CARD_LABEL: CSSProperties = { ...MONO, fontSize: '0.62rem', fontWeight: 600, color: 'var(--ink-50)' }
const S_ROW_LABEL: CSSProperties = {
  fontFamily: 'var(--font-body-reg, var(--font-body))',
  fontSize: '0.85rem',
  fontWeight: 500,
  color: 'var(--ink-90)',
}

/* ── Small bordered card used by the 4-up grids ────────────────── */
function AreaCard({
  label,
  body,
  children,
}: {
  label: string
  body: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 20,
        borderRadius: 16,
        border: '1px solid var(--line)',
        background: 'var(--white)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <span style={S_CARD_LABEL}>{label}</span>
      <div style={{ marginTop: 16, minHeight: 96 }}>{children}</div>
      <p style={{ ...S_LEAD, fontSize: '0.9rem', lineHeight: 1.55, margin: '18px 0 0' }}>{body}</p>
    </div>
  )
}

/* ================================================================
 * HERO
 * ============================================================== */

const HERO_SIGNALS = [
  { label: 'Website', hint: 'clovion.ai' },
  { label: 'Reviews', hint: 'G2 · Capterra' },
  { label: 'Communities', hint: 'Reddit · Hacker News' },
  { label: 'Analyst reports', hint: 'Forrester · Gartner' },
  { label: 'Editorial content', hint: 'TechCrunch · The Verge' },
] as const

const HERO_ATTRS = [
  { label: 'Easy to use', value: 'Strong', positive: true },
  { label: 'Enterprise-ready', value: 'Growing', positive: true },
  { label: 'Responsive support', value: 'Strong', positive: true },
  { label: 'Pricing', value: 'Mixed', positive: false },
] as const

function PerceptionHeroMock() {
  const reduce = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  const play = reduce || inView
  const nodes = useStagger(HERO_SIGNALS.length, play, 90, 120)
  const attrs = useStagger(HERO_ATTRS.length, play, 110, 620)
  const conf = useCountUp(84, play, { durationMs: 1400, startMs: 300 })

  return (
    <div ref={ref} role="img" aria-label="Clovion resolving signals from your website, reviews, communities, analyst reports, and editorial content into an AI-formed perception profile.">
      {!reduce && (
        <style>{'@keyframes clv-bp-sweep{0%{top:0%;opacity:0}12%{opacity:0.85}88%{opacity:0.85}100%{top:100%;opacity:0}}'}</style>
      )}
      <Panel label="Brand perception" status={play ? 'Formed' : 'Analyzing'}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] md:gap-8 items-stretch">
          {/* Left: signals analyzed */}
          <div style={{ position: 'relative' }}>
            <span style={S_CARD_LABEL}>Signals analyzed</span>
            <div style={{ position: 'relative', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* converging connectors */}
              <svg
                aria-hidden
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, opacity: play ? 0.5 : 0, transition: `opacity 0.9s ${cb}`, pointerEvents: 'none' }}
              >
                {HERO_SIGNALS.map((_, i) => {
                  const y = ((i + 0.5) / HERO_SIGNALS.length) * 100
                  return (
                    <path
                      key={i}
                      d={`M2 ${y} C 46 ${y}, 60 50, 100 50`}
                      fill="none"
                      stroke="var(--ink)"
                      strokeOpacity="0.16"
                      strokeWidth="0.5"
                      strokeDasharray="1.4 2.2"
                      vectorEffect="non-scaling-stroke"
                    />
                  )
                })}
              </svg>
              {!reduce && (
                <span
                  aria-hidden
                  style={{
                    position: 'absolute',
                    left: -2,
                    right: -2,
                    top: 0,
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, var(--positive), transparent)',
                    animation: 'clv-bp-sweep 3.4s ease-in-out infinite',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
              )}
              {HERO_SIGNALS.map((s, i) => {
                const on = nodes[i]
                return (
                  <div
                    key={s.label}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '9px 12px',
                      borderRadius: 11,
                      border: '1px solid var(--line)',
                      background: 'var(--subtle)',
                      opacity: on ? 1 : 0,
                      transform: on ? 'none' : 'translateX(-10px)',
                      transition: reduce ? 'none' : `opacity 0.5s ${cb}, transform 0.5s ${cb}`,
                    }}
                  >
                    <span aria-hidden style={{ flexShrink: 0, width: 7, height: 7, borderRadius: '50%', background: 'var(--positive)', boxShadow: '0 0 0 3px rgba(4,120,87,0.12)' }} />
                    <span style={{ minWidth: 0 }}>
                      <span style={{ ...S_ROW_LABEL, display: 'block', fontSize: '0.82rem' }}>{s.label}</span>
                      <span style={{ ...MONO, fontSize: '0.6rem', fontWeight: 600, color: 'var(--ink-40)', display: 'block', marginTop: 3 }}>{s.hint}</span>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: AI perception profile */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              padding: 18,
              borderRadius: 14,
              border: '1px solid var(--line)',
              background: 'var(--subtle)',
              opacity: play ? 1 : 0.35,
              transition: reduce ? 'none' : `opacity 0.8s ${cb}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={S_CARD_LABEL}>AI perception profile</span>
              <span
                style={{
                  ...MONO,
                  fontSize: '0.55rem',
                  fontWeight: 600,
                  color: 'var(--positive)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 8px',
                  borderRadius: 999,
                  border: '1px solid var(--positive-border)',
                  background: 'var(--positive-bg)',
                }}
              >
                <CheckIcon size={9} /> High confidence
              </span>
            </div>

            <div style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.6rem, 6vw, 3.4rem)', fontWeight: 600, lineHeight: 1, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
                {conf}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--ink-50)' }}>/ 100</span>
            </div>
            <span style={{ ...MONO, fontSize: '0.6rem', fontWeight: 600, color: 'var(--ink-40)', marginTop: 4 }}>Perception consistency</span>

            <span aria-hidden style={{ position: 'relative', display: 'block', marginTop: 12, height: 4, borderRadius: 999, background: 'var(--ink-10)', overflow: 'hidden' }}>
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  transformOrigin: 'left center',
                  width: '84%',
                  borderRadius: 999,
                  background: 'var(--positive)',
                  transform: play ? 'scaleX(1)' : 'scaleX(0)',
                  transition: reduce ? 'none' : `transform 1.4s ${cb}`,
                  transitionDelay: reduce ? '0ms' : '300ms',
                }}
              />
            </span>

            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {HERO_ATTRS.map((a, i) => {
                const on = attrs[i]
                return (
                  <div
                    key={a.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '8px 0',
                      borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                      opacity: on ? 1 : 0,
                      transform: on ? 'none' : 'translateY(6px)',
                      transition: reduce ? 'none' : `opacity 0.45s ${cb}, transform 0.45s ${cb}`,
                    }}
                  >
                    <span style={{ ...S_ROW_LABEL, color: 'var(--ink-80)' }}>{a.label}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: '0.66rem', fontWeight: 600, letterSpacing: '0.04em', color: a.positive ? 'var(--positive)' : 'var(--ink-50)' }}>
                      <span aria-hidden style={{ width: 6, height: 6, borderRadius: '50%', background: a.positive ? 'var(--positive)' : 'var(--ink-25)' }} />
                      {a.value}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  )
}

function Hero() {
  const scrollToNext = () => {
    const el = document.getElementById('through-ai')
    if (el) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }
    analytics.ctaClick('Explore Brand Perception', 'brand_perception_hero')
  }
  return (
    <section data-track-location="brand_perception_hero" style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.7,
          background:
            'radial-gradient(ellipse 62% 52% at 72% -6%, rgba(10,10,15,0.05) 0%, rgba(10,10,15,0.02) 34%, transparent 72%)',
        }}
      />
      <div style={{ ...S_CONTAINER, padding: '3.5rem 1.5rem 0' }}>
        <div style={{ maxWidth: 820 }}>
          <h1 style={{ ...S_DISPLAY_LG, fontSize: 'clamp(2rem, 3.4vw + 0.3rem, 3.4rem)', margin: 0 }}>
            Understand how AI describes your brand—not just how often it mentions you.
          </h1>
          <p style={{ ...S_LEAD, maxWidth: 680, margin: '1.75rem 0 0' }}>
            When buyers ask AI for recommendations, comparisons, or advice, the response isn’t built from a
            single source. It’s shaped by thousands of signals across your website, reviews, communities,
            analyst reports, and editorial content.
          </p>
          <p style={{ ...S_LEAD, maxWidth: 680, margin: '1rem 0 0' }}>
            Clovion analyzes those responses to help you understand the characteristics, strengths, and
            perceptions AI consistently associates with your brand.
          </p>
          <div style={{ marginTop: 34, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onClick={scrollToNext}
            >
              Explore Brand Perception <ArrowRight />
            </button>
          </div>
        </div>
        <div style={{ marginTop: 'clamp(2.75rem, 5vw, 4rem)' }}>
          <PerceptionHeroMock />
        </div>
      </div>
    </section>
  )
}

/* ================================================================
 * 01 — SEE YOUR BRAND THROUGH AI'S EYES  (attribute cluster)
 * ============================================================== */

const CLUSTER = [
  { t: 'Easy to use', x: 20, y: 16 },
  { t: 'Enterprise-ready', x: 76, y: 14 },
  { t: 'Strong support', x: 88, y: 48 },
  { t: 'Developer-first', x: 70, y: 82 },
  { t: 'Trusted', x: 24, y: 84 },
  { t: 'Scales well', x: 9, y: 50 },
]

function AttributeCluster() {
  const reduce = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3 })
  const play = reduce || inView
  const chips = useStagger(CLUSTER.length, play, 90, 200)
  return (
    <Panel label="Themes AI associates" status="Clustering">
      <div
        ref={ref}
        style={{ position: 'relative', aspectRatio: '16 / 7', minHeight: 240 }}
        role="img"
        aria-label="Attribute chips — easy to use, enterprise-ready, strong support, developer-first, trusted, scales well — clustering around a central brand node as AI forms an opinion."
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
          {CLUSTER.map((c, i) => (
            <line
              key={c.t}
              x1={50}
              y1={50}
              x2={c.x}
              y2={c.y}
              stroke="var(--ink)"
              strokeOpacity={0.14}
              strokeWidth={0.4}
              vectorEffect="non-scaling-stroke"
              style={{ opacity: chips[i] ? 1 : 0, transition: reduce ? 'none' : `opacity 0.5s ${cb}` }}
            />
          ))}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(-50%, -50%) scale(${play ? 1 : 0.8})`,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 16px',
            borderRadius: 999,
            background: 'var(--ink)',
            color: 'var(--on-ink, #fff)',
            fontSize: '0.85rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 14px 30px -12px rgba(10,10,15,0.4)',
            opacity: play ? 1 : 0,
            transition: reduce ? 'none' : `opacity 0.5s ${cb}, transform 0.6s ${cb}`,
          }}
        >
          <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--positive)' }} />
          Your brand
        </div>
        {CLUSTER.map((c, i) => (
          <span
            key={c.t}
            style={{
              position: 'absolute',
              left: `${c.x}%`,
              top: `${c.y}%`,
              transform: `translate(-50%, -50%) scale(${chips[i] ? 1 : 0.85})`,
              whiteSpace: 'nowrap',
              padding: '6px 12px',
              borderRadius: 999,
              background: 'var(--white)',
              border: '1px solid var(--line)',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--ink-80)',
              boxShadow: 'var(--shadow-card)',
              opacity: chips[i] ? 1 : 0,
              transition: reduce ? 'none' : `opacity 0.5s ${cb}, transform 0.6s ${cb}`,
            }}
          >
            {c.t}
          </span>
        ))}
      </div>
    </Panel>
  )
}

/* ================================================================
 * 02 — DISCOVER YOUR AI BRAND PROFILE  (four-part panel)
 * ============================================================== */

const ATTR_BARS = [
  { label: 'Ease of use', v: 88 },
  { label: 'Customer support', v: 74 },
  { label: 'Pricing', v: 52 },
  { label: 'Scalability', v: 69 },
]
const AUDIENCE = [
  { label: 'Company size', v: 'Mid-market → Enterprise' },
  { label: 'Industry', v: 'SaaS · Fintech' },
  { label: 'Team maturity', v: 'Scaling' },
]

function BrandProfile() {
  const reduce = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 })
  const play = reduce || inView
  const conf = 9 // filled segments of 12
  return (
    <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
      <AreaCard
        label="Brand attributes"
        body="See the characteristics AI most strongly associates with your company, from ease of use and customer support to pricing, scalability, compliance, and innovation."
      >
        <div style={{ display: 'grid', gap: 10 }}>
          {ATTR_BARS.map((a, i) => (
            <div key={a.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--ink-70)' }}>
                <span>{a.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--ink-50)' }}>{a.v}</span>
              </div>
              <div style={{ marginTop: 5, height: 6, borderRadius: 999, background: 'var(--ink-10)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: play ? `${a.v}%` : '0%',
                    borderRadius: 999,
                    background: a.v >= 75 ? 'var(--positive)' : 'var(--ink)',
                    transition: reduce ? 'none' : `width 0.9s ${cb} ${0.15 + i * 0.07}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </AreaCard>

      <AreaCard
        label="Audience fit"
        body="Understand who AI believes your product is built for, including company size, industry, team maturity, technical expertise, and deployment complexity."
      >
        <div style={{ display: 'grid', gap: 8 }}>
          {AUDIENCE.map((a) => (
            <div key={a.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingBottom: 8, borderBottom: '1px solid var(--line)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--ink-60)' }}>{a.label}</span>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--ink-80)', padding: '3px 10px', borderRadius: 999, background: 'var(--subtle)', border: '1px solid var(--line)', whiteSpace: 'nowrap' }}>{a.v}</span>
            </div>
          ))}
        </div>
      </AreaCard>

      <AreaCard
        label="Competitive positioning"
        body="See how AI positions your brand against competitors and which strengths or weaknesses are most commonly used in comparisons."
      >
        <div style={{ position: 'relative', height: 120, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--subtle)', overflow: 'hidden' }}>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
            <line x1={50} y1={8} x2={50} y2={92} stroke="var(--ink)" strokeOpacity={0.1} strokeWidth={0.5} strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
            <line x1={8} y1={50} x2={92} y2={50} stroke="var(--ink)" strokeOpacity={0.1} strokeWidth={0.5} strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
          </svg>
          {[
            { t: 'You', x: 66, y: 70, me: true },
            { t: 'A', x: 32, y: 46, me: false },
            { t: 'B', x: 78, y: 38, me: false },
            { t: 'C', x: 46, y: 22, me: false },
          ].map((d, i) => (
            <span
              key={d.t}
              style={{
                position: 'absolute',
                left: `${d.x}%`,
                top: `${100 - d.y}%`,
                transform: `translate(-50%, -50%) scale(${play ? 1 : 0})`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: d.me ? 30 : 22,
                height: d.me ? 30 : 22,
                borderRadius: 999,
                background: d.me ? 'var(--positive)' : 'var(--white)',
                border: d.me ? 'none' : '1px solid var(--ink-20)',
                color: d.me ? '#fff' : 'var(--ink-60)',
                fontSize: '0.6rem',
                fontWeight: 700,
                boxShadow: d.me ? '0 8px 18px -6px rgba(4,120,87,0.5)' : 'var(--shadow-card)',
                transition: reduce ? 'none' : `transform 0.6s ${cb} ${0.15 + i * 0.1}s`,
              }}
            >
              {d.t}
            </span>
          ))}
        </div>
      </AreaCard>

      <AreaCard
        label="Confidence"
        body="Measure how consistently AI expresses each perception across prompts, engines, and sources, helping distinguish established patterns from isolated responses."
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              style={{
                flex: 1,
                height: 30,
                borderRadius: 4,
                background: i < conf ? 'var(--positive)' : 'var(--subtle)',
                border: i < conf ? 'none' : '1px solid var(--line)',
                opacity: play ? 1 : 0.15,
                transition: reduce ? 'none' : `opacity 0.4s ${cb} ${i * 0.05}s`,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--ink)' }}>High</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--ink-50)' }}>established pattern</span>
        </div>
      </AreaCard>
    </div>
  )
}

/* ================================================================
 * 03 — UNDERSTAND WHY AI THINKS THAT  (perception-detail card)
 * ============================================================== */

const SPARK = [42, 46, 44, 51, 55, 61, 66, 72]
const SPK_W = 132
const SPK_H = 40
const spx = (i: number) => (i / (SPARK.length - 1)) * SPK_W
const spy = (v: number) => SPK_H - ((v - 38) / 40) * SPK_H

const PERCEPTION_INCLUDES = [
  { title: 'AI summary', body: 'A concise description of how AI currently represents your brand.' },
  { title: 'Supporting sources', body: 'The websites, reviews, and third-party content influencing that perception.' },
  { title: 'Confidence level', body: 'See whether an attribute is consistently reinforced across AI engines or based on limited signals.' },
  { title: 'Change over time', body: 'Track how perceptions evolve as your content, citations, and online presence change.' },
]

function PerceptionDetail() {
  const reduce = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.25 })
  const play = reduce || inView
  const sources = ['g2.com', 'your docs', 'Reddit', 'Gartner', 'TechCrunch']
  const sparkPath = `M ${SPARK.map((v, i) => `${spx(i).toFixed(1)} ${spy(v).toFixed(1)}`).join(' L ')}`
  return (
    <div ref={ref}>
      <Panel label="Perception detail" status="1 of 24">
        {/* AI summary */}
        <span style={S_CARD_LABEL}>AI summary</span>
        <p style={{ marginTop: 10, fontSize: '1rem', lineHeight: 1.6, color: 'var(--ink-90)', fontFamily: 'var(--font-body-reg, var(--font-body))' }}>
          “A modern, easy-to-adopt platform that mid-market SaaS teams trust for fast setup and responsive
          support, with pricing seen as its main trade-off.”
        </p>

        {/* Supporting sources */}
        <div style={{ marginTop: 20 }}>
          <span style={S_CARD_LABEL}>Supporting sources</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {sources.map((s) => (
            <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'var(--subtle)', border: '1px solid var(--line)', fontSize: '0.76rem', color: 'var(--ink-70)' }}>
              <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: 'var(--ink-40)' }} />
              {s}
            </span>
          ))}
        </div>

        {/* confidence + change over time */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 18, marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
          <div>
            <span style={S_CARD_LABEL}>Confidence level</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 11px', borderRadius: 999, background: 'var(--positive-bg)', border: '1px solid var(--positive-border)', color: 'var(--positive)', fontSize: '0.72rem', fontWeight: 600, ...MONO }}>
                <CheckIcon size={9} /> High
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--ink-50)' }}>reinforced across 4 engines</span>
            </div>
          </div>
          <div>
            <span style={{ ...S_CARD_LABEL, display: 'block', textAlign: 'right' }}>Change over time</span>
            <svg width={SPK_W} height={SPK_H} style={{ marginTop: 8, overflow: 'visible' }} aria-hidden>
              <path
                d={sparkPath}
                fill="none"
                stroke="var(--positive)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={play ? 0 : 1}
                style={{ transition: reduce ? 'none' : `stroke-dashoffset 1s ${cb} 0.4s` }}
              />
              <circle cx={spx(SPARK.length - 1)} cy={spy(SPARK[SPARK.length - 1])} r={3} fill="var(--positive)" />
            </svg>
          </div>
        </div>
      </Panel>

      {/* Every Perception Includes */}
      <div style={{ marginTop: 'clamp(2rem, 3.5vw, 3rem)' }}>
        <h3 className="display-sm" style={{ color: 'var(--ink)', margin: 0 }}>
          Every Perception Includes
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
          {PERCEPTION_INCLUDES.map((item, i) => (
            <div key={item.title} style={{ padding: 18, borderRadius: 14, border: '1px solid var(--line)', background: 'var(--white)', boxShadow: 'var(--shadow-card)' }}>
              <span style={{ ...MONO, fontSize: '0.68rem', fontWeight: 600, color: 'var(--ink-40)', fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</span>
              <h4 style={{ margin: '10px 0 0', fontSize: '0.98rem', fontWeight: 600, color: 'var(--ink)' }}>{item.title}</h4>
              <p style={{ margin: '8px 0 0', fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--ink-70)', fontFamily: 'var(--font-body-reg, var(--font-body))' }}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ================================================================
 * 04 — SPOT PERCEPTION GAPS  (gap analysis)
 * ============================================================== */

const GAP_ITEMS = [
  { title: 'Missing strengths', body: 'Identify capabilities, differentiators, or product strengths that rarely appear in AI responses despite being important to your business.' },
  { title: 'Incorrect perceptions', body: 'Discover inaccurate, outdated, or misleading descriptions that may influence buying decisions.' },
  { title: 'Conflicting narratives', body: 'Find situations where different AI engines—or different sources—describe your company in completely different ways.' },
  { title: 'Emerging themes', body: 'Detect new patterns in how AI talks about your business before they become widely established.' },
]

function GapAnalysis() {
  const reduce = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 })
  const play = reduce || inView
  const present = ['Easy to use', 'Reliable', 'Great support']
  const absent = ['SOC 2 compliant', 'Open API', 'Global CDN']
  return (
    <div ref={ref}>
      <Panel label="Gap analysis" status="What AI leaves out">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {/* present vs absent */}
          <div>
            <span style={S_CARD_LABEL}>What AI says</span>
            <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
              {present.map((p) => (
                <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--ink-80)' }}>
                  <span aria-hidden style={{ display: 'inline-flex', color: 'var(--positive)' }}><CheckIcon size={11} /></span>
                  {p}
                </span>
              ))}
            </div>
            <div style={{ ...S_CARD_LABEL, marginTop: 20 }}>What AI doesn’t say</div>
            <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
              {absent.map((a, i) => (
                <span
                  key={a}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.85rem',
                    color: 'var(--ink-40)',
                    opacity: play ? 1 : 0,
                    transition: reduce ? 'none' : `opacity 0.5s ${cb} ${0.2 + i * 0.12}s`,
                  }}
                >
                  <span aria-hidden style={{ width: 13, height: 13, borderRadius: 3, border: '1px dashed var(--ink-30)' }} />
                  <span style={{ textDecoration: 'line-through', textDecorationColor: 'var(--ink-20)' }}>{a}</span>
                </span>
              ))}
            </div>
          </div>

          {/* conflict + emerging */}
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--subtle)' }}>
              <span style={S_CARD_LABEL}>Conflicting narratives</span>
              <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ ...MONO, fontSize: '0.6rem', fontWeight: 600, color: 'var(--ink-40)', width: 70 }}>ChatGPT</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--ink-80)' }}>“Built for enterprise”</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ ...MONO, fontSize: '0.6rem', fontWeight: 600, color: 'var(--ink-40)', width: 70 }}>Perplexity</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--ink-80)' }}>“Best for startups”</span>
                </div>
              </div>
            </div>
            <div style={{ padding: 16, borderRadius: 12, border: '1px solid var(--line)', background: 'var(--subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={S_CARD_LABEL}>Emerging theme</span>
                <span style={{ ...MONO, fontSize: '0.55rem', fontWeight: 600, color: 'var(--positive)', padding: '2px 8px', borderRadius: 999, background: 'var(--positive-bg)', border: '1px solid var(--positive-border)' }}>NEW</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>“AI-native workflow”</span>
                <svg width={70} height={24} style={{ overflow: 'visible' }} aria-hidden>
                  <path
                    d="M 0 20 L 18 18 L 34 13 L 52 8 L 70 2"
                    fill="none"
                    stroke="var(--positive)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={play ? 0 : 1}
                    style={{ transition: reduce ? 'none' : `stroke-dashoffset 0.9s ${cb} 0.5s` }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
        {GAP_ITEMS.map((g, i) => (
          <div key={g.title} style={{ padding: 18, borderRadius: 14, border: '1px solid var(--line)', background: 'var(--white)', boxShadow: 'var(--shadow-card)' }}>
            <span style={{ ...MONO, fontSize: '0.68rem', fontWeight: 600, color: 'var(--ink-40)', fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</span>
            <h4 style={{ margin: '10px 0 0', fontSize: '0.98rem', fontWeight: 600, color: 'var(--ink)' }}>{g.title}</h4>
            <p style={{ margin: '8px 0 0', fontSize: '0.88rem', lineHeight: 1.55, color: 'var(--ink-70)', fontFamily: 'var(--font-body-reg, var(--font-body))' }}>{g.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================================================================
 * 05 — TURN PERCEPTION INTO ACTION  (routing)
 * ============================================================== */

const ROUTES = [
  { label: 'A source presence gap', hint: 'AI can’t find enough about you' },
  { label: 'A content substance gap', hint: 'The detail AI needs isn’t there' },
  { label: 'A brand framing gap', hint: 'The story is told the wrong way' },
]

function ActionRouting() {
  const reduce = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 })
  const play = reduce || inView
  return (
    <div ref={ref}>
      <Panel label="Perception → Recommendations" status="Routed">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 14px',
            borderRadius: 999,
            background: 'var(--ink)',
            color: 'var(--on-ink, #fff)',
            fontSize: '0.82rem',
            fontWeight: 600,
            opacity: play ? 1 : 0,
            transition: reduce ? 'none' : `opacity 0.5s ${cb}`,
          }}
        >
          <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--positive)' }} />
          Perception finding
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {ROUTES.map((r, i) => (
            <div
              key={r.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '16px 18px',
                borderRadius: 14,
                border: '1px solid var(--line)',
                background: 'var(--subtle)',
                opacity: play ? 1 : 0,
                transform: play ? 'none' : 'translateY(10px)',
                transition: reduce ? 'none' : `opacity 0.5s ${cb} ${0.15 + i * 0.12}s, transform 0.5s ${cb} ${0.15 + i * 0.12}s`,
              }}
            >
              <span aria-hidden style={{ ...MONO, fontSize: '0.66rem', fontWeight: 600, color: 'var(--ink-40)', fontVariantNumeric: 'tabular-nums' }}>0{i + 1}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink)' }}>{r.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--ink-50)', marginTop: 2 }}>{r.hint}</div>
              </div>
              <span aria-hidden style={{ color: 'var(--positive)' }}><ArrowRight /></span>
            </div>
          ))}
        </div>
      </Panel>
      <p style={{ ...S_LEAD, margin: 'clamp(1.75rem, 3vw, 2.5rem) 0 0', maxWidth: 640 }}>
        This creates a clear path from understanding how AI perceives your brand to improving it.
      </p>
    </div>
  )
}

/* ================================================================
 * 06 — MONITOR YOUR BRAND NARRATIVE  (continuous trend)
 * ============================================================== */

const NCW = 660
const NCH = 300
const NPL = 22
const NPR = 20
const NPT = 24
const NPB = 34
const NPLOT_B = NCH - NPB
const ngx = (i: number) => NPL + (i / 7) * (NCW - NPL - NPR)
const ngy = (v: number) => NPLOT_B - (v / 100) * (NPLOT_B - NPT)
const NSERIES = [
  { name: 'Stronger', data: [40, 45, 48, 55, 60, 66, 72, 79] },
  { name: 'More accurate', data: [50, 52, 57, 60, 64, 68, 73, 77] },
  { name: 'More consistent', data: [44, 46, 50, 53, 59, 63, 69, 74] },
]

function NarrativeTrend() {
  const reduce = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.2 })
  const play = reduce || inView
  return (
    <div ref={ref}>
      <Panel label="Brand narrative" status={play ? 'Live' : 'Tracking'}>
        <svg
          viewBox={`0 0 ${NCW} ${NCH}`}
          width="100%"
          style={{ display: 'block', overflow: 'visible' }}
          role="img"
          aria-label="Three tracked narrative lines — stronger, more accurate, and more consistent — all trending upward over time."
        >
          {[0, 25, 50, 75, 100].map((v) => (
            <line key={v} x1={NPL} y1={ngy(v)} x2={NCW - NPR} y2={ngy(v)} stroke="var(--ink)" strokeOpacity={0.08} strokeWidth={1} strokeDasharray="2 5" />
          ))}
          {NSERIES.map((s, si) => {
            const d = `M ${s.data.map((v, i) => `${ngx(i).toFixed(1)} ${ngy(v).toFixed(1)}`).join(' L ')}`
            const isTop = si === 0
            return (
              <path
                key={s.name}
                d={d}
                fill="none"
                stroke={isTop ? 'var(--positive)' : 'var(--ink)'}
                strokeOpacity={isTop ? 1 : 0.34 + si * 0.04}
                strokeWidth={isTop ? 2.6 : 1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={play ? 0 : 1}
                style={{ transition: reduce ? 'none' : `stroke-dashoffset 1.2s ${cb} ${0.3 + si * 0.15}s` }}
              />
            )
          })}
          {['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'].map((q, i) => (
            <text key={q} x={ngx(i)} y={NPLOT_B + 22} textAnchor="middle" fontSize={12} fill="var(--ink-40)" fontFamily="var(--font-mono)">
              {q}
            </text>
          ))}
        </svg>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 20px', marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--line)', fontSize: '0.74rem', color: 'var(--ink-60)' }}>
          {NSERIES.map((s, si) => (
            <span key={s.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span aria-hidden style={{ width: 22, height: 2.5, borderRadius: 2, background: si === 0 ? 'var(--positive)' : 'var(--ink-40)' }} />
              {s.name}
            </span>
          ))}
        </div>
      </Panel>
    </div>
  )
}

/* ================================================================
 * CLOSING — high-contrast conversion band
 * ============================================================== */

function ClosingCTA() {
  return (
    <section data-track-location="brand_perception_final_cta" style={{ padding: 'var(--section) 0' }}>
      <div style={S_CONTAINER}>
        <Panel
          className="clv-dark"
          background="var(--ink-surface)"
          radius={28}
          pad={0}
          cell={26}
          style={{ boxShadow: '0 30px 80px -40px rgba(0,0,0,0.8)' }}
        >
          <div style={{ position: 'relative', padding: 'clamp(3rem, 6vw, 5.5rem) clamp(1.5rem, 4vw, 3.5rem)' }}>
            <div style={{ maxWidth: 720 }}>
              <MonoEyebrow color="var(--on-ink-70)">Brand Perception</MonoEyebrow>
              <h2 style={{ ...S_DISPLAY_LG, margin: '20px 0 0', color: 'var(--on-ink)' }}>
                Your Reputation Is No Longer Defined By Search Results
              </h2>
              <p style={{ ...S_LEAD, color: 'var(--on-ink)', marginTop: 20, fontSize: 'var(--text-lead)', fontWeight: 500 }}>
                It’s defined by what AI says when buyers ask questions.
              </p>
              <p style={{ ...S_LEAD, color: 'var(--on-ink-70)', marginTop: 14, maxWidth: 620 }}>
                Clovion helps you understand that narrative, uncover what shapes it, and improve how your
                brand is represented across AI platforms.
              </p>
              <div style={{ marginTop: 34, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  onClick={() => openCalendly('brand_perception_final_cta')}
                >
                  Book a Demo <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  )
}

/* ================================================================
 * PAGE
 * ============================================================== */

export default function FeatureContent() {
  return (
    <>
      <Hero />

      <NumberedSection n="01" id="through-ai" title="See Your Brand Through AI’s Eyes" visual={<AttributeCluster />}>
        <p style={bodyStyle}>AI doesn’t simply recommend companies. It forms an opinion.</p>
        <p style={bodyStyle2}>
          Clovion identifies the themes and attributes AI repeatedly associates with your business, helping
          you understand how you’re positioned before a customer ever visits your website.
        </p>
      </NumberedSection>

      <NumberedSection n="02" title="Discover Your AI Brand Profile" visual={<BrandProfile />} />

      <NumberedSection n="03" title="Understand Why AI Thinks That" visual={<PerceptionDetail />}>
        <p style={bodyStyle}>Every perception has a source.</p>
        <p style={bodyStyle2}>
          Clovion traces the websites, reviews, documentation, analyst reports, communities, and other
          references contributing to how AI describes your business.
        </p>
        <p style={bodyStyle2}>This helps your team understand not only what AI believes, but why it believes it.</p>
      </NumberedSection>

      <NumberedSection n="04" title="Spot Perception Gaps" visual={<GapAnalysis />}>
        <p style={bodyStyle}>
          The most important insight isn’t always what AI says. It’s what AI doesn’t say.
        </p>
      </NumberedSection>

      <NumberedSection n="05" title="Turn Perception Into Action" visual={<ActionRouting />}>
        <p style={bodyStyle}>Brand Perception isn’t just for understanding your reputation.</p>
        <p style={bodyStyle2}>
          Its findings feed directly into Recommendations, helping identify whether the issue is:
        </p>
      </NumberedSection>

      <NumberedSection n="06" title="Monitor Your Brand Narrative" visual={<NarrativeTrend />}>
        <p style={bodyStyle}>
          AI perception changes over time as new content is published, reviews are written, competitors
          evolve, and AI models update.
        </p>
        <p style={bodyStyle2}>
          Clovion continuously tracks these changes, helping your team understand whether your brand
          narrative is becoming stronger, more accurate, and more consistent.
        </p>
      </NumberedSection>

      <ClosingCTA />
    </>
  )
}

'use client'

// Pillar 3 — "Visibility Ranking by Topic" table dashboard. Coded (no raster).

import { type CSSProperties, type ReactNode } from 'react'
import { cb, useReducedMotion, useReveal, useStagger } from './motion'
import { MondayGlyph, PipedriveGlyph, SalesforceGlyph, DiamondCheck } from './glyphs'
import { LIGHT, BLUE } from './palette'

const POSITIVE = 'var(--positive)'
const NEG = '#e5484d'

type Mark = 'M' | 'P' | 'SF' | 'D'
function Glyph({ m }: { m: Mark }) {
  const sz = 18
  const c: CSSProperties = { color: 'var(--ink-70)' }
  if (m === 'M') return <MondayGlyph size={sz} style={c} />
  if (m === 'P') return <PipedriveGlyph size={sz} style={c} />
  if (m === 'SF') return <SalesforceGlyph size={sz} style={c} />
  return <DiamondCheck size={sz} style={c} />
}

const ROWS: { topic: string; strong: boolean; rank: string; comps: Mark[]; share: number }[] = [
  { topic: 'Centralized SDS Repository', strong: true, rank: '1st', comps: ['M', 'P', 'SF', 'D'], share: 28.4 },
  { topic: 'SDS Management', strong: true, rank: '2nd', comps: ['SF', 'D', 'M', 'P'], share: 22.3 },
  { topic: 'Audit Readiness', strong: false, rank: '7th', comps: ['P', 'M', 'D', 'SF'], share: 8.7 },
  { topic: 'Compliance Reporting', strong: false, rank: '5th', comps: ['D', 'SF', 'P', 'M'], share: 9.1 },
  { topic: 'Regulatory Compliance', strong: false, rank: '6th', comps: ['M', 'SF', 'D', 'P'], share: 6.2 }
]

const COLS = '2.4fr 1fr 0.7fr 0.7fr 0.7fr 0.7fr 2.4fr'

export function MockRankings({ show }: { show: boolean }) {
  const play = useReveal(show)
  const reduced = useReducedMotion()
  const rows = useStagger(ROWS.length, play, 70, 220)
  const cards = useStagger(3, play, 110, 220 + ROWS.length * 70 + 120)
  const shareMax = 30

  return (
    <div
      style={{
        ...LIGHT,
        width: '100%',
        height: '100%',
        containerType: 'size',
        background: 'var(--white)',
        color: 'var(--ink)',
        fontFamily: 'var(--font-body-reg, var(--font-body))',
        overflow: 'hidden',
        padding: '2.4cqw 2.6cqw',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.8cqw'
      }}
    >
      <style>{'@keyframes clvBarSheen{0%{background-position:130% 0}55%{background-position:-30% 0}100%{background-position:-30% 0}}'}</style>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2cqw' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.2cqw', fontWeight: 600, letterSpacing: '0.04em', color: 'var(--ink)' }}>
            Visibility Ranking by Topic
          </div>
          <div style={{ marginTop: '0.7cqw', fontSize: '1.25cqw', color: 'var(--ink-60)' }}>
            SDS Manager&rsquo;s visibility rankings compared to Chemical Compliance Software brands by topic
          </div>
        </div>
        <RangeToggle />
      </div>

      {/* Table */}
      <div style={{ border: '1px solid var(--line)', borderRadius: '1.4cqw', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', padding: '1.2cqw 1.6cqw', borderBottom: '1px solid var(--line)', background: 'var(--subtle)' }}>
          <Head>Topics</Head>
          <Head center>
            Your Brand
            <br />
            <span style={{ fontWeight: 500, color: 'var(--ink-40)' }}>(SDS Manager)</span>
          </Head>
          <Head center>#2</Head>
          <Head center>#3</Head>
          <Head center>#4</Head>
          <Head center>#5</Head>
          <Head>Visibility Share</Head>
        </div>
        {ROWS.map((r, i) => (
          <div
            key={r.topic}
            style={{
              display: 'grid',
              gridTemplateColumns: COLS,
              alignItems: 'center',
              padding: '1.3cqw 1.6cqw',
              borderBottom: i < ROWS.length - 1 ? '1px solid var(--line)' : 'none',
              opacity: rows[i] ? 1 : 0,
              transform: rows[i] ? 'none' : 'translateY(0.8cqw)',
              transition: reduced ? 'none' : `opacity 0.45s ${cb}, transform 0.45s ${cb}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9cqw', minWidth: 0 }}>
              <span style={{ fontSize: '1.5cqw', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.topic}</span>
              <Pill positive={r.strong}>{r.strong ? 'Strong' : 'Need work'}</Pill>
            </div>
            <div style={{ textAlign: 'center' }}>
              <RankFlip rank={r.rank} play={rows[i]} />
            </div>
            {r.comps.map((m, ci) => (
              <div key={ci} style={{ display: 'flex', justifyContent: 'center' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    transform: rows[i] ? 'scale(1)' : 'scale(0.6)',
                    opacity: rows[i] ? 1 : 0,
                    transition: reduced ? 'none' : `transform 0.4s ${cb} ${ci * 0.04}s, opacity 0.4s ${cb} ${ci * 0.04}s`
                  }}
                >
                  <Glyph m={m} />
                </span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1cqw' }}>
              <span style={{ flex: 1, height: '1.1cqw', borderRadius: '999px', background: 'var(--ink-10, rgba(255,255,255,0.10))', overflow: 'hidden' }}>
                <span
                  style={{
                    display: 'block',
                    height: '100%',
                    width: `${(r.share / shareMax) * 100}%`,
                    backgroundColor: 'var(--ink)',
                    backgroundImage: reduced ? undefined : 'linear-gradient(100deg, var(--ink) 38%, rgba(255,255,255,0.55) 50%, var(--ink) 62%)',
                    backgroundSize: '250% 100%',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: '999px',
                    transformOrigin: 'left center',
                    transform: rows[i] ? 'scaleX(1)' : 'scaleX(0)',
                    transition: reduced ? 'none' : `transform 0.6s ${cb} 0.12s`,
                    // Constant sheen sweep — the graph keeps animating, never stops.
                    animation: reduced ? 'none' : `clvBarSheen 2.6s ease-in-out ${i * 0.22}s infinite`
                  }}
                />
              </span>
              <span style={{ fontSize: '1.4cqw', fontWeight: 600, fontVariantNumeric: 'tabular-nums', width: '4.5cqw', textAlign: 'right' }}>{r.share}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Insight cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.4cqw', flex: 1, minHeight: 0 }}>
        <InsightCard shown={cards[0]} icon={<StarIcon />} iconColor={BLUE} title="WHERE YOU WIN" titleColor={BLUE}>
          Strong visibility in &ldquo;Centralized SDS Repository&rdquo; and &ldquo;SDS Management&rdquo; with top 2 positions.
        </InsightCard>
        <InsightCard shown={cards[1]} icon={<ArrowIcon up />} iconColor={POSITIVE} title="TOP OPPORTUNITY" titleColor={POSITIVE}>
          Improve content and authority around Audit Readiness to close the visibility gap.
        </InsightCard>
        <InsightCard shown={cards[2]} icon={<ArrowIcon />} iconColor={NEG} title="WHERE YOU LOSE" titleColor={NEG}>
          Competitors dominate &ldquo;Audit Readiness&rdquo; and &ldquo;Compliance Reporting&rdquo;.
        </InsightCard>
      </div>
    </div>
  )
}

function RankFlip({ rank, play }: { rank: string; play: boolean }) {
  const reduced = useReducedMotion()
  return (
    <span style={{ display: 'inline-block', overflow: 'hidden', height: '2cqw', lineHeight: '2cqw' }}>
      <span
        style={{
          display: 'block',
          fontFamily: 'var(--font-display)',
          fontSize: '1.9cqw',
          fontWeight: 600,
          color: 'var(--ink)',
          fontVariantNumeric: 'tabular-nums',
          transform: play ? 'translateY(0)' : 'translateY(2cqw)',
          transition: reduced ? 'none' : `transform 0.5s ${cb} 0.15s`
        }}
      >
        {rank}
      </span>
    </span>
  )
}

function Head({ children, center }: { children: ReactNode; center?: boolean }) {
  return (
    <span style={{ fontSize: '1.2cqw', fontWeight: 600, color: 'var(--ink-60)', textAlign: center ? 'center' : 'left', lineHeight: 1.2 }}>{children}</span>
  )
}

function Pill({ children, positive }: { children: ReactNode; positive: boolean }) {
  return (
    <span
      style={{
        fontSize: '1.05cqw',
        fontWeight: 600,
        padding: '0.25cqw 0.9cqw',
        borderRadius: '999px',
        whiteSpace: 'nowrap',
        color: positive ? POSITIVE : NEG,
        background: positive ? 'var(--positive-bg)' : 'rgba(229,72,77,0.12)',
        border: `1px solid ${positive ? 'var(--positive-border)' : 'rgba(229,72,77,0.3)'}`
      }}
    >
      {children}
    </span>
  )
}

function InsightCard({
  children,
  icon,
  iconColor,
  title,
  titleColor,
  shown
}: {
  children: ReactNode
  icon: ReactNode
  iconColor: string
  title: string
  titleColor?: string
  shown: boolean
}) {
  const reduced = useReducedMotion()
  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: '1.4cqw',
        padding: '1.6cqw',
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : 'translateY(1.2cqw)',
        transition: reduced ? 'none' : `opacity 0.5s ${cb}, transform 0.5s ${cb}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9cqw', marginBottom: '0.9cqw' }}>
        <span style={{ color: iconColor, display: 'inline-flex' }}>{icon}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3cqw', fontWeight: 700, letterSpacing: '0.06em', color: titleColor || 'var(--ink)' }}>{title}</span>
      </div>
      <p style={{ margin: 0, fontSize: '1.2cqw', lineHeight: 1.5, color: 'var(--ink-70)' }}>{children}</p>
    </div>
  )
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 8l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ArrowIcon({ up }: { up?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden style={{ transform: up ? 'none' : 'rotate(180deg)' }}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 16V8M8.5 11.5L12 8l3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function RangeToggle() {
  const opts = ['7d', '30d', '90d']
  return (
    <div style={{ display: 'flex', gap: '0.4cqw', padding: '0.4cqw', borderRadius: '999px', background: 'var(--subtle)', border: '1px solid var(--line)', fontSize: '1.1cqw' }}>
      {opts.map((o) => (
        <span key={o} style={{ padding: '0.4cqw 1.1cqw', borderRadius: '999px', background: o === '30d' ? 'var(--ink)' : 'transparent', color: o === '30d' ? 'var(--white)' : 'var(--ink-50)', fontWeight: o === '30d' ? 600 : 500 }}>
          {o}
        </span>
      ))}
    </div>
  )
}

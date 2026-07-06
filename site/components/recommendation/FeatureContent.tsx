'use client'

/**
 * Recommendation Engine — feature page composer.
 *
 * ALL body copy below is verbatim and in order. Structure and visuals are built
 * AROUND the copy; not a word is reworded, added, or omitted. The page ships
 * LIGHT (#FAF9F7), matching the homepage's locked palette and the Brand Audit /
 * Brand Perception feature pages. Narrative arc: diagnose → fix → measure.
 */

import { type CSSProperties, type ReactNode } from 'react'
import { trackCta } from '@/lib/analytics'
import { openCalendly } from '@/lib/openCalendly'
import {
  S_CONTAINER,
  S_DISPLAY_LG,
  S_LEAD,
  S_BODY,
  MONO,
  MonoEyebrow,
  NumberedSection,
  Panel,
  Reveal,
  ArrowRight,
} from './primitives'
import { HeroContrast } from './HeroContrast'
import { GapCards } from './GapCards'
import { RecommendationCard } from './RecommendationCard'
import { MonitoringMotif } from './MonitoringMotif'
import { OutcomePanel } from './OutcomePanel'
import { InsightToImprovement } from './InsightToImprovement'

const bodyLead: CSSProperties = { ...S_LEAD, margin: 0 }
const bodyLeadStack: CSSProperties = { ...S_LEAD, margin: '1rem 0 0' }

/* ── 00 — HERO ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section data-track-location="recommendation_engine_hero" style={{ position: 'relative', overflow: 'hidden' }}>
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
          <h1 style={{ ...S_DISPLAY_LG, fontSize: 'clamp(2rem, 3.2vw + 0.4rem, 3.35rem)', margin: 0 }}>
            Most AI visibility platforms give you dashboards. Clovion gives you fixes.
          </h1>
          <p style={{ ...S_LEAD, maxWidth: 660, margin: '1.75rem 0 0' }}>
            Dashboards help you understand what&rsquo;s happening. Recommendations help you improve it.
          </p>
          <p style={{ ...S_LEAD, maxWidth: 680, margin: '1rem 0 0' }}>
            Clovion analyzes how AI models cite, describe, and compare your brand, then turns those patterns into
            prioritized recommendations your team can act on.
          </p>
          <div style={{ marginTop: 34, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onClick={() => openCalendly('recommendation_engine_hero')}
            >
              Book a Demo <ArrowRight />
            </button>
            <a
              className="btn btn-secondary btn-lg"
              href="/free-ai-visibility-score"
              onClick={() => trackCta('Get Free Score', 'recommendation_engine_hero', { href: '/free-ai-visibility-score' })}
            >
              Get Free Score
            </a>
          </div>
        </div>
        <div style={{ marginTop: 'clamp(2.75rem, 5vw, 4rem)' }}>
          <HeroContrast />
        </div>
      </div>
    </section>
  )
}

/* ── "Every Recommendation Includes" — verbatim definitions ───────── */
const INCLUDES = [
  { term: 'What Clovion found', def: 'A clear explanation of the gap affecting your AI visibility.' },
  {
    term: 'Why it matters',
    def: 'How the gap may influence whether AI cites, recommends, or accurately describes your brand.',
  },
  {
    term: 'What to fix',
    def: 'A practical action tied to the right fix class: source presence, substance, or framing.',
  },
  { term: 'Where to act', def: 'The specific page, source, or surface where the change should happen.' },
]

function IncludesBlock() {
  return (
    <div className="rec-includes" style={{ display: 'grid', gap: 'clamp(2rem, 4vw, 3rem)', gridTemplateColumns: '1fr', alignItems: 'start' }}>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 4 }}>
        {INCLUDES.map((item, i) => (
          <Reveal key={item.term} delay={i * 70} y={12} as="li">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2rem 1fr',
                gap: 14,
                padding: '16px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--line)',
              }}
            >
              <span
                aria-hidden
                style={{
                  ...MONO,
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--ink-40)',
                  fontVariantNumeric: 'tabular-nums',
                  paddingTop: 3,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--ink)' }}>
                  {item.term}
                </div>
                <p style={{ ...S_BODY, margin: '6px 0 0' }}>{item.def}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
      <Reveal delay={120} y={20}>
        <RecommendationCard />
      </Reveal>
      <style>{`
        @media (min-width: 940px) {
          .rec-includes { grid-template-columns: 0.82fr 1.18fr !important; gap: clamp(2.5rem, 4vw, 4rem) !important; }
        }
      `}</style>
    </div>
  )
}

/* ── CLOSING — high-contrast conversion band ───────────────────── */
function MiniStage({ label, done, current }: { label: string; done?: boolean; current?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 10px',
        borderRadius: 999,
        border: `1px solid ${current ? 'var(--positive-border)' : 'var(--on-ink-15)'}`,
        background: current ? 'var(--positive-bg)' : 'transparent',
        color: current ? 'var(--positive)' : done ? 'var(--on-ink-70)' : 'var(--on-ink-50)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ height: 5, width: 5, borderRadius: 999, background: current ? 'var(--positive)' : done ? 'var(--on-ink-70)' : 'var(--on-ink-40)' }} />
      {label}
    </span>
  )
}

function ClosingCTA() {
  return (
    <section data-track-location="recommendation_engine_final_cta" style={{ padding: 'var(--section) 0' }}>
      <div style={S_CONTAINER}>
        <Panel
          className="clv-dark"
          background="var(--ink-surface)"
          radius={28}
          pad={0}
          cell={26}
          style={{ boxShadow: '0 30px 80px -40px rgba(0,0,0,0.8)' }}
        >
          <div
            className="rec-cta-grid"
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'center',
              padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3.5rem)',
            }}
          >
            <div style={{ maxWidth: 520 }}>
              <MonoEyebrow color="var(--on-ink-70)">Recommendation Engine</MonoEyebrow>
              <div style={{ marginTop: 26 }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  onClick={() => openCalendly('recommendation_engine_final_cta')}
                >
                  Book a Demo <ArrowRight />
                </button>
              </div>
            </div>
            {/* on-brand decorative motif — the lifecycle, no added copy */}
            <div aria-hidden style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start' }}>
              <MiniStage label="Baselined" done />
              <MiniStage label="Issued" done />
              <MiniStage label="Implemented" done />
              <MiniStage label="Measuring" current />
              <MiniStage label="Resolved" />
            </div>
          </div>
        </Panel>
      </div>
      <style>{`
        @media (min-width: 820px) {
          .rec-cta-grid { grid-template-columns: 1.05fr 0.95fr !important; }
        }
      `}</style>
    </section>
  )
}

/* ── PAGE ──────────────────────────────────────────────────────── */
export default function FeatureContent() {
  return (
    <>
      <Hero />

      {/* 01 — Find The Gap. Fix The Cause. */}
      <NumberedSection n="01" title="Find The Gap. Fix The Cause." visual={<GapCards />} />

      {/* 02 — Every Recommendation Includes */}
      <NumberedSection n="02" title="Every Recommendation Includes" visual={<IncludesBlock />} background="var(--subtle)" />

      {/* 03 — We Don't Stop There */}
      <NumberedSection n="03" title="We Don't Stop There" visual={<MonitoringMotif />}>
        <p style={bodyLead}>We help you measure whether your changes actually worked.</p>
        <p style={bodyLeadStack}>
          Once a recommendation has been implemented, Clovion continues monitoring the prompts, citations, sources, and
          visibility metrics it was designed to influence.
        </p>
        <p style={bodyLeadStack}>
          You can see whether the recommendation is improving your AI visibility, whether more data is needed, or whether
          further action is required.
        </p>
      </NumberedSection>

      {/* 04 — Track The Outcome */}
      <NumberedSection n="04" title="Track The Outcome" visual={<OutcomePanel />} background="var(--subtle)" />

      {/* 05 — From Insight To Improvement */}
      <NumberedSection n="05" title="From Insight To Improvement" visual={<InsightToImprovement />}>
        <p style={bodyLead}>Clovion doesn&rsquo;t just show you where your AI visibility is weak.</p>
        <p style={bodyLeadStack}>
          It identifies the type of gap, recommends the right fix, and helps you track whether that fix changed how AI
          represents your brand.
        </p>
      </NumberedSection>

      <ClosingCTA />
    </>
  )
}

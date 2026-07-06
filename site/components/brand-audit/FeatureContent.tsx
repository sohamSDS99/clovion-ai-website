'use client'

import { type CSSProperties } from 'react'
import { trackCta } from '@/lib/analytics'
import { openCalendly } from '@/lib/openCalendly'
import {
  S_CONTAINER,
  S_DISPLAY_LG,
  S_LEAD,
  ArrowRight,
  MonoEyebrow,
  NumberedSection,
  Panel,
} from './primitives'
import { HeroScan } from './HeroScan'
import { AuditComparison } from './AuditComparison'
import { FourAreas } from './FourAreas'
import { FindingCard } from './FindingCard'
import { RecommendationTypes } from './RecommendationTypes'
import { FreshnessTimeline } from './FreshnessTimeline'
import { AuditToAction } from './AuditToAction'

/* ── 00 — HERO ─────────────────────────────────────────────────── */
function Hero() {
  return (
    <section data-track-location="brand_audit_hero" style={{ position: 'relative', overflow: 'hidden' }}>
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
        <div style={{ maxWidth: 780 }}>
          <h1 style={{ ...S_DISPLAY_LG, fontSize: 'clamp(2rem, 3.4vw + 0.3rem, 3.4rem)', margin: 0 }}>
            Understand how AI engines see your brand before you start optimizing.
          </h1>
          <p style={{ ...S_LEAD, maxWidth: 660, margin: '1.75rem 0 0' }}>
            Before tracking prompts or generating recommendations, Clovion performs a comprehensive audit of your AI
            footprint. It reviews your website, the third-party sources AI engines rely on, and the information
            available about your business to identify what&rsquo;s helping&mdash;or limiting&mdash;your AI visibility.
            The findings become the foundation for every recommendation that follows.
          </p>
          <div style={{ marginTop: 34, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a
              className="btn btn-primary btn-lg"
              href="https://app.clovion.ai/signup"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              onClick={() => trackCta('View Brand Audit', 'brand_audit_hero', { href: 'https://app.clovion.ai/signup' })}
            >
              View Brand Audit <ArrowRight />
            </a>
          </div>
        </div>
        <div style={{ marginTop: 'clamp(2.75rem, 5vw, 4rem)' }}>
          <HeroScan />
        </div>
      </div>
    </section>
  )
}

/* ── CLOSING — high-contrast conversion band ───────────────────── */
function ClosingCTA() {
  return (
    <section data-track-location="brand_audit_final_cta" style={{ padding: 'var(--section) 0' }}>
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
            <div style={{ maxWidth: 680 }}>
              <MonoEyebrow color="var(--on-ink-70)">Start with an audit</MonoEyebrow>
              <h2 style={{ ...S_DISPLAY_LG, margin: '20px 0 0', color: 'var(--on-ink)' }}>
                Discover what AI already knows about your brand.
              </h2>
              <p
                style={{
                  ...S_LEAD,
                  color: 'var(--on-ink-70)',
                  marginTop: 22,
                  maxWidth: 600,
                }}
              >
                Run a comprehensive Brand Audit and uncover the gaps affecting your AI visibility before they affect
                your buyers.
              </p>
              <div style={{ marginTop: 34, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
                  onClick={() => openCalendly('brand_audit_final_cta')}
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

/* ── Section body helper ───────────────────────────────────────── */
const bodyStyle: CSSProperties = { ...S_LEAD, margin: 0 }

/* ── Page ──────────────────────────────────────────────────────── */
export default function FeatureContent() {
  return (
    <>
      <Hero />

      {/* 01 — An Audit Built For AI Search */}
      <NumberedSection n="01" title="An Audit Built For AI Search" visual={<AuditComparison />}>
        <p style={bodyStyle}>
          Traditional site audits look for technical SEO issues. Clovion audits the information AI engines actually
          learn from. Instead of asking &ldquo;Is your website optimized?&rdquo; we ask:
        </p>
      </NumberedSection>

      {/* 02 — Four Areas Every Audit Covers */}
      <NumberedSection n="02" title="Four Areas Every Audit Covers" visual={<FourAreas />} />

      {/* 03 — Every Finding Is Traceable */}
      <NumberedSection n="03" title="Every Finding Is Traceable" visual={<FindingCard />}>
        <p style={bodyStyle}>
          The Brand Audit isn&rsquo;t a checklist of generic warnings. Every finding includes the supporting context
          that led to it.
        </p>
      </NumberedSection>

      {/* 04 — Recommendations Start Here */}
      <NumberedSection n="04" title="Recommendations Start Here" visual={<RecommendationTypes />}>
        <p style={bodyStyle}>
          The Brand Audit doesn&rsquo;t just identify problems. It classifies each finding into the type of improvement
          that&rsquo;s needed.
        </p>
      </NumberedSection>

      {/* 05 — Always Up To Date */}
      <NumberedSection n="05" title="Always Up To Date" visual={<FreshnessTimeline />}>
        <p style={bodyStyle}>
          Run the Brand Audit whenever you want&mdash;or let Clovion perform it automatically as your AI visibility
          evolves. Each new audit validates previous findings, identifies new issues, and keeps your recommendations
          aligned with the latest information AI engines are using.
        </p>
      </NumberedSection>

      {/* 06 — From Audit To Action */}
      <NumberedSection n="06" title="From Audit To Action" visual={<AuditToAction />}>
        <p style={bodyStyle}>The Brand Audit is the first step in Clovion&rsquo;s improvement workflow.</p>
      </NumberedSection>

      <ClosingCTA />
    </>
  )
}

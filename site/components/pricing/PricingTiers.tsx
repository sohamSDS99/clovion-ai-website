'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { openCalendly } from '@/lib/openCalendly'

const P_MONO_LABEL = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: 'var(--ink-50)',
}

type Tier = {
  name: string
  tagline: string
  monthly?: number
  custom?: boolean
  popular?: boolean
  dark?: boolean
  blurb: string
  cta: string
  ctaVariant: 'primary' | 'secondary' | 'invert' | 'ghost'
  includesLabel: string
  includes: string[]
  bestFor: string
}

const P_TIERS: Tier[] = [
  {
    name: 'Starter',
    tagline: 'For brands getting started with AI visibility',
    monthly: 79,
    blurb: 'Start tracking how your brand appears in AI-generated answers with essential visibility and sentiment insights.',
    cta: 'Start Tracking',
    ctaVariant: 'secondary',
    includesLabel: 'Includes',
    includes: [
      '50 prompts',
      '2 AI models (ChatGPT, Google AI Overview)',
      'AI Visibility Tracking',
      'Brand Perception',
      'Basic GEO Recommendations',
      'Brand mention tracking',
      'Positive, negative & neutral sentiment breakdown',
      'Entry-level reporting',
    ],
    bestFor:
      'Small brands, founders, content teams, and marketers who want to understand their current AI visibility before scaling.',
  },
  {
    name: 'Growth',
    popular: true,
    dark: true,
    tagline: 'For teams ready to improve AI search performance',
    monthly: 229,
    blurb:
      'Track your brand across multiple AI engines, monitor competitor presence, and get deeper insight into how prompts influence your visibility.',
    cta: 'Choose Growth',
    ctaVariant: 'invert',
    includesLabel: 'Everything in Starter, plus',
    includes: [
      '100 prompts',
      '3 AI models (ChatGPT, Google AI Overview + choose 1)',
      'Prompt Tracking',
      'Competitor Analysis',
      'Fanout Query Insights',
      'AI Crawlability Checks',
      'Prompt Volume Insights',
      'Advanced GEO Recommendations',
      'Multi-model visibility tracking',
      'Deeper Brand Perception Analysis',
      'Includes everything in Starter',
    ],
    bestFor:
      'SEO teams, growth marketers, agencies, SaaS companies, and brands actively optimizing for generative search.',
  },
  {
    name: 'Enterprise',
    tagline: 'For brands that need full AI search intelligence',
    custom: true,
    blurb:
      'Built for companies that need unlimited tracking, custom prompt strategies, deeper reporting, and full model coverage.',
    cta: 'Talk to Sales',
    ctaVariant: 'secondary',
    includesLabel: 'Everything in Growth, plus',
    includes: [
      'Unlimited prompts',
      'All available AI models',
      'Fully customizable prompt tracking',
      'Choose from all models',
      'Custom AI visibility reporting',
      'Custom competitor tracking',
      'Advanced GEO strategy support',
      'Enterprise-level prompt setup',
      'Scalable tracking for multiple brands, markets & product lines',
      'Priority support',
      'Includes everything in Growth',
    ],
    bestFor:
      'Enterprise brands, agencies managing multiple clients, global marketing teams, and companies building a serious AI search strategy.',
  },
]

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US')
}

function BoldCheck({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10m-4-4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TierCard({ t, billing }: { t: Tier; billing: 'monthly' | 'annual' }) {
  const dark = !!t.dark
  const c = {
    ink: dark ? 'var(--on-ink)' : 'var(--ink)',
    sub: dark ? 'var(--on-ink-70)' : 'var(--ink-60)',
    faint: dark ? 'var(--on-ink-50)' : 'var(--ink-50)',
    line: dark ? 'var(--on-ink-15)' : 'var(--line)',
    chip: dark ? 'var(--on-ink-05)' : 'var(--subtle)',
  }
  const annual = !t.custom && billing === 'annual'
  const perMo = t.custom ? null : annual ? Math.round((t.monthly as number) * 10 / 12) : (t.monthly as number)

  return (
    <div
      className={dark ? 'md:-translate-y-5' : ''}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 24,
        padding: '2rem',
        background: dark ? 'var(--ink-surface, var(--ink))' : 'var(--white)',
        color: c.ink,
        border: `${dark ? '2px' : '1px'} solid ${dark ? '#ffffff' : 'var(--line)'}`,
        boxShadow: dark ? '0 36px 80px -24px rgba(10,10,15,0.55)' : 'var(--shadow-card)',
      }}
    >
      {t.popular && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 22,
            transform: 'translateY(-50%)',
            zIndex: 2,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#000000',
            background: '#ffffff',
            borderRadius: 999,
            padding: '0.4rem 0.8rem',
            boxShadow: '0 6px 16px -6px rgba(10,10,15,0.5)',
          }}
        >
          Recommended
        </span>
      )}
      {dark && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 24,
            opacity: 0.5,
            pointerEvents: 'none',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
      )}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: c.ink,
            }}
          >
            {t.name}
          </span>
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '0.92rem', lineHeight: 1.5, color: c.sub }}>{t.tagline}</p>

        <div style={{ marginTop: 22, minHeight: 64 }}>
          {t.custom ? (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.6rem',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  color: c.ink,
                }}
              >
                Custom
              </span>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3rem',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: c.ink,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmt(perMo as number)}
                </span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: c.faint }}>/mo</span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: c.faint,
                }}
              >
                {annual
                  ? `${fmt((t.monthly as number) * 10)} billed yearly · 2 months free`
                  : `${fmt(t.monthly as number)} billed monthly`}
              </div>
            </>
          )}
        </div>

        <p style={{ margin: '18px 0 0', fontSize: '0.92rem', lineHeight: 1.6, color: c.sub }}>{t.blurb}</p>

        <div style={{ marginTop: 24 }}>
          <Button
            variant={t.ctaVariant}
            size="lg"
            className="w-full justify-center"
            // Non-sales tiers (Starter/Growth) route to signup; Talk to Sales
            // opens Calendly via onClick (no href).
            href={t.cta === 'Talk to Sales' ? undefined : 'https://app.clovion.ai/signup'}
            // Talk to Sales tiers: openCalendly owns the single tracked push
            // (book_demo w/ plan_name). trackLocation+trackEvent would fire a
            // second pricing_click push → two per-button events per click.
            trackLocation={t.cta === 'Talk to Sales' ? undefined : 'pricing_card'}
            trackEvent={t.cta === 'Talk to Sales' ? undefined : 'pricing_click'}
            trackPlan={t.cta === 'Talk to Sales' ? undefined : t.name}
            onClick={
              t.cta === 'Talk to Sales'
                ? (e) => {
                    e.preventDefault()
                    openCalendly('pricing_card', t.name, t.cta)
                  }
                : undefined
            }
          >
            {t.cta}
            {!t.custom && (
              <span style={{ display: 'inline-flex', marginLeft: 6 }}>
                <ArrowRight />
              </span>
            )}
          </Button>
        </div>

        <div style={{ marginTop: 28, paddingTop: 22, borderTop: `1px solid ${c.line}`, flex: 1 }}>
          <div style={{ ...P_MONO_LABEL, color: c.faint }}>{t.includesLabel}</div>
          <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'grid', gap: 11 }}>
            {t.includes.map((it) => (
              <li key={it} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <span
                  style={{
                    flexShrink: 0,
                    height: 18,
                    width: 18,
                    borderRadius: 999,
                    background: 'var(--ink-surface, var(--ink))',
                    color: 'var(--on-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BoldCheck size={11} />
                </span>
                <span
                  style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.45,
                    fontWeight: 400,
                    color: dark ? 'var(--on-ink)' : 'var(--ink-80)',
                  }}
                >
                  {it}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${c.line}` }}>
          <div style={{ ...P_MONO_LABEL, color: c.faint }}>Best for</div>
          <p style={{ margin: '10px 0 0', fontSize: '0.86rem', lineHeight: 1.55, color: c.sub }}>{t.bestFor}</p>
        </div>
      </div>
    </div>
  )
}

export default function PricingTiers() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14,
          flexWrap: 'wrap',
        }}
      >
        <div
          role="tablist"
          aria-label="Billing period"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: 4,
            background: 'var(--ink-04, rgba(10,10,15,0.04))',
            border: '1px solid var(--line)',
            borderRadius: 999,
          }}
        >
          {(
            [
              { label: 'Monthly', value: 'monthly' as const },
              { label: 'Annual', value: 'annual' as const },
            ]
          ).map((opt) => {
            const active = billing === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setBilling(opt.value)}
                style={{
                  appearance: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  letterSpacing: '-0.005em',
                  padding: '0.5rem 1rem',
                  borderRadius: 999,
                  background: active ? 'var(--ink-surface, var(--ink))' : 'transparent',
                  color: active ? 'var(--on-ink)' : 'var(--ink-70)',
                  transition: 'background 200ms var(--ease-out-expo), color 200ms var(--ease-out-expo)',
                }}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: 'var(--positive)',
            background: 'var(--positive-bg)',
            border: '1px solid var(--positive-border)',
            borderRadius: 999,
            padding: '0.4rem 0.8rem',
          }}
        >
          <span style={{ height: 6, width: 6, borderRadius: 999, background: 'var(--positive)' }} />
          Save with annual — 2 months free
        </span>
      </div>
      <div
        className="mt-11 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6"
        style={{
          alignItems: 'stretch',
        }}
      >
        {P_TIERS.map((t) => (
          <TierCard key={t.name} t={t} billing={billing} />
        ))}
      </div>
    </div>
  )
}

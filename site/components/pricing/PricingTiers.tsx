'use client'

import { Button } from '@/components/ui'
import { openCalendly } from '@/lib/openCalendly'

/* ── Tier data — source of truth is the pricing content spec ───────
   Starter $119/mo (launch $95), Growth $319/mo (launch $255),
   Enterprise custom. Monthly launch = 20% off first 3 months.
   Annual = 10× base (2 months free) then 20% launch off. */
type Tier = {
  name: string
  desc: string
  base?: number
  custom?: boolean
  popular?: boolean
  cta: string
  featLead?: string
  features: string[]
}

const P_TIERS: Tier[] = [
  {
    name: 'Starter',
    desc: 'For solo marketers getting started with AI visibility.',
    base: 119,
    cta: 'Start free trial',
    features: [
      '1 AI engine',
      '50 prompts tracked',
      '1 brand',
      'Sentiment analysis',
      'Competitor analysis (5)',
      'Limited brand audit',
      'Citation tracking',
      'Google Analytics',
    ],
  },
  {
    name: 'Growth',
    desc: 'For growing teams that need deeper AI search insights.',
    base: 319,
    popular: true,
    cta: 'Start free trial',
    featLead: 'Everything in Starter, plus:',
    features: [
      '3 AI engines',
      '150 prompts per brand',
      '2 brands',
      '20 recommendations/mo',
      'Brand perception',
      'Full competitor analysis',
      'Fanout query analysis',
      'Full brand audit',
      'Ask Clove (10 questions)',
      'Integrations',
    ],
  },
  {
    name: 'Enterprise',
    desc: 'For agencies and brands managing AI visibility at scale.',
    custom: true,
    cta: 'Talk to sales',
    featLead: 'Everything in Growth, plus:',
    features: [
      '6 AI engines',
      'Unlimited prompt tracking',
      'Unlimited brands',
      'Unlimited recommendations',
      'Region-level tracking',
      'Ask Clove (unlimited)',
      'AI Agents',
      'Priority support & onboarding',
    ],
  },
]

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US')
}

/** Price + offer copy for a tier at a given billing mode. Mirrors the
 *  launch-offer math in the source pricing spec exactly. */
export function priceView(base: number, billing: 'monthly' | 'annual') {
  if (billing === 'monthly') {
    return {
      was: fmt(base),
      now: fmt(Math.round(base * 0.8)),
      per: '/mo',
      offer: `20% launch discount for your first 3 months, then ${fmt(base)}/mo`,
    }
  }
  const annualFull = base * 10
  const annualLaunch = Math.round(annualFull * 0.8)
  const perMonth = Math.round(annualLaunch / 12)
  return {
    was: fmt(annualFull),
    now: fmt(annualLaunch),
    per: '/yr',
    offer: `2 months free + 20% launch discount (about ${fmt(perMonth)}/mo)`,
  }
}

function Check({ size = 14, color = 'var(--positive)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
      <path d="M20 6 9 17l-5-5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TierCard({ t, billing }: { t: Tier; billing: 'monthly' | 'annual' }) {
  const popular = !!t.popular
  const pv = t.custom ? null : priceView(t.base as number, billing)
  const isSales = t.cta === 'Talk to sales'

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--white)',
        border: popular ? '2px solid var(--positive)' : '1px solid var(--line)',
        borderRadius: 'var(--radius-card, 18px)',
        padding: '1.75rem 1.5rem',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {popular && (
        <span
          style={{
            position: 'absolute',
            top: -13,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--positive)',
            color: 'var(--on-ink, #ffffff)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.25rem 0.875rem',
            borderRadius: 999,
            whiteSpace: 'nowrap',
          }}
        >
          Most popular
        </span>
      )}

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'var(--ink)',
          margin: 0,
        }}
      >
        {t.name}
      </h3>
      <p style={{ margin: '6px 0 18px', fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--ink-60)', minHeight: 38 }}>
        {t.desc}
      </p>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 9, minHeight: 52, marginBottom: 8 }}>
        {t.custom ? (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.125rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              lineHeight: 1,
            }}
          >
            Custom
          </span>
        ) : (
          <>
            <span style={{ fontSize: '1.2rem', color: 'var(--ink-40)', textDecoration: 'line-through', fontWeight: 500 }}>
              {pv!.was}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.375rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
                lineHeight: 1,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {pv!.now}
            </span>
            <span style={{ fontSize: '0.875rem', color: 'var(--ink-70)' }}>{pv!.per}</span>
          </>
        )}
      </div>

      {/* Offer line */}
      <p
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 6,
          fontSize: '0.78rem',
          fontWeight: t.custom ? 400 : 600,
          lineHeight: 1.45,
          color: t.custom ? 'var(--ink-60)' : 'var(--positive)',
          minHeight: 34,
          margin: '0 0 16px',
        }}
      >
        {!t.custom && <Check size={14} />}
        <span>{t.custom ? 'Tailored to your volume and brand count' : pv!.offer}</span>
      </p>

      {/* CTA */}
      <Button
        variant={popular ? 'primary' : 'secondary'}
        size="md"
        className="w-full justify-center"
        // Starter/Growth → signup (same-tab, in-product). Enterprise "Talk to
        // sales" opens Calendly via onClick (no href).
        href={isSales ? undefined : 'https://app.clovion.ai/signup'}
        // Tier cards track pricing_click + plan_name (per the cta_location
        // convention). Sales tier lets openCalendly own the single book_demo
        // push — no trackLocation/trackEvent to avoid a double fire.
        trackLocation={isSales ? undefined : 'pricing_card'}
        trackEvent={isSales ? undefined : 'pricing_click'}
        trackPlan={isSales ? undefined : t.name}
        onClick={
          isSales
            ? (e) => {
                e.preventDefault()
                openCalendly('pricing_card', t.name, t.cta)
              }
            : undefined
        }
      >
        {t.cta}
      </Button>

      {/* Feature list */}
      <div style={{ marginTop: 24 }}>
        {t.featLead && (
          <div style={{ fontSize: '0.75rem', color: 'var(--ink-60)', marginBottom: 10 }}>{t.featLead}</div>
        )}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11, fontSize: '0.85rem', color: 'var(--ink-70)' }}>
          {t.features.map((f) => (
            <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
              <Check size={15} />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function PricingTiers({ billing }: { billing: 'monthly' | 'annual' }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-4" style={{ alignItems: 'start' }}>
      {P_TIERS.map((t) => (
        <TierCard key={t.name} t={t} billing={billing} />
      ))}
    </div>
  )
}

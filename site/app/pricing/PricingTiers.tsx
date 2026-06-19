'use client'

import { useState } from 'react'
import { Button, Tag, ArrowRight, Check } from '@/components/ui'
import { pricingTiers } from '@/lib/content'
import { cn } from '@/lib/cn'

export function PricingTiers() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div>
      {/* Billing toggle */}
      <div className="flex items-center gap-4">
        <div
          className="inline-flex items-center rounded-full border border-line bg-white p-1"
          role="tablist"
          aria-label="Billing period"
        >
          <button
            type="button"
            role="tab"
            aria-selected={billing === 'monthly'}
            onClick={() => setBilling('monthly')}
            className={cn(
              'px-4 py-1.5 text-sm rounded-full transition-colors',
              billing === 'monthly'
                ? 'bg-ink text-white'
                : 'text-ink/70 hover:text-ink'
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={billing === 'annual'}
            onClick={() => setBilling('annual')}
            className={cn(
              'px-4 py-1.5 text-sm rounded-full transition-colors',
              billing === 'annual'
                ? 'bg-ink text-white'
                : 'text-ink/70 hover:text-ink'
            )}
          >
            Annual
          </button>
        </div>
        <Tag className="font-mono">Save 17% annual</Tag>
      </div>

      {/* Tier cards */}
      <div className="mt-10 grid gap-5 lg:grid-cols-4">
        {pricingTiers.map((tier) => {
          const isCustom = tier.price === 'Custom'
          const isFree = tier.price === '$0'
          const numeric = Number(tier.price.replace(/[^0-9]/g, ''))
          const displayPrice = isCustom
            ? 'Custom'
            : isFree
            ? '$0'
            : billing === 'annual'
            ? `$${Math.round(numeric * 0.83)}`
            : tier.price
          const suffix = isCustom ? '' : isFree ? '' : '/mo'
          const detail = isCustom
            ? tier.priceDetail
            : isFree
            ? tier.priceDetail
            : billing === 'annual'
            ? 'billed annually, per month'
            : tier.priceDetail
          const isHighlight = tier.highlight

          const ctaHref =
            tier.cta === 'Talk to sales'
              ? '/pricing#enterprise'
              : tier.cta === 'Get Free Score'
              ? '/free-ai-visibility-score'
              : '/pricing'

          return (
            <div
              key={tier.name}
              className={cn(
                'relative rounded-2xl border p-7 flex flex-col',
                isHighlight
                  ? 'bg-ink text-white border-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                  : 'bg-white border-line'
              )}
            >
              {isHighlight && (
                <span
                  className="absolute top-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  aria-hidden
                />
              )}

              <div className="flex items-baseline justify-between">
                <h3 className="display-sm">{tier.name}</h3>
              </div>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span
                  className={cn(
                    'font-mono text-[2.5rem] leading-none tracking-tight',
                    isHighlight ? 'text-white' : 'text-ink'
                  )}
                >
                  {displayPrice}
                </span>
                {suffix && (
                  <span
                    className={cn(
                      'font-mono text-sm',
                      isHighlight ? 'text-white/60' : 'text-ink/60'
                    )}
                  >
                    {suffix}
                  </span>
                )}
              </div>
              <div
                className={cn(
                  'mt-2 font-mono text-xs uppercase tracking-wider',
                  isHighlight ? 'text-white/55' : 'text-ink/50'
                )}
              >
                {detail}
              </div>

              <p
                className={cn(
                  'mt-5 text-sm leading-relaxed',
                  isHighlight ? 'text-white/75' : 'text-ink/70'
                )}
              >
                {tier.description}
              </p>

              <ul className="mt-6 space-y-2.5 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={cn(
                        'mt-0.5 shrink-0',
                        isHighlight ? 'text-white' : 'text-ink'
                      )}
                    />
                    <span
                      className={cn(
                        isHighlight ? 'text-white/85' : 'text-ink/80'
                      )}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Button
                  href={ctaHref}
                  variant={isHighlight ? 'invert' : 'primary'}
                  className="w-full justify-center"
                  trackEvent="pricing_click"
                  trackPlan={tier.name}
                  trackLocation="pricing_card"
                >
                  {tier.cta}
                  <ArrowRight />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

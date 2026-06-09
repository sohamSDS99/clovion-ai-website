import { Fragment } from 'react'
import Link from 'next/link'
import {
  Container,
  Section,
  Button,
  Card,
  Eyebrow,
  ArrowRight,
  HairlineDivider,
  HeroShade
} from '@/components/ui'
import { FAQ } from '@/components/sections'
import { pricingTiers, addOns, faqs } from '@/lib/content'
import { cn } from '@/lib/cn'
import { PricingTiers } from './PricingTiers'

export const metadata = {
  title: 'Pricing | Clovion AI',
  description:
    'Self-serve from $0. Scale on prompts, engines, and competitors. Enterprise terms when you need them. Transparent pricing, no hidden steps, no surprise line items.'
}

// ---------------------------------------------------------------------------
// Local data — comparison matrix (40+ rows across 5 sections)
// ---------------------------------------------------------------------------

const pricingMatrix = [
  {
    section: 'Core',
    rows: [
      { label: 'AI engines tracked', cells: ['4', '6', '10', '10'] },
      { label: 'Tracked prompts', cells: ['20', '100', '500', 'Unlimited'] },
      { label: 'Brands', cells: ['1', '1', '5', 'Unlimited'] },
      { label: 'Domains', cells: ['1', '3', 'Unlimited', 'Unlimited'] },
      { label: 'Refresh cadence', cells: ['Weekly', 'Daily', 'Daily', 'Daily'] },
      { label: 'Sentiment intelligence', cells: ['—', '✓', '✓', '✓'] },
      { label: 'Citation tracking', cells: ['Basic', '✓', '✓', '✓'] },
      { label: 'GEO fix list', cells: ['Top 10', 'Full', 'Full', 'Full'] },
      { label: 'GA4 and Search Console', cells: ['—', '✓', '✓', '✓'] },
      { label: 'Dashboard access', cells: ['✓', '✓', '✓', '✓'] }
    ]
  },
  {
    section: 'Engine coverage',
    rows: [
      { label: 'ChatGPT', cells: ['✓', '✓', '✓', '✓'] },
      { label: 'Claude', cells: ['✓', '✓', '✓', '✓'] },
      { label: 'Gemini', cells: ['✓', '✓', '✓', '✓'] },
      { label: 'Perplexity', cells: ['✓', '✓', '✓', '✓'] },
      { label: 'Google AI Overviews', cells: ['—', '✓', '✓', '✓'] },
      { label: 'Google AI Mode', cells: ['—', '✓', '✓', '✓'] },
      { label: 'Copilot', cells: ['—', '—', '✓', '✓'] },
      { label: 'Grok, Meta AI, DeepSeek', cells: ['—', '—', '✓', '✓'] }
    ]
  },
  {
    section: 'GEO suggestions',
    rows: [
      { label: 'Schema and structured-data patches', cells: ['—', '✓', '✓', '✓'] },
      { label: 'Citation path recommendations', cells: ['—', '✓', '✓', '✓'] },
      { label: 'Content gap analysis', cells: ['—', '—', '✓', '✓'] },
      { label: 'Retrieval-shaped content drafts', cells: ['—', '—', '✓', '✓'] },
      { label: 'Before-and-after lift tracking', cells: ['—', '—', '✓', '✓'] },
      { label: 'Scheduled fix automation', cells: ['—', '—', '—', '✓'] }
    ]
  },
  {
    section: 'Integrations',
    rows: [
      { label: 'WordPress', cells: ['—', '✓', '✓', '✓'] },
      { label: 'Sanity', cells: ['—', '✓', '✓', '✓'] },
      { label: 'Contentful', cells: ['—', '—', '✓', '✓'] },
      { label: 'Webflow', cells: ['—', '✓', '✓', '✓'] },
      { label: 'Shopify', cells: ['—', '—', '✓', '✓'] },
      { label: 'Salesforce', cells: ['—', '—', '✓', '✓'] },
      { label: 'HubSpot', cells: ['—', '—', '✓', '✓'] },
      { label: 'MCP server (Claude/ChatGPT)', cells: ['—', '—', '✓', '✓'] }
    ]
  },
  {
    section: 'Security and support',
    rows: [
      { label: 'SOC 2 Type II', cells: ['—', '—', '✓', '✓'] },
      { label: 'SSO (SAML, OIDC)', cells: ['—', '—', '—', '✓'] },
      { label: 'Role-based access control', cells: ['—', '—', 'Basic', 'Fine-grained'] },
      { label: 'Audit logs', cells: ['—', '—', '90 days', 'Unlimited'] },
      { label: 'Data residency (US, EU, APAC)', cells: ['—', '—', '—', '✓'] },
      { label: 'SLA', cells: ['—', '—', '99.9%', '99.99%'] },
      { label: 'Support channel', cells: ['Community', 'Email', 'Slack', 'Slack + on-call'] },
      { label: 'Response time', cells: ['Best effort', 'Next day', 'Same day', '15 min'] }
    ]
  }
]

// ---------------------------------------------------------------------------
// Pricing-only FAQs (subset of global + 3 new pricing-specific)
// ---------------------------------------------------------------------------

const pricingFaqs = [
  {
    q: 'How does pricing work?',
    a: faqs.find((f) => f.q === 'How does pricing work?')!.a
  },
  {
    q: 'What happens if I go over my prompt limit?',
    a: 'Nothing breaks. You get billed $0.20 per extra prompt for the month, prorated to the day. No tier upsell, no usage cliff. Most teams stay well inside their plan and use overage only during launches or audits.'
  },
  {
    q: 'Can I upgrade or downgrade my plan?',
    a: 'Either, anytime, in the dashboard. Upgrades take effect immediately and are prorated. Downgrades take effect at the end of your current billing period — you keep what you paid for until then.'
  },
  {
    q: 'Is there a free trial on the paid plans?',
    a: 'Starter and Growth come with a 14-day trial, no card required. You get the full feature set during the trial. If you do not upgrade, the workspace downgrades to Free automatically and your data stays.'
  },
  {
    q: 'How does the free score actually work?',
    a: faqs.find((f) => f.q === 'How does the free score actually work?')!.a
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel from the billing page in two clicks. You keep access through the end of the billing period, and we export your data on request. No exit fees, no win-back calls.'
  },
  {
    q: 'Do you offer refunds?',
    a: 'If something breaks on our side, we make it right with credit or refund, your call. We do not refund unused time on a plan you cancelled, but we will not chase you for the rest of the term either.'
  },
  {
    q: 'How is Clovion AI different from a traditional SEO tool?',
    a: faqs.find((f) => f.q === 'How is Clovion AI different from a traditional SEO tool?')!.a
  }
]

const usageDimensions = [
  {
    label: 'Per prompt',
    metric: '$0.20',
    unit: 'per prompt above plan',
    body: 'Pay for what you use. Applies after your monthly cap, prorated to the day, billed at the end of the cycle. No commitment beyond the month you use them.'
  },
  {
    label: 'Per engine',
    metric: '$25',
    unit: 'per engine, per month',
    body: 'Add an engine beyond your plan limit. When a new engine launches publicly, we add it within 30 days and it joins your plan automatically, no upsell.'
  },
  {
    label: 'Per domain',
    metric: '$19',
    unit: 'per domain, per month',
    body: 'Additional domains beyond your plan. Subdomains are free. Country variants like .co.uk and .de count as separate domains. White-labels stay on the parent.'
  }
]

const enterpriseCards = [
  {
    title: 'Data residency',
    body: 'Pick your region — US, EU, or APAC. Your data stays there, with documented subprocessor lists per region.'
  },
  {
    title: 'Dedicated SE and CSM',
    body: 'A named Solutions Engineer for the technical setup and a Customer Success Manager for the program rollout.'
  },
  {
    title: 'Custom SLAs',
    body: '99.99% uptime, 15-minute response on Sev-1, quarterly business reviews, and named on-call engineers.'
  },
  {
    title: 'MSA, BAA, procurement',
    body: 'Custom MSA, signed BAA for healthcare, vendor onboarding paperwork on the first call. We close in weeks, not quarters.'
  }
]

const salesContacts = [
  {
    label: 'Email sales',
    value: 'sales@clovion.ai',
    href: 'mailto:sales@clovion.ai',
    meta: 'Same-day reply'
  },
  {
    label: 'Security questionnaire',
    value: 'security@clovion.ai',
    href: 'mailto:security@clovion.ai',
    meta: 'SOC 2, GDPR, HIPAA'
  },
  {
    label: 'Partnerships',
    value: 'partners@clovion.ai',
    href: 'mailto:partners@clovion.ai',
    meta: 'Agencies, integrators'
  }
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <Section className="relative overflow-hidden">
        <HeroShade />
        <Container>
          <div className="max-w-4xl">
            <Eyebrow>Pricing</Eyebrow>
            <h1 className="display-lg mt-5 text-balance">
              Pricing built for teams.
            </h1>
            <p className="lead mt-6 max-w-2xl text-ink/70">
              Self-serve from day one. Scale on prompts, engines, and domains.
              Enterprise terms when you need them. No hidden steps.
            </p>
          </div>
        </Container>
      </Section>

      {/* Tier cards (client island — toggle + cards) */}
      <Section tight>
        <Container>
          <PricingTiers />
        </Container>
      </Section>

      {/* Usage transparency */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Usage</Eyebrow>
            <h2 className="display-md mt-4">
              What you see is what we charge.
            </h2>
            <p className="lead mt-5 text-ink/70">
              Three knobs, posted in plain text. No tier-jump cliffs, no
              surprise line items, no annual minimums on the self-serve plans.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {usageDimensions.map((u) => (
              <Card key={u.label} className="bg-white">
                <div className="font-mono text-xs uppercase tracking-wider text-ink/50">
                  {u.label}
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="font-mono text-4xl tracking-tight text-ink">
                    {u.metric}
                  </span>
                  <span className="font-mono text-xs text-ink/60">
                    {u.unit}
                  </span>
                </div>
                <p className="mt-5 text-sm text-ink/70 leading-relaxed">
                  {u.body}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-10 font-mono text-xs uppercase tracking-[0.18em] text-ink/50">
            What you see is what we charge.
          </div>
        </Container>
      </Section>

      {/* Comparison matrix — the signature 40+ row table */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Plan comparison</Eyebrow>
            <h2 className="display-md mt-4">
              Every line item, every plan, on one page.
            </h2>
            <p className="lead mt-5 text-ink/70">
              No marketing checklists or shaded asterisks. The full feature
              matrix is below. If something matters to you and is not on this
              table, ask us and we will add it.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-ink/15">
                  <th className="text-left py-4 pr-6 align-bottom">
                    <div className="font-mono text-xs uppercase tracking-wider text-ink/50">
                      Feature
                    </div>
                  </th>
                  {pricingTiers.map((t) => (
                    <th
                      key={t.name}
                      className="text-left py-4 px-4 align-bottom"
                    >
                      <div className="font-semibold text-ink">{t.name}</div>
                      <div className="mt-1 font-mono text-xs text-ink/55">
                        {t.price === 'Custom'
                          ? 'Custom'
                          : `${t.price}${t.price === '$0' ? '' : '/mo'}`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricingMatrix.map((section) => (
                  <Fragment key={section.section}>
                    <tr className="border-b border-line">
                      <td
                        colSpan={5}
                        className="pt-8 pb-2 font-mono text-xs uppercase tracking-[0.18em] text-ink/60"
                      >
                        {section.section}
                      </td>
                    </tr>
                    {section.rows.map((row) => (
                      <tr
                        key={`${section.section}-${row.label}`}
                        className="border-b border-line hover:bg-subtle/40 transition-colors"
                      >
                        <td className="py-3 pr-6 text-ink/80">{row.label}</td>
                        {row.cells.map((cell, i) => (
                          <td
                            key={i}
                            className={cn(
                              'py-3 px-4 align-middle font-mono text-[0.8rem]',
                              cell === '—' ? 'text-ink/30' : 'text-ink',
                              cell === '✓' && 'font-semibold'
                            )}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-sm text-ink/60">
            Missing something?{' '}
            <Link
              href="/contact"
              className="text-ink underline underline-offset-4 hover:no-underline"
            >
              Email sales
            </Link>{' '}
            and we will tell you straight whether it ships today, soon, or
            never.
          </div>
        </Container>
      </Section>

      {/* Add-ons */}
      <Section bg="subtle">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>Add-ons</Eyebrow>
              <h2 className="display-md mt-4">
                Flat-rate. Cancel any time. No seat tax.
              </h2>
              <p className="lead mt-5 text-ink/70">
                Three add-ons, each priced on the page. We do not run a
                quote-and-negotiate motion on self-serve. The same number you
                see is the number on the invoice.
              </p>
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-ink/50 max-w-xs">
              Outcome pricing. Charged only when it ships.
            </div>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {addOns.map((a) => (
              <Card key={a.name} className="bg-white">
                <div className="font-mono text-xs uppercase tracking-wider text-ink/50">
                  Add-on
                </div>
                <h3 className="display-sm mt-3">{a.name}</h3>
                <div className="mt-5 font-mono text-base text-ink">
                  {a.price}
                </div>
                <HairlineDivider className="my-5" />
                <p className="text-sm text-ink/70 leading-relaxed">
                  {a.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ — pricing-only subset (FAQ component is self-contained, wraps in Section) */}
      <FAQ
        items={pricingFaqs}
        heading="Questions buyers ask before they sign up."
        sub="If yours is not on the list, email sales@clovion.ai and we will answer in plain English, same day."
      />

      {/* Enterprise band */}
      <Section id="enterprise" bg="ink">
        <Container>
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7">
              <Eyebrow className="text-white/60">Enterprise</Eyebrow>
              <h2 className="display-lg mt-5 text-white text-balance">
                Enterprise teams get more.
              </h2>
              <p className="lead mt-6 text-white/70 max-w-2xl">
                Running GEO across a portfolio of brands, multiple regions, or
                in a regulated environment? Enterprise handles the parts the
                self-serve plans cannot.
              </p>

              <div className="mt-10 grid sm:grid-cols-2 gap-5">
                {enterpriseCards.map((c) => (
                  <div
                    key={c.title}
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
                  >
                    <div className="font-semibold text-white">{c.title}</div>
                    <p className="mt-2 text-sm text-white/65 leading-relaxed">
                      {c.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-white text-ink p-7">
                <div className="font-mono text-xs uppercase tracking-wider text-ink/50">
                  Talk to sales
                </div>
                <h3 className="display-sm mt-3">
                  See if we&apos;re a fit in 30 minutes.
                </h3>
                <p className="mt-4 text-sm text-ink/70 leading-relaxed">
                  A solutions engineer walks you through the platform, scopes
                  the rollout, and writes the commercial terms on the same
                  call. No discovery loops.
                </p>

                <div className="mt-7 space-y-3">
                  {salesContacts.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      className="block rounded-lg border border-line bg-bg p-4 transition-colors hover:border-ink/30"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="font-mono text-xs uppercase tracking-wider text-ink/50">
                          {c.label}
                        </div>
                        <div className="font-mono text-xs text-ink/40">
                          {c.meta}
                        </div>
                      </div>
                      <div className="mt-1.5 text-sm font-semibold text-ink">
                        {c.value}
                      </div>
                    </a>
                  ))}
                </div>

                <Button
                  href="mailto:sales@clovion.ai"
                  variant="primary"
                  className="mt-7 w-full justify-center"
                >
                  Talk to sales
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import LogoWall from './LogoWall'
import { TypingHeadline } from '@/components/home/TypingHeadline'
import { FAQAccordion } from '@/components/FAQAccordion'
import { customerStories, testimonials } from '@/lib/content'
import { openCalendly } from '@/lib/openCalendly'
import {
  ArrowRight,
  CheckIcon,
  CONTAINER,
  CTAButtons,
  DISPLAY_LG,
  DISPLAY_MD,
  Eyebrow,
  LEAD,
  trackCta,
  useReveal
} from './utils'

const CATEGORIES = ['All', 'Featured', 'SaaS', 'AI', 'Fintech', 'Consumer', 'Logistics', 'Marketing'] as const
type Category = (typeof CATEGORIES)[number]

type Customer = {
  name: string
  industry: Category
  outcome: string
  featured: boolean
}

const ROSTER: Customer[] = [
  { name: 'Linear', industry: 'SaaS', outcome: '+8.4x AI mentions', featured: true },
  { name: 'Vercel', industry: 'SaaS', outcome: '+5.2x dev citations', featured: true },
  { name: 'Webflow', industry: 'SaaS', outcome: '+4.6x share of voice', featured: true },
  { name: 'Ramp', industry: 'Fintech', outcome: '+3.2x citation share', featured: true },
  { name: 'Notion', industry: 'SaaS', outcome: '4 vendors replaced', featured: true },
  { name: 'Figma', industry: 'SaaS', outcome: 'Sentiment #1 in category', featured: true },
  { name: 'Loom', industry: 'SaaS', outcome: 'ChatGPT category recovered', featured: false },
  { name: 'Brex', industry: 'Fintech', outcome: '10 engines tracked', featured: false },
  { name: 'Mercury', industry: 'Fintech', outcome: '+2.4x AI citations', featured: false },
  { name: 'Hone', industry: 'Consumer', outcome: 'Score in 24h', featured: false },
  { name: 'Modal', industry: 'AI', outcome: 'Category leader on Claude', featured: false },
  { name: 'Replit', industry: 'AI', outcome: 'Citation paths mapped', featured: false },
  { name: 'Anthropic Labs', industry: 'AI', outcome: 'Schema patches shipped', featured: false },
  { name: 'Sourcegraph', industry: 'SaaS', outcome: '+4.1x code-tool queries', featured: false },
  { name: 'Posthog', industry: 'SaaS', outcome: '+3.4x Perplexity SoV', featured: false },
  { name: 'Supabase', industry: 'SaaS', outcome: 'Docs cited 2.8x more', featured: false },
  { name: 'Retool', industry: 'SaaS', outcome: '+6.1x dev queries', featured: false },
  { name: 'Census', industry: 'SaaS', outcome: 'Gemini visibility +210%', featured: false },
  { name: 'Plain', industry: 'SaaS', outcome: 'AI Mode entry tracked', featured: false },
  { name: 'Resend', industry: 'SaaS', outcome: '+5.0x dev citations', featured: false },
  { name: 'Lattice', industry: 'SaaS', outcome: 'Sentiment turnaround', featured: false },
  { name: 'Glean', industry: 'SaaS', outcome: 'Enterprise SoV doubled', featured: false },
  { name: 'DHL', industry: 'Logistics', outcome: 'Global query coverage', featured: false },
  { name: 'Canon', industry: 'Consumer', outcome: 'AI Overview citations +3.1x', featured: false },
  { name: 'Unilever', industry: 'Consumer', outcome: '12 brands tracked together', featured: false },
  { name: 'Reckitt', industry: 'Consumer', outcome: 'Sentiment baseline established', featured: false },
  { name: 'Netpower', industry: 'Marketing', outcome: 'Agency-grade reporting', featured: false },
  { name: 'SDS Manager', industry: 'Marketing', outcome: 'Regulated-search visibility', featured: false }
]

const METRICS = [
  { value: '200+', label: 'Production workspaces running daily' },
  { value: '7.1x', label: 'Average lift in AI mentions across the base' },
  { value: '24h', label: 'From signup to first visibility score' },
  { value: '10', label: 'AI engines tracked, refreshed daily' },
  { value: '90d', label: 'Median time to measurable lift' }
]

const FAQS = [
  {
    q: 'What kind of teams use Clovion?',
    a: 'Growth, SEO, content, and product marketing teams at companies where AI search is starting to shape pipeline. Roughly half our base is SaaS, the rest spans fintech, consumer brands, logistics, AI infrastructure, and global marketing teams running multi-brand portfolios.'
  },
  {
    q: 'How fast do customers see results?',
    a: 'Visibility score in 24 hours. First prioritized fix list inside seven days. Most teams ship their first batch of fixes within two weeks and see measurable score movement inside 30 days. The median time to a clearly visible lift is 90 days.'
  },
  {
    q: 'Do customers see a measurable lift in AI citations?',
    a: 'Yes. The average customer sees roughly 7.1x more brand mentions across ChatGPT, Claude, Gemini, and Perplexity after shipping the prioritized fix list. Before-and-after tracking is built into every shipped fix, so the lift is measured per change, not inferred from a dashboard refresh.'
  },
  {
    q: 'Are there enterprise case studies?',
    a: 'Yes. Customers like Unilever, Canon, DHL, and Reckitt run Clovion in production today across regulated industries, global brands, and multi-region deployments. Enterprise references are available under NDA on request.'
  },
  {
    q: 'Can I read a full case study?',
    a: 'The featured stories above cover Linear, Vercel, and Webflow with baselines, fix lists, and 90-day numbers. Longer-form case studies are available on request, and your customer engineer can share the full methodology behind any number you see on the page.'
  }
]

function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: -1,
          opacity: 0.5,
          background:
            'radial-gradient(ellipse 70% 55% at 70% 0%, rgba(10,10,15,0.06) 0%, rgba(10,10,15,0.02) 30%, transparent 70%)'
        }}
      />
      <div style={{ ...CONTAINER, padding: '7rem 2rem 5rem' }}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.02fr_1fr] md:gap-16 items-center">
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--ink-50)'
              }}
            >
              Two hundred brands. One AI loop.
            </p>
            <TypingHeadline
              as="h1"
              text="Brands that lead in AI search."
              style={{
                ...DISPLAY_LG,
                fontSize: 'clamp(1.8rem, 2.7vw + 0.3rem, 2.6rem)',
                margin: '14px 0 0'
              }}
            />
            <p style={{ ...LEAD, maxWidth: 540, margin: '1.75rem 0 0' }}>
              From Linear&apos;s docs to Notion&apos;s category leadership — see how the teams running Clovion turned AI visibility from a guess into a measured number.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <CTAButtons location="customers_hero" />
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: '0.86rem', color: 'var(--ink-60)' }}>
              {['200+ workspaces', '6 engines tracked', '90-day median lift'].map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span
                    style={{
                      height: 16,
                      width: 16,
                      borderRadius: 999,
                      background: '#ffffff',
                      color: '#0a0a0f',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckIcon size={10} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <LogoWall />
        </div>
      </div>
    </section>
  )
}

function MetricsStrip() {
  return (
    <section style={{ padding: 'var(--section-sm) 0' }}>
      <div style={CONTAINER}>
        <div
          style={{
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)',
            paddingTop: 28,
            paddingBottom: 28
          }}
        >
          <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:gap-x-6 md:grid-cols-5 md:gap-8">
            {METRICS.map((m, i) => (
              <div
                key={m.label}
                style={{
                  paddingLeft: i === 0 ? 0 : 0,
                  borderLeft: 'none'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: 'var(--ink)',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--ink-55, var(--ink-60))',
                    lineHeight: 1.45,
                    maxWidth: '26ch'
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StoryCard({
  story,
  i
}: {
  story: typeof customerStories[number]
  i: number
}) {
  const { ref, seen } = useReveal<HTMLDivElement>(0.18)
  return (
    <article
      ref={ref}
      style={{
        position: 'relative',
        background: 'var(--white)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        opacity: seen ? 1 : 0,
        transform: seen ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity .6s var(--ease-out-expo) ${i * 90}ms, transform .6s var(--ease-out-expo) ${i * 90}ms`
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            color: 'var(--ink)'
          }}
        >
          {story.company}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink-40)'
          }}
        >
          {String(i + 1).padStart(2, '0')} / 03
        </span>
      </div>

      <div
        style={{
          marginTop: 22,
          paddingBottom: 22,
          borderBottom: '1px solid var(--line)'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 8
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '2rem',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: 'var(--positive)',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1
            }}
          >
            {story.metric}
          </span>
          <span style={{ color: 'var(--positive)', fontSize: '1rem', fontWeight: 600 }}>↑</span>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: '0.78rem',
            color: 'var(--ink-60)',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            maxWidth: '32ch'
          }}
        >
          {story.metricLabel}
        </div>
      </div>

      <h3
        style={{
          marginTop: 22,
          fontFamily: 'var(--font-display)',
          fontSize: '1.18rem',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          color: 'var(--ink)'
        }}
      >
        {story.headline}
      </h3>
      <p
        style={{
          marginTop: 14,
          fontSize: '0.95rem',
          lineHeight: 1.6,
          color: 'var(--ink-70)',
          flex: 1
        }}
      >
        {story.body}
      </p>
      <a
        href="#roster"
        onClick={() => trackCta('Read full story', 'customers_story_card')}
        style={{
          marginTop: 24,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.88rem',
          fontWeight: 600,
          color: 'var(--ink)',
          textDecoration: 'none'
        }}
      >
        Read full story <ArrowRight />
      </a>
    </article>
  )
}

function FeaturedStories() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12 items-end" style={{ marginBottom: 48 }}>
          <div className="md:col-span-7">
            <Eyebrow>Featured stories</Eyebrow>
            <h2 style={{ ...DISPLAY_MD, margin: '18px 0 0' }}>
              Three teams. Three numbers worth borrowing.
            </h2>
          </div>
          <p style={{ ...LEAD, maxWidth: 480 }} className="md:col-span-5">
            Each story has a baseline, a fix list, and a measured 90-day result. Real brands, real numbers — no anonymized case studies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {customerStories.map((s, i) => (
            <StoryCard key={s.company} story={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CustomerGrid() {
  const [active, setActive] = useState<Category>('All')

  const filtered = useMemo(() => {
    return ROSTER.filter((c) => {
      if (active === 'All') return true
      if (active === 'Featured') return c.featured
      return c.industry === active
    })
  }, [active])

  return (
    <section
      id="roster"
      style={{
        position: 'relative',
        padding: 'var(--section) 0',
        background: 'var(--ink-surface, var(--ink))',
        color: 'var(--on-ink)',
        overflow: 'hidden'
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.6,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div style={{ ...CONTAINER, position: 'relative' }}>
        <div style={{ maxWidth: 720 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--on-ink-50)'
            }}
          >
            The roster
          </span>
          <h2 style={{ ...DISPLAY_LG, margin: '18px 0 0', color: 'var(--on-ink)' }}>
            Every customer, every outcome.
          </h2>
          <p style={{ ...LEAD, color: 'var(--on-ink-70)', marginTop: 22, maxWidth: 560 }}>
            A dense view of who runs Clovion in production — filtered by category, refreshed quarterly.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Filter customers by category"
          style={{
            marginTop: 36,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = active === cat
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(cat)}
                style={{
                  height: 36,
                  padding: '0 14px',
                  borderRadius: 999,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'none',
                  border: '1px solid',
                  borderColor: isActive ? 'var(--on-ink)' : 'var(--on-ink-15)',
                  background: isActive ? 'var(--on-ink)' : 'transparent',
                  color: isActive ? 'var(--ink)' : 'var(--on-ink-70)',
                  cursor: 'pointer',
                  transition: 'all .2s ease'
                }}
              >
                {cat}
              </button>
            )
          })}
          <div
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--on-ink-50)'
            }}
          >
            <span
              style={{
                height: 6,
                width: 6,
                borderRadius: 999,
                background: 'var(--on-ink)',
                animation: 'clv-pulse 1.4s ease-in-out infinite'
              }}
            />
            {filtered.length} matches
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 1,
            background: 'var(--on-ink-15)',
            border: '1px solid var(--on-ink-15)',
            borderRadius: 16,
            overflow: 'hidden'
          }}
        >
          {filtered.map((c, i) => (
            <div
              key={c.name}
              style={{
                background: 'var(--ink-surface, var(--ink))',
                padding: '20px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                opacity: 0,
                animation: `clv-fade-up .45s var(--ease-out-expo) ${Math.min(i, 16) * 30}ms forwards`,
                transition: 'background .2s ease',
                minHeight: 110
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = 'var(--ink-surface, var(--ink))'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 8
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: 'var(--on-ink)'
                  }}
                >
                  {c.name}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--on-ink-50)'
                  }}
                >
                  {c.industry}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: c.featured ? 'var(--positive)' : 'var(--on-ink-70)',
                  fontVariantNumeric: 'tabular-nums',
                  marginTop: 'auto'
                }}
              >
                {c.outcome}
              </span>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 36,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--on-ink-50)'
          }}
        >
          And another 170+ teams we cannot name yet.
        </p>
      </div>
    </section>
  )
}

function TestimonialGrid() {
  const picks = testimonials.slice(0, 6)
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div style={{ maxWidth: 640 }}>
          <Eyebrow>In their words</Eyebrow>
          <h2 style={{ ...DISPLAY_MD, margin: '18px 0 0' }}>
            What changed after the score moved.
          </h2>
          <p style={{ ...LEAD, marginTop: 20, maxWidth: 520 }}>
            Growth, product, and marketing leaders on what shipped, what moved, and what they ship next.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
          {picks.map((t, i) => (
            <figure
              key={t.author}
              style={{
                margin: 0,
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-card)',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 18
              }}
            >
              <div
                aria-hidden
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  lineHeight: 0.4,
                  color: 'var(--ink-25, rgba(10,10,15,0.22))',
                  height: 12
                }}
              >
                &ldquo;
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontSize: '0.98rem',
                  lineHeight: 1.55,
                  color: 'var(--ink-80, var(--ink))',
                  flex: 1
                }}
              >
                {t.quote}
              </blockquote>
              <figcaption
                style={{
                  paddingTop: 16,
                  borderTop: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                      color: 'var(--ink)'
                    }}
                  >
                    {t.author}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: '0.78rem',
                      color: 'var(--ink-60)'
                    }}
                  >
                    {t.role}, {t.company}
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--ink-40)',
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  const ctaStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 28,
    background: 'var(--ink-surface, var(--ink))',
    color: 'var(--on-ink)',
    padding: 'clamp(3rem, 6vw, 6rem) clamp(1.5rem, 4vw, 3.5rem)'
  }
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div style={ctaStyle}>
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.6,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          <div style={{ position: 'relative', maxWidth: 640 }}>
            <span style={{ color: 'var(--on-ink-70)' }}>
              <Eyebrow>Your story next</Eyebrow>
            </span>
            <h2 style={{ ...DISPLAY_LG, margin: '20px 0 0', color: 'var(--on-ink)' }}>
              See where you stand in AI search.
            </h2>
            <p style={{ ...LEAD, color: 'var(--on-ink-70)', marginTop: 22, maxWidth: 520 }}>
              Free score in 24 hours. The same engine our paid customers use, narrowed to the four largest models. No card, no trial timer.
            </p>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <CTAButtons location="customers_final_cta" />
              <button
                type="button"
                onClick={() => openCalendly('customers_final_cta')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--on-ink)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 4px',
                  textDecoration: 'underline',
                  textUnderlineOffset: 4,
                  textDecorationColor: 'var(--on-ink-50)'
                }}
              >
                Talk to Sales <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function FeatureContent() {
  return (
    <>
      <style>{`
        @keyframes clv-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="clv-fade-up"] { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
      <Hero />
      <MetricsStrip />
      <FeaturedStories />
      <CustomerGrid />
      <TestimonialGrid />
      <FAQAccordion items={FAQS} />
      <FinalCTA />
    </>
  )
}

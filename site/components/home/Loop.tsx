import Link from 'next/link'
import { Button, Container, ArrowRight } from '@/components/ui'
import { TypingHeadline } from './TypingHeadline'

const NODES = [
  {
    tag: 'Input',
    label: 'Track',
    title: 'AI Visibility Tracking',
    body: 'Monitor how ChatGPT, Gemini, Claude, Perplexity, Grok, and AI Overviews mention your brand across real buyer queries.'
  },
  {
    tag: 'Action',
    label: 'Analyze',
    title: 'Sentiment, Prompts & Competitors',
    body: 'Understand how AI engines describe your brand, which prompts trigger mentions, which competitors appear instead, and where your share of voice is changing.'
  },
  {
    tag: 'Expansion',
    label: 'Improve',
    title: 'GEO Recommendations & AI Crawlability',
    body: 'Get prioritized recommendations to improve content structure, schema, authority signals, technical readiness, and AI crawlability, so your pages are easier for AI engines to understand and cite.'
  }
]

export function Loop() {
  return (
    <section
      className="py-16 md:py-28"
      style={{
        position: 'relative',
        background: 'linear-gradient(to bottom, var(--bg) 0%, var(--ink-surface) 8%, var(--ink-surface) 92%, var(--bg) 100%)',
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
      <Container className="relative">
        <div className="mb-12 md:mb-20" style={{ maxWidth: 768, margin: '0 auto', textAlign: 'center' }}>
          <TypingHeadline
            text="Tracking. Intelligence. Improvement. One loop."
            caretColor="var(--on-ink)"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--display-lg)',
              fontWeight: 600,
              letterSpacing: 'var(--track-display-lg)',
              lineHeight: 1.02,
              margin: '28px 0 0',
              textWrap: 'balance',
              color: 'var(--on-ink)',
              minHeight: '2.1em'
            }}
          />
          <p
            style={{
              fontSize: 'var(--text-lead)',
              lineHeight: 1.55,
              color: 'var(--on-ink-60)',
              marginTop: 24,
              textWrap: 'balance'
            }}
          >
            Every AI answer is a signal. Clovion connects prompt tracking, sentiment analysis, competitor intelligence, GEO recommendations, and AI crawlability into one workflow for improving AI search visibility.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-10" style={{ maxWidth: 1024, margin: '0 auto' }}>
          {NODES.map((n, i) => (
            <div
              key={n.label}
              className="p-6 md:p-8"
              style={{
                borderRadius: 16,
                border: '1px solid var(--on-ink-15)',
                background: 'rgba(255,255,255,0.03)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--on-ink-50)'
                  }}
                >
                  Node 0{i + 1}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--on-ink)'
                  }}
                >
                  {n.label}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.4rem',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  margin: '24px 0 0',
                  color: 'var(--on-ink)'
                }}
              >
                {n.title}
              </h3>
              <p style={{ marginTop: 12, fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--on-ink-60)' }}>{n.body}</p>
              <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ height: 6, width: 6, borderRadius: 999, background: 'var(--on-ink)' }} />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.14em',
                    color: 'var(--on-ink-40)'
                  }}
                >
                  {n.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 md:mt-20" style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Button href="/pricing" variant="invert" size="lg" trackLocation="home_loop">
            Start Free Trial <ArrowRight />
          </Button>
          <Link
            href="/features"
            style={{
              height: '3rem',
              padding: '0 1.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              borderRadius: 999,
              background: 'transparent',
              color: 'var(--on-ink)',
              border: '1px solid var(--on-ink-15)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            See the product
          </Link>
        </div>
      </Container>
    </section>
  )
}

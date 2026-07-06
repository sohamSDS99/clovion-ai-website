'use client'

import type { CSSProperties } from 'react'
import { Button, Container, ArrowRight } from '@/components/ui'
import { TypingHeadline } from './TypingHeadline'
import { openCalendly } from '@/lib/openCalendly'

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
      className="clv-dark py-16 md:py-28"
      data-track-location="home_loop"
      style={{
        // Dark band on the light homepage. .clv-dark scopes dark tokens so the
        // node cards, on-ink text, and white primary button render as designed,
        // while --bg is pinned to the light page tone so the band fades softly
        // into the sections above/below. The dot-grid below is the band's own
        // texture (a tile shade) — the main white canvas itself stays flat.
        ['--bg' as string]: '#FAF9F7',
        position: 'relative',
        background: 'linear-gradient(to bottom, var(--bg) 0%, var(--ink-surface) 8%, var(--ink-surface) 92%, var(--bg) 100%)',
        color: 'var(--on-ink)',
        overflow: 'hidden'
      } as CSSProperties}
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
        <div style={{ maxWidth: 960, margin: '0 auto', marginBottom: 'clamp(2.25rem, 5vw, 3.25rem)', textAlign: 'center' }}>
          <TypingHeadline
            text={'Tracking. Intelligence.\nImprovement. One loop.'}
            caretColor="var(--on-ink)"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--display-lg)',
              fontWeight: 600,
              letterSpacing: 'var(--track-display-lg)',
              lineHeight: 1.1,
              margin: '28px 0 0',
              whiteSpace: 'pre-line',
              color: 'var(--on-ink)'
            }}
          />
          <p
            style={{
              fontSize: '1.0625rem',
              lineHeight: 1.5,
              color: 'var(--on-ink-60)',
              maxWidth: 600,
              margin: 'clamp(2.25rem, 5vw, 3.25rem) auto 0',
              textWrap: 'balance'
            }}
          >
            Every AI answer is a signal. Clovion connects tracking, intelligence, and recommendations into one workflow for AI visibility.
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
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          <Button
            variant="ghost"
            size="lg"
            // No trackLocation: openCalendly pushes book_demo already —
            // trackLocation would double-fire cta_click on the same click.
            onClick={(e) => {
              e.preventDefault()
              openCalendly('home_loop', undefined, 'Talk to an Expert')
            }}
            style={{
              background: 'transparent',
              color: 'var(--on-ink)',
              border: '1px solid var(--on-ink-15)'
            }}
          >
            Talk to an Expert
          </Button>
        </div>
      </Container>
    </section>
  )
}

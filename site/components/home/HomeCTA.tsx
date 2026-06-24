import { Button, Container, ArrowRight } from '@/components/ui'
import { TypingHeadline } from './TypingHeadline'

export function HomeCTA() {
  return (
    <section className="py-12 md:py-20">
      <Container>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 24,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            padding: 'clamp(2.25rem, 6vw, 6rem) clamp(1.25rem, 4vw, 3.5rem)'
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
          <div style={{ position: 'relative', maxWidth: 640 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.74rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--on-ink-70)'
              }}
            >
              Get your score
            </span>
            <TypingHeadline
              text="Find out where you stand in AI engines."
              caretColor="var(--on-ink)"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--display-lg)',
                fontWeight: 600,
                letterSpacing: 'var(--track-display-lg)',
                lineHeight: 1.02,
                margin: '20px 0 0',
                textWrap: 'balance',
                color: 'var(--on-ink)'
              }}
            />
            <p
              style={{
                fontSize: 'var(--text-lead)',
                lineHeight: 1.55,
                color: 'var(--on-ink-70)',
                marginTop: 24,
                maxWidth: 520
              }}
            >
              60 seconds. No signup. Scan your brand across six AI engines, see which competitors appear, and get clear recommendations to improve your AI visibility.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button href="/pricing" variant="primary" size="lg" trackLocation="home_final_cta">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="/free-ai-visibility-score" variant="secondary" size="lg" trackLocation="home_final_cta">
                Get Free Score
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

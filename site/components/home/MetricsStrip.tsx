import { Container } from '@/components/ui'
import { TypingHeadline } from './TypingHeadline'

const METRICS = [
  { tag: 'AI engines', value: '6', label: 'AI search engines monitored daily — ChatGPT, Gemini, Claude, Perplexity, Grok, and Google AI Overviews.' },
  { tag: 'GEO checks', value: '25', label: 'On-page optimization checks across content structure, schema, authority, and technical performance.' },
  { tag: 'Refresh rate', value: '24h', label: 'Visibility tracking refreshed every day to reflect current AI search performance.' },
  { tag: 'Visibility score', value: '0–100', label: 'A single composite score from mentions, prominence, share of voice, citations, and sentiment.' },
  { tag: 'Crawlability', value: 'AI-ready', label: 'Support for structured data, robots.txt guidance, llms.txt, and machine-readable content signals.' }
]

export function MetricsStrip() {
  return (
    <section className="py-12 md:py-20">
      <Container>
        <div style={{ maxWidth: 680 }}>
          <span
            className="eyebrow"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              letterSpacing: '0.14em',
              color: 'var(--ink-50)'
            }}
          >
            What&rsquo;s inside
          </span>
          <TypingHeadline
            text="Everything Clovion covers, at a glance."
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--display-md)',
              fontWeight: 600,
              letterSpacing: 'var(--track-display-md)',
              lineHeight: 1.05,
              margin: '18px 0 0',
              textWrap: 'balance',
              minHeight: '1.1em',
              color: 'var(--ink)'
            }}
          />
          <p
            style={{
              fontSize: 'var(--text-lead)',
              lineHeight: 1.55,
              color: 'var(--ink-70)',
              margin: '20px 0 0',
              maxWidth: 560,
              textWrap: 'balance'
            }}
          >
            Five things every Clovion plan does for your brand across AI search — from the engines it watches to the score it gives you.
          </p>
        </div>

        <div
          className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-5"
          style={{
            borderTop: '1px solid var(--line)',
            borderBottom: '1px solid var(--line)'
          }}
        >
          {METRICS.map((m, i) => (
            <div
              key={m.value}
              className="p-5 md:p-8 metrics-cell"
              data-idx={i}
              data-last={i === METRICS.length - 1}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--ink-50)'
                }}
              >
                {m.tag}
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.25rem, 4.5vw, 3rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                  color: 'var(--ink)'
                }}
              >
                {m.value}
              </div>
              <p
                style={{
                  marginTop: 16,
                  fontWeight: 400,
                  fontSize: '0.86rem',
                  lineHeight: 1.5,
                  color: 'var(--ink-60)'
                }}
              >
                {m.label}
              </p>
            </div>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .metrics-cell { border-right: 1px solid var(--line); border-bottom: 1px solid var(--line); }
          @media (max-width: 767px) {
            .metrics-cell:nth-child(2n) { border-right: none; }
            .metrics-cell[data-last="true"] { border-bottom: none; }
          }
          @media (min-width: 768px) {
            .metrics-cell { border-bottom: none; }
            .metrics-cell[data-last="true"] { border-right: none; }
          }
        ` }} />
        <p
          style={{
            marginTop: 28,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: 'var(--ink-50)'
          }}
        >
          First visibility score within 24 hours · No credit card required
        </p>
      </Container>
    </section>
  )
}

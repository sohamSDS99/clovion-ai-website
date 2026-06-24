import { Container } from '@/components/ui'
import { TypingHeadline } from './TypingHeadline'

const TESTIMONIALS = [
  {
    quote:
      "Clovion showed us exactly which prompts mentioned our competitors but not us. The questions were neutral, they didn't name anyone, so the results were honest. We fixed three pages based on the GEO suggestions and started getting cited within two weeks. Visibility score went from 14 to 52.",
    author: 'Mirjam Meling',
    role: 'Marketing and Communication Manager',
    company: 'Netpower'
  },
  {
    quote:
      'Our Perplexity share of voice went from zero to top three in 30 days. We just followed the on-page suggestions rule by rule. The Gap Finder was the unlock — it showed us the exact competitor pages getting cited when our brand wasn’t mentioned. That’s a content roadmap you can’t get anywhere else.',
    author: 'Erland Bruvik',
    role: 'CEO',
    company: 'SDS Manager'
  },
  {
    quote:
      'We manage eight client brands and needed a scalable way to track AI visibility. The automatic competitor discovery found 11 new brands showing up in AI answers that none of our clients had on their radar — they auto-promoted after just 3 appearances each. Now we monitor all of them from one dashboard.',
    author: 'Morten André Hjelle',
    role: 'CEO',
    company: 'CertainQMS'
  }
]

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

export function Testimonials() {
  return (
    <section style={{ padding: 'var(--section) 0', background: 'linear-gradient(to bottom, var(--bg) 0%, var(--subtle) 8%, var(--subtle) 92%, var(--bg) 100%)' }}>
      <Container>
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.74rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-50)'
            }}
          >
            Customer stories
          </span>
          <TypingHeadline
            text="Teams running GEO as a real channel."
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--display-md)',
              fontWeight: 600,
              letterSpacing: 'var(--track-display-md)',
              lineHeight: 1.05,
              margin: '16px 0 0',
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
              marginTop: 20,
              textWrap: 'balance'
            }}
          >
            Growth, product, and marketing leaders who stopped guessing about AI search and started using data to fix it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.author}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 20,
                padding: '2rem',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ color: 'var(--ink-15)' }}>
                <svg width="28" height="22" viewBox="0 0 32 24" fill="currentColor" aria-hidden>
                  <path d="M9 0C4.5 1 .5 5 .5 10v14h11V10H5C5 7 7.5 4 11 3L9 0zm14 0c-4.5 1-8.5 5-8.5 10v14h11V10H19c0-3 2.5-6 6-7L23 0z" />
                </svg>
              </div>
              <blockquote
                style={{
                  margin: '20px 0 0',
                  fontSize: '1.02rem',
                  lineHeight: 1.6,
                  color: 'var(--ink-80, var(--ink-70))',
                  flex: 1
                }}
              >
                {t.quote}
              </blockquote>
              <div
                style={{
                  marginTop: 24,
                  paddingTop: 24,
                  borderTop: '1px solid var(--line)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12
                }}
              >
                <div
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 999,
                    background: 'var(--ink-10)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--ink-60)'
                  }}
                >
                  {initials(t.author)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--ink)' }}>
                    {t.author}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--ink-60)' }}>
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

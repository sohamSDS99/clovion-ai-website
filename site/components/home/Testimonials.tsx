'use client'

import { useState, type KeyboardEvent, type CSSProperties } from 'react'
import { Container } from '@/components/ui'

const TESTIMONIALS = [
  {
    quote:
      'As AI search became more important for us, we wanted to understand what it was actually saying about our brand. I like that it doesn’t just show charts. It actually points you to the pages and explains why something might be affecting how AI talks about your company. We’ve only been using it for a month, but it’s already changed how we think about our content.',
    author: 'Erlend Arnoy',
    role: 'CEO',
    company: 'Netpower IT solutions',
    initials: 'EA'
  },
  {
    quote:
      'Our Perplexity share of voice went from zero to top three in 30 days. We just followed the on-page suggestions rule by rule. The Gap Finder was the unlock — it showed us the exact competitor pages getting cited when our brand wasn’t mentioned. That’s a content roadmap you can’t get anywhere else.',
    author: 'Erlend Bruvik',
    role: 'CEO',
    company: 'SDS Manager',
    initials: 'EB'
  },
  {
    quote:
      'We manage eight client brands and needed a scalable way to track AI visibility. The automatic competitor discovery found 11 new brands showing up in AI answers that none of our clients had on their radar. Now we monitor all of them from one dashboard.',
    author: 'Morten André Hjelle',
    role: 'CEO',
    company: 'CertainQMS',
    initials: 'MH'
  }
]

/* The homepage forces Saans SemiBold on everything via `.clv-home *`. Saans has
   no regular weight, so to genuinely UN-BOLD the story text we override the
   font-family to the already-loaded Hanken Grotesk (400/500) with a higher-
   specificity !important rule, and set light weights inline. */
const STORIES_CSS = `
.clv-home .clv-cs-soft, .clv-home .clv-cs-soft * {
  font-family: var(--font-body-reg, 'Hanken Grotesk', system-ui, sans-serif) !important;
}
.clv-cs-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.14fr) minmax(0, 0.8fr);
  gap: clamp(40px, 6vw, 100px);
  align-items: center;
}
.clv-cs-fade { animation: clvCsFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes clvCsFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.clv-cs-quote { min-height: 4.6em; }
.clv-cs-arrow { transition: background 0.18s cubic-bezier(0.16, 1, 0.3, 1); }
.clv-cs-arrow:hover { background: var(--subtle); }
.clv-cs-arrow:focus-visible, .clv-cs-dot:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
@media (max-width: 900px) {
  .clv-cs-grid { grid-template-columns: 1fr; gap: 36px; }
  .clv-cs-photo { order: -1; }
  .clv-cs-quote { min-height: 0; }
}
@media (prefers-reduced-motion: reduce) { .clv-cs-fade { animation: none; } }
`

function Chevron({ dir }: { dir: 'l' | 'r' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {dir === 'l' ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  )
}

function CornerMark({ style }: { style: CSSProperties }) {
  return <span aria-hidden style={{ position: 'absolute', width: 7, height: 7, background: 'rgba(10,10,15,0.18)', pointerEvents: 'none', ...style }} />
}

const arrowStyle: CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: 999,
  background: 'var(--white)',
  border: '1px solid var(--line)',
  boxShadow: 'var(--shadow-card)',
  color: 'var(--ink)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0
}

export function Testimonials() {
  const [i, setI] = useState(0)
  const n = TESTIMONIALS.length
  const t = TESTIMONIALS[i]
  const go = (d: number) => setI((v) => (v + d + n) % n)

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    }
  }

  return (
    <section data-track-location="home_testimonials" style={{ padding: 'var(--section) 0', background: '#FAF9F7' }}>
      <style dangerouslySetInnerHTML={{ __html: STORIES_CSS }} />
      <Container>
        <div
          role="group"
          aria-roledescription="testimonial carousel"
          aria-label="Customer stories"
          onKeyDown={onKeyDown}
          style={{ position: 'relative', paddingInline: 'clamp(4px, 2vw, 28px)' }}
        >
          {/* corner registration marks (from the reference) */}
          <CornerMark style={{ top: -6, left: -6 }} />
          <CornerMark style={{ top: -6, right: -6 }} />
          <CornerMark style={{ bottom: -6, left: -6 }} />
          <CornerMark style={{ bottom: -6, right: -6 }} />

          <div key={i} className="clv-cs-fade" aria-live="polite" aria-atomic="true">
            <div className="clv-cs-grid">
              {/* LEFT — the story (unbolded, regular-weight Hanken) */}
              <div className="clv-cs-soft">
                {/* company wordmark */}
                <div
                  style={{
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-40)'
                  }}
                >
                  {t.company}
                </div>

                <figure style={{ margin: '26px 0 0' }}>
                  <blockquote
                    className="clv-cs-quote"
                    style={{
                      margin: 0,
                      fontWeight: 400,
                      fontSize: 'clamp(1.4rem, 0.9rem + 1.9vw, 2.05rem)',
                      lineHeight: 1.42,
                      letterSpacing: '-0.008em',
                      color: 'var(--ink)',
                      textWrap: 'pretty'
                    }}
                  >
                    “{t.quote}”
                  </blockquote>

                  <figcaption style={{ marginTop: 'clamp(28px, 3.5vw, 40px)' }}>
                    <div style={{ fontWeight: 500, fontSize: '1.02rem', color: 'var(--ink)' }}>{t.author}</div>
                    <div style={{ marginTop: 4, fontWeight: 400, fontSize: '0.95rem', color: 'var(--ink-50)' }}>
                      {t.role} · {t.company}
                    </div>
                  </figcaption>
                </figure>

                {/* controls — prev / next + counter */}
                <div style={{ marginTop: 'clamp(32px, 4vw, 48px)', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <button type="button" aria-label="Previous story" className="clv-cs-arrow" style={arrowStyle} onClick={() => go(-1)}>
                    <Chevron dir="l" />
                  </button>
                  <button type="button" aria-label="Next story" className="clv-cs-arrow" style={arrowStyle} onClick={() => go(1)}>
                    <Chevron dir="r" />
                  </button>
                </div>
              </div>

              {/* RIGHT — the picture (portrait). Monogram placeholder until real photos are added. */}
              <div className="clv-cs-photo">
                <div
                  style={{
                    width: '100%',
                    maxWidth: 400,
                    aspectRatio: '4 / 5',
                    marginInline: 'auto',
                    borderRadius: 18,
                    overflow: 'hidden',
                    background: 'var(--subtle)',
                    border: '1px solid var(--line)',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {/* Swap this monogram for <img src=... alt=t.author> when photos are ready. */}
                  <span
                    aria-hidden
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(2.4rem, 6vw, 3.4rem)',
                      letterSpacing: '0.02em',
                      color: 'var(--ink-20)'
                    }}
                  >
                    {t.initials}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

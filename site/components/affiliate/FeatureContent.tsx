'use client'

import { useState, useEffect, ReactNode, CSSProperties } from 'react'
import ReferralFlow from './ReferralFlow'

const A_CONTAINER: CSSProperties = { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 2rem' }
const A_DISPLAY_LG: CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 'var(--display-lg)', fontWeight: 600, letterSpacing: 'var(--track-display-lg)', lineHeight: 1.02, textWrap: 'balance' as any }
const A_DISPLAY_MD: CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 'var(--display-md)', fontWeight: 600, letterSpacing: 'var(--track-display-md)', lineHeight: 1.05, textWrap: 'balance' as any }
const A_LEAD: CSSProperties = { fontSize: 'var(--text-lead)', lineHeight: 1.55, fontWeight: 400, color: 'var(--ink-70)', textWrap: 'balance' as any }

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Check({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'inherit' }}>
      {children}
    </span>
  )
}

type TypingHeadlineProps = {
  text: string
  style?: CSSProperties
  caretColor?: string
  as?: 'h1' | 'h2' | 'h3'
}

function TypingHeadline({ text, style, caretColor, as }: TypingHeadlineProps) {
  const [reduce, setReduce] = useState(false)
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing')

  useEffect(() => {
    const prefersReduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduce) {
      setReduce(true)
      setN(text.length)
    }
  }, [text])

  useEffect(() => {
    if (reduce) return
    let timer: ReturnType<typeof setTimeout>
    if (phase === 'typing') {
      if (n < text.length) timer = setTimeout(() => setN(n + 1), 62)
      else timer = setTimeout(() => setPhase('holding'), 80)
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('deleting'), 4200)
    } else {
      if (n > 0) timer = setTimeout(() => setN(n - 1), 28)
      else timer = setTimeout(() => setPhase('typing'), 650)
    }
    return () => clearTimeout(timer)
  }, [n, phase, reduce, text])

  const blinking = reduce || phase === 'holding'
  const Tag = (as || 'h2') as keyof JSX.IntrinsicElements
  return (
    <Tag style={style}>
      {text.slice(0, n)}
      <span
        aria-hidden
        style={{
          display: 'inline-block',
          width: '0.055em',
          height: '0.82em',
          marginLeft: '0.06em',
          verticalAlign: '-0.02em',
          background: caretColor || 'var(--ink)',
          animation: blinking ? 'clv-blink 1.05s steps(1) infinite' : 'none',
        }}
      />
    </Tag>
  )
}

function WIcon({ d, size = 20, vb = 24 }: { d: ReactNode; size?: number; vb?: number }) {
  return (
    <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {d}
    </svg>
  )
}

const ICON_EARN = (
  <WIcon
    d={
      <g>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M14.5 9.5c-.5-1-1.5-1.4-2.6-1.4-1.4 0-2.4.8-2.4 1.9 0 2.6 5.3 1.2 5.3 3.9 0 1.2-1.1 2-2.6 2-1.2 0-2.3-.5-2.7-1.5" />
        <line x1="12" y1="6.4" x2="12" y2="17.6" />
      </g>
    }
  />
)

const ICON_GROW = (
  <WIcon
    d={
      <g>
        <line x1="5" y1="20" x2="5" y2="13" />
        <line x1="12" y1="20" x2="12" y2="6" />
        <line x1="19" y1="20" x2="19" y2="10" />
        <line x1="3" y1="20" x2="21" y2="20" />
      </g>
    }
  />
)

const ICON_FUTURE = (
  <WIcon
    d={
      <g>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </g>
    }
  />
)

const ICON_TEAM = (
  <WIcon
    d={
      <g>
        <circle cx="8" cy="9" r="2.6" />
        <circle cx="16" cy="9" r="2.6" />
        <path d="M3 19c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6" />
        <path d="M14 14.6c2.6-.1 5 1.7 5 4.4" />
      </g>
    }
  />
)

const WHY = [
  { name: 'Earn from every qualified referral', icon: ICON_EARN, body: 'Recurring commission on every brand that signs up through your link — paid for as long as they stay a Clovion customer.' },
  { name: 'Promote a fast-growing platform', icon: ICON_GROW, body: 'AI visibility is one of the fastest-moving categories in marketing. You’re recommending a product teams genuinely need.' },
  { name: 'Help brands prepare for the future of search', icon: ICON_FUTURE, body: 'Buyers increasingly ask AI engines, not Google. Clovion shows brands how they show up — and what to fix.' },
  { name: 'Built for the way you already work', icon: ICON_TEAM, body: 'Perfect for marketers, agencies, creators, SEO consultants, and SaaS communities sharing tools they trust.' },
]

const STEPS = [
  { n: '01', title: 'Join the referral program', body: 'Sign up free in minutes. No quotas, no approval hoops — get your account and dashboard instantly.' },
  { n: '02', title: 'Share your unique referral link', body: 'Drop it in newsletters, client decks, social posts, or community threads. Every click is tracked to you.' },
  { n: '03', title: 'Earn when your referral becomes a customer', body: 'When a brand signs up and subscribes through your link, you earn recurring commission — automatically.' },
]

const AUDIENCE = ['Marketers', 'Agencies', 'Creators', 'SEO consultants', 'SaaS communities', 'Founders']

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
          background: 'radial-gradient(ellipse 70% 55% at 70% 0%, rgba(10,10,15,0.06) 0%, rgba(10,10,15,0.02) 30%, transparent 70%)',
        }}
      />
      <div style={{ ...A_CONTAINER, padding: '4rem 2rem 4.5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div>
            <TypingHeadline
              as="h1"
              text="Earn for every brand you help get found in AI search."
              style={{ ...A_DISPLAY_LG, fontSize: 'clamp(2rem, 3vw + 0.3rem, 3.1rem)', margin: 0, whiteSpace: 'nowrap' }}
            />
            <p style={{ ...A_LEAD, maxWidth: 'none', fontSize: '1.02rem', textWrap: 'pretty' as any, margin: '1.75rem auto 0' }}>
              Clovion helps businesses track, understand, and improve their visibility across ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews. Refer brands, marketers, SEO teams, agencies, or founders — and earn commission for every successful signup.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a className="btn btn-primary" href="mailto:partners@clovion.ai?subject=Affiliate Program" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Join the Program <ArrowRight />
              </a>
              <a className="btn btn-secondary" href="#how">
                See commission rates
              </a>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.86rem', color: 'var(--ink-60)' }}>
              {['Recurring commission', 'Free to join', 'Fast payouts'].map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span
                    style={{
                      height: 16,
                      width: 16,
                      borderRadius: 999,
                      background: 'var(--ink-surface, var(--ink))',
                      color: 'var(--on-ink)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={10} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyJoin() {
  return (
    <section style={{ padding: 'var(--section-sm) 0' }}>
      <div style={A_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <Eyebrow>Why join</Eyebrow>
          <h2 style={{ ...A_DISPLAY_MD, margin: '14px 0 0' }}>Recommend a tool the market is moving toward.</h2>
          <p style={{ ...A_LEAD, margin: '18px 0 0' }}>
            The Clovion affiliate program rewards you for connecting brands with the platform that shows them how AI search sees them — and earns you commission while you do it.
          </p>
        </div>
        <div style={{ marginTop: 36, display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
          {WHY.map((f) => (
            <div
              key={f.name}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                padding: 22,
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--line)',
                background: 'var(--white)',
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  height: 44,
                  width: 44,
                  borderRadius: 12,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                  color: 'var(--ink)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {f.icon}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>{f.name}</span>
                <p style={{ margin: '8px 0 0', fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--ink-70)' }}>{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how" style={{ padding: 'var(--section-sm) 0', background: 'var(--subtle)', scrollMarginTop: 80 }}>
      <div style={A_CONTAINER}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 64, alignItems: 'center' }}>
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 style={{ ...A_DISPLAY_MD, margin: '14px 0 0' }}>Three steps from link to payout.</h2>
            <p style={{ ...A_LEAD, margin: '18px 0 0' }}>
              No complicated setup. Share a link, and earn every time it turns into a Clovion customer.
            </p>
            <div style={{ marginTop: 28, display: 'grid', gap: 12 }}>
              {STEPS.map((s) => (
                <div
                  key={s.n}
                  style={{
                    display: 'flex',
                    gap: 18,
                    alignItems: 'flex-start',
                    padding: '18px 20px',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--line)',
                    background: 'var(--white)',
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--ink-40)',
                      fontVariantNumeric: 'tabular-nums',
                      marginTop: 2,
                    }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.02em', margin: 0, color: 'var(--ink)' }}>{s.title}</h3>
                    <p style={{ margin: '8px 0 0', fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--ink-70)' }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ReferralFlow />
        </div>
      </div>
    </section>
  )
}

function WhoFor() {
  return (
    <section style={{ padding: 'var(--section-sm) 0' }}>
      <div style={{ ...A_CONTAINER, textAlign: 'center' }}>
        <Eyebrow>Perfect for</Eyebrow>
        <h2 style={{ ...A_DISPLAY_MD, margin: '14px auto 0', maxWidth: 760 }}>Made for people who already share tools they trust.</h2>
        <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {AUDIENCE.map((a, i) => (
            <span
              key={a}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '13px 22px',
                borderRadius: 999,
                background: 'var(--white)',
                border: '1px solid var(--line)',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-40)', fontVariantNumeric: 'tabular-nums' }}>{String(i + 1).padStart(2, '0')}</span>
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={{ padding: 'var(--section-sm) 0' }}>
      <div style={A_CONTAINER}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 28,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            padding: '4.5rem 3.5rem',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.6,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div style={{ position: 'relative', maxWidth: 660 }}>
            <span style={{ color: 'var(--on-ink-70)' }}>
              <Eyebrow>Become a Clovion AI affiliate</Eyebrow>
            </span>
            <TypingHeadline
              as="h2"
              text="Help brands get found in the age of AI search."
              caretColor="var(--on-ink)"
              style={{ ...A_DISPLAY_LG, margin: '20px 0 0', color: 'var(--on-ink)', minHeight: '2.1em' }}
            />
            <p style={{ ...A_LEAD, color: 'var(--on-ink-70)', marginTop: 24, maxWidth: 540 }}>
              Join our affiliate program, share your link, and earn commission for every brand you bring to Clovion.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-invert" href="mailto:partners@clovion.ai?subject=Affiliate Program" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Join the Program <ArrowRight />
              </a>
              <a
                className="btn"
                href="mailto:partners@clovion.ai?subject=Affiliate inquiry"
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
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                Talk to us
              </a>
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
      <Hero />
      <WhyJoin />
      <HowItWorks />
      <WhoFor />
      <FinalCTA />
    </>
  )
}

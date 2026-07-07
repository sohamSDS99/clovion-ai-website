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
              style={{ ...A_DISPLAY_LG, fontSize: 'clamp(2rem, 3vw + 0.3rem, 3.1rem)', margin: 0, minHeight: '2.3em' }}
            />
            <p style={{ ...A_LEAD, maxWidth: 'none', fontSize: '1.02rem', textWrap: 'pretty' as any, margin: '1.75rem auto 0' }}>
              Clovion helps businesses track, understand, and improve their visibility across ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews. Refer brands, marketers, SEO teams, agencies, or founders — and earn commission for every successful signup.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a className="btn btn-primary" href="https://clovion.tolt.io/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Join the Program <ArrowRight />
              </a>
              <a
                className="btn btn-secondary"
                href="#commission-rates"
                onClick={(e) => {
                  const el = document.getElementById('commission-rates')
                  if (el) {
                    e.preventDefault()
                    el.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
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
    <section style={{ padding: 'var(--section-sm, clamp(3rem, 6vw, 5rem)) 0' }}>
      <div style={A_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <Eyebrow>Why join</Eyebrow>
          <h2 style={{ ...A_DISPLAY_MD, margin: '14px 0 0' }}>Recommend a tool the market is moving toward.</h2>
          <p style={{ ...A_LEAD, margin: '18px 0 0' }}>
            The Clovion affiliate program rewards you for connecting brands with the platform that shows them how AI search sees them — and earns you commission while you do it.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2" style={{ marginTop: 36 }}>
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

/* ── Commission update (scroll target for "See commission rates") ─ */
function Commission() {
  return (
    <section id="commission-rates" style={{ padding: 'var(--section-sm, clamp(3rem, 6vw, 5rem)) 0', scrollMarginTop: 80 }}>
      <div style={A_CONTAINER}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_0.85fr] md:gap-16 items-center">
          <div>
            <span style={{ color: 'var(--positive)' }}>
              <Eyebrow>Commission update</Eyebrow>
            </span>
            <h2 style={{ ...A_DISPLAY_LG, fontSize: 'clamp(1.9rem, 2.6vw + 0.3rem, 2.85rem)', margin: '14px 0 0' }}>
              Earn 30% — up to 50% as you grow.
            </h2>
            <p style={{ ...A_LEAD, margin: '18px 0 0' }}>
              Every affiliate starts at 30% recurring commission on every paid plan bought through your link. Bring more paying customers and your rate goes up — all the way to 50%, based on your volume. You keep earning for as long as they stay with Clovion.
            </p>
          </div>
          {/* Commission meter — visualizes the 30%→50% range from the copy */}
          <div style={{ padding: '2rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--line)', background: 'var(--white)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>Start</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1 }}>30%</span>
              </div>
              <span aria-hidden style={{ color: 'var(--ink-40)', marginBottom: 10 }}><ArrowRight /></span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--positive)' }}>Max</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--positive)', lineHeight: 1 }}>50%</span>
              </div>
            </div>
            <div style={{ marginTop: 20, height: 12, borderRadius: 999, background: 'var(--subtle)', border: '1px solid var(--line)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '100%', background: 'linear-gradient(90deg, var(--positive-border), var(--positive))' }} />
            </div>
            <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.04em', color: 'var(--ink-50)' }}>
              Recurring · grows with volume
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Three tiers ─────────────────────────────────────────────── */
const TIERS = [
  { n: '01', name: 'Individual', body: 'For marketers, creators, and consultants sharing with their audience. Start earning on your first paid referral — no quotas, no minimums.' },
  { n: '02', name: 'Mid-Tier', body: 'For active referrers and growing communities sending steady, paid signups. As your paid referrals build, your rate goes up.' },
  { n: '03', name: 'Agency', body: 'For agencies referring clients at scale. Get our top recurring rates, plus priority support to help you land and keep the brands you bring in.' },
]

function TierBars({ level }: { level: number }) {
  // level 1..3 — number of emerald bars filled, ascending motif
  return (
    <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 3, height: 20 }} aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 5,
            height: 8 + i * 6,
            borderRadius: 2,
            background: i < level ? 'var(--positive)' : 'var(--line)',
          }}
        />
      ))}
    </span>
  )
}

function ThreeTiers() {
  return (
    <section style={{ padding: 'var(--section-sm, clamp(3rem, 6vw, 5rem)) 0', background: 'var(--subtle)' }}>
      <div style={A_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <Eyebrow>Three tiers</Eyebrow>
          <h2 style={{ ...A_DISPLAY_MD, margin: '14px 0 0' }}>A partnership that grows with you.</h2>
          <p style={{ ...A_LEAD, margin: '18px 0 0' }}>
            There&rsquo;s a tier for however you share. Your exact rate is set after a quick chat, based on what you bring in.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3" style={{ marginTop: 36, alignItems: 'stretch' }}>
          {TIERS.map((t, i) => (
            <div
              key={t.n}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '1.75rem',
                borderRadius: 'var(--radius-card)',
                border: i === 2 ? '2px solid var(--positive)' : '1px solid var(--line)',
                background: 'var(--white)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--ink-40)', fontVariantNumeric: 'tabular-nums' }}>{t.n}</span>
                <TierBars level={i + 1} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '16px 0 0' }}>{t.name}</h3>
              <p style={{ margin: '10px 0 0', fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--ink-70)' }}>{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Featured partners ───────────────────────────────────────── */
function PartnerSeal() {
  return (
    <svg width="132" height="132" viewBox="0 0 132 132" fill="none" aria-hidden="true">
      {/* rosette ticks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2
        const r1 = 52
        const r2 = 60
        const cx = 66
        const cy = 66
        return (
          <line
            key={i}
            x1={cx + Math.cos(a) * r1}
            y1={cy + Math.sin(a) * r1}
            x2={cx + Math.cos(a) * r2}
            y2={cy + Math.sin(a) * r2}
            stroke="var(--positive)"
            strokeOpacity={0.35}
            strokeWidth={2}
            strokeLinecap="round"
          />
        )
      })}
      <circle cx="66" cy="66" r="44" fill="var(--positive)" fillOpacity="0.1" stroke="var(--positive)" strokeWidth="1.5" />
      <circle cx="66" cy="66" r="30" fill="var(--positive)" />
      <path d="M54 66l8 8 16-18" stroke="#ffffff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function FeaturedPartners() {
  return (
    <section style={{ padding: 'var(--section-sm, clamp(3rem, 6vw, 5rem)) 0' }}>
      <div style={A_CONTAINER}>
        <div style={{ borderRadius: 'var(--radius-card)', border: '1px solid var(--line)', background: 'var(--white)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
          <div className="grid grid-cols-1 md:grid-cols-[1.25fr_0.75fr]">
            <div style={{ padding: 'clamp(2rem, 4vw, 3rem)' }}>
              <span style={{ color: 'var(--positive)' }}>
                <Eyebrow>Featured partners</Eyebrow>
              </span>
              <h2 style={{ ...A_DISPLAY_MD, margin: '14px 0 0' }}>Bring real volume, become a featured partner.</h2>
              <p style={{ ...A_LEAD, margin: '18px 0 0' }}>
                Partners who consistently drive strong referral numbers get more than a higher rate. We feature you as an official Clovion partner — and as your numbers grow, so does your commission. The more you bring to the table, the more we invest back in you.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 2rem', background: 'var(--positive-bg)' }}>
              <PartnerSeal />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Mid-page CTA — light emerald band ───────────────────────── */
function StartEarningCTA() {
  return (
    <section style={{ padding: 'var(--section-sm, clamp(3rem, 6vw, 5rem)) 0' }}>
      <div style={A_CONTAINER}>
        <div style={{ borderRadius: 28, background: 'var(--positive-bg)', border: '1px solid var(--positive-border)', padding: 'clamp(2.5rem, 5vw, 3.5rem) 2rem', textAlign: 'center' }}>
          <h2 style={{ ...A_DISPLAY_MD, margin: 0, color: 'var(--ink)' }}>Ready to start earning?</h2>
          <p style={{ ...A_LEAD, margin: '16px auto 0', maxWidth: 560 }}>
            Join the Clovion affiliate program, grab your link, and earn commission for every brand you bring in.
          </p>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
            <a className="btn btn-primary" href="https://clovion.tolt.io/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Join the Program <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how" style={{ padding: 'var(--section-sm, clamp(3rem, 6vw, 5rem)) 0', background: 'var(--subtle)', scrollMarginTop: 80 }}>
      <div style={A_CONTAINER}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.05fr] md:gap-16 items-center">
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
    <section style={{ padding: 'var(--section-sm, clamp(3rem, 6vw, 5rem)) 0' }}>
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
    <section style={{ padding: 'var(--section-sm, clamp(3rem, 6vw, 5rem)) 0' }}>
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
              <a className="btn btn-invert" href="https://clovion.tolt.io/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
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
      <Commission />
      <ThreeTiers />
      <FeaturedPartners />
      <StartEarningCTA />
      <HowItWorks />
      <WhoFor />
      <FinalCTA />
    </>
  )
}

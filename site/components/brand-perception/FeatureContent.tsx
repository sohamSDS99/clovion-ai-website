'use client'

import { useState, useEffect, type CSSProperties, type ReactNode } from 'react'

/* ── Layout / type constants ───────────────────────────────────── */
const S_CONTAINER: CSSProperties = { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 2rem' }
const S_DISPLAY_LG: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-lg)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-lg)',
  lineHeight: 1.02,
  textWrap: 'balance' as CSSProperties['textWrap'],
}
const S_DISPLAY_MD: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.05,
  textWrap: 'balance' as CSSProperties['textWrap'],
}
const S_LEAD: CSSProperties = {
  fontSize: 'var(--text-lead)',
  lineHeight: 1.55,
  fontWeight: 400,
  color: 'var(--ink-70)',
  textWrap: 'balance' as CSSProperties['textWrap'],
}

/* ── Inline icons ──────────────────────────────────────────────── */
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10m-4-4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CheckIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

/* ── Typing headline ───────────────────────────────────────────── */
function TypingHeadline({
  text,
  style,
  caretColor,
  as = 'h2',
  reserve,
}: {
  text: string
  style?: CSSProperties
  caretColor?: string
  as?: keyof JSX.IntrinsicElements
  reserve?: boolean
}) {
  const [reduce, setReduce] = useState(false)
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    if (mq.matches) setN(text.length)
  }, [text])

  useEffect(() => {
    if (reduce) return
    let timer: ReturnType<typeof setTimeout> | undefined
    if (phase === 'typing') {
      if (n < text.length) timer = setTimeout(() => setN(n + 1), 62)
      else timer = setTimeout(() => setPhase('holding'), 80)
    } else if (phase === 'holding') {
      timer = setTimeout(() => setPhase('deleting'), 4200)
    } else {
      if (n > 0) timer = setTimeout(() => setN(n - 1), 28)
      else timer = setTimeout(() => setPhase('typing'), 650)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [n, phase, reduce, text])

  const blinking = reduce || phase === 'holding'
  const Tag = as as any

  return (
    <Tag style={reserve ? { ...style, position: 'relative' } : style}>
      {reserve && (
        <span aria-hidden style={{ visibility: 'hidden' }}>
          {text}
        </span>
      )}
      <span style={reserve ? { position: 'absolute', inset: 0 } : undefined}>
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
      </span>
    </Tag>
  )
}

/* ── Mono eyebrow ──────────────────────────────────────────────── */
function MonoEyebrow({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: color || 'var(--ink-60)',
      }}
    >
      {children}
    </span>
  )
}

/* ── Data ──────────────────────────────────────────────────────── */
const BP_ATTRIBUTES: { name: string; body: string }[] = [
  {
    name: 'Ease of use',
    body: 'Does AI describe your platform as simple, intuitive, beginner-friendly, complex, technical, or difficult to adopt?',
  },
  {
    name: 'Audience fit',
    body: 'Does AI position your product for SMBs, startups, agencies, enterprise teams, marketers, developers, or technical users?',
  },
  {
    name: 'Product maturity',
    body: 'Does AI frame your brand as established, emerging, enterprise-ready, lightweight, niche, or still developing?',
  },
  {
    name: 'Pricing perception',
    body: 'Does AI describe your product as affordable, premium, expensive, cost-effective, or better suited for larger budgets?',
  },
  {
    name: 'Category fit',
    body: 'Does AI place your brand in the right category, or does it misunderstand what your product actually does?',
  },
  {
    name: 'Strengths',
    body: 'Which capabilities does AI associate with your brand, such as analytics, reporting, automation, integrations, optimization, or ease of setup?',
  },
  {
    name: 'Limitations',
    body: 'What caveats does AI attach to your brand, such as missing features, setup effort, limited coverage, unclear pricing, or weaker enterprise fit?',
  },
  {
    name: 'Competitor contrast',
    body: 'Does AI describe competitors as more established, easier to use, cheaper, more advanced, or better suited for certain teams?',
  },
]

const BP_STEPS: {
  label: string
  body: string
  exampleLabel: string
  example: string
}[] = [
  {
    label: 'Step 1 — Surfaced',
    body: 'Clovion identifies a recurring perception in AI-generated answers.',
    exampleLabel: 'Example',
    example:
      'AI repeatedly describes your platform as “best for small teams” even though your product supports both SMB and enterprise workflows.',
  },
  {
    label: 'Step 2 — Diagnosed',
    body: 'Clovion shows which prompts, engines, and sources are contributing to that perception.',
    exampleLabel: 'Example Finding',
    example:
      'The “small team” perception appears mostly in ChatGPT and Gemini answers, especially on prompts related to pricing, ease of use, and alternatives.',
  },
  {
    label: 'Step 3 — Improved',
    body: 'Clovion connects the perception gap to content and positioning recommendations.',
    exampleLabel: 'Example Action',
    example:
      'Improve enterprise use-case pages, security content, integration pages, comparison pages, and FAQs that prove the platform supports larger teams.',
  },
]

const BP_FAQS: { q: string; a: string }[] = [
  {
    q: 'What is Brand Perception in Clovion?',
    a: 'Brand Perception is a Clovion feature that shows how AI engines describe and position your brand. It surfaces the attributes AI associates with your product, such as audience fit, ease of use, pricing perception, product maturity, strengths, limitations, and competitor framing.',
  },
  {
    q: 'How is Brand Perception different from Sentiment Analysis?',
    a: 'Sentiment Analysis shows whether an AI mention is positive, neutral, or negative. Brand Perception shows what AI believes about your brand, such as whether it is seen as enterprise-ready, easy to use, affordable, technical, niche, mature, or best for a specific audience.',
  },
  {
    q: 'What are brand perception attributes?',
    a: 'Brand perception attributes are recurring labels or themes AI engines attach to your brand. These may include ease of use, pricing, target audience, maturity, category fit, strengths, limitations, setup complexity, and competitor comparisons.',
  },
  {
    q: 'Why does AI brand perception matter?',
    a: 'AI brand perception matters because buyers may rely on AI-generated answers before visiting your website. If AI engines describe your product inaccurately or incompletely, buyers may form the wrong impression before they reach your content.',
  },
  {
    q: 'Can Clovion show if AI thinks my product is for SMBs or enterprise teams?',
    a: 'Yes. Clovion can surface audience-fit signals, including whether AI engines describe your product as best for SMBs, startups, agencies, enterprise teams, technical users, marketers, or another audience.',
  },
  {
    q: 'Can Clovion show if AI thinks my product is easy to use?',
    a: 'Yes. Clovion can identify ease-of-use attributes, including whether AI describes your platform as simple, intuitive, technical, complex, beginner-friendly, or difficult to adopt.',
  },
  {
    q: 'Can Clovion compare my brand perception against competitors?',
    a: 'Yes. Clovion can compare how AI engines describe your brand and competitors in the same answers, prompts, topics, and engines.',
  },
  {
    q: 'Does Brand Perception connect to GEO Recommendations?',
    a: 'Yes. When Clovion identifies a perception gap, the insight can support GEO recommendations that help your team improve content structure, messaging, schema, authority signals, and AI-readable explanations.',
  },
  {
    q: 'What should I do if AI describes my brand incorrectly?',
    a: 'Start by identifying which prompts, engines, and sources contribute to the incorrect description. Then update owned content, strengthen relevant feature pages, improve schema and FAQs, and create clearer explanations around the perception gap.',
  },
  {
    q: 'Which teams should use Brand Perception?',
    a: 'Brand Perception is useful for marketing, SEO, product marketing, communications, founders, and leadership teams that want to understand how AI engines are shaping buyer perception.',
  },
]

const ENGINE_LOGO: Record<string, string> = {
  ChatGPT: '/logos/chatgpt.svg',
  Claude: '/logos/claude.svg',
  Gemini: '/logos/gemini.svg',
  Perplexity: '/logos/perplexity.svg',
}

const HERO_ENGINE_ROWS: { engine: keyof typeof ENGINE_LOGO; attribute: string; tone: 'pos' | 'neu' | 'neg' }[] = [
  { engine: 'ChatGPT', attribute: 'Best for small teams', tone: 'neu' },
  { engine: 'Claude', attribute: 'Enterprise-ready', tone: 'pos' },
  { engine: 'Perplexity', attribute: 'Premium pricing', tone: 'neg' },
  { engine: 'Gemini', attribute: 'Easy to use', tone: 'pos' },
]

/* ── Hero dashboard mock (inline, minimal) ─────────────────────── */
function HeroPerceptionMock() {
  const toneColor = (t: 'pos' | 'neu' | 'neg') =>
    t === 'pos'
      ? { dot: 'var(--positive, #10b981)', label: 'Positive' }
      : t === 'neg'
      ? { dot: 'rgba(239,68,68,0.85)', label: 'Negative' }
      : { dot: 'var(--ink-40)', label: 'Neutral' }

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--line)',
        background: 'var(--white)',
        boxShadow: 'var(--shadow-card)',
        padding: 20,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 14,
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-50)',
            }}
          >
            Perception · Per engine
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            color: 'var(--ink-40)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          Live
        </span>
      </div>

      <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
        {HERO_ENGINE_ROWS.map((row) => {
          const tone = toneColor(row.tone)
          return (
            <div
              key={row.engine}
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr auto',
                gap: 12,
                alignItems: 'center',
                padding: '12px 14px',
                borderRadius: 12,
                border: '1px solid var(--line)',
                background: 'var(--subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    height: 22,
                    width: 22,
                    borderRadius: 6,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ENGINE_LOGO[row.engine]}
                    alt={String(row.engine)}
                    style={{ height: 14, width: 'auto', filter: 'var(--logo-filter, brightness(0))' }}
                  />
                </span>
                <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--ink)' }}>{row.engine}</span>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--ink-80)' }}>{row.attribute}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span
                  style={{
                    height: 7,
                    width: 7,
                    borderRadius: 999,
                    background: tone.dot,
                  }}
                />
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--ink-60)',
                  }}
                >
                  {tone.label}
                </span>
              </span>
            </div>
          )
        })}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: '14px 16px',
          borderRadius: 12,
          border: '1px dashed var(--line)',
          background: 'var(--white)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--ink-50)',
          }}
        >
          Perception gap
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '0.92rem', lineHeight: 1.5, color: 'var(--ink-80)' }}>
          AI frames your product as “best for small teams,” but your buyer base includes enterprise.
        </p>
      </div>
    </div>
  )
}

/* ── From description to direction visual ──────────────────────── */
const FLOW_NODES: { label: string; body: string }[] = [
  { label: 'Prompt', body: 'What are the best AI visibility platforms for B2B teams?' },
  {
    label: 'AI answer excerpt',
    body: '“Clovion AI is a lightweight option that works well for small marketing teams.”',
  },
  { label: 'Perception attributes', body: 'Audience fit · Product maturity · Category fit' },
  {
    label: 'Competitor comparison',
    body: 'Competitor framed as “enterprise-ready, used by larger organizations.”',
  },
  { label: 'Source context', body: 'Cited from an outdated review focused on early-stage features.' },
  {
    label: 'Recommended action',
    body: 'Strengthen enterprise use-case content, security pages, and integration depth.',
  },
]

function DescriptionToDirectionMock() {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--line)',
        background: 'var(--white)',
        boxShadow: 'var(--shadow-card)',
        padding: 24,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 14,
          borderBottom: '1px solid var(--line)',
          marginBottom: 18,
        }}
      >
        <MonoEyebrow>Perception detail</MonoEyebrow>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            color: 'var(--ink-40)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          06 signals
        </span>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {FLOW_NODES.map((node, i) => (
          <div key={node.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <span
              style={{
                flexShrink: 0,
                height: 26,
                width: 26,
                borderRadius: 999,
                border: '1px solid var(--line)',
                background: 'var(--subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--ink-60)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--ink-50)',
                }}
              >
                {node.label}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--ink-80)' }}>
                {node.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 01 — HERO ─────────────────────────────────────────────────── */
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
            'radial-gradient(ellipse 70% 55% at 70% 0%, rgba(10,10,15,0.06) 0%, rgba(10,10,15,0.02) 30%, transparent 70%)',
        }}
      />
      <div style={{ ...S_CONTAINER, padding: '3.5rem 2rem 5rem' }}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.02fr_1fr] md:gap-16 items-center">
          <div>
            <MonoEyebrow>01 — BRAND PERCEPTION</MonoEyebrow>
            <TypingHeadline
              as="h1"
              text="Know what AI says about your brand."
              reserve
              style={{
                ...S_DISPLAY_LG,
                fontSize: 'clamp(2rem, 3vw + 0.3rem, 3.1rem)',
                margin: '18px 0 0',
              }}
            />
            <p style={{ ...S_LEAD, maxWidth: 560, margin: '1.75rem 0 0' }}>
              Clovion shows how AI engines describe your brand, from ease of use and target audience to pricing
              perception, category fit, strengths, limitations, and competitor positioning.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                className="btn btn-primary btn-lg"
                href="https://app.clovion.ai/signup"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                Start free trial <ArrowRight />
              </a>
              <a className="btn btn-secondary btn-lg" href="/free-ai-visibility-score">
                Get free score
              </a>
            </div>
            <div
              style={{
                marginTop: 24,
                display: 'flex',
                gap: 20,
                flexWrap: 'wrap',
                fontSize: '0.86rem',
                color: 'var(--ink-60)',
              }}
            >
              {['Attribute extraction', 'Per-engine framing', 'Connected to GEO fixes'].map((t) => (
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
                    <CheckIcon size={10} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <HeroPerceptionMock />
        </div>
      </div>
    </section>
  )
}

/* ── 02 — FOUR DIMENSIONS ─────────────────────────────────────── */
function FourDimensions() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={S_CONTAINER}>
        <div style={{ maxWidth: 820 }}>
          <MonoEyebrow>AI PERCEPTION ANALYSIS</MonoEyebrow>
          <h2 style={{ ...S_DISPLAY_MD, margin: '18px 0 0' }}>AI does not just mention your brand. It shapes it.</h2>
          <p style={{ ...S_LEAD, margin: '24px 0 0' }}>
            Your brand may appear in AI answers, but the way it is described can influence how buyers understand you
            before they reach your website.
          </p>
          <p style={{ ...S_LEAD, margin: '14px 0 0' }}>
            AI engines may frame your product as simple, technical, affordable, expensive, enterprise-ready, better for
            SMBs, strong in analytics, weak in integrations, or less mature than a competitor.
          </p>
          <p style={{ ...S_LEAD, margin: '14px 0 0' }}>
            Clovion&rsquo;s Brand Perception feature surfaces those patterns so your team can see what AI believes your
            brand stands for, and where that perception needs to change.
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── 03 — PERCEPTION ATTRIBUTES ───────────────────────────────── */
function PerceptionAttributes() {
  return (
    <section style={{ padding: 'var(--section) 0', background: 'var(--subtle)' }}>
      <div style={S_CONTAINER}>
        <div style={{ maxWidth: 820 }}>
          <MonoEyebrow>PERCEPTION ATTRIBUTES</MonoEyebrow>
          <p
            style={{
              margin: '18px 0 0',
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: 'var(--ink-70)',
              letterSpacing: '-0.005em',
            }}
          >
            How does AI brand sentiment data connect to action?
          </p>
          <h2 style={{ ...S_DISPLAY_MD, margin: '14px 0 0' }}>The attributes AI attaches to your brand.</h2>
          <p style={{ ...S_LEAD, margin: '20px 0 0' }}>
            Clovion identifies recurring attributes in AI-generated answers and connects them back to the prompts,
            engines, competitors, and sources shaping that perception.
          </p>
        </div>

        <div
          style={{
            marginTop: 44,
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--line)',
            background: 'var(--white)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: 0,
              padding: '16px 24px',
              borderBottom: '1px solid var(--line)',
              background: 'var(--subtle)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--ink-50)',
                fontWeight: 600,
              }}
            >
              Attribute
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--ink-50)',
                fontWeight: 600,
              }}
            >
              What Clovion helps you understand
            </div>
          </div>

          {/* Body rows */}
          {BP_ATTRIBUTES.map((row, i) => (
            <div
              key={row.name}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 2fr',
                gap: 0,
                padding: '20px 24px',
                borderTop: i === 0 ? 'none' : '1px solid var(--line)',
                background: 'var(--white)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.02rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--ink)',
                  paddingRight: 16,
                }}
              >
                {row.name}
              </div>
              <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--ink-70)' }}>{row.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 04 — HOW IT WORKS ────────────────────────────────────────── */
function HowItWorks() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={S_CONTAINER}>
        <div style={{ maxWidth: 820 }}>
          <MonoEyebrow>BUILT FOR YOUR TEAM</MonoEyebrow>
          <h2 style={{ ...S_DISPLAY_MD, margin: '18px 0 0' }}>
            Turn AI perception into a positioning workflow.
          </h2>
          <p style={{ ...S_LEAD, margin: '24px 0 0' }}>
            Brand Perception helps marketing, SEO, product marketing, and leadership teams understand how AI engines
            position the brand across buyer prompts.
          </p>
          <p style={{ ...S_LEAD, margin: '14px 0 0' }}>
            Brand Perception analyzes the meaning behind AI-generated descriptions. Instead of only asking whether a
            mention is positive or negative, Clovion identifies the specific attributes AI connects to your brand.
          </p>
        </div>

        <div
          style={{
            marginTop: 44,
            display: 'grid',
            gap: 16,
          }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
        >
          {BP_STEPS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--line)',
                background: 'var(--white)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: 'var(--ink-50)',
                  fontWeight: 600,
                }}
              >
                {s.label}
              </span>
              <p style={{ margin: '14px 0 0', fontSize: '1.02rem', lineHeight: 1.5, color: 'var(--ink)' }}>{s.body}</p>
              <div
                style={{
                  marginTop: 20,
                  padding: '14px 16px',
                  borderRadius: 12,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--ink-50)',
                  }}
                >
                  {s.exampleLabel}
                </div>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem', lineHeight: 1.55, color: 'var(--ink-80)' }}>
                  {s.example}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 05 — FROM DESCRIPTION TO DIRECTION ───────────────────────── */
function DescriptionToDirection() {
  return (
    <section style={{ padding: 'var(--section) 0', background: 'var(--subtle)' }}>
      <div style={S_CONTAINER}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16 items-center">
          <div>
            <h2 style={{ ...S_DISPLAY_MD, margin: 0 }}>From description to direction</h2>
            <p style={{ ...S_LEAD, margin: '24px 0 0' }}>
              Use Brand Perception to identify unclear positioning, outdated descriptions, missing differentiators, and
              perception gaps that may affect how buyers understand your product in AI search.
            </p>
          </div>
          <DescriptionToDirectionMock />
        </div>
      </div>
    </section>
  )
}

/* ── 06 — FAQ ─────────────────────────────────────────────────── */
function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: '1px solid var(--line)' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          padding: '24px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'var(--font-display)',
        }}
      >
        <span style={{ fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>{q}</span>
        <span
          style={{
            flexShrink: 0,
            color: 'var(--ink-60)',
            transform: open ? 'rotate(45deg)' : 'none',
            transition: 'transform .25s ease',
          }}
        >
          <PlusIcon size={18} />
        </span>
      </button>
      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? 600 : 0,
          transition: 'max-height .35s var(--ease-out-expo)',
        }}
      >
        <p style={{ margin: 0, padding: '0 48px 26px 0', fontSize: '1rem', lineHeight: 1.6, color: 'var(--ink-70)' }}>
          {a}
        </p>
      </div>
    </div>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number>(0)
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={S_CONTAINER}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <MonoEyebrow>✦</MonoEyebrow>
            <h2 style={{ ...S_DISPLAY_MD, margin: '16px 0 0' }}>Questions about sentiment.</h2>
            <a
              style={{
                marginTop: 24,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--ink)',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              Talk to us <ArrowRight />
            </a>
          </div>
          <div>
            {BP_FAQS.map((f, i) => (
              <FAQItem
                key={i}
                q={f.q}
                a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 07 — FINAL CTA (dark) ────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={S_CONTAINER}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 28,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            padding: '6rem 3.5rem',
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
              <MonoEyebrow color="var(--on-ink-70)">START WITH PERCEPTION</MonoEyebrow>
            </span>
            <h2 style={{ ...S_DISPLAY_LG, margin: '20px 0 0', color: 'var(--on-ink)' }}>
              Track what AI thinks of your brand.
            </h2>
            <p style={{ ...S_LEAD, color: 'var(--on-ink-70)', marginTop: 24, maxWidth: 560 }}>
              Find out how AI engines describe your product, who they think it is for, which attributes they attach to
              your brand, and what your team needs to clarify.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                className="btn btn-primary btn-lg"
                href="/free-ai-visibility-score"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                Get free score <ArrowRight />
              </a>
              <a className="btn btn-secondary btn-lg" href="https://app.clovion.ai/signup">
                Start free trial
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function FeatureContent() {
  return (
    <>
      {/* SECTION 01 — HERO */}
      <Hero />
      {/* SECTION 02 — FOUR DIMENSIONS */}
      <FourDimensions />
      {/* SECTION 03 — PERCEPTION ATTRIBUTES */}
      <PerceptionAttributes />
      {/* SECTION 04 — HOW IT WORKS */}
      <HowItWorks />
      {/* SECTION 05 — FROM DESCRIPTION TO DIRECTION */}
      <DescriptionToDirection />
      {/* SECTION 06 — FAQ */}
      <FAQ />
      {/* SECTION 07 — FINAL CTA */}
      <FinalCTA />
    </>
  )
}

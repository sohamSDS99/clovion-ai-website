'use client'

import { useState, useEffect, Fragment, type CSSProperties, type ReactNode } from 'react'
import SentimentDashboard from './SentimentDashboard'
import SentimentExplorer from './SentimentExplorer'
import SentimentDetailCard from './SentimentDetailCard'
import SentimentDiagnosed from './SentimentDiagnosed'
import SentimentImproved from './SentimentImproved'

/* ── Layout / type constants ───────────────────────────────────── */
const S_CONTAINER: CSSProperties = { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 2rem' }
const S_DISPLAY_LG: CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 'var(--display-lg)', fontWeight: 600, letterSpacing: 'var(--track-display-lg)', lineHeight: 1.02, textWrap: 'balance' as CSSProperties['textWrap'] }
const S_DISPLAY_MD: CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 'var(--display-md)', fontWeight: 600, letterSpacing: 'var(--track-display-md)', lineHeight: 1.05, textWrap: 'balance' as CSSProperties['textWrap'] }
const S_LEAD: CSSProperties = { fontSize: 'var(--text-lead)', lineHeight: 1.55, fontWeight: 400, color: 'var(--ink-70)', textWrap: 'balance' as CSSProperties['textWrap'] }

/* ── Inline icons (no external primitives) ─────────────────────── */
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

/* ── Section icons (Four Dimensions) ───────────────────────────── */
function SIcon({ children, size = 20, vb = 24 }: { children: ReactNode; size?: number; vb?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${vb} ${vb}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

const ICON_POS = (
  <SIcon>
    <g>
      <path d="M7 11v8" />
      <path d="M11 11l1.2-5a1.8 1.8 0 0 1 3.4.7L15 11h3.4a2 2 0 0 1 2 2.4l-1.1 5.2A2 2 0 0 1 17.3 20H11" />
      <path d="M7 11H4v9h3" />
    </g>
  </SIcon>
)

const ICON_NEU = (
  <SIcon>
    <g>
      <line x1="5" y1="9" x2="19" y2="9" />
      <line x1="5" y1="15" x2="19" y2="15" />
    </g>
  </SIcon>
)

const ICON_NEG = (
  <SIcon>
    <g transform="translate(0,1)">
      <path d="M7 13V5" />
      <path d="M11 13l1.2 5a1.8 1.8 0 0 0 3.4-.7L15 13h3.4a2 2 0 0 0 2-2.4l-1.1-5.2A2 2 0 0 0 17.3 4H11" />
      <path d="M7 13H4V4h3" />
    </g>
  </SIcon>
)

const ICON_COMP = (
  <SIcon>
    <g>
      <circle cx="7" cy="8" r="2.4" />
      <circle cx="17" cy="8" r="2.4" />
      <path d="M2.5 18c0-2.7 2-4.4 4.5-4.4s4.5 1.7 4.5 4.4" />
      <path d="M13 17.4c.3-2.2 2-3.5 4-3.5 2.4 0 4.5 1.6 4.5 4.1" />
    </g>
  </SIcon>
)

/* ── Data ──────────────────────────────────────────────────────── */
const S_JUMPS = [
  { n: '01', label: 'Four dimensions of sentiment', href: '#dimensions' },
  { n: '02', label: 'From mention to action', href: '#action' },
  { n: '03', label: 'Versus the alternatives', href: '#versus' },
]

const S_FOUR = [
  {
    name: 'Positive Mentions',
    icon: ICON_POS,
    body: 'See where AI engines describe your brand with favorable language, strong recommendations, or category leadership signals.',
  },
  {
    name: 'Neutral Mentions',
    icon: ICON_NEU,
    body: 'Find factual mentions that include your brand but do not strongly recommend, differentiate, or position you.',
  },
  {
    name: 'Negative Mentions',
    icon: ICON_NEG,
    body: 'Identify prompts where AI engines mention limitations, concerns, outdated information, missing features, pricing issues, or weak positioning.',
  },
  {
    name: 'Competitor Framing',
    icon: ICON_COMP,
    body: 'Compare how AI engines describe your brand against competitors in the same answers, prompts, topics, and regions.',
  },
]

const CALC_STEPS = [
  {
    n: '01',
    title: 'Brand Mention Detected',
    body: 'Clovion identifies when your brand appears in an AI-generated answer across supported engines.',
  },
  {
    n: '02',
    title: 'Context Reviewed',
    body: 'The system reads the surrounding text to understand the language, comparison, recommendation, caveat, or claim attached to the mention.',
  },
  {
    n: '03',
    title: 'Sentiment Classified',
    body: 'Each mention is classified as positive, neutral, or negative based on how the AI engine describes your brand.',
  },
  {
    n: '04',
    title: 'Signal Connected',
    body: 'The sentiment result is tied back to the prompt, engine, competitor context, cited sources, and visibility score.',
  },
]

const VERSUS = [
  {
    n: '01',
    title: 'Per-engine sentiment, not a blended average.',
    body: 'Most tools show one sentiment number across all engines. Clovion shows sentiment per engine, per region, per day. Claude being warm while Perplexity is cool on the same brand is actionable information. A blended score hides it.',
  },
  {
    n: '02',
    title: 'Connected to fixes, not just a dashboard.',
    body: 'Many tools surface sentiment data but leave the “now what?” to your team. Clovion connects sentiment findings directly to the GEO recommendations engine — the same product that shows “Perplexity says you’re expensive” also opens the content editor with rules for fixing that perception. Measurement and remedy in one loop.',
  },
  {
    n: '03',
    title: 'Transparent formula, not a proprietary “sentiment AI.”',
    body: 'The calculation is three stages with a fixed formula: classify per mention, net across the day, normalize to 0–100. No opaque model, no unexplainable score. You can reproduce the math from the raw mention data. Competitors often ship a sentiment number with no explanation of how it was derived.',
  },
]

const S_COV_ENGINES = ['ChatGPT', 'Claude', 'Perplexity', 'Gemini', 'Grok', 'AI Overviews']
const ENGINE_LOGO: Record<string, string> = {
  ChatGPT: '/logos/chatgpt.svg',
  Claude: '/logos/claude.svg',
  Gemini: '/logos/gemini.svg',
  Perplexity: '/logos/perplexity.svg',
  Grok: '/logos/grok-icon.svg',
  'AI Overviews': '/logos/google-ai.svg',
}

const TEAM_ROW = [
  'Prompt Sentiment',
  'Engine Comparison',
  'Competitor Framing',
  'Source Context',
  'GEO Recommendations',
  'Alerts',
]

const S_FAQS = [
  {
    q: 'What is AI sentiment analysis?',
    a: 'AI sentiment analysis measures whether AI-generated answers describe your brand positively, neutrally, or negatively. In Clovion, sentiment is tied to brand mentions across AI engines, prompts, competitors, and citations.',
  },
  {
    q: 'What is brand sentiment in AI search?',
    a: 'Brand sentiment in AI search is the tone AI engines use when they describe your company, product, or category position. It shows whether your brand is being recommended, described neutrally, or framed with concerns.',
  },
  {
    q: 'How does Clovion track brand sentiment in ChatGPT?',
    a: 'Clovion runs buyer-style prompts across ChatGPT, detects brand mentions, analyzes the surrounding context, and classifies the mention as positive, neutral, or negative.',
  },
  {
    q: 'Can Clovion track sentiment in Perplexity?',
    a: 'Yes. Clovion tracks how Perplexity describes your brand when it appears in AI-generated answers, including sentiment and citation context where sources are available.',
  },
  {
    q: 'Why does AI sentiment matter?',
    a: 'AI sentiment matters because buyers may form opinions based on how AI engines summarize your brand. A brand that appears often but is described with caveats, concerns, or weak positioning may still lose demand to competitors.',
  },
  {
    q: 'What is the difference between AI sentiment analysis and social listening?',
    a: 'Social listening tracks what people say about your brand on social platforms, forums, and review sites. AI sentiment analysis tracks what AI engines themselves say about your brand when answering buyer questions.',
  },
  {
    q: 'Does Clovion compare sentiment against competitors?',
    a: 'Yes. Clovion helps teams compare how AI engines describe their brand against competitors, so they can identify positioning gaps and topics that need improvement.',
  },
  {
    q: 'Can sentiment analysis improve GEO strategy?',
    a: 'Yes. Sentiment analysis helps identify which prompts, topics, and sources create weak or negative positioning. Those insights can guide GEO recommendations, content updates, comparison pages, and authority-building work.',
  },
  {
    q: 'What causes negative AI sentiment?',
    a: 'Negative AI sentiment can come from outdated content, missing feature information, weak third-party sources, poor reviews, competitor comparisons, pricing concerns, or AI-generated summaries that lack current context.',
  },
  {
    q: 'How often should AI brand sentiment be monitored?',
    a: 'AI brand sentiment should be monitored regularly because AI-generated answers can change as sources, prompts, competitors, and content updates change. Clovion refreshes visibility tracking daily.',
  },
  {
    q: 'What should I look for in an AI sentiment analysis tool?',
    a: 'A strong AI sentiment analysis tool should track positive, neutral, and negative mentions, compare sentiment across engines, connect sentiment to prompts and sources, benchmark competitors, and show what to improve next.',
  },
]

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
        <div style={{ display: 'grid', gridTemplateColumns: '1.02fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <TypingHeadline
              as="h1"
              text="Know what AI thinks of you. Engine by engine."
              reserve
              style={{ ...S_DISPLAY_LG, fontSize: 'clamp(2rem, 3vw + 0.3rem, 3.1rem)', margin: 0 }}
            />
            <p style={{ ...S_LEAD, maxWidth: 560, margin: '1.75rem 0 0' }}>
              Track whether AI engines describe your brand positively, neutrally, or negatively across ChatGPT, Claude,
              Gemini, Perplexity, Grok, and Google AI Overviews.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-primary btn-lg" href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Start Free Trial <ArrowRight />
              </a>
              <a className="btn btn-secondary btn-lg" href="/free-ai-visibility-score">
                Get Free Score
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
              {['Per-engine sentiment', 'Every mention classified', 'Connected to fixes'].map((t) => (
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
          <SentimentDashboard />
        </div>
      </div>
    </section>
  )
}

/* ── 02 — JUMP LINKS ───────────────────────────────────────────── */
function JumpLinks() {
  return (
    <section style={{ padding: '0 0 1rem' }}>
      <div style={S_CONTAINER}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {S_JUMPS.map((j) => (
            <a key={j.n} href={j.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--line)',
                  background: 'var(--white)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-50)' }}>
                      {j.n}
                    </span>
                    <div style={{ marginTop: 8, fontSize: '1rem', fontWeight: 600, color: 'var(--ink)' }}>{j.label}</div>
                  </div>
                  <span style={{ color: 'var(--ink)', display: 'inline-flex' }}>
                    <ArrowRight size={15} />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 03 — FOUR DIMENSIONS ─────────────────────────────────────── */
function FourDimensions() {
  return (
    <section id="dimensions" style={{ padding: 'var(--section) 0', scrollMarginTop: 80 }}>
      <div style={S_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <h2 style={{ ...S_DISPLAY_MD, margin: 0 }}>Every brand mention has a tone. Know yours.</h2>
          <p style={{ ...S_LEAD, margin: '24px 0 0' }}>
            Four dimensions of sentiment, not just a score. AI engines do more than mention your brand. They compare you,
            qualify you, recommend you, or describe you with caveats.
          </p>
          <p style={{ ...S_LEAD, margin: '14px 0 0' }}>
            Clovion turns those AI-generated descriptions into a clear sentiment view, helping your team understand how
            your brand is framed across AI search.
          </p>
        </div>
        <div
          style={{
            marginTop: 44,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'grid', gap: 12 }}>
            {S_FOUR.map((f) => (
              <div
                key={f.name}
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  padding: 18,
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
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: 'var(--ink)',
                    }}
                  >
                    {f.name}
                  </span>
                  <p style={{ margin: '8px 0 0', fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--ink-70)' }}>
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <SentimentExplorer />
        </div>
      </div>
    </section>
  )
}

/* ── 04 — CALCULATION ─────────────────────────────────────────── */
function Calculation() {
  return (
    <section
      id="calculation"
      style={{ padding: 'var(--section) 0', background: 'var(--subtle)', scrollMarginTop: 80 }}
    >
      <div style={S_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <MonoEyebrow>How it works</MonoEyebrow>
          <h2 style={{ ...S_DISPLAY_MD, margin: '18px 0 0' }}>How a mention becomes a sentiment signal.</h2>
          <p style={{ ...S_LEAD, margin: '20px 0 0' }}>
            Clovion analyzes the context around every AI-generated brand mention to understand not just whether you
            appeared, but how the answer described you.
          </p>
        </div>
        <div
          style={{
            marginTop: 44,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'grid', gap: 12 }}>
            {CALC_STEPS.map((s) => (
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
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      margin: 0,
                      color: 'var(--ink)',
                    }}
                  >
                    {s.title}
                  </h3>
                  <p style={{ margin: '8px 0 0', fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--ink-70)' }}>
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <SentimentDetailCard />
        </div>
      </div>
    </section>
  )
}

/* ── 05 — ACTION ──────────────────────────────────────────────── */
function ActionStep({
  eyebrow,
  headline,
  body,
  example,
  visual,
  flip,
  first,
}: {
  eyebrow: string
  headline: string
  body: string
  example: { label: string; body: string }
  visual: ReactNode
  flip?: boolean
  first?: boolean
}) {
  const copy = (
    <div>
      <MonoEyebrow>{eyebrow}</MonoEyebrow>
      <h3 style={{ ...S_DISPLAY_MD, fontSize: 'var(--display-sm)', margin: '16px 0 0' }}>{headline}</h3>
      <p style={{ ...S_LEAD, fontSize: '1.0625rem', margin: '20px 0 0' }}>{body}</p>
      <div
        style={{
          marginTop: 24,
          padding: '18px 20px',
          borderRadius: 'var(--radius-card)',
          background: 'var(--subtle)',
          border: '1px solid var(--line)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--ink-50)',
          }}
        >
          {example.label}
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '0.96rem', lineHeight: 1.55, color: 'var(--ink-80)' }}>
          {example.body}
        </p>
      </div>
    </div>
  )
  return (
    <div style={{ paddingTop: first ? 0 : 'var(--section-sm)' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'start',
        }}
      >
        {flip ? (
          <Fragment>
            <div>{visual}</div>
            {copy}
          </Fragment>
        ) : (
          <Fragment>
            {copy}
            <div>{visual}</div>
          </Fragment>
        )}
      </div>
    </div>
  )
}

function Action() {
  return (
    <section id="action" style={{ padding: 'var(--section) 0', scrollMarginTop: 80 }}>
      <div style={S_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <MonoEyebrow>From tone to action</MonoEyebrow>
          <h2 style={{ ...S_DISPLAY_MD, margin: '18px 0 0' }}>One sentiment signal, from detected to improved.</h2>
          <p style={{ ...S_LEAD, margin: '20px 0 0' }}>
            Sentiment analysis helps your team move from “AI mentioned us” to “AI described us this way, and here is
            what we should fix.”
          </p>
        </div>
        <div style={{ marginTop: 44 }}>
          <ActionStep
            first
            eyebrow="Step 1 — Detected"
            headline="Find the mention and capture its context."
            body="Clovion finds a brand mention inside an AI-generated answer and captures the surrounding context."
            example={{
              label: 'Example',
              body: 'Prompt: “What are the best AI visibility tools for B2B SaaS teams?” — Detected mention: “Clovion AI is an emerging option, but larger teams may also consider established platforms.”',
            }}
            visual={<SentimentDetailCard />}
          />
          <ActionStep
            flip
            eyebrow="Step 2 — Diagnosed"
            headline="Classify the tone and explain why."
            body="Clovion classifies the tone and identifies why the mention may be positive, neutral, or negative."
            example={{
              label: 'Example finding',
              body: 'The mention is neutral-to-weak because the answer positions Clovion as “emerging” while competitors are described as “established” or “enterprise-ready.”',
            }}
            visual={<SentimentDiagnosed />}
          />
          <ActionStep
            eyebrow="Step 3 — Improved"
            headline="Connect weak sentiment to real page fixes."
            body="Clovion connects weak or negative sentiment to content and positioning opportunities."
            example={{
              label: 'Example action',
              body: 'Improve pages that prove enterprise readiness, platform coverage, customer use cases, security, integrations, and measurable AI visibility workflows.',
            }}
            visual={<SentimentImproved />}
          />
        </div>
      </div>
    </section>
  )
}

/* ── 06 — VERSUS ──────────────────────────────────────────────── */
function Versus() {
  return (
    <section id="versus" style={{ padding: 'var(--section) 0', scrollMarginTop: 80 }}>
      <div style={S_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <MonoEyebrow>Why Clovion AI</MonoEyebrow>
          <h2 style={{ ...S_DISPLAY_MD, margin: '18px 0 0' }}>What the other tools don’t close.</h2>
          <p style={{ ...S_LEAD, margin: '20px 0 0' }}>
            Many tools offer some form of brand sentiment scoring. The difference is what happens after the score.
          </p>
        </div>
        <div
          style={{
            marginTop: 44,
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 20,
          }}
        >
          {VERSUS.map((v) => (
            <div
              key={v.n}
              style={{
                padding: '2rem',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--line)',
                background: 'var(--white)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-40)' }}>{v.n}</span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                  margin: '16px 0 0',
                  color: 'var(--ink)',
                }}
              >
                {v.title}
              </h3>
              <p style={{ margin: '14px 0 0', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--ink-70)' }}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 07 — ENGINE COVERAGE ─────────────────────────────────────── */
function EngineCoverage() {
  return (
    <section style={{ padding: 'var(--section) 0', background: 'var(--subtle)' }}>
      <div style={{ ...S_CONTAINER, textAlign: 'center' }}>
        <h2 style={{ ...S_DISPLAY_MD, margin: '0 auto', maxWidth: 720 }}>Every engine. Every mention. Every day.</h2>
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          {S_COV_ENGINES.map((e) => (
            <span
              key={e}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 11,
                padding: '13px 22px',
                borderRadius: 999,
                background: 'var(--white)',
                border: '1px solid var(--line)',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--ink)',
              }}
            >
              <span
                style={{
                  height: 24,
                  width: 24,
                  borderRadius: 7,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ENGINE_LOGO[e]}
                  alt={e}
                  style={{ height: e === 'Grok' ? 16 : 15, width: 'auto', filter: 'var(--logo-filter, brightness(0))' }}
                />
              </span>
              {e}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 08 — TEAM WORKFLOW (dark) ────────────────────────────────── */
function TeamWorkflow() {
  return (
    <section
      style={{
        position: 'relative',
        padding: 'var(--section) 0',
        background: 'var(--ink-surface, var(--ink))',
        color: 'var(--on-ink)',
        overflow: 'hidden',
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
      <div style={{ ...S_CONTAINER, position: 'relative' }}>
        <div style={{ maxWidth: 760 }}>
          <TypingHeadline
            as="h2"
            text="Turn AI sentiment into strategy."
            reserve
            caretColor="var(--on-ink)"
            style={{ ...S_DISPLAY_LG, margin: 0, color: 'var(--on-ink)' }}
          />
          <p style={{ ...S_LEAD, color: 'var(--on-ink-70)', marginTop: 24 }}>
            Clovion helps marketing, SEO, product marketing, and communications teams understand how AI engines frame
            the brand across topics and prompts.
          </p>
        </div>
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            gap: 8,
          }}
        >
          {TEAM_ROW.map((w, i) => (
            <Fragment key={w}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 15px',
                  borderRadius: 999,
                  background: 'var(--on-ink-05)',
                  border: '1px solid var(--on-ink-15)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--on-ink)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    color: 'var(--on-ink-50)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                {w}
              </span>
              {i < TEAM_ROW.length - 1 && (
                <span style={{ color: 'var(--on-ink-50)', display: 'inline-flex', flex: 'none' }}>
                  <ArrowRight size={13} />
                </span>
              )}
            </Fragment>
          ))}
        </div>
        <p style={{ ...S_LEAD, color: 'var(--on-ink-70)', marginTop: 40, maxWidth: 820 }}>
          Use AI sentiment analysis to monitor brand perception, spot weak positioning, identify outdated claims, and
          prioritize the pages that should improve how AI engines describe your brand.
        </p>
      </div>
    </section>
  )
}

/* ── 09 — FAQ ─────────────────────────────────────────────────── */
function FAQItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}) {
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '5fr 7fr',
            gap: 64,
            alignItems: 'start',
          }}
        >
          <div style={{ position: 'sticky', top: 96 }}>
            <MonoEyebrow>FAQ</MonoEyebrow>
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
            {S_FAQS.map((f, i) => (
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

/* ── 10 — FINAL CTA (dark) ────────────────────────────────────── */
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
              <MonoEyebrow color="var(--on-ink-70)">Free · Sentiment</MonoEyebrow>
            </span>
            <h2 style={{ ...S_DISPLAY_LG, margin: '20px 0 0', color: 'var(--on-ink)' }}>
              See how AI describes your brand.
            </h2>
            <p style={{ ...S_LEAD, color: 'var(--on-ink-70)', marginTop: 24, maxWidth: 540 }}>
              See where you’re recommended, where you’re cautioned, and where you’re not mentioned at all. No card, no
              trial timer.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a
                className="btn btn-primary btn-lg"
                href="/pricing"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                Start Free Trial <ArrowRight />
              </a>
              <a className="btn btn-secondary btn-lg" href="/free-ai-visibility-score">
                Get Free Score
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
      <Hero />
      <JumpLinks />
      <FourDimensions />
      <Calculation />
      <Action />
      <Versus />
      <EngineCoverage />
      <TeamWorkflow />
      <FAQ />
      <FinalCTA />
    </>
  )
}

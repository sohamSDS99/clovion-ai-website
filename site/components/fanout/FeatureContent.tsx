'use client'

import { useState, useEffect, Fragment, type CSSProperties, type ReactNode } from 'react'
import FanoutDashboard from './FanoutDashboard'
import FanoutExplorer from './FanoutExplorer'
import FanoutExpanded from './FanoutExpanded'
import FanoutAnalyzed from './FanoutAnalyzed'
import FanoutImproved from './FanoutImproved'
import FanoutMap from './FanoutMap'
import { FAQAccordion } from '@/components/FAQAccordion'

const FQ_CONTAINER: CSSProperties = { maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 2rem' }
const FQ_DISPLAY_LG: CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 'var(--display-lg)', fontWeight: 600, letterSpacing: 'var(--track-display-lg)', lineHeight: 1.02, textWrap: 'balance' as CSSProperties['textWrap'] }
const FQ_DISPLAY_MD: CSSProperties = { fontFamily: 'var(--font-display)', fontSize: 'var(--display-md)', fontWeight: 600, letterSpacing: 'var(--track-display-md)', lineHeight: 1.05, textWrap: 'balance' as CSSProperties['textWrap'] }
const FQ_LEAD: CSSProperties = { fontSize: 'var(--text-lead)', lineHeight: 1.55, fontWeight: 400, color: 'var(--ink-70)', textWrap: 'balance' as CSSProperties['textWrap'] }

/* ── Local primitives ─────────────────────────────────────────── */
function FqArrow({ size }: { size?: number }) {
  return (
    <svg width={size || 14} height={size || 14} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FqCheck({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function FqEyebrow({ children, mono }: { children: ReactNode; mono?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-display)',
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--ink-60)',
      }}
    >
      {children}
    </span>
  )
}

type FqBtnProps = {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'lg'
  href?: string
}
function FqBtn({ children, variant = 'primary', href }: FqBtnProps) {
  return (
    <a className={`btn btn-${variant}`} href={href || '#'}>
      {children}
    </a>
  )
}

/* Looping typing headline with blinking caret. Reduced-motion → static. */
type TypingHeadlineProps = {
  text: string
  style?: CSSProperties
  caretColor?: string
  as?: keyof JSX.IntrinsicElements
  reserve?: boolean
}
function TypingHeadline({ text, style, caretColor, as, reserve }: TypingHeadlineProps) {
  const reduce =
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [n, setN] = useState<number>(reduce ? text.length : 0)
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing')

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

  const wrapperStyle: CSSProperties = reserve ? { ...(style || {}), position: 'relative' } : style || {}
  const caret = (
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
  )

  return (
    <Tag style={wrapperStyle}>
      {reserve && (
        <span aria-hidden style={{ visibility: 'hidden' }}>
          {text}
        </span>
      )}
      <span style={reserve ? { position: 'absolute', inset: 0 } : undefined}>
        {text.slice(0, n)}
        {caret}
      </span>
    </Tag>
  )
}

/* ── Local Card primitive ─────────────────────────────────────── */
function FqCard({ children, padding }: { children: ReactNode; padding?: string }) {
  return (
    <div
      style={{
        padding: padding || '1.5rem',
        borderRadius: 'var(--radius-card)',
        background: 'var(--white)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-card)',
        transition: 'transform .2s var(--ease-out-expo), box-shadow .2s var(--ease-out-expo)',
      }}
    >
      {children}
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
      <div style={{ ...FQ_CONTAINER, padding: '3.5rem 2rem 5rem' }}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.02fr_1fr] md:gap-16 items-center">
          <div>
            <TypingHeadline
              as="h1"
              text="See how one prompt becomes many."
              reserve
              style={{ ...FQ_DISPLAY_LG, fontSize: 'clamp(2rem, 3vw + 0.3rem, 3.1rem)', margin: 0 }}
            />
            <p style={{ ...FQ_LEAD, maxWidth: 560, margin: '1.75rem 0 0' }}>
              Expand a single buyer query into related AI search variations, track how each version performs, and uncover the content gaps that affect your brand visibility, citations, and recommendations.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <FqBtn variant="primary" size="lg" href="/pricing">
                Start Free Trial <FqArrow />
              </FqBtn>
              <FqBtn variant="secondary" size="lg" href="/free-ai-visibility-score">
                Get Free Score
              </FqBtn>
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: '0.86rem', color: 'var(--ink-60)' }}>
              {['Deterministic generation', 'Brand-neutral', 'Topic-mapped coverage'].map((t) => (
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
                    <FqCheck size={10} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <FanoutDashboard />
        </div>
      </div>
    </section>
  )
}

/* ── 02 — JUMP LINKS ───────────────────────────────────────────── */
const FQ_JUMPS = [
  { n: '01', label: 'One query, end to end', href: '#how' },
  { n: '02', label: 'Why fan-out matters', href: '#why' },
  { n: '03', label: 'Expand → analyze → improve', href: '#loop' },
  { n: '04', label: 'Common questions', href: '#faq' },
]

function JumpLinks() {
  return (
    <section style={{ padding: '0 0 1rem' }}>
      <div style={FQ_CONTAINER}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          {FQ_JUMPS.map((j) => (
            <a key={j.n} href={j.href} style={{ textDecoration: 'none' }}>
              <FqCard padding="1.5rem">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-50)' }}>{j.n}</span>
                    <div style={{ marginTop: 8, fontSize: '1rem', fontWeight: 600, color: 'var(--ink)' }}>{j.label}</div>
                  </div>
                  <span style={{ color: 'var(--ink)', display: 'inline-flex' }}>
                    <FqArrow size={15} />
                  </span>
                </div>
              </FqCard>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 03 — HOW IT WORKS (expanded → analyzed → improved) ────────── */
type WorkflowExample = { label: string; body: string; label2: string; body2: string }
type WorkflowStepProps = {
  eyebrow: string
  headline: string
  body: string
  example: WorkflowExample
  visual: ReactNode
  flip?: boolean
  first?: boolean
}

function WorkflowStep({ eyebrow, headline, body, example, visual, flip, first }: WorkflowStepProps) {
  const copy = (
    <div>
      <FqEyebrow mono>{eyebrow}</FqEyebrow>
      <h3 style={{ ...FQ_DISPLAY_MD, fontSize: 'var(--display-sm)', margin: '16px 0 0' }}>{headline}</h3>
      <p style={{ ...FQ_LEAD, fontSize: '1.0625rem', margin: '20px 0 0' }}>{body}</p>
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
        <p style={{ margin: '10px 0 0', fontSize: '0.96rem', lineHeight: 1.55, color: 'var(--ink-80)' }}>{example.body}</p>
        <div
          style={{
            marginTop: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--ink-50)',
          }}
        >
          {example.label2}
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '0.96rem', lineHeight: 1.55, color: 'var(--ink-80)' }}>{example.body2}</p>
      </div>
    </div>
  )
  return (
    <div style={{ paddingTop: first ? 0 : 'var(--section-sm)' }}>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 items-center">
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

function HowItWorks() {
  return (
    <section id="how" style={{ padding: 'var(--section) 0', scrollMarginTop: 80 }}>
      <div style={FQ_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <FqEyebrow mono>How it works</FqEyebrow>
          <h2 style={{ ...FQ_DISPLAY_MD, margin: '18px 0 0' }}>One query, from idea to optimization plan.</h2>
          <p style={{ ...FQ_LEAD, margin: '24px 0 0' }}>
            Fanout Query helps your team move beyond tracking one exact prompt. It shows the surrounding query universe that can influence whether AI engines mention your brand, cite your pages, or recommend competitors.
          </p>
          <p style={{ ...FQ_LEAD, margin: '18px 0 0' }}>
            Fanout Query helps teams understand the full search intent behind a prompt, then turn that intent into AI visibility tracking and GEO recommendations.
          </p>
        </div>
        <div style={{ marginTop: 56 }}>
          <WorkflowStep
            first
            eyebrow="Step 1 — Expanded"
            headline="Expand one seed into related variations."
            body="Clovion takes one seed prompt and expands it into related AI search variations."
            example={{
              label: 'Example seed query',
              body: '“What are the best tools for tracking brand visibility across AI search engines?”',
              label2: 'Fanout variations',
              body2:
                'Best AI visibility platforms for SEO teams · Tools to track brand mentions in ChatGPT · How to monitor citations in Perplexity · AI search visibility software for B2B SaaS · Best GEO tools for improving AI search visibility.',
            }}
            visual={<FanoutExpanded />}
          />
          <WorkflowStep
            flip
            eyebrow="Step 2 — Analyzed"
            headline="Run the fanout set and read the answers."
            body="Clovion runs the fanout set and analyzes how AI engines respond."
            example={{
              label: 'Example finding',
              body: 'Your brand appears for broad AI visibility prompts, but competitors appear more often for ChatGPT tracking, Perplexity citation tracking, and GEO optimization prompts.',
              label2: 'Analyzed signals',
              body2: 'Brand mentions, competitor mentions, prompt coverage, citations, sentiment, engine differences, and visibility gaps.',
            }}
            visual={<FanoutAnalyzed />}
          />
          <WorkflowStep
            eyebrow="Step 3 — Improved"
            headline="Connect weak branches to real fixes."
            body="Clovion connects weak fanout branches to content and GEO recommendations."
            example={{
              label: 'Example action',
              body: 'Create or improve pages for ChatGPT rank tracking, Perplexity citation tracking, GEO recommendations, competitor comparisons, and AI crawlability.',
              label2: 'Outcome to monitor',
              body2: 'Prompt coverage, citation rate, visibility score, competitor share of voice, and sentiment movement.',
            }}
            visual={<FanoutImproved />}
          />
        </div>
      </div>
    </section>
  )
}

/* ── 04 — WHY FAN-OUT MATTERS ──────────────────────────────────── */
function FqIcon({ d, size = 20, vb = 24 }: { d: ReactNode; size?: number; vb?: number }) {
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
      {d}
    </svg>
  )
}
const ICON_VARIATIONS = (
  <FqIcon
    d={
      <g>
        <circle cx="6" cy="12" r="2.4" />
        <circle cx="18" cy="5.5" r="2.4" />
        <circle cx="18" cy="18.5" r="2.4" />
        <path d="M8.1 10.8 15.9 6.7" />
        <path d="M8.1 13.2 15.9 17.3" />
      </g>
    }
  />
)
const ICON_BRANCHES = (
  <FqIcon
    d={
      <g>
        <path d="M5 4v6.5a3 3 0 0 0 3 3h11" />
        <path d="M5 13.5a3 3 0 0 0 3 3h11" />
        <path d="M16 10.5 19.5 13.5 16 16.5" />
        <path d="M16 13.5 19.5 16.5 16 19.5" />
      </g>
    }
  />
)
const ICON_CITATION = (
  <FqIcon
    d={
      <g>
        <path d="M9 7.5C7 7.5 6 9 6 11c0 1.6 1.1 2.6 2.4 2.6.9 0 1.6-.5 1.6-1.5 0-1-.7-1.5-1.5-1.5" />
        <path d="M17 7.5c-2 0-3 1.5-3 3.5 0 1.6 1.1 2.6 2.4 2.6.9 0 1.6-.5 1.6-1.5 0-1-.7-1.5-1.5-1.5" />
        <line x1="5" y1="18" x2="19" y2="18" />
      </g>
    }
  />
)
const ICON_OPPORTUNITY = (
  <FqIcon
    d={
      <g>
        <circle cx="11" cy="11" r="7" />
        <line x1="16" y1="16" x2="20.5" y2="20.5" />
        <line x1="11" y1="8.2" x2="11" y2="13.8" />
        <line x1="8.2" y1="11" x2="13.8" y2="11" />
      </g>
    }
  />
)
const FQ_WHY = [
  {
    name: 'Prompt Variations',
    icon: ICON_VARIATIONS,
    body: 'Turn one buyer query into related prompt variations that reflect how AI engines may interpret search intent.',
  },
  {
    name: 'Intent Branches',
    icon: ICON_BRANCHES,
    body: 'Break broad prompts into specific angles such as features, pricing, alternatives, comparisons, industries, and use cases.',
  },
  {
    name: 'Citation Paths',
    icon: ICON_CITATION,
    body: 'See which fanout variations lead AI engines to cite your pages, competitor pages, or third-party sources.',
  },
  {
    name: 'Content Opportunities',
    icon: ICON_OPPORTUNITY,
    body: 'Identify the sub-questions your content does not answer clearly enough for AI engines to mention or cite you.',
  },
]

function WhyFanout() {
  return (
    <section id="why" style={{ padding: 'var(--section) 0', background: 'var(--subtle)', scrollMarginTop: 80 }}>
      <div style={FQ_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <h2 style={{ ...FQ_DISPLAY_MD, margin: 0 }}>One buyer question rarely stays as one query.</h2>
          <p style={{ ...FQ_LEAD, margin: '24px 0 0' }}>
            When someone asks an AI engine for a recommendation, the system may interpret that prompt through multiple related angles: features, pricing, comparisons, alternatives, use cases, industries, and trusted sources.
          </p>
          <p style={{ ...FQ_LEAD, margin: '18px 0 0' }}>
            Clovion’s Fanout Query helps you map those variations, so your team can see where your brand appears, where competitors win, and which content gaps need attention.
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 items-center">
          <div style={{ display: 'grid', gap: 12 }}>
            {FQ_WHY.map((f) => (
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
                  <p style={{ margin: '8px 0 0', fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--ink-70)' }}>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
          <FanoutExplorer />
        </div>
      </div>
    </section>
  )
}

/* ── 05 — THE LOOP (dark) ──────────────────────────────────────── */
const LOOP_ROW = ['Seed Prompt', 'Fanout Variations', 'Engine Runs', 'Coverage & Gaps', 'GEO Recommendations', 'Reporting']

function Loop() {
  return (
    <section
      id="loop"
      style={{
        position: 'relative',
        padding: 'var(--section) 0',
        background: 'var(--ink-surface, var(--ink))',
        color: 'var(--on-ink)',
        overflow: 'hidden',
        scrollMarginTop: 80,
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
      <div style={{ ...FQ_CONTAINER, position: 'relative' }}>
        <div style={{ maxWidth: 760 }}>
          <TypingHeadline
            as="h2"
            text="Expand. Analyze. Improve. One loop."
            reserve
            caretColor="var(--on-ink)"
            style={{ ...FQ_DISPLAY_LG, margin: 0, color: 'var(--on-ink)' }}
          />
          <p style={{ ...FQ_LEAD, color: 'var(--on-ink-70)', marginTop: 24 }}>
            Fanout Query turns one seed prompt into a measurable research loop. Every variation can become a visibility signal, a competitor insight, a citation gap, or a GEO recommendation.
          </p>
        </div>
        <div style={{ marginTop: 48, display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 8 }}>
          {LOOP_ROW.map((w, i) => (
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
              {i < LOOP_ROW.length - 1 && (
                <span style={{ color: 'var(--on-ink-50)', display: 'inline-flex', flex: 'none' }}>
                  <FqArrow size={13} />
                </span>
              )}
            </Fragment>
          ))}
        </div>
        <p style={{ ...FQ_LEAD, color: 'var(--on-ink-70)', marginTop: 40, maxWidth: 820 }}>
          Use the fanout loop to plan content, monitor AI search visibility, prioritize page updates, and report which variations are helping your brand become part of the answer.
        </p>
      </div>
    </section>
  )
}

/* ── 06 — FAQ ──────────────────────────────────────────────────── */
const FQ_FAQS = [
  {
    q: 'What is Query fanout?',
    a: 'Query fanout is the process where an AI system expands one user query into multiple related sub-queries or prompt variations before creating an answer. These variations help the AI gather broader context and decide which sources, brands, and explanations to include.',
  },
  {
    q: 'What is a Fanout Query tool?',
    a: 'A Fanout Query tool helps teams see the related prompt variations and subtopics connected to one buyer query. Clovion uses this to reveal where your brand appears, where competitors show up, and which content gaps affect AI visibility.',
  },
  {
    q: 'Why does query fanout matter for AI search?',
    a: 'Query fanout matters because AI engines may not rely on one exact query when generating an answer. They may explore related questions, modifiers, comparisons, and sources. If your content does not cover those branches, your brand may be missed or not cited.',
  },
  {
    q: 'How does Fanout Query help with GEO?',
    a: 'Fanout Query helps your team identify the subtopics and intent branches your content needs to cover. Those insights can guide GEO recommendations, content structure, schema, FAQs, internal links, and AI crawlability improvements.',
  },
  {
    q: 'How is Fanout Query different from prompt tracking?',
    a: 'Prompt tracking monitors specific prompts over time. Fanout Query expands one seed prompt into related variations so your team can understand the wider query universe behind AI search visibility.',
  },
  {
    q: 'Can Fanout Query help find citation gaps?',
    a: 'Yes. Fanout Query can show which prompt variations lead AI engines to cite competitor pages, third-party articles, or owned pages. This helps your team identify where stronger content is needed.',
  },
  {
    q: 'Can Clovion track fanout results across ChatGPT and Perplexity?',
    a: 'Yes. Clovion can test fanout variations across supported AI engines, including ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews.',
  },
  {
    q: 'What types of seed queries should I test?',
    a: 'Start with high-intent buyer prompts such as “best tools,” “alternatives,” “comparison,” “pricing,” “use cases,” “how to,” and “what is” queries related to your category.',
  },
  {
    q: 'What should I look for in query fanout analysis?',
    a: 'Look for prompt branches where your brand is missing, competitors are repeatedly mentioned, your pages are not cited, sentiment is weak, or the AI answer relies on sources you do not control.',
  },
  {
    q: 'Who should use Fanout Query?',
    a: 'SEO teams, content teams, growth teams, agencies, and product marketers can use Fanout Query to expand AI search research, build content roadmaps, and improve generative engine optimization strategy.',
  },
]

/* ── 07 — FINAL CTA (dark) ─────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={FQ_CONTAINER}>
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
          <div
            className="relative grid grid-cols-1 gap-10 md:grid-cols-[1fr_0.92fr] md:gap-14 items-center"
          >
            <div>
              <h2 style={{ ...FQ_DISPLAY_LG, margin: 0, color: 'var(--on-ink)' }}>Turn one prompt into a roadmap.</h2>
              <p style={{ ...FQ_LEAD, color: 'var(--on-ink-70)', marginTop: 24, maxWidth: 460 }}>
                See how one buyer query expands across AI search, where your brand appears, where competitors win, and what to fix next.
              </p>
              <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <FqBtn variant="primary" size="lg" href="/free-ai-visibility-score">
                  Get Free Score <FqArrow />
                </FqBtn>
                <FqBtn variant="secondary" size="lg" href="/pricing">
                  Start Free Trial
                </FqBtn>
              </div>
            </div>
            <FanoutMap />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Page composition ─────────────────────────────────────────── */
export default function FeatureContent() {
  return (
    <>
      <Hero />
      <JumpLinks />
      <HowItWorks />
      <WhyFanout />
      <Loop />
      <div id="faq" style={{ scrollMarginTop: 80 }}>
        <FAQAccordion items={FQ_FAQS} />
      </div>
      <FinalCTA />
    </>
  )
}

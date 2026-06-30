'use client'

import { useState, useEffect, Fragment } from 'react'
import FixQueue from './FixQueue'
import CategoryExplorer from './CategoryExplorer'
import RulePanel from './RulePanel'
import DiffPanel from './DiffPanel'
import ResolvedPanel from './ResolvedPanel'
import IntegrationStrip from './IntegrationStrip'
import StellarOrbit from './StellarOrbit'
import { FAQAccordion } from '@/components/FAQAccordion'

const G_CONTAINER: React.CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 2rem',
}

const G_DISPLAY_LG: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-lg)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-lg)',
  lineHeight: 1.02,
  textWrap: 'balance' as any,
}

const G_DISPLAY_MD: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.05,
  textWrap: 'balance' as any,
}

const G_LEAD: React.CSSProperties = {
  fontSize: 'var(--text-lead)',
  lineHeight: 1.55,
  fontWeight: 400,
  color: 'var(--ink-70)',
  textWrap: 'balance' as any,
}

/* ── Inline icons ────────────────────────────────────────────────── */
function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowRightIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MonoEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.78rem',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'var(--ink-50)',
    }}>
      {children}
    </span>
  )
}

/* ── Typing headline (cycles type → hold → delete → retype) ──────── */
function TypingHeadline({
  text,
  style,
  caretColor,
  as,
}: {
  text: string
  style?: React.CSSProperties
  caretColor?: string
  as?: keyof JSX.IntrinsicElements
}) {
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [n, setN] = useState(reduce ? text.length : 0)
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
  const Tag = (as || 'h2') as any

  return (
    <Tag style={style}>
      {text.slice(0, n)}
      <span aria-hidden style={{
        display: 'inline-block',
        width: '0.055em',
        height: '0.82em',
        marginLeft: '0.06em',
        verticalAlign: '-0.02em',
        background: caretColor || 'var(--ink)',
        animation: blinking ? 'clv-blink 1.05s steps(1) infinite' : 'none',
      }} />
    </Tag>
  )
}

/* ── Check list (with circular ink-surface check icons) ──────────── */
function GCheckList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: '32px 0 0', padding: 0, display: 'grid', gap: 16 }}>
      {items.map((t, i) => (
        <li key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span style={{
            flexShrink: 0,
            height: 22,
            width: 22,
            borderRadius: 999,
            marginTop: 1,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CheckIcon size={13} />
          </span>
          <span style={{ fontSize: '1rem', lineHeight: 1.55, color: 'var(--ink-70)' }}>{t}</span>
        </li>
      ))}
    </ul>
  )
}

/* ── 01 — HERO ────────────────────────────────────────────────────── */
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
      <div style={{ ...G_CONTAINER, padding: '3.5rem 2rem 5rem' }}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.02fr_1fr] md:gap-16 items-center">
          <div>
            <p style={{
              margin: '0 0 0',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--ink-50)',
            }}>
              What is generative engine optimization and how does Clovion do it?
            </p>
            <TypingHeadline
              as="h1"
              text="Fixes that get cited."
              style={{
                ...G_DISPLAY_LG,
                fontSize: 'clamp(2rem, 3.2vw + 0.3rem, 3.35rem)',
                whiteSpace: 'nowrap',
                margin: '14px 0 0',
              }}
            />
            <p style={{ ...G_LEAD, maxWidth: 540, margin: '1.75rem 0 0' }}>
              Turn AI visibility gaps into prioritized GEO recommendations for content structure, schema, authority, technical readiness, and AI crawlability.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="/pricing" style={{ fontSize: '0.95rem' }}>
                Start Free Trial <ArrowRightIcon />
              </a>
              <a className="btn btn-secondary" href="/free-ai-visibility-score">
                Get Free Score
              </a>
            </div>
            <div style={{
              marginTop: 24,
              display: 'flex',
              gap: 20,
              flexWrap: 'wrap',
              fontSize: '0.86rem',
              color: 'var(--ink-60)',
            }}>
              {['25 rules', 'One-click patches', 'AI-written suggestions'].map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span style={{
                    height: 16,
                    width: 16,
                    borderRadius: 999,
                    background: 'var(--ink-surface, var(--ink))',
                    color: 'var(--on-ink)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <CheckIcon size={10} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <FixQueue />
        </div>
      </div>
    </section>
  )
}

/* ── 02 — JUMP LINKS ─────────────────────────────────────────────── */
const G_JUMPS = [
  { n: '01', label: 'Four kinds of fixes', href: '#categories' },
  { n: '02', label: 'How fixes are ranked', href: '#prioritization' },
  { n: '03', label: 'Detected to resolved', href: '#workflow' },
  { n: '04', label: 'Push to your stack', href: '#stack' },
]

function JumpLinks() {
  return (
    <section style={{ padding: '0 0 1rem' }}>
      <div style={{
        padding: '4px 0',
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
      }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'clv-marquee 30s linear infinite' }}>
          {[...G_JUMPS, ...G_JUMPS].map((j, idx) => (
            <a key={idx} href={j.href} style={{ textDecoration: 'none', flexShrink: 0, width: 300, marginRight: 16 }}>
              <div style={{
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--line)',
                background: 'var(--white)',
                boxShadow: 'var(--shadow-card)',
                padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-50)' }}>{j.n}</span>
                    <div style={{ marginTop: 8, fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{j.label}</div>
                  </div>
                  <span style={{ color: 'var(--ink)', display: 'inline-flex' }}><ArrowRightIcon size={15} /></span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 03 — FOUR KINDS OF FIXES ────────────────────────────────────── */
function GIcon({ children, size = 20, vb = 24 }: { children: React.ReactNode; size?: number; vb?: number }) {
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

const ICON_STRUCTURE = (
  <GIcon>
    <g>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="15" y2="12" />
      <line x1="4" y1="18" x2="18" y2="18" />
    </g>
  </GIcon>
)

const ICON_SCHEMA = (
  <GIcon>
    <g>
      <polyline points="8 8 4 12 8 16" />
      <polyline points="16 8 20 12 16 16" />
      <line x1="13" y1="5" x2="11" y2="19" />
    </g>
  </GIcon>
)

const ICON_AUTHORITY = (
  <GIcon>
    <g>
      <path d="M12 3l7 3v5c0 4.2-2.9 7.3-7 8.5C7.9 18.3 5 15.2 5 11V6l7-3z" />
      <polyline points="9 11.5 11.2 13.7 15 9.8" />
    </g>
  </GIcon>
)

const ICON_CRAWL = (
  <GIcon>
    <g>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="9" cy="18" r="2" />
      <line x1="7.6" y1="7.4" x2="14" y2="16.6" />
      <line x1="7.7" y1="6.4" x2="16.2" y2="6.7" />
      <line x1="16.5" y1="8.6" x2="10.6" y2="16.4" />
    </g>
  </GIcon>
)

const FOUR = [
  {
    n: '8',
    name: 'Content Structure',
    icon: ICON_STRUCTURE,
    body: 'Answer-first openings, headings, summaries, lists, paragraph length, and page clarity so AI engines understand content faster.',
  },
  {
    n: '4',
    name: 'Schema & Markup',
    icon: ICON_SCHEMA,
    body: 'Missing or weak JSON-LD, article schema, FAQ schema, HowTo schema, canonical tags, and structured-data opportunities.',
  },
  {
    n: '7',
    name: 'Authority Signals',
    icon: ICON_AUTHORITY,
    body: 'Author bios, credentials, internal links, outbound citations, defined terms, and entity consistency across your pages.',
  },
  {
    n: '6',
    name: 'AI Crawlability',
    icon: ICON_CRAWL,
    body: 'Crawlable content, alt text, robots.txt guidance, llms.txt support, and machine-readable signals for agent analysis.',
  },
]

function FourKinds() {
  return (
    <section id="categories" style={{ padding: 'var(--section) 0', scrollMarginTop: 80 }}>
      <div style={G_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <h2 style={{ ...G_DISPLAY_MD, margin: 0 }}>Four kinds of fixes, ranked into one queue.</h2>
          <p style={{ ...G_LEAD, margin: '24px 0 0' }}>
            Generative engine optimization is not one checklist. AI engines look for clear answers, structured pages, trustworthy sources, crawlable content, and machine-readable context.
          </p>
          <p style={{ ...G_LEAD, margin: '18px 0 0' }}>
            Clovion turns those signals into a prioritized queue of GEO recommendations, so your team knows what to fix first.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-center" style={{ marginTop: 56 }}>
          <div style={{ display: 'grid', gap: 12 }}>
            {FOUR.map((f) => (
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
                <span style={{
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
                }}>
                  {f.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: 'var(--ink)',
                    }}>
                      {f.name}
                    </span>
                    <span style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: 'var(--ink-surface, var(--ink))',
                      color: 'var(--on-ink)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                      whiteSpace: 'nowrap',
                    }}>
                      {f.n} <span style={{ opacity: 0.7, textTransform: 'lowercase', letterSpacing: '0.02em' }}>rules</span>
                    </span>
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '0.95rem', lineHeight: 1.55, color: 'var(--ink-70)' }}>{f.body}</p>
                </div>
              </div>
            ))}
          </div>
          <CategoryExplorer />
        </div>
      </div>
    </section>
  )
}

/* ── 04 — PRIORITIZATION ─────────────────────────────────────────── */
const PRIORITY_STEPS = [
  {
    n: '01',
    title: 'Visibility Gap',
    body: 'Clovion looks at prompts where your brand is missing, competitors are mentioned, or your pages are not cited.',
  },
  {
    n: '02',
    title: 'Page-Level Issue',
    body: 'The optimizer scans your page for AI-readiness issues across structure, schema, authority, technical accessibility, and readability.',
  },
  {
    n: '03',
    title: 'Recommendation Priority',
    body: 'Each issue is ranked so your team can focus on the fixes most likely to improve generative engine optimization performance.',
  },
  {
    n: '04',
    title: 'Actionable Fix',
    body: 'Clovion gives your team a clear recommendation, suggested edit, or one-click patch where available.',
  },
]

function Prioritization() {
  return (
    <section id="prioritization" style={{ padding: 'var(--section) 0', background: 'var(--subtle)', scrollMarginTop: 80 }}>
      <div style={G_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <MonoEyebrow>How it works</MonoEyebrow>
          <h2 style={{ ...G_DISPLAY_MD, margin: '18px 0 0' }}>How a fix earns the top of your list.</h2>
          <p style={{ ...G_LEAD, margin: '24px 0 0' }}>
            Not every GEO optimization task has the same impact. Clovion ranks recommendations based on what is most likely to improve AI visibility, citations, and content understanding.
          </p>
          <p style={{ ...G_LEAD, margin: '18px 0 0' }}>
            The result is a practical workflow for teams that want to optimize content for AI search engines without guessing.
          </p>
        </div>
      </div>
      <div style={{
        marginTop: 56,
        padding: '14px 0',
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
      }}>
        <div style={{ display: 'flex', alignItems: 'stretch', width: 'max-content', animation: 'clv-marquee 44s linear infinite' }}>
          {[...PRIORITY_STEPS, ...PRIORITY_STEPS].map((s, idx) => (
            <div key={idx} style={{ flexShrink: 0, width: 340, marginRight: 20, display: 'flex' }}>
              <div style={{
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--line)',
                background: 'var(--white)',
                boxShadow: 'var(--shadow-card)',
                padding: '2rem',
                height: 252,
                width: '100%',
                boxSizing: 'border-box',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-50)' }}>{s.n}</span>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                    margin: '16px 0 0',
                  }}>
                    {s.title}
                  </h3>
                  <p style={{ marginTop: 12, fontSize: '0.94rem', lineHeight: 1.55, color: 'var(--ink-70)', flex: 1 }}>{s.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 05 — WORKFLOW (detected → resolved) ─────────────────────────── */
function WorkflowStep({
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
  visual: React.ReactNode
  flip?: boolean
  first?: boolean
}) {
  const copy = (
    <div>
      <MonoEyebrow>{eyebrow}</MonoEyebrow>
      <h3 style={{ ...G_DISPLAY_MD, fontSize: 'var(--display-sm)', margin: '16px 0 0' }}>{headline}</h3>
      <p style={{ ...G_LEAD, fontSize: '1.0625rem', margin: '20px 0 0' }}>{body}</p>
      <div style={{
        marginTop: 24,
        padding: '18px 20px',
        borderRadius: 'var(--radius-card)',
        background: 'var(--subtle)',
        border: '1px solid var(--line)',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--ink-50)',
        }}>
          {example.label}
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '0.96rem', lineHeight: 1.55, color: 'var(--ink-80)' }}>{example.body}</p>
      </div>
    </div>
  )
  return (
    <div style={{ paddingTop: first ? 0 : 'var(--section-sm, 4rem)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
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

function Workflow() {
  return (
    <section id="workflow" style={{ padding: 'var(--section) 0', scrollMarginTop: 80 }}>
      <div style={G_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <h2 style={{ ...G_DISPLAY_MD, margin: 0 }}>One suggestion, from detected to resolved.</h2>
          <p style={{ ...G_LEAD, margin: '24px 0 0' }}>
            Clovion does not just tell you a page has a problem. It shows what was detected, explains why it matters for GEO optimization, and gives your team a path to resolve it.
          </p>
        </div>
        <div style={{ marginTop: 56 }}>
          <WorkflowStep
            first
            eyebrow="Step 1 — Detected"
            headline="Find what limits AI visibility."
            body="Clovion identifies issues that may limit your visibility in AI-generated search results, such as missing schema, weak summaries, unclear headings, poor internal linking, or content hidden from crawlers."
            example={{
              label: 'Detected',
              body: 'The page has no answer-first summary and no FAQ schema, even though the content answers common buyer questions.',
            }}
            visual={<RulePanel />}
          />
          <WorkflowStep
            flip
            eyebrow="Step 2 — Suggested fix"
            headline="Get a specific, contextual edit."
            body="Clovion recommends a specific improvement based on the issue type and the page context — not a generic best-practice reminder."
            example={{
              label: 'Suggested fix',
              body: 'Add a 50–80 word answer block near the top of the page and include FAQPage JSON-LD for the question section.',
            }}
            visual={<DiffPanel />}
          />
          <WorkflowStep
            eyebrow="Step 3 — Resolved"
            headline="Apply, review, and track the lift."
            body="Your team applies the fix, reviews the updated page, and tracks whether visibility, citations, and prompt performance improve over time."
            example={{
              label: 'Resolved',
              body: 'Page updated with a clearer opening answer, FAQ schema, improved headings, and stronger internal links.',
            }}
            visual={<ResolvedPanel />}
          />
        </div>
      </div>
    </section>
  )
}

/* ── 06 — STACK (dark section) ───────────────────────────────────── */
function Stack() {
  return (
    <section
      id="stack"
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
      <div style={{ ...G_CONTAINER, position: 'relative' }}>
        <div style={{ maxWidth: 720 }}>
          <TypingHeadline
            as="h2"
            text="Push fixes straight to your stack."
            caretColor="var(--on-ink)"
            style={{ ...G_DISPLAY_LG, margin: 0, color: 'var(--on-ink)', minHeight: '2.1em' }}
          />
          <p style={{ ...G_LEAD, color: 'var(--on-ink-70)', marginTop: 24 }}>
            Clovion helps content, SEO, and growth teams move from generative engine optimization insights to execution — without turning every recommendation into a manual spreadsheet.
          </p>
        </div>
        <p style={{ ...G_LEAD, color: 'var(--on-ink-70)', marginTop: 40, maxWidth: 820 }}>
          Use GEO recommendations to brief writers, guide page updates, support technical fixes, and report progress across AI search visibility, prompt performance, and citation improvement.
        </p>
        <div style={{ marginTop: 40 }}>
          <IntegrationStrip />
        </div>
      </div>
    </section>
  )
}

/* ── 07 — FAQ ────────────────────────────────────────────────────── */
const G_FAQS = [
  {
    q: 'What is generative engine optimization?',
    a: 'Generative engine optimization, or GEO, is the process of improving your content so AI systems can understand, cite, and recommend it in generated answers. It focuses on content clarity, structured data, authority signals, technical accessibility, and AI crawlability.',
  },
  {
    q: 'What is GEO optimization?',
    a: 'GEO optimization means improving your website for AI-generated search experiences across engines like ChatGPT, Gemini, Perplexity, Claude, Grok, and Google AI Overviews. It helps your content become easier for AI engines to read, summarize, and cite.',
  },
  {
    q: 'Is generative engine optimization the same as SEO?',
    a: 'No. Traditional SEO focuses on ranking in search engine results pages. Generative engine optimization focuses on whether AI engines mention your brand, cite your pages, and use your content inside generated answers. The two strategies should work together.',
  },
  {
    q: 'What is the difference between AEO optimization and GEO optimization?',
    a: 'AEO optimization usually focuses on answer engines and direct-answer formats. GEO optimization is broader and focuses on generated AI responses, LLM visibility, citations, prompt performance, and how AI systems interpret your content.',
  },
  {
    q: 'How do I optimize content for AI search engines?',
    a: 'Start by making your content clear, structured, crawlable, and authoritative. Use answer-first sections, strong headings, schema markup, FAQ content, internal links, expert authorship, citations, and machine-readable signals like JSON-LD and llms.txt.',
  },
  {
    q: 'How does Clovion create GEO recommendations?',
    a: 'Clovion analyzes your pages against AI-readiness rules covering content structure, schema, authority, technical accessibility, and AI readability. It then turns those findings into prioritized recommendations your team can act on.',
  },
  {
    q: 'Can Clovion help optimize a website for ChatGPT?',
    a: 'Yes. Clovion helps you optimize website content for ChatGPT and other AI engines by improving page clarity, structured data, authority signals, crawlability, and content relevance around buyer-style prompts.',
  },
  {
    q: 'Can Clovion help optimize content for Perplexity?',
    a: 'Yes. Clovion helps teams identify citation gaps, improve source-worthy content, and strengthen pages that should be cited by Perplexity and other search-grounded AI engines.',
  },
  {
    q: 'What are generative engine optimization best practices?',
    a: 'Best practices include writing clear answer-first content, using structured headings, adding schema markup, improving author credibility, citing authoritative sources, strengthening internal links, defining key terms, and making content accessible to AI crawlers.',
  },
  {
    q: 'What should I look for in generative engine optimization tools?',
    a: 'The best generative engine optimization tools should combine AI visibility tracking, prompt tracking, competitor analysis, citation insights, GEO recommendations, and AI crawlability checks. Clovion connects these signals in one workflow.',
  },
  {
    q: 'How do you measure GEO success?',
    a: 'GEO success can be measured through AI visibility score, brand mentions, citation rate, share of voice, sentiment, prompt coverage, competitor movement, and improvements in how often AI engines reference your pages.',
  },
  {
    q: 'Do I need a technical team to use this?',
    a: 'No. Auto-patches apply with one click and require no code knowledge. AI-written suggestions come with a plain-English rationale and a visual diff. Suggest-All runs everything in parallel. The only features that might involve a developer are the robots.txt preset selection and JSON-LD template overrides for advanced customization.',
  },
]

/* ── 08 — FINAL CTA (dark) ───────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={G_CONTAINER}>
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          background: 'var(--ink-surface, var(--ink))',
          color: 'var(--on-ink)',
          padding: '4.5rem 3.5rem',
        }}>
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
          <div style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: 56,
            alignItems: 'center',
          }}>
            <div>
              <span style={{ color: 'var(--on-ink-70)' }}>
                <MonoEyebrow>Improve your AI visibility</MonoEyebrow>
              </span>
              <h2 style={{ ...G_DISPLAY_LG, margin: '20px 0 0', color: 'var(--on-ink)' }}>Get your first fix free.</h2>
              <p style={{ ...G_LEAD, color: 'var(--on-ink-70)', marginTop: 24, maxWidth: 460 }}>
                See which pages need structure, schema, authority, technical, and AI crawlability improvements before starting a trial.
              </p>
              <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a className="btn btn-primary" href="/pricing" style={{ fontSize: '0.95rem' }}>
                  Start Free Trial <ArrowRightIcon />
                </a>
                <a className="btn btn-secondary" href="/free-ai-visibility-score">
                  Get Free Score
                </a>
              </div>
            </div>
            <StellarOrbit />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── PAGE ────────────────────────────────────────────────────────── */
export default function FeatureContent() {
  return (
    <Fragment>
      <Hero />
      <JumpLinks />
      <FourKinds />
      <Prioritization />
      <Workflow />
      <Stack />
      <FAQAccordion items={G_FAQS} />
      <FinalCTA />
    </Fragment>
  )
}

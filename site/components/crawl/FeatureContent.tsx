'use client'

import { useState, useEffect } from 'react'
import { FAQAccordion } from '@/components/FAQAccordion'
import CrawlDashboard from './CrawlDashboard'
import CrawlExplorer from './CrawlExplorer'
import CrawlAccessOpened from './CrawlAccessOpened'
import CrawlContentReadable from './CrawlContentReadable'
import CrawlFilesGenerated from './CrawlFilesGenerated'
import CrawlMap from './CrawlMap'

const AC_CONTAINER: React.CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 2rem',
}
const AC_DISPLAY_LG: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-lg)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-lg)',
  lineHeight: 1.02,
  textWrap: 'balance' as React.CSSProperties['textWrap'],
}
const AC_DISPLAY_MD: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.05,
  textWrap: 'balance' as React.CSSProperties['textWrap'],
}
const AC_LEAD: React.CSSProperties = {
  fontSize: 'var(--text-lead)',
  lineHeight: 1.55,
  fontWeight: 400,
  color: 'var(--ink-70)',
  textWrap: 'balance' as React.CSSProperties['textWrap'],
}

/* Looping typing headline with blinking caret; `reserve` renders the full text
   invisibly to pin height so typing never reflows the page. Reduced-motion → static. */
type TypingHeadlineProps = {
  text: string
  style?: React.CSSProperties
  caretColor?: string
  as?: keyof JSX.IntrinsicElements
  reserve?: boolean
}

function TypingHeadline({ text, style, caretColor, as, reserve }: TypingHeadlineProps) {
  const [reduce, setReduce] = useState(false)
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'holding' | 'deleting'>('typing')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const m = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (m.matches) {
        setReduce(true)
        setN(text.length)
      }
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

  const wrapperStyle: React.CSSProperties = reserve
    ? { ...style, position: 'relative' }
    : style || {}

  return (
    <Tag style={wrapperStyle}>
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

/* Icons */
function Check({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
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
      <div style={{ ...AC_CONTAINER, padding: '3.5rem 2rem 5rem' }}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.02fr_1fr] md:gap-16 items-center">
          <div>
            <TypingHeadline
              as="h1"
              text="Make your site readable to AI."
              reserve
              style={{
                ...AC_DISPLAY_LG,
                fontSize: 'clamp(2rem, 3vw + 0.3rem, 3.1rem)',
                margin: 0,
              }}
            />
            <p style={{ ...AC_LEAD, maxWidth: 560, margin: '1.75rem 0 0' }}>
              Check whether AI crawlers can access, understand, and cite your most important pages
              with robots.txt guidance, llms.txt support, JSON-LD, canonical checks, and
              machine-readable content signals.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="/pricing">
                Start Free Trial <ArrowRight />
              </a>
              <a className="btn btn-secondary" href="/free-ai-visibility-score">
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
              {['Generated from your CMS', 'Safe diff merging', 'Connected to Visibility Score'].map(
                (t) => (
                  <span
                    key={t}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}
                  >
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
                )
              )}
            </div>
          </div>
          <CrawlDashboard />
        </div>
      </div>
    </section>
  )
}

/* ── 02 — JUMP LINKS ───────────────────────────────────────────── */
const AC_JUMPS = [
  { n: '01', label: 'The four crawlability layers', href: '#layers' },
  { n: '02', label: 'From blocked to cited', href: '#workflow' },
  { n: '03', label: 'Common questions', href: '#faq' },
]

function JumpLinks() {
  return (
    <section style={{ padding: '0 0 1rem' }}>
      <div style={AC_CONTAINER}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {AC_JUMPS.map((j) => (
            <a key={j.n} href={j.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  padding: '1.5rem',
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-card)',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'transform .2s var(--ease-out-expo), box-shadow .2s var(--ease-out-expo)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.74rem',
                        color: 'var(--ink-50)',
                      }}
                    >
                      {j.n}
                    </span>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'var(--ink)',
                      }}
                    >
                      {j.label}
                    </div>
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

/* ── 03 — FOUR LAYERS ──────────────────────────────────────────── */
function AcIcon({ d, size = 20, vb = 24 }: { d: React.ReactNode; size?: number; vb?: number }) {
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

const ICON_ACCESS = (
  <AcIcon
    d={
      <g>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </g>
    }
  />
)
const ICON_MAPS = (
  <AcIcon
    d={
      <g>
        <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
        <line x1="9" y1="4" x2="9" y2="18" />
        <line x1="15" y1="6" x2="15" y2="20" />
      </g>
    }
  />
)
const ICON_SCHEMA = (
  <AcIcon
    d={
      <g>
        <path d="m8 7-4 5 4 5" />
        <path d="m16 7 4 5-4 5" />
        <line x1="13.5" y1="6" x2="10.5" y2="18" />
      </g>
    }
  />
)
const ICON_STATIC = (
  <AcIcon
    d={
      <g>
        <rect x="3.5" y="5" width="17" height="14" rx="2" />
        <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
        <circle cx="6.4" cy="7.2" r="0.6" fill="currentColor" stroke="none" />
        <path d="M8 14h6" />
      </g>
    }
  />
)

const AC_LAYERS = [
  {
    name: 'AI Crawler Access',
    icon: ICON_ACCESS,
    body: 'Review robots.txt rules and crawler guidance for important AI user agents.',
  },
  {
    name: 'Machine-Readable Maps',
    icon: ICON_MAPS,
    body: 'Generate and maintain files like llms.txt and llms-full.txt to guide AI systems toward important content.',
  },
  {
    name: 'Structured Data',
    icon: ICON_SCHEMA,
    body: 'Check JSON-LD, article schema, FAQ schema, product schema, and other markup that helps AI systems interpret the page.',
  },
  {
    name: 'Static Content Visibility',
    icon: ICON_STATIC,
    body: 'Flag pages where important content may depend too heavily on JavaScript or hidden rendering patterns.',
  },
]

function FourLayers() {
  return (
    <section
      id="layers"
      style={{
        padding: 'var(--section) 0',
        background: 'var(--subtle)',
        scrollMarginTop: 80,
      }}
    >
      <div style={AC_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <h2 style={{ ...AC_DISPLAY_MD, margin: 0 }}>
            If AI cannot read it, AI cannot cite it.
          </h2>
          <p style={{ ...AC_LEAD, margin: '24px 0 0' }}>
            AI visibility starts before a prompt is answered. Your pages need to be accessible to
            crawlers, structured for machines, and clear enough for AI systems to understand what
            each page is about.
          </p>
          <p style={{ ...AC_LEAD, margin: '18px 0 0' }}>
            Clovion’s AI Crawlability checks help your team find technical blockers that may stop
            AI engines from reading, summarizing, or citing your content.
          </p>
        </div>
        <div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-center"
          style={{ marginTop: 56 }}
        >
          <div style={{ display: 'grid', gap: 12 }}>
            {AC_LAYERS.map((f) => (
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
                  <p
                    style={{
                      margin: '8px 0 0',
                      fontSize: '0.95rem',
                      lineHeight: 1.55,
                      color: 'var(--ink-70)',
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <CrawlExplorer />
        </div>
      </div>
    </section>
  )
}

/* ── 04 — WORKFLOW (access → readable → files) ─────────────────── */
type WorkflowExample = { label: string; body: string; label2: string; body2: string }
type WorkflowStepProps = {
  eyebrow: string
  headline: string
  body: string
  example: WorkflowExample
  visual: React.ReactNode
  flip?: boolean
  first?: boolean
}

function WorkflowStep({ eyebrow, headline, body, example, visual, flip, first }: WorkflowStepProps) {
  const copy = (
    <div>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--ink-60)',
        }}
      >
        {eyebrow}
      </span>
      <h3
        style={{
          ...AC_DISPLAY_MD,
          fontSize: 'var(--display-sm)',
          margin: '16px 0 0',
        }}
      >
        {headline}
      </h3>
      <p style={{ ...AC_LEAD, fontSize: '1.0625rem', margin: '20px 0 0' }}>{body}</p>
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
        <p
          style={{
            margin: '10px 0 0',
            fontSize: '0.96rem',
            lineHeight: 1.55,
            color: 'var(--ink-80)',
          }}
        >
          {example.body}
        </p>
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
        <p
          style={{
            margin: '10px 0 0',
            fontSize: '0.96rem',
            lineHeight: 1.55,
            color: 'var(--ink-80)',
          }}
        >
          {example.body2}
        </p>
      </div>
    </div>
  )
  return (
    <div style={{ paddingTop: first ? 0 : 'var(--section-sm)' }}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 items-center">
        {flip ? (
          <>
            <div>{visual}</div>
            {copy}
          </>
        ) : (
          <>
            {copy}
            <div>{visual}</div>
          </>
        )}
      </div>
    </div>
  )
}

function Workflow() {
  return (
    <section id="workflow" style={{ padding: 'var(--section) 0', scrollMarginTop: 80 }}>
      <div style={AC_CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--ink-60)',
            }}
          >
            How it works
          </span>
          <h2 style={{ ...AC_DISPLAY_MD, margin: '18px 0 0' }}>
            One site, from blocked to cited.
          </h2>
          <p style={{ ...AC_LEAD, margin: '24px 0 0' }}>
            Most crawlability problems are silent. You don’t get an error, you just don’t appear in
            AI answers, and you don’t know why. The fix is a sequence of gates opening in the right
            order.
          </p>
        </div>
        <div style={{ marginTop: 56 }}>
          <WorkflowStep
            first
            eyebrow="Step 1 — Access opened"
            headline="Open the gate to the right crawlers."
            body="Clovion AI audits your robots.txt against its preset library and flags which search crawlers are accidentally blocked."
            example={{
              label: 'What it checks',
              body: 'robots.txt rules, server responses, and crawl directives for GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended.',
              label2: 'Output',
              body2:
                'A diff preview showing the current robots.txt versus the proposed change, with added and removed bot lines highlighted.',
            }}
            visual={<CrawlAccessOpened />}
          />
          <WorkflowStep
            flip
            eyebrow="Step 2 — Content made readable"
            headline="Make sure the content is actually there."
            body="The GEO ruleset’s technical checks identify pages where content is invisible to crawlers. These aren’t content improvements, they’re access improvements."
            example={{
              label: 'Example rule',
              body: 'no-js-only-content: FAIL — primary content renders client-side only, so AI bots receive an empty shell.',
              label2: 'Why it matters',
              body2:
                'A page with perfect GEO content but JS-only rendering is invisible to every AI bot.',
            }}
            visual={<CrawlContentReadable />}
          />
          <WorkflowStep
            eyebrow="Step 3 — Navigation files generated"
            headline="Hand crawlers a map of what matters."
            body="Once access is open and content is readable, Clovion AI generates the navigation layer and serves it from your site root instantly."
            example={{
              label: 'Generated files',
              body: 'llms.txt, llms-full.txt, and JSON-LD structured data per page type.',
              label2: 'Result',
              body2: 'Now crawlers can get in, read your content, and know what matters.',
            }}
            visual={<CrawlFilesGenerated />}
          />
        </div>
      </div>
    </section>
  )
}

/* ── 06 — FAQ ──────────────────────────────────────────────────── */
const AC_FAQS = [
  {
    q: 'What is AI crawlability?',
    a: 'AI crawlability is the ability of AI crawlers and answer engines to access, read, and understand your website content. It includes crawler access rules, robots.txt, static content visibility, structured data, metadata, and machine-readable files like llms.txt.',
  },
  {
    q: 'Why does AI crawlability matter?',
    a: 'AI crawlability matters because AI systems cannot cite or summarize content they cannot access or understand. If important pages are blocked, hidden, poorly structured, or missing machine-readable context, your brand may be less visible in AI-generated answers.',
  },
  {
    q: 'What is an AI crawler checker?',
    a: 'An AI crawler checker reviews whether AI bots can access important pages and whether technical settings like robots.txt, server access, schema, canonicals, and page structure are helping or blocking discovery.',
  },
  {
    q: 'How does Clovion check AI crawlability?',
    a: 'Clovion reviews access rules, llms.txt coverage, JSON-LD, canonical tags, metadata, alt text, and whether important content is visible without JavaScript-only rendering patterns.',
  },
  {
    q: 'What is llms.txt?',
    a: 'llms.txt is a machine-readable file that can list important pages, links, and summaries for AI systems. It works like a curated guide to your content, not a replacement for strong pages, schema, or traditional SEO foundations.',
  },
  {
    q: 'Is llms.txt the same as robots.txt?',
    a: 'No. robots.txt tells crawlers what they are allowed or not allowed to access. llms.txt is a guide that helps AI systems understand which content is important and where to find it.',
  },
  {
    q: 'Can Clovion generate llms.txt?',
    a: 'Yes. Clovion supports machine-readable artifacts such as llms.txt, llms-full.txt, robots.txt guidance, and JSON-LD recommendations to help improve AI crawlability.',
  },
  {
    q: 'Should I allow every AI crawler?',
    a: 'Not always. Some teams want maximum visibility, while others need stricter controls for legal, privacy, or IP reasons. Clovion helps review crawler guidance so your team can choose the right access strategy.',
  },
  {
    q: 'What AI crawlers should I check?',
    a: 'Common AI-related crawlers and agents include GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, and other search or retrieval bots. The right setup depends on your visibility goals and content policy.',
  },
  {
    q: 'How is AI crawlability different from GEO recommendations?',
    a: 'GEO recommendations focus on improving content for AI search visibility. AI Crawlability focuses on whether AI systems can access, parse, and understand the technical signals behind your pages.',
  },
  {
    q: 'Can AI crawlability improve citations?',
    a: 'It can help, but it does not guarantee citations. Better crawlability makes it easier for AI systems to access and interpret your content, while visibility also depends on relevance, authority, freshness, and how well the page answers the prompt.',
  },
  {
    q: 'Who should use an AI crawlability tool?',
    a: 'SEO teams, technical SEO teams, developers, content teams, and growth teams should use AI crawlability checks to make sure important pages are accessible, structured, and ready for AI search.',
  },
]

function FAQ() {
  return (
    <div id="faq" style={{ scrollMarginTop: 80 }}>
      <FAQAccordion items={AC_FAQS} />
    </div>
  )
}

/* ── 07 — FINAL CTA (dark) ─────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={AC_CONTAINER}>
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
              backgroundImage:
                'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr 0.92fr',
              gap: 56,
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ ...AC_DISPLAY_LG, margin: 0, color: 'var(--on-ink)' }}>
                Find out if AI can even see your site.
              </h2>
              <p
                style={{
                  ...AC_LEAD,
                  color: 'var(--on-ink-70)',
                  marginTop: 24,
                  maxWidth: 460,
                }}
              >
                Find blocked pages, missing machine-readable files, weak structured data, and
                technical issues that may stop AI systems from understanding your content.
              </p>
              <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a className="btn btn-primary" href="/free-ai-visibility-score">
                  Get Free Score <ArrowRight />
                </a>
                <a className="btn btn-secondary" href="/pricing">
                  Start Free Trial
                </a>
              </div>
            </div>
            <CrawlMap />
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
      <JumpLinks />
      <FourLayers />
      <Workflow />
      <FAQ />
      <FinalCTA />
    </>
  )
}

'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import HeroDashboard from './HeroDashboard'
import EngineGrid from './EngineGrid'
import SentimentChart from './SentimentChart'
import CitationPanel from './CitationPanel'
import GapFinder from './GapFinder'
import { TypingHeadline } from '@/components/home/TypingHeadline'

/* ── Shared style tokens (mirrors source CONTAINER / DISPLAY_LG / etc.) ── */
const CONTAINER: CSSProperties = {
  maxWidth: 'var(--container-max)',
  margin: '0 auto',
  padding: '0 2rem'
}
const DISPLAY_LG: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-lg)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-lg)',
  lineHeight: 1.02,
  textWrap: 'balance' as CSSProperties['textWrap']
}
const DISPLAY_MD: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--display-md)',
  fontWeight: 600,
  letterSpacing: 'var(--track-display-md)',
  lineHeight: 1.05,
  textWrap: 'balance' as CSSProperties['textWrap']
}
const LEAD: CSSProperties = {
  fontSize: 'var(--text-lead)',
  lineHeight: 1.55,
  color: 'var(--ink-70)',
  textWrap: 'balance' as CSSProperties['textWrap']
}

/* ── Inline icons (no external deps) ── */
function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M3 8h10m-4-4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function PlusIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ── Eyebrow (mono) ── */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: 'var(--ink-50)'
      }}
    >
      {children}
    </span>
  )
}

/* ── CTA helper — primary/secondary buttons via global classes ── */
function trackHero(text: string) {
  if (typeof window === 'undefined') return
  const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> }
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({
    event: text === 'Start Free Trial' ? 'start_trial' : 'get_free_score',
    cta_location: 'ai_visibility_tracking_hero',
    cta_text: text
  })
}

function CTAButtons({ location }: { location: string }) {
  const onClick = (text: string) => () => {
    if (typeof window === 'undefined') return
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({
      event: text === 'Start Free Trial' ? 'start_trial' : 'get_free_score',
      cta_location: location,
      cta_text: text
    })
  }
  return (
    <>
      <a href="/pricing" className="btn btn-primary btn-lg" onClick={onClick('Start Free Trial')}>
        Start Free Trial <ArrowRight />
      </a>
      <a href="/free-ai-visibility-score" className="btn btn-secondary btn-lg" onClick={onClick('Get Free Score')}>
        Get Free Score
      </a>
    </>
  )
}

/* ── CheckList ── */
function CheckList({ items, onDark }: { items: string[]; onDark?: boolean }) {
  return (
    <ul style={{ listStyle: 'none', margin: '32px 0 0', padding: 0, display: 'grid', gap: 14 }}>
      {items.map((t, i) => (
        <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span
            style={{
              flexShrink: 0,
              height: 20,
              width: 20,
              borderRadius: 999,
              marginTop: 1,
              background: '#ffffff',
              color: '#0a0a0f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckIcon size={11} />
          </span>
          <span style={{ fontSize: '14px', lineHeight: 1.55, color: onDark ? 'var(--on-ink-70)' : 'var(--ink-70)' }}>{t}</span>
        </li>
      ))}
    </ul>
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
            'radial-gradient(ellipse 70% 55% at 70% 0%, rgba(10,10,15,0.06) 0%, rgba(10,10,15,0.02) 30%, transparent 70%)'
        }}
      />
      <div style={{ ...CONTAINER, padding: '7rem 2rem 5rem' }}>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.02fr_1fr] md:gap-16 items-center">
          <div>
            <p
              style={{
                margin: '0 0 0',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--ink-50)'
              }}
            >
              What is AI visibility tracking and how does it work?
            </p>
            <TypingHeadline
              as="h1"
              text="Monitor every AI mention."
              style={{
                ...DISPLAY_LG,
                fontSize: 'clamp(1.8rem, 2.7vw + 0.3rem, 2.6rem)',
                whiteSpace: 'nowrap',
                margin: '14px 0 0'
              }}
            />
            <p style={{ ...LEAD, maxWidth: 540, margin: '1.75rem 0 0' }}>
              Track your brand mentions, rankings, citations, and sentiment across ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews — refreshed daily from neutral, buyer-style prompts.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <CTAButtons location="ai_visibility_tracking_hero" />
            </div>
            <div style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: '0.86rem', color: 'var(--ink-60)' }}>
              {['No card required', 'First score in 24h', '6 engines'].map((t) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span
                    style={{
                      height: 16,
                      width: 16,
                      borderRadius: 999,
                      background: '#ffffff',
                      color: '#0a0a0f',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <CheckIcon size={10} />
                  </span>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <HeroDashboard />
        </div>
      </div>
    </section>
  )
}

/* ── 02 — JUMP LINKS ───────────────────────────────────────────── */
const JUMPS = [
  { n: '01', label: 'Multi-engine tracking', href: '#multi-engine' },
  { n: '02', label: 'Sentiment intelligence', href: '#sentiment' },
  { n: '03', label: 'Citation analysis', href: '#citations' },
  { n: '04', label: 'Daily refresh', href: '#daily-refresh' }
]

function JumpLinks() {
  return (
    <section style={{ padding: '0 0 1rem' }}>
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          {JUMPS.map((j) => (
            <a key={j.n} href={j.href} style={{ textDecoration: 'none' }}>
              <div
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-card)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--ink-50)' }}>{j.n}</span>
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

/* ── Reusable feature block: copy column + visual column (order toggles) ── */
function FeatureBlock({
  id,
  eyebrow,
  headline,
  body,
  bullets,
  visual,
  flip,
  defined
}: {
  id: string
  eyebrow?: string
  headline: string
  body: string[]
  bullets?: string[]
  visual: ReactNode
  flip?: boolean
  defined?: boolean
}) {
  const copy = (
    <div>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 style={{ ...DISPLAY_MD, margin: eyebrow ? '18px 0 0' : '0' }}>{headline}</h2>
      {body.map((p, i) => (
        <p key={i} style={{ ...LEAD, fontSize: '16px', margin: i === 0 ? '24px 0 0' : '18px 0 0' }}>
          {p}
        </p>
      ))}
      {defined && (
        <div style={{ marginTop: 24 }}>
          <GapFinder />
        </div>
      )}
      {bullets && <CheckList items={bullets} />}
    </div>
  )
  return (
    <section id={id} style={{ padding: 'var(--section) 0', scrollMarginTop: 80 }}>
      <div style={CONTAINER}>
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
    </section>
  )
}

/* ── 06 — DAILY REFRESH (dark) ─────────────────────────────────── */
const REFRESH_STATS = [
  { k: 'Cadence', v: '24h refresh' },
  { k: 'Engines', v: '6 monitored' },
  { k: 'Score', v: '0–100 visibility' },
  { k: 'Signals', v: 'Mentions · citations · sentiment · SOV' }
]

function DailyRefresh() {
  return (
    <section
      id="daily-refresh"
      style={{
        position: 'relative',
        padding: 'var(--section) 0',
        background: 'var(--ink-surface, var(--ink))',
        color: 'var(--on-ink)',
        overflow: 'hidden',
        scrollMarginTop: 80
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.6,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div style={{ ...CONTAINER, position: 'relative' }}>
        <div style={{ maxWidth: 720 }}>
          <TypingHeadline
            text="Fresh AI visibility data, every day."
            caretColor="var(--on-ink)"
            style={{ ...DISPLAY_LG, margin: '0', color: 'var(--on-ink)', minHeight: '2.04em' }}
          />
          <p style={{ ...LEAD, color: 'var(--on-ink-70)', marginTop: 24 }}>
            AI search results change quickly. A competitor can appear in Perplexity today, gain visibility in ChatGPT tomorrow, and start getting cited in Google AI Overviews before your SEO reports catch up.
          </p>
          <p style={{ ...LEAD, color: 'var(--on-ink-70)', marginTop: 18 }}>
            Clovion refreshes AI visibility tracking daily, giving your team a clearer view of how brand mentions, LLM rankings, citations, and share of voice change over time.
          </p>
        </div>
        <div
          style={{
            marginTop: 56,
            borderTop: '1px solid var(--on-ink-15)',
            borderBottom: '1px solid var(--on-ink-15)',
            overflow: 'hidden',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, black 4%, black 96%, transparent)'
          }}
        >
          <div style={{ display: 'flex', width: 'max-content', animation: 'clv-marquee 26s linear infinite' }}>
            {[...REFRESH_STATS, ...REFRESH_STATS].map((s, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0,
                  width: 320,
                  padding: '28px 24px',
                  borderRight: '1px solid var(--on-ink-15)'
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--on-ink-50)'
                  }}
                >
                  {s.k}
                </div>
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: 'var(--on-ink)'
                  }}
                >
                  {s.v}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <CTAButtons location="ai_visibility_tracking_daily_refresh" />
        </div>
      </div>
    </section>
  )
}

/* ── 07 — VERSUS THE ALTERNATIVES ──────────────────────────────── */
const VERSUS = [
  {
    n: '01',
    title: 'Neutral prompts, not branded checks.',
    body: 'Clovion uses category-focused prompts that do not force your brand to appear. That helps you measure real AI search visibility instead of inflated branded search performance.'
  },
  {
    n: '02',
    title: 'Mentions, citations, and sentiment in one view.',
    body: 'Track more than AI rankings. Clovion shows whether your brand was mentioned, how prominently it appeared, whether AI engines cited your pages, and how the answer described you.'
  },
  {
    n: '03',
    title: 'Tracking connected to optimization.',
    body: 'Clovion does not leave your team with a dashboard and no next step. Visibility insights connect directly to GEO suggestions and content improvements.'
  }
]

function Versus() {
  return (
    <section style={{ padding: 'var(--section) 0', background: 'var(--subtle)' }}>
      <div style={CONTAINER}>
        <div style={{ maxWidth: 760 }}>
          <h2 style={{ ...DISPLAY_LG, margin: '0' }}>Why Clovion tracking is different from a basic LLM rank tracker.</h2>
          <p style={{ ...LEAD, marginTop: 24 }}>
            Most AI rank tracking tools stop at reporting. Clovion connects AI visibility tracking with competitor intelligence and GEO recommendations, so your team can move from “where are we invisible?” to “what should we fix next?”
          </p>
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {VERSUS.map((v) => (
            <div
              key={v.n}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-card)',
                padding: '2rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--ink-50)' }}>{v.n}</span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                    margin: '18px 0 0'
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ marginTop: 14, fontSize: '0.96rem', lineHeight: 1.55, color: 'var(--ink-70)', flex: 1 }}>{v.body}</p>
                <a
                  href="/compare"
                  style={{
                    marginTop: 24,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Full comparison <ArrowRight />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 08 — ENGINE COVERAGE ──────────────────────────────────────── */
const ENGINE_LOGO_SRC: Record<string, string> = {
  ChatGPT: '/logos/chatgpt.svg',
  Claude: '/logos/claude.svg',
  Gemini: '/logos/gemini.svg',
  Perplexity: '/logos/perplexity.svg',
  Grok: '/logos/grok-icon.svg',
  'AI Overviews': '/logos/google-ai.svg'
}

const COVERAGE = [
  { name: 'ChatGPT', provider: 'OpenAI', signals: ['Mentions', 'Rank', 'Sentiment'] },
  { name: 'Claude', provider: 'Anthropic', signals: ['Mentions', 'Rank', 'Sentiment'] },
  { name: 'Gemini', provider: 'Google · grounded', signals: ['Mentions', 'Rank', 'Citations'] },
  { name: 'Perplexity', provider: 'Search-grounded', signals: ['Mentions', 'Rank', 'Citations'] },
  { name: 'Grok', provider: 'xAI', signals: ['Mentions'] },
  { name: 'AI Overviews', provider: 'Google SERP', signals: ['Mentions', 'Citations'] }
]

function EngineCoverage() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <Eyebrow>Engine coverage</Eyebrow>
          <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0' }}>Every major AI surface your buyers touch.</h2>
          <p style={{ ...LEAD, fontSize: '16px', maxWidth: 600, margin: '20px auto 0', color: 'var(--ink-60)' }}>
            Clovion actively monitors each engine and pulls the signals it supports — refreshed daily.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {COVERAGE.map((e) => (
            <div
              key={e.name}
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 'var(--radius-card)',
                border: 'none',
                background: 'var(--white)',
                boxShadow: 'var(--shadow-card)',
                padding: 22
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      height: 64,
                      width: 64,
                      borderRadius: 14,
                      background: 'var(--subtle)',
                      border: '1px solid var(--line)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={ENGINE_LOGO_SRC[e.name]}
                      alt={e.name}
                      style={{ height: e.name === 'Grok' ? 38 : 34, width: 'auto', filter: 'var(--logo-filter, brightness(0))' }}
                    />
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2, minWidth: 0 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.18rem',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        color: 'var(--ink)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {e.name}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--ink-50)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {e.provider}
                    </span>
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'var(--ink-50)',
                    marginBottom: 10
                  }}
                >
                  Tracked signals
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {e.signals.map((s) => (
                    <span
                      key={s}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '4px 9px',
                        borderRadius: 999,
                        background: 'var(--ink-04, rgba(10,10,15,0.04))',
                        border: '1px solid var(--line)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--ink-70)'
                      }}
                    >
                      <span style={{ color: 'var(--ink)', display: 'inline-flex' }}>
                        <CheckIcon size={9} />
                      </span>
                      {s}
                    </span>
                  ))}
                  {e.name === 'Grok' && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 9px',
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 500,
                        color: 'var(--ink-40)'
                      }}
                    >
                      no search plugin
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ ...LEAD, fontSize: '16px', maxWidth: 720, margin: '36px auto 0', textAlign: 'center', color: 'var(--ink-60)' }}>
          Use Clovion as your LLM SEO tracking tool to monitor brand visibility across the AI answer engines your buyers use to compare products, shortlist vendors, and make decisions.
        </p>
      </div>
    </section>
  )
}

/* ── 09 — USE CASES ────────────────────────────────────────────── */
const USE_CASES = [
  {
    title: 'SEO Teams',
    body:
      'Use Clovion as an LLM rank tracker to monitor brand visibility across ChatGPT, Perplexity, Gemini, and AI Overviews. Track which prompts mention your brand, which competitors appear, and which pages need improvement.',
    link: 'Explore SEO tracking'
  },
  {
    title: 'Content Teams',
    body:
      'Find the content gaps that stop AI engines from citing your pages. See which competitor URLs are being used as sources and prioritize updates that improve AI readability, structure, and authority.',
    link: 'Explore content insights'
  },
  {
    title: 'Growth Teams',
    body:
      'Measure AI search visibility across engines, regions, topics, and competitors. Use visibility score, share of voice, sentiment, and citation tracking to report progress over time.',
    link: 'Explore growth workflows'
  }
]

function UseCases() {
  return (
    <section style={{ padding: 'var(--section) 0', background: 'var(--subtle)' }}>
      <div style={CONTAINER}>
        <div style={{ maxWidth: 640 }}>
          <Eyebrow>Use cases</Eyebrow>
          <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0' }}>Built for the teams that own AI visibility.</h2>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {USE_CASES.map((u) => (
            <div
              key={u.title}
              style={{
                background: 'var(--white)',
                border: '1px solid var(--line)',
                borderRadius: 'var(--radius-card)',
                padding: '2rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--display-sm)',
                    fontWeight: 600,
                    letterSpacing: 'var(--track-display-sm)',
                    lineHeight: 1.15,
                    margin: 0
                  }}
                >
                  {u.title}
                </h3>
                <p style={{ marginTop: 16, fontSize: '0.96rem', lineHeight: 1.55, color: 'var(--ink-70)', flex: 1 }}>{u.body}</p>
                <a
                  href="/features"
                  style={{
                    marginTop: 24,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {u.link} <ArrowRight />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── 10 — FAQ ──────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'What is AI visibility tracking?',
    a: 'AI visibility tracking measures whether AI answer engines mention your brand, cite your pages, and recommend you in response to category-level prompts. Clovion tracks these signals across ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews.'
  },
  {
    q: 'Is Clovion an LLM rank tracker?',
    a: 'Yes. Clovion works as an LLM rank tracker by monitoring how your brand appears across AI-generated answers. It tracks brand mentions, LLM rank, share of voice, citations, sentiment, and visibility score over time.'
  },
  {
    q: 'How can you track brand mentions in ChatGPT?',
    a: 'Clovion tracks brand mentions in ChatGPT by running neutral buyer-style prompts and analyzing whether your brand appears in the answer. It also tracks where the mention appears, how prominent it is, and how the answer describes your brand.'
  },
  {
    q: 'Can Clovion track Perplexity rankings?',
    a: 'Yes. Clovion can track Perplexity rank performance, brand mentions, source citations, and competitor visibility, helping teams understand how their brand appears in Perplexity answers.'
  },
  {
    q: 'What makes Clovion different from a traditional SEO tool?',
    a: 'Traditional SEO tools track rankings in search engine results pages. Clovion tracks AI search visibility inside generated answers, where users may receive one synthesized recommendation instead of a list of links.'
  },
  {
    q: 'Does Clovion track citations?',
    a: 'Yes. Clovion tracks citations where AI engines provide source links. This helps you see which of your pages are being cited, which competitor pages are winning, and where content gaps exist.'
  },
  {
    q: 'Does Clovion offer free AI rank tracking?',
    a: 'Clovion offers a free AI Visibility score so teams can quickly see how their brand appears across supported AI answer engines before starting a trial.'
  },
  {
    q: 'Which AI engines does Clovion monitor?',
    a: 'Clovion monitors ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews.'
  }
]

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
          fontFamily: 'var(--font-display)'
        }}
      >
        <span style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ink)' }}>{q}</span>
        <span
          style={{
            flexShrink: 0,
            color: 'var(--ink-60)',
            transform: open ? 'rotate(45deg)' : 'none',
            transition: 'transform .25s ease'
          }}
        >
          <PlusIcon size={18} />
        </span>
      </button>
      <div style={{ overflow: 'hidden', maxHeight: open ? 240 : 0, transition: 'max-height .35s var(--ease-out-expo)' }}>
        <p style={{ margin: 0, padding: '0 48px 26px 0', fontSize: '1rem', lineHeight: 1.6, color: 'var(--ink-70)' }}>{a}</p>
      </div>
    </div>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number>(0)
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <Eyebrow>FAQ</Eyebrow>
            <h2 style={{ ...DISPLAY_MD, margin: '16px 0 0' }}>Tracking, answered.</h2>
            <a
              href="/pricing"
              style={{
                marginTop: 24,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--ink)',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
            >
              Talk to us <ArrowRight />
            </a>
          </div>
          <div>
            {FAQS.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── 11 — FINAL CTA (dark) ─────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: 'var(--section) 0' }}>
      <div style={CONTAINER}>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 28,
            background: 'var(--ink-surface, var(--ink))',
            color: 'var(--on-ink)',
            padding: '6rem 3.5rem'
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.6,
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
          <div style={{ position: 'relative', maxWidth: 640 }}>
            <span style={{ color: 'var(--on-ink-70)' }}>
              <Eyebrow>Start free</Eyebrow>
            </span>
            <h2 style={{ ...DISPLAY_LG, margin: '20px 0 0', color: 'var(--on-ink)' }}>See your visibility before the trial.</h2>
            <p style={{ ...LEAD, color: 'var(--on-ink-70)', marginTop: 24, maxWidth: 520 }}>
              Free score in 60s. Enter your brand and domain to see how AI engines mention you, which competitors appear, and where your AI visibility can improve.
            </p>
            <div style={{ marginTop: 36, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <CTAButtons location="ai_visibility_tracking_final_cta" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── FEATURE CONTENT (default export) ──────────────────────────── */
export default function FeatureContent() {
  return (
    <>
      <Hero />
      <JumpLinks />
      <FeatureBlock
        id="multi-engine"
        headline="Six engines tracked the way buyers actually use them."
        body={[
          'Most LLM SEO tools only check one or two AI platforms. Clovion tracks your brand across the major AI answer engines shaping buyer decisions: ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews.',
          'Every prompt is designed to reflect real category searches, not branded queries that force your company to appear. That means you can measure genuine AI visibility, compare LLM rank across engines, and see where competitors are being recommended instead.'
        ]}
        bullets={[
          'Track brand mentions across six major AI answer engines.',
          'Monitor ChatGPT rank, Perplexity rank, and Google AI Overview visibility in one dashboard.',
          'Compare visibility score, mention rate, share of voice, and topic performance by engine.',
          'Use neutral category prompts to measure organic AI visibility.',
          'Spot competitor movement across AI-generated answers.'
        ]}
        visual={<EngineGrid />}
      />
      <FeatureBlock
        id="sentiment"
        flip
        headline="Know how AI describes your brand, and why."
        body={[
          'Ranking in AI answers is only part of the story. Clovion also tracks how AI engines talk about your brand, so your team can see whether mentions are positive, neutral, or negative.',
          'A brand can appear often but still lose trust if the answer frames competitors as stronger, cheaper, easier, or more complete. Clovion connects each sentiment signal back to the prompt and source context, helping your team understand what changed and where to improve.'
        ]}
        bullets={[
          'Track positive, neutral, and negative AI brand mentions.',
          'Compare sentiment across ChatGPT, Claude, Gemini, Perplexity, Grok, and AI Overviews.',
          'See which prompts create weak or negative brand positioning.',
          'Monitor sentiment trends over time.',
          'Use AI visibility data to prioritize messaging and content fixes.'
        ]}
        visual={<SentimentChart />}
      />
      <FeatureBlock
        id="citations"
        headline="See the sources AI engines trust."
        body={[
          'AI engines do not just mention brands. They also cite pages, summarize sources, and pull from competitor content when your site does not answer the question clearly enough.',
          'Clovion captures cited URLs where AI engines provide sources, normalizes them, and shows which pages are supporting your visibility.'
        ]}
        defined
        bullets={[
          'Track AI citations from grounded engines like Gemini, Perplexity, and Google AI Overviews.',
          'Identify which pages AI engines cite when answering category prompts.',
          'Compare owned citations against competitor citations.',
          'Find cited pages that are helping competitors rank in AI answers.',
          'Turn citation gaps into a practical content improvement roadmap.'
        ]}
        visual={<CitationPanel />}
      />
      <DailyRefresh />
      <Versus />
      <EngineCoverage />
      <UseCases />
      <FAQ />
      <FinalCTA />
    </>
  )
}

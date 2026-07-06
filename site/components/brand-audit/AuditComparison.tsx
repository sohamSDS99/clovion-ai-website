'use client'

/**
 * Brand Audit — Section 01 visual: "An Audit Built For AI Search".
 *
 * PART A — a two-column comparison strip inside one Panel: the muted, de-emphasized
 * "Traditional SEO audit" checklist (the old way) beside the brighter, active
 * "AI-source audit" list (what Clovion checks).
 *
 * PART B — the four locked "we ask" questions rendered as evidence-styled cards
 * (scan/magnifier glyph + verbatim question + a mono source/status chip), in a 2×2
 * grid on desktop / single column on mobile, revealed on scroll in a stagger.
 *
 * Palette is locked to the dark brand book: ink + alphas of ink on near-black,
 * emerald `--positive` as the only affordance. Motion degrades to a static final
 * state under prefers-reduced-motion via the shared Reveal primitive.
 */

import type { CSSProperties } from 'react'
import {
  MONO,
  Panel,
  Reveal,
  ScanIcon,
  CheckIcon,
} from '@/components/brand-audit/primitives'

/* ── Comparison data (illustrative sample rows) ────────────────── */
const TRADITIONAL = [
  'Meta tags',
  'XML sitemap',
  'Page speed',
  'Broken links',
  'Canonical tags',
]

const AI_SOURCE = [
  'Source presence',
  'Citation-worthy content',
  'Cross-web consistency',
  'Factual accuracy',
  'Engine coverage',
]

/* ── The four LOCKED questions + illustrative source/status chips ─ */
const QUESTIONS: { text: string; chip: string }[] = [
  { text: 'Are you present on the sources AI relies on?', chip: 'across the web' },
  { text: 'Does your website contain information worth citing?', chip: 'on-domain' },
  { text: 'Is your brand described consistently across the web?', chip: 'cross-source' },
  { text: 'Do AI engines have the right facts about your business?', chip: 'per engine' },
]

const chipStyle: CSSProperties = {
  ...MONO,
  fontSize: '0.6rem',
  fontWeight: 600,
  color: 'var(--ink-50)',
  border: '1px solid var(--line)',
  borderRadius: 999,
  padding: '3px 9px',
  whiteSpace: 'nowrap',
  fontVariantNumeric: 'tabular-nums',
}

function ColumnLabel({ children, active }: { children: string; active?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      <span
        aria-hidden
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: active ? 'var(--positive)' : 'var(--ink-25)',
          flexShrink: 0,
        }}
      />
      <span
        style={{
          ...MONO,
          fontSize: '0.66rem',
          fontWeight: 600,
          color: active ? 'var(--ink)' : 'var(--ink-40)',
        }}
      >
        {children}
      </span>
    </div>
  )
}

/* A dimmed, neutral checklist row — "the old way". */
function TraditionalRow({ label }: { label: string }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 0',
        borderTop: '1px solid var(--line)',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 18,
          height: 18,
          borderRadius: 4,
          border: '1px solid var(--ink-10)',
          color: 'var(--ink-40)',
          flexShrink: 0,
        }}
      >
        <CheckIcon size={10} />
      </span>
      <span
        style={{
          fontFamily: 'var(--font-body-reg, var(--font-body))',
          fontSize: '0.9rem',
          color: 'var(--ink-40)',
          textDecoration: 'line-through',
          textDecorationColor: 'var(--ink-10)',
        }}
      >
        {label}
      </span>
    </li>
  )
}

/* A brighter, active row — what Clovion checks. */
function AiSourceRow({ label }: { label: string }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 0',
        borderTop: '1px solid var(--line)',
      }}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 18,
          height: 18,
          borderRadius: 4,
          border: '1px solid var(--positive-border, rgba(52,211,153,0.34))',
          background: 'var(--positive-bg, rgba(52,211,153,0.12))',
          color: 'var(--positive)',
          flexShrink: 0,
        }}
      >
        <CheckIcon size={10} />
      </span>
      <span
        style={{
          fontFamily: 'var(--font-body-reg, var(--font-body))',
          fontSize: '0.9rem',
          color: 'var(--ink-90)',
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </li>
  )
}

/* An evidence-styled question card. */
function EvidenceCard({ text, chip }: { text: string; chip: string }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        height: '100%',
        padding: '18px 20px',
        borderRadius: 14,
        border: '1px solid var(--line)',
        background: 'var(--white)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: 8,
            border: '1px solid var(--line)',
            background: 'var(--subtle)',
            color: 'var(--ink-70)',
            flexShrink: 0,
          }}
        >
          <ScanIcon size={14} />
        </span>
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-body-reg, var(--font-body))',
            fontSize: '1rem',
            lineHeight: 1.42,
            color: 'var(--ink)',
            fontWeight: 500,
            textWrap: 'balance' as CSSProperties['textWrap'],
          }}
        >
          {text}
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          marginTop: 'auto',
          paddingTop: 12,
          borderTop: '1px solid var(--line)',
        }}
      >
        <span style={{ ...MONO, fontSize: '0.6rem', fontWeight: 600, color: 'var(--ink-40)' }}>
          Signal
        </span>
        <span style={chipStyle}>{chip}</span>
      </div>
    </div>
  )
}

export function AuditComparison() {
  return (
    <div
      role="group"
      aria-label="Comparison of a traditional SEO audit versus an AI-source audit, and the four questions Clovion asks"
      style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.75rem, 3vw, 2.5rem)' }}
    >
      {/* PART A — comparison strip */}
      <Reveal>
        <Panel label="Audit scope" status="OLD WAY / NEW WAY">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-0">
            {/* LEFT — traditional, de-emphasized */}
            <div className="md:pr-10">
              <ColumnLabel>Traditional SEO audit</ColumnLabel>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {TRADITIONAL.map((label) => (
                  <TraditionalRow key={label} label={label} />
                ))}
              </ul>
            </div>

            {/* RIGHT — AI-source, active (hairline divider on desktop only) */}
            <div className="md:pl-10 md:border-l" style={{ borderColor: 'var(--line)' }}>
              <ColumnLabel active>AI-source audit</ColumnLabel>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {AI_SOURCE.map((label) => (
                  <AiSourceRow key={label} label={label} />
                ))}
              </ul>
            </div>
          </div>
        </Panel>
      </Reveal>

      {/* PART B — the four questions as evidence items */}
      <div>
        <Reveal>
          <div style={{ marginBottom: 18 }}>
            <span style={{ ...MONO, fontSize: '0.66rem', fontWeight: 600, color: 'var(--ink-50)' }}>
              What we ask
            </span>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {QUESTIONS.map((q, i) => (
            <Reveal key={q.text} delay={i * 90} style={{ height: '100%' }}>
              <EvidenceCard text={q.text} chip={q.chip} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

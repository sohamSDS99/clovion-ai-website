'use client'

/**
 * Brand Audit — section 03 · "Every Finding Is Traceable".
 *
 * The signature single AUDIT FINDING CARD. Left column names the four
 * traceability elements (locked verbatim copy); the right column renders one
 * realistic finding inside a Panel, walking top-to-bottom through the anatomy:
 * severity badge → clear finding → supporting evidence → recommendation handoff.
 *
 * Palette is Clovion's dark brand book (page wrapped in .clv-dark): ink +
 * alphas of ink on near-black, emerald `--positive` for affordance, and the
 * three SEVERITY hues used ONLY as small pills/dots/chips inside the mock.
 */

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import {
  S_BODY,
  MONO,
  SEVERITY,
  type SeverityKey,
  ArrowRight,
  Reveal,
  useInView,
  Panel,
} from '@/components/brand-audit/primitives'
import { cb, useReducedMotion } from '@/components/home/mocks/motion'

/* ── The four LOCKED traceability elements ──────────────────────── */
const ELEMENTS: { label: string; body: ReactNode }[] = [
  {
    label: 'Clear finding',
    body: 'Understand exactly what was discovered and why it matters.',
  },
  {
    label: 'Supporting evidence',
    body: 'Review the relevant page, source, or AI response that contributed to the finding.',
  },
  {
    label: 'Severity',
    // The sentence text stays verbatim and intact; the three severity words
    // are rendered as tiny inline chips using the SEVERITY colors.
    body: (
      <>
        Every finding is categorized as <SeverityChip k="critical" />, <SeverityChip k="warning" />, or{' '}
        <SeverityChip k="passed" />, helping your team prioritize what needs attention first.
      </>
    ),
  },
  {
    label: 'Recommendation handoff',
    body: 'Where action is needed, findings flow directly into Recommendations, creating a clear path from discovery to resolution.',
  },
]

/* ── Tiny inline severity chip (mock-only bright, kept small) ───── */
function SeverityChip({ k }: { k: SeverityKey }) {
  const s = SEVERITY[k]
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '0.06em 0.5em',
        borderRadius: 999,
        fontSize: '0.86em',
        fontWeight: 600,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        color: s.fg,
        background: s.bg,
        border: `1px solid ${s.border}`,
        verticalAlign: 'baseline',
      }}
    >
      <span aria-hidden style={{ width: 5, height: 5, borderRadius: 999, background: s.fg }} />
      {s.label}
    </span>
  )
}

/* ── Severity legend (Critical / Warning / Passed) ─────────────── */
function Legend() {
  const keys: SeverityKey[] = ['critical', 'warning', 'passed']
  return (
    <div
      style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 16px' }}
      aria-label="Severity legend"
    >
      <span style={{ ...MONO, fontSize: '0.6rem', fontWeight: 600, color: 'var(--ink-40)' }}>Legend</span>
      {keys.map((k) => (
        <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            aria-hidden
            style={{ width: 7, height: 7, borderRadius: 999, background: SEVERITY[k].fg, boxShadow: `0 0 0 3px ${SEVERITY[k].bg}` }}
          />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', color: 'var(--ink-60)' }}>
            {SEVERITY[k].label}
          </span>
        </span>
      ))}
    </div>
  )
}

/* ── Small block-label used inside the finding card anatomy ─────── */
function AnatomyLabel({ children }: { children: ReactNode }) {
  return (
    <span style={{ ...MONO, fontSize: '0.58rem', fontWeight: 600, color: 'var(--ink-40)', display: 'block' }}>
      {children}
    </span>
  )
}

export function FindingCard() {
  const reduce = useReducedMotion()
  const [cardRef, inView] = useInView<HTMLDivElement>()
  const [pulse, setPulse] = useState(false)

  // Subtle one-shot emphasis on the severity badge once the card is in view.
  useEffect(() => {
    if (reduce || !inView) return
    const t = setTimeout(() => setPulse(true), 520)
    const t2 = setTimeout(() => setPulse(false), 1180)
    return () => {
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [inView, reduce])

  const crit = SEVERITY.critical

  const insetCardStyle: CSSProperties = {
    borderRadius: 12,
    border: '1px dashed var(--line)',
    background: 'var(--subtle)',
    padding: '14px 16px',
  }

  return (
    <div
      role="group"
      aria-label="Anatomy of a traceable audit finding: clear finding, supporting evidence, severity, and recommendation handoff"
      className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1.1fr] md:gap-12 items-start"
    >
      {/* ── LEFT: the four traceability elements ─────────────────── */}
      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 22 }}>
        {ELEMENTS.map((el, i) => (
          <Reveal as="li" key={el.label} delay={i * 90} y={14}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 14,
                alignItems: 'start',
                paddingBottom: i < ELEMENTS.length - 1 ? 22 : 0,
                borderBottom: i < ELEMENTS.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <span
                aria-hidden
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: 'var(--ink-40)',
                  fontVariantNumeric: 'tabular-nums',
                  paddingTop: '0.15em',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <span
                  style={{
                    ...MONO,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  {el.label}
                </span>
                <p style={{ ...S_BODY, margin: 0, color: 'var(--ink-70)' }}>{el.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>

      {/* ── RIGHT: the realistic finding card ────────────────────── */}
      <div ref={cardRef}>
        <Panel label="Audit finding" status="#0472">
          <div style={{ display: 'grid', gap: 16 }}>
            {/* (a) Severity badge */}
            <Reveal delay={40} y={12}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '4px 11px',
                    borderRadius: 999,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    color: crit.fg,
                    background: crit.bg,
                    border: `1px solid ${crit.border}`,
                    transform: pulse ? 'scale(1.04)' : 'scale(1)',
                    boxShadow: pulse ? `0 0 0 4px ${crit.bg}` : '0 0 0 0 transparent',
                    transition: reduce
                      ? 'none'
                      : `transform 0.5s ${cb}, box-shadow 0.5s ${cb}`,
                  }}
                >
                  <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: crit.fg }} />
                  {crit.label}
                </span>
                <span style={{ ...MONO, fontSize: '0.58rem', fontWeight: 600, color: 'var(--ink-40)' }}>
                  Visibility
                </span>
              </div>
            </Reveal>

            {/* (b) Clear finding */}
            <Reveal delay={130} y={12}>
              <div>
                <AnatomyLabel>Finding</AnatomyLabel>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.12rem',
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: 'var(--ink)',
                    margin: '8px 0 6px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Absent from top review platforms
                </h3>
                <p style={{ ...S_BODY, margin: 0, color: 'var(--ink-70)' }}>
                  When buyers ask AI to compare tools in your category, competitors are named from G2 and Capterra
                  while your brand goes unmentioned.
                </p>
              </div>
            </Reveal>

            {/* (c) Supporting evidence */}
            <Reveal delay={220} y={12}>
              <div>
                <AnatomyLabel>Supporting evidence</AnatomyLabel>
                <div style={{ ...insetCardStyle, marginTop: 8 }}>
                  <p
                    style={{
                      ...S_BODY,
                      margin: 0,
                      color: 'var(--ink-80)',
                      fontStyle: 'italic',
                      lineHeight: 1.55,
                    }}
                  >
                    &ldquo;For teams comparing options today, the most cited platforms are{' '}
                    <span style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 600 }}>Ahrefs</span>,{' '}
                    <span style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 600 }}>Semrush</span>, and{' '}
                    <span style={{ fontStyle: 'normal', color: 'var(--ink)', fontWeight: 600 }}>Moz</span> &mdash; each
                    with strong reviews on G2.&rdquo;
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 7,
                      marginTop: 12,
                      paddingTop: 10,
                      borderTop: '1px solid var(--line)',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logos/chatgpt.svg"
                      alt=""
                      aria-hidden="true"
                      style={{ height: 15, width: 'auto', filter: 'var(--logo-filter)', opacity: 0.9 }}
                    />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--ink-50)' }}>
                      ChatGPT · comparison prompt
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* (d) Recommendation handoff */}
            <Reveal delay={310} y={12}>
              <button
                type="button"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                  background: 'var(--subtle)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  font: 'inherit',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <AnatomyLabel>Recommendation</AnatomyLabel>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>
                    View in Recommendations
                  </span>
                </span>
                <span aria-hidden style={{ display: 'inline-flex', color: 'var(--positive)' }}>
                  <ArrowRight size={16} />
                </span>
              </button>
            </Reveal>

            {/* Severity legend */}
            <Reveal delay={380} y={10}>
              <div style={{ paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                <Legend />
              </div>
            </Reveal>
          </div>
        </Panel>
      </div>
    </div>
  )
}

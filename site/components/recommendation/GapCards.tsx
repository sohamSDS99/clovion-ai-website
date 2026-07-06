'use client'

/**
 * "Find The Gap. Fix The Cause." — three distinct diagnostic cards. Each pairs
 * the gap (name + verbatim description) with its verbatim "Fix:" line and a
 * meaningful mini-viz:
 *   • Source-presence  → absent-from-sources map (competitors cited, you missing)
 *   • Substance        → retrieved-but-not-cited page indicator
 *   • Framing          → correct-vs-incorrect framing diff
 *
 * Copy is rendered verbatim. Visuals only illustrate the adjacent text.
 */

import { type CSSProperties, type ReactNode } from 'react'
import {
  Panel,
  Reveal,
  MONO,
  FIX_CLASS,
  NEG,
  type FixClassKey,
  CheckIcon,
  CrossIcon,
  DotIcon,
} from './primitives'

const H3: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '1.12rem',
  fontWeight: 600,
  color: 'var(--ink)',
  margin: 0,
  letterSpacing: '0.005em',
}
const BODY: CSSProperties = {
  fontFamily: 'var(--font-body-reg, var(--font-body))',
  fontSize: '0.92rem',
  lineHeight: 1.58,
  color: 'var(--ink-70)',
  margin: '10px 0 0',
}
const VIZ_LABEL: CSSProperties = { ...MONO, fontSize: '0.58rem', fontWeight: 600, color: 'var(--ink-50)' }

/* ── mini-viz 1 — absent-from-sources map ──────────────────────── */
function SourceMap() {
  const rows = [
    { name: 'G2', cited: 3 },
    { name: 'Comparison listicles', cited: 4 },
    { name: 'Reddit threads', cited: 2 },
    { name: 'Industry directories', cited: 3 },
  ]
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={VIZ_LABEL}>Sources AI cites</span>
        <span style={VIZ_LABEL}>You</span>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.name}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '8px 10px',
            borderRadius: 10,
            border: '1px solid var(--line)',
            background: 'var(--white)',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span
              style={{
                fontFamily: 'var(--font-body-reg, var(--font-body))',
                fontSize: '0.76rem',
                color: 'var(--ink-70)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {r.name}
            </span>
            <span style={{ display: 'inline-flex', gap: 3 }}>
              {Array.from({ length: r.cited }).map((_, j) => (
                <span key={j} style={{ color: 'var(--ink)' }}>
                  <DotIcon size={6} />
                </span>
              ))}
            </span>
          </span>
          <span
            title="Your company is absent"
            style={{
              flexShrink: 0,
              height: 16,
              width: 16,
              borderRadius: 999,
              border: `1.5px dashed ${FIX_CLASS.source.border}`,
              color: FIX_CLASS.source.fg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CrossIcon size={8} />
          </span>
        </div>
      ))}
      <span style={{ ...MONO, fontSize: '0.58rem', color: FIX_CLASS.source.fg }}>Absent from 4 / 4 surfaces</span>
    </div>
  )
}

/* ── mini-viz 2 — retrieved but not cited ──────────────────────── */
function RetrievedNotCited() {
  const missing = ['Proof', 'Comparison', 'Statistic', 'Example']
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '9px 11px',
          borderRadius: 10,
          border: '1px solid var(--line)',
          background: 'var(--white)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-70)' }}>/pricing</span>
        <span style={{ display: 'inline-flex', gap: 6 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 999,
              border: '1px solid var(--line)',
              background: 'var(--subtle)',
              color: 'var(--ink-60)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              fontWeight: 600,
            }}
          >
            <CheckIcon size={9} /> Retrieved
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 999,
              border: `1px solid ${FIX_CLASS.substance.border}`,
              background: FIX_CLASS.substance.bg,
              color: FIX_CLASS.substance.fg,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              fontWeight: 600,
            }}
          >
            <CrossIcon size={8} /> Not cited
          </span>
        </span>
      </div>
      <div>
        <span style={VIZ_LABEL}>Missing the detail AI needs</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
          {missing.map((m) => (
            <span
              key={m}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 9px',
                borderRadius: 999,
                border: '1px dashed var(--ink-25)',
                color: 'var(--ink-50)',
                fontFamily: 'var(--font-body-reg, var(--font-body))',
                fontSize: '0.72rem',
              }}
            >
              <span style={{ height: 5, width: 5, borderRadius: 999, background: 'var(--ink-25)' }} />
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── mini-viz 3 — framing diff ─────────────────────────────────── */
function FramingDiff() {
  return (
    <div style={{ display: 'grid', gap: 8, fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
      <span style={VIZ_LABEL}>How AI describes you</span>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: '8px 10px',
          borderRadius: 10,
          border: `1px solid ${NEG.border}`,
          background: NEG.bg,
        }}
      >
        <span style={{ color: NEG.fg, fontWeight: 700 }}>&minus;</span>
        <span style={{ color: NEG.fg, textDecoration: 'line-through', textDecorationColor: 'rgba(220,38,38,0.5)', lineHeight: 1.4 }}>
          &ldquo;Enterprise-only, hard to implement, and too expensive for small teams.&rdquo;
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8,
          padding: '8px 10px',
          borderRadius: 10,
          border: '1px solid var(--positive-border)',
          background: 'var(--positive-bg)',
        }}
      >
        <span style={{ color: 'var(--positive)', fontWeight: 700 }}>+</span>
        <span style={{ color: 'var(--positive)', lineHeight: 1.4 }}>
          &ldquo;Fits teams of any size and onboards in a day.&rdquo;
        </span>
      </div>
    </div>
  )
}

/* ── card shell ────────────────────────────────────────────────── */
function GapCard({
  fixClass,
  viz,
  title,
  children,
  fix,
  delay,
}: {
  fixClass: FixClassKey
  viz: ReactNode
  title: string
  children: ReactNode
  fix: ReactNode
  delay: number
}) {
  const fc = FIX_CLASS[fixClass]
  return (
    <Reveal delay={delay} y={20} style={{ height: '100%' }}>
      <Panel
        grid
        corners
        pad={0}
        radius={22}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* accent bar keyed to the fix class */}
        <span aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: fc.fg, opacity: 0.85 }} />
        <div style={{ position: 'relative', padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* mini-viz */}
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              border: '1px solid var(--line)',
              background: 'var(--subtle)',
              minHeight: 150,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {viz}
          </div>
          {/* copy */}
          <h3 style={{ ...H3, marginTop: 18 }}>{title}</h3>
          <div style={{ flex: 1 }}>{children}</div>
          {/* fix line */}
          <div
            style={{
              marginTop: 16,
              padding: '11px 13px',
              borderRadius: 12,
              border: `1px solid ${fc.border}`,
              background: fc.bg,
              display: 'flex',
              gap: 8,
              alignItems: 'baseline',
            }}
          >
            <span style={{ ...MONO, fontSize: '0.62rem', fontWeight: 700, color: fc.fg, flexShrink: 0 }}>Fix:</span>
            <span style={{ fontFamily: 'var(--font-body-reg, var(--font-body))', fontSize: '0.86rem', lineHeight: 1.5, color: 'var(--ink-70)' }}>
              {fix}
            </span>
          </div>
        </div>
      </Panel>
    </Reveal>
  )
}

export function GapCards() {
  return (
    <div className="rec-gap-grid" style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr' }}>
      <GapCard
        fixClass="source"
        delay={0}
        viz={<SourceMap />}
        title="Source-presence gap"
        fix={<>Get listed, mentioned, or represented on the sources AI already relies on.</>}
      >
        <p style={BODY}>
          AI models are citing third-party pages like G2, comparison listicles, Reddit threads, and industry
          directories &mdash; but your company is missing from those surfaces.
        </p>
      </GapCard>

      <GapCard
        fixClass="substance"
        delay={90}
        viz={<RetrievedNotCited />}
        title="Substance gap"
        fix={<>Add more substance to the pages AI is already finding.</>}
      >
        <p style={BODY}>Your page is retrieved, but not cited.</p>
        <p style={BODY}>
          That usually means the page exists, but lacks the specific proof, comparison, statistic, example, or detail
          the model needs to use it confidently.
        </p>
      </GapCard>

      <GapCard
        fixClass="framing"
        delay={180}
        viz={<FramingDiff />}
        title="Framing gap"
        fix={<>Correct the source carrying the wrong framing, not just your own website.</>}
      >
        <p style={BODY}>Your brand is cited, but described incorrectly.</p>
        <p style={BODY}>
          Maybe AI says you&rsquo;re enterprise-only, hard to implement, too expensive, or not suitable for a certain
          market.
        </p>
      </GapCard>

      <style>{`
        @media (min-width: 900px) {
          .rec-gap-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}

'use client'

/**
 * Brand Audit — section 02: "Four Areas Every Audit Covers".
 *
 * A 2×2 grid of technical-drawing Panels (single column on mobile). Each panel
 * pairs the area name (Saans display, scaled down) + its VERBATIM body copy +
 * one distinct, meaningful mini-visualization. Panels reveal on scroll with a
 * staggered delay. All motion degrades under prefers-reduced-motion; the depth
 * bars in panel 2 animate scaleX on reveal, otherwise snap to final.
 *
 * Palette is locked to the dark brand book: ink + alphas of ink on near-black,
 * emerald `--positive` as the only affordance hue, and the three SEVERITY
 * entries strictly as small dots / pills / status icons inside the mocks.
 */

import { type CSSProperties } from 'react'
import {
  S_DISPLAY_MD,
  S_BODY,
  MONO,
  SEVERITY,
  CheckIcon,
  CrossIcon,
  WarnIcon,
  Reveal,
  useInView,
  Panel,
} from '@/components/brand-audit/primitives'
import { cb, useReducedMotion } from '@/components/home/mocks/motion'

/* ── Shared small type ─────────────────────────────────────────── */
const AREA_NAME: CSSProperties = {
  ...S_DISPLAY_MD,
  fontSize: '1.15rem',
  fontWeight: 600,
  lineHeight: 1.15,
  margin: 0,
}
const AREA_BODY: CSSProperties = {
  ...S_BODY,
  fontSize: '0.9rem',
  color: 'var(--ink-70)',
  margin: '10px 0 0',
}
const MICRO_LABEL: CSSProperties = {
  ...MONO,
  fontSize: '0.6rem',
  fontWeight: 600,
  color: 'var(--ink-45, var(--ink-50))',
}

/* Small status pill used inside mocks (severity or emerald affordance). */
function StatusPill({
  fg,
  bg,
  border,
  children,
}: {
  fg: string
  bg: string
  border: string
  children: React.ReactNode
}) {
  return (
    <span
      style={{
        ...MONO,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: '0.56rem',
        fontWeight: 600,
        color: fg,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 999,
        padding: '2px 7px',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/* Row divider hairline */
const ROW: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '7px 0',
  borderTop: '1px solid var(--line)',
}

/* ── 1. Source Coverage — presence map ─────────────────────────── */
type SourceStatus = 'present' | 'absent' | 'competitor'
const SOURCES: { name: string; status: SourceStatus }[] = [
  { name: 'Review platforms (G2)', status: 'present' },
  { name: 'Analyst reports', status: 'competitor' },
  { name: 'Communities (Reddit)', status: 'competitor' },
  { name: 'Directories (Capterra)', status: 'present' },
  { name: 'Editorial sites', status: 'absent' },
]

function SourcePresenceMap() {
  return (
    <div role="img" aria-label="Source presence map: your brand is present on review platforms and directories, absent on editorial sites, and competitors are cited on analyst reports and communities where your business is absent.">
      {SOURCES.map((s, i) => (
        <div key={s.name} style={{ ...ROW, borderTop: i === 0 ? 'none' : ROW.borderTop }}>
          <span style={{ ...S_BODY, fontSize: '0.78rem', color: 'var(--ink-80)', margin: 0 }}>{s.name}</span>
          {s.status === 'present' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--positive)', ...MONO, fontSize: '0.56rem', fontWeight: 600 }}>
              <CheckIcon size={11} />
              Present
            </span>
          )}
          {s.status === 'absent' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--ink-40)', ...MONO, fontSize: '0.56rem', fontWeight: 600 }}>
              <CrossIcon size={11} />
              Absent
            </span>
          )}
          {s.status === 'competitor' && (
            <StatusPill fg={SEVERITY.warning.fg} bg={SEVERITY.warning.bg} border={SEVERITY.warning.border}>
              <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: SEVERITY.warning.fg }} />
              Competitor cited · you absent
            </StatusPill>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── 2. Website Substance — page-depth meter ───────────────────── */
type PageRow = { path: string; depth: number; flagged?: boolean }
const PAGES: PageRow[] = [
  { path: '/pricing', depth: 0.82 },
  { path: '/features', depth: 0.64 },
  { path: '/integrations', depth: 0.31, flagged: true },
]

function DepthBar({ depth, play }: { depth: number; play: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        position: 'relative',
        display: 'block',
        height: 6,
        borderRadius: 999,
        background: 'var(--ink-10)',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'left center',
          transform: play ? `scaleX(${depth})` : 'scaleX(0)',
          background: 'var(--ink-60)',
          borderRadius: 999,
          transition: `transform 0.9s ${cb}`,
        }}
      />
    </span>
  )
}

function PageDepthMeter() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const play = reduce || inView
  return (
    <div ref={ref} role="img" aria-label="Page depth meter: pricing and features pages have strong content depth, while the integrations page is discovered but not referenced due to low depth.">
      {PAGES.map((p) => (
        <div key={p.path} style={{ padding: '9px 0', borderTop: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 7 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--ink-80)' }}>{p.path}</span>
            {p.flagged ? (
              <StatusPill fg={SEVERITY.warning.fg} bg={SEVERITY.warning.bg} border={SEVERITY.warning.border}>
                Discovered · not referenced
              </StatusPill>
            ) : (
              <span style={{ ...MONO, fontSize: '0.58rem', fontWeight: 600, color: 'var(--ink-50)', fontVariantNumeric: 'tabular-nums' }}>
                {Math.round(p.depth * 100)} depth
              </span>
            )}
          </div>
          <DepthBar depth={p.depth} play={play} />
        </div>
      ))}
    </div>
  )
}

/* ── 3. Consistency & Positioning — cross-web diff ─────────────── */
function ConsistencyDiff() {
  const col: CSSProperties = {
    flex: 1,
    minWidth: 0,
    border: '1px solid var(--line)',
    borderRadius: 12,
    padding: '11px 12px',
    background: 'var(--subtle)',
  }
  const txt: CSSProperties = { ...S_BODY, fontSize: '0.78rem', color: 'var(--ink-70)', margin: '7px 0 0', lineHeight: 1.5 }
  return (
    <div
      role="img"
      aria-label="Cross-web consistency diff: your site positions the product for enterprise teams, while a third-party review describes it as built for small teams — a conflicting positioning mismatch."
      style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
    >
      <div style={col}>
        <span style={MICRO_LABEL}>Your site</span>
        <p style={txt}>
          Positioned for{' '}
          <mark
            style={{
              background: SEVERITY.passed.bg,
              color: SEVERITY.passed.fg,
              borderRadius: 4,
              padding: '1px 4px',
              fontWeight: 600,
            }}
          >
            enterprise teams
          </mark>
          .
        </p>
      </div>
      <div style={col}>
        <span style={MICRO_LABEL}>Third-party review</span>
        <p style={txt}>
          Described as{' '}
          <mark
            style={{
              background: SEVERITY.critical.bg,
              color: SEVERITY.critical.fg,
              borderRadius: 4,
              padding: '1px 4px',
              fontWeight: 600,
              textDecoration: 'line-through',
              textDecorationColor: 'var(--ink-40)',
            }}
          >
            built for small teams
          </mark>
          .
        </p>
      </div>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 7 }}>
        <StatusPill fg={SEVERITY.warning.fg} bg={SEVERITY.warning.bg} border={SEVERITY.warning.border}>
          <WarnIcon size={11} />
          Conflicting positioning
        </StatusPill>
      </div>
    </div>
  )
}

/* ── 4. Factual Accuracy — verification checklist ──────────────── */
type FactStatus = 'verified' | 'incorrect' | 'outdated'
const FACTS: { fact: string; status: FactStatus }[] = [
  { fact: 'Integrations', status: 'verified' },
  { fact: 'Pricing model', status: 'incorrect' },
  { fact: 'Compliance (SOC 2)', status: 'verified' },
  { fact: 'Founded year', status: 'outdated' },
]

function FactChecklist() {
  return (
    <div role="img" aria-label="Fact verification checklist: integrations and SOC 2 compliance are verified, the pricing model is incorrect, and the founded year is outdated.">
      {FACTS.map((f, i) => (
        <div key={f.fact} style={{ ...ROW, borderTop: i === 0 ? 'none' : ROW.borderTop }}>
          <span style={{ ...S_BODY, fontSize: '0.78rem', color: 'var(--ink-80)', margin: 0 }}>{f.fact}</span>
          {f.status === 'verified' && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--positive)', ...MONO, fontSize: '0.56rem', fontWeight: 600 }}>
              <CheckIcon size={11} />
              Verified
            </span>
          )}
          {f.status === 'incorrect' && (
            <StatusPill fg={SEVERITY.critical.fg} bg={SEVERITY.critical.bg} border={SEVERITY.critical.border}>
              <CrossIcon size={10} />
              Incorrect
            </StatusPill>
          )}
          {f.status === 'outdated' && (
            <StatusPill fg={SEVERITY.warning.fg} bg={SEVERITY.warning.bg} border={SEVERITY.warning.border}>
              <WarnIcon size={11} />
              Outdated
            </StatusPill>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Panel composition ─────────────────────────────────────────── */
const AREAS = [
  {
    label: 'Area 01',
    name: 'Source Coverage',
    body: 'Discover whether your brand appears on the review platforms, analyst reports, communities, directories, and editorial sites that influence AI-generated answers. Identify where competitors are being cited while your business is absent.',
    viz: <SourcePresenceMap />,
  },
  {
    label: 'Area 02',
    name: 'Website Substance',
    body: 'Analyze whether the pages AI retrieves from your website contain the depth, evidence, comparisons, examples, and supporting information needed to earn citations. Find pages that are being discovered—but not referenced.',
    viz: <PageDepthMeter />,
  },
  {
    label: 'Area 03',
    name: 'Consistency & Positioning',
    body: 'Compare how your brand is described across your website and third-party sources. Identify conflicting positioning, inconsistent messaging, and outdated information that can lead AI engines to describe your business differently.',
    viz: <ConsistencyDiff />,
  },
  {
    label: 'Area 04',
    name: 'Factual Accuracy',
    body: 'Verify the key facts AI engines use when talking about your business. From product capabilities and integrations to company details and compliance coverage, Clovion highlights missing, incorrect, or outdated information before it affects buyer conversations.',
    viz: <FactChecklist />,
  },
]

export function FourAreas() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
      {AREAS.map((a, i) => (
        <Reveal key={a.name} delay={i * 110} y={20} style={{ height: '100%' }}>
          <Panel
            label={a.label}
            status="AUDIT SCOPE"
            pad={24}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <h3 style={AREA_NAME}>{a.name}</h3>
            <p style={AREA_BODY}>{a.body}</p>
            <div style={{ marginTop: 18, paddingTop: 4 }}>{a.viz}</div>
          </Panel>
        </Reveal>
      ))}
    </div>
  )
}

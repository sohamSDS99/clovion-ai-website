'use client'

/**
 * "We Don't Stop There" — post-implementation monitoring motif.
 *
 * An implemented recommendation stays wired to the exact things it was designed
 * to influence: the prompts, citations, sources, and visibility metrics. Each
 * channel shows a live monitoring pulse and a settling reading.
 */

import { type CSSProperties } from 'react'
import {
  Panel,
  Reveal,
  useInView,
  useReducedMotion,
  MONO,
  CheckIcon,
} from './primitives'

const CHANNELS = [
  { key: 'prompts', label: 'Prompts', reading: '61 tracked', note: 'watching for you' },
  { key: 'citations', label: 'Citations', reading: '+3.3×', note: 'appearing more' },
  { key: 'sources', label: 'Sources', reading: 'G2 · Reddit', note: 'now representing you' },
  { key: 'visibility', label: 'Visibility metrics', reading: '↑ trending', note: 'measuring lift' },
]

function LiveDot() {
  const reduce = useReducedMotion()
  return (
    <span style={{ position: 'relative', display: 'inline-flex', height: 8, width: 8 }}>
      {!reduce && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            background: 'var(--positive)',
            animation: 'clv-ping 1.8s cubic-bezier(0,0,0.2,1) infinite',
          }}
        />
      )}
      <span style={{ position: 'relative', height: 8, width: 8, borderRadius: 999, background: 'var(--positive)' }} />
    </span>
  )
}

const MONO_SM: CSSProperties = { ...MONO, fontSize: '0.58rem', fontWeight: 600, color: 'var(--ink-50)' }

function ChannelRow({ label, reading, note, delay }: { label: string; reading: string; note: string; delay: number }) {
  return (
    <Reveal delay={delay} y={10}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 14px',
          borderRadius: 12,
          border: '1px solid var(--line)',
          background: 'var(--white)',
        }}
      >
        <LiveDot />
        <span style={{ display: 'flex', flexDirection: 'column', gap: 1, marginRight: 'auto', minWidth: 0 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
          <span style={MONO_SM}>{note}</span>
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--positive)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          {reading}
        </span>
      </div>
    </Reveal>
  )
}

function SourceNode() {
  const [ref, inView] = useInView<HTMLDivElement>()
  const reduce = useReducedMotion()
  const on = reduce || inView
  return (
    <div
      ref={ref}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(10px)',
        transition: reduce ? 'none' : 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '16px 16px',
        borderRadius: 14,
        border: '1px solid var(--ink)',
        background: 'var(--subtle)',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
        <span
          style={{
            height: 22,
            width: 22,
            borderRadius: 999,
            background: 'var(--positive)',
            color: 'var(--on-ink, #fff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckIcon size={11} />
        </span>
        <span style={MONO_SM}>Implemented</span>
      </span>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.98rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>
        REC-2481 · Get cited in the G2 comparison set
      </span>
      <span style={{ fontFamily: 'var(--font-body-reg, var(--font-body))', fontSize: '0.8rem', color: 'var(--ink-60)', lineHeight: 1.5 }}>
        Still tracked against what it was meant to influence.
      </span>
    </div>
  )
}

export function MonitoringMotif() {
  return (
    <Panel grid corners pad={20} radius={24} style={{ boxShadow: 'var(--shadow-card)' }}>
      <div className="rec-monitor-grid" style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr' }}>
        <SourceNode />
        <div style={{ display: 'grid', gap: 10 }}>
          {CHANNELS.map((c, i) => (
            <ChannelRow key={c.key} label={c.label} reading={c.reading} note={c.note} delay={i * 80} />
          ))}
        </div>
      </div>
      <style>{`
        @media (min-width: 820px) {
          .rec-monitor-grid { grid-template-columns: 0.85fr 1.15fr !important; align-items: stretch; }
        }
      `}</style>
    </Panel>
  )
}

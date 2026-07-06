'use client'

/**
 * Brand Audit — Section 06 · "From Audit to Action".
 *
 * A vertical pipeline: Audit → Recommendations → Impact Measurement. Three
 * stacked node cards connected by animated downward connectors (a vertical
 * hairline with flowing dashes looping downward + an ArrowDown glyph) that
 * echo the '↓' the copy shows between steps. Strictly Clovion dark tokens —
 * ink + alphas of ink on near-black, with emerald `--positive` used only as a
 * subtle progress affordance on the Recommendations and Impact nodes.
 *
 * Motion: nodes reveal top-to-bottom in sequence (staggered Reveal); the
 * connector dashes loop subtly downward. Under prefers-reduced-motion the nodes
 * are shown and the connectors go static (no flow).
 */

import { useEffect, useState, type CSSProperties } from 'react'
import {
  ArrowDown,
  MONO,
  Panel,
  Reveal,
  ScanIcon,
} from '@/components/brand-audit/primitives'
import { cb } from '@/components/home/mocks/motion'

/* ── Reduced-motion (local, matches the primitives' Reveal semantics) ── */
function usePrefersReduce(): boolean {
  const [reduce, setReduce] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const on = () => setReduce(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])
  return reduce
}

/* ── Animated downward connector ────────────────────────────────────────
   A vertical hairline track with a flowing dashed line animating downward
   (via a continuously decreasing strokeDashoffset loop) plus a settling
   ArrowDown glyph. Static under reduced motion. ─────────────────────────── */
function Connector({ emerald }: { emerald: boolean }) {
  const reduce = usePrefersReduce()
  const flowColor = emerald ? 'var(--positive)' : 'var(--ink-40)'
  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '4px 0',
      }}
    >
      <svg
        width="14"
        height="46"
        viewBox="0 0 14 46"
        fill="none"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        {/* static faint track */}
        <line
          x1="7"
          y1="1"
          x2="7"
          y2="45"
          stroke="var(--ink)"
          strokeOpacity={0.14}
          strokeWidth={1.5}
        />
        {/* flowing dashes — loop downward via animated strokeDashoffset */}
        <line
          x1="7"
          y1="1"
          x2="7"
          y2="45"
          stroke={flowColor}
          strokeOpacity={0.9}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="4 8"
          style={{
            animation: reduce ? 'none' : 'clv-flow 1.1s linear infinite',
          }}
        />
      </svg>
      <span style={{ color: flowColor, display: 'flex', lineHeight: 0 }}>
        <ArrowDown size={14} />
      </span>
    </div>
  )
}

/* ── Node model ─────────────────────────────────────────────────────────── */
type NodeDef = {
  index: string
  name: string
  desc: string
  status: string
  emerald: boolean
  origin?: boolean
}

const NODES: NodeDef[] = [
  {
    index: 'STEP 01',
    name: 'Audit',
    desc: 'Understand how AI engines perceive your brand.',
    status: 'ORIGIN',
    emerald: false,
    origin: true,
  },
  {
    index: 'STEP 02',
    name: 'Recommendations',
    desc: 'Receive prioritized actions based on the audit findings.',
    status: 'PRIORITIZED',
    emerald: true,
  },
  {
    index: 'STEP 03',
    name: 'Impact Measurement',
    desc: 'Track whether those recommendations improve how AI engines cite and describe your brand.',
    status: 'MEASURED',
    emerald: true,
  },
]

function NodeCard({ node }: { node: NodeDef }) {
  return (
    <Panel
      label={node.index}
      status={node.status}
      pad={22}
      cell={30}
      style={{
        borderColor: node.emerald ? 'var(--positive-border)' : 'var(--line)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* leading marker: emerald dot for progress nodes; scan glyph ties the
            origin node back to the audit theme */}
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: 30,
            height: 30,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${
              node.emerald ? 'var(--positive-border)' : 'var(--line)'
            }`,
            background: node.emerald ? 'var(--positive-bg)' : 'var(--subtle)',
            color: node.emerald ? 'var(--positive)' : 'var(--ink-60)',
          }}
        >
          {node.origin ? (
            <ScanIcon size={14} />
          ) : (
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--positive)',
              }}
            />
          )}
        </span>

        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            {node.name}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body-reg, var(--font-body))',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              fontWeight: 400,
              color: 'var(--ink-70)',
              margin: '6px 0 0',
            }}
          >
            {node.desc}
          </p>
        </div>
      </div>
    </Panel>
  )
}

export function AuditToAction() {
  const caption = 'From audit to action: a pipeline flowing from Audit to Recommendations to Impact Measurement.'
  return (
    <div
      role="img"
      aria-label={caption}
      style={{ maxWidth: 640, width: '100%', margin: '0 auto' }}
    >
      {NODES.map((node, i) => (
        <div key={node.index}>
          <Reveal delay={i * 180} y={18}>
            <NodeCard node={node} />
          </Reveal>
          {i < NODES.length - 1 && (
            <Reveal delay={i * 180 + 120} y={8}>
              <Connector emerald={NODES[i + 1].emerald} />
            </Reveal>
          )}
        </div>
      ))}
    </div>
  )
}

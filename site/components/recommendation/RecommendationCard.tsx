'use client'

/**
 * The signature artifact of the page: one polished recommendation card broken
 * into the four labeled parts the copy names — What Clovion found / Why it
 * matters / What to fix / Where to act — showing the finding → rationale →
 * fix-class tag → target surface. The four parts reveal in sequence on scroll.
 */

import { type CSSProperties } from 'react'
import {
  Panel,
  Chip,
  Reveal,
  FIX_CLASS,
  MONO,
  ArrowRight,
  PinIcon,
} from './primitives'

const LABEL: CSSProperties = {
  ...MONO,
  fontSize: '0.64rem',
  fontWeight: 600,
  color: 'var(--ink-50)',
}
const PART_TITLE: CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: 'var(--ink)',
  letterSpacing: '0.01em',
}
const PART_BODY: CSSProperties = {
  fontFamily: 'var(--font-body-reg, var(--font-body))',
  fontSize: '0.92rem',
  lineHeight: 1.58,
  color: 'var(--ink-70)',
  margin: 0,
}

/* Numbered part-marker → each of the four labeled parts */
function PartMark({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      style={{
        flexShrink: 0,
        height: 24,
        width: 24,
        borderRadius: 8,
        border: '1px solid var(--line)',
        background: 'var(--subtle)',
        color: 'var(--ink-60)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.66rem',
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {n}
    </span>
  )
}

function Part({
  n,
  label,
  delay,
  children,
}: {
  n: number
  label: string
  delay: number
  children: React.ReactNode
}) {
  return (
    <Reveal delay={delay} y={12}>
      <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 14, alignItems: 'start' }}>
        <PartMark n={n} />
        <div>
          <div style={LABEL}>{label}</div>
          <div style={{ marginTop: 8 }}>{children}</div>
        </div>
      </div>
    </Reveal>
  )
}

function Connector() {
  return (
    <div aria-hidden style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <span style={{ width: 1, height: 20, background: 'var(--line)' }} />
      </div>
      <span />
    </div>
  )
}

export function RecommendationCard() {
  const fc = FIX_CLASS.source

  return (
    <Panel
      grid
      corners
      pad={0}
      radius={24}
      style={{ maxWidth: 720, margin: '0 auto', boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Card header — identity + priority + fix-class tag */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 10,
          padding: '16px 20px',
          borderBottom: '1px solid var(--line)',
          background: 'var(--subtle)',
        }}
      >
        <span
          style={{
            height: 30,
            width: 30,
            borderRadius: 9,
            background: 'var(--ink)',
            color: 'var(--on-ink, #fff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowRight size={15} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginRight: 'auto' }}>
          <span style={{ ...MONO, fontSize: '0.62rem', color: 'var(--ink-50)' }}>Recommendation · REC-2481</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, color: 'var(--ink)' }}>
            Get cited in the G2 comparison set
          </span>
        </div>
        <Chip fg="#b45309" bg="#fffbeb" border="rgba(180,83,9,0.24)">High priority</Chip>
        <Chip fg={fc.fg} bg={fc.bg} border={fc.border}>{fc.label}</Chip>
      </div>

      {/* Four labeled parts */}
      <div style={{ position: 'relative', padding: '24px 20px 26px' }}>
        <Part n={1} label="What Clovion found" delay={0}>
          <p style={PART_BODY}>
            You&rsquo;re absent from the G2 &ldquo;Best AI Visibility Software&rdquo; category page that ChatGPT and
            Perplexity cite when buyers ask them to compare tools in your space.
          </p>
        </Part>
        <Connector />

        <Part n={2} label="Why it matters" delay={90}>
          <p style={PART_BODY}>
            That listicle is cited in 34 of the 61 prompts where competitors get recommended and you don&rsquo;t. Being
            missing from the source keeps you out of the comparison set entirely.
          </p>
        </Part>
        <Connector />

        <Part n={3} label="What to fix" delay={180}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ ...MONO, fontSize: '0.6rem', color: 'var(--ink-50)' }}>Fix class</span>
            <Chip fg={fc.fg} bg={fc.bg} border={fc.border}>{fc.label}</Chip>
          </div>
          <p style={PART_BODY}>
            Claim and complete your G2 category profile, then request 8&ndash;10 verified reviews so the page starts
            representing you alongside the tools AI already lists.
          </p>
        </Part>
        <Connector />

        <Part n={4} label="Where to act" delay={270}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              border: '1px solid var(--line)',
              background: 'var(--white)',
            }}
          >
            <span style={{ color: 'var(--ink-50)', flexShrink: 0 }}>
              <PinIcon size={13} />
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--ink)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                g2.com/categories/ai-visibility-software
              </span>
              <span style={{ ...MONO, fontSize: '0.58rem', color: 'var(--ink-50)' }}>
                Third-party source · not your website
              </span>
            </span>
          </div>
        </Part>
      </div>
    </Panel>
  )
}

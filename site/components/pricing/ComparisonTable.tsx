'use client'

import { Button } from '@/components/ui'

const COL = ['Starter', 'Growth', 'Enterprise']

const CMP_GROUPS: { group: string; rows: { f: string; v: (string | boolean)[] }[] }[] = [
  {
    group: 'Plans & limits',
    rows: [
      { f: 'Starting price', v: ['$79/mo', '$229/mo', 'Custom'] },
      { f: 'Prompts included', v: ['50', '100', 'Unlimited'] },
      { f: 'AI models included', v: ['2 models', '3 models', 'All available'] },
    ],
  },
  {
    group: 'Visibility & sentiment',
    rows: [
      { f: 'AI Visibility Tracking', v: [true, true, true] },
      { f: 'Brand Perception', v: [true, true, true] },
      { f: 'Positive / Negative / Neutral Sentiment', v: [true, true, true] },
      { f: 'GEO Recommendations', v: ['Basic', 'Advanced', 'Custom / Advanced'] },
    ],
  },
  {
    group: 'Tracking & insights',
    rows: [
      { f: 'Prompt Tracking', v: [false, true, true] },
      { f: 'Fully Customizable Prompt Tracking', v: [false, false, true] },
      { f: 'Competitor Analysis', v: [false, true, true] },
      { f: 'Fanout Query Insights', v: [false, true, true] },
      { f: 'AI Crawlability', v: [false, true, true] },
      { f: 'Prompt Volumes', v: [false, true, true] },
      { f: 'Multi-model Tracking', v: [false, true, true] },
    ],
  },
  {
    group: 'Reporting & support',
    rows: [
      { f: 'Choose from All Models', v: [false, false, true] },
      { f: 'Custom Reporting', v: [false, false, true] },
      { f: 'Priority Support', v: [false, false, true] },
    ],
  },
]

const CMP_BESTFOR = [
  'Small brands & early teams',
  'Growing SEO & marketing teams',
  'Enterprises, agencies & large brands',
]

const CMP_CTA: { label: string; variant: 'primary' | 'secondary' }[] = [
  { label: 'Start Tracking', variant: 'secondary' },
  { label: 'Choose Growth', variant: 'primary' },
  { label: 'Talk to Sales', variant: 'secondary' },
]

const P_MONO_LABEL = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: 'var(--ink-50)',
}

function BoldCheck({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function Cell({ val }: { val: string | boolean }) {
  if (val === true) {
    return (
      <span
        style={{
          display: 'inline-flex',
          height: 22,
          width: 22,
          borderRadius: 999,
          background: 'var(--ink-surface, var(--ink))',
          color: '#ffffff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <BoldCheck size={12} />
      </span>
    )
  }
  if (val === false) {
    return <span style={{ color: 'var(--ink-30, rgba(10,10,15,0.28))', fontSize: '1rem' }}>—</span>
  }
  return <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>{val}</span>
}

export default function ComparisonTable() {
  const colTemplate = '1.6fr 1fr 1fr 1fr'
  const popCol = 2 // 1-indexed value column for Growth

  return (
    <div
      style={{
        borderRadius: 24,
        border: '1px solid var(--line)',
        background: 'var(--white)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: colTemplate,
          alignItems: 'end',
          padding: '26px 28px 22px',
          borderBottom: '1px solid var(--line)',
          background: 'var(--subtle)',
        }}
      >
        <div style={{ ...P_MONO_LABEL }}>Compare plans</div>
        {COL.map((name, i) => (
          <div key={name} style={{ textAlign: 'center', padding: '0 8px', position: 'relative' }}>
            {i + 1 === popCol && (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.58rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'var(--positive)',
                  marginBottom: 6,
                }}
              >
                Most Popular
              </div>
            )}
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.15rem',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--ink)',
              }}
            >
              {name}
            </div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div>
        {CMP_GROUPS.map((g) => (
          <div key={g.group}>
            <div style={{ display: 'grid', gridTemplateColumns: colTemplate, padding: '16px 28px 8px' }}>
              <div style={{ ...P_MONO_LABEL, color: 'var(--ink-40)' }}>{g.group}</div>
            </div>
            {g.rows.map((r, ri) => (
              <div
                key={r.f}
                style={{
                  display: 'grid',
                  gridTemplateColumns: colTemplate,
                  alignItems: 'center',
                  padding: '13px 28px',
                  borderTop:
                    ri === 0
                      ? '1px solid var(--line)'
                      : '1px solid var(--line-soft, rgba(10,10,15,0.05))',
                }}
              >
                <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--ink-80)' }}>{r.f}</div>
                {r.v.map((val, ci) => (
                  <div
                    key={ci}
                    style={{
                      textAlign: 'center',
                      padding: '0 8px',
                      background: ci + 1 === popCol ? 'var(--subtle)' : 'transparent',
                      borderRadius: 8,
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Cell val={val} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        {/* Best for */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: colTemplate,
            padding: '22px 28px 16px',
            borderTop: '1px solid var(--line)',
          }}
        >
          <div style={{ ...P_MONO_LABEL, color: 'var(--ink-40)' }}>Best for</div>
          {CMP_BESTFOR.map((b, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                padding: '0 10px',
                background: i + 1 === popCol ? 'var(--subtle)' : 'transparent',
                borderRadius: 8,
              }}
            >
              <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.45, color: 'var(--ink-60)' }}>{b}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: colTemplate,
            alignItems: 'center',
            padding: '12px 28px 28px',
          }}
        >
          <div />
          {CMP_CTA.map((c, i) => (
            <div key={c.label} style={{ padding: '0 8px', display: 'flex', justifyContent: 'center' }}>
              <Button
                variant={c.variant}
                size="sm"
                className="w-full justify-center"
                trackLocation="pricing_table"
                trackEvent="pricing_click"
                trackPlan={COL[i]}
              >
                {c.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

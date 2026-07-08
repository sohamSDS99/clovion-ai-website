'use client'

import type { CSSProperties } from 'react'

/* ── Feature comparison — source of truth is the pricing content spec.
   16 rows, Growth column highlighted. Purely informational (no CTAs). */

type Cell = string | 'yes' | 'no' | 'dash'

type Row = { label: string; starter: Cell; growth: Cell; enterprise: Cell }

const ROWS: Row[] = [
  { label: 'AI Engine', starter: '1', growth: '3', enterprise: '6' },
  { label: 'Users', starter: '1', growth: '2', enterprise: 'Custom' },
  { label: 'Recommendations', starter: 'Limited', growth: '20 / month', enterprise: 'yes' },
  { label: 'Sentiment', starter: 'yes', growth: 'yes', enterprise: 'yes' },
  { label: 'Brand Perception', starter: 'no', growth: 'yes', enterprise: 'yes' },
  { label: 'Competitor Analysis', starter: '5', growth: '10', enterprise: 'Custom' },
  { label: 'Fanout', starter: 'no', growth: 'yes', enterprise: 'yes' },
  { label: 'Region', starter: '1', growth: '1', enterprise: 'Custom' },
  { label: 'Brand Audit', starter: 'Limited', growth: 'yes', enterprise: 'yes' },
  { label: 'Prompt Tracking / Engine', starter: '50', growth: '50', enterprise: 'Custom' },
  { label: 'Ask Clove', starter: '2 questions', growth: '10 questions', enterprise: 'Custom' },
  { label: 'Citation', starter: 'yes', growth: 'yes', enterprise: 'yes' },
  { label: 'Brands', starter: '1', growth: '2', enterprise: 'Custom' },
  { label: 'Google Analytics', starter: 'yes', growth: 'yes', enterprise: 'yes' },
  { label: 'AI Agents', starter: 'no', growth: 'no', enterprise: 'yes' },
  { label: 'Integrations', starter: 'no', growth: 'yes', enterprise: 'yes' },
]

const TH: CSSProperties = {
  textAlign: 'center',
  padding: '18px 12px',
  borderBottom: '1px solid var(--line-2, rgba(10,10,15,0.14))',
  verticalAlign: 'bottom',
}

const TD: CSSProperties = {
  padding: '15px 12px',
  textAlign: 'center',
  borderBottom: '1px solid var(--line)',
  color: 'var(--ink-70)',
}

function Yes() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" role="img" aria-label="Included" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M20 6 9 17l-5-5" stroke="var(--positive)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Dash() {
  return (
    <span role="img" aria-label="Not included" style={{ color: 'var(--line-2, rgba(10,10,15,0.28))' }}>
      <span aria-hidden="true">—</span>
    </span>
  )
}

function No() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" role="img" aria-label="Not included" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M6 6l12 12M18 6L6 18" stroke="var(--ink-40, rgba(10,10,15,0.4))" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  )
}

function renderCell(v: Cell) {
  if (v === 'yes') return <Yes />
  if (v === 'no') return <No />
  if (v === 'dash') return <Dash />
  return v
}

const FEAT_CELL: CSSProperties = { background: 'var(--positive-bg)' }

export default function ComparisonTable() {
  return (
    <div className="-mx-4 overflow-x-auto md:mx-0 md:overflow-visible">
      <div className="min-w-[640px] px-4 md:min-w-0 md:px-0">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr>
              <th scope="col" style={{ ...TH, textAlign: 'left' }} />
              <th scope="col" style={TH}>
                <div style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--ink)' }}>Starter</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ink-60)', marginTop: 3 }}>
                  <b style={{ color: 'var(--ink)', fontWeight: 600 }}>$119</b>/mo
                </div>
              </th>
              <th scope="col" style={{ ...TH, color: 'var(--positive)' }}>
                <div style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--positive)' }}>Growth</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ink-60)', marginTop: 3 }}>
                  <b style={{ color: 'var(--ink)', fontWeight: 600 }}>$319</b>/mo
                </div>
              </th>
              <th scope="col" style={TH}>
                <div style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--ink)' }}>Enterprise</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--ink-60)', marginTop: 3 }}>Custom</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr key={r.label}>
                <th scope="row" style={{ ...TD, textAlign: 'left', color: 'var(--ink)', fontWeight: 500 }}>{r.label}</th>
                <td style={TD}>{renderCell(r.starter)}</td>
                <td style={{ ...TD, ...FEAT_CELL }}>{renderCell(r.growth)}</td>
                <td style={TD}>{renderCell(r.enterprise)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

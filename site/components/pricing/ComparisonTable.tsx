'use client'

import type { CSSProperties } from 'react'

/* ── Feature comparison — source of truth is the pricing content spec.
   16 rows, Growth column highlighted. Purely informational (no CTAs). */

type Cell = string | 'yes' | 'dash'

type Row = { label: string; starter: Cell; growth: Cell; enterprise: Cell }

const ROWS: Row[] = [
  { label: 'AI engines tracked', starter: '1', growth: '3', enterprise: '6' },
  { label: 'Prompts tracked', starter: '50', growth: '150 / brand', enterprise: 'Unlimited' },
  { label: 'Brands', starter: '1', growth: '2', enterprise: 'Unlimited' },
  { label: 'Recommendations', starter: 'dash', growth: '20 / month', enterprise: 'Unlimited' },
  { label: 'Sentiment analysis', starter: 'yes', growth: 'yes', enterprise: 'yes' },
  { label: 'Brand perception', starter: 'dash', growth: 'yes', enterprise: 'yes' },
  { label: 'Competitor analysis', starter: '5 competitors', growth: 'yes', enterprise: 'yes' },
  { label: 'Fanout query analysis', starter: 'dash', growth: 'yes', enterprise: 'yes' },
  { label: 'Region-level tracking', starter: 'dash', growth: 'dash', enterprise: 'yes' },
  { label: 'Brand audit', starter: 'Limited', growth: 'yes', enterprise: 'yes' },
  { label: 'Citation tracking', starter: 'yes', growth: 'yes', enterprise: 'yes' },
  { label: 'Ask Clove', starter: 'dash', growth: '10 questions', enterprise: 'Unlimited' },
  { label: 'Google Analytics', starter: 'yes', growth: 'yes', enterprise: 'yes' },
  { label: 'AI Agents', starter: 'dash', growth: 'dash', enterprise: 'yes' },
  { label: 'Integrations', starter: 'dash', growth: 'yes', enterprise: 'yes' },
  { label: 'Tracking frequency', starter: 'Daily', growth: 'Daily', enterprise: 'Daily' },
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

function renderCell(v: Cell) {
  if (v === 'yes') return <Yes />
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

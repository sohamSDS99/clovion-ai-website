'use client'

import { useState } from 'react'

/**
 * DeepDive — "Detailed feature breakdown" as a feature EXPLORER (not an
 * accordion). A topic rail selects one of the eight breakdown points; the
 * selected point's Clovion vs Peec AI comparison is always shown on the right.
 *
 * Why an explorer: the eight points carry a lot of verbatim copy. Showing them
 * all at once reads as a wall of text; hiding them behind a collapsed accordion
 * means nothing is visible by default. The explorer keeps one topic always open
 * (defaults to the first) while only ever showing a single point's text — calm,
 * premium, scannable. Mirrors the site's PillarStepper pattern.
 *
 * Dark-theme rules (Clovion brandbook): colours via var(--*) tokens only so they
 * flip under .clv-dark. Never put var(--*) inside a transition shorthand — inline
 * the literal cubic-bezier instead.
 */

export type DeepDiveItem = {
  n: string
  title: string
  intro?: string
  clovion: string[]
  peec: string[]
}

function SideBlock({
  label,
  paragraphs,
  emphasized
}: {
  label: string
  paragraphs: string[]
  emphasized?: boolean
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: '1px solid var(--line)',
        background: emphasized ? 'var(--subtle)' : 'var(--white)',
        padding: '22px 24px'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: emphasized ? 'var(--ink)' : 'var(--ink-50)',
          marginBottom: 14
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: emphasized ? 'var(--ink)' : 'var(--ink-25)'
          }}
        />
        {label}
      </div>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            margin: i === 0 ? 0 : '12px 0 0',
            fontSize: '0.95rem',
            lineHeight: 1.62,
            color: 'var(--ink-70)'
          }}
        >
          {p}
        </p>
      ))}
    </div>
  )
}

export function DeepDive({ items }: { items: DeepDiveItem[] }) {
  const [active, setActive] = useState(0)
  const item = items[active]
  const single = item.peec.length === 0

  return (
    <div>
      <style>{`
        .fx-explorer { display: grid; grid-template-columns: 1fr; gap: 28px; }
        @media (min-width: 1024px) {
          .fx-explorer { grid-template-columns: minmax(240px, 0.42fr) 1fr; gap: 48px; align-items: start; }
        }
        .fx-rail { display: flex; flex-direction: row; gap: 8px; overflow-x: auto; padding-bottom: 6px; scrollbar-width: none; }
        .fx-rail::-webkit-scrollbar { display: none; }
        .fx-item { flex: 0 0 auto; }
        @media (min-width: 1024px) {
          .fx-rail { flex-direction: column; overflow: visible; padding-bottom: 0; gap: 6px; }
          .fx-item { width: 100%; }
        }
        .fx-title { display: none; }
        @media (min-width: 1024px) { .fx-title { display: block; } }
        .fx-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 768px) { .fx-grid { grid-template-columns: 1fr 1fr; gap: 16px; } }
        .fx-grid[data-single="true"] { grid-template-columns: 1fr; }
        @keyframes fxfade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .fx-panel { animation: fxfade .38s cubic-bezier(0.16, 1, 0.3, 1); }
        @media (prefers-reduced-motion: reduce) { .fx-panel { animation: none; } }
      `}</style>

      <div className="fx-explorer">
        {/* Topic rail */}
        <div className="fx-rail" role="tablist" aria-label="Feature breakdown topics">
          {items.map((it, i) => {
            const on = i === active
            return (
              <button
                key={it.n}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className="fx-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: on ? 'var(--line)' : 'transparent',
                  background: on ? 'var(--white)' : 'transparent',
                  boxShadow: on ? 'var(--shadow-soft)' : 'none',
                  borderRadius: 14,
                  padding: '14px 16px',
                  whiteSpace: 'nowrap',
                  transition:
                    'background .2s cubic-bezier(0.16, 1, 0.3, 1), border-color .2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    letterSpacing: '0.04em',
                    color: on ? 'var(--ink)' : 'var(--ink-40)'
                  }}
                >
                  {it.n}
                </span>
                <span
                  className="fx-title"
                  style={{
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                    color: on ? 'var(--ink)' : 'var(--ink-60)'
                  }}
                >
                  {it.title}
                </span>
              </button>
            )
          })}
        </div>

        {/* Active topic panel */}
        <div className="fx-panel" key={active} role="tabpanel">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: item.intro ? 18 : 22 }}>
            <span
              aria-hidden
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                lineHeight: 1,
                color: 'rgb(var(--ink-rgb) / 12%)'
              }}
            >
              {item.n}
            </span>
            <h3
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: 'var(--ink)'
              }}
            >
              {item.title}
            </h3>
          </div>

          {item.intro && (
            <p
              style={{
                margin: '0 0 20px',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'var(--ink)',
                maxWidth: 760
              }}
            >
              {item.intro}
            </p>
          )}

          <div className="fx-grid" data-single={single ? 'true' : 'false'}>
            <SideBlock label="Clovion AI" paragraphs={item.clovion} emphasized />
            {!single && <SideBlock label="Peec AI" paragraphs={item.peec} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeepDive

'use client'

import { useState } from 'react'

/**
 * DeepDive — "Detailed feature breakdown" as a feature EXPLORER (not an
 * accordion). A topic rail selects one of the eight breakdown points; the
 * selected point's Clovion vs Peec AI comparison is always shown on the right.
 *
 * One topic is always open (defaults to the first) and only that point's text
 * is on screen at a time — calm, premium, scannable. Mirrors the site's
 * PillarStepper pattern.
 *
 * Layout uses Tailwind utility classes (no runtime <style> tag): a
 * client-injected <style> element hydrates its CSS text inconsistently and
 * trips React hydration error #425, so all responsive rules live in classes.
 *
 * Dark-theme rules (Clovion brandbook): colours via var(--*) tokens only so
 * they flip under .clv-dark.
 */

// Clove orange accent — mirrors the page palette. Marks the active topic and
// the Clovion side of each breakdown; Peec stays neutral ink.
const BRAND = '#C2410C'
const BRAND_TINT = '#FBEEE7'
const BRAND_BORDER = 'rgba(194,65,12,0.22)'

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
        border: emphasized ? `1px solid ${BRAND_BORDER}` : '1px solid var(--line)',
        background: emphasized ? BRAND_TINT : 'var(--white)',
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
          color: emphasized ? BRAND : 'var(--ink-50)',
          marginBottom: 14
        }}
      >
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: emphasized ? BRAND : 'var(--ink-25)'
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
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(240px,0.42fr)_1fr] lg:items-start lg:gap-12">
      {/* Topic rail — horizontal scroll on mobile, vertical list on desktop */}
      <div
        role="tablist"
        aria-label="Feature breakdown topics"
        className="flex flex-row gap-2 overflow-x-auto pb-1.5 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:pb-0"
        style={{ scrollbarWidth: 'none' }}
      >
        {items.map((it, i) => {
          const on = i === active
          return (
            <button
              key={it.n}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              className="flex shrink-0 items-center gap-3 rounded-[14px] px-4 py-3.5 text-left lg:w-full"
              style={{
                cursor: 'pointer',
                border: '1px solid',
                borderColor: on ? 'var(--line)' : 'transparent',
                background: on ? 'var(--white)' : 'transparent',
                boxShadow: on ? 'var(--shadow-soft)' : 'none',
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
                  color: on ? BRAND : 'var(--ink-40)'
                }}
              >
                {it.n}
              </span>
              <span
                className="hidden lg:block"
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
      <div role="tabpanel">
        <div
          style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: item.intro ? 18 : 22 }}
        >
          <span
            aria-hidden
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
              lineHeight: 1,
              color: 'rgba(194,65,12,0.24)'
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

        <div
          className={
            single
              ? 'grid grid-cols-1 gap-3.5'
              : 'grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-4'
          }
        >
          <SideBlock label="Clovion AI" paragraphs={item.clovion} emphasized />
          {!single && <SideBlock label="Peec AI" paragraphs={item.peec} />}
        </div>
      </div>
    </div>
  )
}

export default DeepDive

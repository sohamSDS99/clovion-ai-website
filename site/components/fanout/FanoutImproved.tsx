'use client';

import { FanoutWindow, F_MONO_LABEL, useFanoutReveal } from './FanoutUtilities';

const DONE_ITEMS = [
  'Page for ChatGPT rank tracking',
  'Perplexity citation tracking guide',
  'GEO recommendations hub',
  'Competitor comparison + AI crawlability',
];

const METRICS: Array<{ v: string; l: string }> = [
  { v: '4/5', l: 'Coverage' },
  { v: '+22', l: 'Citations' },
  { v: '↑', l: 'Visibility' },
];

export default function FanoutImproved() {
  const [ref, on] = useFanoutReveal();
  return (
    <div ref={ref}>
      <FanoutWindow label="Fanout / improvement plan">
        <div style={{ padding: 22 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={F_MONO_LABEL}>Outcome to monitor</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'var(--positive-bg)',
                color: 'var(--positive)',
                border: '1px solid var(--positive-border)',
                borderRadius: 999,
                padding: '0.3rem 0.7rem',
              }}
            >
              IMPROVED
            </span>
          </div>
          <div
            style={{
              marginTop: 14,
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
            }}
          >
            {METRICS.map((m, i) => (
              <div
                key={m.l}
                style={{
                  padding: '0 14px',
                  borderRight: i < 2 ? '1px solid var(--line)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--positive)',
                  }}
                >
                  {m.v}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: '0.72rem',
                    color: 'var(--ink-60)',
                  }}
                >
                  {m.l}
                </div>
              </div>
            ))}
          </div>
          <ul
            style={{
              listStyle: 'none',
              margin: '18px 0 0',
              padding: 0,
              display: 'grid',
              gap: 8,
            }}
          >
            {DONE_ITEMS.map((d, i) => (
              <li
                key={d}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateX(8px)',
                  transition: `all .45s ease ${i * 80}ms`,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    height: 20,
                    width: 20,
                    borderRadius: 999,
                    background: 'var(--ink-surface)',
                    color: 'var(--on-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width={11}
                    height={11}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--ink-80)',
                  }}
                >
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </FanoutWindow>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import GeoWindow from './GeoWindow';

const MONO_LABEL = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: 'var(--ink-50)'
};

function useGeoReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [on, setOn] = useState(reduce ? true : false);
  useEffect(() => {
    if (reduce) return;
    let r2: number | null = null;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setOn(true));
    });
    const t = setTimeout(() => setOn(true), 120);
    return () => {
      cancelAnimationFrame(r1);
      if (r2) cancelAnimationFrame(r2);
      clearTimeout(t);
    };
  }, [reduce]);
  return [ref, on] as const;
}

export default function ResolvedPanel() {
  const [ref, on] = useGeoReveal();
  const done = [
    'Answer-first opening added',
    'FAQPage schema applied',
    'Headings restructured',
    'Internal links strengthened'
  ];
  return (
    <div ref={ref}>
      <GeoWindow label="Page status / resolved">
        <div style={{ padding: 24 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <div>
              <div style={MONO_LABEL}>Visibility after fix</div>
              <div
                style={{
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 10
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.25rem',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums'
                  }}
                >
                  82
                </span>
                <span style={{ marginBottom: 3 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '3px 8px',
                      borderRadius: 999,
                      background: 'var(--positive-bg)',
                      border: '1px solid var(--positive-border)',
                      color: 'var(--positive)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    ↑ 23 pts
                  </span>
                </span>
              </div>
            </div>
            <span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: 'var(--ink-surface)',
                  color: 'var(--on-ink)',
                  fontSize: '0.66rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.08em'
                }}
              >
                RESOLVED
              </span>
            </span>
          </div>
          <ul
            style={{
              listStyle: 'none',
              margin: '22px 0 0',
              padding: 0,
              display: 'grid',
              gap: 10
            }}
          >
            {done.map((d, i) => (
              <li
                key={d}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 12,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateX(8px)',
                  transition: `all .45s ease ${i * 80}ms`
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
                    justifyContent: 'center'
                  }}
                >
                  <svg width={11} height={11} viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3.5 8.5l3 3 6-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--ink-80)' }}>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </GeoWindow>
    </div>
  );
}

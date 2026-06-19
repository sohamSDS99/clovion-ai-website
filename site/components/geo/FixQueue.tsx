'use client';

import { useEffect, useRef, useState } from 'react';
import GeoWindow from './GeoWindow';

const QUEUE = [
  { rule: 'Add answer-first summary', cat: 'Structure', sev: 'HIGH', lift: '+12%' },
  { rule: 'Missing FAQPage JSON-LD', cat: 'Schema', sev: 'HIGH', lift: '+9%' },
  { rule: 'Weak author credentials', cat: 'Authority', sev: 'MED', lift: '+7%' },
  { rule: 'No llms.txt file', cat: 'Technical', sev: 'MED', lift: '+6%' },
  { rule: 'Thin internal linking', cat: 'Authority', sev: 'MED', lift: '+5%' },
  { rule: 'Intro paragraph too long', cat: 'Structure', sev: 'LOW', lift: '+3%' },
];

const MONO_LABEL = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: 'var(--ink-50)',
};

/* Mount-triggered reveal — visible by default, briefly hidden then flipped on
   so the CSS transition plays. Mirrors TrackingMocks.useReveal. */
function useGeoReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [on, setOn] = useState<boolean>(reduce ? true : false);
  useEffect(() => {
    if (reduce) return;
    let r2 = 0;
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

export default function FixQueue() {
  const [ref, on] = useGeoReveal();
  return (
    <div ref={ref}>
      <GeoWindow label="Clovion AI / GEO / Fix Queue">
        <div style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={MONO_LABEL}>25 fixes · sorted by impact</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--ink-50)',
              }}
            >
              <span
                style={{
                  height: 6,
                  width: 6,
                  borderRadius: 999,
                  background: 'var(--positive)',
                }}
              />
              Re-scanned 2h ago
            </span>
          </div>
          <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
            {QUEUE.map((q, i) => (
              <div
                key={q.rule}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr auto auto',
                  alignItems: 'center',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 12,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateY(8px)',
                  transition: `all .5s ease ${i * 80}ms`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--ink-40)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--ink)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {q.rule}
                  </div>
                  <div
                    style={{
                      marginTop: 3,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.66rem',
                      letterSpacing: '0.06em',
                      color: 'var(--ink-50)',
                    }}
                  >
                    {q.cat}
                  </div>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.08em',
                      color: q.sev === 'HIGH' ? 'var(--bg)' : 'var(--ink-70)',
                      background: q.sev === 'HIGH' ? 'var(--ink)' : 'var(--ink-07)',
                      borderRadius: 999,
                      padding: '0.15rem 0.5rem',
                    }}
                  >
                    {q.sev}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--positive)',
                      fontVariantNumeric: 'tabular-nums',
                      minWidth: 38,
                      textAlign: 'right',
                    }}
                  >
                    {q.lift}
                  </span>
                </span>
                <button
                  style={{
                    height: 30,
                    padding: '0 14px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-body)',
                    borderRadius: 999,
                    background: 'var(--ink-surface, var(--ink))',
                    color: 'var(--on-ink)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Fix
                </button>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: '1px solid var(--line)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
            }}
          >
            {[
              { v: '25', l: 'AI-readiness rules' },
              { v: '4', l: 'Fix categories' },
              { v: '1-click', l: 'Auto-patches' },
            ].map((s, i) => (
              <div
                key={s.l}
                style={{
                  padding: '0 16px',
                  borderRight: i < 2 ? '1px solid var(--line)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.v}
                </div>
                <div style={{ marginTop: 4, fontSize: '0.74rem', color: 'var(--ink-60)' }}>
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </GeoWindow>
    </div>
  );
}

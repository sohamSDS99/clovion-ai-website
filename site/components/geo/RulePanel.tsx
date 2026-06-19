'use client';

import { useState, useEffect, useRef } from 'react';
import GeoWindow from './GeoWindow';

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

export default function RulePanel() {
  const [ref, on] = useGeoReveal();
  const lines = [
    { k: 'RULE', v: 'faq-schema-conditional' },
    { k: 'CATEGORY', v: 'Schema · weight 0.8' },
    { k: 'STATUS', v: 'FAIL', fail: true }
  ];
  return (
    <div ref={ref}>
      <GeoWindow label="Rule engine / page audit" dark>
        <div style={{ padding: 24, fontFamily: 'var(--font-mono)' }}>
          <div style={{ display: 'grid', gap: 12 }}>
            {lines.map((l, i) => (
              <div
                key={l.k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateX(8px)',
                  transition: `all .45s ease ${i * 90}ms`
                }}
              >
                <span
                  style={{
                    width: 88,
                    fontSize: '0.64rem',
                    letterSpacing: '0.12em',
                    color: 'var(--on-ink-50)'
                  }}
                >
                  {l.k}
                </span>
                <span
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: l.fail ? 'var(--on-ink)' : 'var(--on-ink-70)'
                  }}
                >
                  {l.fail && (
                    <span
                      style={{
                        display: 'inline-block',
                        height: 7,
                        width: 7,
                        borderRadius: 999,
                        background: '#fda4af',
                        marginRight: 8,
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                  {l.v}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              padding: 16,
              borderRadius: 12,
              background: 'var(--on-ink-05)',
              border: '1px solid var(--on-ink-15)',
              opacity: on ? 1 : 0,
              transition: 'opacity .5s ease .3s'
            }}
          >
            <div
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.12em',
                color: 'var(--on-ink-50)'
              }}
            >
              FINDING
            </div>
            <p
              style={{
                margin: '8px 0 0',
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                color: 'var(--on-ink-70)'
              }}
            >
              FAQ section detected but no{' '}
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--on-ink)' }}>
                FAQPage
              </span>{' '}
              JSON-LD found. The page has no answer-first summary.
            </p>
          </div>
        </div>
      </GeoWindow>
    </div>
  );
}

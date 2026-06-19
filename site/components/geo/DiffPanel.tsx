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

export default function DiffPanel() {
  const [ref, on] = useGeoReveal();
  const diff = [
    { t: '  <article>', type: 'ctx' },
    { t: '+   <p class="answer">Clovion turns AI', type: 'add' },
    { t: '+   visibility gaps into prioritized fixes.</p>', type: 'add' },
    { t: '+   <script type="application/ld+json">', type: 'add' },
    { t: '+     { "@type": "FAQPage", ... }', type: 'add' },
    { t: '+   </script>', type: 'add' },
    { t: '  </article>', type: 'ctx' }
  ];
  return (
    <div ref={ref}>
      <GeoWindow label="Suggested fix / diff">
        <div style={{ padding: 20 }}>
          <div
            style={{
              borderRadius: 12,
              border: '1px solid var(--line)',
              overflow: 'hidden',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              lineHeight: 1.7
            }}
          >
            {diff.map((d, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0,
                  padding: '1px 12px',
                  background: d.type === 'add' ? 'var(--positive-bg)' : 'transparent',
                  color: d.type === 'add' ? 'var(--positive)' : 'var(--ink-60)',
                  opacity: on ? 1 : 0,
                  transition: `opacity .4s ease ${i * 60}ms`,
                  whiteSpace: 'pre'
                }}
              >
                {d.t}
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              background: 'var(--subtle)',
              border: '1px solid var(--line)'
            }}
          >
            <div style={MONO_LABEL}>Rationale</div>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: '0.9rem',
                lineHeight: 1.55,
                color: 'var(--ink-80)'
              }}
            >
              AI engines pull direct answers from the top of a page and read FAQ schema to grasp
              intent — so this edit makes the page far easier to quote and cite in generated
              answers.
            </p>
          </div>
        </div>
      </GeoWindow>
    </div>
  );
}

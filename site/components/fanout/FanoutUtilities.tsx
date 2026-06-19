'use client';

import { useState, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode, MutableRefObject } from 'react';

export const F_ENGINES = ['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Grok', 'AI Overviews'] as const;

export const F_ENGINE_LOGO: Record<string, string> = {
  ChatGPT: '/logos/chatgpt.svg',
  Claude: '/logos/claude.svg',
  Gemini: '/logos/gemini.svg',
  Perplexity: '/logos/perplexity.svg',
  Grok: '/logos/grok-icon.svg',
  'AI Overviews': '/logos/google-ai.svg',
};

export const F_MONO_LABEL: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--ink-50)',
};

/* Mount-triggered reveal — visible by default, briefly hidden then flipped on,
   so a visual is never stuck invisible (no IntersectionObserver gate). */
export function useFanoutReveal(): [MutableRefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [on, setOn] = useState<boolean>(reduce ? true : false);

  useEffect(() => {
    if (reduce) return;
    let raf2: number | null = null;
    const r1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setOn(true));
    });
    const t = setTimeout(() => setOn(true), 120);
    return () => {
      cancelAnimationFrame(r1);
      if (raf2 != null) cancelAnimationFrame(raf2);
      clearTimeout(t);
    };
  }, [reduce]);

  return [ref, on];
}

export function FanoutWindow({
  label,
  children,
  dark,
}: {
  label: string;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: '1px solid var(--line)',
        background: dark ? 'var(--ink-surface, var(--ink))' : 'var(--white)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 44,
          borderBottom: `1px solid ${dark ? 'var(--on-ink-15)' : 'var(--line)'}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#fecdd3' }} />
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#fde68a' }} />
          <span style={{ height: 10, width: 10, borderRadius: 999, background: '#a7f3d0' }} />
        </div>
        <div
          style={{
            flex: 1,
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: dark ? 'var(--on-ink-50)' : 'var(--ink-50)',
          }}
        >
          {label}
        </div>
        <div style={{ width: 24 }} />
      </div>
      {children}
    </div>
  );
}

/* Per-prompt engine status dots. status: 'hit' (mentioned) | 'comp' (competitor only) | 'miss' (absent) */
export function FanoutEngineDots({ statuses }: { statuses: Array<'hit' | 'comp' | 'miss'> }) {
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {F_ENGINES.map((e, i) => {
        const s = statuses[i];
        const bg =
          s === 'hit'
            ? 'var(--positive)'
            : s === 'comp'
            ? 'var(--ink-25, rgba(10,10,15,0.25))'
            : 'transparent';
        const border = s === 'miss' ? '1.5px solid var(--ink-20, rgba(10,10,15,0.18))' : 'none';
        return (
          <span
            key={e}
            title={e}
            style={{
              height: 9,
              width: 9,
              borderRadius: 999,
              background: bg,
              border,
              boxSizing: 'border-box',
            }}
          />
        );
      })}
    </div>
  );
}

/* Branch connector — the elbow line that ties each fanout variation back to
   the seed, so the "one query becomes many" idea reads visually. */
export function Branch({ last }: { last?: boolean }) {
  return (
    <span
      aria-hidden
      style={{ position: 'relative', flexShrink: 0, width: 22, alignSelf: 'stretch' }}
    >
      <span
        style={{
          position: 'absolute',
          left: 10,
          top: 0,
          bottom: last ? '50%' : 0,
          width: 1.5,
          background: 'var(--line)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: 10,
          top: '50%',
          width: 11,
          height: 1.5,
          background: 'var(--line)',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: 20,
          top: 'calc(50% - 2.5px)',
          width: 5,
          height: 5,
          borderRadius: 999,
          background: 'var(--ink-30, rgba(10,10,15,0.28))',
        }}
      />
    </span>
  );
}

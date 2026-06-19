'use client';

import { useState, useEffect, useRef } from 'react';
import type { CSSProperties, ReactNode, MutableRefObject } from 'react';

export const C_BOT_LOGO: Record<string, string> = {
  OpenAI: '/logos/chatgpt.svg',
  Anthropic: '/logos/claude.svg',
  Google: '/logos/google-ai.svg',
  Perplexity: '/logos/perplexity.svg',
};

export const C_MONO_LABEL: CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'var(--ink-50)',
};

/* Mount-triggered reveal — visible by default, briefly hidden then flipped on,
   so a visual is never stuck invisible (no IntersectionObserver gate). */
export function useCrawlReveal(): [MutableRefObject<HTMLDivElement | null>, boolean] {
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

export function CrawlWindow({
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

/* Small status pill: allow / block / warn. */
export function AccessPill({
  kind,
  dark,
}: {
  kind: 'allow' | 'block' | 'warn';
  dark?: boolean;
}) {
  const map: Record<'allow' | 'block' | 'warn', { fg: string; bg: string; t: string }> = {
    allow: { fg: 'var(--positive)', bg: 'var(--positive-bg)', t: 'Allow' },
    block: {
      fg: dark ? '#fda4af' : '#be123c',
      bg: dark ? 'rgba(253,164,175,0.12)' : 'rgba(190,18,60,0.08)',
      t: 'Block',
    },
    warn: {
      fg: dark ? 'var(--on-ink-70)' : 'var(--ink-70)',
      bg: dark ? 'var(--on-ink-10)' : 'var(--ink-07)',
      t: 'Review',
    },
  };
  const m = map[kind];
  return (
    <span
      style={{
        flexShrink: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        letterSpacing: '0.06em',
        fontWeight: 600,
        textTransform: 'uppercase',
        color: m.fg,
        background: m.bg,
        borderRadius: 999,
        padding: '0.2rem 0.6rem',
      }}
    >
      {m.t}
    </span>
  );
}

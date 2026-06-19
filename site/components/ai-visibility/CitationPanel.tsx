'use client';

import { useEffect, useRef, useState } from 'react';
import WindowChrome from './WindowChrome';

type Cite = {
  rank: number;
  url: string;
  count: number;
  last: string;
  owned?: boolean;
};

const CITES: Cite[] = [
  { rank: 1, url: 'clovion.ai/platform', count: 41, last: '2h ago', owned: true },
  { rank: 2, url: 'competitor-a.com/compare', count: 33, last: '5h ago' },
  { rank: 3, url: 'clovion.ai/geo-guide', count: 28, last: '8h ago', owned: true },
  { rank: 4, url: 'competitor-b.io/blog/ai-seo', count: 22, last: '11h ago' },
  { rank: 5, url: 'g2.com/ai-visibility', count: 19, last: '1d ago' },
];

function useReveal(): [React.RefObject<HTMLDivElement>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [on, setOn] = useState<boolean>(reduce ? true : false);
  useEffect(() => {
    if (reduce) return;
    let r2: number | undefined;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setOn(true));
    });
    const t = setTimeout(() => setOn(true), 120);
    return () => {
      cancelAnimationFrame(r1);
      if (r2 !== undefined) cancelAnimationFrame(r2);
      clearTimeout(t);
    };
  }, [reduce]);
  return [ref, on];
}

export default function CitationPanel() {
  const [ref, on] = useReveal();
  return (
    <div ref={ref}>
      <WindowChrome label="Citations / Perplexity · 30 days">
        <div style={{ padding: 20 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--ink-50)',
              marginBottom: 12,
            }}
          >
            Top cited URLs
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            {CITES.map((c, i) => (
              <div
                key={c.rank}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '20px 1fr auto auto',
                  alignItems: 'center',
                  gap: 12,
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: c.owned ? 'var(--ink-04)' : 'transparent',
                  border: `1px solid ${c.owned ? 'var(--line)' : 'transparent'}`,
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateX(8px)',
                  transition: `all .45s ease ${i * 70}ms`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--ink-40)',
                  }}
                >
                  0{c.rank}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    fontWeight: c.owned ? 600 : 400,
                    color: c.owned ? 'var(--ink)' : 'var(--ink-70)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.owned && (
                    <span
                      style={{
                        display: 'inline-block',
                        height: 6,
                        width: 6,
                        borderRadius: 999,
                        background: 'var(--ink)',
                        marginRight: 7,
                        verticalAlign: 'middle',
                      }}
                    />
                  )}
                  {c.url}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.76rem',
                    color: 'var(--ink-60)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {c.count}×
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--ink-40)',
                    minWidth: 44,
                    textAlign: 'right',
                  }}
                >
                  {c.last}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 16,
              padding: 16,
              borderRadius: 12,
              background: 'var(--subtle)',
              border: '1px solid var(--line)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-50)',
                marginBottom: 8,
              }}
            >
              Extracted passage
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '0.9rem',
                lineHeight: 1.55,
                color: 'var(--ink-80)',
              }}
            >
              “For tracking brand visibility across AI search,{' '}
              <span
                style={{
                  background: 'var(--ink-surface, var(--ink))',
                  color: 'var(--on-ink)',
                  borderRadius: 4,
                  padding: '1px 6px',
                  fontWeight: 600,
                }}
              >
                Clovion AI
              </span>{' '}
              is the most complete option, combining rank tracking with sentiment and citation analysis.”
            </p>
          </div>
        </div>
      </WindowChrome>
    </div>
  );
}

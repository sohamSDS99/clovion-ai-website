'use client';

import { useState, useEffect, useRef } from 'react';
import WindowChrome from './WindowChrome';

/* ── SENTIMENT CHART — 18-week trend ───────────────────────────── */
/* Each week: [positive, neutral, negative] shares (sum 100). Climbing positive. */
const SENT = (() => {
  const out: { pos: number; neu: number; neg: number }[] = [];
  for (let i = 0; i < 18; i++) {
    const t = i / 17;
    const pos = Math.round(38 + t * 40 + (i % 3 === 0 ? 2 : 0));
    const neg = Math.round(26 - t * 16 + (i % 4 === 0 ? 1 : 0));
    const neu = 100 - pos - neg;
    out.push({ pos, neu, neg });
  }
  return out;
})();

/* Reusable mount-triggered reveal. Content is visible by default (on=true);
   we briefly start hidden only when motion is allowed, then flip on the next
   frame so the CSS transition plays. Never leaves content stuck hidden. */
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
      if (r2) cancelAnimationFrame(r2);
      clearTimeout(t);
    };
  }, [reduce]);
  return [ref, on];
}

export default function SentimentChart() {
  const [ref, on] = useReveal();
  return (
    <div ref={ref}>
      <WindowChrome label="Sentiment / brand · 18 weeks">
        <div style={{ padding: 24 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'var(--ink-50)',
                }}
              >
                Net sentiment
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.25rem',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  +62
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
                    }}
                  >
                    ↑ 24 pts
                  </span>
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {(
                [
                  ['Positive', 'var(--ink)'],
                  ['Neutral', 'var(--ink-30)'],
                  ['Negative', 'var(--ink-10)'],
                ] as const
              ).map(([l, c]) => (
                <div
                  key={l}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.76rem',
                    color: 'var(--ink-60)',
                  }}
                >
                  <span
                    style={{
                      height: 9,
                      width: 9,
                      borderRadius: 3,
                      background: c,
                      border: l === 'Negative' ? '1px solid var(--line)' : 'none',
                    }}
                  />
                  {l}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 4,
              height: 140,
            }}
          >
            {SENT.map((w, i) => (
              <div
                key={i}
                title={`Week ${i + 1}`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  height: '100%',
                  transform: on ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: 'bottom',
                  transition: `transform .7s var(--ease-out-expo) ${i * 40}ms`,
                }}
              >
                <div
                  style={{
                    height: `${w.pos}%`,
                    background: 'var(--ink)',
                    borderRadius: '3px 3px 0 0',
                  }}
                />
                <div style={{ height: `${w.neu}%`, background: 'var(--ink-30)' }} />
                <div
                  style={{
                    height: `${w.neg}%`,
                    background: 'var(--ink-10)',
                    borderRadius: '0 0 3px 3px',
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 12,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              color: 'var(--ink-40)',
            }}
          >
            <span>Wk 1</span>
            <span>Wk 9</span>
            <span>Wk 18</span>
          </div>
        </div>
      </WindowChrome>
    </div>
  );
}

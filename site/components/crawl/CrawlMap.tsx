'use client';

import { useState, useEffect } from 'react';

const GATES = [
  { label: 'Crawler access', sub: 'robots.txt opened' },
  { label: 'Content readable', sub: 'server-rendered HTML' },
  { label: 'Structured data', sub: 'JSON-LD + llms.txt' },
  { label: 'Cited in answers', sub: 'visible to AI engines' },
];

export default function CrawlMap() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const total = GATES.length;
  const [open, setOpen] = useState(reduce ? total : 0);

  useEffect(() => {
    if (reduce) return;
    let alive = true;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(
        setTimeout(() => {
          if (alive) fn();
        }, ms)
      );
    const run = () => {
      timers.forEach(clearTimeout);
      timers = [];
      setOpen(0);
      GATES.forEach((_, i) => at(650 + i * 720, () => setOpen(i + 1)));
      at(650 + total * 720 + 2400, run);
    };
    const boot = setTimeout(run, 450);
    return () => {
      alive = false;
      clearTimeout(boot);
      timers.forEach(clearTimeout);
    };
  }, [reduce, total]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 400,
        margin: '0 auto',
        borderRadius: 22,
        background: 'var(--on-ink-05)',
        border: '1px solid var(--on-ink-15)',
        boxShadow: '0 24px 60px -30px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          padding: '18px 20px',
          borderBottom: '1px solid var(--on-ink-15)',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.02rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: 'var(--on-ink)',
              whiteSpace: 'nowrap',
            }}
          >
            From blocked to cited
          </div>
          <div
            style={{
              marginTop: 7,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--on-ink-50)',
              whiteSpace: 'nowrap',
            }}
          >
            {open} of {total} gates open
          </div>
        </div>
        <span
          style={{
            flexShrink: 0,
            marginTop: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.66rem',
            color: 'var(--on-ink-50)',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              height: 6,
              width: 6,
              borderRadius: 999,
              background: open >= total ? 'var(--positive)' : 'var(--on-ink-30)',
            }}
          />
          {open >= total ? 'cited' : 'auditing'}
        </span>
      </div>
      <div style={{ padding: 16, display: 'grid', gap: 8 }}>
        {GATES.map((g, i) => {
          const isOpen = i < open;
          return (
            <div
              key={g.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '13px 14px',
                borderRadius: 12,
                background: isOpen ? 'rgba(52,211,153,0.10)' : 'var(--on-ink-05)',
                border: `1px solid ${isOpen ? 'var(--positive-border)' : 'var(--on-ink-15)'}`,
                opacity: isOpen ? 1 : 0.32,
                transform: isOpen ? 'none' : 'translateY(6px)',
                transition:
                  'opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1), background-color .5s ease, border-color .5s ease',
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  height: 22,
                  width: 22,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isOpen ? 'var(--positive)' : 'transparent',
                  border: isOpen ? 'none' : '1.5px solid var(--on-ink-30)',
                  color: '#04261b',
                  transition: 'background-color .4s ease',
                }}
              >
                {isOpen ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--on-ink-50)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="5" y="11" width="14" height="9" rx="1.5" />
                    <path d="M8 11V8a4 4 0 0 1 8 0" />
                  </svg>
                )}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--on-ink)',
                  }}
                >
                  {g.label}
                </span>
                <span
                  style={{
                    display: 'block',
                    marginTop: 2,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.66rem',
                    color: 'var(--on-ink-50)',
                  }}
                >
                  {g.sub}
                </span>
              </span>
              {i < total - 1 && (
                <span
                  aria-hidden
                  style={{
                    flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: isOpen ? 'var(--positive)' : 'var(--on-ink-30)',
                  }}
                >
                  ↓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

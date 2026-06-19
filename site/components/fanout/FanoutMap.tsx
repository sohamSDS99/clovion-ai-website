'use client';

import { useState, useEffect } from 'react';

const MAP_BRANCHES = [
  { q: 'AI visibility platforms', tag: 'You', tone: 'hit' },
  { q: 'Track mentions in ChatGPT', tag: 'Competitor', tone: 'comp' },
  { q: 'Citations in Perplexity', tag: 'Gap', tone: 'miss' },
  { q: 'GEO tools for AI search', tag: 'Competitor', tone: 'comp' },
  { q: 'Visibility software for SaaS', tag: 'You', tone: 'hit' },
];

export default function FanoutMap() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const total = MAP_BRANCHES.length;
  const [shown, setShown] = useState(reduce ? total : 0);

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
      setShown(0);
      MAP_BRANCHES.forEach((_, i) => at(650 + i * 620, () => setShown(i + 1)));
      at(650 + total * 620 + 2600, run);
    };
    const boot = setTimeout(run, 450);
    return () => {
      alive = false;
      clearTimeout(boot);
      timers.forEach(clearTimeout);
    };
  }, [reduce, total]);

  const youShown = MAP_BRANCHES.slice(0, shown).filter((b) => b.tone === 'hit').length;

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
              fontSize: '1.05rem',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: 'var(--on-ink)',
            }}
          >
            One query, fanned out
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
            {shown} of {total} branches mapped
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
              background: 'var(--positive)',
            }}
          />
          {youShown} you
        </span>
      </div>
      {/* seed */}
      <div style={{ padding: '16px 16px 4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 13px',
            borderRadius: 12,
            background: 'var(--on-ink-10)',
            border: '1px solid var(--on-ink-15)',
          }}
        >
          <span
            style={{
              flexShrink: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.56rem',
              letterSpacing: '0.1em',
              fontWeight: 600,
              textTransform: 'uppercase',
              color: 'var(--on-ink-70)',
              background: 'var(--on-ink-15)',
              borderRadius: 999,
              padding: '0.2rem 0.5rem',
            }}
          >
            Seed
          </span>
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'var(--on-ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Best AI visibility tools?
          </span>
        </div>
      </div>
      {/* branches */}
      <div style={{ padding: '4px 16px 16px', display: 'grid', gap: 8 }}>
        {MAP_BRANCHES.map((b, i) => {
          const on = i < shown;
          const tone =
            b.tone === 'hit'
              ? { dot: 'var(--positive)', fg: '#04261b', bg: 'var(--positive)' }
              : b.tone === 'comp'
              ? { dot: 'var(--on-ink-30)', fg: 'var(--on-ink-70)', bg: 'transparent' }
              : { dot: 'transparent', fg: 'var(--on-ink-50)', bg: 'transparent' };
          return (
            <div key={b.q} style={{ display: 'flex', alignItems: 'stretch' }}>
              <span
                aria-hidden
                style={{ position: 'relative', flexShrink: 0, width: 20 }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 9,
                    top: 0,
                    bottom: i === MAP_BRANCHES.length - 1 ? '50%' : 0,
                    width: 1.5,
                    background: 'var(--on-ink-15)',
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    left: 9,
                    top: '50%',
                    width: 10,
                    height: 1.5,
                    background: 'var(--on-ink-15)',
                  }}
                />
              </span>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 11,
                  background: on
                    ? b.tone === 'hit'
                      ? 'rgba(52,211,153,0.10)'
                      : 'var(--on-ink-05)'
                    : 'var(--on-ink-05)',
                  border: `1px solid ${
                    on
                      ? b.tone === 'hit'
                        ? 'var(--positive-border)'
                        : 'var(--on-ink-15)'
                      : 'transparent'
                  }`,
                  opacity: on ? 1 : 0.25,
                  transform: on ? 'none' : 'translateY(6px)',
                  transition:
                    'opacity .5s ease, transform .5s cubic-bezier(.16,1,.3,1), background-color .5s ease, border-color .5s ease',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    height: 7,
                    width: 7,
                    borderRadius: 999,
                    background: tone.dot,
                    border: b.tone === 'miss' ? '1.5px solid var(--on-ink-30)' : 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <span
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: '0.84rem',
                    fontWeight: 500,
                    color: 'var(--on-ink-80)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {b.q}
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 22,
                    padding: '0 9px',
                    borderRadius: 999,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    background: tone.bg,
                    color: tone.fg,
                    border: b.tone === 'hit' ? 'none' : '1px solid var(--on-ink-15)',
                    opacity: on ? 1 : 0,
                    transform: on ? 'scale(1)' : 'scale(0.8)',
                    transition:
                      'opacity .35s ease .12s, transform .35s cubic-bezier(.16,1,.3,1) .12s',
                  }}
                >
                  {b.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

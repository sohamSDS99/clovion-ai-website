'use client';

import { Fragment, useEffect, useState } from 'react';

const A_MONO_LABEL = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.68rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  color: 'var(--ink-50)',
};

type FlowNode = {
  key: string;
  title: string;
  sub: string;
  tone: 'ink' | 'pos';
};

const FLOW_NODES: FlowNode[] = [
  { key: 'share', title: 'Share your link', sub: 'clovion.ai/r/maya-growth', tone: 'ink' },
  { key: 'signup', title: 'Brand signs up', sub: 'Northwind SEO · Growth plan', tone: 'ink' },
  { key: 'earn', title: 'You earn commission', sub: '+$156', tone: 'pos' },
];

function Check({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ReferralFlow() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [active, setActive] = useState<number>(reduce ? 2 : -1);

  useEffect(() => {
    if (reduce) return;
    let alive = true;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(
        setTimeout(() => {
          if (alive) fn();
        }, ms),
      );
    const cycle = () => {
      timers.forEach(clearTimeout);
      timers = [];
      setActive(-1);
      at(500, () => setActive(0));
      at(1500, () => setActive(1));
      at(2700, () => setActive(2));
      at(5200, cycle);
    };
    const boot = setTimeout(cycle, 400);
    return () => {
      alive = false;
      clearTimeout(boot);
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: 24,
        background: 'var(--white)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-card-lg, 0 30px 70px -28px rgba(10,10,15,0.28))',
        overflow: 'hidden',
        padding: '26px 24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 20,
        }}
      >
        <span style={A_MONO_LABEL}>How a referral pays out</span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            fontWeight: 600,
            color: 'var(--positive)',
          }}
        >
          <span
            style={{
              height: 6,
              width: 6,
              borderRadius: 999,
              background: 'var(--positive)',
              animation: reduce ? 'none' : 'clv-pulse 1.2s ease-in-out infinite',
            }}
          />
          live
        </span>
      </div>

      <div style={{ display: 'grid', gap: 0 }}>
        {FLOW_NODES.map((n, i) => {
          const done = active >= i;
          const isEarn = n.tone === 'pos';
          const accent = isEarn ? 'var(--positive)' : 'var(--ink-surface, var(--ink))';
          return (
            <Fragment key={n.key}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 16px',
                  borderRadius: 14,
                  background: done
                    ? isEarn
                      ? 'var(--positive-bg)'
                      : 'var(--subtle)'
                    : 'var(--white)',
                  border: `1px solid ${
                    done ? (isEarn ? 'var(--positive-border)' : 'var(--line)') : 'var(--line)'
                  }`,
                  transition: 'background-color .5s ease, border-color .5s ease',
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    height: 40,
                    width: 40,
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: done ? accent : 'var(--white)',
                    color: done ? 'var(--on-ink)' : 'var(--ink-40)',
                    border: done ? 'none' : '1px solid var(--line)',
                    transition: 'background-color .5s ease, color .5s ease',
                  }}
                >
                  {done && isEarn ? <Check size={16} /> : String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      letterSpacing: '-0.02em',
                      color: 'var(--ink)',
                    }}
                  >
                    {n.title}
                  </div>
                  <div
                    style={{
                      marginTop: 2,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: isEarn && done ? 'var(--positive)' : 'var(--ink-50)',
                      fontWeight: isEarn && done ? 600 : 400,
                    }}
                  >
                    {n.sub}
                  </div>
                </span>
              </div>
              {i < FLOW_NODES.length - 1 && (
                <div
                  style={{
                    height: 26,
                    marginLeft: 36,
                    position: 'relative',
                    width: 2,
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'var(--line)',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      height: active > i ? '100%' : '0%',
                      background: 'var(--positive)',
                      transition: 'height .6s var(--ease-out-expo, cubic-bezier(.16,1,.3,1))',
                    }}
                  />
                </div>
              )}
            </Fragment>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 20,
          paddingTop: 18,
          borderTop: '1px solid var(--line)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <span style={{ fontSize: '0.82rem', color: 'var(--ink-60)' }}>
          Recurring commission, paid every month they stay.
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--positive)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          30%
        </span>
      </div>
    </div>
  );
}

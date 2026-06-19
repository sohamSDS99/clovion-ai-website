'use client';

import { useState, useEffect, useRef } from 'react';

const SCORE_FIXES = [
  {
    label: 'Structure',
    d: (
      <g>
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="15" y2="12" />
        <line x1="4" y1="18" x2="18" y2="18" />
      </g>
    ),
  },
  {
    label: 'Schema',
    d: (
      <g>
        <polyline points="8 8 4 12 8 16" />
        <polyline points="16 8 20 12 16 16" />
        <line x1="13" y1="5" x2="11" y2="19" />
      </g>
    ),
  },
  {
    label: 'Authority',
    d: (
      <g>
        <path d="M12 3l7 3v5c0 4.2-2.9 7.3-7 8.5C7.9 18.3 5 15.2 5 11V6l7-3z" />
        <polyline points="9 11.5 11.2 13.7 15 9.8" />
      </g>
    ),
  },
  {
    label: 'Technical',
    d: (
      <g>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="7" r="2" />
        <circle cx="9" cy="18" r="2" />
        <line x1="7.6" y1="7.4" x2="14" y2="16.6" />
        <line x1="7.7" y1="6.4" x2="16.2" y2="6.7" />
        <line x1="16.5" y1="8.6" x2="10.6" y2="16.4" />
      </g>
    ),
  },
];

const SCORE_STEPS = [52, 64, 75, 85, 94];

function ScoreCheck({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function StellarOrbit() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [applied, setApplied] = useState<number>(reduce ? 4 : 0);
  const [score, setScore] = useState<number>(reduce ? 94 : 52);
  const rafRef = useRef<number>(0);

  /* tween the displayed score toward the target for the current `applied` */
  useEffect(() => {
    if (reduce) return;
    const target = SCORE_STEPS[applied];
    const from = score;
    if (from === target) return;
    const start = performance.now();
    const dur = 850;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      setScore(Math.round(from + (target - from) * ease(t)));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied, reduce]);

  /* loop: apply fixes one by one, hold, reset */
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
      setApplied(0);
      setScore(52);
      at(700, () => setApplied(1));
      at(1700, () => setApplied(2));
      at(2700, () => setApplied(3));
      at(3700, () => setApplied(4));
      at(7200, run);
    };
    const boot = setTimeout(run, 500);
    return () => {
      alive = false;
      clearTimeout(boot);
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  const R = 88;
  const C = 2 * Math.PI * R;
  const offset = C * (1 - score / 100);
  const delta = score - 52;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 26,
      }}
    >
      {/* ring gauge */}
      <div style={{ position: 'relative', width: 232, height: 232 }}>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: '6%',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 50% 45%, rgba(52,211,153,0.20), rgba(52,211,153,0.04) 55%, transparent 72%)',
          }}
        />
        <svg
          width="232"
          height="232"
          viewBox="0 0 232 232"
          style={{ position: 'relative', transform: 'rotate(-90deg)' }}
        >
          <circle
            cx="116"
            cy="116"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth={12}
          />
          <circle
            cx="116"
            cy="116"
            r={R}
            fill="none"
            stroke="var(--positive)"
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={offset}
            style={{
              transition: reduce ? 'none' : 'stroke-dashoffset .25s linear',
              filter: 'drop-shadow(0 0 8px rgba(52,211,153,0.55))',
            }}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3.4rem',
              fontWeight: 600,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: 'var(--on-ink)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {score}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--on-ink-50)',
            }}
          >
            AI Visibility
          </span>
          <span
            style={{
              marginTop: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--positive)',
              opacity: delta > 0 ? 1 : 0,
              transition: 'opacity .4s ease',
            }}
          >
            ↑ {delta} pts
          </span>
        </div>
      </div>

      {/* fix categories checking off */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {SCORE_FIXES.map((f, i) => {
          const on = i < applied;
          return (
            <span
              key={f.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px 8px 10px',
                borderRadius: 999,
                background: on ? 'rgba(52,211,153,0.14)' : 'var(--on-ink-05)',
                border: `1px solid ${on ? 'var(--positive)' : 'var(--on-ink-15)'}`,
                transition: 'background-color .4s ease, border-color .4s ease',
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  height: 22,
                  width: 22,
                  borderRadius: 999,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: on ? 'var(--positive)' : 'transparent',
                  color: on ? '#04261b' : 'var(--on-ink-50)',
                  border: on ? 'none' : '1px solid var(--on-ink-15)',
                  transition: 'all .4s ease',
                }}
              >
                {on ? (
                  <ScoreCheck size={12} />
                ) : (
                  <svg
                    width={13}
                    height={13}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {f.d}
                  </svg>
                )}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  color: on ? 'var(--on-ink)' : 'var(--on-ink-70)',
                }}
              >
                {f.label}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

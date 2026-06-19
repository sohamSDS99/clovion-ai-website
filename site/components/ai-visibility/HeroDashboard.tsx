'use client';

import { useState, useEffect } from 'react';
import WindowChrome from './WindowChrome';

const ENGINE_LOGO: Record<string, string> = {
  ChatGPT: '/logos/chatgpt.svg',
  Claude: '/logos/claude.svg',
  Gemini: '/logos/gemini.svg',
  Perplexity: '/logos/perplexity.svg',
  Grok: '/logos/grok-icon.svg',
  'AI Overviews': '/logos/google-ai.svg',
};

type HeroRow = {
  name: string;
  rank: number;
  conf: number;
  peak?: boolean;
};

const HERO_ROWS: HeroRow[] = [
  { name: 'ChatGPT', rank: 1, conf: 94, peak: true },
  { name: 'Perplexity', rank: 2, conf: 89 },
  { name: 'Claude', rank: 2, conf: 86 },
  { name: 'Gemini', rank: 3, conf: 78 },
  { name: 'AI Overviews', rank: 4, conf: 71 },
  { name: 'Grok', rank: 5, conf: 64 },
];

/* easeOutCubic count-up that replays on every cycle. Uses setInterval +
   wall-clock timing (not rAF, which pauses in backgrounded/headless frames)
   and seeds at the target so it can never render a stuck 0. */
function useCountUp(target: number, play: boolean, cycle: number, duration: number) {
  const [v, setV] = useState<number>(target);
  useEffect(() => {
    if (!play) return;
    const start = Date.now();
    setV(0);
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / (duration || 1100));
      setV(target * (1 - Math.pow(1 - p, 3)));
      if (p >= 1) {
        setV(target);
        clearInterval(id);
      }
    }, 32);
    return () => clearInterval(id);
  }, [play, cycle, target, duration]);
  return v;
}

export default function HeroDashboard() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [cycle, setCycle] = useState(0);
  const [filled, setFilled] = useState<boolean>(reduce);
  const [scanning, setScanning] = useState<boolean>(!reduce);

  useEffect(() => {
    if (reduce) {
      setFilled(true);
      setScanning(false);
      return;
    }
    setScanning(true);
    setFilled(false);
    const t1 = setTimeout(() => {
      setScanning(false);
      setFilled(true);
    }, 760);
    const t2 = setTimeout(() => setCycle((c) => c + 1), 5800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [cycle, reduce]);

  const engines = useCountUp(6, filled, cycle, 900);
  const sov = useCountUp(38.4, filled, cycle, 1250);
  const trend = useCountUp(6.2, filled, cycle, 1250);

  const stats = [
    { v: String(Math.round(engines)), l: 'Engines covered' },
    { v: sov.toFixed(1) + '%', l: 'Share of voice' },
    { v: '+' + trend.toFixed(1), l: '7-day trend', up: true },
  ];

  return (
    <div>
      <WindowChrome label="Clovion AI / Visibility / Rank Tracker">
        <div style={{ padding: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--ink-50)',
              }}
            >
              Tracked prompt
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.64rem',
                color: scanning ? 'var(--ink-50)' : 'var(--positive)',
                transition: 'color .3s ease',
              }}
            >
              <span
                style={{
                  height: 6,
                  width: 6,
                  borderRadius: 999,
                  background: scanning ? 'var(--ink-40)' : 'var(--positive)',
                  animation: scanning ? 'clv-pulse 1s ease-in-out infinite' : 'none',
                }}
              />
              {scanning ? 'Scanning 6 engines…' : 'Updated just now'}
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              borderRadius: 12,
              background: 'var(--subtle)',
              border: '1px solid var(--line)',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                height: 7,
                width: 7,
                borderRadius: 999,
                background: 'var(--ink)',
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Best AI visibility platform</span>
            {scanning && (
              <span
                key={cycle}
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  width: '45%',
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                  animation: 'clv-sweep 0.85s ease-in-out',
                }}
              />
            )}
          </div>

          <div style={{ marginTop: 20, display: 'grid', gap: 6 }}>
            {HERO_ROWS.map((r, i) => (
              <div
                key={r.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '108px 36px 1fr 44px',
                  alignItems: 'center',
                  gap: 12,
                  opacity: filled ? 1 : scanning ? 0.5 : 0,
                  transform: filled ? 'none' : 'translateY(4px)',
                  transition: `opacity .5s ease ${i * 70}ms, transform .5s ease ${i * 70}ms`,
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <img
                    src={ENGINE_LOGO[r.name]}
                    alt={r.name}
                    style={{
                      height: r.name === 'Grok' ? 18 : 13,
                      width: 'auto',
                      display: 'block',
                      filter: 'var(--logo-filter, brightness(0))',
                    }}
                  />
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: r.peak ? 'var(--ink)' : 'var(--ink-70)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  #{r.rank}
                </span>
                <span
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: 'var(--ink-07)',
                    overflow: 'hidden',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      height: '100%',
                      borderRadius: 999,
                      background: r.peak ? 'var(--ink)' : 'var(--ink-60)',
                      width: filled ? `${r.conf}%` : '0%',
                      transition: `width 1.1s var(--ease-out-expo) ${i * 95 + 220}ms`,
                    }}
                  />
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.78rem',
                    color: 'var(--ink-60)',
                    textAlign: 'right',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {r.conf}%
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid var(--line)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
            }}
          >
            {stats.map((s, i) => (
              <div
                key={s.l}
                style={{
                  padding: '0 16px',
                  borderRight: i < 2 ? '1px solid var(--line)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                      letterSpacing: '-0.03em',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {s.v}
                  </span>
                  {s.up && (
                    <span
                      style={{
                        color: 'var(--positive)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                      }}
                    >
                      ↑
                    </span>
                  )}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: '0.74rem',
                    color: 'var(--ink-55, var(--ink-60))',
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </WindowChrome>
    </div>
  );
}

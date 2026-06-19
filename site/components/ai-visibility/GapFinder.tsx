'use client';

import { useState, useEffect } from 'react';

const GAP_COMPETITORS = [
  { url: 'competitor-a.com/compare', cites: 33 },
  { url: 'g2.com/ai-visibility-tools', cites: 21 },
  { url: 'competitor-b.io/blog/ai-seo', cites: 18 },
];

function Search({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle' }}
    >
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.2 10.2L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LinkIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle' }}
    >
      <path
        d="M6.5 9.5l3-3M7 4.5l1-1a2.5 2.5 0 013.5 3.5l-1 1M9 11.5l-1 1A2.5 2.5 0 014.5 9l1-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Target({ size = 11 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle' }}
    >
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="1.6" fill="currentColor" />
    </svg>
  );
}

function Check({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
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

export default function GapFinder() {
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const TOTAL = 7; // 0 prompt · 1 scanning · 2 gap+header · 3-5 competitors · 6 hold
  const [step, setStep] = useState(reduce ? 5 : 0);

  useEffect(() => {
    if (reduce) return;
    const hold = step === 6 ? 2600 : step === 2 ? 750 : step === 0 ? 900 : 780;
    const t = setTimeout(() => setStep((s) => (s + 1) % TOTAL), hold);
    return () => clearTimeout(t);
  }, [step, reduce]);

  const scanning = step === 1;
  const gapShown = step >= 2;
  const compVisible = (i: number) => step >= 3 + i || reduce;
  const footerShown = step >= 5 || reduce;
  const wonCount = GAP_COMPETITORS.filter((_, i) => compVisible(i)).length;

  return (
    <div
      style={{
        borderRadius: 'var(--radius-card)',
        background: 'var(--subtle)',
        border: 'none',
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '18px 22px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--ink-50)',
            }}
          >
            The Gap Finder
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.64rem',
              color: 'var(--ink-40)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
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
            {scanning ? 'scanning' : 'live'}
          </span>
        </div>

        {/* Prompt being checked */}
        <div
          style={{
            marginTop: 14,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '11px 13px',
            borderRadius: 10,
            background: 'var(--white)',
            border: '1px solid var(--line)',
          }}
        >
          <span style={{ flexShrink: 0, color: 'var(--ink-50)' }}>
            <Search size={15} />
          </span>
          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--ink)' }}>
            &ldquo;best AI visibility platform&rdquo;
          </span>
        </div>

        {/* Brand status — the gap */}
        <div
          style={{
            marginTop: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '10px 13px',
            borderRadius: 10,
            background: 'var(--white)',
            border: '1px solid var(--line)',
          }}
        >
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-70)' }}>
            Your brand
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: gapShown ? 'var(--ink)' : 'var(--ink-40)',
              transition: 'color .3s ease',
            }}
          >
            {gapShown ? (
              <>
                <span
                  aria-hidden
                  style={{
                    height: 16,
                    width: 16,
                    borderRadius: 999,
                    border: '1.5px dashed var(--ink-40)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    lineHeight: 1,
                    color: 'var(--ink-50)',
                  }}
                >
                  —
                </span>
                Not mentioned
              </>
            ) : scanning ? (
              'checking…'
            ) : (
              ''
            )}
          </span>
        </div>

        {/* Cited-instead header */}
        <div
          style={{
            marginTop: 16,
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            opacity: gapShown ? 1 : 0,
            transform: gapShown ? 'none' : 'translateY(-4px)',
            transition: 'all .4s ease',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--ink-50)',
            }}
          >
            Cited instead — your targets
          </span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        </div>

        {/* Competitor pages cited, revealing one by one */}
        <div style={{ display: 'grid', gap: 6 }}>
          {GAP_COMPETITORS.map((c, i) => (
            <div
              key={c.url}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                background: 'var(--white)',
                border: '1px solid var(--line)',
                opacity: compVisible(i) ? 1 : 0,
                transform: compVisible(i) ? 'none' : 'translateX(10px)',
                transition: 'all .45s var(--ease-out-expo)',
              }}
            >
              <span style={{ flexShrink: 0, color: 'var(--ink-40)' }}>
                <LinkIcon size={14} />
              </span>
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--ink-70)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.url}
              </span>
              <span
                style={{
                  flexShrink: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--ink-40)',
                }}
              >
                {c.cites}×
              </span>
              <span
                style={{
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 8px',
                  borderRadius: 999,
                  background: 'var(--ink-surface, var(--ink))',
                  color: 'var(--on-ink)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                <Target size={10} /> Target
              </span>
            </div>
          ))}
        </div>

        {/* Outcome */}
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            opacity: footerShown ? 1 : 0,
            transform: footerShown ? 'none' : 'translateY(4px)',
            transition: 'all .4s ease',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 18,
              width: 18,
              borderRadius: 999,
              background: 'var(--ink-surface, var(--ink))',
              color: 'var(--on-ink)',
            }}
          >
            <Check size={10} />
          </span>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink)' }}>
            {wonCount} pages to win back
          </span>
        </div>
      </div>
    </div>
  );
}

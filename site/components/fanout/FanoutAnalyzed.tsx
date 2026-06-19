'use client';

import { FanoutWindow, F_MONO_LABEL, useFanoutReveal } from './FanoutUtilities';

const ANALYZED_ROWS: Array<{ e: string; res: string; tone: 'hit' | 'comp' | 'miss' }> = [
  { e: 'Broad AI visibility prompts', res: 'You appear', tone: 'hit' },
  { e: 'ChatGPT tracking prompts', res: 'Competitors win', tone: 'comp' },
  { e: 'Perplexity citation prompts', res: 'Competitors cited', tone: 'comp' },
  { e: 'GEO optimization prompts', res: 'Brand absent', tone: 'miss' },
];

export default function FanoutAnalyzed() {
  const [ref, on] = useFanoutReveal();
  return (
    <div ref={ref}>
      <FanoutWindow label="Fanout / answer analysis" dark>
        <div style={{ padding: 22 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <div>
              <div style={{ ...F_MONO_LABEL, color: 'var(--on-ink-50)' }}>Prompt coverage</div>
              <div
                style={{
                  marginTop: 8,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.1rem',
                    fontWeight: 600,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: 'var(--on-ink)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  2/5
                </span>
                <span
                  style={{
                    marginBottom: 3,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--on-ink-50)',
                  }}
                >
                  branches won
                </span>
              </div>
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                background: 'var(--ink-surface)',
                color: 'var(--on-ink)',
                borderRadius: 999,
                padding: '0.3rem 0.7rem',
              }}
            >
              ANALYZED
            </span>
          </div>
          <div style={{ marginTop: 18, display: 'grid', gap: 8 }}>
            {ANALYZED_ROWS.map((r, i) => (
              <div
                key={r.e}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'var(--on-ink-05)',
                  border: '1px solid var(--on-ink-15)',
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateX(8px)',
                  transition: `all .45s ease ${i * 70}ms`,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      height: 7,
                      width: 7,
                      borderRadius: 999,
                      background:
                        r.tone === 'hit'
                          ? 'var(--positive)'
                          : r.tone === 'comp'
                          ? '#fda4af'
                          : 'transparent',
                      border: r.tone === 'miss' ? '1.5px solid var(--on-ink-30)' : 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--on-ink)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {r.e}
                  </span>
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: '0.82rem',
                    color: 'var(--on-ink-70)',
                  }}
                >
                  {r.res}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FanoutWindow>
    </div>
  );
}

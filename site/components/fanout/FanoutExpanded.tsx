'use client';

import { FanoutWindow, Branch, F_MONO_LABEL, useFanoutReveal } from './FanoutUtilities';

const EXPANDED_VARIATIONS = [
  'Best AI visibility platforms for SEO teams',
  'Tools to track brand mentions in ChatGPT',
  'How to monitor citations in Perplexity',
  'AI search visibility software for B2B SaaS',
  'Best GEO tools for improving AI search visibility',
];

export default function FanoutExpanded() {
  const [ref, on] = useFanoutReveal();
  return (
    <div ref={ref}>
      <FanoutWindow label="Fanout / expand seed">
        <div style={{ padding: 22 }}>
          <div
            style={{
              padding: '16px 18px',
              borderRadius: 12,
              background: 'var(--subtle)',
              border: '1px solid var(--line)',
            }}
          >
            <div style={F_MONO_LABEL}>Seed query</div>
            <p
              style={{
                margin: '10px 0 0',
                fontSize: '0.98rem',
                lineHeight: 1.5,
                color: 'var(--ink)',
                fontWeight: 600,
              }}
            >
              &ldquo;What are the best tools for tracking brand visibility across AI search engines?&rdquo;
            </p>
          </div>
          <div
            style={{
              margin: '14px 0 4px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={F_MONO_LABEL}>Fanout variations</span>
            <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.66rem',
                color: 'var(--ink-50)',
              }}
            >
              {EXPANDED_VARIATIONS.length}
            </span>
          </div>
          {EXPANDED_VARIATIONS.map((v, i) => (
            <div
              key={v}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                opacity: on ? 1 : 0,
                transform: on ? 'none' : 'translateX(8px)',
                transition: `all .45s ease ${i * 70}ms`,
              }}
            >
              <Branch last={i === EXPANDED_VARIATIONS.length - 1} />
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  margin: '5px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '11px 14px',
                  borderRadius: 10,
                  background: 'var(--white)',
                  border: '1px solid var(--line)',
                }}
              >
                <span
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {v}
                </span>
              </div>
            </div>
          ))}
        </div>
      </FanoutWindow>
    </div>
  );
}

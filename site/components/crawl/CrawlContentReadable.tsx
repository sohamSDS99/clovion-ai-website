'use client';

import { CrawlWindow, useCrawlReveal } from './CrawlUtilities';

export default function CrawlContentReadable() {
  const [ref, on] = useCrawlReveal();

  return (
    <div ref={ref}>
      <CrawlWindow label="Crawlability / technical rules" dark>
        <div style={{ padding: 22 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'var(--on-ink)',
                }}
              >
                no-js-only-content
              </div>
              <div
                style={{
                  marginTop: 5,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.66rem',
                  color: 'var(--on-ink-50)',
                }}
              >
                Technical access rule · GEO ruleset
              </div>
            </div>
            <span
              style={{
                flexShrink: 0,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                letterSpacing: '0.08em',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#fda4af',
                background: 'rgba(253,164,175,0.14)',
                borderRadius: 999,
                padding: '0.28rem 0.7rem',
              }}
            >
              FAIL
            </span>
          </div>
          <div
            style={{
              marginTop: 16,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'var(--on-ink-05)',
              border: '1px solid var(--on-ink-15)',
              opacity: on ? 1 : 0,
              transform: on ? 'none' : 'translateY(6px)',
              transition: 'all .45s ease',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--on-ink-50)',
              }}
            >
              Finding
            </div>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: '0.86rem',
                lineHeight: 1.55,
                color: 'var(--on-ink-80)',
              }}
            >
              Primary content on{' '}
              <span style={{ fontFamily: 'var(--font-mono)' }}>/product</span> renders client-side
              only. AI bots receive an empty shell.
            </p>
          </div>
          <div
            style={{
              marginTop: 10,
              padding: '14px 16px',
              borderRadius: 12,
              background: 'var(--on-ink-05)',
              border: '1px solid var(--on-ink-15)',
              opacity: on ? 1 : 0,
              transform: on ? 'none' : 'translateY(6px)',
              transition: 'all .45s ease .1s',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--positive)',
              }}
            >
              Fix suggestion
            </div>
            <p
              style={{
                margin: '8px 0 0',
                fontSize: '0.86rem',
                lineHeight: 1.55,
                color: 'var(--on-ink-80)',
              }}
            >
              Server-render or pre-render key copy so it is present in the initial HTML response.
            </p>
          </div>
          <p
            style={{
              margin: '16px 2px 0',
              fontSize: '0.78rem',
              color: 'var(--on-ink-50)',
            }}
          >
            An access improvement, not a content one. Perfect GEO content stays invisible if it is
            JS-only.
          </p>
        </div>
      </CrawlWindow>
    </div>
  );
}

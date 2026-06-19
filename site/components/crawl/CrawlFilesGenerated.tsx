'use client';

import { CSSProperties } from 'react';
import { CrawlWindow, useCrawlReveal, C_MONO_LABEL } from './CrawlUtilities';

const GEN_FILES = [
  { f: 'llms.txt', d: 'Curated index of important pages', ext: 'TXT' },
  { f: 'llms-full.txt', d: 'Full page summaries for AI systems', ext: 'TXT' },
  { f: 'robots.txt', d: 'Preset-based crawler guidance', ext: 'TXT' },
  { f: 'schema.json-ld', d: 'Structured data per page type', ext: 'JSON' },
];

const POSITIVE_BADGE: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: 'var(--font-mono)',
  fontSize: '0.62rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--positive)',
  background: 'var(--positive-bg)',
  border: '1px solid var(--positive-border)',
  borderRadius: 999,
  padding: '0.28rem 0.7rem',
};

export default function CrawlFilesGenerated() {
  const [ref, on] = useCrawlReveal();

  return (
    <div ref={ref}>
      <CrawlWindow label="Crawlability / generated files">
        <div style={{ padding: 22 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={C_MONO_LABEL}>Served from site root</span>
            <span style={POSITIVE_BADGE}>GENERATED</span>
          </div>
          <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
            {GEN_FILES.map((g, i) => (
              <div
                key={g.f}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  padding: '12px 14px',
                  borderRadius: 11,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                  opacity: on ? 1 : 0,
                  transform: on ? 'none' : 'translateX(8px)',
                  transition: `all .45s ease ${i * 75}ms`,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    height: 30,
                    width: 30,
                    borderRadius: 8,
                    background: 'var(--ink-surface, var(--ink))',
                    color: 'var(--on-ink)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.52rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  {g.ext}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: 'var(--ink)',
                    }}
                  >
                    /{g.f}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      marginTop: 2,
                      fontSize: '0.78rem',
                      color: 'var(--ink-60)',
                    }}
                  >
                    {g.d}
                  </span>
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    height: 20,
                    width: 20,
                    borderRadius: 999,
                    background: 'var(--positive-bg)',
                    color: 'var(--positive)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <svg
                    width={11}
                    height={11}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </CrawlWindow>
    </div>
  );
}

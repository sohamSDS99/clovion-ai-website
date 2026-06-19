'use client';

import { CSSProperties } from 'react';
import { CrawlWindow, useCrawlReveal, C_MONO_LABEL } from './CrawlUtilities';

type DiffKind = 'ctx' | 'rem' | 'add';

const DIFF_LINES: { t: DiffKind; txt: string }[] = [
  { t: 'ctx', txt: 'User-agent: *' },
  { t: 'ctx', txt: 'Allow: /' },
  { t: 'rem', txt: 'User-agent: OAI-SearchBot' },
  { t: 'rem', txt: 'Disallow: /' },
  { t: 'add', txt: 'User-agent: OAI-SearchBot' },
  { t: 'add', txt: 'Allow: /' },
  { t: 'add', txt: 'User-agent: PerplexityBot' },
  { t: 'add', txt: 'Allow: /' },
];

type DiffStyle = { bg: string; bar: string; sign: string; fg: string };

function styleFor(t: DiffKind): DiffStyle {
  if (t === 'add') {
    return { bg: 'var(--positive-bg)', bar: 'var(--positive)', sign: '+', fg: 'var(--ink)' };
  }
  if (t === 'rem') {
    return { bg: 'rgba(190,18,60,0.06)', bar: '#be123c', sign: '−', fg: 'var(--ink-50)' };
  }
  return { bg: 'transparent', bar: 'transparent', sign: ' ', fg: 'var(--ink-60)' };
}

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

export default function CrawlAccessOpened() {
  const [ref, on] = useCrawlReveal();

  return (
    <div ref={ref}>
      <CrawlWindow label="Crawlability / robots.txt — diff">
        <div style={{ padding: 18 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            <span style={C_MONO_LABEL}>Proposed change</span>
            <span style={POSITIVE_BADGE}>ACCESS OPENED</span>
          </div>
          <div
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--line)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
            }}
          >
            {DIFF_LINES.map((l, i) => {
              const s = styleFor(l.t);
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '7px 12px',
                    background: s.bg,
                    borderLeft: `2px solid ${s.bar}`,
                    opacity: on ? 1 : 0,
                    transform: on ? 'none' : 'translateX(6px)',
                    transition: `all .4s ease ${i * 55}ms`,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      color:
                        s.bar === 'transparent'
                          ? 'var(--ink-30, rgba(10,10,15,0.3))'
                          : s.bar,
                      fontWeight: 700,
                    }}
                  >
                    {s.sign}
                  </span>
                  <span
                    style={{
                      color: s.fg,
                      textDecoration: l.t === 'rem' ? 'line-through' : 'none',
                    }}
                  >
                    {l.txt}
                  </span>
                </div>
              );
            })}
          </div>
          <p
            style={{
              margin: '12px 2px 0',
              fontSize: '0.8rem',
              color: 'var(--ink-60)',
            }}
          >
            2 search crawlers were accidentally blocked. Clovion flags them against its preset
            library.
          </p>
        </div>
      </CrawlWindow>
    </div>
  );
}

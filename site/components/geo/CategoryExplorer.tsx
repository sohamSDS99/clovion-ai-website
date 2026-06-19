'use client';

import { useState, useEffect } from 'react';
import GeoWindow from './GeoWindow';

const CATEGORIES: Record<string, { count: number; blurb: string; rules: { label: string; lift: string; sev?: string }[] }> = {
  Structure: {
    count: 8,
    blurb: 'Improve answer-first openings, headings, summaries, lists, and page clarity so AI engines understand your content faster.',
    rules: [
      { label: 'Answer-first opening', lift: '+12%', sev: 'HIGH' },
      { label: 'Heading hierarchy', lift: '+6%' },
      { label: 'Summary block present', lift: '+5%' },
      { label: 'List & table formatting', lift: '+4%' },
      { label: 'Paragraph length', lift: '+3%' },
      { label: 'Scannable section breaks', lift: '+3%' },
      { label: 'Key-term definitions', lift: '+2%' },
      { label: 'Page clarity score', lift: '+2%' },
    ],
  },
  Schema: {
    count: 4,
    blurb: 'Find missing or weak JSON-LD, article schema, FAQ schema, and structured-data opportunities AI engines read for context.',
    rules: [
      { label: 'FAQPage JSON-LD', lift: '+9%', sev: 'HIGH' },
      { label: 'Article schema', lift: '+5%' },
      { label: 'JSON-LD coverage', lift: '+4%' },
      { label: 'Canonical tags', lift: '+2%' },
    ],
  },
  Authority: {
    count: 7,
    blurb: 'Strengthen author bios, credentials, internal links, outbound citations, defined terms, and entity consistency across pages.',
    rules: [
      { label: 'Author credentials', lift: '+7%', sev: 'MED' },
      { label: 'Internal link depth', lift: '+5%' },
      { label: 'Outbound citations', lift: '+4%' },
      { label: 'Author bio present', lift: '+3%' },
      { label: 'Entity consistency', lift: '+3%' },
      { label: 'Defined terms', lift: '+2%' },
      { label: 'Source authority', lift: '+2%' },
    ],
  },
  Technical: {
    count: 6,
    blurb: 'Improve technical accessibility with crawlable content, alt text, robots.txt guidance, llms.txt support, and machine-readable signals.',
    rules: [
      { label: 'llms.txt support', lift: '+6%', sev: 'MED' },
      { label: 'Crawlable content', lift: '+5%' },
      { label: 'robots.txt AI rules', lift: '+4%' },
      { label: 'Machine-readable signals', lift: '+3%' },
      { label: 'Image alt text', lift: '+2%' },
      { label: 'Render without JS', lift: '+2%' },
    ],
  },
};

const CAT_KEYS = Object.keys(CATEGORIES);

type CatName = 'Structure' | 'Schema' | 'Authority' | 'Technical';

function CatIcon({ name, size = 22 }: { name: CatName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const paths: Record<CatName, JSX.Element> = {
    Structure: (
      <g>
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="15" y2="12" />
        <line x1="4" y1="18" x2="18" y2="18" />
      </g>
    ),
    Schema: (
      <g>
        <polyline points="8 8 4 12 8 16" />
        <polyline points="16 8 20 12 16 16" />
        <line x1="13" y1="5" x2="11" y2="19" />
      </g>
    ),
    Authority: (
      <g>
        <path d="M12 3l7 3v5c0 4.2-2.9 7.3-7 8.5C7.9 18.3 5 15.2 5 11V6l7-3z" />
        <polyline points="9 11.5 11.2 13.7 15 9.8" />
      </g>
    ),
    Technical: (
      <g>
        <circle cx="6" cy="6" r="2" />
        <circle cx="18" cy="7" r="2" />
        <circle cx="9" cy="18" r="2" />
        <line x1="7.6" y1="7.4" x2="14" y2="16.6" />
        <line x1="7.7" y1="6.4" x2="16.2" y2="6.7" />
        <line x1="16.5" y1="8.6" x2="10.6" y2="16.4" />
      </g>
    ),
  };
  return (
    <svg {...common} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function CategoryExplorer() {
  const [tab, setTab] = useState<CatName>('Structure');
  const [grown, setGrown] = useState(false);
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reduce) {
      setGrown(true);
      return;
    }
    setGrown(false);
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setGrown(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      if (r2) cancelAnimationFrame(r2);
    };
  }, [tab, reduce]);

  const c = CATEGORIES[tab];
  const lifts = c.rules.map((r) => parseInt(r.lift, 10));
  const max = Math.max(...lifts);
  const total = lifts.reduce((a, b) => a + b, 0);

  return (
    <GeoWindow label={`GEO rules / ${tab} · ${c.count} rules`}>
      <div style={{ padding: 22 }}>
        {/* Segmented toggle */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            gap: 4,
            padding: 4,
            borderRadius: 999,
            background: 'var(--ink-04)',
            border: '1px solid var(--line)',
          }}
        >
          {CAT_KEYS.map((k) => {
            const active = k === tab;
            return (
              <button
                key={k}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(k as CatName)}
                style={{
                  flex: 1,
                  height: 34,
                  padding: '0 14px',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: active ? 'var(--ink-surface)' : 'transparent',
                  color: active ? 'var(--on-ink)' : 'var(--ink-70)',
                  transition: 'background .2s ease, color .2s ease',
                }}
              >
                {k} {CATEGORIES[k].count}
              </button>
            );
          })}
        </div>

        {/* summary tiles */}
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            style={{
              flexShrink: 0,
              height: 54,
              width: 54,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--positive)',
              background: 'var(--positive-bg)',
              border: '1px solid var(--positive-border)',
            }}
          >
            <CatIcon name={tab} size={24} />
          </span>
          <div style={{ flex: 1, display: 'flex', gap: 14 }}>
            <div
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 12,
                background: 'var(--subtle)',
                border: '1px solid var(--line)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  color: 'var(--ink)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {c.count}
              </div>
              <div style={{ marginTop: 5, fontSize: '0.72rem', color: 'var(--ink-60)' }}>
                rules in {tab}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 12,
                background: 'var(--positive-bg)',
                border: '1px solid var(--positive-border)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.6rem',
                  fontWeight: 600,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  color: 'var(--positive)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                +{total}%
              </div>
              <div style={{ marginTop: 5, fontSize: '0.72rem', color: 'var(--ink-60)' }}>
                combined lift
              </div>
            </div>
          </div>
        </div>

        {/* animated lift bars */}
        <div style={{ marginTop: 22, display: 'grid', gap: 15 }}>
          {c.rules.map((r, i) => {
            const pct = Math.round((parseInt(r.lift, 10) / max) * 100);
            const high = r.sev === 'HIGH';
            return (
              <div key={r.label}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 7,
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                    <span
                      style={{
                        flexShrink: 0,
                        height: 7,
                        width: 7,
                        borderRadius: 999,
                        background: high ? 'var(--positive)' : 'var(--ink-30)',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: 'var(--ink)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {r.label}
                    </span>
                  </span>
                  <span
                    style={{
                      flexShrink: 0,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: 'var(--positive)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {r.lift}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: 'var(--ink-07)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      borderRadius: 999,
                      background: high ? 'var(--positive)' : 'var(--ink-40)',
                      width: grown ? `${pct}%` : '0%',
                      transition: `width .7s cubic-bezier(.16,1,.3,1) ${i * 65}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GeoWindow>
  );
}

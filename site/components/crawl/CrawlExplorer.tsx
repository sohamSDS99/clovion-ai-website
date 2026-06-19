'use client';

import { useState } from 'react';
import { CrawlWindow } from './CrawlUtilities';

type Tone = 'pass' | 'warn' | 'fail';

type Row = {
  q: string;
  tag: string;
  tone: Tone;
};

type LayerEntry = {
  count: number;
  blurb: string;
  rows: Row[];
};

const LAYER_DATA: Record<string, LayerEntry> = {
  'AI Crawler Access': {
    count: 8,
    blurb: 'Review robots.txt rules and crawler guidance for important AI user agents.',
    rows: [
      { q: 'robots.txt — search crawlers reachable', tag: 'Pass', tone: 'pass' },
      { q: 'GPTBot accidentally blocked', tag: 'Fix', tone: 'fail' },
      { q: 'Server returns 200 for AI agents', tag: 'Pass', tone: 'pass' },
      { q: 'No crawl-delay throttling AI bots', tag: 'Pass', tone: 'pass' },
    ],
  },
  'Machine-Readable Maps': {
    count: 5,
    blurb: 'Generate and maintain files like llms.txt and llms-full.txt to guide AI systems toward important content.',
    rows: [
      { q: 'llms.txt present at site root', tag: 'Missing', tone: 'fail' },
      { q: 'llms-full.txt with page summaries', tag: 'Missing', tone: 'fail' },
      { q: 'Sitemap.xml discoverable', tag: 'Pass', tone: 'pass' },
      { q: 'Key pages listed for AI systems', tag: 'Review', tone: 'warn' },
    ],
  },
  'Structured Data': {
    count: 11,
    blurb: 'Check JSON-LD, article schema, FAQ schema, product schema, and other markup that helps AI systems interpret the page.',
    rows: [
      { q: 'JSON-LD present on key templates', tag: 'Pass', tone: 'pass' },
      { q: 'FAQPage schema on Q&A pages', tag: 'Fix', tone: 'fail' },
      { q: 'Article schema dates valid', tag: 'Pass', tone: 'pass' },
      { q: 'Canonical tags resolve correctly', tag: 'Review', tone: 'warn' },
    ],
  },
  'Static Content Visibility': {
    count: 6,
    blurb: 'Flag pages where important content may depend too heavily on JavaScript or hidden rendering patterns.',
    rows: [
      { q: 'no-js-only-content', tag: 'Fail', tone: 'fail' },
      { q: 'Primary copy in initial HTML', tag: 'Review', tone: 'warn' },
      { q: 'Headings server-rendered', tag: 'Pass', tone: 'pass' },
      { q: 'Alt text on key images', tag: 'Pass', tone: 'pass' },
    ],
  },
};

const LAYER_KEYS = Object.keys(LAYER_DATA);
const LAYER_SHORT: Record<string, string> = {
  'AI Crawler Access': 'Access',
  'Machine-Readable Maps': 'Maps',
  'Structured Data': 'Schema',
  'Static Content Visibility': 'Static',
};

export default function CrawlExplorer() {
  const [tab, setTab] = useState<string>(LAYER_KEYS[0]);
  const c = LAYER_DATA[tab];

  return (
    <CrawlWindow label={`Crawlability / ${LAYER_SHORT[tab]} · ${c.count} checks`}>
      <div style={{ padding: 22 }}>
        {/* SegmentedToggle — inline */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            gap: 4,
            padding: 4,
            borderRadius: 999,
            background: 'var(--ink-04, rgba(10,10,15,0.04))',
            border: '1px solid var(--line)',
          }}
        >
          {LAYER_KEYS.map((k) => {
            const active = tab === k;
            return (
              <button
                key={k}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(k)}
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: active ? 'var(--ink-surface)' : 'transparent',
                  color: active ? 'var(--on-ink)' : 'var(--ink-70)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  transition: 'all .2s ease',
                }}
              >
                {LAYER_SHORT[k]}
              </button>
            );
          })}
        </div>

        <p
          style={{
            margin: '18px 2px 0',
            fontSize: '0.9rem',
            lineHeight: 1.55,
            color: 'var(--ink-70)',
          }}
        >
          {c.blurb}
        </p>

        <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
          {c.rows.map((r) => {
            const tone =
              r.tone === 'pass'
                ? { bg: 'var(--positive-bg)', fg: 'var(--positive)', dot: 'var(--positive)' }
                : r.tone === 'warn'
                ? {
                    bg: 'var(--ink-07)',
                    fg: 'var(--ink-70)',
                    dot: 'var(--ink-25, rgba(10,10,15,0.25))',
                  }
                : { bg: 'rgba(190,18,60,0.07)', fg: '#be123c', dot: '#be123c' };
            const mono =
              r.q === 'no-js-only-content' ||
              r.q.indexOf('llms') === 0 ||
              r.q.indexOf('robots') === 0;
            return (
              <div
                key={r.q}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                  padding: '11px 14px',
                  borderRadius: 12,
                  background: 'var(--subtle)',
                  border: '1px solid var(--line)',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                  <span
                    style={{
                      flexShrink: 0,
                      height: 8,
                      width: 8,
                      borderRadius: 999,
                      background: tone.dot,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: mono ? 'var(--font-mono)' : 'inherit',
                      fontSize: mono ? '0.82rem' : '0.88rem',
                      fontWeight: 600,
                      color: 'var(--ink)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {r.q}
                  </span>
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    letterSpacing: '0.06em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: tone.fg,
                    background: tone.bg,
                    borderRadius: 999,
                    padding: '0.2rem 0.6rem',
                  }}
                >
                  {r.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </CrawlWindow>
  );
}

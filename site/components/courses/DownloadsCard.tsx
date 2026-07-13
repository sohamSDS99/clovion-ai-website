'use client'

import { analytics } from '@/lib/analytics'
import type { CourseDownload } from '@/lib/cms-types'

// "Downloads" card for course lessons — lesson materials (worksheets,
// checklists, templates) as direct file links. Client component so each
// download click can push a dataLayer event (cta_location "course-download"),
// mirroring what <Button trackLocation> does — Button itself can't carry the
// `download` attribute, so this renders plain anchors with the btn classes.

export function DownloadsCard({ items }: { items: CourseDownload[] }) {
  const downloads = items.filter((d) => d?.label && d?.url)
  if (downloads.length === 0) return null
  return (
    <aside
      aria-label="Downloads"
      style={{
        padding: '1.6rem 1.9rem',
        background: '#F1F1F4',
        borderRadius: 16,
        color: 'rgba(10, 10, 15, 0.82)'
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-display), system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '1.3rem',
          lineHeight: 1.25,
          color: 'var(--ink)'
        }}
      >
        Downloads
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: '1.1em 0 0' }}>
        {downloads.map((d, i) => (
          <li
            key={`${d.url}-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
              paddingTop: i > 0 ? 14 : 0,
              marginTop: i > 0 ? 14 : 0,
              borderTop: i > 0 ? '1px solid rgba(10, 10, 15, 0.08)' : undefined
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{d.label}</span>
            <a
              href={d.url}
              download={d.filename ?? true}
              className="btn btn-secondary h-9 px-3.5 text-sm"
              onClick={() => analytics.ctaClick(d.label, 'course-download', d.url)}
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

import type { CmsAuthor } from '@/lib/cms-types'

// Author byline for course cards and the course landing hero — same visual
// treatment as the CMS index cards' byline (components/cms/PostCards.tsx):
// avatar (or orange initials disc) + name, with an optional mono sub-line.
// Server component — no interactivity needed.

const ORANGE = '#C2410C'

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function CourseByline({
  author,
  subline,
  size = 'md'
}: {
  author: CmsAuthor
  subline?: string
  size?: 'md' | 'sm'
}) {
  const dim = size === 'md' ? 34 : 30
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {author.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={author.avatar}
          alt={author.displayName}
          style={{ width: dim, height: dim, borderRadius: 999, objectFit: 'cover', flexShrink: 0 }}
        />
      ) : (
        <span
          style={{
            width: dim,
            height: dim,
            borderRadius: 999,
            background: ORANGE,
            color: '#fff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size === 'md' ? '0.76rem' : '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            flexShrink: 0
          }}
        >
          {initials(author.displayName)}
        </span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span
          style={{
            fontSize: size === 'md' ? '0.9rem' : '0.82rem',
            fontWeight: 600,
            color: 'var(--ink)'
          }}
        >
          {author.displayName}
        </span>
        {subline && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.66rem',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-50)'
            }}
          >
            {subline}
          </span>
        )}
      </div>
    </div>
  )
}

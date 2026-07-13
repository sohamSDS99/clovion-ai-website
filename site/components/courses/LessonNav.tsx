import Link from 'next/link'
import { Button, ArrowRight } from '@/components/ui'
import type { CourseNavItem } from '@/lib/cms-types'

// Prev/next footer navigation for course lessons — two cells, previous on the
// left, next on the right (the prominent one). On the last lesson the next
// cell becomes a calm CTA to the free score tool so the course ends with a
// concrete next step instead of a dead end.

const ORANGE = '#C2410C'

const cellStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  padding: '20px 24px',
  borderRadius: 18,
  border: '1px solid var(--line)',
  background: 'var(--white)',
  textDecoration: 'none',
  color: 'inherit',
  minHeight: 104
}

function CellLabel({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.68rem',
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
        color: color ?? 'var(--ink-50)'
      }}
    >
      {children}
    </span>
  )
}

export function LessonNav({
  prev,
  next,
  courseSlug
}: {
  prev: CourseNavItem | null
  next: CourseNavItem | null
  courseSlug: string
}) {
  return (
    <nav
      aria-label="Lesson navigation"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {prev ? (
        <Link href={`/courses/${courseSlug}/${prev.slug}`} className="group" style={cellStyle}>
          <CellLabel>
            <ArrowRight className="rotate-180" /> Previous
          </CellLabel>
          <span style={{ fontWeight: 600, lineHeight: 1.35, color: 'var(--ink)' }}>
            {prev.title}
          </span>
        </Link>
      ) : (
        <div aria-hidden className="hidden sm:block" style={{ ...cellStyle, border: '1px dashed var(--line)', background: 'transparent' }} />
      )}

      {next ? (
        <Link
          href={`/courses/${courseSlug}/${next.slug}`}
          className="group sm:text-right"
          style={{ ...cellStyle, alignItems: undefined, borderColor: 'rgba(194, 65, 12, 0.35)' }}
        >
          <span className="sm:self-end">
            <CellLabel color={ORANGE}>
              Next <ArrowRight />
            </CellLabel>
          </span>
          <span style={{ fontWeight: 600, lineHeight: 1.35, color: 'var(--ink)' }}>
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="sm:text-right" style={{ ...cellStyle, borderColor: 'rgba(194, 65, 12, 0.35)' }}>
          <span className="sm:self-end">
            <CellLabel color={ORANGE}>Course complete</CellLabel>
          </span>
          <span style={{ fontWeight: 600, lineHeight: 1.35, color: 'var(--ink)' }}>
            That was the last lesson. See where your own site stands.
          </span>
          <span className="sm:self-end" style={{ marginTop: 6 }}>
            <Button href="/free-ai-visibility-score" size="sm" trackLocation="course-lesson-nav">
              Get your free score
            </Button>
          </span>
        </div>
      )}
    </nav>
  )
}

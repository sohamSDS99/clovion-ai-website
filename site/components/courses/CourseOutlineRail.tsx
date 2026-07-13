import Link from 'next/link'
import type { CourseOutlineLesson } from '@/lib/cms-types'

// "In this course" rail — the ordered lesson list for the course, rendered in
// the article's left rail under the sticky TOC. Same visual language as
// ArticleToc (mono label, hairline-ruled list) with the current lesson
// highlighted in the course accent. Static — no scroll-spy needed.

const ORANGE = '#C2410C'

export function CourseOutlineRail({
  lessons,
  currentSlug,
  courseSlug
}: {
  lessons: CourseOutlineLesson[]
  currentSlug: string
  courseSlug: string
}) {
  if (lessons.length === 0) return null
  const ordered = [...lessons].sort((a, b) => a.lessonNumber - b.lessonNumber)
  return (
    <nav aria-label="In this course" className="text-sm">
      <p className="mb-4 text-xs uppercase tracking-[0.14em] text-[var(--ink-40)]">
        In this course
      </p>
      <ol className="flex flex-col gap-0.5 border-l border-[var(--line)]">
        {ordered.map((lesson) => {
          const isCurrent = lesson.slug === currentSlug
          return (
            <li key={lesson.slug}>
              <Link
                href={`/courses/${courseSlug}/${lesson.slug}`}
                aria-current={isCurrent ? 'page' : undefined}
                className="flex gap-2 py-1.5 pl-4 leading-snug transition-colors"
                style={{
                  marginLeft: '-1px',
                  borderLeft: `2px solid ${isCurrent ? ORANGE : 'transparent'}`,
                  color: isCurrent ? ORANGE : 'var(--ink-50)',
                  fontWeight: isCurrent ? 600 : 400
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    lineHeight: '1.4rem',
                    flexShrink: 0
                  }}
                >
                  {lesson.lessonNumber}
                </span>
                <span>
                  {lesson.title}
                  {lesson.readMinutes ? (
                    <span
                      aria-hidden
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.66rem',
                        color: 'var(--ink-40)',
                        marginTop: 2
                      }}
                    >
                      ~{lesson.readMinutes} min
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

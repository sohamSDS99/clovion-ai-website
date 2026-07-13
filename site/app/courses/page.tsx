import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { Section, Container, Eyebrow, Button, ArrowRight, HaloMark } from '@/components/ui'
import { CourseByline } from '@/components/courses/CourseByline'
import { listCourseOverviews, type CourseOverview } from '@/lib/courses'

export const dynamic = 'force-dynamic'

const ORANGE = '#C2410C'
const BASE = 'https://www.clovion.ai'

export const metadata: Metadata = {
  title: 'Courses | Clovion AI',
  description:
    'Free, self-paced courses on generative engine optimization and AI search. Short lessons, worksheets to apply on your own site, no signup required.'
}

// Branded cover placeholder for courses without lesson art — same warm subtle
// panel + dot grid as the CMS index cards (components/cms/PostCards.tsx), with
// the Clovion HaloMark in ink at low opacity instead of the category word.
function CourseCoverPlaceholder() {
  return (
    <div
      aria-hidden
      className="aspect-[16/9]"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--subtle)',
        borderBottom: '1px solid var(--line)'
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
          backgroundImage: 'radial-gradient(rgba(10,10,15,0.06) 1px, transparent 1px)',
          backgroundSize: '18px 18px'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 14
        }}
      >
        <span style={{ color: 'var(--ink)', opacity: 0.12, display: 'inline-flex' }}>
          <HaloMark size={72} />
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.28em',
            color: ORANGE
          }}
        >
          Course
        </span>
      </div>
    </div>
  )
}

function CourseCard({ course }: { course: CourseOverview }) {
  const first = course.lessons[0]
  const count = course.lessons.length
  const href = `/courses/${course.slug}`

  const eyebrowParts = [
    'Course',
    `${count} ${count === 1 ? 'lesson' : 'lessons'}`,
    course.totalMinutes > 0 ? `~${course.totalMinutes} min` : null
  ].filter(Boolean) as string[]

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 22,
        border: '1px solid var(--line)',
        background: 'var(--white)',
        boxShadow: 'var(--shadow-card)',
        overflow: 'hidden'
      }}
    >
      <Link href={href} aria-label={course.title} style={{ display: 'block', color: 'inherit' }}>
        {first?.coverImageUrl ? (
          <div
            className="aspect-[16/9]"
            style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'var(--subtle)',
              borderBottom: '1px solid var(--line)'
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={first.coverImageUrl}
              alt={course.title}
              loading="lazy"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
            <span
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                boxShadow: 'inset 0 0 0 1px rgba(10,10,15,0.08)',
                pointerEvents: 'none'
              }}
            />
          </div>
        ) : (
          <CourseCoverPlaceholder />
        )}
      </Link>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          padding: 'clamp(1.5rem, 2vw, 2rem)',
          flex: 1
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: ORANGE
          }}
        >
          {eyebrowParts.join(' · ')}
        </span>

        <h2
          className="display-sm"
          style={{ fontSize: 'clamp(1.3rem, 1.5vw + 0.5rem, 1.75rem)', margin: 0 }}
        >
          <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
            {course.title}
          </Link>
        </h2>

        {first?.excerpt && (
          <p
            style={{
              fontSize: '0.96rem',
              lineHeight: 1.65,
              color: 'var(--ink-70)',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {first.excerpt}
          </p>
        )}

        {first?.author && (
          <CourseByline author={first.author} subline={first.author.title ?? undefined} size="sm" />
        )}

        {course.totalDownloads > 0 && (
          <span style={{ fontSize: '0.84rem', color: 'var(--ink-50)' }}>
            {course.totalDownloads} downloadable{' '}
            {course.totalDownloads === 1 ? 'worksheet' : 'worksheets'} included
          </span>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 10 }}>
          <Button href={href} trackLocation="courses-index">
            View course <ArrowRight />
          </Button>
        </div>
      </div>
    </article>
  )
}

export default async function CoursesPage() {
  const courses = await listCourseOverviews(100)

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Clovion courses',
    itemListElement: courses.map((course, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: course.title,
      url: `${BASE}/courses/${course.slug}`
    }))
  }

  return (
    <div
      className="clv-courses"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Brand-orange eyebrow pulse dot, scoped to the light courses page. */
            .clv-courses .eyebrow-dot::before {
              background: ${ORANGE};
              box-shadow: 0 0 0 4px rgba(194, 65, 12, 0.07);
            }
          `
        }}
      />
      {courses.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

      <Section tight>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>Courses</Eyebrow>
            <h1
              className="display-md mt-5 text-balance"
              style={{ fontSize: 'clamp(2.25rem, 3vw + 1rem, 3.5rem)' }}
            >
              Learn AI search, one lesson at a time.
            </h1>
            <p className="lead mt-6 text-[var(--ink-70)]">
              Free, self-paced courses on generative engine optimization. Short
              lessons with worksheets you can apply to your own site — no signup,
              no upsell mid-lesson.
            </p>
          </div>
        </Container>
      </Section>

      <Section tight className="!pt-0">
        <Container>
          {courses.length === 0 ? (
            <p className="mx-auto max-w-xl text-center text-[var(--ink-60)]">
              No courses published yet. The first one is in production — check
              back soon, or read the blog in the meantime.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {courses.map((course) => (
                <CourseCard key={course.slug} course={course} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  )
}

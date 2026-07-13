import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { OG_IMAGES } from '@/lib/og'
import { Section, Container, Eyebrow, Button, ArrowRight } from '@/components/ui'
import { CourseByline } from '@/components/courses/CourseByline'
import { listCourseLessons } from '@/lib/cms'
import { groupCourses, getCourseOverview } from '@/lib/courses'

// Course landing page — the overview users see BEFORE starting a course
// (Semrush-style): hero with meta + start CTA, full numbered curriculum,
// worksheets note, closing CTA. Lessons themselves live one level deeper at
// /courses/[courseSlug]/[lessonSlug].

export const revalidate = 300
export const dynamicParams = true

const ORANGE = '#C2410C'
const BASE = 'https://www.clovion.ai'

export async function generateStaticParams() {
  const courses = groupCourses(await listCourseLessons(100))
  return courses.map((course) => ({ courseSlug: course.slug }))
}

export async function generateMetadata({
  params
}: {
  params: { courseSlug: string }
}): Promise<Metadata> {
  const course = await getCourseOverview(params.courseSlug)
  if (!course || course.lessons.length === 0) {
    return { title: 'Course not found | Clovion AI' }
  }
  const teaser = course.lessons[0]?.excerpt ?? undefined
  const ogImage = course.lessons[0]?.coverImageUrl ?? undefined
  return {
    title: course.title,
    description: teaser,
    alternates: { canonical: `/courses/${params.courseSlug}` },
    openGraph: {
      title: course.title,
      description: teaser,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : OG_IMAGES
    }
  }
}

export default async function CourseLandingPage({
  params
}: {
  params: { courseSlug: string }
}) {
  const course = await getCourseOverview(params.courseSlug)
  if (!course || course.lessons.length === 0) notFound()

  const first = course.lessons[0]
  const teaser = first.excerpt
  const count = course.lessons.length
  const startHref = `/courses/${course.slug}/${first.slug}`

  const metaParts = [
    `${count} ${count === 1 ? 'lesson' : 'lessons'}`,
    course.totalMinutes > 0 ? `~${course.totalMinutes} min total` : null,
    course.totalDownloads > 0
      ? `${course.totalDownloads} ${course.totalDownloads === 1 ? 'download' : 'downloads'}`
      : null,
    'Free, self-paced'
  ].filter(Boolean) as string[]

  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    ...(teaser ? { description: teaser } : {}),
    url: `${BASE}/courses/${course.slug}`,
    provider: {
      '@type': 'Organization',
      name: 'Clovion',
      url: BASE
    }
  }

  return (
    <div
      className="clv-courses"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Brand-orange eyebrow pulse dot, scoped to the light courses pages. */
            .clv-courses .eyebrow-dot::before {
              background: ${ORANGE};
              box-shadow: 0 0 0 4px rgba(194, 65, 12, 0.07);
            }
          `
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      {/* Hero — everything a visitor needs to decide to start. */}
      <Section tight>
        <Container>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-60)] transition-colors hover:text-[var(--ink)]"
          >
            <ArrowRight className="rotate-180" /> All courses
          </Link>
          <div className="mx-auto mt-8 max-w-3xl text-center">
            <Eyebrow>Course</Eyebrow>
            <h1
              className="display-md mt-5 text-balance"
              style={{ fontSize: 'clamp(2.1rem, 2.8vw + 1rem, 3.25rem)' }}
            >
              {course.title}
            </h1>
            {teaser && (
              <p className="lead mt-6 text-[var(--ink-70)]">{teaser}</p>
            )}
            <div
              className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: 'var(--ink-60)'
              }}
            >
              {metaParts.map((part, i) => (
                <span key={part} className="inline-flex items-center gap-3">
                  {i > 0 && <span aria-hidden style={{ color: 'var(--ink-30)' }}>·</span>}
                  <span>{part}</span>
                </span>
              ))}
            </div>
            {first.author && (
              <div className="mt-7 flex justify-center">
                <CourseByline
                  author={first.author}
                  subline={first.author.title ?? undefined}
                />
              </div>
            )}
            <div className="mt-9">
              <Button href={startHref} size="lg" trackLocation="course-landing-hero">
                Start course <ArrowRight />
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Curriculum — the full numbered lesson list (moved off the index cards). */}
      <Section tight className="!pt-0">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div
              style={{
                borderRadius: 22,
                border: '1px solid var(--line)',
                background: 'var(--white)',
                boxShadow: 'var(--shadow-card)',
                padding: 'clamp(1.75rem, 2.5vw, 2.5rem)'
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
                Curriculum
              </span>
              <h2
                className="display-sm"
                style={{ fontSize: 'clamp(1.4rem, 1.6vw + 0.5rem, 1.9rem)', margin: '12px 0 0' }}
              >
                What&apos;s inside
              </h2>
              <ol style={{ listStyle: 'none', padding: 0, margin: '20px 0 0' }}>
                {course.curriculum.map((lesson) => (
                  <li key={lesson.slug} style={{ borderTop: '1px solid var(--line)' }}>
                    <Link
                      href={`/courses/${course.slug}/${lesson.slug}`}
                      className="group grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 py-5 sm:grid-cols-[auto_1fr_auto]"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <span
                        aria-hidden
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          letterSpacing: '0.12em',
                          color: ORANGE,
                          lineHeight: '1.6rem',
                          minWidth: 24
                        }}
                      >
                        {String(lesson.lessonNumber).padStart(2, '0')}
                      </span>
                      <span style={{ minWidth: 0 }}>
                        <span
                          className="transition-colors group-hover:text-[#C2410C]"
                          style={{
                            display: 'block',
                            fontWeight: 600,
                            fontSize: '1.02rem',
                            lineHeight: 1.45,
                            color: 'var(--ink)'
                          }}
                        >
                          {lesson.title}
                        </span>
                        {lesson.excerpt && (
                          <span
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              marginTop: 4,
                              fontSize: '0.9rem',
                              lineHeight: 1.6,
                              color: 'var(--ink-60)'
                            }}
                          >
                            {lesson.excerpt}
                          </span>
                        )}
                      </span>
                      {lesson.readMinutes ? (
                        <span
                          className="col-start-2 sm:col-start-3"
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.7rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.12em',
                            color: 'var(--ink-50)',
                            whiteSpace: 'nowrap',
                            lineHeight: '1.6rem'
                          }}
                        >
                          ~{lesson.readMinutes} min read
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ol>

              {course.totalDownloads > 0 && (
                <p
                  style={{
                    margin: 0,
                    paddingTop: 18,
                    borderTop: '1px solid var(--line)',
                    fontSize: '0.88rem',
                    color: 'var(--ink-60)'
                  }}
                >
                  Includes {course.totalDownloads} downloadable{' '}
                  {course.totalDownloads === 1
                    ? 'worksheet or template'
                    : 'worksheets & templates'}{' '}
                  — linked inside the lessons where you use them.
                </p>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Closing CTA */}
      <Section tight className="!pt-0">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Button href={startHref} size="lg" trackLocation="course-landing-footer">
              Start course <ArrowRight />
            </Button>
            <p className="mt-4 text-sm text-[var(--ink-50)]">
              Free, self-paced, no signup required.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  )
}

import type { Metadata } from 'next'
import { OG_IMAGES } from '@/lib/og'
import { notFound } from 'next/navigation'
import { Section, Container } from '@/components/ui'
import { CTABanner } from '@/components/sections'
import { ProseHtml } from '@/components/cms/ProseHtml'
import { JsonLd } from '@/components/cms/JsonLd'
import { PostHeader } from '@/components/cms/PostHeader'
import { AuthorCard } from '@/components/cms/AuthorCard'
import { ArticleToc } from '@/components/cms/ArticleToc'
import { extractToc } from '@/components/cms/toc'
import { KeyLearnings } from '@/components/courses/KeyLearnings'
import { DownloadsCard } from '@/components/courses/DownloadsCard'
import { LessonNav } from '@/components/courses/LessonNav'
import { CourseOutlineRail } from '@/components/courses/CourseOutlineRail'
import { getCourseLesson, listCourseLessons } from '@/lib/cms'
import { groupCourses } from '@/lib/courses'
import type { CourseContent } from '@/lib/cms-types'

export const revalidate = 300
export const dynamicParams = true

type Params = { courseSlug: string; lessonSlug: string }

export async function generateStaticParams() {
  const courses = groupCourses(await listCourseLessons(100))
  return courses.flatMap((course) =>
    course.lessons.map((lesson) => ({
      courseSlug: course.slug,
      lessonSlug: lesson.slug
    }))
  )
}

// The courseSlug a lesson canonically belongs under — typeData.courseSlug,
// with the same lesson-slug fallback groupCourses uses for standalone lessons.
function courseSlugOf(item: CourseContent): string {
  return item.typeData?.courseSlug ?? item.slug
}

export async function generateMetadata({
  params
}: {
  params: Params
}): Promise<Metadata> {
  const item = await getCourseLesson(params.lessonSlug)
  if (!item || courseSlugOf(item) !== params.courseSlug) {
    return { title: 'Lesson not found | Clovion AI' }
  }

  const seo = item.seo ?? {}
  const ogImage = seo.ogImage ?? item.coverImageUrl ?? undefined
  // Always emit a canonical: the CMS value when set, else this lesson's own URL
  // (resolved against metadataBase). Prevents duplicate-URL ambiguity for crawlers.
  const canonical =
    seo.canonicalUrl || `/courses/${params.courseSlug}/${params.lessonSlug}`
  return {
    title: seo.metaTitle || item.title,
    description: seo.metaDescription || item.excerpt || undefined,
    alternates: { canonical },
    // noindex,follow — a de-indexed lesson should still let crawlers traverse
    // its outbound links (don't couple follow to noIndex).
    robots: { index: !seo.noIndex, follow: true },
    openGraph: {
      title: seo.metaTitle || item.title,
      description: seo.metaDescription || item.excerpt || undefined,
      type: 'article',
      images: ogImage ? [{ url: ogImage }] : OG_IMAGES
    }
  }
}

function formatDate(iso: string | null) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Eyebrow: "Course title · Lesson 2 of 5". Degrades stepwise when the CMS
// omits the course block or lesson numbering (standalone lesson → "Course").
function lessonEyebrow(item: CourseContent): string {
  const data = item.typeData
  const courseTitle = data?.courseTitle ?? item.course?.courseTitle
  const lessonNumber = data?.lessonNumber
  const total = item.course?.lessons?.length ?? 0
  if (!courseTitle) return 'Course'
  if (!lessonNumber) return courseTitle
  if (total > 0) return `${courseTitle} · Lesson ${lessonNumber} of ${total}`
  return `${courseTitle} · Lesson ${lessonNumber}`
}

export default async function CourseLessonPage({ params }: { params: Params }) {
  const item = await getCourseLesson(params.lessonSlug)
  if (!item) notFound()
  // A lesson is only served under its own course's URL — anything else 404s
  // (prevents duplicate content at /courses/<other-course>/<lesson>).
  if (courseSlugOf(item) !== params.courseSlug) notFound()

  const published = formatDate(item.publishedAt)
  const meta = [published, item.author?.displayName].filter(Boolean) as string[]

  const course = item.course ?? null
  const courseTitle = item.typeData?.courseTitle ?? course?.courseTitle ?? null
  const keyLearnings = (item.typeData?.keyLearnings ?? []).filter(Boolean)
  const downloads = (item.typeData?.downloads ?? []).filter((d) => d?.label && d?.url)

  // Inject stable ids into the body's H2s and pull the section list for the
  // sticky TOC rail.
  const { html: bodyHtml, toc } = extractToc(item.bodyHtml)

  const outline = course?.lessons ?? []
  const hasRail = toc.length > 0 || outline.length > 0

  return (
    <article
      className="clv-light-article"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as React.CSSProperties}
    >
      <JsonLd data={item.jsonLd} />

      <PostHeader
        eyebrow={lessonEyebrow(item)}
        accentColor="#C2410C"
        title={item.title}
        coverImageUrl={item.coverImageUrl}
        excerpt={item.excerpt}
        backHref={`/courses/${params.courseSlug}`}
        backLabel={courseTitle ?? 'Back to course'}
        meta={
          meta.length > 0 ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--ink-60)]">
              {meta.map((part, i) => (
                <span key={i} className="inline-flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="text-[var(--ink-30)]">·</span>}
                  <span>{part}</span>
                </span>
              ))}
            </div>
          ) : null
        }
      />

      <Section tight className="!pt-0">
        <Container>
          {/* Two-column reading layout, same contract as /blog: sticky left
              rail (H2 TOC + course outline) + body. On < lg the rail is hidden
              and the body spans full width. */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            {hasRail && (
              <aside className="hidden lg:block">
                <div className="lg:sticky lg:top-24 flex flex-col gap-10">
                  {toc.length > 0 && <ArticleToc items={toc} accentColor="#C2410C" />}
                  {outline.length > 0 && (
                    <CourseOutlineRail
                      lessons={outline}
                      currentSlug={item.slug}
                      courseSlug={params.courseSlug}
                    />
                  )}
                </div>
              </aside>
            )}
            <div className="min-w-0 max-w-3xl">
              <ProseHtml html={bodyHtml} />

              {keyLearnings.length > 0 && (
                <div className="mt-10">
                  <KeyLearnings items={keyLearnings} />
                </div>
              )}

              {downloads.length > 0 && (
                <div className="mt-6">
                  <DownloadsCard items={downloads} />
                </div>
              )}

              {course && (
                <div className="mt-12">
                  <LessonNav
                    prev={course.prev}
                    next={course.next}
                    courseSlug={params.courseSlug}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {item.author && (
        <Section tight className="!pt-0">
          <Container>
            <div className="mx-auto max-w-3xl">
              <AuthorCard author={item.author} />
            </div>
          </Container>
        </Section>
      )}

      <CTABanner
        sub="See your AI visibility score"
        heading="Lessons stick when you apply them."
        body="Free score in 60 seconds. Enter your domain and see how the major AI engines mention you today — then use what you learned here to improve it."
        primary="Get Free Score"
        primaryHref="/free-ai-visibility-score"
        secondary="Start Free Trial"
        secondaryHref="https://app.clovion.ai/signup"
      />
    </article>
  )
}

import type { Metadata } from 'next'
import { OG_IMAGES } from '@/lib/og'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Section, Container, Button, Eyebrow } from '@/components/ui'
import { ProseHtml } from '@/components/cms/ProseHtml'
import { JsonLd } from '@/components/cms/JsonLd'
import { getContent, listSlugs } from '@/lib/cms'
import type { WebinarData } from '@/lib/cms-types'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  return (await listSlugs('WEBINAR')).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const item = await getContent('WEBINAR', params.slug)
  if (!item) return { title: 'Webinar | Clovion AI' }

  const { seo } = item
  const ogImage = seo.ogImage || item.coverImageUrl || undefined
  return {
    title: seo.metaTitle || item.title,
    description: seo.metaDescription || item.excerpt || undefined,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: { index: !seo.noIndex, follow: !seo.noIndex },
    openGraph: {
      title: seo.metaTitle || item.title,
      description: seo.metaDescription || item.excerpt || undefined,
      images: ogImage ? [ogImage] : OG_IMAGES
    }
  }
}

/** Formats the event window. Same-day -> "June 24, 2026 · 10:00 AM – 11:00 AM". */
function formatEvent(data: WebinarData): string | null {
  if (!data.startAt) return null
  const tz = data.timezone || undefined
  const start = new Date(data.startAt)
  if (Number.isNaN(start.getTime())) return null

  const dateOpts: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: tz
  }
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: tz
  }

  const datePart = start.toLocaleDateString('en-US', dateOpts)
  const startTime = start.toLocaleTimeString('en-US', timeOpts)

  let end: Date | null = null
  if (data.endAt) {
    const e = new Date(data.endAt)
    if (!Number.isNaN(e.getTime())) end = e
  }

  const tzLabel = tz ? ` ${tz}` : ''
  if (!end) return `${datePart} · ${startTime}${tzLabel}`

  const sameDay = start.toLocaleDateString('en-US', dateOpts) === end.toLocaleDateString('en-US', dateOpts)
  const endTime = end.toLocaleTimeString('en-US', timeOpts)
  if (sameDay) return `${datePart} · ${startTime} – ${endTime}${tzLabel}`

  const endDate = end.toLocaleDateString('en-US', dateOpts)
  return `${datePart} ${startTime} – ${endDate} ${endTime}${tzLabel}`
}

export default async function WebinarDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const item = await getContent('WEBINAR', params.slug)
  if (!item) notFound()

  const data = (item.typeData ?? {}) as WebinarData
  const when = formatEvent(data)
  const speakers = data.speakerNames?.filter(Boolean) ?? []

  // Is the live event in the past? Drives the recorded affordance.
  const startMs = data.startAt ? new Date(data.startAt).getTime() : NaN
  const isPast = !Number.isNaN(startMs) && startMs < Date.now()
  const recorded = data.isRecorded || isPast

  // Primary CTA: prefer the recording when it exists and the event is past/recorded;
  // otherwise drive registration for an upcoming session.
  const showRecording = recorded && !!data.recordingUrl
  const showRegister = !showRecording && !!data.registrationUrl

  const ctaHref = showRecording ? data.recordingUrl : data.registrationUrl
  const ctaLabel = showRecording ? 'Watch the recording' : 'Register'

  return (
    <div className="clv-dark clv-ai-vis-page">
      <JsonLd data={item.jsonLd} />

      <Section className="relative overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{recorded ? 'ON-DEMAND WEBINAR' : 'LIVE WEBINAR'}</Eyebrow>
            <h1 className="display-md mt-5 text-balance">{item.title}</h1>
            {item.excerpt && <p className="lead mt-6 text-[var(--ink-70)]">{item.excerpt}</p>}
          </div>

          {/* Event details block — foregrounded */}
          <div className="mt-10 max-w-3xl rounded-2xl border border-[var(--line)] bg-[var(--white)] p-7 shadow-card">
            <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {when && (
                <div>
                  <dt className="eyebrow text-[var(--ink-50)]">When</dt>
                  <dd className="mt-2 text-[var(--ink)]">{when}</dd>
                </div>
              )}
              {speakers.length > 0 && (
                <div>
                  <dt className="eyebrow text-[var(--ink-50)]">
                    {speakers.length > 1 ? 'Speakers' : 'Speaker'}
                  </dt>
                  <dd className="mt-2 text-[var(--ink)]">{speakers.join(', ')}</dd>
                </div>
              )}
            </dl>

            {ctaHref && (
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  href={ctaHref}
                  variant="primary"
                  size="lg"
                  trackLocation="webinar_detail"
                >
                  {ctaLabel}
                </Button>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {item.coverImageUrl && (
        <Section tight className="relative overflow-hidden">
          <Container>
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--subtle)]">
              <Image
                src={item.coverImageUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1024px"
                unoptimized
              />
            </div>
          </Container>
        </Section>
      )}

      <Section tight className="relative overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <ProseHtml html={item.bodyHtml} />
          </div>
        </Container>
      </Section>
    </div>
  )
}

import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Section, Container, Eyebrow, ArrowRight } from '@/components/ui'
import { ProseHtml } from '@/components/cms/ProseHtml'
import { JsonLd } from '@/components/cms/JsonLd'
import { getContent, getResource } from '@/lib/cms'
import type { CmsContent, CmsCoverImage } from '@/lib/cms-types'

// A report can be a RESEARCH-type long-form article (body IS the report) OR a
// research-flavoured RESOURCE (a downloadable file). Resolve either: try the
// RESEARCH content item first, then fall back to the gated-download endpoint
// (which serves RESOURCE). This page is intentionally UNGATED — the report
// reads in full and any attached file downloads directly, no email capture.
async function getReport(slug: string): Promise<CmsContent | null> {
  return (await getContent('RESEARCH', slug)) ?? (await getResource(slug))
}

export const dynamic = 'force-dynamic'

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || 'C'
}

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const item = await getReport(params.slug)
  if (!item) return { title: 'Research not found' }
  const seo = item.seo ?? {}
  const title = seo.metaTitle || item.title
  const description = seo.metaDescription || item.excerpt || undefined
  const ogImage = seo.ogImage || item.coverImageUrl || undefined
  return {
    title,
    description,
    alternates: { canonical: seo.canonicalUrl || `/research/${params.slug}` },
    robots: { index: !seo.noIndex, follow: true },
    openGraph: {
      title,
      description,
      type: 'article',
      ...(ogImage ? { images: [ogImage] } : {})
    }
  }
}

// Cover hero — full graphic always visible: fill (cover) only when the upload's
// own ratio is within ~12% of 16:9, otherwise contain over a blurred fill so
// nothing is cropped. srcset lets the browser fetch the right-sized variant.
function DetailCover({
  cover,
  coverImageUrl,
  title
}: {
  cover: CmsCoverImage | null
  coverImageUrl: string | null
  title: string
}) {
  const src = cover?.url ?? coverImageUrl ?? null
  if (!src) return null
  const srcSet = cover
    ? [
        cover.thumb ? `${cover.thumb} 320w` : null,
        cover.md ? `${cover.md} 768w` : null,
        cover.lg ? `${cover.lg} 1280w` : null,
        `${cover.url} ${cover.width && cover.width > 0 ? cover.width : 1600}w`
      ]
        .filter(Boolean)
        .join(', ')
    : undefined
  const ratio = cover?.width && cover?.height ? cover.width / cover.height : null
  const fill = ratio !== null && Math.abs(ratio - 16 / 9) / (16 / 9) <= 0.12
  return (
    <div
      className="aspect-[16/9]"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        border: '1px solid var(--line)',
        background: 'var(--subtle)'
      }}
    >
      {!fill && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          srcSet={srcSet}
          sizes="(min-width: 1024px) 900px, 100vw"
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(28px)',
            transform: 'scale(1.15)'
          }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={srcSet}
        sizes="(min-width: 1024px) 900px, 100vw"
        alt={title}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: fill ? 'cover' : 'contain',
          objectPosition: 'center'
        }}
      />
      <span
        aria-hidden
        style={{ position: 'absolute', inset: 0, borderRadius: 24, boxShadow: 'inset 0 0 0 1px rgba(10,10,15,0.08)', pointerEvents: 'none' }}
      />
    </div>
  )
}

export default async function ResearchDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const item = await getReport(params.slug)
  if (!item) notFound()

  const td = (item.typeData ?? {}) as {
    downloadUrl?: string
    fileLabel?: string
    resourceKind?: string
  }
  const downloadUrl = typeof td.downloadUrl === 'string' ? td.downloadUrl : null
  const date = formatDate(item.publishedAt)
  const author = item.author
  const kind = item.category?.name ?? td.resourceKind ?? 'Report'

  return (
    <div
      className="clv-research"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <JsonLd data={item.jsonLd} />

      <Section className="relative overflow-hidden">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/research"
              className="inline-flex items-center gap-1.5 text-sm"
              style={{ color: 'var(--ink-60)', textDecoration: 'none' }}
            >
              <ArrowRight className="rotate-180" /> Back to research
            </Link>

            <div className="mt-8">
              <Eyebrow>Research</Eyebrow>
              <div
                className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-50)' }}
              >
                <span style={{ color: '#C2410C' }}>{kind}</span>
                {date && <span aria-hidden style={{ height: 1, width: 20, background: 'var(--line)' }} />}
                {date && <span>{date}</span>}
              </div>
              <h1 className="display-md mt-5" style={{ lineHeight: 1.08 }}>
                {item.title}
              </h1>
              {item.excerpt && (
                <p className="lead mt-6" style={{ color: 'var(--ink-70)' }}>
                  {item.excerpt}
                </p>
              )}

              {/* Byline */}
              {author && (
                <div className="mt-7 flex items-center gap-3">
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 999,
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'var(--ink)',
                      color: '#fff',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.82rem',
                      fontWeight: 600
                    }}
                  >
                    {author.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={author.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      initials(author.displayName)
                    )}
                  </span>
                  <div className="flex flex-col">
                    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{author.displayName}</span>
                    {author.title && (
                      <span style={{ fontSize: '0.82rem', color: 'var(--ink-60)' }}>{author.title}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cover */}
          <div className="mx-auto mt-10 max-w-4xl">
            <DetailCover cover={item.coverImage} coverImageUrl={item.coverImageUrl} title={item.title} />
          </div>

          {/* Direct, ungated download */}
          {downloadUrl && (
            <div className="mx-auto mt-8 max-w-3xl">
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
                style={{ background: 'var(--ink)', color: '#fff', textDecoration: 'none' }}
              >
                Download the report{td.fileLabel ? ` (${td.fileLabel})` : ' (PDF)'} <ArrowRight />
              </a>
            </div>
          )}
        </Container>
      </Section>

      {/* Body / overview */}
      {item.bodyHtml && (
        <Section tight className="!pt-0">
          <Container>
            <div className="mx-auto max-w-3xl">
              <ProseHtml html={item.bodyHtml} />
            </div>
          </Container>
        </Section>
      )}
    </div>
  )
}

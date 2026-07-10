import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Section, Container, Eyebrow, Tag } from '@/components/ui'
import { ProseHtml } from '@/components/cms/ProseHtml'
import { JsonLd } from '@/components/cms/JsonLd'
import { AuthorCard } from '@/components/cms/AuthorCard'
import { getResource, listSlugs } from '@/lib/cms'
import type { ResourceData } from '@/lib/cms-types'
import { LeadGate } from './LeadGate'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  // Both gated types resolve under /resources/[slug] (see getResource → CMS
  // /resources/[slug], which serves RESOURCE and RESEARCH).
  const [resources, research] = await Promise.all([
    listSlugs('RESOURCE'),
    listSlugs('RESEARCH')
  ])
  return [...new Set([...resources, ...research])].map((slug) => ({ slug }))
}

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const item = await getResource(params.slug)
  if (!item) return { title: 'Resource not found | Clovion AI' }

  const { seo } = item
  const title = seo.metaTitle || item.title
  const description = seo.metaDescription || item.excerpt || undefined
  const ogImage = seo.ogImage || item.coverImageUrl || undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [ogImage] : undefined
    },
    robots: { index: !seo.noIndex, follow: !seo.noIndex },
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined
  }
}

function formatDate(value: string | null): string | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default async function ResourceDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const item = await getResource(params.slug)
  if (!item) notFound()

  const typeData = item.typeData as ResourceData | undefined
  const kind = typeData?.resourceKind
  const date = formatDate(item.publishedAt)
  const fields = item.leadForm?.fields ?? []

  return (
    <div
      className="clv-light-article"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <JsonLd data={item.jsonLd} />

      <Section className="relative overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>RESOURCE</Eyebrow>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {kind ? <Tag>{kind}</Tag> : null}
              {date ? <span className="text-sm text-[var(--ink-50)]">{date}</span> : null}
            </div>
            <h1 className="display-md mt-5">{item.title}</h1>
            {item.excerpt ? <p className="lead mt-6 text-[var(--ink-70)]">{item.excerpt}</p> : null}
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
            <div>
              {item.coverImageUrl ? (
                <div className="mb-10 overflow-hidden rounded-card border border-[var(--line)] bg-[var(--subtle)]">
                  <Image
                    src={item.coverImageUrl}
                    alt={item.title}
                    width={1200}
                    height={675}
                    className="h-auto w-full object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
              <ProseHtml html={item.bodyHtml} />
              <AuthorCard author={item.author} />
            </div>

            <div>
              <div className="lg:sticky lg:top-24">
                <LeadGate
                  slug={item.slug}
                  resourceTitle={item.title}
                  gated={item.gated}
                  fields={fields}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}

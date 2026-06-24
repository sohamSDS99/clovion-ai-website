import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Section, Container, Eyebrow, HeroShade, ArrowRight } from '@/components/ui'
import { ProseHtml } from '@/components/cms/ProseHtml'
import { JsonLd } from '@/components/cms/JsonLd'
import { getContent, listSlugs } from '@/lib/cms'
import type { NewsData } from '@/lib/cms-types'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  return (await listSlugs('NEWS')).map((slug) => ({ slug }))
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const item = await getContent('NEWS', params.slug)
  if (!item) return { title: 'News | Clovion AI' }

  const { seo } = item
  const title = seo.metaTitle || item.title
  const description = seo.metaDescription || item.excerpt || undefined
  const ogImage = seo.ogImage || item.coverImageUrl || undefined

  return {
    title,
    description,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: { index: !seo.noIndex, follow: !seo.noIndex },
    openGraph: {
      title,
      description,
      type: 'article',
      ...(ogImage ? { images: [ogImage] } : {})
    }
  }
}

export default async function NewsArticlePage({
  params
}: {
  params: { slug: string }
}) {
  const item = await getContent('NEWS', params.slug)
  if (!item) notFound()

  const data = (item.typeData ?? {}) as NewsData
  const date = formatDate(item.publishedAt)
  const dateline = data.dateline?.trim()
  const sourceUrl = data.sourceUrl?.trim()

  return (
    <>
      <JsonLd data={item.jsonLd} />

      <Section className="relative overflow-hidden">
        <HeroShade />
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>NEWS</Eyebrow>
            <h1 className="display-md mt-5">{item.title}</h1>
            {item.excerpt && (
              <p className="lead mt-6 text-ink/70">{item.excerpt}</p>
            )}

            {(date || dateline || sourceUrl) && (
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/60">
                {dateline && <span className="text-ink/80">{dateline}</span>}
                {date && <span>{date}</span>}
                {sourceUrl && (
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-ink underline underline-offset-4 transition-colors hover:text-ink/70"
                  >
                    Source
                    <ArrowRight />
                  </a>
                )}
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className="mx-auto max-w-3xl">
            {item.coverImageUrl && (
              <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-2xl border border-line bg-subtle">
                <Image
                  src={item.coverImageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  unoptimized
                />
              </div>
            )}

            <ProseHtml html={item.bodyHtml} />
          </div>
        </Container>
      </Section>
    </>
  )
}

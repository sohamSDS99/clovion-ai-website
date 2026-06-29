import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Section, Container, ArrowRight } from '@/components/ui'
import { ProseHtml } from '@/components/cms/ProseHtml'
import { JsonLd } from '@/components/cms/JsonLd'
import { PostHeader } from '@/components/cms/PostHeader'
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

  const seo = item.seo ?? {}
  const title = seo.metaTitle || item.title
  const description = seo.metaDescription || item.excerpt || undefined
  const ogImage = seo.ogImage || item.coverImageUrl || undefined
  // Always emit a canonical: CMS value when set, else this article's own URL.
  const canonical = seo.canonicalUrl || `/news/${params.slug}`

  return {
    title,
    description,
    alternates: { canonical },
    // noindex,follow — keep link traversal even when de-indexed.
    robots: { index: !seo.noIndex, follow: true },
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
    <div className="clv-dark clv-ai-vis-page">
      <JsonLd data={item.jsonLd} />

      <PostHeader
        eyebrow="NEWS"
        title={item.title}
        coverImageUrl={item.coverImageUrl}
        excerpt={item.excerpt}
        meta={
          date || dateline || sourceUrl ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--ink-60)]">
              {dateline && <span className="text-[var(--ink-80)]">{dateline}</span>}
              {date && <span>{date}</span>}
              {sourceUrl && (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[var(--ink)] underline underline-offset-4 transition-colors hover:text-[var(--ink-70)]"
                >
                  Source
                  <ArrowRight />
                </a>
              )}
            </div>
          ) : null
        }
      />

      <Section tight className="!pt-0">
        <Container>
          <div className="mx-auto max-w-3xl">
            <ProseHtml html={item.bodyHtml} />
          </div>
        </Container>
      </Section>
    </div>
  )
}

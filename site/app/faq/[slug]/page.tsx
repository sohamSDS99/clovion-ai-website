import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Section, Container, Eyebrow } from '@/components/ui'
import { ProseHtml } from '@/components/cms/ProseHtml'
import { JsonLd } from '@/components/cms/JsonLd'
import { getContent, listSlugs } from '@/lib/cms'
import type { FaqData } from '@/lib/cms-types'
import FaqAccordion from './FaqAccordion'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  return (await listSlugs('FAQ')).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const item = await getContent('FAQ', params.slug)
  if (!item) return { title: 'FAQ — Clovion AI' }

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
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export default async function FaqDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const item = await getContent('FAQ', params.slug)
  if (!item) notFound()

  const typeData = item.typeData as FaqData
  const faqItems = (typeData?.faqItems ?? []).filter(
    (q) => q?.question && q?.answer
  )

  const hasIntro = item.bodyHtml && item.bodyHtml.trim().length > 0

  return (
    <div className="clv-dark clv-ai-vis-page">
      <JsonLd data={item.jsonLd} />

      <Section className="relative overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>FAQ</Eyebrow>
            <h1 className="display-md mt-5">{item.title}</h1>
            {item.excerpt ? (
              <p className="lead mt-6 text-[var(--ink-70)]">{item.excerpt}</p>
            ) : null}
          </div>
        </Container>
      </Section>

      <Section tight className="pt-0">
        <Container>
          <div className="max-w-3xl">
            {hasIntro ? (
              <div className="mb-12">
                <ProseHtml html={item.bodyHtml} />
              </div>
            ) : null}

            {faqItems.length > 0 ? (
              <FaqAccordion items={faqItems} />
            ) : !hasIntro ? (
              <p className="text-[var(--ink-70)]">No questions have been added yet.</p>
            ) : null}
          </div>
        </Container>
      </Section>
    </div>
  )
}

import type { Metadata } from 'next'
import { OG_IMAGES } from '@/lib/og'
import { notFound } from 'next/navigation'
import { Section, Container } from '@/components/ui'
import { CTABanner } from '@/components/sections'
import { FAQAccordion } from '@/components/FAQAccordion'
import { ProseHtml } from '@/components/cms/ProseHtml'
import { JsonLd } from '@/components/cms/JsonLd'
import { PostHeader } from '@/components/cms/PostHeader'
import { AuthorCard } from '@/components/cms/AuthorCard'
import { ArticleToc } from '@/components/cms/ArticleToc'
import { extractToc } from '@/components/cms/toc'
import { getContent, listSlugs } from '@/lib/cms'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  return (await listSlugs('BLOG')).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const item = await getContent('BLOG', params.slug)
  if (!item) return { title: 'Post not found | Clovion AI' }

  const seo = item.seo ?? {}
  const ogImage = seo.ogImage ?? item.coverImageUrl ?? undefined
  // Always emit a canonical: the CMS value when set, else this post's own URL
  // (resolved against metadataBase). Prevents duplicate-URL ambiguity for crawlers.
  const canonical = seo.canonicalUrl || `/blog/${params.slug}`
  return {
    title: seo.metaTitle || item.title,
    description: seo.metaDescription || item.excerpt || undefined,
    alternates: { canonical },
    // noindex,follow — a de-indexed post should still let crawlers traverse its
    // outbound links (don't couple follow to noIndex).
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

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const item = await getContent('BLOG', params.slug)
  if (!item) notFound()

  const published = formatDate(item.publishedAt)
  const meta = [
    published,
    item.author?.displayName,
    item.category?.name
  ].filter(Boolean) as string[]

  // FAQ arrives as structured typeData (faqItems), not in bodyHtml.
  const faqItems = (((item.typeData as { faqItems?: { question: string; answer: string }[] })?.faqItems) ?? [])
    .filter((f) => f?.question && f?.answer)
    .map((f) => ({ q: f.question, a: f.answer }))

  // Inject stable ids into the body's H2s and pull the section list for the
  // sticky TOC rail.
  const { html: bodyHtml, toc } = extractToc(item.bodyHtml)

  return (
    <article
      className="clv-light-article"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as React.CSSProperties}
    >
      <JsonLd data={item.jsonLd} />

      <PostHeader
        eyebrow="Blog"
        accentColor="#C2410C"
        title={item.title}
        coverImageUrl={item.coverImageUrl}
        excerpt={item.excerpt}
        backHref="/blog"
        backLabel="Back to blog"
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
          {/* Two-column reading layout: sticky H2 rail (left) + body (right).
              On < lg the rail is hidden and the body spans full width. The
              sticky lives inside the grid track so it releases when the body
              ends, then scrolls away with the page. */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            {toc.length > 0 && (
              <aside className="hidden lg:block">
                <div className="lg:sticky lg:top-24">
                  <ArticleToc items={toc} accentColor="#C2410C" />
                </div>
              </aside>
            )}
            <div className="min-w-0 max-w-3xl">
              <ProseHtml html={bodyHtml} />
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ sits after the article (conclusion), before the author profile. */}
      {faqItems.length > 0 && <FAQAccordion items={faqItems} />}

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
        heading="Reading is fine. Measuring is better."
        body="Free score in 60 seconds. Enter your domain and see how the major AI engines mention you, which competitors appear, and where to improve."
        primary="Get Free Score"
        primaryHref="/free-ai-visibility-score"
        secondary="Start Free Trial"
        secondaryHref="https://app.clovion.ai/signup"
      />
    </article>
  )
}

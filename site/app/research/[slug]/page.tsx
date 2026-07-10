import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
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
import { getContent, getResource } from '@/lib/cms'
import type { CmsContent, FaqData } from '@/lib/cms-types'

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
      ...(ogImage ? { images: [ogImage] } : { images: OG_IMAGES })
    }
  }
}

export default async function ResearchDetailPage({
  params
}: {
  params: { slug: string }
}) {
  const item = await getReport(params.slug)
  if (!item) notFound()

  const td = (item.typeData ?? {}) as { resourceKind?: string } & FaqData
  const published = formatDate(item.publishedAt)
  const kind = item.category?.name ?? td.resourceKind ?? 'Report'
  const meta = [published, item.author?.displayName, kind].filter(Boolean) as string[]

  // FAQ arrives as structured typeData (faqItems), not in bodyHtml — render it
  // as its own section below the article.
  const faqItems = (td.faqItems ?? [])
    .filter((f) => f?.question && f?.answer)
    .map((f) => ({ q: f.question, a: f.answer }))

  // Inject stable ids into the body's H2s and pull the section list for the
  // sticky TOC rail — same reading layout as a blog post.
  const { html: bodyHtml, toc } = extractToc(item.bodyHtml)

  return (
    <article
      className="clv-light-article"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <JsonLd data={item.jsonLd} />

      <PostHeader
        eyebrow="Research"
        accentColor="#C2410C"
        coverFit="contain"
        title={item.title}
        coverImageUrl={item.coverImageUrl}
        excerpt={item.excerpt}
        backHref="/research"
        backLabel="Back to research"
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

      {item.bodyHtml && (
        <Section tight className="!pt-0">
          <Container>
            {toc.length > 0 ? (
              /* Two-column reading layout: sticky H2 rail (left) + body (right),
                 identical to the blog post template. */
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
                <aside className="hidden lg:block">
                  <div className="lg:sticky lg:top-24">
                    <ArticleToc items={toc} accentColor="#C2410C" />
                  </div>
                </aside>
                <div className="min-w-0 max-w-3xl">
                  <ProseHtml html={bodyHtml} />
                </div>
              </div>
            ) : (
              /* No H2s → no rail; body reads full measure, centered (a short
                 report body must not collapse into the empty rail's column). */
              <div className="mx-auto max-w-3xl">
                <ProseHtml html={bodyHtml} />
              </div>
            )}
          </Container>
        </Section>
      )}

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

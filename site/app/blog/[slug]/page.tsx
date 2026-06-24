import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Section, Container, Eyebrow, ArrowRight } from '@/components/ui'
import { CTABanner } from '@/components/sections'
import { ProseHtml } from '@/components/cms/ProseHtml'
import { JsonLd } from '@/components/cms/JsonLd'
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
  return {
    title: seo.metaTitle || item.title,
    description: seo.metaDescription || item.excerpt || undefined,
    alternates: seo.canonicalUrl ? { canonical: seo.canonicalUrl } : undefined,
    robots: { index: !seo.noIndex, follow: !seo.noIndex },
    openGraph: {
      title: seo.metaTitle || item.title,
      description: seo.metaDescription || item.excerpt || undefined,
      type: 'article',
      images: ogImage ? [{ url: ogImage }] : undefined
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

  return (
    <article>
      <JsonLd data={item.jsonLd} />

      <Section className="relative overflow-hidden">
        <Container>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-ink transition-colors"
          >
            <ArrowRight className="rotate-180" /> Back to blog
          </Link>
          <div className="mt-8 max-w-3xl">
            <Eyebrow>Blog</Eyebrow>
            <h1 className="display-md mt-5 text-balance">{item.title}</h1>
            {item.excerpt && <p className="lead mt-6 text-ink/70">{item.excerpt}</p>}
            {meta.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/60">
                {meta.map((part, i) => (
                  <span key={i} className="inline-flex items-center gap-3">
                    {i > 0 && <span aria-hidden className="text-ink/30">·</span>}
                    <span>{part}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </Container>
      </Section>

      {item.coverImageUrl && (
        <Section tight className="!pt-0">
          <Container>
            <div className="overflow-hidden rounded-[24px] border border-line">
              {/* CMS-hosted cover image; external host, so plain <img>. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.coverImageUrl}
                alt={item.title}
                className="w-full h-auto object-cover"
              />
            </div>
          </Container>
        </Section>
      )}

      <Section tight className={item.coverImageUrl ? '!pt-2' : '!pt-0'}>
        <Container>
          <div className="max-w-3xl">
            <ProseHtml html={item.bodyHtml} />
          </div>
        </Container>
      </Section>

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

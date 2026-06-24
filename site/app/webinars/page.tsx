import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Container, Card, Eyebrow, ArrowRight } from '@/components/ui'
import { listContent } from '@/lib/cms'
import type { CmsSummary } from '@/lib/cms-types'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Webinars | Clovion AI',
  description:
    'Live sessions and on-demand recordings on AI visibility, generative engine optimization, and how brands earn AI recommendations.'
}

function formatDate(value: string | null | undefined): string | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function WebinarsPage() {
  const { items } = await listContent('WEBINAR', { limit: 100 })

  return (
    <div className="clv-dark clv-ai-vis-page">
      <Section className="relative overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>WEBINARS</Eyebrow>
            <h1 className="display-md mt-5">Watch and learn.</h1>
            <p className="lead mt-6">
              Live sessions and on-demand recordings on AI visibility, generative engine
              optimization, and how the best brands earn AI recommendations.
            </p>
          </div>
        </Container>
      </Section>

      <Section tight className="relative overflow-hidden">
        <Container>
          {items.length === 0 ? (
            <div className="card p-12 text-center">
              <h2 className="display-sm">Nothing published yet.</h2>
              <p className="lead mt-4">
                We&rsquo;re lining up our next sessions. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {items.map((item) => (
                <WebinarCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  )
}

function WebinarCard({ item }: { item: CmsSummary }) {
  const date = formatDate(item.publishedAt)
  return (
    <Card as="article" className="group flex flex-col">
      <Link href={`/webinars/${item.slug}`} className="flex flex-1 flex-col">
        {date && <span className="eyebrow text-[var(--ink-50)]">{date}</span>}
        <h2 className="display-sm mt-3 text-balance">{item.title}</h2>
        {item.excerpt && (
          <p className="mt-3 line-clamp-3 text-[var(--ink-70)]">{item.excerpt}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm text-[var(--ink)] transition-colors group-hover:text-[var(--ink-60)]">
          View webinar
          <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </Card>
  )
}

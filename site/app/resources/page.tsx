import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Container, Eyebrow, Card, Tag, ArrowRight } from '@/components/ui'
import { listContent } from '@/lib/cms'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Resources | Clovion AI',
  description:
    'Guides, playbooks, and reports on AI visibility, GEO, and answer-engine optimization. Download the ones that fit your team.'
}

function formatDate(value: string | null): string | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default async function ResourcesPage() {
  const { items } = await listContent('RESOURCE', { limit: 60 })

  return (
    <div className="clv-dark clv-ai-vis-page">
      <Section className="relative overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>RESOURCES</Eyebrow>
            <h1 className="display-md mt-5">Guides, playbooks, and reports.</h1>
            <p className="lead mt-6">
              Practical material on AI visibility, GEO, and answer-engine optimization. Pick what
              fits your team and download it in a couple of clicks.
            </p>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          {items.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="display-sm">Nothing published yet.</p>
              <p className="lead mt-4">
                New resources are on the way. Check back soon.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {items.map((item) => {
                const kind = item.category?.name
                const date = formatDate(item.publishedAt)
                return (
                  <li key={item.id}>
                    <Link href={`/resources/${item.slug}`} className="group block h-full">
                      <Card as="article" className="flex h-full flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          {kind ? <Tag>{kind}</Tag> : null}
                          {date ? <span className="text-sm text-[var(--ink-50)]">{date}</span> : null}
                        </div>
                        <h2 className="display-sm mt-4">{item.title}</h2>
                        {item.excerpt ? (
                          <p className="mt-3 text-[var(--ink-70)]">{item.excerpt}</p>
                        ) : null}
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm text-[var(--ink)] transition-colors group-hover:text-[var(--ink-70)]">
                          View resource
                          <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Card>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </Container>
      </Section>
    </div>
  )
}

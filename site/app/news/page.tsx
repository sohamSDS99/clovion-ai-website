import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Container, Eyebrow, Card, ArrowRight } from '@/components/ui'
import { listContent } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'News | Clovion AI',
  description:
    'The latest news, announcements, and press from Clovion AI — product launches, milestones, and what we are building next.'
}

function formatDate(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function NewsIndexPage() {
  const { items } = await listContent('NEWS')

  return (
    <div className="clv-dark clv-ai-vis-page">
      <Section className="relative overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>NEWS</Eyebrow>
            <h1 className="display-md mt-5">Latest news.</h1>
            <p className="lead mt-6">
              Announcements, press, and milestones from the team building Clovion AI.
            </p>
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          {items.length === 0 ? (
            <div className="card mx-auto max-w-xl px-8 py-16 text-center">
              <h2 className="display-sm">Nothing published yet.</h2>
              <p className="mt-4 text-[var(--ink-70)]">
                There is no news to show right now. Check back soon for the latest from Clovion AI.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {items.map((item) => {
                const date = formatDate(item.publishedAt)
                return (
                  <Card key={item.id} as="article" className="group flex flex-col">
                    <Link href={`/news/${item.slug}`} className="flex h-full flex-col">
                      {date && (
                        <span className="eyebrow text-[var(--ink-50)]">{date}</span>
                      )}
                      <h2 className="mt-3 text-xl leading-snug">{item.title}</h2>
                      {item.excerpt && (
                        <p className="mt-3 text-[var(--ink-70)] line-clamp-3">{item.excerpt}</p>
                      )}
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-[var(--ink)] transition-colors group-hover:text-[var(--ink-70)]">
                        Read article
                        <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </Card>
                )
              })}
            </div>
          )}
        </Container>
      </Section>
    </div>
  )
}

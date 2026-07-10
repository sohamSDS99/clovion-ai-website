import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Container, Eyebrow, Card, ArrowRight } from '@/components/ui'
import { listContent } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'FAQ — Clovion AI',
  description:
    'Answers to common questions about AI visibility, GEO, and how Clovion helps brands understand how AI represents them.',
}

export default async function FaqListPage() {
  const { items } = await listContent('FAQ')

  return (
    <div className="clv-dark clv-ai-vis-page">
      {/* Hero — tight vertical rhythm; default section padding left dead space
          above the title. Keeps its bottom padding as the gap (content is pt-0). */}
      <Section tight className="relative overflow-hidden">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>FAQ</Eyebrow>
            <h1 className="display-md mt-5">Questions, answered.</h1>
            <p className="lead mt-6">
              Clear answers on AI visibility, GEO, and how Clovion measures the
              way AI engines see and recommend your brand.
            </p>
          </div>
        </Container>
      </Section>

      <Section tight className="pt-0">
        <Container>
          {items.length === 0 ? (
            <div className="card px-8 py-16 text-center">
              <h2 className="display-sm">Nothing published yet.</h2>
              <p className="lead mx-auto mt-4 max-w-xl">
                We&rsquo;re putting our answers together. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id} as="article" className="relative flex flex-col">
                  <h2 className="text-lg leading-snug">
                    <Link
                      href={`/faq/${item.slug}`}
                      className="after:absolute after:inset-0 hover:text-[var(--ink-70)]"
                    >
                      {item.title}
                    </Link>
                  </h2>
                  {item.excerpt ? (
                    <p className="mt-3 text-sm leading-relaxed text-[var(--ink-70)]">
                      {item.excerpt}
                    </p>
                  ) : null}
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-[var(--ink-60)]">
                    Read answers <ArrowRight />
                  </span>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </div>
  )
}

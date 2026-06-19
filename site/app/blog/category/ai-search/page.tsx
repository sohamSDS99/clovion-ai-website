import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Container, Button, Eyebrow, Tag, ArrowRight, HeroShade } from '@/components/ui'
import { blogPosts, blogCategories } from '@/lib/content'
import { LiveIndexWidget } from './LiveIndexWidget'

export const metadata: Metadata = {
  title: 'AI Search — the new SERP | Clovion AI',
  description:
    'How buyers actually use ChatGPT, Perplexity, and AI Overviews — what those engines cite, where the traffic is moving, and how to show up.'
}

const ACTIVE_SLUG = 'ai-search'

const aiSearchPosts = blogPosts.filter((p) => p.category === ACTIVE_SLUG)
const featured = aiSearchPosts[0]
const remaining = aiSearchPosts.slice(1)
const otherCategories = blogCategories.filter((c) => c.slug !== ACTIVE_SLUG)

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Curated post list per the page brief. Posts not yet in /lib/content fall
// back to the category page so the route never 404s.
const HEADLINE_LIST = [
  {
    title: 'Why ChatGPT cites Wikipedia 47% of the time',
    slug: null,
    author: 'Daniel Park',
    readTime: '7 min',
    tag: 'Research',
    date: '2026-06-05'
  },
  {
    title: "Perplexity's source diversity index (we built one)",
    slug: null,
    author: 'Sofia Mendes',
    readTime: '9 min',
    tag: 'Research',
    date: '2026-05-28'
  },
  {
    title: 'The Zero-Click Economy report',
    slug: 'the-zero-click-economy',
    author: 'Sofia Mendes',
    readTime: '12 min',
    tag: 'Research',
    date: '2026-03-15'
  },
  {
    title: 'AI Overviews vs traditional SERPs — a side-by-side study',
    slug: 'ai-overviews-vs-ai-mode',
    author: 'Marcus Webb',
    readTime: '7 min',
    tag: 'Engineering',
    date: '2026-05-07'
  },
  {
    title: 'How sentiment shifts week-over-week on Claude',
    slug: null,
    author: 'Eva Reinhardt',
    readTime: '6 min',
    tag: 'Opinion',
    date: '2026-04-29'
  }
] as const

export default function BlogAISearchCategoryPage() {
  return (
    <main className="bg-cream">
      {/* ---------------------------------------------------------------- Hero */}
      <Section bg="gradient" className="relative overflow-hidden">
        <HeroShade />
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Category</Eyebrow>
            <h1 className="display-lg mt-5">AI search, decoded.</h1>
            <p className="lead mt-6 text-ink/70 max-w-2xl">
              ChatGPT, Perplexity, AI Overviews. How buyers actually use them, what they cite, and where the traffic is moving.
            </p>
            <div className="mt-8 flex items-center gap-4 text-sm text-ink/60">
              <span className="font-semibold text-ink">8 posts</span>
              <span className="h-1 w-1 rounded-full bg-ink/30" />
              <span>Updated weekly</span>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------------------------------------------------- Featured */}
      <section className="bg-white border-y border-line">
        <Container className="py-16 md:py-20">
          {featured ? (
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-stretch">
                {/* Glyph */}
                <div className="md:col-span-5 relative overflow-hidden rounded-2xl bg-subtle border border-line min-h-[280px] md:min-h-[360px] flex items-center justify-center">
                  <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
                  <span
                    className="relative italic select-none text-ink"
                    style={{
                      fontSize: '18rem',
                      lineHeight: 0.85,
                      letterSpacing: '-0.06em',
                      fontFamily: 'Georgia, "Times New Roman", serif'
                    }}
                    aria-hidden
                  >
                    AI
                  </span>
                </div>
                {/* Copy */}
                <div className="md:col-span-7 flex flex-col">
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-ink/50">
                    <span className="font-semibold text-ink/70">Latest</span>
                    <span className="h-px w-8 bg-ink/20" />
                    <span>{featured.tag}</span>
                  </div>
                  <h2 className="display-md mt-5 text-ink group-hover:underline decoration-ink/30 underline-offset-8">
                    {featured.title}
                  </h2>
                  <p className="lead mt-5 text-ink/70 max-w-xl">{featured.excerpt}</p>
                  <div className="mt-auto pt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/60">
                    <span className="font-semibold text-ink">{featured.author}</span>
                    <span>·</span>
                    <span>{featured.role}</span>
                    <span className="h-1 w-1 rounded-full bg-ink/30" />
                    <span>{formatDate(featured.date)}</span>
                    <span className="h-1 w-1 rounded-full bg-ink/30" />
                    <span>{featured.readTime}</span>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    Read the post
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          ) : null}
        </Container>
      </section>

      {/* ----------------------------------------------------- Tag bar (sticky) */}
      <div className="sticky top-16 z-30 bg-cream/90 backdrop-blur border-b border-line">
        <Container>
          <div className="flex items-center gap-3 py-4 overflow-x-auto">
            <span className="text-xs uppercase tracking-[0.18em] text-ink/50 mr-2 shrink-0">Browse</span>
            <Link
              href="/blog"
              className="shrink-0 text-sm px-3.5 py-1.5 rounded-full border border-line bg-white text-ink/70 hover:text-ink hover:border-ink/30 transition-colors"
            >
              All
            </Link>
            {blogCategories.map((cat) => {
              const active = cat.slug === ACTIVE_SLUG
              return (
                <Link
                  key={cat.slug}
                  href={`/blog/category/${cat.slug}`}
                  className={
                    active
                      ? 'shrink-0 text-sm px-3.5 py-1.5 rounded-full bg-black text-white font-semibold'
                      : 'shrink-0 text-sm px-3.5 py-1.5 rounded-full border border-line bg-white text-ink/70 hover:text-ink hover:border-ink/30 transition-colors'
                  }
                >
                  {cat.label}
                </Link>
              )
            })}
          </div>
        </Container>
      </div>

      {/* ---------------------------------------------------------- Post list */}
      <Section>
        <Container>
          <div className="flex items-end justify-between mb-10 md:mb-14">
            <div>
              <Eyebrow>Latest in AI Search</Eyebrow>
              <h2 className="display-md mt-4">Eight reads. The shape of the new SERP.</h2>
            </div>
            <p className="hidden md:block text-sm text-ink/60 max-w-xs text-right">
              Research, opinion, and engineering. We publish what we actually use.
            </p>
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {HEADLINE_LIST.map((post, i) => {
              const href = post.slug ? `/blog/${post.slug}` : `/blog/category/${ACTIVE_SLUG}`
              return (
                <li key={post.title}>
                  <Link href={href} className="group flex items-start md:items-center gap-6 md:gap-10 py-7 md:py-9">
                    <span className="text-sm font-mono text-ink/40 w-8 shrink-0 mt-1 md:mt-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <Tag>{post.tag}</Tag>
                        <span className="text-xs text-ink/50">{formatDate(post.date)}</span>
                        <span className="text-xs text-ink/30">·</span>
                        <span className="text-xs text-ink/50">{post.readTime}</span>
                      </div>
                      <h3 className="text-2xl md:text-[1.65rem] font-semibold text-ink tracking-tight leading-snug group-hover:underline decoration-ink/30 underline-offset-8">
                        {post.title}
                      </h3>
                      <div className="mt-3 text-sm text-ink/60">By {post.author}</div>
                    </div>
                    <ArrowRight className="text-ink/40 group-hover:text-ink group-hover:translate-x-1 transition-all shrink-0 mt-1.5 md:mt-0" />
                  </Link>
                </li>
              )
            })}
            {remaining
              .filter((p) => !HEADLINE_LIST.some((h) => h.slug === p.slug))
              .map((post, i) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group flex items-start md:items-center gap-6 md:gap-10 py-7 md:py-9">
                    <span className="text-sm font-mono text-ink/40 w-8 shrink-0 mt-1 md:mt-0">
                      {String(HEADLINE_LIST.length + i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <Tag>{post.tag}</Tag>
                        <span className="text-xs text-ink/50">{formatDate(post.date)}</span>
                        <span className="text-xs text-ink/30">·</span>
                        <span className="text-xs text-ink/50">{post.readTime}</span>
                      </div>
                      <h3 className="text-2xl md:text-[1.65rem] font-semibold text-ink tracking-tight leading-snug group-hover:underline decoration-ink/30 underline-offset-8">
                        {post.title}
                      </h3>
                      <p className="mt-3 text-base text-ink/65 max-w-2xl">{post.excerpt}</p>
                      <div className="mt-3 text-sm text-ink/60">By {post.author}</div>
                    </div>
                    <ArrowRight className="text-ink/40 group-hover:text-ink group-hover:translate-x-1 transition-all shrink-0 mt-1.5 md:mt-0" />
                  </Link>
                </li>
              ))}
          </ul>
        </Container>
      </Section>

      {/* ---------------------------------- Section 5: Live Clovion Index widget */}
      <Section bg="ink" className="relative overflow-hidden">
        {/* Dot grid texture */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
        </div>
        <Container className="relative">
          <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-start mb-10 md:mb-14">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                </span>
                <span className="text-xs uppercase tracking-[0.22em] text-white/70 font-semibold">Live · Clovion Index</span>
              </div>
              <h2 className="display-md text-white">Last 7 days of AI search citation movements.</h2>
              <p className="lead mt-5 text-white/70 max-w-xl">
                Aggregate citation score across ChatGPT, Perplexity, Claude, Gemini, and AI Overviews. Refreshed daily. Eight tracked brands.
              </p>
            </div>
            <div className="md:col-span-5 md:pt-3">
              <div className="font-mono text-[11px] text-white/50 uppercase tracking-[0.16em] mb-4">Methodology</div>
              <p className="text-sm text-white/60 leading-relaxed">
                Score = weighted citation share across the five engines, normalized to a 0–100 scale. Movement is the seven-day delta. Pulled from the same dataset we ship to paying customers.
              </p>
              <Button href="/customers" variant="invert" size="sm" className="mt-6">
                See full Index <ArrowRight />
              </Button>
            </div>
          </div>

          <LiveIndexWidget />

          <div className="mt-8 grid md:grid-cols-3 gap-6 text-sm text-white/60">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 mb-2">Top mover</div>
              <div className="text-white text-base font-semibold">Webflow · +5.0</div>
              <p className="mt-2">Citation path work on third-party review sites is compounding into the engines this week.</p>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 mb-2">Quietest</div>
              <div className="text-white text-base font-semibold">Notion · +0.2</div>
              <p className="mt-2">Notion already scores high. The room to move is narrow without a deliberate fix push.</p>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 mb-2">Recovery</div>
              <div className="text-white text-base font-semibold">Loom · -1.1</div>
              <p className="mt-2">A small dip mid-week. Sentiment improved on Claude in the last 48 hours.</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------------- Section 6: Newsletter + cross-category strip */}
      <Section bg="subtle">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
            {/* Newsletter band */}
            <div>
              <Eyebrow>The brief</Eyebrow>
              <h2 className="display-sm mt-4">Get the AI Search brief in your inbox.</h2>
              <p className="mt-5 text-ink/70 max-w-md">
                One email a week. New research, what moved in the Index, and one sharp take. No fluff, never a digest.
              </p>
              <form className="mt-7 flex flex-col sm:flex-row gap-3 max-w-md" action="/contact" method="get">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="flex-1 h-12 px-4 rounded-lg border border-line bg-white text-ink placeholder:text-ink/40 focus:outline-none focus:border-ink/40 focus:ring-2 focus:ring-ink/10"
                  aria-label="Email"
                />
                <Button size="lg" variant="primary">
                  Subscribe
                </Button>
              </form>
              <p className="mt-4 text-xs text-ink/50">
                We use your email to send the brief. Nothing else. Unsubscribe in one click.
              </p>
            </div>

            {/* Cross-category strip */}
            <div>
              <div className="text-xs uppercase tracking-[0.18em] text-ink/50 mb-5 font-semibold">Keep reading</div>
              <div className="space-y-4">
                {otherCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/blog/category/${cat.slug}`}
                    className="group block bg-white border border-line rounded-xl p-6 hover:border-ink/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-mono uppercase tracking-[0.16em] text-ink/50">
                            {cat.label}
                          </span>
                          <span className="text-xs text-ink/40">
                            {blogPosts.filter((p) => p.category === cat.slug).length} posts
                          </span>
                        </div>
                        <p className="text-ink leading-snug">{cat.desc}</p>
                      </div>
                      <ArrowRight className="text-ink/40 group-hover:text-ink group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>
                  </Link>
                ))}
                <Link
                  href="/blog"
                  className="group flex items-center justify-between bg-black text-white rounded-xl p-6 hover:bg-ink transition-colors"
                >
                  <div>
                    <div className="text-xs font-mono uppercase tracking-[0.16em] text-white/60 mb-2">All categories</div>
                    <p>Browse every post on the blog.</p>
                  </div>
                  <ArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Final CTA strip */}
      <section className="border-t border-line bg-cream">
        <Container className="py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="display-sm">Want your brand in the Index?</h3>
              <p className="mt-4 text-ink/70">
                The free score runs the same model that powers what you just read. 24 hours to a real number.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/free-ai-visibility-score" trackLocation="blog_category_ai_search_final_cta" variant="primary" size="lg">
                Get Free Score <ArrowRight />
              </Button>
              <Button href="/pricing" trackLocation="blog_category_ai_search_final_cta" variant="secondary" size="lg">
                See pricing
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}

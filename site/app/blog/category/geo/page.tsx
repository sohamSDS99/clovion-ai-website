import Link from 'next/link'
import { Section, Container, Eyebrow, Tag, ArrowRight, HeroShade } from '@/components/ui'
import { CTABanner } from '@/components/sections'
import { blogPosts, blogCategories } from '@/lib/content'

export const metadata = {
  title: 'GEO — Generative Engine Optimization | Clovion AI',
  description:
    'Methodologies, benchmarks, and case studies on generative engine optimization. How AI engines retrieve, rank, and cite brand content — and how to move the needle.'
}

const geoPosts = blogPosts.filter((post) => post.category === 'geo')
const featured = geoPosts[0]
const rest = geoPosts.slice(1)

const featuredGlyph = featured?.slug === 'schema-patches-that-move-citations'
  ? 'SCHEMA'
  : featured?.slug === 'citation-paths-explained'
    ? 'CITES'
    : featured?.slug === 'what-is-geo'
      ? 'GEO'
      : 'GEO'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function BlogCategoryGeoPage() {
  return (
    <main>
      {/* Hero --------------------------------------------------------------- */}
      <Section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10 opacity-40" aria-hidden />
        <HeroShade />
        <Container>
          <div className="max-w-4xl">
            <Eyebrow>CATEGORY</Eyebrow>
            <h1 className="display-lg mt-5">
              Everything GEO.
            </h1>
            <p className="lead mt-6 text-ink/70 max-w-2xl">
              Everything we have learned about how AI engines retrieve, rank, and cite brand content.
              Methodologies, benchmarks, and the cases that proved them.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm font-mono text-ink/50">
              <span>{geoPosts.length} posts</span>
              <span className="w-1 h-1 rounded-full bg-ink/30" aria-hidden />
              <span>Updated weekly</span>
              <span className="w-1 h-1 rounded-full bg-ink/30" aria-hidden />
              <Link href="/blog" className="hover:text-ink transition-colors">
                Back to all posts
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured ----------------------------------------------------------- */}
      {featured ? (
        <Section tight className="bg-white border-y border-[color:var(--line)]">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
              {/* Glyph artwork */}
              <div className="lg:col-span-5 relative">
                <div className="aspect-[4/5] lg:aspect-auto lg:h-full rounded-2xl border border-[color:var(--line)] bg-subtle flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
                  <div className="relative z-10 text-center px-4">
                    <span
                      className="block italic font-serif text-ink leading-none"
                      style={{ fontSize: 'clamp(6rem, 18vw, 18rem)', letterSpacing: '-0.03em' }}
                    >
                      {featuredGlyph}
                    </span>
                    <span className="mt-4 inline-block text-xs font-mono uppercase tracking-[0.18em] text-ink/40">
                      Featured · {featured.readTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured copy */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.18em] text-ink/50">
                  <span>GEO</span>
                  <span className="w-1 h-1 rounded-full bg-ink/30" aria-hidden />
                  <span>{featured.tag}</span>
                  <span className="w-1 h-1 rounded-full bg-ink/30" aria-hidden />
                  <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                </div>
                <h2 className="display-md mt-5">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="hover:text-ink/80 transition-colors underline-offset-4 hover:underline decoration-ink/30"
                  >
                    {featured.title}
                  </Link>
                </h2>
                <p className="lead mt-5 text-ink/70 max-w-xl">{featured.excerpt}</p>
                <div className="mt-7 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-ink text-white flex items-center justify-center text-sm font-semibold">
                    {featured.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-ink">{featured.author}</div>
                    <div className="text-ink/50">{featured.role}</div>
                  </div>
                </div>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-ink group w-fit"
                >
                  Read the full piece
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      ) : null}

      {/* Sticky category bar ----------------------------------------------- */}
      <div className="sticky top-16 z-20 bg-bg/95 backdrop-blur border-b border-[color:var(--line)]">
        <Container>
          <div className="flex items-center gap-2 py-4 overflow-x-auto gradient-mask-edges">
            <span className="shrink-0 text-xs font-mono uppercase tracking-[0.18em] text-ink/40 pr-2">
              Filter
            </span>
            <Link
              href="/blog"
              className="shrink-0 px-3.5 py-1.5 rounded-full text-sm border border-[color:var(--line)] text-ink/70 hover:bg-subtle hover:text-ink transition-colors"
            >
              All
            </Link>
            {blogCategories.map((cat) => {
              const isActive = cat.slug === 'geo'
              return (
                <Link
                  key={cat.slug}
                  href={`/blog/category/${cat.slug}`}
                  className={
                    isActive
                      ? 'shrink-0 px-3.5 py-1.5 rounded-full text-sm bg-ink text-white border border-ink'
                      : 'shrink-0 px-3.5 py-1.5 rounded-full text-sm border border-[color:var(--line)] text-ink/70 hover:bg-subtle hover:text-ink transition-colors'
                  }
                >
                  {cat.label}
                </Link>
              )
            })}
            <span className="shrink-0 ml-3 text-xs font-mono text-ink/40">
              {geoPosts.length} in GEO
            </span>
          </div>
        </Container>
      </div>

      {/* Post list --------------------------------------------------------- */}
      <Section>
        <Container>
          <div className="flex items-end justify-between mb-10">
            <div>
              <Eyebrow>Archive</Eyebrow>
              <h2 className="display-sm mt-4">All GEO posts.</h2>
            </div>
            <span className="hidden md:block text-sm font-mono text-ink/40">
              Sorted by date · newest first
            </span>
          </div>

          <ul className="divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
            {rest.map((post, idx) => (
              <li key={post.slug} className="group">
                <Link
                  href={`/blog/${post.slug}`}
                  className="grid grid-cols-12 gap-4 md:gap-8 py-7 md:py-9 hover:bg-subtle/40 transition-colors px-2 -mx-2 rounded-lg"
                >
                  <div className="col-span-2 md:col-span-1 text-xs font-mono text-ink/40 pt-1">
                    {String(idx + 2).padStart(2, '0')}
                  </div>
                  <div className="col-span-10 md:col-span-6">
                    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.18em] text-ink/50 mb-3">
                      <span>{post.tag}</span>
                      <span className="w-1 h-1 rounded-full bg-ink/30" aria-hidden />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display tracking-[-0.02em] text-ink leading-tight">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-ink/60 text-sm md:text-base leading-relaxed max-w-xl">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="col-span-8 md:col-span-3 text-sm flex flex-col justify-start pt-1">
                    <span className="text-ink/70 font-semibold">{post.author}</span>
                    <span className="text-ink/45 text-xs mt-0.5">{post.role}</span>
                  </div>
                  <div className="col-span-4 md:col-span-2 text-right flex flex-col items-end justify-start pt-1">
                    <span className="text-xs font-mono text-ink/40">{post.readTime}</span>
                    <ArrowRight className="w-4 h-4 mt-3 text-ink/40 transition-all group-hover:text-ink group-hover:translate-x-1" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {rest.length === 0 ? (
            <div className="border border-dashed border-[color:var(--line)] rounded-2xl p-10 text-center">
              <p className="text-ink/60">More GEO posts shipping weekly.</p>
            </div>
          ) : null}
        </Container>
      </Section>

      {/* Cross-category recommendations ------------------------------------ */}
      <Section tight bg="subtle">
        <Container>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-sm">
            <span className="text-ink/40 uppercase tracking-[0.18em] text-xs">Also explore:</span>
            <Link
              href="/blog/category/ai-search"
              className="text-ink hover:text-ink/60 transition-colors underline-offset-4 hover:underline decoration-ink/30"
            >
              AI Search
            </Link>
            <span className="text-ink/20">/</span>
            <Link
              href="/blog/category/seo"
              className="text-ink hover:text-ink/60 transition-colors underline-offset-4 hover:underline decoration-ink/30"
            >
              SEO
            </Link>
            <span className="text-ink/20">/</span>
            <Link
              href="/blog"
              className="text-ink/60 hover:text-ink transition-colors underline-offset-4 hover:underline decoration-ink/30"
            >
              All categories
            </Link>
          </div>
        </Container>
      </Section>

      {/* Newsletter band --------------------------------------------------- */}
      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center border border-[color:var(--line)] rounded-3xl p-8 md:p-12 bg-white">
            <div className="lg:col-span-7">
              <Eyebrow>Newsletter</Eyebrow>
              <h2 className="display-sm mt-4">The GEO brief, in your inbox.</h2>
              <p className="lead mt-5 text-ink/70 max-w-xl">
                One short email a week. New research, the fix patterns we are seeing across customer
                data, and the engine changes that matter. No filler, no recaps of news you already read.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Tag>Weekly</Tag>
                <Tag>Methodology</Tag>
                <Tag>Benchmarks</Tag>
                <span className="text-xs font-mono text-ink/40 ml-1">
                  4,200+ marketers and engineers
                </span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="flex-1 h-12 px-4 rounded-xl border border-[color:var(--line)] bg-bg text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/40 transition-all"
                />
                <button
                  type="submit"
                  className="btn btn-primary h-12 px-6 text-base whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="mt-3 text-xs text-ink/40 font-mono">
                Unsubscribe in one click. We never share your email.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <CTABanner
        sub="See your GEO score"
        heading="The category is moving. Know where you stand on it."
        body="Get a free visibility score across ChatGPT, Claude, Gemini, and Perplexity in 24 hours. No card. The top 10 prioritized GEO fixes ship with the report."
        primary="Get free score"
        primaryHref="/free-ai-visibility-score"
        secondary="Start free trial"
        secondaryHref="/pricing"
      />
    </main>
  )
}

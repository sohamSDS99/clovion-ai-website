import Link from 'next/link'
import { Section, Container, Eyebrow, Tag, ArrowRight, HeroShade } from '@/components/ui'
import { CTABanner } from '@/components/sections'
import { blogCategories } from '@/lib/content'

export const metadata = {
  title: 'SEO — what carries into the AI era | Clovion AI',
  description:
    'Six posts for SEO teams moving into generative engines. Where SEO still ships traffic, where it diverges from GEO, and the patterns that survive the transition.'
}

// Curated SEO archive, hardcoded so the slate is exactly six pieces
// shaped for the SEO-to-GEO transition narrative.
const seoPosts = [
  {
    slug: 'seo-to-geo-handoff',
    title: 'From SEO to GEO — a practical migration',
    excerpt:
      'The overlap is real but smaller than most teams hope. Here is a stage-by-stage migration plan from a classic SEO program to one that also moves AI citations, with the artifacts you can keep and the ones to retire.',
    author: 'Daniel Park',
    role: 'CTO, Clovion AI',
    date: '2026-04-08',
    readTime: '9 min',
    tag: 'Playbook'
  },
  {
    slug: 'schema-ai-engines-parse',
    title: 'Schema markup that AI engines actually parse',
    excerpt:
      'Most schema guidance is generic SEO carryover. We tested 38 markup variants across four engines and tracked which ones survived retrieval. The shortlist is shorter than you would expect.',
    author: 'Sofia Mendes',
    role: 'VP Product, Clovion AI',
    date: '2026-03-26',
    readTime: '11 min',
    tag: 'Research'
  },
  {
    slug: 'robots-txt-ai-bot-landscape',
    title: 'Robots.txt and the AI bot landscape',
    excerpt:
      'GPTBot, ClaudeBot, PerplexityBot, Google-Extended, OAI-SearchBot. Eleven AI crawlers, three policy postures, and the configurations we see correlating with citation lift in our customer base.',
    author: 'Marcus Webb',
    role: 'VP Customer Eng, Clovion AI',
    date: '2026-03-14',
    readTime: '7 min',
    tag: 'Engineering'
  },
  {
    slug: 'backlinks-still-matter',
    title: 'Why backlinks still matter (for citations)',
    excerpt:
      'AI engines are not Google, but they leaned on Google for years and inherited the priors. Authority signals from inbound links keep showing up in our citation-path data, and here is the shape of that effect.',
    author: 'Alicia Tan',
    role: 'Head of GEO Research, Clovion AI',
    date: '2026-03-02',
    readTime: '8 min',
    tag: 'Research'
  },
  {
    slug: 'ai-overviews-changed-snippets',
    title: 'What AI Overviews changed about featured snippets',
    excerpt:
      'Featured snippets used to be the prize. Now they are often the first paragraph of an AI Overview, reshuffled. We mapped 4,000 SERPs to see what survived the rewrite and what got buried.',
    author: 'Eva Reinhardt',
    role: 'CEO, Clovion AI',
    date: '2026-02-18',
    readTime: '10 min',
    tag: 'Research'
  },
  {
    slug: 'crawl-logs-ai-era',
    title: 'Crawl logs for the AI era',
    excerpt:
      'Server logs were a quiet SEO superpower. They are louder now. A walkthrough of the queries, dashboards, and alerts we ship in production to keep tabs on which AI bots are hitting which pages, when, and why.',
    author: 'Daniel Park',
    role: 'CTO, Clovion AI',
    date: '2026-02-05',
    readTime: '12 min',
    tag: 'Engineering'
  }
] as const

const featured = seoPosts[0]
const rest = seoPosts.slice(1)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default function BlogCategorySeoPage() {
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
              SEO meets GEO.
            </h1>
            <p className="lead mt-6 text-ink/70 max-w-2xl">
              Yes, technical SEO still ships traffic. Here is where it overlaps GEO, where it
              diverges, and what to keep doing.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm font-mono text-ink/50">
              <span>{seoPosts.length} posts</span>
              <span className="w-1 h-1 rounded-full bg-ink/30" aria-hidden />
              <span>Curated, not comprehensive</span>
              <span className="w-1 h-1 rounded-full bg-ink/30" aria-hidden />
              <Link href="/blog" className="hover:text-ink transition-colors">
                Back to all posts
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Featured ----------------------------------------------------------- */}
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
                    SEO
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
                <span>SEO</span>
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
                Read the migration playbook
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

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
              const isActive = cat.slug === 'seo'
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
              {seoPosts.length} in SEO
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
              <h2 className="display-sm mt-4">All SEO posts.</h2>
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
        </Container>
      </Section>

      {/* Switching narrative band ----------------------------------------- */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Editorial</Eyebrow>
            <h2 className="display-md mt-5">Why SEO teams are adopting Clovion.</h2>

            <div className="mt-10 space-y-7 text-lg text-ink/75 leading-[1.65]">
              <p>
                The SEO leaders we work with did not abandon their craft. They sharpened it. The
                fundamentals that took a decade to learn — entity modeling, internal linking, schema,
                page experience, log analysis — turn out to be the same fundamentals that move
                citations in ChatGPT, Claude, Perplexity, and Gemini. The vocabulary changed. The
                discipline did not.
              </p>
              <p>
                What did change is the scoreboard. Rankings on ten blue links no longer describe how
                buyers find you. A single AI Overview can absorb the top three results into one
                paragraph, and the brand that gets named in that paragraph wins regardless of where
                its page ranks. SEO teams saw this coming first because they watch SERPs every day,
                and they were the first to ask us for tooling that measures the new surface area
                without throwing out the old one.
              </p>
              <p>
                Clovion was built for that handoff. The audits read like a familiar SEO crawl, with
                an extra column for engine-by-engine citation coverage. The fixes prioritize by
                expected lift, so the work goes where the leverage is. And the case studies on
                <Link
                  href="/customers"
                  className="text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink mx-1"
                >
                  /customers
                </Link>
                are mostly SEO teams who got there a quarter or two earlier than their peers.
              </p>
            </div>

            <p className="mt-10 font-mono text-sm text-ink/60">
              Read the cases →{' '}
              <Link
                href="/customers"
                className="text-ink underline underline-offset-4 decoration-ink/30 hover:decoration-ink"
              >
                /customers
              </Link>
            </p>
          </div>
        </Container>
      </Section>

      {/* Cross-category recommendations ------------------------------------ */}
      <Section tight>
        <Container>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-sm">
            <span className="text-ink/40 uppercase tracking-[0.18em] text-xs">Also explore:</span>
            <Link
              href="/blog/category/geo"
              className="text-ink hover:text-ink/60 transition-colors underline-offset-4 hover:underline decoration-ink/30"
            >
              GEO
            </Link>
            <span className="text-ink/20">/</span>
            <Link
              href="/blog/category/ai-search"
              className="text-ink hover:text-ink/60 transition-colors underline-offset-4 hover:underline decoration-ink/30"
            >
              AI Search
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
              <h2 className="display-sm mt-4">The SEO-to-GEO brief, weekly.</h2>
              <p className="lead mt-5 text-ink/70 max-w-xl">
                Written for senior SEO practitioners. New patterns from engine logs, the schema fixes
                that actually shipped lift, and a short note on what changed in the AI search
                landscape this week. Nothing you could have skimmed on Twitter.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Tag>Weekly</Tag>
                <Tag>Engine logs</Tag>
                <Tag>Schema</Tag>
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
        sub="Your SEO foundation, scored for AI"
        heading="Your authority signals are already there. See which engines are reading them."
        body="A free visibility score across ChatGPT, Claude, Gemini, and Perplexity in 24 hours. No card. The top 10 prioritized fixes ship with the report, ordered by expected lift."
        primary="Get Free Score"
        primaryHref="/free-ai-visibility-score"
        secondary="Start Free Trial"
        secondaryHref="/pricing"
      />
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Container, Button, Card, Eyebrow, ArrowRight, HeroShade } from '@/components/ui'
import { changelogEntries } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Docs | Clovion AI',
  description:
    'Set up your workspace, connect GA4 and GSC, ship custom dashboards, and integrate Clovion AI with your stack. Built for engineering teams.'
}

// ---------------------------------------------------------------------------
// Local data — hardcoded so the page stays self-contained for v1
// ---------------------------------------------------------------------------

const quickStart = [
  {
    sku: '01 — START',
    title: 'Track your first brand.',
    time: '5 min',
    desc: 'Add a domain, pick competitors, and pull your first visibility score across the four largest AI engines.',
    href: '/docs/getting-started'
  },
  {
    sku: '02 — CONNECT',
    title: 'Connect GA4 + GSC.',
    time: '8 min',
    desc: 'Wire up Google Analytics and Search Console so attribution and crawl signals flow into your workspace.',
    href: '/docs/getting-started'
  },
  {
    sku: '03 — INTEGRATE',
    title: 'Set up the API + MCP.',
    time: '12 min',
    desc: 'Mint a key, point a request at our REST endpoints, or expose your workspace to Claude through the MCP server.',
    href: '/docs/getting-started'
  },
  {
    sku: '04 — SHIP',
    title: 'Push fixes to your CMS.',
    time: '10 min',
    desc: 'Connect Sanity, Contentful, WordPress, or Webflow and ship schema patches straight from the fix list.',
    href: '/docs/getting-started'
  }
]

const browseSurfaces = [
  {
    title: 'Tracking',
    items: ['Workspaces', 'Prompts', 'Engines', 'Sentiment', 'Citations']
  },
  {
    title: 'Suggestions',
    items: ['Severity', 'Impact scoring', 'Schema patches', 'Auto-apply', 'CMS push']
  },
  {
    title: 'Coverage',
    items: ['Engines', 'Languages', 'Regions', 'Cadence', 'Methodology']
  },
  {
    title: 'Integrations',
    items: ['GA4', 'GSC', 'HubSpot', 'Salesforce', 'Webhooks']
  },
  {
    title: 'API',
    items: ['REST', 'MCP', 'Authentication', 'Webhooks', 'Rate limits']
  },
  {
    title: 'Workspace',
    items: ['Members', 'Roles', 'Audit logs', 'Data residency', 'Billing']
  }
]

const frameworkQuickstarts = [
  {
    name: 'Node.js',
    snippet: 'npm install @clovion/sdk',
    desc: 'Official SDK for Node and Bun. Promise-based, typed end to end.',
    href: '/docs/getting-started'
  },
  {
    name: 'Python',
    snippet: 'pip install clovion',
    desc: 'Sync and async clients for 3.10 and newer. Pydantic models included.',
    href: '/docs/getting-started'
  },
  {
    name: 'Go',
    snippet: 'go get github.com/clovion/clovion-go',
    desc: 'Zero-dependency Go client. Context-aware, with structured errors.',
    href: '/docs/getting-started'
  },
  {
    name: 'TypeScript',
    snippet: 'pnpm add @clovion/sdk',
    desc: 'Same package as Node, with full discriminated-union response types.',
    href: '/docs/getting-started'
  },
  {
    name: 'REST (curl)',
    snippet: 'curl https://api.clovion.ai/v1/score',
    desc: 'Plain HTTP. Bearer auth, JSON in, JSON out. Works from anything.',
    href: '/docs/getting-started'
  },
  {
    name: 'MCP',
    snippet: 'npx @clovion/mcp@latest',
    desc: 'Expose your workspace to Claude and ChatGPT. One command, no servers.',
    href: '/docs/getting-started'
  }
]

const recentlyShipped = changelogEntries.slice(0, 3)

// ---------------------------------------------------------------------------

export default function DocsPage() {
  return (
    <>
      {/* Hero band — compact, no giant arena */}
      <Section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
        <HeroShade />
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>DOCS</Eyebrow>
            <h1 className="display-md mt-5">Docs for builders.</h1>
            <p className="lead mt-6 text-ink/70">
              Set up your workspace, connect your data, ship custom dashboards, and integrate with your stack.
              Designed for engineering teams.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/pricing" trackLocation="docs_hero" variant="primary" size="lg">
                Start free trial
              </Button>
              <Button href="/docs/getting-started" variant="secondary" size="lg">
                Read quickstart
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 2 — Quick start tiles (Stripe pattern, intent-based) */}
      <Section bg="subtle">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>QUICK START</Eyebrow>
              <h2 className="display-sm mt-4">Four paths from zero to shipped.</h2>
            </div>
            <Link
              href="/docs/getting-started"
              className="hidden md:inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink transition-colors"
            >
              All guides <ArrowRight />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {quickStart.map((q) => (
              <Link key={q.sku} href={q.href} className="group block">
                <Card className="bg-white h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-wider text-ink/50">{q.sku}</span>
                    <span className="font-mono text-[11px] tracking-wider text-ink/40">{q.time}</span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-ink">{q.title}</h3>
                  <p className="mt-3 text-sm text-ink/65 leading-relaxed">{q.desc}</p>
                  <div className="mt-6 flex items-center gap-1.5 text-sm text-ink group-hover:gap-2.5 transition-all">
                    Begin <ArrowRight />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 3 — Browse by surface (the signature dense grid) */}
      <Section>
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>BROWSE BY SURFACE</Eyebrow>
              <h2 className="display-sm mt-4">Every part of the product, indexed.</h2>
              <p className="lead mt-4 text-ink/70 text-base">
                Thirty pages across six surfaces. Pick the one that matches what you are wiring up.
              </p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {browseSurfaces.map((group, i) => (
              <div key={group.title}>
                <div className="flex items-center gap-3 pb-4 border-b border-line">
                  <span className="font-mono text-[11px] tracking-wider text-ink/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">
                    {group.title}
                  </h3>
                </div>
                <ul className="mt-4 space-y-1">
                  {group.items.map((item, j) => (
                    <li key={item}>
                      <Link
                        href="/docs/getting-started"
                        className="group flex items-baseline gap-3 py-2 text-sm text-ink/75 hover:text-ink transition-colors"
                      >
                        <span className="font-mono text-[10px] text-ink/30 group-hover:text-ink/50 transition-colors">
                          {String(j + 1).padStart(2, '0')}
                        </span>
                        <span className="flex-1">{item}</span>
                        <ArrowRight className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 4 — Framework quickstarts (Supabase pattern, 6-tile code grid) */}
      <Section bg="subtle">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Eyebrow>QUICKSTARTS</Eyebrow>
              <h2 className="display-sm mt-4">One package away.</h2>
              <p className="lead mt-4 text-ink/70 text-base">
                Pick a language. Install. You are pulling visibility data inside of a minute.
              </p>
            </div>
            <Link
              href="/docs/getting-started"
              className="hidden md:inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink transition-colors"
            >
              API reference <ArrowRight />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {frameworkQuickstarts.map((fw) => (
              <Link key={fw.name} href={fw.href} className="group block">
                <Card className="bg-white h-full flex flex-col p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-ink">{fw.name}</h3>
                    <ArrowRight className="text-ink/40 group-hover:text-ink group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="mt-4 rounded-lg bg-ink/[0.04] border border-line px-3.5 py-2.5">
                    <code className="font-mono text-[12.5px] text-ink/85 leading-relaxed break-all">
                      {fw.snippet}
                    </code>
                  </div>
                  <p className="mt-4 text-sm text-ink/65 leading-relaxed">{fw.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 5 — Recently shipped */}
      <Section tight>
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Eyebrow>RECENTLY SHIPPED</Eyebrow>
              <h2 className="display-sm mt-4">What is new this week.</h2>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-ink/70 hover:text-ink transition-colors"
            >
              Full changelog <ArrowRight />
            </Link>
          </div>

          <ul className="mt-10 divide-y divide-line border-y border-line">
            {recentlyShipped.map((entry) => (
              <li key={entry.version}>
                <Link
                  href="/blog"
                  className="group grid grid-cols-12 items-center gap-4 py-5 hover:bg-subtle/50 -mx-4 px-4 transition-colors"
                >
                  <div className="col-span-12 sm:col-span-3 font-mono text-[12px] text-ink/50 tabular-nums">
                    {entry.date} · v{entry.version}
                  </div>
                  <div className="col-span-12 sm:col-span-7">
                    <h3 className="text-base font-semibold text-ink">{entry.title}</h3>
                    <p className="mt-1 text-sm text-ink/60 line-clamp-1">{entry.description}</p>
                  </div>
                  <div className="col-span-12 sm:col-span-2 sm:text-right">
                    <span className="inline-flex items-center gap-1 text-sm text-ink/70 group-hover:gap-2 transition-all">
                      Learn more <ArrowRight />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Section 6 — Footer CTA band (thin, ink, mono labels with hairlines) */}
      <Section tight bg="ink">
        <Container>
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3 md:gap-0">
            <div className="md:pr-6 md:border-r md:border-white/10">
              <div className="font-mono text-[11px] tracking-wider text-white/40 uppercase">
                Need help
              </div>
              <a
                href="mailto:team@clovion.ai"
                className="mt-1.5 inline-block text-sm text-white hover:text-white/80 transition-colors"
              >
                team@clovion.ai
              </a>
            </div>

            <div className="md:px-6 md:border-r md:border-white/10">
              <div className="font-mono text-[11px] tracking-wider text-white/40 uppercase">
                Status
              </div>
              <a
                href="https://status.clovion.ai"
                className="mt-1.5 inline-flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors"
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                status.clovion.ai
              </a>
            </div>

            <div className="md:pl-6">
              <div className="font-mono text-[11px] tracking-wider text-white/40 uppercase">
                Engineering blog
              </div>
              <Link
                href="/blog"
                className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-white hover:text-white/80 transition-colors"
              >
                /blog <ArrowRight />
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-8 border-t border-white/10">
            <p className="text-sm text-white/60 max-w-xl">
              Building on Clovion AI? Join 200+ engineering teams shipping GEO fixes from the dashboard
              and the API.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="invert" size="md" href="/pricing">
                Start free trial
              </Button>
              <Button variant="ghost" size="md" href="/free-ai-visibility-score" className="text-white hover:bg-white/10">
                Get free score
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

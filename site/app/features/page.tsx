import { Container, Section, Eyebrow, Button, ArrowRight, Check, Card, HeroShade } from '@/components/ui'
import { FAQ, CTABanner, LogoMarquee } from '@/components/sections'
import { features, customers, faqs } from '@/lib/content'
import Link from 'next/link'

export const metadata = {
  title: 'Features | Clovion AI',
  description:
    'Three tools, one platform. Track AI visibility across ten engines, ship prioritized GEO fixes, and watch every surface that matters from one workspace.'
}

// ---------------------------------------------------------------------------
// Hardcoded feature blueprints — extends `features` from content.ts with the
// per-card spec the design calls for (eyebrow, route, mock data).
// ---------------------------------------------------------------------------

const featureBlueprints = [
  {
    id: 'tracking',
    number: '01',
    eyebrow: 'TRACKING',
    title: 'Watch every AI surface.',
    lead:
      'Daily prompts on the ten engines your buyers actually use. Sentiment, share of voice, and citations — refreshed every morning before standup.',
    bullets: [
      'Coverage across 10 engines: ChatGPT, Claude, Gemini, Perplexity, Grok, Copilot, Meta AI, DeepSeek, AI Overviews, AI Mode',
      'Sentiment intelligence shows how each model characterizes your brand and where the framing breaks',
      'Citation tracking surfaces the exact third-party sources AI engines pull from when they answer',
      'Daily refresh on real consumer prompts, not synthetic API queries — what your buyers actually see'
    ],
    href: '/features/ai-visibility-tracking',
    cta: 'Explore tracking',
    mockKind: 'engines',
    align: 'left'
  },
  {
    id: 'suggestions',
    number: '02',
    eyebrow: 'SUGGESTIONS',
    title: 'Fix what is broken, automatically.',
    lead:
      'A prioritized inbox of GEO fixes ranked by expected lift. Schema patches drafted, content gaps surfaced, citation paths mapped — most ship in under an hour.',
    bullets: [
      'Schema patches auto-generated and ready to paste into your CMS or static site',
      'Citation path recommendations show which third-party sources you need mentions on',
      'Content gap analysis finds the sub-queries AI engines ask that your site cannot answer',
      'Technical fixes drafted with before-and-after impact estimates on citation share'
    ],
    href: '/features/geo-improvement-suggestions',
    cta: 'Explore suggestions',
    mockKind: 'inbox',
    align: 'right'
  },
  {
    id: 'coverage',
    number: '03',
    eyebrow: 'COVERAGE',
    title: 'Every engine that matters.',
    lead:
      'One login covers ten AI engines, multiple regions, and the long tail nobody else watches. New surfaces added within thirty days of public launch.',
    bullets: [
      '10 engines tracked live today; new engines added within 30 days of public launch',
      'Multi-language coverage across English, Spanish, German, French, Japanese, and Mandarin',
      'Regional segmentation across US, EU, APAC — so you can isolate where you actually win',
      'Daily refresh cadence on all engines; intraday on ChatGPT, Perplexity, and AI Overviews'
    ],
    href: '/features/platform-coverage',
    cta: 'Explore coverage',
    mockKind: 'grid',
    align: 'left'
  }
] as const

// ---------------------------------------------------------------------------
// Capability matrix — 18 rows, 6 columns. T = Tracking only, S = Suggestions
// only, C = Coverage only, TS = Tracking + Suggestions, ALL = all three,
// COMP = competitor benchmarks. Boolean per cell.
// ---------------------------------------------------------------------------

const matrixRows = [
  { label: '10 AI engines tracked daily', cells: [true, false, true, true, true, false] },
  { label: 'Share of voice scoring', cells: [true, false, false, true, true, true] },
  { label: 'Sentiment intelligence per engine', cells: [true, false, false, true, true, false] },
  { label: 'Citation source tracking', cells: [true, false, false, true, true, false] },
  { label: 'Crawler analytics (real-time)', cells: [true, false, false, true, true, false] },
  { label: 'Prioritized GEO fix list', cells: [false, true, false, true, true, false] },
  { label: 'Schema patches auto-generated', cells: [false, true, false, true, true, false] },
  { label: 'Citation path recommendations', cells: [false, true, false, true, true, false] },
  { label: 'Content gap analysis', cells: [false, true, false, true, true, false] },
  { label: 'Before/after lift tracking', cells: [false, true, false, true, true, false] },
  { label: 'Multi-language coverage', cells: [false, false, true, false, true, false] },
  { label: 'Regional segmentation (US/EU/APAC)', cells: [false, false, true, false, true, false] },
  { label: 'New engines added in 30 days', cells: [false, false, true, false, true, false] },
  { label: 'Intraday refresh on top surfaces', cells: [false, false, true, false, true, false] },
  { label: 'Competitor benchmarking (up to 25)', cells: [true, false, false, true, true, true] },
  { label: 'Weekly delta reports', cells: [true, true, false, true, true, true] },
  { label: 'MCP server + REST API', cells: [false, false, false, false, true, false] },
  { label: 'SOC 2 / ISO 27001 / GDPR', cells: [true, true, true, true, true, true] }
] as const

const matrixCols = [
  'Tracking',
  'Suggestions',
  'Coverage',
  'Track + Fix',
  'All three',
  'Comp.'
] as const

const featureFaqIndices = [1, 0, 5, 6, 4, 8] // engines, vs SEO, security, integrations, time-to-value, vs Profound

export default function FeaturesPage() {
  return (
    <>
      <FeaturesHero />
      <FeatureCards />
      <CapabilityMatrix />
      <WhyOnePlatform />
      <LogoMarquee items={customers} eyebrow="Working alongside teams at" />
      <FAQ
        heading="Feature questions, answered."
        sub="The specifics teams ask before they wire Clovion AI into their workflow."
        items={featureFaqIndices.map((i) => faqs[i])}
      />
      <CTABanner
        sub="Begin with tracking"
        heading="Start with the tracking. The rest follows."
        body="Free score in 24 hours. No card, no demo call, no nag screens. When the data lands, the fix list and the coverage map come with it."
        primary="Start free trial"
        primaryHref="/pricing"
        secondary="Get free score"
        secondaryHref="/free-ai-visibility-score"
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

function FeaturesHero() {
  return (
    <section className="relative isolate overflow-hidden section-y-xl">
      <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
      <HeroShade />
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>PLATFORM</Eyebrow>
          <h1 className="display-xl mt-6 text-balance">
            Three tools. One platform.
          </h1>
          <p className="lead mt-7 max-w-2xl mx-auto text-balance">
            Track how ChatGPT, Claude, and Perplexity describe your brand. Fix what is broken. Watch every major AI surface from one workspace.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/pricing" variant="primary" size="lg">
              Start free trial <ArrowRight />
            </Button>
            <Button href="/free-ai-visibility-score" variant="secondary" size="lg">
              Get free score
            </Button>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-px bg-line border border-line rounded-2xl overflow-hidden max-w-2xl mx-auto">
            {featureBlueprints.map((f) => (
              <Link
                key={f.id}
                href={`#${f.id}`}
                className="bg-white p-5 hover:bg-subtle transition-colors group"
              >
                <div className="font-mono text-[0.7rem] text-ink-50 mb-3">{f.number}</div>
                <div className="font-display text-[0.95rem] md:text-[1.05rem] font-semibold tracking-[-0.02em] leading-tight">
                  {f.eyebrow.charAt(0) + f.eyebrow.slice(1).toLowerCase()}
                </div>
                <div className="mt-3 inline-flex items-center gap-1 text-[0.78rem] text-ink-60 group-hover:text-ink transition-colors">
                  Jump
                  <ArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Three big feature cards
// ---------------------------------------------------------------------------

function FeatureCards() {
  return (
    <Section>
      <Container>
        <div className="space-y-24 md:space-y-36">
          {featureBlueprints.map((f) => (
            <FeatureCard key={f.id} feature={f} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

function FeatureCard({ feature }: { feature: (typeof featureBlueprints)[number] }) {
  const textOrder = feature.align === 'left' ? 'md:order-1' : 'md:order-2'
  const mockOrder = feature.align === 'left' ? 'md:order-2' : 'md:order-1'

  return (
    <div id={feature.id} className="scroll-mt-24 grid md:grid-cols-5 gap-10 md:gap-14 items-center">
      <div className={`md:col-span-3 ${textOrder}`}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.78rem] text-ink-50">{feature.number}</span>
          <span className="h-px w-8 bg-line" aria-hidden />
          <Eyebrow>{feature.eyebrow}</Eyebrow>
        </div>
        <h2 className="display-lg mt-5 text-balance">{feature.title}</h2>
        <p className="lead mt-6 max-w-xl text-balance">{feature.lead}</p>

        <ul className="mt-8 space-y-3.5">
          {feature.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-3">
              <span className="mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                <Check />
              </span>
              <span className="text-[0.97rem] text-ink-80 leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>

        <div className="mt-9">
          <Link
            href={feature.href}
            className="inline-flex items-center gap-2 text-[0.95rem] font-semibold text-ink hover:text-ink-70 transition-colors border-b border-ink/20 hover:border-ink pb-1"
          >
            {feature.cta}
            <ArrowRight />
          </Link>
        </div>
      </div>

      <div className={`md:col-span-2 ${mockOrder}`}>
        {feature.mockKind === 'engines' && <EnginesMock />}
        {feature.mockKind === 'inbox' && <InboxMock />}
        {feature.mockKind === 'grid' && <CoverageGridMock />}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mock UI 1 — engines column with mentions + sparkline
// ---------------------------------------------------------------------------

function EnginesMock() {
  const rows = [
    { name: 'ChatGPT', mentions: '4,218', spark: 'M0,18 L8,15 L16,16 L24,12 L32,10 L40,8 L48,6' },
    { name: 'Perplexity', mentions: '2,941', spark: 'M0,20 L8,18 L16,14 L24,15 L32,11 L40,9 L48,7' },
    { name: 'Claude', mentions: '1,832', spark: 'M0,16 L8,17 L16,14 L24,13 L32,12 L40,10 L48,8' },
    { name: 'Gemini', mentions: '1,604', spark: 'M0,21 L8,19 L16,17 L24,18 L32,15 L40,14 L48,12' },
    { name: 'AI Overviews', mentions: '1,210', spark: 'M0,22 L8,20 L16,19 L24,17 L32,16 L40,13 L48,11' },
    { name: 'AI Mode', mentions: '892', spark: 'M0,23 L8,22 L16,21 L24,19 L32,18 L40,16 L48,14' },
    { name: 'Copilot', mentions: '714', spark: 'M0,22 L8,21 L16,20 L24,19 L32,17 L40,15 L48,13' },
    { name: 'Grok', mentions: '602', spark: 'M0,23 L8,22 L16,21 L24,20 L32,18 L40,17 L48,15' },
    { name: 'Meta AI', mentions: '441', spark: 'M0,24 L8,23 L16,22 L24,21 L32,20 L40,18 L48,16' },
    { name: 'DeepSeek', mentions: '187', spark: 'M0,24 L8,24 L16,23 L24,22 L32,21 L40,20 L48,19' }
  ]

  return (
    <div className="card p-5 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-50">Engines · 30d</div>
        <div className="inline-flex h-6 items-center px-2 rounded-pill bg-subtle border border-line text-[0.68rem] font-mono text-ink-70">
          LIVE
        </div>
      </div>
      <ul className="space-y-0">
        {rows.map((row, idx) => (
          <li
            key={row.name}
            className="flex items-center gap-3 py-2.5 border-t border-line first:border-t-0"
          >
            <span className="font-mono text-[0.65rem] text-ink-40 w-5">{String(idx + 1).padStart(2, '0')}</span>
            <span className="text-[0.85rem] font-semibold text-ink flex-1 truncate">{row.name}</span>
            <svg width="48" height="24" viewBox="0 0 48 24" className="text-ink-60">
              <path d={row.spark} stroke="currentColor" strokeWidth="1.25" fill="none" strokeLinecap="round" />
            </svg>
            <span className="font-mono text-[0.75rem] text-ink-70 tabular-nums w-14 text-right">
              {row.mentions}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mock UI 2 — Suggestions inbox
// ---------------------------------------------------------------------------

function InboxMock() {
  const items = [
    {
      severity: 'HIGH',
      severityClass: 'bg-ink text-white',
      title: 'Add Product schema to /pricing',
      detail: 'Missing Offer + Brand markup. AI engines cannot price-compare.',
      impact: '+18% citation share'
    },
    {
      severity: 'MED',
      severityClass: 'bg-neutral-700 text-white',
      title: 'Citation gap on G2 + Capterra',
      detail: 'Three competitors mentioned in 14 reviews. You are in none.',
      impact: '+11% share of voice'
    },
    {
      severity: 'MED',
      severityClass: 'bg-neutral-700 text-white',
      title: 'Restructure /docs/api headings',
      detail: 'H2 depth misaligned with retrieval patterns LLMs prefer.',
      impact: '+7% citation share'
    },
    {
      severity: 'LOW',
      severityClass: 'bg-neutral-300 text-ink',
      title: 'Add FAQPage schema to /faq',
      detail: 'Small bump, but visible on Perplexity within 14 days.',
      impact: '+3% citation share'
    }
  ]

  return (
    <div className="card p-5 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-50">Suggestions · Inbox</div>
        <div className="font-mono text-[0.7rem] text-ink-70">4 of 27</div>
      </div>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item.title} className="rounded-xl border border-line p-3.5 bg-subtle/60 hover:bg-subtle transition-colors">
            <div className="flex items-start gap-3">
              <span className={`inline-flex h-5 items-center px-1.5 rounded font-mono text-[0.62rem] tracking-wider ${item.severityClass}`}>
                {item.severity}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[0.85rem] font-semibold text-ink leading-snug">{item.title}</div>
                <div className="text-[0.75rem] text-ink-60 mt-1 leading-snug">{item.detail}</div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-line/80">
              <span className="font-mono text-[0.7rem] text-ink-70">{item.impact}</span>
              <span className="font-mono text-[0.68rem] text-ink-50">Ship →</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Mock UI 3 — Coverage grid (10 engines)
// ---------------------------------------------------------------------------

function CoverageGridMock() {
  const tiles = [
    { name: 'ChatGPT', status: 'LIVE' },
    { name: 'Claude', status: 'LIVE' },
    { name: 'Perplexity', status: 'LIVE' },
    { name: 'Gemini', status: 'LIVE' },
    { name: 'AI Overviews', status: 'LIVE' },
    { name: 'AI Mode', status: 'LIVE' },
    { name: 'Copilot', status: 'LIVE' },
    { name: 'Grok', status: 'LIVE' },
    { name: 'Meta AI', status: 'LIVE' },
    { name: 'DeepSeek', status: 'BETA' }
  ]

  return (
    <div className="card p-5 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-50">Coverage · Engines</div>
        <div className="font-mono text-[0.7rem] text-ink-70">10 / 10</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {tiles.map((tile) => (
          <div
            key={tile.name}
            className="rounded-lg border border-line p-3 bg-subtle/40 hover:bg-subtle transition-colors"
          >
            <div className="text-[0.82rem] font-semibold text-ink truncate leading-tight">{tile.name}</div>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${tile.status === 'LIVE' ? 'bg-ink' : 'bg-neutral-400'}`}
                aria-hidden
              />
              <span className="font-mono text-[0.62rem] tracking-wider text-ink-60">{tile.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Capability matrix
// ---------------------------------------------------------------------------

function CapabilityMatrix() {
  return (
    <Section bg="subtle">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>CAPABILITIES</Eyebrow>
          <h2 className="display-md mt-5 text-balance">Everything, side by side.</h2>
          <p className="lead mt-5 max-w-xl text-balance">
            The full feature surface, mapped against how teams typically buy in. Most start with tracking, add suggestions in month two, and use coverage to plan the year.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-line bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-50 px-5 py-4 sticky left-0 bg-white z-10">
                    Capability
                  </th>
                  {matrixCols.map((col) => (
                    <th
                      key={col}
                      className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-50 px-3 py-4 text-center min-w-[100px]"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((row, rowIdx) => (
                  <tr
                    key={row.label}
                    className={`border-b border-line last:border-b-0 ${rowIdx % 2 === 1 ? 'bg-subtle/40' : ''}`}
                  >
                    <td className="px-5 py-3.5 text-[0.88rem] text-ink sticky left-0 bg-inherit z-10 font-semibold">
                      {row.label}
                    </td>
                    {row.cells.map((on, idx) => (
                      <td key={idx} className="px-3 py-3.5 text-center">
                        {on ? (
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink text-white mx-auto">
                            <Check />
                          </span>
                        ) : (
                          <span className="text-ink-40 font-mono text-[0.85rem]">·</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </Section>
  )
}

// ---------------------------------------------------------------------------
// Why one platform
// ---------------------------------------------------------------------------

function WhyOnePlatform() {
  const reasons = [
    {
      num: '01.',
      title: 'Tracking informs suggestions.',
      body: 'The fix list is only as good as the visibility data underneath. Daily prompts on ten engines tell us where citation gaps actually hurt, which sentiment patterns need reframing, and which competitors are pulling ahead this week — so the suggestions you see are the ones that will move your score.'
    },
    {
      num: '02.',
      title: 'Suggestions improve coverage.',
      body: 'Shipping the fixes does not just lift your visibility score. It changes how each engine reads your site. Schema patches, restructured headings, and new citation paths compound across surfaces — so the same work raises your share on ChatGPT, Perplexity, AI Overviews, and the long tail simultaneously.'
    },
    {
      num: '03.',
      title: 'Coverage data flows back into tracking.',
      body: 'New engines, new regions, new languages — when coverage expands, tracking expands with it. The same workspace, the same competitor set, the same prompt library. No new dashboards to learn, no new credentials, no re-onboarding. The platform grows where AI search grows.'
    }
  ]

  return (
    <Section>
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>WHY ONE PLATFORM</Eyebrow>
          <h2 className="display-md mt-5 text-balance">One workspace beats three tools.</h2>
          <p className="lead mt-5 max-w-xl text-balance">
            The three tools are not three products. They share data, share prompts, share competitor sets. That is where the compounding happens.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-10 md:gap-12">
          {reasons.map((reason) => (
            <div key={reason.num}>
              <div className="font-mono text-[0.82rem] text-ink-50 mb-5">{reason.num}</div>
              <h3 className="font-display text-[1.35rem] md:text-[1.5rem] font-semibold tracking-[-0.02em] leading-tight text-balance">
                {reason.title}
              </h3>
              <p className="mt-5 text-[0.97rem] text-ink-70 leading-relaxed">{reason.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

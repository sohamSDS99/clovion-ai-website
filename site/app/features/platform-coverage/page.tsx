import Link from 'next/link'
import {
  Section,
  Container,
  Button,
  Eyebrow,
  Tag,
  ArrowRight,
  Check,
  HairlineDivider,
  HeroShade
} from '@/components/ui'
import { FAQ, CTABanner } from '@/components/sections'

export const metadata = {
  title: 'Platform coverage — every AI surface that matters | Clovion AI',
  description:
    'Ten AI engines tracked daily across three regions and forty-seven languages. Real browser responses, real consumer prompts, refreshed every 24 hours.'
}

// ---------------------------------------------------------------------------
// Page-local data — kept inline because content.ts only exposes engine names.
// ---------------------------------------------------------------------------

type Engine = {
  name: string
  cadence: 'Daily' | 'Weekly' | 'Real-time'
  status: 'Tracked daily' | 'Tracked weekly' | 'Beta'
  regions: ('US' | 'EU' | 'APAC')[]
  languages: number
  capture: 'Browser panel' | 'API' | 'Browser + API'
  description: string
}

const engines: Engine[] = [
  {
    name: 'ChatGPT',
    cadence: 'Daily',
    status: 'Tracked daily',
    regions: ['US', 'EU', 'APAC'],
    languages: 47,
    capture: 'Browser panel',
    description:
      'Response text, citations, ranking position of cited sources, and sentiment toward your brand. Both free and Plus accounts are sampled separately.'
  },
  {
    name: 'Claude',
    cadence: 'Daily',
    status: 'Tracked daily',
    regions: ['US', 'EU', 'APAC'],
    languages: 32,
    capture: 'Browser panel',
    description:
      'Full conversation captures including tool use and artifact mentions. We track how Claude frames your category and which competitors it surfaces first.'
  },
  {
    name: 'Perplexity',
    cadence: 'Real-time',
    status: 'Tracked daily',
    regions: ['US', 'EU', 'APAC'],
    languages: 24,
    capture: 'Browser + API',
    description:
      'Citation order matters most here. We log which sources appear in the top three, their dwell weight, and whether your domain is among the linked references.'
  },
  {
    name: 'Gemini',
    cadence: 'Daily',
    status: 'Tracked daily',
    regions: ['US', 'EU', 'APAC'],
    languages: 47,
    capture: 'Browser panel',
    description:
      'Captured across Search-integrated Gemini and the standalone app. We separate the two because answer composition differs by surface.'
  },
  {
    name: 'Grok',
    cadence: 'Daily',
    status: 'Tracked daily',
    regions: ['US', 'EU'],
    languages: 18,
    capture: 'Browser panel',
    description:
      'Sentiment shifts faster on Grok than anywhere else. We sample three times per day for prompts flagged as high-volatility by our model.'
  },
  {
    name: 'Copilot',
    cadence: 'Daily',
    status: 'Tracked daily',
    regions: ['US', 'EU', 'APAC'],
    languages: 41,
    capture: 'Browser panel',
    description:
      'Microsoft Copilot in Bing and inside Windows. Edge surface and standalone surface are tracked as separate environments because the prompts behave differently.'
  },
  {
    name: 'Meta AI',
    cadence: 'Daily',
    status: 'Tracked daily',
    regions: ['US', 'EU'],
    languages: 22,
    capture: 'Browser panel',
    description:
      'Captures from WhatsApp, Instagram, and Facebook surfaces. Response style varies meaningfully across the three — we record which app produced each answer.'
  },
  {
    name: 'DeepSeek',
    cadence: 'Weekly',
    status: 'Tracked weekly',
    regions: ['APAC', 'US'],
    languages: 14,
    capture: 'API',
    description:
      'Lower query volume in our panel, so we batch weekly. Useful for any brand whose buyers skew technical or whose category has strong APAC presence.'
  },
  {
    name: 'AI Overviews',
    cadence: 'Daily',
    status: 'Tracked daily',
    regions: ['US', 'EU', 'APAC'],
    languages: 38,
    capture: 'Browser panel',
    description:
      'Google AI Overviews. We log triggered prompts, the source set, position within the overview, and whether the overview was shown at all for a given query.'
  },
  {
    name: 'AI Mode',
    cadence: 'Daily',
    status: 'Beta',
    regions: ['US'],
    languages: 8,
    capture: 'Browser panel',
    description:
      'Google AI Mode is still rolling out. Coverage is US-only and limited to opted-in panelists. Treat numbers as directional until we lift to general availability.'
  }
]

const supportedLanguages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Dutch',
  'Polish',
  'Russian',
  'Ukrainian',
  'Czech',
  'Romanian',
  'Hungarian',
  'Swedish',
  'Norwegian',
  'Danish',
  'Finnish',
  'Greek',
  'Turkish',
  'Hebrew',
  'Arabic',
  'Farsi',
  'Hindi',
  'Bengali',
  'Urdu',
  'Tamil',
  'Telugu',
  'Marathi',
  'Punjabi',
  'Indonesian',
  'Malay',
  'Thai',
  'Vietnamese',
  'Tagalog',
  'Mandarin',
  'Cantonese',
  'Japanese',
  'Korean',
  'Swahili',
  'Zulu',
  'Afrikaans',
  'Catalan',
  'Basque',
  'Galician',
  'Croatian',
  'Bulgarian',
  'Slovak'
]

const methodology = [
  {
    title: 'Browser capture, not API.',
    body: 'Real responses from opt-in user panels — the same answers a buyer would see. The API returns different content, often with safety rails the consumer surface does not have.',
    ref: 'Why browser panels beat APIs',
    href: '/resources#research'
  },
  {
    title: 'Daily refresh.',
    body: 'Every prompt is re-asked at twenty-four-hour intervals. Sentiment drift, citation churn, and ranking changes are detected within a day, not a week.',
    ref: 'Refresh cadence methodology',
    href: '/resources#research'
  },
  {
    title: 'Real consumer prompts.',
    body: 'Our 1.8B prompt dataset comes from opt-in browser panels of actual searches, not synthetic generation. Buyer language, not researcher language.',
    ref: 'How we source prompts',
    href: '/resources#research'
  }
]

const roadmap = [
  {
    label: "What's on the roadmap",
    items: [
      'Voice-mode capture for ChatGPT and Gemini',
      'Yandex and Naver for full APAC coverage',
      'Mistral Le Chat as a tracked engine',
      'In-product surfaces (Shopify Sidekick, Notion AI)',
      'Real-time alerting on sentiment inversions'
    ]
  },
  {
    label: "What we don't yet capture",
    items: [
      'Voice queries (audio only) — text transcripts only today',
      'Enterprise-deployed Copilot in private tenants',
      'Region-locked engines outside US, EU, APAC',
      'In-app assistants without public response surfaces',
      'Image-generation prompts (text answers only)'
    ]
  }
]

const compareData = [
  { name: 'Profound', engines: 8, width: '40%' },
  { name: 'Otterly', engines: 6, width: '30%' },
  { name: 'Clovion', engines: 10, width: '50%', highlight: true }
]

const platformFaqs = [
  {
    q: 'How quickly do you add a new engine after launch?',
    a: 'We typically have beta coverage within two weeks of a major engine going public, and lift to daily tracking once the response surface stabilizes. AI Mode was beta within nine days of its preview release.'
  },
  {
    q: 'Why not just query the APIs directly?',
    a: 'APIs return different content than the consumer-facing chat. Safety rails differ, system prompts differ, and citation behavior often differs. We capture from real browser sessions because that is what your buyers see.'
  },
  {
    q: 'How are prompts sourced?',
    a: 'Our 1.8B-prompt dataset is sourced from opt-in browser panels — real searches from real users who have consented to share anonymized query data. We then cluster these against your category to find the prompts that matter to your brand.'
  },
  {
    q: 'What does "beta" mean for an engine?',
    a: 'It means we are capturing responses but the data is directional, not statistically stable. Either the engine is still rolling out, panel size is small, or response formats are still changing week to week.'
  },
  {
    q: 'Can I see coverage per region?',
    a: 'Yes. Every report can be filtered to US, EU, or APAC. Cross-region comparison is a default view in the dashboard — useful for brands localizing positioning across markets.'
  },
  {
    q: 'How many languages do you cover?',
    a: 'Forty-seven languages today. Coverage varies by engine — ChatGPT and Gemini lead at full coverage, DeepSeek is the lightest at fourteen. The full breakdown is in the table above.'
  }
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlatformCoveragePage() {
  return (
    <>
      {/* HERO ----------------------------------------------------------- */}
      <Section className="section-y-xl relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10 opacity-40" aria-hidden />
        <HeroShade />
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>03 — Coverage</Eyebrow>
            <h1 className="display-lg mt-6 text-balance">
              Every AI surface, tracked.
            </h1>
            <p className="lead mt-6 max-w-2xl">
              Ten engines. Forty-seven languages. Three regions. One workspace. Coverage that
              grows the day a new model ships.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/pricing" trackLocation="features_platform_coverage_hero" size="lg">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="/free-ai-visibility-score" trackLocation="features_platform_coverage_hero" variant="secondary" size="lg">
                Get Free Score
              </Button>
            </div>
          </div>

          {/* Engine grid: 5x2 desktop, 2x5 mobile */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-px bg-line border border-line rounded-xl overflow-hidden">
            {engines.map((engine) => (
              <div
                key={engine.name}
                className="group bg-white p-5 md:p-6 transition-colors duration-300 hover:bg-subtle relative"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-50">
                  {engine.status}
                </div>
                <div className="mt-3 font-mono text-sm uppercase tracking-[0.04em] text-ink">
                  {engine.name}
                </div>
                <div className="mt-6 text-[11px] font-mono text-ink-60 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  View details <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 2 — Engines, expanded ----------------------------------- */}
      <Section bg="subtle" className="bg-white">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>The ten engines</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              A reference, not a marketing list.
            </h2>
            <p className="lead mt-5 max-w-2xl">
              Each engine, the cadence we capture it on, the regions where we have panel
              coverage, and the languages it supports today.
            </p>
          </div>

          <div className="mt-14 border-y border-line">
            {engines.map((engine, idx) => (
              <div
                key={engine.name}
                className={`grid grid-cols-1 md:grid-cols-12 gap-6 py-9 ${
                  idx > 0 ? 'border-t border-line' : ''
                }`}
              >
                <div className="md:col-span-3">
                  <h3 className="display-sm font-semibold">{engine.name}</h3>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
                    {engine.capture}
                  </div>
                </div>

                <div className="md:col-span-3 grid grid-cols-3 md:grid-cols-1 gap-3 md:gap-4 text-sm">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-50">
                      Cadence
                    </div>
                    <div className="mt-1.5 text-ink">{engine.cadence}</div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-50">
                      Regions
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {engine.regions.map((r) => (
                        <Tag key={r} className="text-[10px]">
                          {r}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-50">
                      Languages
                    </div>
                    <div className="mt-1.5 text-ink">{engine.languages}</div>
                  </div>
                </div>

                <div className="md:col-span-6">
                  <p className="text-ink-70 leading-relaxed">{engine.description}</p>
                  <Link
                    href="/resources#research"
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink hover:text-ink-70 transition-colors"
                  >
                    Methodology <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 3 — Methodology ----------------------------------------- */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Methodology</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              How the capture actually works.
            </h2>
            <p className="lead mt-5 max-w-2xl">
              Three deliberate choices that make our numbers different from the AI tracking
              tools that came before.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-px bg-line border border-line">
            {methodology.map((m) => (
              <div key={m.title} className="bg-white p-8 md:p-10">
                <h3 className="display-sm font-semibold text-balance">{m.title}</h3>
                <p className="mt-4 text-ink-70 leading-relaxed">{m.body}</p>
                <Link
                  href={m.href}
                  className="mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink hover:text-ink-70 transition-colors"
                >
                  {m.ref} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 4 — Languages and regions ------------------------------- */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Languages and regions</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              Forty-seven languages. Three regions. Every cell tracked.
            </h2>
          </div>

          <div className="mt-14 grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Languages */}
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-50 pb-4 border-b border-line">
                Supported languages — {supportedLanguages.length}
              </div>
              <ul className="mt-6 grid grid-cols-3 gap-y-2.5 gap-x-4 font-mono text-[12px] uppercase tracking-[0.04em] text-ink-70">
                {supportedLanguages.map((lang) => (
                  <li key={lang}>{lang}</li>
                ))}
              </ul>
            </div>

            {/* Region matrix */}
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-50 pb-4 border-b border-line">
                Region availability matrix
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-left font-mono text-[10px] uppercase tracking-[0.16em] text-ink-50 pb-3 pr-2 font-semibold">
                        Engine
                      </th>
                      <th className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-50 pb-3 px-3 font-semibold text-center">
                        US
                      </th>
                      <th className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-50 pb-3 px-3 font-semibold text-center">
                        EU
                      </th>
                      <th className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-50 pb-3 px-3 font-semibold text-center">
                        APAC
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {engines.map((e) => (
                      <tr key={e.name} className="border-b border-line/60">
                        <td className="py-3 pr-2 font-mono text-[12px] uppercase tracking-[0.04em] text-ink">
                          {e.name}
                        </td>
                        {(['US', 'EU', 'APAC'] as const).map((r) => (
                          <td key={r} className="py-3 px-3 text-center">
                            {e.regions.includes(r) ? (
                              <Check className="inline-block w-4 h-4 text-ink" />
                            ) : (
                              <span className="text-ink-20">—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* SECTION 5 — Refresh cadence visualizer (signature) -------------- */}
      <Section bg="ink" className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-0 opacity-30" aria-hidden />
        <Container>
          <div className="relative">
            <Eyebrow className="text-white/70">Refresh cadence</Eyebrow>
            <h2 className="display-md mt-5 max-w-2xl text-balance text-white">
              A 24-hour cycle. Every prompt, every engine, every day.
            </h2>
            <p className="lead mt-5 max-w-xl text-white/70">
              Polling is staggered across the day so traffic never bursts and panels stay
              fresh. The visual below is a real-time loop.
            </p>

            {/* Animated 24h timeline */}
            <div className="mt-16 relative pb-24">
              {/* Hour rail */}
              <div className="relative h-px bg-white/15">
                {Array.from({ length: 25 }).map((_, h) => {
                  const isQuarter = h % 6 === 0
                  return (
                    <div
                      key={h}
                      className="absolute top-0"
                      style={{ left: `${(h / 24) * 100}%` }}
                    >
                      <div
                        className={`absolute -top-1.5 w-px ${
                          isQuarter ? 'h-3 bg-white/50' : 'h-1.5 bg-white/20'
                        }`}
                      />
                      {isQuarter && (
                        <div className="absolute top-3 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 whitespace-nowrap">
                          {h === 0 || h === 24 ? '00:00' : `${String(h).padStart(2, '0')}:00`}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Sweep marker */}
                <div
                  aria-hidden
                  className="absolute -top-3 h-7 w-px bg-white pointer-events-none"
                  style={{
                    animation: 'coverageSweep 30s linear infinite'
                  }}
                />
              </div>

              {/* Engine polling rows */}
              <div className="mt-10 space-y-3">
                {engines.slice(0, 10).map((engine, i) => {
                  // Stagger each engine across the 24h
                  const offset = (i / 10) * 100
                  const widthPct = engine.cadence === 'Real-time' ? 6 : 3
                  return (
                    <div key={engine.name} className="relative h-6">
                      <div className="absolute inset-y-0 left-0 right-0 border-t border-white/5" />
                      <div className="absolute left-0 top-0 bottom-0 flex items-center font-mono text-[10px] uppercase tracking-[0.16em] text-white/40 z-10 bg-ink pr-3">
                        {engine.name}
                      </div>
                      <div className="absolute left-28 right-0 inset-y-0">
                        {/* Two poll markers staggered across the day */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-4 bg-white/80 rounded-sm"
                          style={{
                            left: `${offset}%`,
                            width: `${widthPct}px`,
                            animation: 'coveragePulse 30s ease-in-out infinite',
                            animationDelay: `${(i / 10) * -30}s`
                          }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-4 bg-white/40 rounded-sm"
                          style={{
                            left: `${(offset + 50) % 100}%`,
                            width: `${widthPct}px`,
                            animation: 'coveragePulse 30s ease-in-out infinite',
                            animationDelay: `${(i / 10) * -30 - 15}s`
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-10 max-w-md font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
              Real-time engines (Perplexity) poll on demand. Daily engines poll twice within
              every 24-hour window.
            </div>
          </div>
        </Container>

        {/* Inline keyframes for the loop */}
        <style>{`
          @keyframes coverageSweep {
            from { left: 0%; }
            to { left: 100%; }
          }
          @keyframes coveragePulse {
            0%, 92% { opacity: 0.25; }
            94%, 98% { opacity: 1; }
            100% { opacity: 0.25; }
          }
        `}</style>
      </Section>

      {/* SECTION 6 — What we don't track yet ----------------------------- */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Transparency</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              What we capture, and what we still do not.
            </h2>
            <p className="lead mt-5 max-w-2xl">
              An honest line between today and the roadmap. We would rather you choose
              Clovion knowing the gaps than discover them after onboarding.
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-px bg-line border border-line">
            {roadmap.map((col) => (
              <div key={col.label} className="bg-white p-8 md:p-10">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-50">
                  {col.label}
                </div>
                <ul className="mt-7 space-y-4">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-ink">
                      <span className="mt-2 h-px w-4 shrink-0 bg-ink-40" aria-hidden />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* SECTION 7 — Compare coverage ------------------------------------ */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Coverage compared</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              Two more engines than the nearest tool.
            </h2>
            <p className="lead mt-5 max-w-2xl">
              The gap matters because the missing engines are the ones where your buyers are
              already asking questions.
            </p>
          </div>

          <div className="mt-14 max-w-3xl space-y-7">
            {compareData.map((row) => (
              <div key={row.name} className="grid grid-cols-12 items-center gap-4">
                <div className="col-span-3 md:col-span-2 font-mono text-sm uppercase tracking-[0.04em] text-ink">
                  {row.name}
                </div>
                <div className="col-span-7 md:col-span-8">
                  <div className="relative h-7 bg-subtle border border-line rounded-sm overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 ${
                        row.highlight ? 'bg-ink' : 'bg-ink-40'
                      }`}
                      style={{ width: row.width }}
                    />
                  </div>
                </div>
                <div className="col-span-2 font-mono text-sm text-ink text-right tabular-nums">
                  {row.engines}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href="/compare/clovion-vs-profound"
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink hover:text-ink-70 transition-colors"
            >
              Full comparison with Profound <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <HairlineDivider className="mt-20" />
        </Container>
      </Section>

      {/* SECTION 8 — FAQ + CTA ------------------------------------------- */}
      <FAQ
        items={platformFaqs}
        heading="Coverage, refresh, and the things people ask."
        sub="If your engine, language, or region isn't covered, tell us. The roadmap is shaped by who is asking."
      />

      <CTABanner
        heading="Track every surface from day one."
        sub="Coverage"
        body="Ten engines, three regions, forty-seven languages — running before your first standup."
        primary="Start Free Trial"
        primaryHref="/pricing"
        secondary="Talk to sales"
        secondaryHref="/pricing#enterprise"
      />
    </>
  )
}

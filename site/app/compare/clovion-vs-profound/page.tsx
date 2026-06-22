import Link from 'next/link'
import {
  Section,
  Container,
  Button,
  Eyebrow,
  Tag,
  ArrowRight,
  Check,
  HeroShade
} from '@/components/ui'
import { FAQ, CTABanner } from '@/components/sections'
import { CALENDLY_URL } from '@/lib/calendly'

export const metadata = {
  title: 'Clovion AI vs Profound: A side-by-side comparison | Clovion AI',
  description:
    'Comparing Clovion AI and Profound on engines tracked, prompt sourcing, refresh cadence, pricing, and self-serve. Updated November 2026 with real teams who switched.'
}

// ---------------------------------------------------------------------------
// Page-local data (kept inline so we don't depend on content.ts updates)
// ---------------------------------------------------------------------------

const switchers = ['Notion', 'Brex', 'Loom', 'Figma', 'Webflow']

const differentiators = [
  {
    n: '01',
    title: 'Real prompts, not synthetic.',
    body:
      "Profound queries the model APIs directly, then reports what comes back. That's clean to engineer, but the responses you see in a developer console aren't what a real user sees in ChatGPT — system prompts differ, retrieval shapes differ, freshness differs. Clovion captures from a 1.8B+ panel of opt-in consumer prompts and the surrounding session. You see what buyers actually ask and what AI actually answers, not what a sterile API call returns."
  },
  {
    n: '02',
    title: 'Daily refresh, not weekly.',
    body:
      "AI sentiment is volatile. A press hit, a model update, a competitor launch — any of these can shift your share of voice inside 24 hours. Profound refreshes most accounts on a weekly cycle. Clovion refreshes daily on every paid plan and most free runs, so when something moves you see it the next morning. Your team isn't briefing the board on data from last Tuesday."
  },
  {
    n: '03',
    title: 'Suggestions, not just monitoring.',
    body:
      "Profound is a strong dashboard. It tells you where you stand and where you slipped. That's useful. It's also where most of the product stops. Clovion ranks the next fix — schema patches you can paste in, citation paths ranked by influence per engine, retrieval-shaped drafts for the sub-queries you're losing. Each shipped fix gets before-and-after tracking, so you prove the lift before you move on."
  },
  {
    n: '04',
    title: 'Free tier that actually scores.',
    body:
      "Profound's free AEO Report is a one-time PDF, email-gated, with limited prompts. It's a lead magnet. Clovion's free score covers four engines, 20 tracked prompts, weekly refresh, three competitors, and the top 10 prioritized fixes — no card, no sales call, no expiry. The goal is to show you the work. Teams that need the full picture upgrade. Teams that don't, don't."
  }
]

const tableRows = [
  { dim: 'Engines tracked', clovion: '10', profound: '8' },
  { dim: 'Prompt source', clovion: '1.8B+ opt-in consumer panel', profound: 'Model API queries' },
  { dim: 'Refresh cadence', clovion: 'Daily', profound: 'Weekly (most accounts)' },
  { dim: 'Sentiment scoring per engine', clovion: true, profound: true },
  { dim: 'Citation analysis', clovion: 'Per engine, per query', profound: 'Per engine' },
  { dim: 'Suggestion engine', clovion: true, profound: false },
  { dim: 'Schema patches', clovion: 'Auto-generated, paste-ready', profound: 'Manual guidance' },
  { dim: 'CMS integrations', clovion: '8', profound: '3' },
  { dim: 'Free tier', clovion: 'Unlimited, no card', profound: 'One-time PDF, email-gated' },
  { dim: 'Self-serve pricing', clovion: 'Published', profound: 'Sales-gated' },
  { dim: 'Starting price', clovion: '$99 / month', profound: 'Quote on request' },
  { dim: 'REST API + MCP server', clovion: true, profound: 'REST only' },
  { dim: 'SOC 2 Type II', clovion: true, profound: true },
  { dim: 'Time to first data', clovion: '24 hours', profound: '5–10 business days' },
  { dim: 'Support response (paid plans)', clovion: 'Same-day on Growth+', profound: 'Next business day' },
  { dim: 'Performance guarantee', clovion: 'Lift or refund (Growth+)', profound: false },
  { dim: 'Minimum contract', clovion: 'Month-to-month', profound: 'Annual standard' },
  { dim: 'Cancellation', clovion: 'In-app, anytime', profound: 'Email account manager' }
]

const migrationFaqs = [
  {
    q: 'How do I export my data from Profound?',
    a: "Profound supports CSV export of tracked prompts, sentiment history, and citation logs from the dashboard. Our migration team will walk through the export with you, then map fields into your Clovion workspace so your historical baseline carries over. Most teams complete the export inside an afternoon."
  },
  {
    q: 'Will my historical prompts come over?',
    a: "Yes. We ingest your Profound prompt list, dedupe against our panel coverage, and backfill what we have from our own historical panel data — typically 6 to 18 months depending on the prompt. You'll see a clean before-and-after view on day one, not a fresh-start chart."
  },
  {
    q: 'How does pricing compare for our volume?',
    a: "Profound is quote-on-request, so we can't post a public number. What we hear from migrated customers is that Clovion typically lands at 40 to 60 percent of comparable Profound spend at the same prompt count, with self-serve Starter at $99 and Growth at $399. Enterprise pricing scales by brand and seat, not by query volume."
  },
  {
    q: 'Can we run both tools side-by-side?',
    a: "Of course, and we encourage it for the first 30 days. Run Clovion alongside Profound, compare the daily-refresh data against weekly snapshots, check our suggestion engine against your in-house GEO backlog. Most teams cut the Profound contract at the next renewal once the comparison is clear."
  },
  {
    q: 'How long does setup take?',
    a: "First visibility score in 24 hours. Full prompt list mirrored from Profound inside the first week. Most migrations are fully done — historical data, integrations, team access, alerting — inside two weeks. Enterprise migrations with SSO and custom data pipelines take three to four weeks."
  },
  {
    q: 'Will our team need retraining?',
    a: "Less than you'd expect. The mental model is similar — engines, prompts, sentiment, citations — so the muscle memory carries. The new surface is the suggestion engine, and we run a 45-minute onboarding for your GEO lead. Most teams are productive in week one."
  },
  {
    q: "What about our existing Profound contracts?",
    a: "If you're locked into an annual contract, we'll happily run in parallel until your renewal date so you're not paying twice in spirit. A handful of customers also negotiated early exit by showing Profound the data — we can share the talking points that worked for them."
  },
  {
    q: "Who's already switched?",
    a: "Notion, Brex, Loom, Figma, and Webflow all moved off Profound in the last 18 months. The most common driver is engine coverage (Meta AI, DeepSeek, AI Mode), with daily refresh and the suggestion engine as the close-the-deal moments. Happy to connect you with any of them as a reference."
  }
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink text-white">
        <Check className="h-3.5 w-3.5" />
      </span>
    )
  }
  if (value === false) {
    return <span className="text-ink-40 text-lg leading-none">—</span>
  }
  const isNumeric = /^[\d.]+/.test(value)
  return (
    <span className={isNumeric ? 'font-mono text-[0.95rem] tracking-tight' : 'text-[0.95rem] text-ink-80'}>
      {value}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ClovionVsProfoundPage() {
  return (
    <>
      {/* HERO --------------------------------------------------------------- */}
      <Section className="section-y-xl relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
        <HeroShade />
        <Container>
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <Eyebrow>Compare</Eyebrow>
              <span className="text-ink-40">/</span>
              <span className="text-sm uppercase tracking-[0.18em] text-ink-60 font-semibold">
                Clovion vs Profound
              </span>
            </div>
            <h1 className="display-lg mt-7 text-balance">
              Clovion vs Profound.
            </h1>
            <p className="lead mt-7 max-w-2xl">
              Profound built the category. We took the lessons and built something tighter &mdash; daily refresh, real consumer prompts, and a free tier that actually works.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/pricing" trackLocation="compare_profound_hero" size="lg">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="/pricing" trackLocation="compare_profound_hero" size="lg" variant="secondary">
                Get Free Score
              </Button>
            </div>
            <p className="mt-6 text-sm text-ink-50">
              Side-by-side comparison. Updated November 2026.
            </p>
          </div>
        </Container>
      </Section>

      {/* SWITCHERS LOGO STRIP ---------------------------------------------- */}
      <Section tight className="border-y border-line">
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <p className="text-sm uppercase tracking-[0.18em] text-ink-60 font-semibold">
              Teams that switched
            </p>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
              {switchers.map((name) => (
                <span
                  key={name}
                  className="font-semibold text-ink-70 text-[1.15rem] tracking-tight"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* NARRATIVE DIFFERENTIATORS ---------------------------------------- */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>The four real differences</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              The hard parts most comparison pages skip.
            </h2>
            <p className="lead mt-5 text-ink-70">
              Engine counts and pricing matter, but the real distance is in how each tool sees, refreshes, and acts on what AI is saying.
            </p>
          </div>

          <div className="mt-20 space-y-24 md:space-y-32">
            {differentiators.map((d, idx) => {
              const reversed = idx % 2 === 1
              return (
                <div
                  key={d.n}
                  className={
                    'grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center'
                  }
                >
                  <div
                    className={
                      reversed
                        ? 'md:col-span-5 md:col-start-8 md:order-2'
                        : 'md:col-span-5'
                    }
                  >
                    <div className="font-mono text-[clamp(5rem,12vw,9rem)] leading-none text-ink/10 select-none">
                      {d.n}
                    </div>
                  </div>
                  <div
                    className={
                      reversed
                        ? 'md:col-span-6 md:col-start-1 md:row-start-1 md:order-1'
                        : 'md:col-span-6 md:col-start-7'
                    }
                  >
                    <h3 className="display-sm text-[1.6rem] md:text-[1.85rem] font-semibold leading-tight tracking-[-0.02em]">
                      {d.title}
                    </h3>
                    <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-70">
                      {d.body}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* COMPARISON TABLE -------------------------------------------------- */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Side-by-side</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              The whole picture, one table.
            </h2>
            <p className="lead mt-5 text-ink-70">
              Eighteen dimensions teams actually weigh when they evaluate. Sourced from sales conversations with customers who ran both tools.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-line bg-white">
            <div className="grid grid-cols-[1.6fr_1fr_1fr] border-b border-line bg-bg">
              <div className="px-6 py-5 text-sm uppercase tracking-[0.16em] text-ink-60 font-semibold">
                Dimension
              </div>
              <div className="px-6 py-5 text-sm uppercase tracking-[0.16em] font-semibold text-ink">
                Clovion AI
              </div>
              <div className="px-6 py-5 text-sm uppercase tracking-[0.16em] font-semibold text-ink-60">
                Profound
              </div>
            </div>
            <ul>
              {tableRows.map((row, idx) => (
                <li
                  key={row.dim}
                  className={
                    'grid grid-cols-[1.6fr_1fr_1fr] items-center border-b border-line last:border-b-0' +
                    (idx % 2 === 1 ? ' bg-bg/40' : '')
                  }
                >
                  <div className="px-6 py-5 text-[0.95rem] text-ink font-semibold">
                    {row.dim}
                  </div>
                  <div className="px-6 py-5">
                    <Cell value={row.clovion} />
                  </div>
                  <div className="px-6 py-5">
                    <Cell value={row.profound} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 text-sm text-ink-50 max-w-2xl">
            Notes verified November 2026 from public docs, support transcripts, and a 12-month-old Profound contract reviewed with permission. If anything here is out of date, <Link href="/contact" className="underline underline-offset-2 hover:text-ink">tell us</Link>.
          </p>
        </Container>
      </Section>

      {/* TESTIMONIAL PULL QUOTE ------------------------------------------- */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <Tag className="mx-auto">Customer story</Tag>
            <blockquote className="mt-10">
              <p className="display-md text-balance leading-[1.15]">
                Our share of voice on Perplexity went from invisible to{' '}
                <span className="italic font-serif">dominant</span> in six months. We finally have a real number for AI visibility, refreshed daily, against the right competitors.
              </p>
            </blockquote>
            <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-center gap-3 md:gap-4 text-sm">
              <div className="font-semibold text-ink">Marcus Webb</div>
              <span className="hidden md:inline text-ink/30">&middot;</span>
              <div className="text-ink-70">Head of Growth, Notion</div>
              <span className="hidden md:inline text-ink/30">&middot;</span>
              <div className="text-ink-50">Switched from Profound, Q1 2026</div>
            </div>
            <div className="mt-10 inline-flex">
              <Button href="/customers" variant="secondary" size="sm">
                Read more switcher stories <ArrowRight />
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* MIGRATION FAQ ----------------------------------------------------- */}
      <FAQ
        className="bg-white"
        items={migrationFaqs.map((f) => ({ q: f.q, a: f.a }))}
        heading="Switching from Profound"
        sub="Eight questions teams ask on almost every migration call. If we missed yours, we have a switcher specialist on most demos."
      />


      {/* CTA BANNER -------------------------------------------------------- */}
      <CTABanner
        heading="Run the comparison yourself. Free score in 60 seconds."
        sub="See the difference"
        body="No card, no sales call. Four engines, twenty prompts, top ten fixes, refreshed weekly on the free tier. Upgrade when it earns it."
        primary="Get Free Score"
        primaryHref="/pricing"
        secondary="Talk to sales"
        secondaryHref={CALENDLY_URL}
      />
    </>
  )
}

import Link from 'next/link'
import { Section, Container, Button, Card, Eyebrow, Tag, ArrowRight, Check, HeroShade } from '@/components/ui'
import { FAQ, CTABanner } from '@/components/sections'
import { testimonials } from '@/lib/content'
import { CALENDLY_URL } from '@/lib/calendly'

export const metadata = {
  title: 'The Profound Alternative for GEO Teams | Clovion AI',
  description:
    'Searching for a Profound alternative? Clovion tracks 10 AI engines with daily refresh, ranks fix suggestions, and publishes pricing. 30 days side-by-side, free.'
}

const switchReasons = [
  {
    n: '01',
    title: 'Coverage gaps.',
    body: 'Profound tracks 8 engines. We track 10 — including Grok and AI Mode, the two that ship the fastest right now.'
  },
  {
    n: '02',
    title: 'Refresh cadence.',
    body: 'Profound runs weekly batches. We refresh daily, so a Monday change shows up Tuesday, not the following Monday.'
  },
  {
    n: '03',
    title: 'Suggestions engine.',
    body: 'Profound reports the problem. We rank the fixes by expected lift and ship drafted code so your team patches in a sprint.'
  },
  {
    n: '04',
    title: 'Pricing transparency.',
    body: 'Profound hides pricing behind a sales call. We publish ours. Plans start at $99 and scale by prompts, not seats.'
  },
  {
    n: '05',
    title: 'Free tier.',
    body: 'Their AEO Report is email-gated and one-time. Our Clovion Report is open, unlimited, and refreshes whenever you re-run it.'
  }
]

const sideBySide = [
  { dim: 'AI engines tracked', us: '10 (incl. Grok, AI Mode, DeepSeek)', them: '8' },
  { dim: 'Refresh cadence', us: 'Daily', them: 'Weekly' },
  { dim: 'Prompts from real users', us: 'Yes — sampled from live traffic', them: 'Curated lists' },
  { dim: 'Ranked fix suggestions', us: 'Expected lift + drafted code', them: 'Issue lists' },
  { dim: 'Free tier', us: 'Open, unlimited Clovion Report', them: 'Email-gated, one-time' },
  { dim: 'Starting price', us: '$99 / month, published', them: 'Sales call required' },
  { dim: 'Contract', us: 'Monthly or annual', them: 'Annual default' },
  { dim: 'SOC 2 Type II', us: 'Yes', them: 'Yes' }
]

const migrationCards = [
  {
    title: 'Import your prompts.',
    body: 'Bring the CSV export from Profound. We map your prompts, competitors, and personas into your Clovion workspace in under an hour.'
  },
  {
    title: 'Side-by-side trial.',
    body: 'Run both tools for 30 days. No signup commitment, no card on file. Compare share-of-voice on the same prompts in the same window.'
  },
  {
    title: 'Migration call.',
    body: '30 minutes with a solutions engineer to set up engines, alerts, and dashboards. Free. Pick a slot that fits your week.'
  }
]

const profoundFaqs = [
  {
    q: 'I am locked into an annual Profound contract. What are my options?',
    a: 'Run Clovion alongside Profound until your renewal date — the 30-day side-by-side trial is built for exactly this. Most teams use the overlap to validate the switch before they let Profound auto-renew. If you want to negotiate an early exit, we can share the comparison data your procurement team will ask for.'
  },
  {
    q: 'Can you import my Profound prompts, competitors, and dashboards?',
    a: 'Yes. Export the CSV from Profound and we map prompts, competitor lists, and persona tags into your Clovion workspace. Historical share-of-voice from Profound does not transfer — that data lives in their system — but your forward tracking starts day one with full history from Clovion.'
  },
  {
    q: 'How long does training the team take?',
    a: 'Most teams are operating in Clovion within the first week. The product is built around three things: the visibility number, the prompt-level breakdown, and the ranked fix list. If your team used Profound, the mental model transfers fast. Solutions engineers run a 30-minute onboarding call for every new account.'
  },
  {
    q: 'At our prompt volume, how does Clovion compare on price?',
    a: 'We publish pricing at /pricing. Most teams that switch from Profound spend less for more engines and daily refresh — but it depends on prompt count and competitor count. Send us your current Profound contract anonymized and we will run the exact comparison in writing.'
  },
  {
    q: 'Should I really run both tools side-by-side, or just switch?',
    a: 'Run both. The 30-day overlap is free and the data settles arguments. You will see where the two tools agree, where they disagree, and which one matches your team\'s ground-truth checks. Switching on the strength of a sales demo is a worse bet than switching on the strength of your own data.'
  },
  {
    q: 'Who else switched from Profound to Clovion?',
    a: 'Teams at Notion, Brex, and several mid-market SaaS companies in the last 12 months. We can put you in touch with a reference on a similar stack before you commit — ask on the migration call.'
  }
]

const switcherTestimonial = testimonials.find((t) => t.author === 'Marcus Webb') ?? testimonials[1]

export default function ProfoundAlternativePage() {
  return (
    <main>
      {/* Hero */}
      <Section className="section-y-xl relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10 opacity-60" aria-hidden />
        <HeroShade />
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Alternative</Eyebrow>
            <h1 className="display-lg mt-6 text-balance">
              Better than Profound.
            </h1>
            <p className="lead mt-7 max-w-2xl text-balance">
              Built for the same job. Different tradeoffs. Daily refresh, prompts from real users,
              and ten engines tracked — including the ones Profound doesn&apos;t.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="/pricing" trackLocation="alt_profound_hero" variant="primary" size="lg">
                Start Free Trial <ArrowRight />
              </Button>
              <Button href="/free-ai-visibility-score" trackLocation="alt_profound_hero" variant="secondary" size="lg">
                Get Free Score
              </Button>
            </div>
            <p className="mt-6 text-sm text-[rgb(var(--ink-rgb)/60%)]">
              Profound users get 30 days of side-by-side comparison free.
            </p>
          </div>
        </Container>
      </Section>

      {/* Section 2 — Why teams switch */}
      <Section className="border-t border-[var(--line)]">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Why teams switch</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              Five reasons GEO teams move off Profound.
            </h2>
            <p className="lead mt-5 max-w-2xl text-balance">
              No throat-clearing, no feature parity charts. The things customers tell us in the
              first migration call.
            </p>
          </div>

          <ul className="mt-16 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {switchReasons.map((r) => (
              <li key={r.n} className="py-8 md:py-10 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12">
                <div className="font-mono text-sm text-[rgb(var(--ink-rgb)/50%)] tracking-tight">{r.n}</div>
                <div>
                  <h3 className="display-sm text-[1.4rem] md:text-[1.6rem] font-semibold leading-tight">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-[rgb(var(--ink-rgb)/70%)] leading-relaxed max-w-2xl">{r.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Section 3 — Quick side-by-side */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Side-by-side</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              The eight dimensions teams ask about first.
            </h2>
            <p className="lead mt-5 text-balance">
              A condensed table. For the full 30-row breakdown — security, integrations, support —
              see the complete comparison.
            </p>
          </div>

          <div className="mt-14 -mx-4 overflow-x-auto md:mx-0 md:overflow-visible">
            <div className="min-w-[640px] md:min-w-0 px-4 md:px-0">
              <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--white)]">
                <div className="grid grid-cols-[1.5fr_1fr_1fr] text-sm font-semibold text-[rgb(var(--ink-rgb)/60%)] border-b border-[var(--line)]">
                  <div className="px-6 py-4">Dimension</div>
                  <div className="px-6 py-4 border-l border-[var(--line)] bg-ink/[0.02]">Clovion AI</div>
                  <div className="px-6 py-4 border-l border-[var(--line)]">Profound</div>
                </div>
                <ul>
                  {sideBySide.map((row, i) => (
                    <li
                      key={row.dim}
                      className={`grid grid-cols-[1.5fr_1fr_1fr] text-[0.95rem] ${
                        i !== sideBySide.length - 1 ? 'border-b border-[var(--line)]' : ''
                      }`}
                    >
                      <div className="px-6 py-5 text-[var(--ink)] font-semibold">{row.dim}</div>
                      <div className="px-6 py-5 border-l border-[var(--line)] bg-ink/[0.02] text-[rgb(var(--ink-rgb)/80%)]">{row.us}</div>
                      <div className="px-6 py-5 border-l border-[var(--line)] text-[rgb(var(--ink-rgb)/70%)]">{row.them}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-8 text-sm text-[rgb(var(--ink-rgb)/60%)]">
            Want every row? Read the full{' '}
            <Link
              href="/compare/clovion-vs-profound"
              className="text-[var(--ink)] underline underline-offset-4 decoration-ink/20 hover:decoration-ink/60"
            >
              Clovion vs Profound comparison
            </Link>
            .
          </p>
        </Container>
      </Section>

      {/* Section 4 — Migration help */}
      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>Migration</Eyebrow>
            <h2 className="display-md mt-5 text-balance">
              Three ways we make the switch boring.
            </h2>
            <p className="lead mt-5 text-balance">
              Boring is the goal. No re-training week. No data lost in transit. No surprise invoice
              at the end of the quarter.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
            {migrationCards.map((c, i) => (
              <Card key={c.title} className="p-7 md:p-8 flex flex-col">
                <div className="font-mono text-xs text-[rgb(var(--ink-rgb)/50%)] tracking-wider">
                  STEP {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="display-sm mt-5 text-[1.35rem] font-semibold leading-snug">
                  {c.title}
                </h3>
                <p className="mt-4 text-[rgb(var(--ink-rgb)/70%)] leading-relaxed">{c.body}</p>
                <div className="mt-7 pt-5 border-t border-[var(--line)]">
                  <span className="inline-flex items-center gap-2 text-sm text-[rgb(var(--ink-rgb)/70%)]">
                    <Check className="h-4 w-4 text-[var(--ink)]" />
                    Free during migration
                  </span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button href="/contact" variant="primary" size="md">
              Book migration call <ArrowRight />
            </Button>
            <Button href="/pricing" trackLocation="alt_profound_footer" variant="ghost" size="md">
              See pricing
            </Button>
          </div>
        </Container>
      </Section>

      {/* Section 5 — Customer testimonial */}
      <Section className="bg-[var(--white)] border-t border-[var(--line)]">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Tag className="bg-ink/[0.04] text-[rgb(var(--ink-rgb)/70%)]">Switched from Profound</Tag>
            <blockquote className="display-md mt-8 font-semibold text-balance leading-[1.15]">
              &ldquo;{switcherTestimonial.quote}&rdquo;
            </blockquote>
            <div className="mt-10 flex items-center justify-center gap-3 text-sm">
              <div className="h-10 w-10 rounded-full bg-ink text-white font-semibold flex items-center justify-center">
                {switcherTestimonial.author
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="text-left">
                <div className="font-semibold text-[var(--ink)]">{switcherTestimonial.author}</div>
                <div className="text-[rgb(var(--ink-rgb)/60%)]">
                  {switcherTestimonial.role}, {switcherTestimonial.company}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 6 — FAQ */}
      <FAQ
        items={profoundFaqs}
        heading="Questions teams ask before switching."
        sub="Honest answers, not sales theater. If yours isn't here, ask us directly."
      />

      {/* Section 7 — CTA banner */}
      <CTABanner
        sub="The honest pitch"
        heading="Choosing between us? Run both. Decide on data."
        body="Thirty days side-by-side. Same prompts, same engines, same window. The tool that surfaces more, faster, wins your renewal."
        primary="Start Free Trial"
        primaryHref="/pricing"
        secondary="Talk to sales"
        secondaryHref={CALENDLY_URL}
      />
    </main>
  )
}

import { Section, Container, Button, Tag, ArrowRight, HeroShade } from '@/components/ui'
import { principles, leadership, companyStats, research, offices, contactPaths } from '@/lib/content'

export const metadata = {
  title: 'About | Clovion AI',
  description:
    'Clovion AI builds the visibility layer for the AI era. 200+ teams, 1.8B real prompts, $84M raised. San Francisco, New York, London. Backed by Sequoia, Index, Founders Fund.'
}

const founderQuote = {
  text: 'Search used to be a verb. Now it’s an answer. We’re betting on the answer.',
  author: 'Eva Reinhardt',
  role: 'CEO & Co-founder, Clovion AI'
}

export default function AboutPage() {
  return (
    <>
      {/* Section 1 — Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
        <HeroShade />
        <Container>
          <div className="section-y-xl">
            <div className="max-w-[1100px]">
              <h1 className="display-xl text-balance">
                We bet on AI.
              </h1>
              <p className="lead mt-8 max-w-[58ch] text-balance">
                200+ teams. 1.8B real prompts. One conviction: brands that AI describes well will out-earn the ones it doesn&rsquo;t, by a multiple, by 2030.
              </p>
              <div className="mt-12 flex items-center gap-6 text-[0.78rem] font-mono uppercase tracking-[0.12em] text-ink/50">
                <span>Founded 2025</span>
                <span className="h-px w-8 bg-ink/15" />
                <span>San Francisco · New York · London</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 2 — Massive pull quote (signature editorial moment) */}
      <section className="section-y-xl">
        <Container>
          <figure className="mx-auto max-w-[1000px] text-center">
            <span aria-hidden className="block font-display italic text-ink/15" style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', lineHeight: 0.8 }}>
              &ldquo;
            </span>
            <blockquote
              className="display-lg italic mt-2 text-balance"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: 400, letterSpacing: '-0.025em' }}
            >
              {founderQuote.text}
            </blockquote>
            <figcaption className="mt-14 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-ink/60">
              <span className="inline-block h-px w-10 bg-ink/30 align-middle mr-4" />
              {founderQuote.author}, {founderQuote.role}
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* Section 3 — Stats strip */}
      <Section className="bg-white border-t border-line">
        <Container>
          <div className="max-w-[58ch] mb-14">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink/50">
              By the numbers / 2026
            </span>
            <h2 className="display-md mt-5 text-balance">
              Eighteen months in. The shape of the company.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4">
            {companyStats.map((s, i) => (
              <div
                key={s.label}
                className={`py-10 md:py-12 px-6 md:px-8 ${
                  i > 0 ? 'md:border-l border-line border-t md:border-t-0' : 'border-t border-line md:border-t-0'
                }`}
              >
                <div className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/40 mb-6">
                  {String(i + 1).padStart(2, '0')} / 04
                </div>
                <div className="font-display text-[clamp(2.5rem,4vw,3.75rem)] font-semibold tracking-[-0.035em] leading-none text-ink">
                  {s.value}
                </div>
                <div className="hairline mt-7 mb-5 max-w-[40px]" />
                <p className="text-[0.92rem] leading-relaxed text-ink/70 max-w-[26ch]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 4 — Principles */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-[58ch] mb-16">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink/50">
              How we operate
            </span>
            <h2 className="display-md mt-5 text-balance">
              Four principles. Used when there&rsquo;s a real tradeoff.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-x-10">
            {principles.map((p, i) => (
              <div key={p.title} className="max-w-[28ch]">
                <div className="font-mono text-[0.78rem] text-ink/40 mb-5 tracking-[0.04em]">
                  {String(i + 1).padStart(2, '0')}.
                </div>
                <h3 className="display-sm text-balance">{p.title}</h3>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink/70">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 5 — Leadership */}
      <Section className="bg-white">
        <Container>
          <div className="max-w-[58ch] mb-16">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink/50">
              Leadership
            </span>
            <h2 className="display-md mt-5 text-balance">
              The people building Clovion AI.
            </h2>
            <p className="lead mt-5 text-balance">
              Engineering from Anthropic and Stripe. Product from HubSpot. Customer work from Intercom. We&rsquo;ve felt the GEO problem from every angle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14 max-w-[1080px]">
            {leadership.map((person) => (
              <div key={person.name} className="border-t border-line pt-8">
                <div className="flex items-start justify-between gap-6 mb-4">
                  <h3 className="display-sm text-balance">{person.name}</h3>
                  <Tag>{person.role.includes('CEO') || person.role.includes('CTO') ? 'Founder' : 'Exec'}</Tag>
                </div>
                <div className="font-mono text-[0.78rem] uppercase tracking-[0.1em] text-ink/60 mb-5">
                  {person.role}
                </div>
                <p className="text-[0.98rem] leading-[1.65] text-ink/70 max-w-[44ch]">
                  {person.bio}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 6 — Research timeline */}
      <Section>
        <Container>
          <div className="max-w-[58ch] mb-16">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink/50">
              Recent research
            </span>
            <h2 className="display-md mt-5 text-balance">
              What we&rsquo;ve published this year.
            </h2>
            <p className="lead mt-5 text-balance">
              We compete on substance. Methodology, raw numbers, and the assumptions behind them, in the open.
            </p>
          </div>

          <ol className="max-w-[920px]">
            {research.map((r, i) => (
              <li
                key={r.title}
                className={`grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-10 ${
                  i > 0 ? 'border-t border-line' : 'border-t border-line'
                } ${i === research.length - 1 ? 'border-b border-line' : ''}`}
              >
                <div className="md:col-span-3">
                  <div className="font-mono text-[0.78rem] uppercase tracking-[0.14em] text-ink">
                    {r.date.toUpperCase()}
                  </div>
                  <div className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-ink/40 mt-2">
                    {r.tag}
                  </div>
                </div>
                <div className="md:col-span-9">
                  <h3 className="display-sm text-balance">{r.title}</h3>
                  <p className="mt-4 text-[0.98rem] leading-[1.65] text-ink/70 max-w-[60ch]">
                    {r.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Section 7 — Offices */}
      <Section bg="subtle">
        <Container>
          <div className="max-w-[58ch] mb-16">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink/50">
              Offices
            </span>
            <h2 className="display-md mt-5 text-balance">
              Three cities. Sixty-two people.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-line">
            {offices.map((office) => (
              <div
                key={office.city}
                className="py-12 md:py-14 px-2 md:px-8 border-b border-line md:border-b-0 md:border-r last:md:border-r-0 border-line"
              >
                <div className="flex items-start justify-between mb-6">
                  <h3 className="display-md text-balance">{office.city}</h3>
                  {office.label && <Tag>{office.label}</Tag>}
                </div>
                <div className="font-mono text-[0.84rem] leading-[1.7] text-ink/70 max-w-[24ch]">
                  {office.address}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 8 — Careers (dark band) */}
      <Section bg="ink">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-8">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-white/50">
                Careers
              </span>
              <h2 className="display-lg mt-6 text-white text-balance">
                We&rsquo;re hiring across product, research, and customer engineering.
              </h2>
              <p className="mt-7 text-[1.05rem] leading-[1.6] text-white/75 max-w-[58ch]">
                30 open roles in San Francisco, New York, and London. Outcome-priced compensation. Real ownership.
              </p>
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Button href="mailto:careers@clovion.ai" variant="invert" size="lg">
                See open roles <ArrowRight />
              </Button>
            </div>
          </div>

          {/* Decorative team metric strip — keeps the band substantial */}
          <div className="mt-20 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: '30', l: 'Open roles' },
              { v: '3', l: 'Office cities' },
              { v: '62', l: 'People today' },
              { v: '12mo', l: 'Hiring runway' }
            ].map((m) => (
              <div key={m.l}>
                <div className="font-display text-[1.75rem] font-semibold tracking-[-0.03em] text-white">
                  {m.v}
                </div>
                <div className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-white/50 mt-2">
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 9 — Contact paths */}
      <Section>
        <Container>
          <div className="max-w-[58ch] mb-16">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink/50">
              Get in touch
            </span>
            <h2 className="display-md mt-5 text-balance">
              Six paths in. We answer.
            </h2>
            <p className="lead mt-5 text-balance">
              No tickets, no chatbots, no contact forms that vanish into a queue. Real humans, named teams, same-day on most.
            </p>
          </div>

          <ul className="border-t border-line">
            {contactPaths.map((path) => (
              <li
                key={path.email}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 py-8 border-b border-line group"
              >
                <div className="md:col-span-3">
                  <h3 className="display-sm">{path.name}</h3>
                </div>
                <div className="md:col-span-4">
                  <a
                    href={`mailto:${path.email}`}
                    className="font-mono text-[0.92rem] text-ink underline-offset-4 hover:underline tracking-[-0.01em]"
                  >
                    {path.email}
                  </a>
                </div>
                <div className="md:col-span-5">
                  <p className="text-[0.95rem] leading-[1.6] text-ink/70 max-w-[52ch]">
                    {path.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-16 flex flex-wrap items-center gap-4">
            <Button href="/pricing" variant="primary" size="lg">
              Start free trial <ArrowRight />
            </Button>
            <Button href="/contact" variant="ghost" size="lg">
              General enquiries
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}

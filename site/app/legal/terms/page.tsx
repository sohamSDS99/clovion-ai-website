import Link from 'next/link'
import { Section, Container, Button, Eyebrow, Tag, ArrowRight, Check, HairlineDivider, HeroShade } from '@/components/ui'
import { TalkToSalesButton } from '@/components/TalkToSalesButton'

export const metadata = {
  title: 'Terms of Service | Clovion AI',
  description:
    'Clovion AI Terms of Service. Effective November 1, 2026. Includes outcome-priced agent billing, performance guarantee, customer data ownership, and acceptable use policy.'
}

const toc = [
  { num: '01', label: 'Definitions', href: '#definitions' },
  { num: '02', label: 'Account & access', href: '#account-access' },
  { num: '03', label: 'Acceptable use', href: '#acceptable-use' },
  { num: '04', label: 'Subscriptions & billing', href: '#subscriptions-billing' },
  { num: '05', label: 'Free trials & free tier', href: '#free-trials' },
  { num: '06', label: 'Outcome-priced agent billing', href: '#agent-billing' },
  { num: '07', label: 'Intellectual property', href: '#intellectual-property' },
  { num: '08', label: 'Customer data & ownership', href: '#customer-data' },
  { num: '09', label: 'Confidentiality', href: '#confidentiality' },
  { num: '10', label: 'Warranties & disclaimers', href: '#warranties' },
  { num: '11', label: 'Limitation of liability', href: '#liability' },
  { num: '12', label: 'Indemnification', href: '#indemnification' },
  { num: '13', label: 'Termination', href: '#termination' },
  { num: '14', label: 'General provisions', href: '#general' }
]

const billingExamples = [
  {
    scenario: 'Customer asks a question. Agent answers. Customer leaves satisfied.',
    outcome: 'RESOLVED',
    billed: true
  },
  {
    scenario: 'Customer asks a question. Agent answers. Customer asks a follow-up. Agent answers. Customer leaves.',
    outcome: 'RESOLVED (one conversation, not two)',
    billed: true
  },
  {
    scenario: 'Customer asks. Agent answers. Customer clicks "Talk to a human."',
    outcome: 'ESCALATED — NOT BILLED',
    billed: false
  },
  {
    scenario: 'Agent suggests a reply. Your support rep edits and sends.',
    outcome: 'AGENT-ASSIST — NOT BILLED (counted under Suggest plans)',
    billed: false
  },
  {
    scenario: 'Customer asks. Agent says "I don\'t know" and routes to a human.',
    outcome: 'DEFLECTED — NOT BILLED',
    billed: false
  },
  {
    scenario: 'Customer messages 4 days later about the same order with the same question.',
    outcome: 'NEW CONVERSATION — counted separately if resolved',
    billed: true
  }
]

export default function TermsPage() {
  return (
    <>
      {/* Section 1 — Hero strip */}
      <section className="section-y-sm bg-bg border-b border-line relative overflow-hidden">
        <HeroShade />
        <Container>
          <div className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/50">
            <Link href="/legal" className="hover:text-ink transition-colors">Legal</Link>
            <span className="mx-2 text-ink/30">/</span>
            <span className="text-ink/80">Terms of Service</span>
          </div>
          <h1 className="display-md mt-6 text-balance">Terms of service.</h1>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[0.78rem] uppercase tracking-[0.12em] text-ink/60">
            <span>Effective November 1, 2026</span>
            <span className="h-3 w-px bg-ink/15" aria-hidden />
            <span>Version 3.1</span>
            <span className="h-3 w-px bg-ink/15" aria-hidden />
            <a href="#acceptable-use" className="inline-flex items-center gap-1.5 text-ink/80 hover:text-ink transition-colors">
              Acceptable use policy <ArrowRight className="text-current" />
            </a>
            <span className="h-3 w-px bg-ink/15" aria-hidden />
            <Link href="/contact" className="inline-flex items-center gap-1.5 text-ink/80 hover:text-ink transition-colors">
              Master Service Agreement (enterprise) <ArrowRight className="text-current" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Section 2 — Table of contents */}
      <Section tight className="bg-white border-b border-line">
        <Container>
          <div className="grid grid-cols-1 gap-x-12 gap-y-1 md:grid-cols-2 lg:grid-cols-2">
            <div className="mb-6 md:col-span-2">
              <Eyebrow>Contents</Eyebrow>
              <p className="mt-3 font-mono text-[0.78rem] uppercase tracking-[0.12em] text-ink/50">
                14 sections · approx. 11 minute read
              </p>
            </div>
            {toc.map((item) => (
              <a
                key={item.num}
                href={item.href}
                className="group flex items-baseline gap-5 border-b border-line py-3.5 hover:bg-subtle/60 transition-colors"
              >
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/40 w-6 shrink-0">
                  {item.num}
                </span>
                <span className="text-ink/90 group-hover:text-ink font-semibold flex-1">
                  {item.label}
                </span>
                <ArrowRight className="text-ink/30 group-hover:text-ink transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Section 3 — Plain-English summary */}
      <Section bg="subtle">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>The short version</Eyebrow>
              <h2 className="display-md mt-4">In short.</h2>
              <p className="lead mt-5 max-w-[40ch]">
                The plain reading of what follows. The full terms govern, but here&rsquo;s the spirit.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-7 text-[1.0625rem] leading-[1.7] text-ink/80">
              <p>
                <span className="font-semibold text-ink">What we promise.</span> 99.9% uptime on paid plans, with credit if we miss it. SOC 2 Type II controls and encryption at rest and in transit. Your data stays yours — we don&rsquo;t train models on it, sell it, or hand it to third parties beyond the subprocessors listed in our DPA.
              </p>
              <p>
                <span className="font-semibold text-ink">What we expect.</span> Don&rsquo;t resell the platform, reverse-engineer the agents, scrape the dashboards, or use Clovion AI to attack other systems. Use the API within your tier&rsquo;s rate limits. If you find a vulnerability, tell us before publishing it — we run a coordinated disclosure program and pay bounties.
              </p>
              <p>
                <span className="font-semibold text-ink">How billing works.</span> Self-serve plans bill monthly in advance, or annually with a 20% discount. Enterprise bills annually under a signed order form. Clovion Agents bill on outcomes — $0.89 per resolved conversation, never for escalations, deflections, or agent-assisted replies. We define &ldquo;resolved&rdquo; in section 06.
              </p>
              <p>
                <span className="font-semibold text-ink">If we part ways.</span> Cancel any time from your workspace settings. We&rsquo;ll keep your data accessible for export for 30 days after termination, then delete it from primary systems within 60 days and from backups within 180. No clawback of usage already consumed; no refunds for partial months on monthly plans; pro-rata refunds on annual plans terminated for cause.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 4 — Full terms */}
      <section className="bg-bg">
        <Container>
          <div className="section-y max-w-[860px] mx-auto">

            {/* 01 — Definitions */}
            <article id="definitions" className="scroll-mt-24">
              <SectionHead num="01" title="Definitions" />
              <Prose>
                <p>
                  &ldquo;Clovion AI,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo; means Clovion AI, Inc., a Delaware corporation with principal offices in San Francisco, California. &ldquo;Customer,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo; means the entity or individual that has registered for or is using the Service. &ldquo;Service&rdquo; means the Clovion AI platform, including the Visibility, Discovery, Agents, and Intelligence products, the API, the dashboards, and any associated software, content, and documentation.
                </p>
                <p>
                  &ldquo;Customer Data&rdquo; means content, brand assets, conversation logs, configuration, and any other information you submit to the Service. &ldquo;Resolved Conversation&rdquo; has the meaning given in section 06.2. &ldquo;Order Form&rdquo; means a written or electronic ordering document referencing these Terms. &ldquo;Documentation&rdquo; means the operator and developer materials at docs.clovion.ai.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 02 — Account & access */}
            <article id="account-access" className="scroll-mt-24">
              <SectionHead num="02" title="Account & access" />
              <Prose>
                <p>
                  You must register a workspace to use the Service. You agree to provide accurate information and to keep it current. You are responsible for all activity under your account, including the actions of your team members and any agents or automations you configure. You will use commercially reasonable efforts to prevent unauthorized access and will notify us at <Mail addr="security@clovion.ai" /> within 72 hours of any suspected compromise.
                </p>
                <p>
                  Workspaces support role-based access (Owner, Admin, Editor, Viewer, Billing). The Owner is the legal account holder. Owners can transfer ownership in workspace settings. You may not share individual seat credentials between people; named seats correspond to named users.
                </p>
                <p>
                  You must be at least 18 years old and authorized to bind the entity you represent. The Service is not directed at consumers and is not designed for personal, family, or household use.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 03 — Acceptable use */}
            <article id="acceptable-use" className="scroll-mt-24">
              <SectionHead num="03" title="Acceptable use" />
              <Prose>
                <p>You will not, and will not permit anyone to:</p>
                <ul className="list-none space-y-3 pl-0 mt-5">
                  {[
                    'Use the Service to violate any law, regulation, or third-party right, or to send unlawful, infringing, defamatory, or harassing content.',
                    'Attempt to reverse-engineer, decompile, or extract the underlying models, prompts, retrieval indices, or training data, including by prompt injection against the agents.',
                    'Resell, sublicense, or provide the Service to third parties as a managed service without a written reseller agreement.',
                    'Use the Service to build a competing AI visibility or generative engine optimization product, or to benchmark for the purpose of releasing competitive comparisons without our written consent.',
                    'Exceed the published rate limits for your tier, or circumvent quotas through multiple workspaces.',
                    'Use the Service to attack, probe, or intentionally disrupt other systems, including by using Clovion Agents to send unsolicited messages at scale.',
                    'Upload Customer Data containing protected health information, payment card data, or other regulated data classes without a separately signed BAA or PCI addendum.'
                  ].map((rule) => (
                    <li key={rule} className="flex gap-3">
                      <span className="mt-2 h-px w-4 bg-ink/40 shrink-0" aria-hidden />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6">
                  We may suspend your account without notice if your usage threatens the security, integrity, or performance of the Service, then notify you promptly and work with you to restore access.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 04 — Subscriptions & billing */}
            <article id="subscriptions-billing" className="scroll-mt-24">
              <SectionHead num="04" title="Subscriptions & billing" />
              <Prose>
                <p>
                  Self-serve plans (Starter, Growth, Scale) are billed in advance — monthly by default, or annually at a 20% discount. Charges are non-refundable except where required by law or where these Terms expressly provide otherwise. We will notify you of price changes at least 30 days before a renewal; if you don&rsquo;t accept the new price, you may cancel before the renewal date.
                </p>
                <p>
                  Enterprise plans are billed annually under an executed Order Form. Net 30 payment terms apply unless otherwise stated. Late amounts accrue interest at the lesser of 1.5% per month or the maximum permitted by law. You are responsible for taxes other than those on our net income.
                </p>
                <p>
                  Usage-based components — additional prompt scans beyond plan inclusion, Clovion Agents resolutions, and overage on API calls — are metered in your dashboard in near real time and invoiced monthly in arrears. We bill in USD; international currencies are available on Enterprise plans only.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 05 — Free trials & free tier */}
            <article id="free-trials" className="scroll-mt-24">
              <SectionHead num="05" title="Free trials & free tier" />
              <Prose>
                <p>
                  We offer a 14-day free trial on the Growth tier without a credit card. At the end of the trial, your workspace converts to the Free tier unless you have selected a paid plan. The Free tier is permanent, rate-limited, and intended for individual evaluation and small teams; we may adjust Free tier limits with 30 days&rsquo; notice.
                </p>
                <p>
                  Free Clovion Report scans (the visibility scorecard available at /free-ai-visibility-score) do not require an account and are subject to fair-use rate limits per IP address and per domain. Free Reports are provided as-is.
                </p>
                <p>
                  Trial and Free tier accounts are excluded from the uptime SLA in section 10 and the Performance Guarantee in section 06.4.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 06 — Outcome-priced agent billing (signature section) */}
            <article id="agent-billing" className="scroll-mt-24">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink/70">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden />
                Material billing terms
              </div>
              <SectionHead num="06" title="Outcome-priced agent billing" />
              <Prose>
                <p>
                  Clovion Agents bill on outcomes, not on messages or seats. This section defines what we charge for, what we don&rsquo;t, and how we determine the boundary.
                </p>

                <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.12em] text-ink/60 mt-10 mb-4">06.1 — Unit price</h3>
                <p>
                  The default rate is <span className="font-semibold text-ink">$0.89 per Resolved Conversation</span>. Volume tiers are documented in your Order Form. There is no minimum monthly resolution commitment on self-serve plans; Enterprise Order Forms may include committed volume.
                </p>

                <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.12em] text-ink/60 mt-10 mb-4">06.2 — What &ldquo;Resolved&rdquo; means</h3>
                <p>
                  A <span className="font-semibold text-ink">Resolved Conversation</span> is a continuous exchange between an end user and Clovion Agents where (a) the agent provided one or more substantive responses, (b) the conversation ended without a handoff to a human, and (c) the conversation did not end with the agent stating it could not help. A conversation is the set of messages between the same end user and the same workspace within a 24-hour rolling window on the same subject thread.
                </p>
                <p>
                  We do not require the end user to confirm resolution. We do not bill twice for the same end user returning later about a different issue; we do not bill twice for follow-up messages on the same issue inside the same window.
                </p>

                <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.12em] text-ink/60 mt-10 mb-4">06.3 — Worked examples</h3>

                {/* Examples table */}
                <div className="my-7 overflow-hidden rounded-lg border border-ink/12 bg-white">
                  <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-ink/10 bg-subtle/60 px-5 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/60">
                    <div>Scenario</div>
                    <div className="text-right">Billed?</div>
                  </div>
                  <ul className="divide-y divide-ink/8">
                    {billingExamples.map((row, i) => (
                      <li key={i} className="grid grid-cols-[1fr_auto] items-start gap-4 px-5 py-4">
                        <div>
                          <p className="text-ink/85 leading-relaxed">{row.scenario}</p>
                          <p className="mt-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink/55">
                            {row.outcome}
                          </p>
                        </div>
                        <div className="pt-0.5">
                          {row.billed ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-white">
                              <Check className="text-current" /> Billed
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink/60">
                              Free
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.12em] text-ink/60 mt-10 mb-4">06.4 — Performance Guarantee</h3>
                <p>
                  If Clovion Agents do not exceed your pre-deployment resolution rate within 90 days of go-live on a Production deployment, we will refund 100% of agent fees paid during that period, provided you have (a) shared the baseline metric in writing before go-live, (b) given us at least 60 days under stable knowledge base configuration, and (c) maintained the recommended training cadence. The guarantee is per deployment and is the exclusive remedy for missed performance targets.
                </p>

                <h3 className="font-mono text-[0.78rem] uppercase tracking-[0.12em] text-ink/60 mt-10 mb-4">06.5 — Dispute window</h3>
                <p>
                  You have 30 days from receipt of an invoice to dispute resolution counts. Each billing record links to the underlying conversation transcript; disputes referencing specific conversations are resolved in your favor unless we present transcript evidence to the contrary within 10 business days.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 07 — Intellectual property */}
            <article id="intellectual-property" className="scroll-mt-24">
              <SectionHead num="07" title="Intellectual property" />
              <Prose>
                <p>
                  We retain all rights to the Service, the underlying models, prompts, retrieval methods, dashboards, and Documentation. You retain all rights to your Customer Data. Subject to these Terms and your payment, we grant you a non-exclusive, non-transferable, worldwide right to access and use the Service during your subscription term.
                </p>
                <p>
                  Aggregated and anonymized telemetry — such as resolution rates across all customers, model selection patterns, and platform-coverage statistics — may be used to improve the Service and may appear in industry reports. We do not include any Customer Data, brand identifiers, or anything that could reasonably be linked back to your workspace.
                </p>
                <p>
                  Feedback you provide is non-confidential. We may use it without restriction or compensation.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 08 — Customer data & ownership */}
            <article id="customer-data" className="scroll-mt-24">
              <SectionHead num="08" title="Customer data & ownership" />
              <Prose>
                <p>
                  Your data is yours. We do not train foundation models on your Customer Data. We do not sell or rent it. We process it only to deliver the Service, to provide support at your request, and to comply with law.
                </p>
                <p>
                  Our Data Processing Addendum (incorporated by reference for customers subject to GDPR, UK GDPR, or CCPA) governs the technical and organizational measures, sub-processor list, and incident notification procedures. The DPA is available at /legal/dpa and pre-signed; counter-signature is provided automatically on request from <Mail addr="privacy@clovion.ai" />.
                </p>
                <p>
                  Export is available at any time from your workspace settings in JSON, CSV, and Parquet formats. On termination, your data remains downloadable for 30 days, after which it is deleted from production systems within 60 days and from encrypted backups on standard retention rotation within 180 days.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 09 — Confidentiality */}
            <article id="confidentiality" className="scroll-mt-24">
              <SectionHead num="09" title="Confidentiality" />
              <Prose>
                <p>
                  Each party may disclose information marked confidential, or that a reasonable person would understand to be confidential. The receiving party will protect such information with at least the same degree of care it uses for its own information of similar kind, and not less than reasonable care, and will use it only to exercise rights and perform obligations under these Terms.
                </p>
                <p>
                  Confidentiality obligations survive termination for three years, except for trade secrets, which are protected as long as they remain trade secrets. Pricing on Order Forms is confidential. Standard exclusions apply for information that is public, independently developed, or rightfully received from a third party.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 10 — Warranties */}
            <article id="warranties" className="scroll-mt-24">
              <SectionHead num="10" title="Warranties & disclaimers" />
              <Prose>
                <p>
                  We warrant that the Service will perform materially in accordance with the Documentation and that we will not materially decrease the functionality during a paid term. We warrant 99.9% monthly uptime on paid plans, measured as published in our SLA. The SLA remedy — service credits against the next invoice — is your exclusive remedy for missed uptime.
                </p>
                <p>
                  AI outputs are probabilistic and not guaranteed to be accurate, complete, or fit for any particular purpose. You are responsible for reviewing outputs before relying on them in regulated, safety-critical, or high-stakes settings. Except for the express warranties in this section and the Performance Guarantee in section 06.4, the Service is provided &ldquo;as is&rdquo; and we disclaim all other warranties to the maximum extent permitted by law, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 11 — Limitation of liability */}
            <article id="liability" className="scroll-mt-24">
              <SectionHead num="11" title="Limitation of liability" />
              <Prose>
                <p>
                  Neither party will be liable for indirect, incidental, consequential, special, or punitive damages, or for lost profits, revenue, or data, even if advised of the possibility. Each party&rsquo;s total liability arising out of or related to these Terms will not exceed the amount paid or payable by you to us in the 12 months preceding the event giving rise to liability.
                </p>
                <p>
                  These limits do not apply to: (a) your payment obligations, (b) either party&rsquo;s indemnification obligations under section 12, (c) breach of confidentiality, or (d) gross negligence, willful misconduct, or fraud.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 12 — Indemnification */}
            <article id="indemnification" className="scroll-mt-24">
              <SectionHead num="12" title="Indemnification" />
              <Prose>
                <p>
                  We will defend you against third-party claims that the Service, as provided by us and used in accordance with these Terms, infringes a third party&rsquo;s intellectual property rights, and we will pay damages and costs finally awarded or agreed in settlement. If a claim is brought or reasonably anticipated, we may, at our option, (a) modify the Service to be non-infringing, (b) procure the right for you to continue using it, or (c) terminate the affected subscription and refund unused prepaid fees.
                </p>
                <p>
                  You will defend us against third-party claims arising from (a) your Customer Data, (b) your use of the Service in violation of these Terms or the Acceptable use policy, or (c) your products or services. Each party&rsquo;s indemnification obligations are subject to prompt notice, reasonable cooperation, and sole control of the defense by the indemnifying party.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 13 — Termination */}
            <article id="termination" className="scroll-mt-24">
              <SectionHead num="13" title="Termination" />
              <Prose>
                <p>
                  Self-serve subscriptions may be cancelled at any time from workspace settings; cancellation takes effect at the end of the current billing period. Enterprise subscriptions terminate at the end of the term stated in the Order Form. Either party may terminate for material breach with 30 days&rsquo; written notice and an opportunity to cure, or immediately on the other party&rsquo;s insolvency or assignment for the benefit of creditors.
                </p>
                <p>
                  On termination, your access ends, your data remains exportable for 30 days, and any usage already consumed remains owed. Sections that by their nature should survive will survive — including IP, confidentiality, liability, indemnification, and dispute resolution.
                </p>
              </Prose>
            </article>

            <HairlineDivider className="my-14" />

            {/* 14 — General */}
            <article id="general" className="scroll-mt-24">
              <SectionHead num="14" title="General provisions" />
              <Prose>
                <p>
                  These Terms are governed by the laws of the State of California, without regard to conflicts of law. Disputes will be resolved by binding arbitration in San Francisco under the JAMS Streamlined Rules, except that either party may seek injunctive relief in court for IP or confidentiality matters. The parties waive class-action rights.
                </p>
                <p>
                  These Terms, together with any Order Form, DPA, and the Acceptable use policy, form the entire agreement and supersede prior agreements on the subject. If any provision is held unenforceable, the remainder will remain in effect. Neither party may assign without the other&rsquo;s consent, except to a successor in interest by merger or sale of substantially all assets. Notices to Clovion AI must be sent to <Mail addr="legal@clovion.ai" /> with a courtesy copy to 580 California St., 12th Floor, San Francisco, CA 94104.
                </p>
                <p>
                  We may update these Terms by posting a new version with a revised effective date. For material changes, we will notify Owners at least 30 days before they take effect; continued use after the effective date constitutes acceptance.
                </p>
              </Prose>
            </article>

          </div>
        </Container>
      </section>

      {/* Section 5 — Performance Guarantee band */}
      <section className="bg-white border-y border-line">
        <Container>
          <div className="section-y grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 items-center">
            <div className="lg:col-span-5">
              <Eyebrow>Section 06.4 · Performance Guarantee</Eyebrow>
              <h2 className="display-md mt-4 text-balance">
                We bet our agent fees on your results.
              </h2>
              <p className="lead mt-5 max-w-[40ch]">
                A real commercial commitment, not a marketing line. Refunded against the invoice, no questions about intent.
              </p>
            </div>
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-ink/15 bg-bg p-8 md:p-10">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/55">
                  The clause, in full
                </p>
                <p className="mt-5 text-[1.125rem] leading-[1.65] text-ink/90">
                  &ldquo;If Clovion Agents do not beat your current resolution rate within 90 days of go-live, we refund 100% of agent fees paid in the period.&rdquo;
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a href="#agent-billing" className="inline-flex items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink hover:underline">
                    Read section 06 in full <ArrowRight />
                  </a>
                  <span className="h-3 w-px bg-ink/15" aria-hidden />
                  <Tag>Per deployment</Tag>
                  <Tag>90-day window</Tag>
                  <Tag>Exclusive remedy</Tag>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section 6 — Contact */}
      <Section tight bg="subtle">
        <Container>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Questions?</Eyebrow>
              <p className="mt-4 font-mono text-[0.85rem] uppercase tracking-[0.12em] text-ink/75">
                <span className="text-ink/55">Legal · </span>
                <a href="mailto:legal@clovion.ai" className="text-ink hover:underline">legal@clovion.ai</a>
                <span className="mx-3 text-ink/30">·</span>
                <span className="text-ink/55">Procurement · </span>
                <a href="mailto:procurement@clovion.ai" className="text-ink hover:underline">procurement@clovion.ai</a>
              </p>
              <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink/45">
                We reply to legal queue within two business days.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="/pricing" trackLocation="legal_terms" variant="primary" size="md">Start Free Trial</Button>
              <TalkToSalesButton location="legal_terms" variant="secondary" size="md">Talk to sales</TalkToSalesButton>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

/* — Local helpers — */

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <header className="mb-7 flex items-baseline gap-6 border-b border-ink/10 pb-5">
      <span className="font-mono text-[0.78rem] uppercase tracking-[0.16em] text-ink/45">
        {num}
      </span>
      <h2 className="text-[1.625rem] md:text-[1.875rem] font-display font-semibold tracking-[-0.02em] text-ink">
        {title}
      </h2>
    </header>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-5 text-[1.0625rem] leading-[1.75] text-ink/80 [&_p_strong]:text-ink [&_p_strong]:font-semibold">
      {children}
    </div>
  )
}

function Mail({ addr }: { addr: string }) {
  return (
    <a href={`mailto:${addr}`} className="font-mono text-[0.95em] text-ink hover:underline">
      {addr}
    </a>
  )
}

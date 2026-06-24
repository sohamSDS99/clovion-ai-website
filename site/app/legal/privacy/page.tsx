import Link from 'next/link'
import { Section, Container, HeroShade } from '@/components/ui'

export const metadata = {
  title: 'Privacy Policy | Clovion AI',
  description:
    'Clovion AI privacy policy. How we collect, use, store, and share data, your rights under GDPR and CCPA, our subprocessor list, and how to reach our DPO.'
}

const tableOfContents = [
  { id: 'summary', label: '01. Summary in plain English' },
  { id: 'collect', label: '02. Information we collect' },
  { id: 'use', label: '03. How we use information' },
  { id: 'sharing', label: '04. Data sharing' },
  { id: 'subprocessors-intro', label: '05. Subprocessors' },
  { id: 'transfers', label: '06. International data transfers' },
  { id: 'residency', label: '07. Data residency (US/EU/APAC)' },
  { id: 'security', label: '08. Security' },
  { id: 'rights', label: '09. Your rights (GDPR + CCPA)' },
  { id: 'cookies', label: '10. Cookies' },
  { id: 'children', label: '11. Children’s data' },
  { id: 'changes', label: '12. Changes to this policy' },
  { id: 'contact', label: '13. Contact us' },
  { id: 'subprocessor-list', label: '14. Subprocessor list (live)' }
]

const subprocessors = [
  {
    name: 'Amazon Web Services',
    purpose: 'Primary cloud hosting, compute, storage, networking',
    region: 'US-East / EU-West / AP-Southeast',
    url: 'https://aws.amazon.com/privacy/'
  },
  {
    name: 'Vercel',
    purpose: 'Edge delivery and marketing site hosting',
    region: 'Global edge',
    url: 'https://vercel.com/legal/privacy-policy'
  },
  {
    name: 'Anthropic',
    purpose: 'Model inference for visibility analysis and GEO suggestions',
    region: 'US',
    url: 'https://www.anthropic.com/legal/privacy'
  },
  {
    name: 'OpenAI',
    purpose: 'Model inference for prompt simulation and citation extraction',
    region: 'US',
    url: 'https://openai.com/policies/privacy-policy'
  },
  {
    name: 'Google Cloud (Gemini API)',
    purpose: 'Model inference for Gemini and AI Overviews tracking',
    region: 'US / EU',
    url: 'https://policies.google.com/privacy'
  },
  {
    name: 'Neon (Managed Postgres)',
    purpose: 'Primary application database and time-series storage',
    region: 'US-East / EU-Central',
    url: 'https://neon.tech/privacy-policy'
  },
  {
    name: 'Cloudflare',
    purpose: 'DNS, DDoS mitigation, WAF, object storage for crawler logs',
    region: 'Global edge',
    url: 'https://www.cloudflare.com/privacypolicy/'
  },
  {
    name: 'Stripe',
    purpose: 'Billing, invoicing, payment processing, tax remittance',
    region: 'US / EU / APAC',
    url: 'https://stripe.com/privacy'
  },
  {
    name: 'Postmark',
    purpose: 'Transactional email (reports, alerts, account notices)',
    region: 'US',
    url: 'https://postmarkapp.com/privacy-policy'
  },
  {
    name: 'Customer.io',
    purpose: 'Lifecycle and marketing email, customer communication',
    region: 'US',
    url: 'https://customer.io/legal/privacy/'
  },
  {
    name: 'Segment',
    purpose: 'First-party product analytics event routing',
    region: 'US',
    url: 'https://www.twilio.com/legal/privacy'
  },
  {
    name: 'Linear',
    purpose: 'Internal issue tracking for support escalations',
    region: 'US',
    url: 'https://linear.app/privacy'
  },
  {
    name: 'Zendesk',
    purpose: 'Support ticketing and knowledge base',
    region: 'US / EU',
    url: 'https://www.zendesk.com/company/privacy-and-data-protection/'
  }
]

const sections = [
  {
    id: 'collect',
    number: '02',
    title: 'Information we collect',
    body: [
      'We collect information you give us directly, information we collect automatically from your use of Clovion AI, and information we receive from third parties who help us deliver the service. This section describes each category.',
      'Account data. When you sign up, we collect your name, work email, company, role, password hash, and the domains you want to track. Where billing applies, we collect a billing contact and tax identifier through our payment processor.',
      'Workspace data. We store the prompts you configure, the competitor sets you track, the engines you select, the schedule you run them on, and the historical scores, citations, sentiment readings, and crawler logs we generate on your behalf. We also store invitations, role assignments, and audit log events for everyone in your workspace.',
      'Usage data. We log IP address, user agent, session events, feature usage, and timestamps so we can keep the product reliable and improve it over time. We do not buy or sell third-party tracking data, and we do not run advertising pixels inside the application.',
      'Support data. If you contact us, we keep a record of the conversation, the attachments you send, and any account details needed to resolve the issue.'
    ],
    bullets: [
      'Identifiers (name, email, company, role)',
      'Authentication artifacts (password hashes, session tokens, recovery codes)',
      'Workspace configuration (tracked domains, prompts, competitors, schedules)',
      'Generated outputs (scores, citations, sentiment, GEO suggestions, crawler logs)',
      'Billing and tax data (handled by Stripe; we receive only metadata)',
      'Technical and security logs (IP, user agent, request timestamps)'
    ]
  },
  {
    id: 'use',
    number: '03',
    title: 'How we use information',
    body: [
      'We use the information we collect to run Clovion AI for you, keep it secure, bill you accurately, and improve the product over time. We do not use customer data to train foundation models, and we do not pool one customer’s data into another customer’s reports.',
      'Specific uses. Deliver visibility scoring, citation tracking, and GEO suggestions on the domains and competitor sets you configure. Authenticate users and prevent abuse. Send transactional notices about scoring changes, billing events, and security alerts. Provide support and respond to requests. Measure aggregate, de-identified usage to understand which features are working.',
      'Lawful basis. For European customers, we process personal data on the basis of contract (to deliver the service you signed up for), legitimate interest (to keep the service safe and improve it), and consent (where you opt into marketing or product communications you can opt out of).',
      'This is placeholder copy pending counsel review; the production text will include lawful-basis language tailored to each processing activity.'
    ]
  },
  {
    id: 'sharing',
    number: '04',
    title: 'Data sharing',
    body: [
      'We share data with a small set of subprocessors who help us run the service. Section 14 lists every one of them, by name, with the purpose and region. We do not sell personal data, and we do not share it with advertisers.',
      'We may disclose data when we are legally required to (subpoenas, court orders, lawful government requests). When that happens, we narrow the scope, push back where appropriate, and notify the affected customer unless the law forbids it.',
      'If Clovion AI is involved in a merger, acquisition, or asset sale, we will give customers notice before personal data becomes subject to a different privacy policy, and we will honor opt-out rights.',
      'This is placeholder copy pending counsel review.'
    ]
  },
  {
    id: 'subprocessors-intro',
    number: '05',
    title: 'Subprocessors',
    body: [
      'A subprocessor is a third party we engage to process personal data on our behalf as part of delivering Clovion AI. We require every subprocessor to meet a baseline that includes a signed Data Processing Agreement, equivalent Standard Contractual Clauses where applicable, encryption in transit and at rest, an annual security review, and incident notification within 24 hours.',
      'We maintain the live list in section 14 below. We also publish updates and material changes 30 days in advance for enterprise customers who subscribe to the subprocessor notification list. To subscribe, email dpo@clovion.ai.',
      'This is placeholder copy pending counsel review.'
    ]
  },
  {
    id: 'transfers',
    number: '06',
    title: 'International data transfers',
    body: [
      'Clovion AI is operated from the United States, with infrastructure available in the European Union and Asia Pacific. When personal data moves across borders, we use Standard Contractual Clauses approved by the European Commission, the UK Addendum where the UK is involved, and equivalent safeguards for transfers governed by other regimes.',
      'For customers who require data residency, see section 7. The default is US-East unless your contract specifies otherwise.',
      'This is placeholder copy pending counsel review.'
    ]
  },
  {
    id: 'residency',
    number: '07',
    title: 'Data residency (US/EU/APAC)',
    body: [
      'Enterprise customers can pin their workspace to one of three residency regions. Once a residency choice is made, primary storage, backups, and most processing stay in that region. A small set of operational data (for example, billing records and audit metadata) may still be processed in the United States to support shared business functions.',
      'Available regions. United States (US-East-1, Virginia). European Union (EU-Central-1, Frankfurt). Asia Pacific (AP-Southeast-2, Sydney). Additional regions on request for qualifying enterprise contracts.',
      'This is placeholder copy pending counsel review.'
    ],
    bullets: [
      'United States — US-East (Virginia)',
      'European Union — EU-Central (Frankfurt)',
      'Asia Pacific — AP-Southeast (Sydney)'
    ]
  },
  {
    id: 'security',
    number: '08',
    title: 'Security',
    body: [
      'We hold SOC 2 Type II and ISO 27001 certifications, audited annually by an independent third party. The full reports are available under NDA from security@clovion.ai. We also publish a security overview at /security with the practical controls and the latest pen test summary.',
      'Encryption. Data is encrypted in transit using TLS 1.3 and at rest using AES-256. Production secrets live in a hardware-backed key management service and are rotated on a fixed schedule.',
      'Access. Production access requires SSO, hardware-key MFA, and a documented business reason. Every access event is logged, reviewed monthly, and tied to an on-call ticket.',
      'Resilience. Backups run every six hours with cross-region replication. Disaster recovery is tested twice a year against a four-hour RTO and a one-hour RPO.',
      'Incident response. We notify affected customers within 24 hours of confirming a security incident that involves their data, with material updates every 24 hours until closure.',
      'This is placeholder copy pending counsel review.'
    ]
  },
  {
    id: 'rights',
    number: '09',
    title: 'Your rights (GDPR + CCPA)',
    body: [
      'You have rights over your personal data. The specific rights depend on where you live, but the core set is the same wherever you are in the world. You can ask us to do any of the following, and we will respond within the timelines the applicable law requires.',
      'Right to access. Get a copy of the personal data we hold about you. Right to correction. Fix data that is wrong. Right to deletion. Ask us to delete your personal data, subject to legal retention requirements. Right to portability. Get your data in a machine-readable format. Right to object. Tell us to stop processing for specific purposes. Right to restrict. Pause processing while a dispute is resolved.',
      'For California residents under the CCPA and CPRA, you also have the right to know what categories of personal information we collect, the right to opt out of any sale or share (we do not sell, and we do not share for cross-context behavioral advertising), and the right to non-discrimination if you exercise any of these rights.',
      'To exercise a right, email dpo@clovion.ai from the address associated with your account. We respond within 30 days, with the option to extend by 60 days when a request is complex. There is no charge for the first request in a 12-month window.',
      'This is placeholder copy pending counsel review.'
    ]
  },
  {
    id: 'cookies',
    number: '10',
    title: 'Cookies',
    body: [
      'Clovion AI uses a small number of first-party cookies that are strictly necessary to keep you signed in, balance load across our servers, and remember your workspace selection. We do not run third-party tracking cookies, advertising pixels, or session-replay tools inside the application.',
      'Our marketing site (clovion.ai) uses a single first-party analytics cookie for aggregate, de-identified traffic measurement. You can decline it from the banner on first visit, and your choice is respected across the marketing site.',
      'This is placeholder copy pending counsel review.'
    ]
  },
  {
    id: 'children',
    number: '11',
    title: 'Children’s data',
    body: [
      'Clovion AI is a business product. It is not directed at children under 16, and we do not knowingly collect personal data from anyone under 16. If you believe a child has provided personal data to us, email dpo@clovion.ai and we will delete it.',
      'This is placeholder copy pending counsel review.'
    ]
  },
  {
    id: 'changes',
    number: '12',
    title: 'Changes to this policy',
    body: [
      'We update this policy when our practices change. Material changes are announced 30 days before they take effect via the in-product notification center, the security@clovion.ai mailing list, and a banner at the top of this page.',
      'Every version of this policy is archived. The current version, effective date, and a link to the prior version are listed at the top of the page. To see the full history, email dpo@clovion.ai.',
      'This is placeholder copy pending counsel review.'
    ]
  },
  {
    id: 'contact',
    number: '13',
    title: 'Contact us',
    body: [
      'For privacy or security questions, contact security@clovion.ai. For data subject requests and DPA questions, contact our Data Protection Officer at dpo@clovion.ai.',
      'Mailing address. Clovion AI, Inc. 169 Madison Avenue, Suite 11731, New York, NY 10016, United States.',
      'EU representative. Designated under Article 27 of the GDPR; full name and address available on request from dpo@clovion.ai.'
    ]
  }
]

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero strip */}
      <Section tight className="relative overflow-hidden">
        <HeroShade />
        <Container>
          <div className="max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.14em] text-[rgb(var(--ink-rgb)/50%)]">
              <Link href="/legal" className="hover:text-[var(--ink)] transition-colors">
                Legal
              </Link>
              <span className="mx-2 text-[rgb(var(--ink-rgb)/30%)]">/</span>
              <span className="text-[rgb(var(--ink-rgb)/70%)]">Privacy Policy</span>
            </div>
            <h1 className="display-md mt-6 text-[var(--ink)]">Privacy policy.</h1>
            <p className="mt-5 font-mono text-[13px] leading-relaxed text-[rgb(var(--ink-rgb)/60%)]">
              Effective November 1, 2026
              <span className="mx-2 text-[rgb(var(--ink-rgb)/30%)]">·</span>
              Version 4.2
              <span className="mx-2 text-[rgb(var(--ink-rgb)/30%)]">·</span>
              Last reviewed by legal counsel
              <span className="mx-2 text-[rgb(var(--ink-rgb)/30%)]">·</span>
              <a href="#" className="text-[var(--ink)] underline-offset-4 hover:underline">
                Print PDF →
              </a>
            </p>
          </div>
        </Container>
      </Section>

      {/* Table of contents */}
      <div className="border-t border-[var(--line)] bg-[var(--white)]">
        <Section tight>
          <Container>
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/50%)]">
                  Contents
                </div>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-[rgb(var(--ink-rgb)/60%)]">
                  Fourteen sections. Read the plain-English summary first if you only have a minute.
                </p>
              </div>
              <nav className="md:col-span-8">
                <ol className="divide-y divide-[var(--line)] font-mono text-[13px]">
                  {tableOfContents.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="flex items-center justify-between py-3 text-[rgb(var(--ink-rgb)/70%)] transition-colors hover:text-[var(--ink)]"
                      >
                        <span>{item.label}</span>
                        <span className="text-[rgb(var(--ink-rgb)/30%)] group-hover:text-[var(--ink)]">→</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </Container>
        </Section>
      </div>

      {/* Plain-English summary */}
      <Section bg="subtle" id="summary">
        <Container>
          <div className="mx-auto max-w-[720px]">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/50%)]">
              01 — Summary
            </div>
            <h2 className="display-sm mt-4 text-[var(--ink)]">In short.</h2>
            <div className="mt-8 space-y-5 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/80%)]">
              <p>
                Clovion AI runs visibility tracking against the AI engines your buyers use. To do that, we collect the
                domains you want monitored, the prompts you care about, the competitors you track, and the account data
                we need to bill and support you. We log what the AI engines say about you, score it, and hand you the
                fixes that move the needle.
              </p>
              <p>
                We share data only with a small list of vetted subprocessors (section 14). We do not sell personal data,
                we do not train foundation models on customer data, and we do not run advertising pixels inside the
                product. Our team accesses production data only with a documented reason, on hardware-backed MFA, and
                every access event is logged.
              </p>
              <p>
                You have full rights over your data. Ask us for a copy, ask us to fix it, ask us to delete it, ask us to
                stop processing it. We respond within 30 days. If you are in California, the EU, or the UK, you have
                additional named rights under CCPA, GDPR, and UK GDPR. Reach our DPO at dpo@clovion.ai. The full legal
                text follows.
              </p>
            </div>
            <ul className="mt-10 grid gap-3 border-t border-[var(--line)] pt-8 font-mono text-[12.5px] text-[rgb(var(--ink-rgb)/70%)] sm:grid-cols-2">
              <li>
                <span className="block text-[rgb(var(--ink-rgb)/40%)]">From whom</span>
                <span className="mt-1 block text-[var(--ink)]">Business customers and their teammates</span>
              </li>
              <li>
                <span className="block text-[rgb(var(--ink-rgb)/40%)]">What we do with it</span>
                <span className="mt-1 block text-[var(--ink)]">Run visibility scoring, deliver fixes, bill, support</span>
              </li>
              <li>
                <span className="block text-[rgb(var(--ink-rgb)/40%)]">Who we share with</span>
                <span className="mt-1 block text-[var(--ink)]">13 named subprocessors. No advertisers. No data brokers.</span>
              </li>
              <li>
                <span className="block text-[rgb(var(--ink-rgb)/40%)]">Your rights</span>
                <span className="mt-1 block text-[var(--ink)]">Access, correct, delete, port, object, restrict.</span>
              </li>
            </ul>
          </div>
        </Container>
      </Section>

      {/* Full policy */}
      <Section>
        <Container>
          <div className="mx-auto max-w-[720px]">
            {sections.map((section, idx) => (
              <article
                key={section.id}
                id={section.id}
                className={
                  idx === 0
                    ? 'scroll-mt-24'
                    : 'scroll-mt-24 border-t border-[var(--line)] pt-14 mt-14'
                }
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/40%)]">
                    § {section.number}
                  </span>
                  <h3 className="font-mono text-[15px] uppercase tracking-[0.14em] text-[var(--ink)]">
                    {section.title}
                  </h3>
                </div>
                <div className="mt-6 space-y-5 text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/80%)]">
                  {section.body.map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  {section.bullets && (
                    <ul className="mt-2 space-y-2.5 border-l border-[var(--line)] pl-5">
                      {section.bullets.map((b, i) => (
                        <li key={i} className="text-[15px] text-[rgb(var(--ink-rgb)/80%)]">
                          <span className="mr-3 font-mono text-[11px] text-[rgb(var(--ink-rgb)/40%)]">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      {/* Subprocessor list */}
      <div className="border-t border-[var(--line)] bg-[var(--white)]" id="subprocessor-list">
        <Section>
          <Container>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[rgb(var(--ink-rgb)/40%)]">
                § 14
              </span>
              <h3 className="font-mono text-[15px] uppercase tracking-[0.14em] text-[var(--ink)]">
                Subprocessor list — live
              </h3>
            </div>
            <p className="mt-5 max-w-[720px] text-[15.5px] leading-[1.7] text-[rgb(var(--ink-rgb)/70%)]">
              The thirteen subprocessors we engage to operate Clovion AI. Updated whenever we add, remove, or change a
              vendor. Enterprise customers can subscribe to a 30-day advance notification list by emailing
              <span className="whitespace-nowrap"> dpo@clovion.ai</span>.
            </p>

            <div className="mt-10 -mx-4 overflow-x-auto md:mx-0">
              <table className="w-full min-w-[800px] border-collapse px-4 md:px-0">
                <thead>
                  <tr className="border-y border-[var(--line)] font-mono text-[11px] uppercase tracking-[0.16em] text-[rgb(var(--ink-rgb)/50%)]">
                    <th className="py-3 pr-6 text-left font-semibold w-[28%]">Subprocessor</th>
                    <th className="py-3 pr-6 text-left font-semibold w-[42%]">Purpose</th>
                    <th className="py-3 pr-6 text-left font-semibold w-[18%]">Region</th>
                    <th className="py-3 text-left font-semibold w-[12%]">Policy</th>
                  </tr>
                </thead>
                <tbody>
                  {subprocessors.map((sp) => (
                    <tr key={sp.name} className="border-b border-[var(--line)]">
                      <td className="py-4 pr-6 align-top text-[14px] font-semibold text-[var(--ink)]">
                        {sp.name}
                      </td>
                      <td className="py-4 pr-6 align-top text-[14px] leading-[1.55] text-[rgb(var(--ink-rgb)/75%)]">
                        {sp.purpose}
                      </td>
                      <td className="py-4 pr-6 align-top font-mono text-[12.5px] text-[rgb(var(--ink-rgb)/65%)]">
                        {sp.region}
                      </td>
                      <td className="py-4 align-top font-mono text-[12.5px]">
                        <a
                          href={sp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--ink)] underline-offset-4 hover:underline"
                        >
                          View ↗
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-8 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[rgb(var(--ink-rgb)/45%)]">
              Last revised — October 14, 2026
            </p>
          </Container>
        </Section>
      </div>

      {/* Contact strip */}
      <Section bg="subtle" tight>
        <Container>
          <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] pt-10 md:flex-row md:items-center">
            <p className="font-mono text-[13px] text-[rgb(var(--ink-rgb)/75%)]">
              Questions?{' '}
              <a href="mailto:security@clovion.ai" className="text-[var(--ink)] underline-offset-4 hover:underline">
                security@clovion.ai
              </a>
              <span className="mx-2 text-[rgb(var(--ink-rgb)/30%)]">·</span>
              DPO:{' '}
              <a href="mailto:dpo@clovion.ai" className="text-[var(--ink)] underline-offset-4 hover:underline">
                dpo@clovion.ai
              </a>
            </p>
            <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[rgb(var(--ink-rgb)/45%)]">
              Effective 2026-11-01 • v4.2
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}

import Link from 'next/link'
import { Container, HaloMark } from './ui'
import { AskAiSummary } from './AskAiSummary'
import { SocialLinks } from './SocialLinks'
import { brand } from '@/lib/content'

const groups = [
  {
    title: 'Product',
    links: [
      { label: 'AI Visibility Tracking', href: '/features/ai-visibility-tracking' },
      { label: 'GEO Suggestions', href: '/features/geo-improvement-suggestions' },
      { label: 'Recommendation Engine', href: '/features/recommendation-engine' },
      { label: 'Sentiment Analysis', href: '/features/sentiment-analysis' },
      { label: 'Brand Perception', href: '/features/brand-perception' },
      { label: 'Brand Audit', href: '/features/brand-audit' }
    ]
  },
  {
    title: 'Resources',
    // Mirrors the header "Resources" dropdown (see lib/content.ts) — keep these
    // two in sync: the footer column shows exactly the dropdown's pages.
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Guides & Downloads', href: '/resources' },
      { label: 'FAQ', href: '/faq' }
    ]
  },
  {
    title: 'Free Tools',
    links: [
      { label: 'Get Free Score', href: '/free-ai-visibility-score' },
      { label: 'llms.txt Generator', href: '/tools/llms-txt-generator' },
      { label: 'AI Crawlability Checker', href: '/tools/ai-crawlability-checker' },
      { label: 'Robots.txt AI Bot Checker', href: '/tools/robots-checker' },
      { label: 'Query Fan-Out Generator', href: '/tools/fanout' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      // { label: 'Customers', href: '/customers' }, // temporarily hidden
      { label: 'Affiliate Program', href: '/affiliate' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' }
    ]
  },
  {
    title: 'Comparisons',
    links: [
      { label: 'vs Peec AI', href: '/compare/clovion-vs-peec-ai' },
      { label: 'vs Otterly', href: '/compare/clovion-vs-otterly' },
      { label: 'vs Searchable', href: '/compare/clovion-vs-searchable' },
      { label: 'vs Profound', href: '/compare/clovion-vs-profound' }
    ]
  }
]

/**
 * Dark variant of the marketing Footer, used on the homepage redesign.
 * Renders directly on the dark page (no separate bg surface) and uses
 * hardcoded white-on-dark colors so it paints correctly even if the
 * .clv-dark scope hasn't been applied to <html> yet.
 */
export function HomeFooter() {
  return (
    <footer style={{ background: '#101013', borderTop: '1px solid rgba(255,255,255,0.10)' }}>
      <Container className="py-20">
        <div className="grid lg:grid-cols-12 gap-x-10 gap-y-12">
          <div className="lg:col-span-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-display font-semibold text-lg tracking-[-0.02em] text-white"
            >
              <HaloMark size={24} />
              <span>Clovion AI</span>
            </Link>
            <p className="mt-5 text-[0.95rem] leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
              {brand.tagline}
            </p>
            <div className="mt-8">
              <AskAiSummary variant="dark" />
            </div>
            <div className="mt-8">
              <div className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] mb-4" style={{ color: 'rgba(255,255,255,0.50)' }}>
                Follow Us On
              </div>
              <SocialLinks variant="dark" />
            </div>
          </div>

          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10 lg:flex lg:justify-between lg:gap-x-6">
            {groups.map((g) => (
              <div key={g.title}>
                <div
                  className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] mb-5"
                  style={{ color: 'rgba(255,255,255,0.50)' }}
                >
                  {g.title}
                </div>
                <ul className="space-y-3.5">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-[0.92rem] transition-colors hover:text-white"
                        style={{ color: 'rgba(255,255,255,0.70)' }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-16 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.10)' }}
        >
          <p className="text-[0.84rem]" style={{ color: 'rgba(255,255,255,0.50)' }}>
            © {new Date().getFullYear()} Clovion AI, Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            <Link href="/legal/privacy" className="text-[0.8rem] hover:text-white" style={{ color: 'rgba(255,255,255,0.60)' }}>Privacy</Link>
            <span aria-hidden className="h-3 w-px" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <Link href="/legal/terms" className="text-[0.8rem] hover:text-white" style={{ color: 'rgba(255,255,255,0.60)' }}>Terms</Link>
            <span aria-hidden className="h-3 w-px" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <Link href="/docs" className="text-[0.8rem] hover:text-white" style={{ color: 'rgba(255,255,255,0.60)' }}>Security</Link>
            <span aria-hidden className="h-3 w-px" style={{ background: 'rgba(255,255,255,0.10)' }} />
            <Link href="/docs" className="text-[0.8rem] hover:text-white" style={{ color: 'rgba(255,255,255,0.60)' }}>DPA</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}

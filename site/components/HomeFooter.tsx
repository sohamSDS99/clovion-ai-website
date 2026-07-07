import Link from 'next/link'
import { Container, HaloMark } from './ui'
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
      { label: 'News', href: '/news' },
      { label: 'Webinars', href: '/webinars' },
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
      { label: 'Customers', href: '/customers' },
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
      { label: 'Clovion vs Peec AI', href: '/compare/clovion-vs-peec-ai' },
      { label: 'Clovion vs Otterly', href: '/compare/clovion-vs-otterly' }
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
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
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
            <div className="mt-6 flex items-center gap-3">
              <SocialLink href="https://twitter.com" label="X / Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialLink>
              <SocialLink href="https://linkedin.com" label="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 17v-7H6v7zm-1-8.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2zM18 17v-3.7c0-1.9-1-2.8-2.4-2.8-1.1 0-1.7.6-2 1V10h-2v7h2v-3.6c0-.9.6-1.5 1.4-1.5s1 .5 1 1.5V17z"/></svg>
              </SocialLink>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {groups.map((g) => (
              <div key={g.title}>
                <div
                  className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] mb-4"
                  style={{ color: 'rgba(255,255,255,0.50)' }}
                >
                  {g.title}
                </div>
                <ul className="space-y-3">
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

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center justify-center h-9 w-9 rounded-full transition-colors hover:text-white"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        color: 'rgba(255,255,255,0.70)'
      }}
    >
      {children}
    </a>
  )
}

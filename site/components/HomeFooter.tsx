import Link from 'next/link'
import { Container, HaloMark } from './ui'
import { brand } from '@/lib/content'

const groups = [
  {
    title: 'Product',
    links: [
      { label: 'AI Visibility Tracking', href: '/features/ai-visibility-tracking' },
      { label: 'GEO Suggestions', href: '/features/geo-improvement-suggestions' },
      { label: 'Fanout Query', href: '/features/fanout-query' },
      { label: 'AI Crawlability', href: '/features/ai-crawlability' },
      { label: 'Platform Coverage', href: '/features/platform-coverage' },
      { label: 'Sentiment Analysis', href: '/features/sentiment-analysis' },
      { label: 'Brand Perception', href: '/features/brand-perception' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Free AI Visibility Score', href: '/free-ai-visibility-score' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'GEO', href: '/blog/category/geo' },
      { label: 'AI Search', href: '/blog/category/ai-search' },
      { label: 'SEO', href: '/blog/category/seo' },
      { label: 'Docs', href: '/docs' },
      { label: 'Getting Started', href: '/docs/getting-started' },
      { label: 'Changelog', href: '/changelog' }
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
              <SocialLink href="https://github.com" label="GitHub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/></svg>
              </SocialLink>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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

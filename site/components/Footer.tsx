import Link from 'next/link'
import { Container, HaloMark } from './ui'
import { brand } from '@/lib/content'

const groups = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/features' },
      { label: 'AI Visibility Tracking', href: '/features/ai-visibility-tracking' },
      { label: 'GEO Suggestions', href: '/features/geo-improvement-suggestions' },
      { label: 'Platform Coverage', href: '/features/platform-coverage' },
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
      { label: 'Compare', href: '/compare' },
      { label: 'vs Profound', href: '/compare/clovion-vs-profound' },
      { label: 'Profound alternatives', href: '/alternatives/profound' }
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

export function Footer() {
  return (
    <footer className="bg-subtle border-t border-line">
      <Container className="py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2 font-display font-semibold text-lg tracking-[-0.02em] text-ink">
              <HaloMark size={24} />
              <span>Clovion AI</span>
            </Link>
            <p className="mt-5 text-[0.95rem] text-ink-60 leading-relaxed max-w-xs">
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

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {groups.map((g) => (
              <div key={g.title}>
                <div className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-ink-50 mb-4">{g.title}</div>
                <ul className="space-y-3">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-[0.92rem] text-ink-70 hover:text-ink hover:underline underline-offset-4 decoration-ink/30 transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-line flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-[0.84rem] text-ink-50">
            © {new Date().getFullYear()} Clovion AI, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/legal/privacy" className="text-[0.8rem] text-ink-60 hover:text-ink hover:underline underline-offset-4 decoration-ink/30">Privacy</Link>
            <span aria-hidden className="h-3 w-px bg-ink/10" />
            <Link href="/legal/terms" className="text-[0.8rem] text-ink-60 hover:text-ink hover:underline underline-offset-4 decoration-ink/30">Terms</Link>
            <span aria-hidden className="h-3 w-px bg-ink/10" />
            <Link href="/docs" className="text-[0.8rem] text-ink-60 hover:text-ink hover:underline underline-offset-4 decoration-ink/30">Security</Link>
            <span aria-hidden className="h-3 w-px bg-ink/10" />
            <Link href="/docs" className="text-[0.8rem] text-ink-60 hover:text-ink hover:underline underline-offset-4 decoration-ink/30">DPA</Link>
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
      className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-white border border-line text-ink-70 hover:border-ink/30 hover:text-ink transition-colors"
    >
      {children}
    </a>
  )
}

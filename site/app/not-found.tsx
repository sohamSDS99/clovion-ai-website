import Link from 'next/link'
import { Section, Container, Button, Eyebrow, HeroShade } from '@/components/ui'

const LINKS = [
  { label: 'Pricing', href: '/pricing' },
  { label: 'Customers', href: '/customers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Free AI Visibility Score', href: '/free-ai-visibility-score' }
]

export default function NotFound() {
  return (
    <Section className="relative overflow-hidden">
      <HeroShade />
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>404</Eyebrow>
          <h1 className="display-lg mt-5">This page moved on.</h1>
          <p className="lead mt-6 text-ink/70">
            The page you were after isn&apos;t here anymore. It may have been removed or renamed. Here are a few good places to pick things back up.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button href="/" variant="primary" size="lg">Back to home</Button>
            <Button href="/free-ai-visibility-score" variant="secondary" size="lg">Get Free Score</Button>
          </div>
          <nav className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="text-ink-60 hover:text-ink hover:underline underline-offset-4 decoration-ink/30">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </Section>
  )
}

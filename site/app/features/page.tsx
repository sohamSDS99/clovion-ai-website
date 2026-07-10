import type { Metadata } from 'next'
import Link from 'next/link'
import { Section, Container, Eyebrow, ArrowRight } from '@/components/ui'
import { CTABanner } from '@/components/sections'
import { PillarStepper } from '@/components/home/PillarStepper'

export const metadata: Metadata = {
  title: 'Features — See what AI says about your brand | Clovion AI',
  description:
    'Track AI visibility, understand brand perception, benchmark competitors, and get prioritized recommendations to get recommended more often across AI engines.'
}

const FEATURES = [
  {
    name: 'AI Visibility Tracking',
    body: 'Understand where, when, and how often AI recommends your brand across prompts, topics, engines, and audiences.',
    href: '/features/ai-visibility-tracking'
  },
  {
    name: 'Brand Perception',
    body: 'Understand how AI perceives your brand across audiences, industries, and use cases — and uncover the drivers shaping that perception.',
    href: '/features/brand-perception'
  },
  {
    name: 'Competitive Positioning',
    body: 'Benchmark against competitors and see where they outperform you across topics, prompts, and AI engines.',
    href: '/features/ai-visibility-tracking'
  },
  {
    name: 'AEO/GEO Recommendations',
    body: 'Get prioritized recommendations to improve your visibility and increase how often AI recommends your brand.',
    href: '/features/geo-improvement-suggestions'
  }
]

export default function FeaturesPage() {
  return (
    <div className="clv-home" style={{ background: '#FAF9F7' }}>
      <PillarStepper />

      <Section>
        <Container>
          <div className="max-w-2xl">
            <Eyebrow>FEATURES</Eyebrow>
            <h2 className="display-sm mt-4">Explore each feature.</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
            {FEATURES.map((f) => (
              <Link
                key={f.name}
                href={f.href}
                className="card group flex flex-col justify-between gap-6 p-7 transition hover:border-ink/20"
              >
                <div>
                  <h3 className="text-xl font-semibold text-ink">{f.name}</h3>
                  <p className="mt-3 text-ink/70">{f.body}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                  Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CTABanner
        heading="See what AI says about your brand."
        body="Start tracking your AI visibility today, or run a free score first."
        primary="Start Free Trial"
        primaryHref="https://app.clovion.ai/signup"
        secondary="Get Free Score"
        secondaryHref="/free-ai-visibility-score"
      />
    </div>
  )
}

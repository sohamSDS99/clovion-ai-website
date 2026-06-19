import type { Metadata } from 'next'
import { HomeHero } from '@/components/home/HomeHero'
import { PillarStepper } from '@/components/home/PillarStepper'
import { ChatDemo } from '@/components/home/ChatDemo'
import { MetricsStrip } from '@/components/home/MetricsStrip'
import { LogoMarquee } from '@/components/home/LogoMarquee'
import { Testimonials } from '@/components/home/Testimonials'
import { Loop } from '@/components/home/Loop'
import { HomeCTA } from '@/components/home/HomeCTA'

export const metadata: Metadata = {
  title: 'AI Visibility & GEO Platform | Clovion AI',
  description:
    'See how ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews describe your brand. Clovion tracks visibility daily, benchmarks against competitors, and ships the GEO fixes that move citation share.'
}

export default function HomePage() {
  // The .clv-dark wrapper class scopes the dark design-system tokens to
  // this page. The layout-level inline bootstrap script also applies the
  // class to <html> on initial load so the body bg paints black from the
  // first frame (see app/layout.tsx).
  return (
    <div className="clv-dark" style={{ background: 'var(--bg)', color: 'var(--ink)' }}>
      <HomeHero />
      <PillarStepper />
      <ChatDemo />
      <MetricsStrip />
      <LogoMarquee />
      <Testimonials />
      <Loop />
      <HomeCTA />
    </div>
  )
}

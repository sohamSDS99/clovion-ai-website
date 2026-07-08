import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { HomeHero } from '@/components/home/HomeHero'
import { PillarStepper } from '@/components/home/PillarStepper'
import { ClovAgent } from '@/components/home/ClovAgent'
import { MeasureExperiment } from '@/components/home/MeasureExperiment'
import { LogoMarquee } from '@/components/home/LogoMarquee'
// Testimonials temporarily hidden on the homepage — kept for easy restore.
// import { Testimonials } from '@/components/home/Testimonials'
import { AgentsAtWork } from '@/components/home/AgentsAtWork'
import { HomeFAQ } from '@/components/home/HomeFAQ'
import { HOME_FAQS } from '@/components/home/homeFaqs'
import { HomeCTA } from '@/components/home/HomeCTA'
import { NewsletterPopup } from '@/components/home/NewsletterPopup'

export const metadata: Metadata = {
  title: 'AI Visibility & GEO Platform | Clovion AI',
  description:
    'See how ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews describe your brand. Clovion tracks visibility daily, benchmarks against competitors, and ships the GEO fixes that move citation share.'
}

// Render the homepage dynamically (no long-lived full-route cache). A prior
// deploy left the static "/" entry poisoned with the RSC/flight payload
// (served as text/x-component with s-maxage=31536000), which survived rebuilds
// and revalidatePath. force-dynamic content-negotiates per request — HTML for
// document loads, flight only for genuine RSC requests — so the bare "/" URL
// can never get stuck serving the flight payload again.
export const dynamic = 'force-dynamic'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Clovion',
  alternateName: 'Clovion AI',
  url: 'https://www.clovion.ai',
  logo: 'https://www.clovion.ai/icon.svg',
  description:
    'AI search visibility platform tracking brand citations across 10 AI engines including ChatGPT, Claude, Perplexity, and Gemini.',
  sameAs: [
    'https://www.linkedin.com/company/clovion',
    'https://twitter.com/clovionai',
    'https://www.g2.com/products/clovion'
  ]
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Clovion',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://www.clovion.ai',
  description:
    "Track and improve your brand's visibility across 10 AI search engines. Get a free AI visibility score in 60 seconds.",
  offers: { '@type': 'Offer', price: '79', priceCurrency: 'USD' }
}

const homeFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: HOME_FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
}

export default function HomePage() {
  // The homepage ships LIGHT: a warm off-white (#FAF9F7) background with dark
  // ink text. It is intentionally NOT wrapped in .clv-dark (unlike the rest of
  // the marketing site) and the layout bootstrap/ThemeShell/Chrome no longer
  // flag `/` as a dark route. `--bg` is scoped to #FAF9F7 here so every
  // section's seam-blending gradient (which fades to var(--bg)) resolves to
  // the page tone. Loop and HomeCTA (both --ink-surface bands) sit as dark
  // CTA sections on the light page, per the light brand book. ClovAgent is the
  // section-scoped orange "Clov AI Agent" feature block (replaced ChatDemo).
  return (
    <div
      className="clv-home"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqJsonLd) }} />
      <HomeHero />
      <PillarStepper />
      <ClovAgent />
      <MeasureExperiment />
      <LogoMarquee />
      {/* Testimonials temporarily hidden — restore by uncommenting this and the import above. */}
      {/* <Testimonials /> */}
      <AgentsAtWork />
      <HomeCTA />
      <HomeFAQ />
      <NewsletterPopup />
    </div>
  )
}

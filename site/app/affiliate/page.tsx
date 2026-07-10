import type { Metadata } from 'next'
import { OG_IMAGES } from '@/lib/og'
import FeatureContent from '@/components/affiliate/FeatureContent'

export const metadata: Metadata = {
  title: 'Affiliate Program | Earn Recurring Commission',
  description: 'Join the Clovion AI affiliate program. Refer brands, marketers, SEO teams, agencies, and founders to the AI visibility platform — and earn recurring commission for every successful signup.',
  alternates: { canonical: 'https://www.clovion.ai/affiliate' },
  openGraph: {
    title: 'Become a Clovion AI Affiliate — Earn for every brand you help get found in AI search.',
    description: 'Promote a fast-growing AI visibility platform across ChatGPT, Claude, Gemini, Perplexity, Grok, and AI Overviews. Share your link, earn recurring commission on every signup.',
    url: 'https://www.clovion.ai/affiliate',
    type: 'website',
    images: OG_IMAGES,
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is the Clovion AI affiliate program?', acceptedAnswer: { '@type': 'Answer', text: 'The Clovion AI affiliate program lets you earn recurring commission for referring brands, marketers, SEO teams, agencies, and founders to the Clovion AI visibility platform. You share a unique referral link and earn when a referral becomes a paying customer.' } },
    { '@type': 'Question', name: 'How do I earn commission as a Clovion affiliate?', acceptedAnswer: { '@type': 'Answer', text: 'Join the referral program, share your unique referral link, and earn commission every time a referral signs up and becomes a Clovion customer.' } },
    { '@type': 'Question', name: 'Who should join the Clovion affiliate program?', acceptedAnswer: { '@type': 'Answer', text: 'The program is well suited to marketers, agencies, creators, SEO consultants, founders, and SaaS communities who want to help brands improve their AI search visibility.' } },
  ],
}

export default function AffiliatePage() {
  return (
    <div className="clv-ai-vis-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FeatureContent />
    </div>
  )
}

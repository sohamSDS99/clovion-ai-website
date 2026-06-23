import type { Metadata } from 'next'
import FeatureContent from '@/components/customers/FeatureContent'

export const metadata: Metadata = {
  title: 'Customers | Clovion AI',
  description:
    'Two hundred brands run Clovion in production. See how Linear, Vercel, Ramp, Notion, and Webflow lifted AI visibility across ChatGPT, Claude, Gemini, and Perplexity.',
  alternates: { canonical: 'https://www.clovion.ai/customers' },
  openGraph: {
    title: 'Customers — Brands That Lead in AI Search',
    description:
      'Real brands, real numbers. See how 200+ teams used Clovion to lift AI mentions, citations, and share of voice across the major AI answer engines.',
    url: 'https://www.clovion.ai/customers',
    type: 'website'
  }
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What kind of teams use Clovion?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Growth, SEO, content, and product marketing teams at companies where AI search is starting to shape pipeline. Roughly half our base is SaaS, the rest spans fintech, consumer brands, logistics, AI infrastructure, and global marketing teams running multi-brand portfolios.'
      }
    },
    {
      '@type': 'Question',
      name: 'How fast do customers see results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Visibility score in 24 hours. First prioritized fix list inside seven days. Most teams ship their first batch of fixes within two weeks and see measurable score movement inside 30 days. The median time to a clearly visible lift is 90 days.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do customers see a measurable lift in AI citations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The average customer sees roughly 7.1x more brand mentions across ChatGPT, Claude, Gemini, and Perplexity after shipping the prioritized fix list. Before-and-after tracking is built into every shipped fix, so the lift is measured per change, not inferred from a dashboard refresh.'
      }
    },
    {
      '@type': 'Question',
      name: 'Are there enterprise case studies?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Customers like Unilever, Canon, DHL, and Reckitt run Clovion in production today across regulated industries, global brands, and multi-region deployments. Enterprise references are available under NDA on request.'
      }
    },
    {
      '@type': 'Question',
      name: 'Can I read a full case study?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The featured stories on this page cover Linear, Vercel, and Webflow with baselines, fix lists, and 90-day numbers. Longer-form case studies are available on request, and your customer engineer can share the full methodology behind any number you see on the page.'
      }
    }
  ]
}

export default function CustomersPage() {
  return (
    <div className="clv-dark clv-ai-vis-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FeatureContent />
    </div>
  )
}

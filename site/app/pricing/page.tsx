import type { Metadata } from 'next'
import FeatureContent from '@/components/pricing/FeatureContent'

export const metadata: Metadata = {
  title: 'Pricing — AI Visibility, Sentiment & GEO Tracking Plans',
  description: 'Clovion AI pricing. Starter from $79/mo, Growth at $229/mo, and custom Enterprise. Track brand visibility, sentiment, competitors, and GEO across ChatGPT, Claude, Gemini, Perplexity, Grok & AI Overviews. Upgrade anytime.',
  alternates: { canonical: 'https://www.clovion.ai/pricing' },
  openGraph: {
    title: 'Clovion AI Pricing — Plans for Every AI Search Strategy',
    description: 'Starter, Growth, and Enterprise plans for AI visibility tracking, sentiment analysis, prompt tracking, competitor analysis, and GEO recommendations. Start tracking how AI describes your brand.',
    url: 'https://www.clovion.ai/pricing',
    type: 'website',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Which Clovion plan is right for my brand?', acceptedAnswer: { '@type': 'Answer', text: 'The Starter plan is best for small brands or teams that want to begin tracking their AI visibility. The Growth plan is ideal for marketing, SEO, and content teams that need deeper tracking across multiple AI models. Enterprise is designed for larger companies, agencies, or teams that need unlimited prompts, full model coverage, and custom tracking.' } },
    { '@type': 'Question', name: 'Which AI models does Clovion track?', acceptedAnswer: { '@type': 'Answer', text: 'Clovion tracks leading AI engines such as ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews. The number of models available depends on your plan. Starter includes 2 models, Growth includes 3 models, and Enterprise gives access to all available models.' } },
    { '@type': 'Question', name: 'Can I choose which AI models I want to track?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Growth and Enterprise users can track across multiple AI models. Enterprise users get the most flexibility, including access to all available models and fully customizable prompt tracking.' } },
    { '@type': 'Question', name: 'What is included in GEO recommendations?', acceptedAnswer: { '@type': 'Answer', text: 'GEO recommendations help you improve how AI engines understand and surface your brand. This may include content suggestions, positioning improvements, website optimization insights, and recommendations to strengthen topical authority around important prompts.' } },
    { '@type': 'Question', name: 'Can I track my competitors?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Competitor analysis is available in the Growth and Enterprise plans. It helps you compare your brand against competitors across relevant prompts and AI-generated answers.' } },
    { '@type': 'Question', name: 'Can I upgrade my plan later?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can start with Starter or Growth and upgrade as your tracking needs grow. This is helpful if you want to begin with core visibility tracking and expand into competitor analysis, prompt tracking, and advanced GEO insights later.' } },
    { '@type': 'Question', name: 'Do you offer custom pricing?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Enterprise plans are available with custom pricing. This option is best for larger teams that need unlimited prompts, all AI models, fully customizable prompt tracking, and custom reporting.' } },
    { '@type': 'Question', name: 'Can I cancel my Clovion plan anytime?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can cancel your Clovion plan anytime. After cancellation, your plan will remain active until the end of your current billing cycle.' } },
    { '@type': 'Question', name: 'What happens after I cancel my plan?', acceptedAnswer: { '@type': 'Answer', text: 'Once your billing cycle ends, access to paid features, tracked prompts, model coverage, and advanced reports may be limited based on your account status. Your existing data may be retained for a limited period in case you decide to reactivate your plan.' } },
    { '@type': 'Question', name: 'What happens to my prompts if I downgrade?', acceptedAnswer: { '@type': 'Answer', text: 'If you downgrade to a plan with fewer prompts, you may need to reduce the number of active tracked prompts to match your new plan limit. For example, moving from Growth to Starter would reduce your prompt allowance to 50 prompts, and features such as prompt tracking, competitor analysis, fanout query insights, AI crawlability, and prompt volume insights may no longer be available.' } },
    { '@type': 'Question', name: 'Can I switch from a monthly plan to an Enterprise plan?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. If your team needs unlimited prompts, all AI models, fully customizable prompt tracking, or custom reporting, you can switch to an Enterprise plan by contacting our team.' } },
    { '@type': 'Question', name: 'Do plan changes take effect immediately?', acceptedAnswer: { '@type': 'Answer', text: 'Plan upgrades may take effect immediately so you can access additional prompts, models, and features right away. Downgrades may apply at the end of your current billing cycle, depending on your subscription settings.' } },
  ],
}

export default function PricingPage() {
  return (
    <div className="clv-dark clv-ai-vis-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FeatureContent />
    </div>
  )
}

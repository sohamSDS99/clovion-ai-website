import type { Metadata } from 'next'
import FeatureContent from '@/components/fanout/FeatureContent'

export const metadata: Metadata = {
  title: 'Fanout Query — AI Prompt Generation & Query Fan-Out Analysis',
  description: 'Generate measurement-grade prompts from topics and competitors. Understand how AI engines fan out queries into hidden sub-queries. Track across 6 engines daily.',
  alternates: { canonical: 'https://www.clovion.ai/features/fanout-query' },
  openGraph: {
    title: 'Fanout Query — Build the Prompts AI Engines Actually Search For',
    description: 'AI engines fan out every prompt into 6–14+ hidden sub-queries. Clovion AI generates and tracks a prompt set that covers the full fan-out surface. Deterministic. Brand-neutral. Daily.',
    url: 'https://www.clovion.ai/features/fanout-query',
    type: 'website',
  },
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is Query fanout?', acceptedAnswer: { '@type': 'Answer', text: 'Query fanout is the process where an AI system expands one user query into multiple related sub-queries or prompt variations before creating an answer. These variations help the AI gather broader context and decide which sources, brands, and explanations to include.' } },
    { '@type': 'Question', name: 'What is a Fanout Query tool?', acceptedAnswer: { '@type': 'Answer', text: 'A Fanout Query tool helps teams see the related prompt variations and subtopics connected to one buyer query. Clovion uses this to reveal where your brand appears, where competitors show up, and which content gaps affect AI visibility.' } },
    { '@type': 'Question', name: 'Why does query fanout matter for AI search?', acceptedAnswer: { '@type': 'Answer', text: 'Query fanout matters because AI engines may not rely on one exact query when generating an answer. They may explore related questions, modifiers, comparisons, and sources. If your content does not cover those branches, your brand may be missed or not cited.' } },
    { '@type': 'Question', name: 'How does Fanout Query help with GEO?', acceptedAnswer: { '@type': 'Answer', text: 'Fanout Query helps your team identify the subtopics and intent branches your content needs to cover. Those insights can guide GEO recommendations, content structure, schema, FAQs, internal links, and AI crawlability improvements.' } },
    { '@type': 'Question', name: 'How is Fanout Query different from prompt tracking?', acceptedAnswer: { '@type': 'Answer', text: 'Prompt tracking monitors specific prompts over time. Fanout Query expands one seed prompt into related variations so your team can understand the wider query universe behind AI search visibility.' } },
    { '@type': 'Question', name: 'Can Fanout Query help find citation gaps?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Fanout Query can show which prompt variations lead AI engines to cite competitor pages, third-party articles, or owned pages. This helps your team identify where stronger content is needed.' } },
    { '@type': 'Question', name: 'Can Clovion track fanout results across ChatGPT and Perplexity?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Clovion can test fanout variations across supported AI engines, including ChatGPT, Claude, Gemini, Perplexity, Grok, and Google AI Overviews.' } },
    { '@type': 'Question', name: 'What types of seed queries should I test?', acceptedAnswer: { '@type': 'Answer', text: 'Start with high-intent buyer prompts such as best tools, alternatives, comparison, pricing, use cases, how to, and what is queries related to your category.' } },
    { '@type': 'Question', name: 'What should I look for in query fanout analysis?', acceptedAnswer: { '@type': 'Answer', text: 'Look for prompt branches where your brand is missing, competitors are repeatedly mentioned, your pages are not cited, sentiment is weak, or the AI answer relies on sources you do not control.' } },
    { '@type': 'Question', name: 'Who should use Fanout Query?', acceptedAnswer: { '@type': 'Answer', text: 'SEO teams, content teams, growth teams, agencies, and product marketers can use Fanout Query to expand AI search research, build content roadmaps, and improve generative engine optimization strategy.' } },
  ],
}

export default function FanoutQueryPage() {
  return (
    <div className="clv-dark clv-ai-vis-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FeatureContent />
    </div>
  )
}

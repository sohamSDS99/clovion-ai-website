import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import FeatureContent from '@/components/crawl/FeatureContent'

export const metadata: Metadata = {
  title: 'AI Crawlability Tool | Check Robots.txt, llms.txt & AI Crawler Access',
  description: 'Improve AI crawlability with Clovion. Check AI crawler access, robots.txt rules, llms.txt, JSON-LD, canonical tags, and machine-readable content signals.',
  alternates: { canonical: 'https://www.clovion.ai/features/ai-crawlability' },
  openGraph: {
    title: 'AI Crawlability — Open the Gates to AI Search',
    description: 'Block training crawlers. Allow search crawlers. Auto-generate llms.txt, robots.txt, and JSON-LD. Connected to your Visibility Score. Not a standalone audit tool.',
    url: 'https://www.clovion.ai/features/ai-crawlability',
    type: 'website',
  },
}

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Clovion AI — AI Crawlability',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://www.clovion.ai/features/ai-crawlability',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Check AI crawler access, robots.txt rules, llms.txt, JSON-LD, canonical tags, and machine-readable content signals.',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is AI crawlability?', acceptedAnswer: { '@type': 'Answer', text: 'AI crawlability is the ability of AI crawlers and answer engines to access, read, and understand your website content. It includes crawler access rules, robots.txt, static content visibility, structured data, metadata, and machine-readable files like llms.txt.' } },
    { '@type': 'Question', name: 'Why does AI crawlability matter?', acceptedAnswer: { '@type': 'Answer', text: 'AI crawlability matters because AI systems cannot cite or summarize content they cannot access or understand. If important pages are blocked, hidden, poorly structured, or missing machine-readable context, your brand may be less visible in AI-generated answers.' } },
    { '@type': 'Question', name: 'What is an AI crawler checker?', acceptedAnswer: { '@type': 'Answer', text: 'An AI crawler checker reviews whether AI bots can access important pages and whether technical settings like robots.txt, server access, schema, canonicals, and page structure are helping or blocking discovery.' } },
    { '@type': 'Question', name: 'How does Clovion check AI crawlability?', acceptedAnswer: { '@type': 'Answer', text: 'Clovion reviews access rules, llms.txt coverage, JSON-LD, canonical tags, metadata, alt text, and whether important content is visible without JavaScript-only rendering patterns.' } },
    { '@type': 'Question', name: 'What is llms.txt?', acceptedAnswer: { '@type': 'Answer', text: 'llms.txt is a machine-readable file that can list important pages, links, and summaries for AI systems. It works like a curated guide to your content, not a replacement for strong pages, schema, or traditional SEO foundations.' } },
    { '@type': 'Question', name: 'Is llms.txt the same as robots.txt?', acceptedAnswer: { '@type': 'Answer', text: 'No. robots.txt tells crawlers what they are allowed or not allowed to access. llms.txt is a guide that helps AI systems understand which content is important and where to find it.' } },
    { '@type': 'Question', name: 'Can Clovion generate llms.txt?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Clovion supports machine-readable artifacts such as llms.txt, llms-full.txt, robots.txt guidance, and JSON-LD recommendations to help improve AI crawlability.' } },
    { '@type': 'Question', name: 'Should I allow every AI crawler?', acceptedAnswer: { '@type': 'Answer', text: 'Not always. Some teams want maximum visibility, while others need stricter controls for legal, privacy, or IP reasons. Clovion helps review crawler guidance so your team can choose the right access strategy.' } },
    { '@type': 'Question', name: 'What AI crawlers should I check?', acceptedAnswer: { '@type': 'Answer', text: 'Common AI-related crawlers and agents include GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, and other search or retrieval bots. The right setup depends on your visibility goals and content policy.' } },
    { '@type': 'Question', name: 'How is AI crawlability different from GEO recommendations?', acceptedAnswer: { '@type': 'Answer', text: 'GEO recommendations focus on improving content for AI search visibility. AI Crawlability focuses on whether AI systems can access, parse, and understand the technical signals behind your pages.' } },
    { '@type': 'Question', name: 'Can AI crawlability improve citations?', acceptedAnswer: { '@type': 'Answer', text: 'It can help, but it does not guarantee citations. Better crawlability makes it easier for AI systems to access and interpret your content, while visibility also depends on relevance, authority, freshness, and how well the page answers the prompt.' } },
    { '@type': 'Question', name: 'Who should use an AI crawlability tool?', acceptedAnswer: { '@type': 'Answer', text: 'SEO teams, technical SEO teams, developers, content teams, and growth teams should use AI crawlability checks to make sure important pages are accessible, structured, and ready for AI search.' } },
  ],
}

export default function AiCrawlabilityPage() {
  return (
    <div
      className="clv-ai-vis-page"
      style={{ ['--bg' as string]: '#FAF9F7', background: '#FAF9F7', color: 'var(--ink)' } as CSSProperties}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FeatureContent />
    </div>
  )
}

// Single source of truth for llms.txt Generator FAQs.
// Imported by app/tools/llms-txt-generator/page.tsx (FAQPage JSON-LD) and
// components/tools/llms-txt-generator/FeatureContent.tsx (render).

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is llms.txt?',
    a: 'llms.txt is a simple plain-text file you place at the root of your site that tells AI systems which pages matter most and what each one is about. Think of it as a curated index designed for language models rather than search engines.'
  },
  {
    q: 'Is llms.txt a standard?',
    a: 'It is an emerging community convention rather than a formal W3C or IETF standard. Major AI engines are starting to look for it, but support is still uneven. Treat it as forward-looking signal hygiene, not a guarantee.'
  },
  {
    q: 'Where do I place the file on my site?',
    a: 'Upload it to your domain root so it resolves at https://yourbrand.com/llms.txt. Some teams also publish a longer companion file at /llms-full.txt with deeper context. Keep both files indexable and avoid blocking them in robots.txt.'
  },
  {
    q: 'Does this guarantee my brand gets cited by AI?',
    a: 'No tool can promise citations. A clean llms.txt helps AI engines find and interpret the right pages, but visibility still depends on the quality of those pages, how authoritative your domain is, and how well your content answers real buyer prompts.'
  },
  {
    q: 'How is llms.txt different from robots.txt?',
    a: 'robots.txt is a permission file — it tells crawlers what they may and may not fetch. llms.txt is a guidance file — it points AI systems toward the content you most want them to read. Different jobs. Use both.'
  },
  {
    q: 'Is this generator free?',
    a: 'Yes, completely free. No signup, no card, no usage cap. If you want a deeper read on how AI engines describe your brand, the full Clovion AI Visibility Score is also free and runs in about a minute.'
  }
]

// Single source of truth for the pricing FAQ. Imported by both the client
// composer (components/pricing/FeatureContent.tsx, which renders the accordion)
// and the server page (app/pricing/page.tsx, which builds the FAQPage JSON-LD),
// so the visible FAQ and the structured data can never drift. Plain module —
// NOT 'use client' — so the server page can map() over it at build time.

export type PricingFaq = { q: string; a: string }

export const P_FAQS: PricingFaq[] = [
  { q: 'What is the launch offer?', a: 'For a limited time, every plan gets 20% off. On monthly billing the 20% applies to your first three months. On annual billing the 20% applies to the whole year, and it stacks with the standard 2 months free, so you save on both.' },
  { q: "What's the difference between monthly and annual billing?", a: 'Monthly plans are billed each month. Annual plans are billed once for the year, and you pay for 10 months while getting all 12, so two months are free. Right now the launch offer adds another 20% off on top of both.' },
  { q: 'How does Clovion measure AI visibility?', a: 'Clovion runs your tracked prompts across your chosen AI engines every day, then analyzes whether and how your brand appears, the sentiment of each mention, and which sources get cited in the answer.' },
  { q: 'What counts as a prompt?', a: "A prompt is one question or query you want to monitor. Clovion runs it across every AI engine included in your plan and tracks your brand's presence, sentiment, and citations in the responses." },
  { q: 'Which AI engines does Clovion track?', a: 'Clovion tracks major AI answer engines including ChatGPT, Claude, and Gemini. Starter includes 1 engine, Growth includes 3, and Enterprise unlocks up to 6.' },
  { q: 'Can I track multiple brands?', a: 'Yes. Starter covers 1 brand, Growth covers 2, and Enterprise supports unlimited brands, ideal for agencies managing multiple clients.' },
  { q: 'What is Ask Clove?', a: "Ask Clove is Clovion's AI assistant that answers questions about your visibility data and suggests actions. Growth includes 10 questions per month, and Enterprise is unlimited." },
  { q: 'Is there a free trial?', a: 'Yes. Start a free trial on any self-serve plan, no credit card required.' },
  { q: 'How do I cancel?', a: 'You can cancel anytime from your account settings. Your plan stays active through the end of the current billing period.' },
]

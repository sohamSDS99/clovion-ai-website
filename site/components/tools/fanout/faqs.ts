// Shared FAQ data for /tools/fanout. Single source of truth — consumed by:
//   • app/tools/fanout/page.tsx (to emit FAQPage JSON-LD)
//   • components/tools/fanout/FeatureContent.tsx (to render the FAQ section)

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is query fan-out?',
    a: 'Query fan-out is the process where modern AI search engines silently expand one user query into many related sub-queries before generating an answer. Instead of running your exact prompt and stopping there, the model rewrites it into reformulations, comparisons, procedural questions, and pricing angles, retrieves sources for each branch, and then composes a final answer from the whole set.'
  },
  {
    q: 'How do AI engines decide what variations to run?',
    a: 'Each engine uses its own retrieval and rewriting layer, but the patterns are remarkably consistent. They look at intent (informational, comparative, transactional), entity type (product, brand, category), modifiers (best, cheapest, alternatives), and audience signals (team size, industry, geography). The fan-out is essentially an automated keyword research step run on every prompt.'
  },
  {
    q: 'Why does fan-out matter for SEO and GEO?',
    a: 'It widens the surface area you have to cover. A single buyer query can pull in 8–12 sub-queries, and your brand only gets cited if your content answers a meaningful share of them. Mapping fan-out turns one ranking question into a content cluster brief — exactly the muscle SEO and GEO teams already have, applied to AI answers instead of blue links.'
  },
  {
    q: 'How do I use these for content planning?',
    a: 'Group the sub-queries by intent (reformulation, comparative, procedural, pricing), then audit your site against each cluster. Reformulations point to the canonical category page you need to rank for. Comparatives need head-to-head pages. Procedurals need how-to guides. Pricing queries need a transparent pricing page or pricing-explainer article. One seed query becomes a fully scoped brief.'
  },
  {
    q: 'Are these real LLM-generated sub-queries or static examples?',
    a: 'The sample on this page is illustrative — it shows the shape of a typical fan-out so you can see the pattern without waiting for a live model call. The full Clovion product runs your prompt against the same retrieval pipelines real AI engines use, captures the actual sub-queries, and tracks how each branch performs over time.'
  },
  {
    q: 'Is this tool free?',
    a: 'Yes — the Query Fan-Out Generator is completely free, no signup or credit card required. It is one of four free tools we publish to help teams understand AI search. If you want fan-out tracking across ChatGPT, Perplexity, Gemini, and AI Overviews on a recurring schedule, that lives inside the paid Clovion plan.'
  }
]

// Single-sourced FAQ copy for the Robots.txt AI Bot Checker tool.
// Consumed by BOTH the server page (FAQPage JSON-LD emission) and the client
// FeatureContent (rendered accordion). Keep entries to 6 — UI is tuned for that
// length and matches the sibling tool pages.

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is robots.txt and why does it matter for AI?',
    a: 'robots.txt is a small text file at the root of your site that tells crawlers which paths they may fetch. AI assistants and AI search engines run their own crawlers, and most of them honor the same protocol web crawlers have used for decades. Blocking a bot here means it cannot read those pages — which means it cannot quote, summarize, or recommend them in AI answers either.'
  },
  {
    q: 'Which AI bots should I allow?',
    a: 'It depends on what you want. If you want to appear in answers from ChatGPT search, Claude, Perplexity, and Google AI Overviews, allow their crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended). Training-only crawlers (anthropic-ai, CCBot) are a separate question — some teams allow them to seed future models, others block them for IP reasons. The checker shows you all 15 so you can decide per-bot.'
  },
  {
    q: 'How do I allow a bot that is currently disallowed?',
    a: 'Find the User-agent block matching that bot (or the wildcard "User-agent: *" block if no specific one exists) and either remove the Disallow line or add an Allow rule for the paths you want crawled. The most permissive matching rule wins for most modern bots. Re-run the checker after deploying robots.txt to confirm the change took effect.'
  },
  {
    q: 'Does allowing AI bots guarantee I will be recommended?',
    a: 'No. Allowing a bot is necessary, not sufficient. AI engines also weigh authority, freshness, structured data, citations from other domains, and whether your content actually answers the prompt. robots.txt opens the door — content quality and external signals decide whether you get cited once you are through it.'
  },
  {
    q: 'Why does my result say "indeterminate"?',
    a: 'Indeterminate means your robots.txt has a rule that could be read multiple ways for that bot — for example, conflicting Allow and Disallow lines under a wildcard, or a pattern that some crawlers honor and others ignore. We flag it so you can audit the rule manually rather than assume the bot will resolve it the way you intended.'
  },
  {
    q: 'Is this checker free?',
    a: 'Yes. The robots.txt checker is free, with no signup. If you want a deeper picture — your share of voice across AI engines, which prompts surface your brand, sentiment, citations, and improvement recommendations — run a free AI visibility scan on your domain.'
  }
]

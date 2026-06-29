// Single source of truth for AI Crawlability Checker FAQs.
// Imported by BOTH page.tsx (to build the FAQPage JSON-LD) and
// FeatureContent.tsx (to render the accordion) so copy never drifts.

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'What is an AI crawler?',
    a: 'An AI crawler is an automated user-agent that visits webpages so AI products like ChatGPT, Claude, Perplexity, and Google AI Overviews can read, index, or cite their content. Different bots play different roles: some collect training data, some fetch live answers, some index the web for retrieval.'
  },
  {
    q: 'Should I allow or block AI crawlers?',
    a: 'It depends on your visibility goals. If you want your brand to appear in AI answers, you generally want to allow live-answer and retrieval bots like ChatGPT-User, ClaudeBot, PerplexityBot, and Google-Extended. Blocking training-only bots like GPTBot or anthropic-ai is a content-policy choice that has little impact on whether your brand surfaces today.'
  },
  {
    q: 'How do I unblock GPTBot or ClaudeBot?',
    a: 'Edit your robots.txt to remove or scope any Disallow rules that target the bot. A common pattern is a User-agent line for each bot followed by an Allow: / directive. Push the change, wait for the next crawl, and re-run this checker to confirm the new status.'
  },
  {
    q: 'Why does my result show "indeterminate" for some bots?',
    a: 'Indeterminate means we could not fetch robots.txt cleanly, the file was missing, or your server returned an unexpected status. The bot is probably allowed by default, but we cannot confirm. Most often it means the URL has a redirect chain, an authentication wall, or no robots.txt at the root.'
  },
  {
    q: 'Does allowing AI bots guarantee my brand gets cited?',
    a: 'No. Allowing crawler access is necessary but not sufficient. Citation depends on whether your content is structured, machine-readable, relevant, recent, and authoritative for the prompt. The free checker confirms access only — the full Clovion product also audits content, schema, and competitive position.'
  },
  {
    q: 'Is this checker free?',
    a: 'Yes, completely. The AI Crawlability Checker runs against your live robots.txt, returns a per-bot allow/block readout in seconds, and never asks for a card or signup. The paid Clovion plan adds daily monitoring, multi-page checks, llms.txt generation, and recommendations tied to your visibility score.'
  }
]

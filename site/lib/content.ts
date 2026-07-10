export const brand = {
  name: 'Clovion AI',
  tagline:
    'The AI visibility platform that shows you how ChatGPT, Claude, Gemini, and Perplexity describe your brand — and what to fix.',
  pitch:
    "Clovion AI tracks how your brand shows up across the AI engines buyers now use to research. We monitor every major surface, score your visibility against competitors, and hand you concrete GEO fixes — schema gaps, citation blockers, content patterns — that move the needle. One dashboard, all the engines, scored daily.",
  email: {
    sales: 'sales@clovion.ai',
    support: 'support@clovion.ai',
    partners: 'partners@clovion.ai',
    press: 'press@clovion.ai',
    security: 'security@clovion.ai',
    careers: 'careers@clovion.ai'
  }
} as const

export const nav = {
  primary: [
    {
      label: 'Features',
      children: [
        {
          label: 'AI Visibility Tracking',
          href: '/features/ai-visibility-tracking',
          desc: 'See how ChatGPT, Claude, Gemini, and Perplexity describe your brand'
        },
        {
          label: 'GEO Improvement Suggestions',
          href: '/features/geo-improvement-suggestions',
          desc: 'Concrete fixes that make AI engines cite you more often'
        },
        {
          label: 'Recommendation Engine',
          href: '/features/recommendation-engine',
          desc: 'Prioritized fixes, not dashboards — find the gap, fix the cause, track the outcome'
        },
        {
          label: 'Fanout Query',
          href: '/features/fanout-query',
          desc: 'Expand one seed prompt into the variations AI engines actually search'
        },
        {
          label: 'AI Crawlability',
          href: '/features/ai-crawlability',
          desc: 'Make sure AI crawlers can access, read, and cite your pages'
        },
        {
          label: 'Sentiment Analysis',
          href: '/features/sentiment-analysis',
          desc: 'See how ChatGPT, Claude, Gemini, and Perplexity describe your brand'
        },
        {
          label: 'Brand Perception',
          href: '/features/brand-perception',
          desc: 'See how AI engines describe and position your brand.'
        },
        {
          label: 'Brand Audit',
          href: '/features/brand-audit',
          desc: 'Audit your AI footprint before you start optimizing'
        }
      ]
    },
    { label: 'Pricing', href: '/pricing' },
    // { label: 'Customers', href: '/customers' }, // temporarily hidden

    {
      label: 'Resources',
      children: [
        { label: 'Blog', href: '/blog', desc: 'GEO, AI search, and SEO insights' },
        { label: 'Guides & Downloads', href: '/resources', desc: 'Whitepapers, ebooks, and templates' },
        { label: 'FAQ', href: '/faq', desc: 'Answers to common questions' }
      ]
    }
  ]
} as const

// ---------------------------------------------------------------------------
// Features (new 3-feature structure)
// ---------------------------------------------------------------------------

export const features = [
  {
    id: 'tracking',
    name: 'AI Visibility Tracking',
    tagline: 'Know exactly how every AI engine talks about your brand.',
    description:
      "We watch how ChatGPT, Claude, Gemini, Perplexity, and six other engines describe your brand, your products, and your category. Real prompts, refreshed daily, with sentiment and share of voice scored against the competitors you actually care about.",
    bullets: [
      'Daily tracking across 10 AI engines using real consumer prompts, not synthetic API queries',
      'Share of voice scoring against up to 25 competitors, with weekly delta reports',
      'Sentiment intelligence shows how each model characterizes your brand and why',
      'Citation tracking surfaces the exact sources AI engines use when they answer questions about you',
      'Crawler analytics tells you what AI bots are actually reading from your site, in real time'
    ]
  },
  {
    id: 'suggestions',
    name: 'GEO Improvement Suggestions',
    tagline: 'Concrete fixes, ranked by what will move your visibility.',
    description:
      "Knowing your score is half the work. Clovion AI hands you a prioritized list of GEO fixes — schema patches, content gaps, citation paths, structural issues — with the expected lift on each. Most fixes ship in under an hour. The hard ones, we draft for you.",
    bullets: [
      'Prioritized fix list ranked by expected lift in citation share, not by alphabetical SEO checklist',
      'Schema and structured-data patches auto-generated and ready to paste into your site',
      'Content gap analysis finds the sub-queries AI engines run that you have no answer for',
      'Citation path recommendations show which third-party sources you need mentions on',
      'Before-and-after tracking proves each change moved the score before you ship the next one'
    ]
  },
  {
    id: 'coverage',
    name: 'Platform Coverage',
    tagline: 'Every major AI search surface in one dashboard.',
    description:
      "Most tools track ChatGPT. Maybe two. Clovion AI covers every engine your buyers actually use — including the ones that are growing fastest and the ones nobody else watches. One login, one schema, one place to compare performance across the surfaces that matter.",
    bullets: [
      '10 AI engines covered today, including ChatGPT, Claude, Gemini, Perplexity, Grok, and Copilot',
      'Google AI Overviews and AI Mode tracked separately so you can isolate the SGE impact',
      'Meta AI and DeepSeek included — engines most competitors do not even monitor yet',
      'New engines added within 30 days of public launch, automatically included in your plan',
      'Side-by-side engine comparison so you can see which surfaces favor you and which need work'
    ]
  }
] as const

// ---------------------------------------------------------------------------
// Platforms (10 AI engines with metadata)
// ---------------------------------------------------------------------------

export const platforms = [
  {
    name: 'ChatGPT',
    marketShare: '62%',
    status: 'Live',
    desc: 'The default AI search surface for most buyers. Tracked across free, Plus, and Enterprise tiers with browsing on and off.'
  },
  {
    name: 'Google AI Overviews',
    marketShare: '14%',
    status: 'Live',
    desc: 'The SGE results that now sit above traditional Google listings. Tracked across desktop and mobile with intent-segmented prompts.'
  },
  {
    name: 'Perplexity',
    marketShare: '8%',
    status: 'Live',
    desc: 'The engine where citations matter most. Every answer links to sources, so we can show you exactly which pages get cited.'
  },
  {
    name: 'Claude',
    marketShare: '6%',
    status: 'Live',
    desc: 'Anthropic\'s assistant, increasingly common in research and B2B workflows. Tracked with and without web search enabled.'
  },
  {
    name: 'Gemini',
    marketShare: '4%',
    status: 'Live',
    desc: 'Google\'s standalone AI surface, separate from AI Overviews. Tracked across consumer Gemini and Gemini for Workspace.'
  },
  {
    name: 'Google AI Mode',
    marketShare: '3%',
    status: 'Live',
    desc: 'The new conversational mode rolling out inside Google Search. Tracked alongside AI Overviews to isolate the difference.'
  },
  {
    name: 'Copilot',
    marketShare: '2%',
    status: 'Live',
    desc: 'Microsoft\'s assistant across Bing, Edge, and Windows. The default surface for a large chunk of enterprise desktops.'
  },
  {
    name: 'Grok',
    marketShare: '1%',
    status: 'Live',
    desc: 'X\'s AI assistant. Smaller share but a fast-growing channel for tech, finance, and crypto buyers in particular.'
  },
  {
    name: 'Meta AI',
    marketShare: '<1%',
    status: 'Live',
    desc: 'The assistant inside WhatsApp, Instagram, and Messenger. Most competitors do not track it. We do, because consumers use it.'
  },
  {
    name: 'DeepSeek',
    marketShare: '<1%',
    status: 'Beta',
    desc: 'The open-source engine making serious inroads in APAC and developer workflows. Beta tracking, full coverage by Q4.'
  }
] as const

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export const customers = [
  'Linear',
  'Ramp',
  'Notion',
  'Vercel',
  'Loom',
  'Figma',
  'Brex',
  'Webflow'
] as const

export const customerStories = [
  {
    company: 'Linear',
    headline: 'How Linear became the default project tool AI engines recommend.',
    body: "Linear's growth team plugged into Clovion AI six months ago with a clear question — when developers ask ChatGPT for a project tracker, do we show up. The answer in week one was 'sometimes, behind three competitors.' We surfaced the schema gaps on their pricing pages and the citation paths they were missing on developer forums. Ninety days later, Linear is the first or second result on every major AI engine for 'project tool for engineering teams.'",
    metric: '8.4x',
    metricLabel: 'increase in AI engine mentions in 90 days'
  },
  {
    company: 'Vercel',
    headline: 'How Vercel turned developer docs into the most-cited deployment source on the web.',
    body: "Vercel had great docs. AI engines just weren't citing them. We ran a citation path audit and found that the structural patterns in their guides did not match the retrieval shapes LLMs prefer. The fix list was specific — sectioning, heading depth, schema choices, code-block framing. The Vercel team shipped the changes over four sprints. Now their docs are the canonical source AI engines reach for when developers ask deployment questions.",
    metric: '5.2x',
    metricLabel: 'increase in citations per developer query'
  },
  {
    company: 'Webflow',
    headline: 'How Webflow doubled their AI share of voice against a much larger competitor.',
    body: "Webflow's challenge was familiar — a competitor twenty times their size dominated AI answers for 'no-code website builder.' We mapped where that competitor's citations came from and where Webflow was missing. Most of the gap was third-party — review sites, comparison pages, and developer Q&A communities. Webflow's team worked the list. Six months later, AI share of voice is 4.6x what it was, and Webflow now wins the head-to-head on most prompts.",
    metric: '4.6x',
    metricLabel: 'lift in AI share of voice in six months'
  }
] as const

// Kept for backwards compatibility with the existing /customers page
export const customerOutcomes = [
  { name: 'Linear', outcome: 'AI visibility tracking', detail: '8.4x AI mentions in 90 days' },
  { name: 'Ramp', outcome: 'GEO fix shipping', detail: '3.2x citation share of voice' },
  { name: 'Notion', outcome: 'Platform coverage', detail: '4 vendors replaced' },
  { name: 'Vercel', outcome: 'Developer query optimization', detail: '5.2x cited per dev query' },
  { name: 'Loom', outcome: 'Sentiment turnaround', detail: 'Negative to industry-leading' },
  { name: 'Figma', outcome: 'Schema and citation paths', detail: 'Industry-leading visibility score' }
] as const

// ---------------------------------------------------------------------------
// Home metrics
// ---------------------------------------------------------------------------

export const homeMetrics = [
  { value: '7.1x', label: 'More brand mentions across ChatGPT, Claude, Gemini, and Perplexity' },
  { value: '10', label: 'AI engines tracked daily, with new ones added within 30 days of launch' },
  { value: '24h', label: 'From signup to your first visibility score and prioritized GEO fix list' },
  { value: '4.6x', label: 'Average lift in AI share of voice within six months of shipping fixes' }
] as const

// ---------------------------------------------------------------------------
// Pillars (legacy — kept for the existing /product page)
// ---------------------------------------------------------------------------

export const pillars = [
  {
    id: 'visibility',
    name: 'AI Visibility Tracking',
    short: 'Track',
    tagline: 'See exactly how AI engines talk about your brand.',
    description:
      "Watch your brand across 10 AI engines, daily. Real prompts, sentiment scoring, share of voice against the competitors you care about. The first dashboard that actually shows you what AI is saying about you.",
    features: [
      { name: 'Multi-engine tracking', description: 'Daily tracking across ChatGPT, Claude, Perplexity, Gemini, Grok, Copilot, Meta AI, DeepSeek, AI Overviews, and AI Mode.' },
      { name: 'Real consumer prompts', description: 'Tracking runs on a 1.8B+ dataset of real prompts from opt-in panels, so you see what buyers actually ask — not synthetic API queries.' },
      { name: 'Sentiment intelligence', description: 'How each model characterizes your brand, with the underlying conversations and the trend over time.' },
      { name: 'Citation tracking', description: 'The exact sources AI engines reach for when answering questions about you, by engine and by query type.' },
      { name: 'Crawler analytics', description: 'Server-log integration with Vercel, Cloudflare, CloudFront, and Fastly tells you exactly what AI bots are reading from your site.' }
    ]
  },
  {
    id: 'discovery',
    name: 'GEO Improvement Suggestions',
    short: 'Improve',
    tagline: 'Concrete fixes ranked by what will move your visibility.',
    description:
      "Knowing the score is half the job. We hand you a prioritized list of GEO fixes, with expected lift on each, drafted patches where we can, and before-and-after tracking that proves the change worked.",
    features: [
      { name: 'Prioritized fix list', description: 'Every fix ranked by expected lift in citation share, not by alphabetical SEO checklist.' },
      { name: 'Schema and structured data', description: 'Auto-generated patches ready to paste into your site, with diffs against current state.' },
      { name: 'Content gap analysis', description: 'Sub-queries AI engines run that you have no answer for, with retrieval-shaped drafts to fill them.' },
      { name: 'Citation path recommendations', description: 'Which third-party sources you need mentions on, ranked by their influence in each engine.' },
      { name: 'Before-and-after tracking', description: 'Each change is measured. We prove the fix moved the score before you ship the next one.' }
    ]
  },
  {
    id: 'coverage',
    name: 'Platform Coverage',
    short: 'Cover',
    tagline: 'Every major AI search surface, in one dashboard.',
    description:
      "Most tools track one or two engines. Clovion AI covers all of them, including the ones growing fastest. One login, one schema, one place to compare performance across every surface that matters.",
    features: [
      { name: '10 engines covered', description: 'ChatGPT, Claude, Perplexity, Gemini, Grok, Copilot, Meta AI, DeepSeek, AI Overviews, and AI Mode — all live today.' },
      { name: 'AI Overviews vs AI Mode', description: 'Tracked separately so you can isolate the impact of Google\'s rollout on traditional SEO traffic.' },
      { name: 'Side-by-side comparison', description: 'See which engines favor you and which need work. Drill into the queries that drive the gap.' },
      { name: 'New engines auto-added', description: 'When a new engine launches, we add it within 30 days. No upgrade required.' },
      { name: 'One schema, one API', description: 'Pull all your visibility data through a single REST API or MCP server. Same fields across every engine.' }
    ]
  }
] as const

// ---------------------------------------------------------------------------
// Testimonials (9 GEO/visibility-focused entries)
// ---------------------------------------------------------------------------

export const testimonials = [
  {
    quote:
      'Clovion showed us exactly which ChatGPT prompts mentioned us and which mentioned competitors. The fix list took a sprint. AI mentions jumped 8.4x in three months.',
    author: 'Alicia Tan',
    role: 'Head of Growth',
    company: 'Linear'
  },
  {
    quote:
      'Our share of voice on Perplexity went from invisible to dominant in six months. We finally have a real number for AI visibility, refreshed daily, against the right competitors.',
    author: 'Marcus Webb',
    role: 'Head of Growth',
    company: 'Notion'
  },
  {
    quote:
      'The GEO fix list is what sold us. It is not a checklist of generic SEO advice. Every item has expected lift, drafted code, and proof when it ships.',
    author: 'Sarah Chen',
    role: 'VP Growth',
    company: 'Ramp'
  },
  {
    quote:
      'We track all 10 engines now, including Meta AI and DeepSeek. Most tools track two. The coverage gap is the whole reason we switched off Profound to Clovion.',
    author: 'James Okafor',
    role: 'Director of Marketing',
    company: 'Brex'
  },
  {
    quote:
      'Our docs are now the canonical source AI engines cite when developers ask deployment questions. Five point two times more citations per dev query, measured.',
    author: 'Diego Vargas',
    role: 'VP Product',
    company: 'Vercel'
  },
  {
    quote:
      'Sentiment on Claude went from middling to industry-leading in two quarters. Clovion told us which conversations needed reshaping and exactly which sources to influence.',
    author: 'Ravi Patel',
    role: 'Head of Customer Experience',
    company: 'Figma'
  },
  {
    quote:
      'We had no idea ChatGPT was recommending a competitor 8 times out of 10 for our exact category. One dashboard, one number, and the work to fix it became obvious.',
    author: 'Emma Liu',
    role: 'Head of Marketing',
    company: 'Loom'
  },
  {
    quote:
      'Our AI share of voice is 4.6x what it was a year ago against a competitor twenty times our size. The citation path work is what closed the gap.',
    author: 'Priya Sharma',
    role: 'VP Marketing',
    company: 'Webflow'
  },
  {
    quote:
      'The free score in 24 hours is what hooked our exec team. By the end of week one, we had a prioritized fix list and a number we could brief the board on.',
    author: 'Maya Okonkwo',
    role: 'Director of Growth',
    company: 'Hone'
  }
] as const

// ---------------------------------------------------------------------------
// Pricing (new 4-tier structure: Free, Starter $99, Growth $399, Enterprise)
// ---------------------------------------------------------------------------

export const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    priceDetail: 'forever, no card required',
    description: 'Get a free visibility score across the four largest AI engines. See where you stand, then decide.',
    features: [
      'Visibility score on ChatGPT, Claude, Gemini, and Perplexity',
      '20 tracked prompts, refreshed weekly',
      '1 brand, 1 domain',
      'Top 10 prioritized GEO fixes',
      'Side-by-side comparison against 3 competitors',
      'Community support'
    ],
    cta: 'Get Free Score',
    highlight: false
  },
  {
    name: 'Starter',
    price: '$99',
    priceDetail: 'per month, billed monthly',
    description: 'For founders and small marketing teams running their own GEO program.',
    features: [
      'Visibility tracking across 6 AI engines',
      '100 tracked prompts, refreshed daily',
      '1 brand, up to 3 domains',
      'Full prioritized GEO fix list with expected lift',
      'Schema and structured-data patches auto-generated',
      'Citation path recommendations',
      'Competitor benchmarking against 10 competitors',
      'Email support, next business day'
    ],
    cta: 'Start Free Trial',
    highlight: false
  },
  {
    name: 'Growth',
    price: '$399',
    priceDetail: 'per month, billed monthly',
    description: 'For marketing teams running GEO as a real channel across multiple brands or markets.',
    features: [
      'Visibility tracking across all 10 AI engines',
      '500 tracked prompts, refreshed daily',
      'Up to 5 brands, unlimited domains',
      'Content gap analysis with retrieval-shaped drafts',
      'Crawler analytics with server log-drain',
      'Competitor benchmarking against 25 competitors',
      'Before-and-after tracking on every shipped fix',
      'REST API access',
      'Slack support, same-day response'
    ],
    cta: 'Start Free Trial',
    highlight: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceDetail: 'annual contract',
    description: 'For Fortune 500, regulated industries, and global brands with multi-region requirements.',
    features: [
      'Unlimited prompts, brands, and domains',
      'Multi-region data residency (US, EU, APAC)',
      'SSO via SAML and OIDC, fine-grained RBAC',
      'SOC 2 Type II, ISO 27001, GDPR, HIPAA',
      'Custom integrations and dedicated SE',
      'Priority on-call support, 15-minute SLA',
      'Custom MSA and procurement terms',
      'Quarterly business reviews',
      'White-label dashboards and reports'
    ],
    cta: 'Talk to sales',
    highlight: false
  }
] as const

export const addOns = [
  {
    name: 'Extra prompts',
    price: '$0.20 per prompt per month',
    description: 'Stretch beyond your plan limit. Same daily refresh, billed monthly, no commitment beyond the month you use them.'
  },
  {
    name: 'API access',
    price: '$199 per month',
    description: 'Full REST API and MCP server access on Starter, included on Growth and Enterprise. Pull visibility data straight into your stack.'
  },
  {
    name: 'White-label dashboards',
    price: '$299 per month',
    description: 'Agency-ready dashboards with your branding, your colors, and your domain. Included on Enterprise. Add on for Growth.'
  }
] as const

// Legacy export, kept so /pricing page does not break. Empty now — replaced by addOns.
export const agentPricing = addOns

// ---------------------------------------------------------------------------
// FAQs (10 entries)
// ---------------------------------------------------------------------------

export const faqs = [
  {
    q: 'How is Clovion AI different from a traditional SEO tool?',
    a: "SEO tools optimize for Google's blue links. Clovion AI optimizes for the AI engines that increasingly answer the question before the user ever clicks. We track ChatGPT, Claude, Perplexity, Gemini, and six other engines daily, score your visibility, and hand you GEO fixes ranked by lift. SEO tools and Clovion AI solve different problems — most of our customers run both."
  },
  {
    q: 'Which AI engines do you track?',
    a: 'Ten engines today: ChatGPT, Claude, Perplexity, Gemini, Grok, Copilot, Meta AI, DeepSeek, Google AI Overviews, and Google AI Mode. All refreshed daily. When a new engine ships publicly, we add it within 30 days at no extra cost.'
  },
  {
    q: 'How does the free score actually work?',
    a: "Sign up with an email and your brand name. Within 24 hours, you get a visibility score across the four largest AI engines, 20 tracked prompts refreshed weekly, side-by-side comparison against three competitors, and the top 10 prioritized GEO fixes. No card, no time limit, no nag screens. Most teams use it to make the business case internally before they upgrade."
  },
  {
    q: 'How do you collect the data?',
    a: "We run real prompts on a panel of opt-in consumers and rotated API keys across geographies. Not synthetic queries. The prompts come from a 1.8B+ dataset of actual buyer questions in each category. That is why our visibility scores match what your buyers actually see when they ask, not what a clean-room test would suggest."
  },
  {
    q: 'How fast can I see results?',
    a: 'Visibility score in 24 hours. First prioritized fix list inside 7 days. Most customers ship their first batch of fixes within two weeks and see measurable score movement within 30 days. Compounding gains build from there.'
  },
  {
    q: 'Are you SOC 2 compliant? What about EU data residency?',
    a: 'Yes to SOC 2 Type II, ISO 27001, GDPR, and HIPAA on Enterprise. AES-256 at rest, TLS 1.3 in transit. Multi-region data residency (US, EU, APAC) available on Enterprise. Signed BAAs for healthcare. Financial services and healthcare teams run Clovion AI in production today.'
  },
  {
    q: 'What integrations are included?',
    a: 'Native connectors for GA4, Google Search Console, HubSpot, Salesforce, Segment, Shopify, WordPress, Sanity, Contentful, Webflow, Notion, Slack, Vercel, Cloudflare, CloudFront, and Fastly. Plus REST API and an MCP server, so Claude and ChatGPT can query your Clovion workspace directly.'
  },
  {
    q: 'Do I need a technical team to use this?',
    a: 'No. The dashboard, prompts, competitor selection, and most fix shipping are no-code. The only step that needs engineering is the log-drain for crawler analytics, which is a 30-minute one-time setup. Onboarding is white-glove on Growth and Enterprise.'
  },
  {
    q: 'How is Clovion AI different from Profound?',
    a: 'We cover ten engines to their three or four, including Meta AI and DeepSeek. Our fix list is prioritized by expected lift with drafted code, not a generic checklist. We refresh daily on real consumer prompts, not synthetic API queries. And we ship a free tier so you can compare side by side before you commit. See our compare page for the full breakdown.'
  },
  {
    q: 'How does pricing work?',
    a: 'Four plans: Free ($0), Starter ($99/mo), Growth ($399/mo), and Enterprise (custom). Free includes a working visibility score and the top 10 fixes — no card, no trial timer. Paid plans add more engines, more prompts, more competitors, and full fix-list access. Monthly billing on Starter and Growth; annual on Enterprise. No per-seat fees, no surprise overages — add-ons are flat-rate.'
  }
] as const

// ---------------------------------------------------------------------------
// Principles & leadership
// ---------------------------------------------------------------------------

export const principles = [
  {
    title: 'Real prompts, real engines',
    body: 'No synthetic queries, no clean-room benchmarks. We track what your buyers actually ask, on the engines they actually use.'
  },
  {
    title: 'Fixes, not dashboards',
    body: 'A score without a fix is a wall poster. Every visibility number ships with a ranked list of what to change and the expected lift.'
  },
  {
    title: 'Show the work',
    body: 'Research is published, methodology is documented, pricing is on the website. We compete on substance, not lock-in.'
  },
  {
    title: 'Coverage is the moat',
    body: 'The engines change every quarter. We add new ones within 30 days of launch, automatically, at no extra cost. That is the work.'
  }
] as const

export const leadership = [
  {
    name: 'Eva Reinhardt',
    role: 'CEO & Co-founder',
    bio: 'Previously led Growth Engineering at Stripe. Stanford CS. Has been writing about generative retrieval since GPT-3.'
  },
  {
    name: 'Daniel Park',
    role: 'CTO & Co-founder',
    bio: 'Previously Principal Engineer on Claude at Anthropic. MIT PhD in machine learning, with a focus on retrieval systems.'
  },
  {
    name: 'Sofia Mendes',
    role: 'VP Product',
    bio: 'Previously Director of Product at HubSpot. Built the original conversational AI surface and shipped four product lines from zero to one.'
  },
  {
    name: 'Marcus Webb',
    role: 'VP Customer Engineering',
    bio: 'Previously led Solutions Engineering at Intercom. Twelve years getting customer teams from pilot to production on every tool that mattered.'
  }
] as const

export const companyStats = [
  { value: '200+', label: 'Paying customers across SaaS, DTC, fintech, and enterprise' },
  { value: '1.8B+', label: 'Real consumer prompts in our dataset, refreshed daily' },
  { value: '$84M', label: 'Raised from Sequoia, Index Ventures, and Founders Fund' },
  { value: '62', label: 'People across San Francisco, New York, and London' }
] as const

// ---------------------------------------------------------------------------
// Compare page
// ---------------------------------------------------------------------------

export const compareCompetitors = [
  {
    slug: 'profound',
    name: 'Profound',
    tagline: 'Answer-engine monitoring focused on ChatGPT and Perplexity.',
    oneLineDiff:
      'Profound tracks three engines and ships a generic checklist. Clovion AI tracks ten engines and ships ranked fixes with drafted code and proof-of-lift tracking.'
  }
] as const

export const compareMatrix = {
  profound: [
    { row: 'AI engines tracked', clovion: '10 engines, all major surfaces', competitor: '3 engines (ChatGPT, Perplexity, Google AI)' },
    { row: 'Meta AI and DeepSeek coverage', clovion: 'Included on all paid plans', competitor: 'Not tracked' },
    { row: 'AI Overviews vs AI Mode', clovion: 'Tracked separately', competitor: 'Tracked together' },
    { row: 'Data source', clovion: 'Real consumer prompts, 1.8B+ dataset', competitor: 'Synthetic API queries' },
    { row: 'Refresh frequency', clovion: 'Daily on all paid plans', competitor: 'Weekly on most plans' },
    { row: 'GEO fix recommendations', clovion: 'Ranked by lift with drafted code', competitor: 'Generic SEO-style checklist' },
    { row: 'Before-and-after tracking', clovion: 'Built in on every shipped fix', competitor: 'Not available' },
    { row: 'Schema patches', clovion: 'Auto-generated, paste-ready', competitor: 'Not generated' },
    { row: 'Free tier', clovion: 'Yes, real visibility score in 24h', competitor: 'No, trial only' },
    { row: 'Starting price', clovion: '$99/mo on Starter', competitor: '$499/mo on entry tier' },
    { row: 'Crawler analytics (server logs)', clovion: 'Vercel, Cloudflare, CloudFront, Fastly', competitor: 'Not supported' },
    { row: 'MCP server for Claude/ChatGPT', clovion: 'Included on Growth and Enterprise', competitor: 'Not available' }
  ]
} as const

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export const blogCategories = [
  { slug: 'geo', label: 'GEO', desc: 'Generative engine optimization, fix patterns, and what actually moves citations.' },
  { slug: 'ai-search', label: 'AI Search', desc: 'How the major AI engines work, what they index, and how they decide who to cite.' },
  { slug: 'seo', label: 'SEO', desc: 'The overlap between classic SEO and GEO — what carries over, what does not.' }
] as const

export const blogPosts = [
  {
    slug: 'what-is-geo',
    title: 'What is GEO, really — and why traditional SEO will not save you',
    excerpt: 'Generative engine optimization is not SEO with new keywords. The retrieval mechanics are different, the citation signals are different, and the surface area is much wider.',
    category: 'geo',
    author: 'Eva Reinhardt',
    role: 'CEO, Clovion AI',
    date: '2026-06-02',
    readTime: '8 min',
    tag: 'Foundational'
  },
  {
    slug: 'chatgpt-vs-perplexity-citations',
    title: 'ChatGPT vs Perplexity: how each engine actually picks its citations',
    excerpt: 'We ran 12,000 prompts across both engines and mapped the source patterns. The signals overlap less than you would expect, and that is why coverage matters.',
    category: 'ai-search',
    author: 'Daniel Park',
    role: 'CTO, Clovion AI',
    date: '2026-05-21',
    readTime: '11 min',
    tag: 'Research'
  },
  {
    slug: 'schema-patches-that-move-citations',
    title: 'Seven schema patches that consistently move AI citations',
    excerpt: 'Most schema advice is generic SEO carryover. These seven patterns showed measurable lift across multiple engines in our customer base, with the before-and-after numbers.',
    category: 'geo',
    author: 'Sofia Mendes',
    role: 'VP Product, Clovion AI',
    date: '2026-05-14',
    readTime: '9 min',
    tag: 'Playbook'
  },
  {
    slug: 'ai-overviews-vs-ai-mode',
    title: 'AI Overviews vs AI Mode: the only difference that matters',
    excerpt: 'Google is rolling both out, and they behave very differently. Tracking them together obscures the signal. Here is how to separate them and why it changes your fix list.',
    category: 'ai-search',
    author: 'Marcus Webb',
    role: 'VP Customer Eng, Clovion AI',
    date: '2026-05-07',
    readTime: '7 min',
    tag: 'Engineering'
  },
  {
    slug: 'citation-paths-explained',
    title: 'Citation paths: the third-party signals that decide who AI cites',
    excerpt: 'Your own pages are only half the citation graph. The other half is which third-party sources mention you, with what framing, and on which authoritative domains.',
    category: 'geo',
    author: 'Alicia Tan',
    role: 'Head of GEO Research, Clovion AI',
    date: '2026-04-29',
    readTime: '10 min',
    tag: 'Research'
  },
  {
    slug: 'why-we-track-meta-ai',
    title: 'Why we track Meta AI when most competitors do not',
    excerpt: 'Meta AI now ships inside WhatsApp, Instagram, and Messenger. The share is small but the queries are different, and that difference is where coverage moats are built.',
    category: 'ai-search',
    author: 'Eva Reinhardt',
    role: 'CEO, Clovion AI',
    date: '2026-04-22',
    readTime: '6 min',
    tag: 'Opinion'
  },
  {
    slug: 'b2b-vs-dtc-prompts',
    title: 'How B2B prompts differ from DTC prompts in AI engines',
    excerpt: 'Buyer behavior diverges sharply by context. B2B prompts favor longer chains, more comparison, and a different mix of citation domains. Optimizing for one will not get you the other.',
    category: 'geo',
    author: 'Sofia Mendes',
    role: 'VP Product, Clovion AI',
    date: '2026-04-15',
    readTime: '8 min',
    tag: 'Research'
  },
  {
    slug: 'seo-to-geo-handoff',
    title: 'What carries over from SEO to GEO, and what absolutely does not',
    excerpt: 'There is real overlap. Content quality, internal linking, and authority signals matter on both sides. But keyword targeting, link velocity, and metadata tuning need a full rethink.',
    category: 'seo',
    author: 'Daniel Park',
    role: 'CTO, Clovion AI',
    date: '2026-04-08',
    readTime: '9 min',
    tag: 'Foundational'
  },
  {
    slug: 'crawler-analytics-with-vercel',
    title: 'Crawler analytics with Vercel logs: a step-by-step setup',
    excerpt: 'A short engineering walkthrough on piping Vercel access logs into Clovion AI so you can see exactly which AI bots are hitting which pages, at what rate, and with what user agents.',
    category: 'seo',
    author: 'Marcus Webb',
    role: 'VP Customer Eng, Clovion AI',
    date: '2026-03-30',
    readTime: '5 min',
    tag: 'Engineering'
  },
  {
    slug: 'measuring-geo-impact',
    title: 'How to measure GEO impact when AI traffic is hard to attribute',
    excerpt: 'Most analytics tools cannot tell you which sessions came from an AI engine. Here is the multi-method approach we use across our customer base, with the assumptions and limits.',
    category: 'geo',
    author: 'Eva Reinhardt',
    role: 'CEO, Clovion AI',
    date: '2026-03-22',
    readTime: '11 min',
    tag: 'Playbook'
  },
  {
    slug: 'the-zero-click-economy',
    title: 'The zero-click economy: 140M daily AI searches and where the traffic goes',
    excerpt: 'AI engines now answer hundreds of millions of buyer questions a day without a click. Here is what that means for funnel design, content strategy, and budget allocation.',
    category: 'ai-search',
    author: 'Sofia Mendes',
    role: 'VP Product, Clovion AI',
    date: '2026-03-15',
    readTime: '12 min',
    tag: 'Research'
  },
  {
    slug: 'fix-list-prioritization',
    title: 'How we prioritize GEO fixes by expected lift, not alphabetical order',
    excerpt: 'A look at the scoring model behind our fix list. The inputs, the weights, the calibration, and why the top fix in your list is rarely the one a generic SEO audit would surface.',
    category: 'geo',
    author: 'Daniel Park',
    role: 'CTO, Clovion AI',
    date: '2026-03-08',
    readTime: '10 min',
    tag: 'Engineering'
  }
] as const

// ---------------------------------------------------------------------------
// Changelog
// ---------------------------------------------------------------------------

export const changelogEntries = [
  {
    date: '2026-06-05',
    version: '2.14.0',
    title: 'DeepSeek tracking moves out of beta',
    description: 'Full daily refresh on DeepSeek across all paid plans. APAC coverage now matches the other nine engines.',
    tags: ['Engines', 'GA']
  },
  {
    date: '2026-05-22',
    version: '2.13.0',
    title: 'Auto-generated schema patches now ship as ready-to-paste diffs',
    description: 'Every schema fix in your list now includes a unified diff against your current markup, with paste-ready snippets for Sanity, Contentful, WordPress, and Webflow.',
    tags: ['GEO fixes', 'Improvement']
  },
  {
    date: '2026-05-08',
    version: '2.12.0',
    title: 'Side-by-side engine comparison view',
    description: 'A new view in the dashboard shows your performance across all 10 engines on the same query set, with deltas surfaced automatically.',
    tags: ['Dashboard', 'New']
  },
  {
    date: '2026-04-24',
    version: '2.11.0',
    title: 'MCP server now available on Growth',
    description: 'The Clovion AI MCP server lets Claude and ChatGPT query your visibility data directly. Previously Enterprise-only, now included on Growth.',
    tags: ['API', 'New']
  },
  {
    date: '2026-04-10',
    version: '2.10.0',
    title: 'Crawler analytics adds Fastly support',
    description: 'Vercel, Cloudflare, and CloudFront already shipped. Fastly log-drain joins the family with a 30-minute one-time setup.',
    tags: ['Integrations', 'New']
  },
  {
    date: '2026-03-27',
    version: '2.9.0',
    title: 'Before-and-after tracking now standard on every fix',
    description: 'Ship a fix from the dashboard and Clovion AI automatically tracks the visibility delta on the affected prompts for 14 days post-ship.',
    tags: ['GEO fixes', 'GA']
  },
  {
    date: '2026-03-13',
    version: '2.8.0',
    title: 'Google AI Mode tracked separately from AI Overviews',
    description: 'Google is rolling out two distinct AI surfaces. We now track them in isolation so you can see which is driving the bigger shift in your traffic.',
    tags: ['Engines', 'Improvement']
  },
  {
    date: '2026-02-27',
    version: '2.7.0',
    title: 'Free tier now includes top 10 prioritized fixes',
    description: 'The free score now ships with the same fix prioritization engine the paid tiers use, limited to the top 10. No card, no trial timer.',
    tags: ['Pricing', 'New']
  }
] as const

// ---------------------------------------------------------------------------
// Integrations (16 names, kept as a flat list)
// ---------------------------------------------------------------------------

export const integrations = [
  'GA4',
  'Search Console',
  'HubSpot',
  'Salesforce',
  'Segment',
  'Shopify',
  'WordPress',
  'Sanity',
  'Contentful',
  'Webflow',
  'Notion',
  'Slack',
  'Vercel',
  'Cloudflare',
  'CloudFront',
  'Fastly'
] as const

// ---------------------------------------------------------------------------
// AI engines (string array, kept for backwards compatibility)
// ---------------------------------------------------------------------------

export const aiEngines = [
  'ChatGPT',
  'Claude',
  'Perplexity',
  'Gemini',
  'Grok',
  'Copilot',
  'Meta AI',
  'DeepSeek',
  'AI Overviews',
  'AI Mode'
] as const

// ---------------------------------------------------------------------------
// Offices, contact paths, research (kept for legacy pages)
// ---------------------------------------------------------------------------

export const offices = [
  { city: 'San Francisco', label: 'HQ', address: '548 Market Street, San Francisco, CA 94104' },
  { city: 'New York', label: '', address: '11 Madison Avenue, New York, NY 10010' },
  { city: 'London', label: '', address: '70 Wilson Street, London EC2A 2DB' }
] as const

export const contactPaths = [
  { name: 'Sales', email: 'sales@clovion.ai', desc: 'Evaluations, custom plans, and enterprise procurement. We usually reply same day.' },
  { name: 'Support', email: 'support@clovion.ai', desc: 'For active customers who need a hand with their deployment. Same-day on Growth and Enterprise.' },
  { name: 'Partnerships', email: 'partners@clovion.ai', desc: 'For agencies, integrators, and ecosystem partners. Includes our referral program.' },
  { name: 'Press & Research', email: 'press@clovion.ai', desc: 'Media inquiries, research collaborations, and speaker requests.' },
  { name: 'Security', email: 'security@clovion.ai', desc: 'Responsible disclosure, security questionnaires, and compliance docs.' },
  { name: 'Careers', email: 'careers@clovion.ai', desc: 'Open roles, hiring questions, and university recruiting.' }
] as const

export const research = [
  {
    title: 'The Zero-Click Economy Report',
    description: 'How 140M daily AI searches are reshaping the funnel, and what that means for marketing budgets in 2026.',
    date: 'May 2026',
    tag: 'Research'
  },
  {
    title: 'Sentiment Drift Study',
    description: 'How AI models shift their characterization of brands quarter over quarter, and what causes the swings.',
    date: 'April 2026',
    tag: 'Research'
  },
  {
    title: 'The GEO Content Playbook',
    description: 'Every signal we have found that correlates with citations across the top five AI engines, with methodology.',
    date: 'April 2026',
    tag: 'Playbook'
  },
  {
    title: 'B2B vs DTC AI Behavior',
    description: 'How AI buying patterns differ between business and consumer contexts, and what to optimize for each.',
    date: 'March 2026',
    tag: 'Research'
  },
  {
    title: 'How we train retrieval rerankers',
    description: 'The architecture behind clovion-rerank-2: why we moved off cross-encoders and what we replaced them with.',
    date: 'February 2026',
    tag: 'Engineering'
  },
  {
    title: 'Citation path benchmarks across ten engines',
    description: 'A side-by-side eval of which third-party domains move citations on which engines, with the raw numbers.',
    date: 'January 2026',
    tag: 'Engineering'
  }
] as const

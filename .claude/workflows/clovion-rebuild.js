export const meta = {
  name: 'clovion-rebuild',
  description: 'Full Clovion AI rebuild — new structure, B&W brand, 21 pages built per researched plan',
  phases: [
    { title: 'Research', detail: '4 parallel agents — GEO competitors, B&W design, blog/docs/pricing patterns, free-tool patterns' },
    { title: 'Plan', detail: 'Synthesize research into a structured page-by-page plan' },
    { title: 'Foundation A: tokens + content', detail: 'Update tailwind, globals.css, lib/content.ts in parallel' },
    { title: 'Foundation B: components', detail: 'Update ui.tsx + sections.tsx + Header + Footer + Hero + SpotlightCard in parallel' },
    { title: 'Pages', detail: '21 page agents in parallel — each builds one route' },
    { title: 'Cleanup', detail: 'Delete legacy routes and verify build' }
  ]
}

const ROOT = '/Users/sohamsarker/Clovion AI/site'

const VOICE = `Voice: humanized, confident, no AI-startup jargon. Avoid "leverage", "unlock", "operating system", "closed loop", "the only X built for Y". Vary sentence length. Hero leads ~14-20 words. Section leads 20-25 words. Trust the reader; concrete numbers over abstractions. Brand: Clovion AI. Category: AI Visibility / GEO (Generative Engine Optimization). Features: AI Visibility Tracking, GEO Improvement Suggestions, Platform Coverage. Only marketing CTA is "Start free trial" or "Get free score" — never "View demo" or "Book a demo". Sales CTA "Talk to sales" is fine in pricing/enterprise context.`

const BRAND = `STRICT B&W BRAND BOOK. ZERO purple/violet/iris/chromatic accent. Palette:
- Body bg: cream #FAFAF7 (with white surfaces) OR pure white
- Ink (text): #0a0a0f (near-black)
- Subtle bg: #F5F3EF
- Line: #eceae5
- Mid grays: tailwind neutral-200..700 (use them deliberately)
- No purple-* utilities anywhere. Replace with: ink, ink/80, ink/70, ink/60, ink/50, ink/40, ink/20, ink/10, black, neutral-*
- Buttons: primary = solid black bg + white text; secondary = subtle gray bg + ink text; ghost = transparent + ink text; invert (for dark surfaces) = white bg + black text
- Distinctiveness comes from typography, density, surface contrast, dot-grid textures, and motion — NEVER color
- Gradients allowed but ONLY monochrome (black → mid-gray → light-gray). E.g. from-black via-neutral-700 to-neutral-400
- Light theme only. Never dark mode.`

const COMPONENTS = `Available components (already updated to B&W in Foundation phases):
From '@/components/ui':
  Container, Section (props: id, tight, bg='subtle'|'ink', className)
  Button (variant='primary'|'secondary'|'ghost'|'invert', size='sm'|'md'|'lg', href)
  Card, Eyebrow, Tag, HaloMark, ArrowRight, Check, HairlineDivider, GradientOrb
From '@/components/sections':
  LogoMarquee, FAQ, CTABanner, StatStrip, FeatureGrid, TestimonialRail, AIEngineStrip
From '@/components/Hero':
  HomeHero (only on '/')
From '@/components/SpotlightCard':
  SpotlightCard (wraps premium cards)
Utilities (globals.css): .display-xl/lg/md/sm, .lead, .eyebrow, .card, .section-y / .section-y-sm / .section-y-xl, .grid-bg, .gradient-mask-edges, .code-block, .tag, .hairline
Import paths use the @/ alias.`

// ====================================================================
// PHASE 1 — Research
// ====================================================================
phase('Research')

const research = await parallel([
  () => agent(`Use WebSearch + WebFetch to study these GEO/AEO/AI search visibility companies' marketing sites:
- Profound (tryprofound.com)
- Otterly.ai
- Peec AI (peec.ai)
- AthenaHQ (athenahq.ai)
- Bluefish AI
- Searchable
- Conductor
- BrightEdge

For 4-5 of them, fetch their homepage and feature pages. Examine: structure, hero pattern, feature presentation, pricing UX, comparison pages, free-tool patterns, blog/docs structure, typography, color/accent choices, motion.

Report in markdown (≤1500 words):
1. Hero patterns common to GEO/AEO leaders (what they emphasize)
2. Features page layouts that work
3. Pricing models in this category
4. Comparison/alternatives page patterns (vs Brand X pages)
5. Free tool landing patterns
6. Blog/docs UI patterns
7. Top 3 design lessons we can borrow
Keep findings concrete with examples and URLs. Don't speculate — report what you actually saw.`, { label: 'research:geo-competitors' }),

  () => agent(`Use WebFetch to study these B&W / monochrome design websites:
- linear.app
- vercel.com
- resend.com
- plain.com
- anthropic.com
- replit.com
- 37signals.com
- railway.com
- tailwindcss.com
- ramp.com

For 5-6 of them, examine: typography, spacing density, texture/grain/dot-grid use, hero patterns (bento, single-column, gradient mesh), surface contrast, motion language, how they create distinction without chromatic accents.

Report in markdown (≤1500 words):
1. Top patterns for B&W distinction
2. Typography systems that hold up (font families, sizes, weights, tracking)
3. Surface and texture techniques (cards, dividers, grids)
4. Motion and microinteraction patterns
5. Specific UI patterns we should steal for Clovion
6. Concrete recommended design tokens for our B&W system
Keep findings concrete. Mention specific URLs.`, { label: 'research:bw-design' }),

  () => agent(`Use WebFetch to study best-in-class SaaS pages for blog, docs, comparison, pricing, changelog. Fetch a sample from each:
- Blog index: ghost.org/blog OR sanity.io/blog OR vercel.com/blog OR posthog.com/blog
- Docs: stripe.com/docs OR vercel.com/docs OR supabase.com/docs
- Comparison: linear.app/compare OR notion.so/vs-* OR retool.com/vs-*
- Pricing: linear.app/pricing OR resend.com/pricing OR vercel.com/pricing
- Changelog: linear.app/changelog OR vercel.com/changelog
- Customers/case studies: figma.com/customers OR stripe.com/customers

Report in markdown (≤1500 words):
1. Blog index layouts (hero, categories, post cards, featured posts)
2. Blog category page patterns (filters, post listing, sidebar)
3. Docs landing page + getting-started page patterns (sidebar nav, search, content density)
4. Comparison page layouts (table-heavy vs narrative)
5. Free tool form + result patterns
6. Changelog feed patterns (timeline, version pills, tags)
7. Pricing tier card patterns (3-4 tier comparisons)
8. Customers / case study patterns
Be specific. Cite URLs.`, { label: 'research:saas-patterns' }),

  () => agent(`Use WebFetch to study landing pages for free analyzer / score tools:
- ahrefs.com/free-seo-tools
- hubspot.com/website/website-grader (or hubspot.com/marketing/website-grader)
- moz.com (any free tool)
- semrush.com/free-tools
- Look at GEO-specific free score tools if any (try profound's, otterly's free tools)

Report in markdown (≤1000 words):
1. Best landing patterns for free analyzer tools (above the fold, single-CTA?)
2. Input form patterns (single field vs multi-step, autocomplete, examples)
3. Loading / "analyzing" state patterns
4. Result display patterns (score gauge, breakdown, recommendations)
5. Lead-capture timing (gated vs ungated)
6. A recommended layout for our Clovion "Free AI Visibility Score" page including:
   - Hero copy direction
   - Form spec (what fields)
   - Mock result shape (overall score 0-100, 4 sub-scores, 3 recommendations)
   - Conversion path (after result, what's the upgrade CTA)
Be specific.`, { label: 'research:free-tools' })
])

const researchBundle = research.filter(Boolean).join('\n\n=====RESEARCH SECTION=====\n\n')
log('Research complete: ' + researchBundle.length + ' chars across ' + research.filter(Boolean).length + ' agents')

// ====================================================================
// PHASE 2 — Plan synthesis (structured per-page output)
// ====================================================================
phase('Plan')

const PLAN_SCHEMA = {
  type: 'object',
  required: ['designSystem', 'header', 'footer', 'pages'],
  additionalProperties: false,
  properties: {
    designSystem: {
      type: 'string',
      description: 'Markdown describing typography scale, B&W color ramp, spacing scale, motion language, signature visual moves (dot grids, scan lines, etc), card / surface conventions'
    },
    header: {
      type: 'string',
      description: 'Markdown describing the Header — nav structure (Features dropdown + simple links: Pricing, Customers, Free Score, Blog, Docs, Compare), mobile pattern, dual CTA pattern (Start free trial + secondary Get free score)'
    },
    footer: {
      type: 'string',
      description: 'Markdown describing 4-column footer: Product / Resources / Company / Legal, plus brand block + socials, bottom bar with copyright'
    },
    pages: {
      type: 'object',
      required: [
        'home', 'features-hub', 'feature-tracking', 'feature-suggestions', 'feature-coverage',
        'pricing', 'blog-index', 'blog-geo', 'blog-ai-search', 'blog-seo',
        'compare-hub', 'compare-profound', 'alt-profound',
        'customers', 'docs-hub', 'docs-getting-started',
        'free-tool', 'about', 'changelog', 'privacy', 'terms'
      ],
      additionalProperties: false,
      properties: {
        'home':                  { type: 'string' },
        'features-hub':          { type: 'string' },
        'feature-tracking':      { type: 'string' },
        'feature-suggestions':   { type: 'string' },
        'feature-coverage':      { type: 'string' },
        'pricing':               { type: 'string' },
        'blog-index':            { type: 'string' },
        'blog-geo':              { type: 'string' },
        'blog-ai-search':        { type: 'string' },
        'blog-seo':              { type: 'string' },
        'compare-hub':           { type: 'string' },
        'compare-profound':      { type: 'string' },
        'alt-profound':          { type: 'string' },
        'customers':             { type: 'string' },
        'docs-hub':              { type: 'string' },
        'docs-getting-started':  { type: 'string' },
        'free-tool':             { type: 'string' },
        'about':                 { type: 'string' },
        'changelog':             { type: 'string' },
        'privacy':               { type: 'string' },
        'terms':                 { type: 'string' }
      }
    }
  }
}

const plan = await agent(`You are an expert frontend/UX architect designing the rebuild of Clovion AI — a strictly B&W, GEO/AEO category-leading marketing site.

# Research findings to synthesize from
${researchBundle}

# Brand & voice constraints
${VOICE}

# Visual constraints (NON-NEGOTIABLE)
${BRAND}

# Site structure (NON-NEGOTIABLE — exactly these 21 routes)
- / (home)
- /features, /features/ai-visibility-tracking, /features/geo-improvement-suggestions, /features/platform-coverage
- /pricing
- /blog, /blog/category/geo, /blog/category/ai-search, /blog/category/seo
- /compare, /compare/clovion-vs-profound, /alternatives/profound
- /customers
- /docs, /docs/getting-started
- /free-ai-visibility-score
- /about
- /changelog
- /legal/privacy, /legal/terms

# Components available to page authors (do NOT redesign these — just compose with them)
${COMPONENTS}

# Your output (structured per the schema)
Produce a comprehensive plan. For EACH of the 21 pages, write ~250-400 words covering:
1. Hero — exact headline + lead copy (3-12 words headline, 14-25 words lead) + which CTAs
2. Section list in order — each section's purpose, components used, signature visual
3. The page's signature visual/interactive move (one thing that's memorable)
4. Specific data the page needs (what to pull from content.ts vs hardcode)
5. Don't generate code; describe structure and copy direction

For the FREE TOOL page especially, spec out: input form fields, "analyzing" state, result shape (overall score, 4 sub-scores, 3 fix suggestions), conversion path.

For the design system field, specify: type scale uses, exact B&W tokens, density philosophy, motion language, signature texture moves.

Use a confident, distinctive voice. Lean into the GEO/AEO category positioning. Avoid generic SaaS landing patterns.`, { schema: PLAN_SCHEMA })

log('Plan synthesized: ' + Object.keys(plan.pages).length + ' pages specd')

// ====================================================================
// PHASE 3 — Foundation A: design tokens + content (parallel)
// ====================================================================
phase('Foundation A: tokens + content')

await parallel([
  () => agent(`Strip every purple/violet reference from the design tokens and replace with strictly monochrome B&W equivalents.

# Files to edit (use full absolute paths)
1. ${ROOT}/tailwind.config.ts
2. ${ROOT}/app/globals.css

# Design system spec from plan
${plan.designSystem}

# Constraints
${BRAND}

# tailwind.config.ts — required changes
- REMOVE the entire purple: { 50..900 } object from colors{}
- Keep bg, ink, muted, subtle, line
- Add a neutral ramp if useful — but Tailwind already ships neutral-50..900, so prefer that
- Update boxShadow.focus: change rgba(91,33,182,0.18) to rgba(10,10,15,0.15)
- Keep all typography/animation/keyframes
- Keep borderRadius, container config

# globals.css — required changes
- Remove --purple-500, --purple-700, --purple-800 vars
- Update --gradient-hero: replace purple gradients with a soft gray radial: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(10,10,15,0.06) 0%, rgba(10,10,15,0.02) 30%, transparent 70%)
- ::selection bg: rgba(91,33,182,0.18) → rgba(10,10,15,0.10)
- .eyebrow color: var(--purple-800) → var(--ink)
- .eyebrow-dot::before: bg var(--purple-700) → var(--ink); shadow rgba(91,33,182,0.12) → rgba(10,10,15,0.10)
- .card:hover border-color: rgba(91,33,182,0.10) → rgba(10,10,15,0.10)
- .spotlight-overlay radial: rgba(91,33,182,0.10) → rgba(10,10,15,0.08)
- .btn-purple: REPLACE this rule with .btn-invert: background: #ffffff; color: var(--ink); border: 1px solid var(--ink). Hover: background: #f5f5f5; transform: translateY(-1px)
- .metric-glow::after: linear-gradient(90deg, var(--ink), rgba(10,10,15,0.3))
- .code-block: keep dark bg #0c0a18. Change token colors to monochrome ramp:
    .k { color: #e7e5e4; }
    .s { color: #d6d3d1; }
    .c { color: #78716c; }
    .p { color: #f5f5f4; }
    .n { color: #fafaf9; }

After your edits, the project should compile with ZERO purple references in these two files. Verify with a grep.

Use Edit tool for precise changes. Read each file first to ensure exact match. Report what changed.`, { label: 'foundation:tokens' }),

  () => agent(`Rewrite ${ROOT}/lib/content.ts completely to support the new site structure.

# New nav structure (must include exactly)
\`\`\`ts
export const nav = {
  primary: [
    {
      label: 'Features',
      href: '/features',
      children: [
        { label: 'AI Visibility Tracking', href: '/features/ai-visibility-tracking', desc: 'See how ChatGPT, Claude, Gemini, and Perplexity describe your brand' },
        { label: 'GEO Improvement Suggestions', href: '/features/geo-improvement-suggestions', desc: 'Concrete fixes that make AI engines cite you more often' },
        { label: 'Platform Coverage', href: '/features/platform-coverage', desc: 'One dashboard. Every major AI search surface.' }
      ]
    },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Customers', href: '/customers' },
    { label: 'Compare', href: '/compare' },
    { label: 'Blog', href: '/blog' },
    { label: 'Docs', href: '/docs' }
  ]
}
\`\`\`

# Required exports
- brand: { name: 'Clovion AI', tagline (20-30 words focused on AI visibility/GEO), pitch (60-90 words), email: { sales, support, partners, press, security, careers } }
- nav (above)
- features = 3 main features (id: 'tracking' | 'suggestions' | 'coverage') each with name, tagline, description, bullets[5]
- platforms = 10 AI engines with name, marketShare, status, desc
- customers = ['Linear', 'Ramp', 'Notion', 'Vercel', 'Loom', 'Figma', 'Brex', 'Webflow']
- customerStories = 3 featured stories with company, headline, body, metric, metricLabel
- homeMetrics = 4 stats focused on visibility outcomes
- testimonials = 9 entries, each 20-28 words, focused on AI visibility / GEO outcomes, with author + role + company
- pricingTiers = 4 tiers: Free, Starter $99/mo, Growth $399/mo, Enterprise Custom. Growth is highlight: true. Each has 6-9 features and a CTA.
- addOns = 2-3 add-ons (extra prompts, API access, white-label)
- faqs = 10 FAQs covering: differentiator vs SEO tools, which engines tracked, free score how it works, how data is collected, time to value, security/SOC2, integrations, technical team required, vs Profound, pricing model
- principles = 4 entries (title, body)
- leadership = 4 entries: Eva Reinhardt CEO, Daniel Park CTO, Sofia Mendes VP Product, Marcus Webb VP Customer Eng
- companyStats = 4 stats
- compareCompetitors = [{ slug: 'profound', name: 'Profound', tagline, oneLineDiff }]
- compareMatrix = { profound: [{ row, clovion, competitor }, ...12 rows] }
- blogCategories = 3 (geo, ai-search, seo)
- blogPosts = 12 mock posts with { slug, title, excerpt, category, author, role, date, readTime, tag }
- changelogEntries = 8 mock entries with { date, version, title, description, tags }
- docsSections = 5-6 sections each with title + items[] (item: { label, href })
- integrations = 16 integration names
- aiEngines = 10 engine names (string array)
- offices = 3 offices

# Voice for copy
${VOICE}

# Notes
- The brand has shifted from "all-in-one customer engagement" to "AI visibility & GEO toolkit". Remove agent-pricing, helpdesk, support-volume claims. Keep visibility-focused outcomes.
- Customers (Linear, Ramp, etc.) stay
- Testimonials should be NEW, focused on AI visibility / GEO outcomes. 20-28 words each.

Write the complete new file. Use TypeScript, export const, \`as const\` where it helps inference. Don't break any existing imports.`, { label: 'foundation:content' })
])

log('Foundation A done')

// ====================================================================
// PHASE 4 — Foundation B: components (parallel)
// ====================================================================
phase('Foundation B: components')

await parallel([
  () => agent(`Update ${ROOT}/components/ui.tsx and ${ROOT}/components/SpotlightCard.tsx to fully remove purple and use strictly B&W.

${BRAND}

# Changes to ui.tsx
- Button variants: keep 'primary' | 'secondary' | 'ghost' as-is. CHANGE 'purple' → 'invert' (white bg + black text + 1px black border, uses .btn-invert class from globals.css). Update the cn() classes:
  variant === 'invert' && 'btn-invert'
- GradientOrb: change bg gradient from purple to ink:
  bg-[radial-gradient(closest-side,rgba(10,10,15,0.10),rgba(10,10,15,0.04),transparent_75%)]
- HaloMark logo: replace gradient stops:
    <stop offset="0" stopColor="#0a0a0f" />
    <stop offset="1" stopColor="#737373" />
- Keep Container, Section, Eyebrow, Tag, Card, ArrowRight, Check, HairlineDivider unchanged structurally
- Add to TypeScript the new variant in ButtonProps type union

# Changes to SpotlightCard.tsx
- Check if it has hardcoded purple — if so, replace with ink. The spotlight gradient is in globals.css (.spotlight-overlay) and already updated in Foundation A. The component itself only manages mouse-move state. Verify it has no inline purple colors.

Read each file before editing. Output full file content via Write tool if rewriting.`, { label: 'foundation:ui' }),

  () => agent(`Update ${ROOT}/components/sections.tsx to remove all purple and use strictly B&W. Preserve all section signatures, the scroll-snap rail logic, FAQ accordion, and motion patterns.

${BRAND}
${COMPONENTS}

# Specific changes
- LogoMarquee: no purple — fine as-is
- AIEngineStrip: no purple — fine as-is
- FAQ:
  - Plus-icon open state: bg-purple-800 text-white rotate-45 border-purple-800 → bg-ink text-white rotate-45 border-ink
  - Hover ring: hover:border-purple-300 → hover:border-ink/20
- CTABanner:
  - Radial: rgba(91,33,182,0.18) → rgba(10,10,15,0.18)
  - Eyebrow color: text-purple-300 → text-white/70
  - Button variant: variant="purple" → variant="invert"
- StatStrip:
  - Hover bg gradient: hover:from-purple-50/40 → hover:from-subtle/60
  - text-purple-800 on metric → text-ink
  - metric-glow underline gradient is in globals.css already updated to black→gray
- FeatureGrid:
  - Icon bg: bg-purple-50 → bg-subtle
  - Icon text: text-purple-800 → text-ink
  - Icon border: border-purple-100 → border-line
  - Hover border: hover:border-purple-300 → hover:border-ink/20
- TestimonialPullQuote (legacy, still defined):
  - Quote mark: text-purple-200/50 → text-ink/10
  - Avatar gradient: from-purple-300 via-purple-600 to-ink → from-neutral-300 via-neutral-500 to-ink
- TestimonialRail:
  - Quote icon: text-purple-200 → text-ink/15
  - Active dot bg: bg-purple-700 → bg-ink
  - Hover inactive: hover:bg-ink/40 stays

Read the file first. Output the full rewrite via Write tool. Keep all imports, types, and behavior intact.`, { label: 'foundation:sections' }),

  () => agent(`Rewrite ${ROOT}/components/Header.tsx for the new nav structure and B&W brand.

${VOICE}
${BRAND}

# Requirements
- 'use client' (uses state/effects)
- Sticky header that gains blur+border on scroll (pattern already exists)
- Pull nav from \`@/lib/content\` (nav.primary)
- Mega-menu dropdown ONLY for "Features" (the only item with children). All other items are simple Links.
- Dropdown: 480px wide, 3 children rows, each with label + desc. Right-aligned arrow icon that fades in on hover (now in text-ink not text-purple).
- Hover-to-open dropdown (existing pattern).
- Mobile: hamburger → drawer with all nav items + 2 CTAs.
- CTAs on desktop (right side):
  - Secondary: "Get free score" → /free-ai-visibility-score (variant="ghost" or "secondary")
  - Primary: "Start free trial" → /pricing
- Replace any text-purple-800 / bg-purple-50 / hover:bg-purple-* / animate-pulse on purple dot with ink-based equivalents.
- "Sign in" link: remove it from header (no /contact route anymore).
- The dropdown arrow icon at end of each child row: text-purple-800 → text-ink
- Mobile drawer "Sign in" button: REMOVE (no /contact). Just "Start free trial" and "Get free score".

Read current Header.tsx, then output the full rewrite via Write tool.`, { label: 'foundation:header' }),

  () => agent(`Rewrite ${ROOT}/components/Footer.tsx for new structure and B&W brand.

${BRAND}

# 4 footer columns
\`\`\`
{ title: 'Product', links: [
  { label: 'Features', href: '/features' },
  { label: 'AI Visibility Tracking', href: '/features/ai-visibility-tracking' },
  { label: 'GEO Suggestions', href: '/features/geo-improvement-suggestions' },
  { label: 'Platform Coverage', href: '/features/platform-coverage' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Free AI Visibility Score', href: '/free-ai-visibility-score' }
]},
{ title: 'Resources', links: [
  { label: 'Blog', href: '/blog' },
  { label: 'GEO', href: '/blog/category/geo' },
  { label: 'AI Search', href: '/blog/category/ai-search' },
  { label: 'SEO', href: '/blog/category/seo' },
  { label: 'Docs', href: '/docs' },
  { label: 'Getting Started', href: '/docs/getting-started' },
  { label: 'Changelog', href: '/changelog' }
]},
{ title: 'Company', links: [
  { label: 'About', href: '/about' },
  { label: 'Customers', href: '/customers' },
  { label: 'Compare', href: '/compare' },
  { label: 'vs Profound', href: '/compare/clovion-vs-profound' },
  { label: 'Profound alternatives', href: '/alternatives/profound' }
]},
{ title: 'Legal', links: [
  { label: 'Privacy', href: '/legal/privacy' },
  { label: 'Terms', href: '/legal/terms' }
]}
\`\`\`

# Style changes
- Link hovers: hover:text-purple-800 → hover:text-ink (with underline)
- SocialLink hover: hover:border-purple-300 hover:text-purple-800 → hover:border-ink/30 hover:text-ink
- Keep social icons (X, LinkedIn, GitHub)
- Bottom bar: replace hardcoded /privacy /terms /security /dpa links with: © year + a tiny line of links (Privacy → /legal/privacy, Terms → /legal/terms, Security → /docs, DPA → /docs)
- Footer bg stays bg-subtle

Read current Footer.tsx, output full rewrite via Write tool.`, { label: 'foundation:footer' }),

  () => agent(`Rewrite ${ROOT}/components/Hero.tsx for the new GEO/AEO positioning and strict B&W brand.

${VOICE}
${BRAND}

# Hero copy (use this exact frame, refine if needed)
- Pill (top): "New in 2.6 — Platform coverage expanded to 10 engines" + a link "Read changelog" → /changelog. Dot color: bg-ink (not purple). Link color: text-ink.
- Headline (display-xl, two-line, last line uses MONOCHROME gradient):
  Line 1: "See how AI describes your brand."
  Line 2: "Fix what's holding you back." — wrap in span with className "bg-gradient-to-br from-black via-neutral-700 to-neutral-400 bg-clip-text text-transparent"
- Lead (subtitle): "Track your brand mentions across ChatGPT, Perplexity, Gemini, and AI Overviews. Get the fixes that actually move the needle."
- CTAs row:
  - Button variant="primary" size="lg" href="/pricing" → "Start free trial"
  - Button variant="secondary" size="lg" href="/free-ai-visibility-score" → "Get free score"
- Reassurance line: "14-day free trial · No credit card · Set up in under 5 minutes"

# HeroBento product mock
- Top chrome: "Workspaces / Clovion AI / Visibility" stays
- Avatar/notification dot top-right: bg-purple-700 → bg-ink
- Body — keep the structure but adjust colors:
  - Sidebar active item dot: bg-purple-700 → bg-ink
  - Big metric: text-ink (unchanged)
  - "↑ 6.2 pts" pill stays emerald (semantic color for positive change is OK to keep)
  - Bar chart peak bar: bg-purple-800 → bg-ink (rest stay bg-ink/60)
  - Callout arrow path stroke: rgba(91,33,182,0.8) → rgba(10,10,15,0.6)
  - Engine breakdown rows: change column data text-purple-800 → text-ink
- 5 engines list: ChatGPT, Claude, Perplexity, Gemini, AI Overviews — same data, no color change needed

Read the file. Output the full rewrite via Write tool. Keep all animation logic, IntersectionObserver, reduced-motion handling intact.`, { label: 'foundation:hero' })
])

log('Foundation B done — ready for pages')

// ====================================================================
// PHASE 5 — Pages (21 agents in parallel)
// ====================================================================
phase('Pages')

const PAGES = [
  { id: 'home', file: 'app/page.tsx', clientNeeded: false },
  { id: 'features-hub', file: 'app/features/page.tsx', clientNeeded: false },
  { id: 'feature-tracking', file: 'app/features/ai-visibility-tracking/page.tsx', clientNeeded: false },
  { id: 'feature-suggestions', file: 'app/features/geo-improvement-suggestions/page.tsx', clientNeeded: false },
  { id: 'feature-coverage', file: 'app/features/platform-coverage/page.tsx', clientNeeded: false },
  { id: 'pricing', file: 'app/pricing/page.tsx', clientNeeded: false },
  { id: 'blog-index', file: 'app/blog/page.tsx', clientNeeded: false },
  { id: 'blog-geo', file: 'app/blog/category/geo/page.tsx', clientNeeded: false },
  { id: 'blog-ai-search', file: 'app/blog/category/ai-search/page.tsx', clientNeeded: false },
  { id: 'blog-seo', file: 'app/blog/category/seo/page.tsx', clientNeeded: false },
  { id: 'compare-hub', file: 'app/compare/page.tsx', clientNeeded: false },
  { id: 'compare-profound', file: 'app/compare/clovion-vs-profound/page.tsx', clientNeeded: false },
  { id: 'alt-profound', file: 'app/alternatives/profound/page.tsx', clientNeeded: false },
  { id: 'customers', file: 'app/customers/page.tsx', clientNeeded: false },
  { id: 'docs-hub', file: 'app/docs/page.tsx', clientNeeded: false },
  { id: 'docs-getting-started', file: 'app/docs/getting-started/page.tsx', clientNeeded: false },
  { id: 'free-tool', file: 'app/free-ai-visibility-score/page.tsx', clientNeeded: true },
  { id: 'about', file: 'app/about/page.tsx', clientNeeded: false },
  { id: 'changelog', file: 'app/changelog/page.tsx', clientNeeded: false },
  { id: 'privacy', file: 'app/legal/privacy/page.tsx', clientNeeded: false },
  { id: 'terms', file: 'app/legal/terms/page.tsx', clientNeeded: false }
]

await parallel(PAGES.map(p => () => agent(`Build a Next.js App Router page at ${ROOT}/${p.file}.

# Page plan (your blueprint — follow this)
${plan.pages[p.id]}

# Site-wide constraints
${VOICE}

${BRAND}

${COMPONENTS}

# Implementation rules
- File path (absolute): ${ROOT}/${p.file}
- Default-export a React component named in PascalCase (e.g. export default function HomePage() {...})
- Export const metadata with title (ends "| Clovion AI") and description (140-160 chars, descriptive)
- ${p.clientNeeded ? "MUST start with 'use client' (this page needs interactivity). NOTE: 'use client' files cannot export metadata. For this client page, DO NOT export metadata — title/description will be inferred. Or split: create a server component wrapper page.tsx that imports a client child. Simplest: this is a client page, no metadata export." : "Prefer server component. Only add 'use client' if you genuinely need state/effects."}
- Imports:
  - From '@/components/ui': Section, Container, Button, Card, Eyebrow, Tag, ArrowRight, Check, HaloMark
  - From '@/components/sections': LogoMarquee, FAQ, CTABanner, StatStrip, FeatureGrid, TestimonialRail, AIEngineStrip
  - From '@/components/Hero': HomeHero (only on homepage)
  - From '@/components/SpotlightCard': SpotlightCard (optional, for featured cards)
  - From '@/lib/content': pull data (e.g. import { features, customers, testimonials, pricingTiers, faqs, blogCategories, blogPosts, changelogEntries, docsSections, platforms, compareCompetitors, compareMatrix, customerStories, principles, leadership, companyStats, addOns, integrations } from '@/lib/content')
  - From 'next/link': Link for internal navigation
  - useState/useEffect from 'react' only if 'use client'
- TypeScript: NO type annotations like : string[] outside of component prop types. Don't import types you don't have.
- No purple anywhere. Replace any tempted purple-* with ink, neutral-, or subtle.
- Buttons: variant="primary"|"secondary"|"ghost"|"invert" — use "invert" on dark sections.
- Typography: use the .display-xl/lg/md/sm and .lead utility classes.
- Section padding: .section-y (default), .section-y-xl for signature moments, .section-y-sm for tight.
- For decorative elements: use ink/grayscale only. Dot-grid background (.grid-bg) is OK for hero.
- For images: don't include real images. Use SVG placeholders, gradients, or rendered text mocks.
- CTAs: marketing CTA is "Start free trial" (→ /pricing). Free score CTA "Get free score" (→ /free-ai-visibility-score). Sales CTA "Talk to sales" allowed in pricing/enterprise context (→ /pricing#enterprise).

# Output
Use the Write tool to create the file at the path above. Generate ONE complete, working .tsx file. Don't include placeholders like "..." — write real copy. Aim for 200-450 lines depending on page complexity. Make it feel premium and distinctive.

# Validation before you finish
- Imports compile (only from listed paths)
- No purple-* in classNames
- No undefined components or data fields (if a content field isn't certain, hardcode the data inline at the top of your file as a const)
- 'use client' first line if needed
- All href links go to routes that exist in the 21-route structure`,
  { label: 'page:' + p.id }
)))

log('Built ' + PAGES.length + ' pages')

// ====================================================================
// PHASE 6 — Cleanup + verify
// ====================================================================
phase('Cleanup')

await agent(`Final cleanup and build verification.

# Step 1: Delete legacy routes
Run these commands (each removes a directory that no longer fits the new structure):
\`\`\`
rm -rf "${ROOT}/app/product"
rm -rf "${ROOT}/app/solutions"
rm -rf "${ROOT}/app/resources"
rm -rf "${ROOT}/app/contact"
\`\`\`

# Step 2: Sanity-check for any leftover purple references that would break things
\`\`\`
cd "${ROOT}" && grep -rn "purple-" app components lib --include="*.tsx" --include="*.ts" --include="*.css" | head -20
\`\`\`
If any purple-* references appear in pages/components/css, replace them with ink/neutral equivalents using Edit tool. Don't touch the brand 'Clovion' or unrelated words.

# Step 3: Run the build
\`\`\`
cd "${ROOT}" && npm run build 2>&1 | tail -120
\`\`\`

# Step 4: If build fails
- Read the failing file
- Fix the specific error (missing import, type error, syntax)
- Re-run build
- Repeat up to 3 times

# Step 5: Report
Summarize:
- Directories deleted
- Purple references found/cleaned (count)
- Build status: PASS or FAIL
- If FAIL: which file(s), what error, and what you tried`, { label: 'cleanup' })

log('Workflow complete')
return { done: true, pages: PAGES.length }

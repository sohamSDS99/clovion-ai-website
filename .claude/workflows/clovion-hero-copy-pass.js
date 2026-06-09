export const meta = {
  name: 'clovion-hero-copy-pass',
  description: 'Tighten every hero H1 to ≤5 words. Revert /features center-alignment. Keep / centered.',
  phases: [
    { title: 'Hero copy + alignment pass', detail: '21 parallel agents — each rewrites one hero headline' }
  ]
}

const ROOT = '/Users/sohamsarker/Clovion AI/site'

// Each entry below is intentional and word-counted. Words are separated by spaces.
// "200+" counts as 1 word. Periods don't add to the count.
const HERO_UPDATES = [
  {
    file: 'components/Hero.tsx',
    headline: 'How AI sees you.',     // 4 words — CENTERED, gradient on "AI sees you."
    isHome: true,
    gradientPart: 'AI sees you.',
    leadPart: 'How'
  },
  { file: 'app/features/page.tsx',                            headline: 'Three tools. One platform.',  revertCenter: true },
  { file: 'app/features/ai-visibility-tracking/page.tsx',     headline: 'See every AI mention.' },
  { file: 'app/features/geo-improvement-suggestions/page.tsx', headline: 'Fixes that get cited.' },
  { file: 'app/features/platform-coverage/page.tsx',          headline: 'Every AI surface, tracked.' },
  { file: 'app/pricing/page.tsx',                             headline: 'Pricing built for teams.' },
  { file: 'app/blog/page.tsx',                                headline: 'Notes from the frontier.' },
  { file: 'app/blog/category/geo/page.tsx',                   headline: 'Everything GEO.' },
  { file: 'app/blog/category/ai-search/page.tsx',             headline: 'AI search, decoded.' },
  { file: 'app/blog/category/seo/page.tsx',                   headline: 'SEO meets GEO.' },
  { file: 'app/compare/page.tsx',                             headline: 'Compare every GEO tool.' },
  { file: 'app/compare/clovion-vs-profound/page.tsx',         headline: 'Clovion vs Profound.' },
  { file: 'app/alternatives/profound/page.tsx',               headline: 'Better than Profound.' },
  { file: 'app/customers/page.tsx',                           headline: '200+ brands. Found by AI.' },
  { file: 'app/docs/page.tsx',                                headline: 'Docs for builders.' },
  { file: 'app/docs/getting-started/page.tsx',                headline: 'Ship your first scan.' },
  { file: 'app/free-ai-visibility-score/page.tsx',            headline: 'Get your AI score.' },
  { file: 'app/about/page.tsx',                               headline: 'We bet on AI.' },
  { file: 'app/changelog/page.tsx',                           headline: 'Every change, dated.' },
  { file: 'app/legal/privacy/page.tsx',                       headline: 'Privacy policy.' },
  { file: 'app/legal/terms/page.tsx',                         headline: 'Terms of service.' }
]

phase('Hero copy + alignment pass')

await parallel(HERO_UPDATES.map(u => () => agent(`Edit one hero in ${ROOT}/${u.file}.

# Goal
Replace the existing hero H1 with the new headline below. Keep everything else (eyebrow, lead/subtitle, CTAs, HeroShade, decorations, layout) exactly as-is.

# New headline
"${u.headline}"

${u.isHome ? `
# IMPORTANT — this is the homepage HomeHero in components/Hero.tsx
- Headline must stay CENTERED (the current 'max-w-4xl mx-auto text-center' wrapper stays)
- Split the headline into two spans so the second span uses the monochrome gradient:
  - Solid ink span: "${u.leadPart}"
  - Gradient span: "${u.gradientPart}"
  - The gradient span keeps the existing classes: \`className="bg-gradient-to-br from-black via-neutral-700 to-neutral-400 bg-clip-text text-transparent"\`
- Final JSX shape:
  \`\`\`tsx
  <h1 className="display-xl mt-8 text-balance opacity-0 animate-rise" style={{ animationDelay: '80ms' }}>
    ${u.leadPart}{' '}
    <span className="bg-gradient-to-br from-black via-neutral-700 to-neutral-400 bg-clip-text text-transparent">
      ${u.gradientPart}
    </span>
  </h1>
  \`\`\`
- DO NOT modify the lead paragraph below, the CTAs, the pill, the reassurance line, or HeroBento
- DO NOT change centering — homepage stays centered
` : u.revertCenter ? `
# IMPORTANT — this page (features hub) needs alignment reverted to LEFT
- The hero is the first <Section> in app/features/page.tsx
- Currently the hero wrapper has 'mx-auto text-center' (added by a prior pass). Remove BOTH 'mx-auto' AND 'text-center' from the wrapper div that holds the eyebrow + h1 + lead + CTAs
- The wrapper should end up like 'max-w-3xl' (left-aligned, no auto margins). If it had only 'max-w-4xl mx-auto text-center', change to 'max-w-3xl'.
- Remove 'justify-center' from the CTA flex row if it was added; the CTAs should be left-aligned (flex-wrap items-center gap-3 is fine)
- THEN replace the H1 text with the new headline above (a plain single sentence, no gradient — this isn't the homepage)
- The H1 element keeps its display-lg or display-md class. Just change the text content.
` : `
# IMPORTANT — this is a non-home page. It is already LEFT-aligned. Keep it that way.
- The hero is the first <Section> in the file
- Replace the H1's text content with the new headline (a plain single sentence, no gradient)
- The H1 element keeps its existing class (display-lg / display-md / display-sm — whatever it has). Just change the text content
- DO NOT modify the eyebrow, lead paragraph, CTAs, HeroShade, decorations, or any other section
- DO NOT change alignment — keep it left-aligned as it already is
`}

# Apostrophes & quotes
- If the headline contains an apostrophe, use \`&apos;\` in JSX (since pages use the JSX escape style)
- The current headlines I provided don't use apostrophes, but the rule applies if you need it

# Steps
1. Read the file (limit ~100 lines is enough to find the hero)
2. Locate the H1 in the hero section
3. Use Edit with precise old_string/new_string. The old_string should be the EXACT current H1 + its surrounding context to make it unique
4. Verify the edit applied cleanly

Report what changed (the old headline and the new headline, plus any alignment changes for the features-hub case).`,
  { label: 'copy:' + u.file.split('/').slice(-2).join('/') }
)))

log('All 21 hero headlines rewritten to ≤5 words')

return { done: true, updated: HERO_UPDATES.length }

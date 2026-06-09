export const meta = {
  name: 'clovion-hero-polish',
  description: 'Center features hero + add subtle corner vignette to every hero banner across 21 pages',
  phases: [
    { title: 'Setup', detail: 'Add HeroShade component + center the features-hub hero copy' },
    { title: 'Apply', detail: '21 parallel agents add <HeroShade /> to each page hero' }
  ]
}

const ROOT = '/Users/sohamsarker/Clovion AI/site'

const SHADE_SPEC = `<HeroShade />
A reusable absolutely-positioned overlay component (already exported from '@/components/ui' after Phase 1).
It renders 4 soft dark radial gradients in each corner (top-left, top-right, bottom-left, bottom-right) at ~8% ink opacity. This creates a subtle vignette where corners feel slightly darker than the center, drawing the eye inward. Pointer-events none, no interaction.
Pattern to render in a hero Section:
  <Section className="relative overflow-hidden ...">
    {/* existing decorations like grid-bg, hero-bg can stay */}
    <HeroShade />
    <Container>...</Container>
  </Section>
The Section MUST have 'relative' AND 'overflow-hidden' classes. The HeroShade absolutely positions itself relative to the Section.`

// ====================================================================
// PHASE 1 — Add HeroShade component + center features-hub hero
// ====================================================================
phase('Setup')

await parallel([
  () => agent(`Add a HeroShade component to ${ROOT}/components/ui.tsx.

# Steps
1. Read the file
2. Add this new exported component (place it AFTER GradientOrb, BEFORE HairlineDivider):

\`\`\`tsx
export function HeroShade({
  intensity = 0.07,
  spread = 42,
  className
}: {
  intensity?: number
  spread?: number
  className?: string
}) {
  const bg = [
    \`radial-gradient(circle at 0% 0%, rgba(10,10,15,\${intensity}), transparent \${spread}%)\`,
    \`radial-gradient(circle at 100% 0%, rgba(10,10,15,\${intensity}), transparent \${spread}%)\`,
    \`radial-gradient(circle at 0% 100%, rgba(10,10,15,\${intensity}), transparent \${spread}%)\`,
    \`radial-gradient(circle at 100% 100%, rgba(10,10,15,\${intensity}), transparent \${spread}%)\`
  ].join(', ')
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{ background: bg }}
    />
  )
}
\`\`\`

3. Verify the file still exports cn import from '@/lib/cn' (it already does).

Use Edit tool. Report exactly what you changed.`, { label: 'setup:hero-shade-component' }),

  () => agent(`Center the hero copy on the features hub page: ${ROOT}/app/features/page.tsx.

# Current state
The first <Section> on this page has its hero content (eyebrow "PLATFORM", headline "Three tools. One platform. Total AI visibility.", lead paragraph, CTA row) LEFT-ALIGNED in a left-pinned column. The user wants it CENTER-ALIGNED.

# Steps
1. Read the file (use Read with limit ~120 to find the hero section quickly)
2. Find the first <Section> and the inner wrapper that holds the eyebrow + h1 + lead + CTAs
3. Add 'mx-auto text-center' to that wrapper. If it has 'max-w-3xl' or similar, keep it (becomes 'max-w-3xl mx-auto text-center'). If it has no max-width, add 'max-w-4xl mx-auto text-center'.
4. For the CTA row inside the hero: ensure the flex container has 'justify-center' so the buttons center horizontally
5. The eyebrow component is an inline-flex element; centering should work via parent text-center
6. Do NOT touch any other Section on the page. Only the hero (the first Section).

Use Edit tool with precise old_string/new_string. Report what changed.`, { label: 'setup:center-features-hero' })
])

log('Phase 1 done — HeroShade exported, features hero centered')

// ====================================================================
// PHASE 2 — Apply <HeroShade /> to all 21 page heroes (parallel)
// ====================================================================
phase('Apply HeroShade')

// Note: app/page.tsx uses <HomeHero /> from components/Hero.tsx — handle separately
const PAGES = [
  { file: 'components/Hero.tsx', label: 'hero:home', isHomeHero: true },
  { file: 'app/features/page.tsx', label: 'hero:features-hub' },
  { file: 'app/features/ai-visibility-tracking/page.tsx', label: 'hero:feature-tracking' },
  { file: 'app/features/geo-improvement-suggestions/page.tsx', label: 'hero:feature-suggestions' },
  { file: 'app/features/platform-coverage/page.tsx', label: 'hero:feature-coverage' },
  { file: 'app/pricing/page.tsx', label: 'hero:pricing' },
  { file: 'app/blog/page.tsx', label: 'hero:blog-index' },
  { file: 'app/blog/category/geo/page.tsx', label: 'hero:blog-geo' },
  { file: 'app/blog/category/ai-search/page.tsx', label: 'hero:blog-ai-search' },
  { file: 'app/blog/category/seo/page.tsx', label: 'hero:blog-seo' },
  { file: 'app/compare/page.tsx', label: 'hero:compare-hub' },
  { file: 'app/compare/clovion-vs-profound/page.tsx', label: 'hero:compare-profound' },
  { file: 'app/alternatives/profound/page.tsx', label: 'hero:alt-profound' },
  { file: 'app/customers/page.tsx', label: 'hero:customers' },
  { file: 'app/docs/page.tsx', label: 'hero:docs-hub' },
  { file: 'app/docs/getting-started/page.tsx', label: 'hero:docs-getting-started' },
  { file: 'app/free-ai-visibility-score/page.tsx', label: 'hero:free-tool' },
  { file: 'app/about/page.tsx', label: 'hero:about' },
  { file: 'app/changelog/page.tsx', label: 'hero:changelog' },
  { file: 'app/legal/privacy/page.tsx', label: 'hero:privacy' },
  { file: 'app/legal/terms/page.tsx', label: 'hero:terms' }
]

await parallel(PAGES.map(p => () => agent(`Add the <HeroShade /> overlay to the hero section of ${ROOT}/${p.file}.

# Component spec
${SHADE_SPEC}

# Special note for this file
${p.isHomeHero
  ? `This is components/Hero.tsx — the HomeHero component. The "hero section" is the <section> element at the top of HomeHero's return. It already has 'relative isolate overflow-hidden'. Add <HeroShade /> as a child of that <section>, placed AFTER the existing hero-bg decorative div (around line 10-12). It should sit alongside (not inside) the .hero-bg wrapper.`
  : `Standard pattern. The hero is the FIRST <Section> in the file's JSX (default-exported component). Some pages also have an early <div className="grid-bg ..."> or hero decoration as a child of that Section — leave those in place. Add <HeroShade /> as the LAST decoration child, immediately before the <Container>.`}

# Steps
1. Read the file (Read with limit ~80 should reveal the hero)
2. Locate the hero element (first <Section> or the home hero's <section>)
3. Ensure it has 'relative' and 'overflow-hidden' classes (add them if missing — preserve any existing classes)
4. Add <HeroShade /> as a child overlay (after any existing decoration divs, before the Container with content)
5. Update the import line from '@/components/ui' (or wherever Container/Button is imported) to include HeroShade

# Don't
- Don't restructure unrelated JSX
- Don't change copy or other classes beyond what's needed for relative/overflow-hidden
- Don't add HeroShade to non-hero sections on the page
- Don't add it to the Section more than once — if it's already there, skip

# Verify before finishing
- Section has 'relative' AND 'overflow-hidden' in className
- HeroShade is rendered exactly once as a direct child of the hero Section
- Import includes HeroShade

Use Read + Edit (or Write only if absolutely needed). Report what changed.`, { label: p.label })))

log('Phase 2 done — HeroShade applied to all 21 hero banners')

return { done: true, herosUpdated: PAGES.length }

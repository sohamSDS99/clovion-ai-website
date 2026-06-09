# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

The workspace root contains a single Next.js project under `site/`. There is no monorepo, no shared packages — `site/` is the whole app. `project-bolt-extracted/` is unused legacy and can be ignored.

```
.
├── .claude/launch.json     # preview server config (autoPort, --prefix site)
├── .claude/workflows/      # saved multi-agent orchestration scripts (see Workflows)
├── site/                   # the Next.js 14 marketing site
│   └── app/fonts/          # local font assets (Saans-TRIAL-SemiBold.otf)
└── CLAUDE.md
```

## Commands

All commands run from `site/`:

```bash
cd site
npm install
npm run dev      # Next.js dev server on :3000 (autoPort if taken)
npm run build    # production build
npm run lint     # next lint
```

There are no tests in this repo — it's a marketing site, not a product app.

For the dev server in a Claude session, prefer `preview_start` over Bash. The launch config at `.claude/launch.json` (workspace root, not `site/`) already sets `--prefix site` and `autoPort: true`.

## Architecture

### Content is centralized, not inline

`site/lib/content.ts` is the single source of truth for nearly all copy. Key exports:

- `brand`, `nav` — brand identity + the 4-item header nav
- `features` (3 entries), `platforms` (10 AI engines), `aiEngines`, `integrations`
- `customers` (8 logos), `customerStories` (3 featured), `testimonials` (9, short-form)
- `pricingTiers` (4: Free/Starter/Growth/Enterprise), `addOns`
- `faqs` (10), `principles` (4), `leadership` (4), `companyStats` (4), `homeMetrics` (4)
- `compareCompetitors` + `compareMatrix` (for the /compare hub and vs-pages)
- `blogCategories` (3), `blogPosts` (12)
- `changelogEntries` (8), `docsSections`, `offices` (3)

When editing copy, edit there first. Pages import from this file and render the data — don't add new hardcoded strings unless they're truly page-specific.

Pages with meaningful inline content: `app/page.tsx` (homepage section composition), `components/Hero.tsx` (hero pill + bento mock data), `app/free-ai-visibility-score/page.tsx` (interactive mock result), `app/docs/page.tsx` (quickStart tiles, browseSurfaces, frameworkQuickstarts), `app/blog/BlogIndex.tsx` (filter logic). Legal pages have prose-style inline content by nature.

**Testimonials are short-form (~20–28 words each).** Intentionally trimmed for card-readable length in `TestimonialRail`. If you add more, match that length. Preserve concrete numbers (e.g. "8.4× mentions", "5.2× share of voice") and real-sounding voice.

### Pages map 1:1 to routes (Next.js App Router) — 21 routes, locked structure

```
/                                              (homepage — uses <HomeHero />)
/features
/features/ai-visibility-tracking
/features/geo-improvement-suggestions
/features/platform-coverage
/pricing
/blog                                          (uses BlogIndex client component)
/blog/category/geo
/blog/category/ai-search
/blog/category/seo
/compare
/compare/clovion-vs-profound
/alternatives/profound
/customers
/docs
/docs/getting-started
/free-ai-visibility-score                      (interactive — 'use client')
/about
/changelog
/legal/privacy
/legal/terms
```

`app/layout.tsx` wires the fonts (Saans-TRIAL-SemiBold via `next/font/local`, JetBrains Mono via `next/font/google`), Header, and Footer.

### Component layers

- `components/ui.tsx` — server-rendered primitives: `Container`, `Section`, `Button`, `Card`, `Eyebrow`, `Tag`, `GradientOrb`, `HeroShade`, `ArrowRight`, `Check`, `HairlineDivider`, `HaloMark`. `Section` accepts `id`, `tight`, `bg` ('subtle' | 'ink' | 'gradient'), and `className`. `Button` variants: `primary` | `secondary` | `ghost` | `invert` (white-on-dark, for use inside `bg-ink` sections).
- `components/sections.tsx` — composed marketing sections: `LogoMarquee`, `AIEngineStrip`, `FAQ`, `CTABanner`, `StatStrip`, `FeatureGrid`, `TestimonialRail`, `TestimonialPullQuote` (legacy — kept defined for reference). Marked `'use client'`.
- `components/Hero.tsx` — `HomeHero` for the homepage ONLY. Includes the `HeroBento` product mock with `IntersectionObserver`-driven animations (count-up metric, animated bar chart, engine breakdown rows, SVG callout). Client component.
- `components/SpotlightCard.tsx` — standalone client component with mouse-tracking `--mouse-x/--mouse-y` CSS variables. Pairs with `.spotlight-overlay` in globals.css. Drop in for premium cards.
- `components/Header.tsx` — sticky header. Mega-menu for "Features" (the only nav item with children). Pulls nav from `lib/content.ts`. Right-side dual CTA: `Get free score` (ghost) + `Start free trial` (primary). Nav links are full-ink, font-semibold, with `hover:bg-ink/5`.
- `components/Footer.tsx` — cream-background footer with 4 columns: Product / Resources / Company / Legal.

#### HaloMark (the brand mark)

The Clovion "C" mark — two filled left-pointing `<` chevrons (large + smaller) defined as SVG paths in `HaloMark`. Both have horizontal end-caps reaching the top and bottom of the viewBox. The internal name `HaloMark` is legacy; what renders is the twin-chevron logo. **Single source of truth** — Header and Footer both consume it. Uses `fill="currentColor"` so it adapts to parent text color (works on cream body, ink-dark CTABanner, anywhere).

#### HeroShade (corner vignette)

Drop-in component for hero `<Section>`s. Renders 4 soft radial gradients at the corners (~7% ink opacity) creating a subtle inward focus. Place inside any `<Section>` with `relative overflow-hidden`, after any existing decoration divs (`grid-bg`, `hero-bg`) and before the `<Container>`. Optional props: `intensity`, `spread`.

### Design system (in `app/globals.css` + `tailwind.config.ts`)

**Colors. Strict B&W brand book — no purple, no chromatic accents anywhere.** Body bg is cream `#FAFAF7`. Surfaces are white. Subtle alt bg is `#F5F3EF`. Line `#eceae5`. Ink `#0a0a0f` plus rgba steps via Tailwind tokens (`ink/80/70/60/50/40/20/10`). Mid-grays via Tailwind's built-in `neutral-*`. Distinctiveness comes from typography, density, surface contrast, dot-grid textures, and motion — **never color**. Gradients allowed but only monochrome (e.g. `from-black via-neutral-700 to-neutral-400`). **Do NOT reintroduce `purple-*` utilities.**

**Typography.** Site-wide font is **Saans-TRIAL-SemiBold** (Indian Type Foundry), loaded via `next/font/local` from `site/app/fonts/Saans-TRIAL-SemiBold.otf`. Exposed as CSS variable `--font-saans`. Both `--font-display` and `--font-body` in globals.css resolve to `var(--font-saans)`. **Body weight defaults to 600 (Semibold)**, as do all `.display-*` classes, `.btn`, `.eyebrow`, `.tag`. The Tailwind utility `font-medium` and lighter have been globally converted to `font-semibold` across the source — keep using `font-semibold` for any new weight-related styling. Custom display classes `.display-xl` (clamp max 7.5rem / 120px), `.display-lg`, `.display-md`, `.display-sm`, and `.lead` own all letter-spacing. **Note: Saans is a TRIAL license** — production deploy requires the full ITF Saans license.

**Buttons.** `.btn-primary` = solid ink + white text. `.btn-secondary` = subtle gray bg + ink text. `.btn-ghost` = transparent + ink text. `.btn-invert` = white bg + black text + 1px black border (for use on dark `bg-ink` surfaces, e.g. inside `CTABanner`).

**Section padding.** Three-tier scale: `.section-y-sm` (3–5rem), `.section-y` (4.5–7rem, default), `.section-y-xl` (7–12rem). Use `-xl` deliberately for "big breath" signature moments.

**Cards.** `.card` is the standard surface (white, soft border, soft hover with no translate). For premium featured cards, wrap with `<SpotlightCard>` for cursor-following spotlight. Cards stack on the cream body and pop off it.

**Dark sections.** Use a single soft `rgba(10,10,15,0.18)` radial — not stacked heavy gradients. The pattern lives in `CTABanner` (sections.tsx). On dark surfaces, `Button variant="invert"` is the correct CTA.

**Grid background quirk.** `.grid-bg` applies `mask-image` directly to the element, which clips child content. **Always apply `.grid-bg` to an absolutely-positioned child div**, not the `<Section>` itself:

```tsx
<Section className="relative overflow-hidden">
  <div className="grid-bg absolute inset-0 -z-10" aria-hidden />
  <HeroShade />
  <Container>{/* content */}</Container>
</Section>
```

### Hero pattern (uniform across all pages except `/`)

Every page except the homepage uses this exact hero shape. Headlines are **≤5 words** with no exceptions. Sentence-case with periods. Left-aligned.

```tsx
<Section className="relative overflow-hidden">
  <HeroShade />
  <Container>
    <div className="max-w-3xl">
      <Eyebrow>SECTION NAME</Eyebrow>
      <h1 className="display-md mt-5">Short headline.</h1>
      <p className="lead mt-6 text-ink/70">Twenty-to-thirty word subtitle that sets the page's frame.</p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Button href="/pricing" variant="primary" size="lg">Start free trial</Button>
        <Button href="/free-ai-visibility-score" variant="secondary" size="lg">Get free score</Button>
      </div>
    </div>
  </Container>
</Section>
```

The homepage hero (in `components/Hero.tsx`) is the **only centered hero on the site**. It also uses a two-part headline with a monochrome gradient on the emphasis phrase: `bg-gradient-to-br from-black via-neutral-700 to-neutral-400 bg-clip-text text-transparent`. No gradient on any other hero — they're plain ink.

**Eyebrows are scarce** — only on flagship section openings and hero bands.

### Scroll-snap rails (TestimonialRail pattern)

`TestimonialRail` in `components/sections.tsx` is the canonical pattern for horizontal scrollable card carousels. Reuse this scaffold if you build another rail:

- `flex gap-5 overflow-x-auto snap-x snap-proximity` (proximity, **not** mandatory — mandatory fights `behavior: 'smooth'` and click-to-scroll in Chromium)
- Each card: `snap-start shrink-0 w-[320px] md:w-[380px]`
- `.gradient-mask-edges` on the rail wrapper for soft fades
- Pagination dots beneath: active `w-8 h-1.5 bg-ink` rounded pill, inactive `w-1.5 h-1.5 bg-ink/20`. 300ms `transition-all`
- Click handler: `item.scrollIntoView({ behavior: 'auto', inline: 'start', block: 'nearest' })` — `behavior: 'smooth'` looks great in theory but Chromium with scroll-snap drops the animation unpredictably
- Active state syncs via `IntersectionObserver({ root: rail, threshold: [0.55, 0.75, 1] })`

## Workflows (`.claude/workflows/`)

Saved multi-agent orchestration scripts from past sessions. They're precedents — read for patterns, don't blindly re-run:

- `clovion-rebuild.js` — full site rebuild (research → plan → foundation → 21 pages in parallel)
- `clovion-hero-polish.js` — added `<HeroShade />` to every hero across 21 pages
- `clovion-hero-copy-pass.js` — tightened every hero headline to ≤5 words
- `clovion-saans-typography.js` — site-wide weight conversion to font-semibold
- `clovion-saans-local.js` — Fontshare → local `next/font/local` migration

The pattern: parallel `agent()` calls inside `parallel(...)` phases for mechanical multi-file changes. Use `pipeline()` for staged work where each item flows through multiple stages.

## Brand and voice conventions

User-confirmed preferences. Treat as load-bearing:

- **Brand is "Clovion AI"**. Twin-chevron mark + Saans Semibold wordmark.
- **Strict B&W brand book.** No purple, no chromatic accents. Light theme only. Memory files `feedback_light_theme.md` and `feedback_hero_gradient_accent.md` track the directive.
- **Saans-TRIAL-SemiBold is the typography.** Site-wide weight 600. `font-medium` and lower have been globally converted to `font-semibold`.
- **Monochrome gradient on the homepage hero only.** `from-black via-neutral-700 to-neutral-400 bg-clip-text text-transparent` on 1–3 emphasis words. Other heroes are plain ink — no gradients.
- **Hero headlines are ≤5 words.** No exceptions.
- **Only marketing CTA is "Start free trial."** No "View demo", "Book a demo". Secondary CTA is "Get free score" → `/free-ai-visibility-score`. Sales CTA ("Talk to sales") is fine in pricing/enterprise context only.
- **Humanized voice.** Avoid triplet sentence rhythm, em-dash overuse, AI-startup buzzwords ("leverage", "unlock", "closed loop", "operating system", "the only X built for Y"). Vary sentence length. Section leads 20–25 words.
- **Header nav is short — 4 items.** Features (mega-menu) / Pricing / Customers / Blog. **Compare and Docs live in the Footer only**, moved out of the header deliberately.

## When editing

- Copy changes → `lib/content.ts` first, then inline strings in pages
- New marketing sections → add to `components/sections.tsx` so they're reusable
- Design tokens → `tailwind.config.ts` for colors/spacing/animation, `globals.css` for component classes (`.btn-*`, `.card`, `.section-y-*`, font tokens)
- Featured cards that should feel premium → wrap in `<SpotlightCard>`
- New horizontal carousel → reuse the `TestimonialRail` scaffold; don't roll your own snap logic
- New page → `app/<route>/page.tsx` with `export const metadata` for SEO, hero pattern above, `<HeroShade />` inside the hero `<Section>`. Compose with `Section` + `Container` + `components/sections.tsx`. Client components can't export metadata — see `BlogIndex.tsx` and `free-ai-visibility-score/page.tsx` for the pattern (server wrapper imports client child, or skip metadata)
- Touching the logo → edit `HaloMark` in `components/ui.tsx`. Single source — Header and Footer both consume it
- Multi-page mechanical sweeps (e.g. weight conversion, hero pattern application) → write a script in `.claude/workflows/` and run via the Workflow tool. Past scripts are precedents

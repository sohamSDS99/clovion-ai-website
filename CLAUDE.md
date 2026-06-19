# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

The workspace root contains a single Next.js project under `site/`. There is no monorepo, no shared packages — `site/` is the whole app. `project-bolt-extracted/` is unused legacy and can be ignored.

```
.
├── .claude/launch.json          # preview server config (autoPort, --prefix site)
├── .claude/workflows/           # saved multi-agent orchestration scripts (see Workflows)
├── site/                        # the Next.js 14 marketing site + admin console
│   ├── app/                     # marketing routes + /admin tree (separate layout)
│   ├── app/fonts/               # local font assets (Saans-TRIAL-SemiBold.otf)
│   ├── components/home/         # the dark homepage redesign — sections used only by /
│   ├── public/logos/            # 13 logo assets (7 engine SVGs + 6 customer knockout PNGs)
│   └── .env.example             # admin-console env vars template (feat branch)
├── railway.json                 # Railway build config (NIXPACKS builder + restart policy)
├── nixpacks.toml                # explicit Node 20 provisioning for the Railway build
├── CLOVION_CONSOLE_PRD.md/.pdf  # admin-console PRD (locked architecture decisions)
├── ADMIN_*.md                   # admin-build planning + metrics research notes
└── CLAUDE.md
```

**Branch model:** `main` is what Railway deploys to production. `feat/console-foundation` is the active development branch for the admin console (`/admin/*` routes). Most session work lands on the feature branch; only changes that should ship to production now (logo, analytics, SEO tags, Railway config fixes) go directly to `main`.

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

## Deployment (Railway)

**Production URL:** https://www.clovion.ai
**Source:** `github.com/sohamSDS99/clovion-ai-website`, branch `main`.
**Railway service:** lives in the `clovion.ai website` project (project ID `3d1302da-405c-48ca-a450-2701ea9d6907`, originally auto-named `passionate-illumination` and later renamed) inside the `Zahir Hasan's Projects` workspace. The duplicate service originally provisioned in the team's other project was deleted intentionally.

Push to `main` → Railway auto-builds via Nixpacks → deploys. No manual step needed. The integration uses Railway's **GitHub App** (push events flow through the app installation, *not* through a repo-level webhook — checking `/repos/.../hooks` returns 0 and is not evidence of breakage).

**Build config — sources of truth at the repo root:**

- `nixpacks.toml` — declares Node 20 via `[phases.setup].nixPkgs = ["nodejs_20"]`. The older `providers = ["node"]` pattern stopped being honored by Railway's Nixpacks builder mid-2026; do not regress to it. Install/build/start phases each `cd site && …` because the package.json lives in `site/`.
- `railway.json` — only declares `builder: NIXPACKS` + restart policy. Build/start commands intentionally live in `nixpacks.toml` (single source of truth).

**Railway's vuln scanner blocks deploys on HIGH-severity CVEs in dependencies.** Keep `next` patched within its current major (`^14.2.x`). When a deploy fails with cryptic `npm: command not found`, always pull `railway logs --build <id>` — the scanner aborts the build *before* Nixpacks runs, which makes the install step appear to fail for no reason.

**Diagnostic commands (Railway CLI at `/Users/sohamsarker/.railway/bin/railway`):**

```bash
railway deployment list --limit 3 --json     # status of recent deploys
railway logs --build --lines 60 <id>         # build logs (includes security scanner output)
railway logs --deployment <id> --lines 40    # runtime logs
railway domain --json                        # currently-bound domain (don't assume *.up.railway.app)
```

The custom domain `www.clovion.ai` replaced the auto-generated railway.app subdomain. Always check `railway domain --json` for the canonical URL — earlier verifiers that curled the dead `*.up.railway.app` URL falsely reported 404s.

**Apex (`clovion.ai`) is NOT bound to Railway — only `www.clovion.ai` is.** Apex has no DNS records and doesn't resolve (`dig clovion.ai` returns empty, curl fails with "Could not resolve host"). If Google Analytics or Search Console reports "tag not detected" when configured against the apex URL, the tag IS on the site — it's just that the tester is hitting a nonexistent host. The fix is either: (a) update the GA/GSC property Stream URL to `https://www.clovion.ai`, or (b) bind apex to Railway (requires workspace-owner permissions — see below) and add a DNS A record at the registrar.

**Workspace permission caveat.** The user account (`soham@sdsmanager.com`) is a member of `Zahir Hasan's Projects` workspace but NOT the owner. Read operations all work (`whoami`, `status`, `deployment list`, `logs`, `domain --json`). Write operations differ:

- ✅ Permitted: linking services, generating Railway-provided `*.up.railway.app` subdomains, deleting services, deploys via push
- ❌ Denied: adding custom domains (`railway domain <hostname>` returns `Unauthorized` on both CLI and MCP — workspace-owner role required)

When a custom-domain mutation fails with `Unauthorized`, **don't keep retrying `railway login`** — fresh tokens don't fix it because the gate is at the API permission level. Route through Zahir (workspace owner) via the Railway dashboard.

## Analytics & SEO tags

Wired into `app/layout.tsx` site-wide; do not duplicate per-page. All four use the canonical Next.js Metadata API or `@next/third-parties/google`:

- **Google Tag Manager** — container `GTM-WHCPZS4P`, mounted via `<GoogleTagManager gtmId="..." />` from `@next/third-parties/google`. Renders both halves of the GTM snippet (head script + post-body noscript iframe). Defers via `strategy="afterInteractive"` — the head script tag isn't in the initial SSR HTML, it's in the RSC payload and Next.js injects it post-hydration. This is normal; don't be alarmed by a curl grep showing 0 inline `<script>` matches.
- **Google Analytics 4** — measurement ID `G-QXKYL1Z4LB`, mounted via `<GoogleAnalytics gaId="..." />` from the same package. Coexists with GTM. **Beware double-counting:** if the GTM container has a GA4 Configuration tag firing `G-QXKYL1Z4LB`, pageviews will count twice. Either remove the direct GA install or don't add GA as a GTM tag — not both.
- **Google Search Console verification** — `metadata.verification.google` emits `<meta name="google-site-verification" content="..." />`.
- **Bing Webmaster Tools verification** — Next.js's `Metadata` type has no Bing shortcut, so wired via `metadata.verification.other = { 'msvalidate.01': '...' }`. Coexists with the Google verification under the same `verification` object.

**Tester URL gotcha.** When verifying a tag in any of the Google/Bing setup tools, the property URL must be `https://www.clovion.ai` (with www). The apex `clovion.ai` has no DNS records — testers configured against it get "tag not detected" even though the tag IS correctly served. See the "Apex is NOT bound to Railway" paragraph above.

## Click tracking (dataLayer)

A semantic dataLayer push system sits on top of GTM, so conversions surface as clean GA4 events with structured dimensions (`cta_location`, `plan_name`, etc.) instead of just opaque clicks.

**The helper — `site/lib/analytics.ts`** — exports `track(event)` plus typed named methods. Event names match GTM Custom Event triggers exactly:

| Method | Event | Key dimensions |
|--------|-------|----------------|
| `startTrial(location, plan?)` | `start_trial` | `cta_location`, `plan_name` |
| `getFreeScore(location)` | `get_free_score` | `cta_location` |
| `bookDemo(location)` | `book_demo` | `cta_location` |
| `pricingClick(plan, location)` | `pricing_click` | `plan_name`, `cta_location` |
| `formSubmit(name, location)` | `generate_lead` | `form_name`, `form_location` |
| `ctaClick(text, location, url?)` | `cta_click` | `cta_text`, `cta_location`, `link_url` |
| `fileDownload(file, url)` | `file_download` | `file_name`, `link_url` |
| `pageView(path)` | `page_view` | `page_path` |

**SPA route tracking — `site/components/RouteTracker.tsx`** — client component mounted in the root layout. Fires `page_view` on `usePathname()` changes, skipping the first render (GTM's own pageview catches the initial load).

**Button-driven tracking — `site/components/ui.tsx`** — the `Button` primitive is a client component that accepts optional `trackLocation`, `trackEvent`, `trackPlan` props. When `trackLocation` is set, an onClick handler runs `extractText(children)` and auto-routes the event:

- "Start free trial" → `start_trial`
- "Get free score" → `get_free_score`
- "Book a Demo" → `book_demo`
- Any other text → `cta_click`

Override the auto-detect with explicit `trackEvent` (e.g. pricing tier cards use `trackEvent="pricing_click"` + `trackPlan={tier.name}`).

**`cta_location` naming convention.** Every page's hero CTAs use `<page-slug>_hero`. End-of-page CTAs use `<page-slug>_final_cta` or `<page-slug>_footer`. Header is `header` (desktop) / `header_mobile`. CTABanner is `final_cta`. Homepage loop section is `home_loop`. Pricing tier cards are `pricing_card` (with `plan_name` differentiating each tier). Enterprise sales is `pricing_enterprise`.

**Where the wiring lives:**

| CTA group | File | Location values |
|-----------|------|-----------------|
| Header (desktop + mobile, both light + dark variants) | `components/Header.tsx` / `components/HomeHeader.tsx` | `header`, `header_mobile` |
| Homepage hero + final CTA (dark redesign) | `components/home/HomeHero.tsx`, `components/home/HomeCTA.tsx`, `components/home/Loop.tsx` | `home_hero`, `home_final_cta`, `home_loop` |
| Final CTA banner (other pages) | `components/sections.tsx` (CTABanner) | `final_cta` |
| Pricing tier cards (4 tiers via map) | `app/pricing/PricingTiers.tsx` | `pricing_card` + per-tier `plan_name` |
| Enterprise mailto | `app/pricing/page.tsx` | `pricing_enterprise` |
| Each marketing page hero / end CTA | the page's own `page.tsx` | `<page>_hero`, `<page>_final_cta`, etc. |
| Free-score form submit | `app/free-ai-visibility-score/page.tsx` (handleSubmit) | `free_score_page` |

**Pricing tier CTAs live in a client island.** `app/pricing/page.tsx` is a server component; the per-tier CTAs are rendered inside `app/pricing/PricingTiers.tsx` (a client island composed in at line 223). Modifying tier tracking goes into `PricingTiers.tsx`, not `page.tsx`.

**Catch-all safety net (GTM auto triggers, no code).** Anything not semantically wired still fires through the container's built-in auto triggers: `ui_click` for any `<a>`/`<button>`/`[role=button]`, `outbound_click` for non-`clovion.ai` hosts, `scroll` at 25/50/75/90% depth. Nav links, footer links, "Read the spec"-type inline CTAs all surface this way — just without the structured `cta_location` dimension.

**When adding a new page or CTA:** if the Button uses the standard "Start free trial" / "Get free score" text and you set `trackLocation="<page>_hero"`, the right semantic event fires automatically — no extra wiring needed.

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

### Pages map 1:1 to routes (Next.js App Router)

**Marketing surface — 21 routes, locked structure (on `main`):**

```
/                                              (homepage — dark redesign, uses components/home/* — see "Homepage / is its own world")
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

**Admin console — `/admin/*` tree (on `feat/console-foundation`, not yet merged to main):**

`/admin` overview, `/admin/login`, `/admin/accounts` (+ `[id]` detail), `/admin/acquisition`, `/admin/activation`, `/admin/alerts`, `/admin/audit`, `/admin/engagement`, `/admin/flags`, `/admin/funnels`, `/admin/gdpr`, `/admin/operations`, `/admin/performance`, `/admin/pipeline`, `/admin/retention`, `/admin/revenue`. Has its own `app/admin/layout.tsx` (separate from the marketing root layout), its own `/admin/login` sub-layout, and reads env vars from `site/.env.example`. Architecture decisions are captured in `CLOVION_CONSOLE_PRD.md` at the repo root; planning notes in `ADMIN_BUILD_PLAN.md` / `ADMIN_PRD_SPEC.md` / `ADMIN_REVIEW_NOTES.md` / `ADMIN_METRICS_RESEARCH.md`. The marketing surface uses `FooterGate` (also added on this branch) to hide the marketing Footer on admin routes.

**Root layout (`app/layout.tsx`)** wires the fonts (Saans-TRIAL-SemiBold via `next/font/local`, JetBrains Mono via `next/font/google`), `<ChromeHeader />` + `<ChromeFooter />` gates (which pick light or dark chrome by pathname), `<ThemeShell />` (toggles `.clv-dark` on `<html>` for SPA navigations), an inline pre-hydration `<script>` that synchronously sets `.clv-dark` on the homepage's first paint to avoid FOUC, **Google Analytics 4** (via `@next/third-parties/google`), **Google Tag Manager**, and SEO/verification metadata. `<html suppressHydrationWarning>` is intentional — the bootstrap script mutates className before React hydration. See "Homepage / is its own world" below for the full theme-scoping story.

### Component layers

- `components/ui.tsx` — server-rendered primitives: `Container`, `Section`, `Button`, `Card`, `Eyebrow`, `Tag`, `GradientOrb`, `HeroShade`, `ArrowRight`, `Check`, `HairlineDivider`, `HaloMark`. `Section` accepts `id`, `tight`, `bg` ('subtle' | 'ink' | 'gradient'), and `className`. `Button` variants: `primary` | `secondary` | `ghost` | `invert` (white-on-dark, for use inside `bg-ink` sections). The `Button` primitive carries the dataLayer tracking props (`trackLocation` / `trackEvent` / `trackPlan`).
- `components/sections.tsx` — composed marketing sections used on the OTHER 20 routes: `AIEngineStrip`, `FAQ`, `CTABanner`, `StatStrip`, `FeatureGrid`, `TestimonialRail`, `TestimonialPullQuote` (legacy — kept defined for reference). Marked `'use client'`. (Not used on the homepage — `/` has its own section components under `components/home/`.)
- `components/SpotlightCard.tsx` — standalone client component with mouse-tracking `--mouse-x/--mouse-y` CSS variables. Pairs with `.spotlight-overlay` in globals.css. Drop in for premium cards.
- `components/Chrome.tsx` — client gate. Exports `ChromeHeader` and `ChromeFooter` that route between the light Header/Footer and the dark HomeHeader/HomeFooter based on `usePathname()`. Layout uses these instead of importing Header/Footer directly.
- `components/Header.tsx` + `components/Footer.tsx` — the LIGHT variants, used on all 20 non-homepage routes. Sticky header with mega-menu for "Features", dual CTAs. Cream-background footer with 4 columns. Unchanged by the homepage rebuild.
- `components/HomeHeader.tsx` + `components/HomeFooter.tsx` — the DARK variants, used only on `/`. Same nav structure as the light variants, but white-on-dark surfaces, `rgba(10,10,12,0.72)` blur backdrop when scrolled, dark mega-menu, dark mobile drawer.
- `components/ThemeShell.tsx` — tiny client component, no markup. On mount + every `usePathname()` change, toggles `.clv-dark` on `document.documentElement` based on `DARK_ROUTES` (just `/` today). Pairs with the inline bootstrap script in `app/layout.tsx`.
- `components/home/*` — the homepage redesign's section components. See the next subsection.

**Dead code from the prior homepage design** (unreferenced from any route, safe to delete):
- `components/Hero.tsx` (old centered light hero + HeroBento — replaced by `home/HomeHero.tsx`)
- `components/HomeInteractive.tsx` (LiveAIDemo / MetricsTickerStrip / AIEngineMarquee — replaced by `home/ChatDemo`, `home/MetricsStrip`, `home/LogoMarquee`)

**Name collision watchout.** Two different `LogoMarquee` exports coexist: the OLD text-wordmark version in `components/sections.tsx` is **still used by `app/features/page.tsx`** (so it's not dead). The NEW real-image marquee at `components/home/LogoMarquee.tsx` is homepage-only. Don't merge them — they serve different sections of the site with different visual contracts.

#### Homepage `/` is its own world (dark)

The homepage was rebuilt 2026-06-19 from the "Clovion AI Design System" handoff and is a **deliberate exception** to the otherwise strict light B&W brand book. It's the only route that ships dark; the other 20 marketing routes remain on cream + ink, untouched. Light theme is still the default for any NEW route.

**Section components** — all under `components/home/`, used only by `app/page.tsx`:

- `HomeHero.tsx` — centered hero. Headline reads `See how {RotatingLogo} sees your brand.` where `RotatingLogo` crossfades through six engine SVGs (ChatGPT → Claude → Gemini → Perplexity → Grok → Google AI) every 2s. Below the headline is a dashboard `HeroBento` mock with `IntersectionObserver`-driven count-up to 28.4%, animated bar chart, and 5 engine score rows. The bento dropped the SVG callout arrow + "+7.1× lift" pull-quote that the old light hero had — by design.
- `PillarStepper.tsx` — scroll-pinned 4-pillar section. Left side: a vertical list with inactive items at 0.45 opacity and an animated progress bar on the active item. Right side: framed product-UI mocks (`MockVisibility`, `MockPerception`, `MockRankings`, `MockRecommendations`), all defined inline in the same file because they're only used here. Active step is derived from scroll position within the pinned section. **Falls back to stacked layout under 1000px** via `matchMedia('(max-width: 1000px)')` — no scroll-pin on mobile.
- `ChatDemo.tsx` — 500vh scroll-pinned section. Phase A (`p 0 → 0.5`): 20 floating frosted-glass `WindowCard` instances with engine logos drift then converge into a chat box, each card staggered. Phase B (`p 0.54 → 1`): the chat materializes and steps through `prompt → typing dots → "Thought for 163s" → streamed response → analysis card → row reveal`. Progress is written to CSS custom properties `--pa` and `--cardin` on the sticky element; component state tracks `step` and `words` for the response stream.
- `MetricsStrip.tsx` — 5-tile metrics row (`6 / 25 / 24h / 0–100 / AI-ready`) with a `<TypingHeadline>` at the top.
- `LogoMarquee.tsx` — 34s infinite-scroll customer logos with `WebkitMaskImage` edge fades and `animationPlayState: paused` on hover. Uses real customer logos (Netpower, SDS Manager, Canon, Unilever, DHL, Reckitt) from `public/logos/ko-*.png`. **Usage rights cleared with the user** before shipping.
- `Testimonials.tsx` — 3-card grid (Mirjam Meling / Jordan Lucena / Morten André Hjelle). Quotes are long-form here (vs. the short-form testimonials in `lib/content.ts` used by `TestimonialRail` elsewhere).
- `Loop.tsx` — dark "Tracking. Intelligence. Improvement. One loop." section with a `<TypingHeadline>` and 3 node cards on `var(--ink-surface)` background.
- `HomeCTA.tsx` — final dark rounded CTA banner with `<TypingHeadline>` and dual CTAs.
- `TypingHeadline.tsx` — shared helper. Continuously cycles `typing → holding 4.2s → deleting → retyping` with a blinking caret. Honors `prefers-reduced-motion` (renders static full text). Used by `MetricsStrip`, `Testimonials`, `Loop`, and `HomeCTA`.

**Theme scoping mechanism** — `.clv-dark` is the single class that flips the whole token system from light to dark. Applied in three layers, belt-and-suspenders against FOUC:

1. **Inline pre-hydration script in `app/layout.tsx`** — runs synchronously when the browser parses the head: `if (location.pathname === '/') document.documentElement.classList.add('clv-dark')`. This makes `<html>` carry `.clv-dark` from the very first CSS application, so the body bg paints `#08080b` instead of cream-flashing on initial load.
2. **`<ThemeShell />`** — client component, no markup. On `usePathname()` change, mirrors the script: adds `.clv-dark` for routes in the `DARK_ROUTES` set (`/` today), removes it elsewhere. Handles SPA navigation that the inline script can't see.
3. **`<div className="clv-dark">` wrapper in `app/page.tsx`** — scopes the dark tokens to the page content itself even if the global class somehow isn't there yet.

**`<html suppressHydrationWarning>` is intentional** and must stay — the bootstrap script modifies the className before React hydration, so the SSR'd html (no `.clv-dark`) differs from the live DOM (`.clv-dark` already added). Without `suppressHydrationWarning` the console fills with hydration warnings.

**Design tokens** (defined in `app/globals.css`, all light defaults; `.clv-dark` overrides to dark):
- Full ink alpha ramp: `--ink-90 / --ink-80 / --ink-70 / … / --ink-035`. In light, dark-on-cream at decreasing alpha. In `.clv-dark`, white-on-black at decreasing alpha.
- `--white`, `--subtle`, `--line`, `--ink-surface` — surface tokens that flip on dark scope.
- `--on-ink`, `--on-ink-70`, `--on-ink-60`, etc. — contrast text for dark surfaces (always white-on-dark, regardless of scope).
- `--positive`, `--positive-bg`, `--positive-border` — the **single** emerald accent (`#047857` / `#ecfdf5`). **Used only inside dashboard mocks** to mark affordance ("where you win", "↑ +18%" lifts). It is not a brand color — body copy and CTAs stay strictly B&W.
- `--logo-filter` — flips between `brightness(0)` (light) and `brightness(0) invert(1)` (dark) so engine SVGs render the right tone without per-logo asset duplication.
- `--header-bg`, `--focus-ring`, `--container-max`, `--section`, `--radius-pill`, `--radius-card`, `--shadow-card`, `--shadow-soft`, `--ease-out-expo`, `--display-{xl,lg,md,sm}`, `--track-display-{xl,lg,md}`, `--text-lead` — layout / type / motion atoms used inline-style throughout `components/home/`.

**`.clv-chat-island`** — a CSS class that resets to the light token ramp inside the chat box on the dark `ChatDemo` section. Used so the mock chat UI reads as a bright real-product surface glowing against the black page.

**`.clv-dark .btn-*` overrides** — `.btn-primary` is hardcoded dark-bg-white-text in the base layer, which collapses on a dark page. In `.clv-dark` scope: primary swaps to white-bg-ink-text, secondary to translucent-white-on-dark, invert / ghost adjusted to match. So Button primitives auto-flip without per-call variant changes.

**Keyframes** (in `globals.css`, prefixed `clv-` to avoid Tailwind collision): `clv-blink`, `clv-marquee`, `clv-pulse`, `clv-flow`, `clv-ping`, `clv-chatdot`, `clv-drift`, `clv-logo-fade`. Drive the caret, marquee scroll, ping dot, chat typing dots, card drift, and logo fade-in animations.

**When editing the homepage:** values are inlined with `style={{ … }}` referencing `var(--*)` — not Tailwind utilities — because Tailwind tokens are hardcoded to light values and don't auto-flip. Keep that pattern. For any new dark-scoped element, reach for `var(--ink)`, `var(--white)`, etc. instead of `text-ink`, `bg-white`.

**When NOT to extend this pattern:** new routes default to LIGHT (the brand book). Don't add a route to `DARK_ROUTES` without re-confirming with the user — the homepage exception was an explicit override approved 2026-06-19, not a license to switch the whole site to dark.

#### HaloMark (the brand mark)

The Clovion "C" mark is **vector-traced from the canonical brand PNG** (`logo-reference.png` at repo root, gitignored). `HaloMark` in `components/ui.tsx` contains three `<path>` elements (large outer chevron + small inner accent split into 2 sub-regions by an internal notch) wrapped in `<g transform="translate(-0.71, 221) scale(0.1, -0.1)">` (potrace's y-flip convention). `viewBox="0 0 201.173 219.836"` — the actual logo aspect ratio, not square. `fill="currentColor"` so the mark adapts to the parent's text color. **Single source of truth** — Header and Footer both consume it.

**To modify the logo, do NOT eyeball SVG coordinates from the PNG.** Three iterations of doing that all failed before switching to vector tracing. The deterministic pipeline (with `potrace` + `imagemagick` installed locally via Homebrew):

```bash
magick logo-reference.png -crop 240x232+0+0 +repage -trim +repage \
    -background white -alpha remove -alpha off -threshold 50% logo-cmark.pbm
potrace -s --tight -o logo-traced.svg logo-cmark.pbm
# render preview to confirm trace fidelity:
magick -background white logo-traced.svg -resize 400x400 -gravity center -extent 400x400 traced-preview.png
```

Paste the path data from `logo-traced.svg` into `HaloMark`, swap the hardcoded `fill="#000000"` for `fill="currentColor"` on the parent SVG, and keep the `<g transform>`. All trace intermediates (`logo-*.png`, `logo-*.pbm`, `logo-traced.svg`, `traced-preview.png`) are gitignored.

**Favicon (`site/app/icon.svg`)** uses the same three traced paths inside a 240×240 rounded square tile (white background `#ffffff`, ink-black mark `#0a0a0f`). Next.js 14's App Router auto-detects `app/icon.svg` and injects `<link rel="icon" type="image/svg+xml" href="/icon.svg" />` site-wide — no `layout.tsx` wiring needed. If you re-trace HaloMark, also update `icon.svg` so the favicon and Header/Footer marks stay in sync. The favicon transform is `translate(18.79, 231) scale(0.1, -0.1)` (centers the 201×220 mark inside the 240×240 square with light padding); HaloMark's transform is `translate(-0.71, 221) scale(0.1, -0.1)` because its viewBox is the natural mark dimensions.

#### HeroShade (corner vignette)

Drop-in component for hero `<Section>`s. Renders 4 soft radial gradients at the corners (~7% ink opacity) creating a subtle inward focus. Place inside any `<Section>` with `relative overflow-hidden`, after any existing decoration divs (`grid-bg`, `hero-bg`) and before the `<Container>`. Optional props: `intensity`, `spread`.

### Design system (in `app/globals.css` + `tailwind.config.ts`)

**Colors. Strict B&W brand book — no purple, no chromatic accents anywhere.** Body bg is cream `#FAFAF7`. Surfaces are white. Subtle alt bg is `#F5F3EF`. Line `#eceae5`. Ink `#0a0a0f` plus rgba steps via Tailwind tokens (`ink/80/70/60/50/40/20/10`). Mid-grays via Tailwind's built-in `neutral-*`. Distinctiveness comes from typography, density, surface contrast, dot-grid textures, and motion — **never color**. Gradients allowed but only monochrome (e.g. `from-black via-neutral-700 to-neutral-400`). **Do NOT reintroduce `purple-*` utilities.**

**Theme exception: the homepage `/` ships dark** (`--bg: #08080b`, white-on-dark ramp) per the 2026-06-19 design handoff, scoped via `.clv-dark`. The single emerald `--positive` accent (`#047857`) appears only inside dashboard mocks for affordance — not in body copy or CTAs. All other 20 routes remain on the light B&W book. Don't add new routes to the dark scope without explicit user authorization. Full mechanics in "Homepage / is its own world" above.

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

The homepage hero (`components/home/HomeHero.tsx`) is the **only centered hero on the site** and the only one on a dark surface. It uses a two-line headline (`See how {RotatingLogo} sees your brand.`) with a 6-engine logo crossfade replacing the old gradient-text emphasis pattern. **No gradient — the rotating logo IS the emphasis.** All other heroes are plain ink on cream, following the pattern block above.

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
- **Strict B&W brand book.** No purple, no chromatic accents. **Light theme everywhere except `/`**, which ships dark per the 2026-06-19 design handoff (single exception, do not extend without re-confirmation). Memory file `feedback_light_theme.md` records the override.
- **Saans-TRIAL-SemiBold is the typography.** Site-wide weight 600. `font-medium` and lower have been globally converted to `font-semibold`.
- **Homepage hero emphasizes via a rotating engine logo, not a gradient.** Headline reads `See how {RotatingLogo} sees your brand.` Other heroes are plain ink — no gradients, no rotating logo treatment.
- **Hero headlines are ≤5 words.** No exceptions.
- **Only marketing CTA is "Start free trial."** No "View demo", "Book a demo". Secondary CTA is "Get free score" → `/free-ai-visibility-score`. Sales CTA ("Talk to sales") is fine in pricing/enterprise context only.
- **Humanized voice.** Avoid triplet sentence rhythm, em-dash overuse, AI-startup buzzwords ("leverage", "unlock", "closed loop", "operating system", "the only X built for Y"). Vary sentence length. Section leads 20–25 words.
- **Header nav is short — 4 items.** Features (mega-menu) / Pricing / Customers / Blog. **Compare and Docs live in the Footer only**, moved out of the header deliberately.

## When editing

- Copy changes → `lib/content.ts` first, then inline strings in pages. Homepage `/` copy is mostly inlined per-section in `components/home/*` — that's intentional, the dark redesign sections are tightly co-located with their copy and aren't reused.
- New marketing sections for the LIGHT routes → add to `components/sections.tsx`. New sections for the DARK homepage → add to `components/home/`. Don't cross the streams.
- Design tokens → `tailwind.config.ts` for colors/spacing/animation (LIGHT side only — Tailwind utilities don't auto-flip on `.clv-dark`), `globals.css` for component classes (`.btn-*`, `.card`, `.section-y-*`, font tokens) AND the design-system CSS variables (`--ink-*`, `--positive`, `--logo-filter`, etc.) that DO auto-flip via `.clv-dark`. On the homepage, reach for `style={{ color: 'var(--ink)' }}` instead of `text-ink`.
- Featured cards that should feel premium → wrap in `<SpotlightCard>`
- New horizontal carousel → reuse the `TestimonialRail` scaffold; don't roll your own snap logic
- New page → `app/<route>/page.tsx` with `export const metadata` for SEO, hero pattern above, `<HeroShade />` inside the hero `<Section>`. Compose with `Section` + `Container` + `components/sections.tsx`. Client components can't export metadata — see `BlogIndex.tsx` and `free-ai-visibility-score/page.tsx` for the pattern (server wrapper imports client child, or skip metadata)
- Touching the logo → edit `logo-reference.png` (gitignored at repo root) → re-run the potrace pipeline (see HaloMark section) → paste new path data into `HaloMark` in `components/ui.tsx`. Single source — Header and Footer both consume it. Do not eyeball SVG coordinates.
- Bumping Next.js or any dependency → check `npm audit` first; Railway's vuln scanner hard-blocks deploys on HIGH CVEs. Patch within the major (e.g. `^14.2.x`) — avoid Next 16 unless you're prepared for the breaking-change cleanup.
- Deploy verification → curl `https://www.clovion.ai/?cb=$(date +%s)` for cache-busted live HTML, not the `*.up.railway.app` URL (it's no longer bound). Use `railway logs --build <id>` when a deploy fails — the security scanner output lives there, not in the runtime log.
- Multi-page mechanical sweeps (e.g. weight conversion, hero pattern application) → write a script in `.claude/workflows/` and run via the Workflow tool. Past scripts are precedents

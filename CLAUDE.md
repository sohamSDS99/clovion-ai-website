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
│   ├── public/logos/            # 7 engine SVGs + 6 customer knockout PNGs (Canon/DHL/Netpower/Reckitt/SDS Manager/Unilever), each normalized to a uniform 800×200 canvas
│   ├── components/home/mocks/   # the 4 PillarStepper dashboards, fully coded (JSX+CSS+SVG, zero raster) + motion.ts/glyphs.tsx shared primitives
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
- **Microsoft Clarity** — project `x8d3ot6py2`, inlined in `app/layout.tsx` `<head>` via `dangerouslySetInnerHTML` (`clarityBootstrap` constant). Same pattern as the dark-theme bootstrap — synchronous IIFE that sets up `window.clarity` queue and inserts the remote `https://www.clarity.ms/tag/x8d3ot6py2` script. Provides session recordings + heatmaps site-wide. Coexists with GTM/GA; no double-counting concern (separate vendor).

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
| Pricing tier cards (3 tiers: Starter/Growth/Enterprise) | `components/pricing/PricingTiers.tsx` | `pricing_card` + per-tier `plan_name` |
| Pricing comparison table CTAs | `components/pricing/ComparisonTable.tsx` | `pricing_table` + per-tier `plan_name` |
| Each marketing page hero / end CTA | the page's own `page.tsx` | `<page>_hero`, `<page>_final_cta`, etc. |
| Free-score form submit | `components/free-score/FeatureContent.tsx` (Hero.handleSubmit) | `free_score_page`, `free_score_hero` |
| Talk-to-Sales buttons (all 8 across pricing + legal + comparison/alt/feature CTABanners) | see "Talk-to-Sales → Calendly" section below | `pricing_card`, `pricing_table`, `pricing_faq`, `pricing_final_cta`, `legal_terms`, `final_cta` |

**Pricing tier CTAs live in a client island.** `app/pricing/page.tsx` is a server component (server wrapper + JSON-LD); the per-tier CTAs are rendered inside `components/pricing/PricingTiers.tsx` (a client island). The older `app/pricing/PricingTiers.tsx` is an intentional orphan from the rebuild — kept on disk, no longer imported. **Enterprise tier CTA** does not navigate — it opens the Calendly popup (see "Talk-to-Sales → Calendly" section).

**Catch-all safety net (GTM auto triggers, no code).** Anything not semantically wired still fires through the container's built-in auto triggers: `ui_click` for any `<a>`/`<button>`/`[role=button]`, `outbound_click` for non-`clovion.ai` hosts, `scroll` at 25/50/75/90% depth. Nav links, footer links, "Read the spec"-type inline CTAs all surface this way — just without the structured `cta_location` dimension.

**When adding a new page or CTA:** if the Button uses the standard "Start Free Trial" / "Get Free Score" text and you set `trackLocation="<page>_hero"`, the right semantic event fires automatically — no extra wiring needed. The matcher is case-insensitive substring (`text.toLowerCase().includes('free trial' | 'free score')`), so both title-case and lowercase variants route correctly.

## Talk-to-Sales → Calendly

Every "Talk to Sales" / "Talk to sales" CTA opens the Calendly **PopupWidget** ("Clovion AI Demo · 30 min" booking) as an in-page modal — no navigation, no new tab, no popup blocker.

**Why popup, not `<a target=_blank>`:** the earlier href-based wiring failed silently — Next.js `<Link>` intercepted external-URL clicks, and `target=_blank` on a plain anchor sometimes gets blocked. JS-driven popup bypasses all of that.

**The pieces:**

- **`site/lib/calendly.ts`** — single constant: `CALENDLY_URL = 'https://calendly.com/d/ds8v-39t-vjq/clovion-ai-demo'`.
- **`site/lib/openCalendly.ts`** — `openCalendly(location?, plan?)` helper. Pushes a `book_demo` dataLayer event then calls `window.Calendly.initPopupWidget({ url: CALENDLY_URL })`. Falls back to `window.open(_blank)` if the script hasn't loaded yet.
- **`site/app/layout.tsx`** — Calendly assets injected in `<head>`: plain `<link rel="stylesheet" href=".../widget.css">` + plain `<script async src=".../widget.js">`. **Use plain `<script async>`, NOT `next/script` with `afterInteractive`** — the latter only emits a preload link, the actual `<script>` tag never inserts, and `window.Calendly` stays undefined. Found the hard way.
- **`site/components/TalkToSalesButton.tsx`** — thin client-component wrapper. Used by server-component pages (e.g. `app/legal/terms/page.tsx`) that can't take inline onClick.
- **`Button` primitive (`components/ui.tsx`)** — auto-detects external URLs (`/^(https?:|mailto:|tel:)/i`) and renders plain `<a target="_blank" rel="noopener noreferrer">` instead of Next.js `<Link>`. Calendly URLs go through `TalkToSalesButton` / inline onClick handlers (not via href), so they hit the no-href `<button>` render path which spreads `...rest` and the inner onClick wrapper invokes `rest.onClick?.(e)`.
- **`CTABanner` (`components/sections.tsx`)** — detects `secondaryHref.startsWith('https://calendly.com')` and renders an `<a href={secondaryHref}>` with `onClick={(e) => { e.preventDefault(); openCalendly('final_cta') }}`. href kept as no-JS fallback. Other external URLs still render `<a target=_blank>`; internal hrefs render `<Link>`.

**Callsites (8 total):**

| Where | File | onClick location |
|-------|------|------------------|
| /pricing Enterprise tier card | `components/pricing/PricingTiers.tsx` | `openCalendly('pricing_card', 'Enterprise')` |
| /pricing comparison-table Enterprise CTA | `components/pricing/ComparisonTable.tsx` | `openCalendly('pricing_table', 'Enterprise')` |
| /pricing FAQ side-link "Talk to sales" | `components/pricing/FeatureContent.tsx` (~line 397) | `openCalendly('pricing_faq')` |
| /pricing final-CTA "Talk to Sales" | `components/pricing/FeatureContent.tsx` (~line 524) | `openCalendly('pricing_final_cta')` |
| /alternatives/profound CTABanner secondary | `app/alternatives/profound/page.tsx` (`secondaryHref={CALENDLY_URL}`) | `openCalendly('final_cta')` (via CTABanner) |
| /compare/clovion-vs-profound CTABanner secondary | `app/compare/clovion-vs-profound/page.tsx` | same |
| /features/platform-coverage CTABanner secondary | `app/features/platform-coverage/page.tsx` | same |
| /legal/terms `<TalkToSalesButton>` | `app/legal/terms/page.tsx` | `openCalendly('legal_terms')` |

**Calendly account branding caveat.** The booking modal's logo, colors, host name, and intro copy are controlled by the Calendly account that owns the booking URL — NOT by anything in this codebase. Cross-origin policy blocks editing iframe content from our side. To change the in-modal logo, update the Calendly account's workspace branding (Account → Branding → upload logo). URL params like `background_color=` / `text_color=` / `primary_color=` tune embed CSS only.

**stale `lib/content.ts` data:** `pricingTiers[i].cta === 'Talk to sales'` and `app/pricing/PricingTiers.tsx`'s `tier.cta === 'Talk to sales' → CALENDLY_URL` are intentional orphans (old code path, no longer rendered). Real wiring lives in `components/pricing/PricingTiers.tsx`.

## Free AI Visibility Score backend

The `/free-ai-visibility-score` page is interactive — users type a domain, hit submit, and see a real scored breakdown.

### Backend — `site/app/api/free-score/route.ts`

POST endpoint, Node runtime, `maxDuration = 60`. Hardened in commit `7f34376` after the original implementation returned identical templated scores (45 with 40/60/30/50 subscores) for any unknown brand — the model collapsed to a memory template instead of grounding in fresh web search. Current pipeline:

1. **Rate limit by IP first** (cheapest reject). In-memory token bucket on `globalThis.__clvIpRateLimit`, **5 req / 60s / IP**. Returns `429` with `Retry-After` header. IP comes from `x-forwarded-for` then `x-real-ip` then `'unknown'`.
2. **Validate body** — JSON body must contain `domain: string`, non-empty.
3. **Normalize + validate domain** — `validateDomain()` lowercases, strips protocol/www/path, then rejects: empty, length > 253, fails `/^[a-z0-9.-]+\.[a-z]{2,}$/i`, **literal IPv4 (`^\d+\.\d+\.\d+\.\d+`), localhost / RFC1918 ranges (`127.`/`10.`/`172.16-31.`/`192.168.`)**. SSRF defence — model could otherwise be told to research internal hostnames.
4. **Cache hit** — `globalThis.__clvDomainCache` Map keyed by normalized domain, **24h TTL**. Returns `{ domain, result, cached: true }` instantly (~20ms vs ~8s fresh).
5. **Call OpenRouter** via `callModel()` — `openai/gpt-4o` (no `:online` suffix; we use explicit `plugins: [{ id: 'web', max_results: 8 }]` so the web tool is forced per request, not a memory shortcut). Temperature 0.6 on first pass. Wrapped in `AbortController` with **25s timeout** → maps to `504`. **`JSON.stringify(domain)` in the user prompt** to neutralise newline-based prompt injection. **`MAX_RESPONSE_BYTES = 100_000`** size guard before `JSON.parse` (memory-bomb defence).
6. **`validateShape()`** — hard checks: 4 subscores, 4 platforms, ≥1 prompt, ≥1 recommendation, all numeric fields finite + in `[0, 100]`. Malformed → 502.
7. **`detectTemplate()`** — smell-counting validator. Smells: `score === 45`, all subscores mid-band multiples of 5, all platform scores mid-band multiples of 5, recommendation lift triplet matches a known canonical (`8/5/3`, `11/7/4`, `12/8/5`, `10/6/3`, `9/6/3`, `10/5/3`, `9/5/3`, `7/5/3`, `7/4/3`, `6/4/3`), lifts in tight-clustering small-integer pattern, evidence_excerpts missing/under-2, brand name absent from any evidence excerpt. **Rejects only at smells >= 3** so a legitimately-round value for a well-known brand doesn't false-positive.
8. **`normalizeStrong()`** — enforces `strong = score >= 70` per platform deterministically (the model occasionally ignores its own rule and sets `strong:true` at 69).
9. **Retry on template** — second call at temperature 0.9 with `--- RETRY CONTEXT ---` addendum quoting the specific rejection reason, same `openai/gpt-4o` model (`perplexity/sonar-pro` retry was tried but returns 400 on `response_format: json_object`).
10. **Cache + return.** Confidence-passing results are cached; "both attempts templated" results are returned but **not cached** so the next request gets a fresh chance.

**Anti-template prompt rules (system message).** Forbids round mid-band defaults (40, 45, 50, 55, 60), demands `evidence_excerpts` array of 3 literal web quotes, requires brand to appear in evidence, demands per-brand variance in lift integers (no fixed triplet across brands), **competitor scope rule** — same buying-decision category + geography, not adjacent-category players (vector DBs ≠ LLM API competitors; universities ≠ edtech platforms; SE Asian super-apps ≠ Indian payment apps), and a **prompt-integrity rule** instructing the model to treat the domain string as data, never as instructions.

**Error responses are sanitized.** Clients receive `{ error: 'scan failed', code: 'timeout'|'upstream'|'malformed' }` only. Full upstream detail is logged server-side via `console.warn` tagged `[free-score]` — never leaked to the client.

**Returns** `{ domain, result: FreeScoreResult, cached?: true }`. `result.evidence_excerpts` is an optional `string[]` field on `FreeScoreResult` introduced by the hardening; older callers tolerate its absence.

### Frontend — `site/components/free-score/FeatureContent.tsx` + sub-components

Form state (`stage`, `domain`, `submittedDomain`, `stepIndex`, `scanResult`, `scanError`). Two useEffects watch `stage === 'analyzing'`: one walks the mock step indicator, the other fires the real fetch and owns the stage transition. Mock `SCORE / SUBSCORES / PLATFORMS / SAMPLE_PROMPTS / RECOMMENDATIONS` constants render only during idle/analyzing — production scan results take over via length-aware fallback patterns like `(scanResult?.subscores && scanResult.subscores.length === 4) ? scanResult.subscores : SUBSCORES` (the old plain `??` fall-through on empty arrays was patched in the same commit).

`isValidDomain()` mirrors the backend regex exactly so obviously-invalid inputs don't round-trip the API for a generic 400. The "Try: notion.so" pill is guarded against `stage === 'analyzing'` so a mid-scan click can't restart the effect.

**Sub-component patches in the same commit:**
- `ScoreDial.tsx` — `Number.isFinite` guard + `Math.max(0, Math.min(100, score))` clamp on the arc math; an undefined or out-of-range score no longer produces NaN paths.
- `PromptCards.tsx` — `escapeForRegex()` helper on `brandWord` before constructing the `HighlightedExcerpt` RegExp. Brands containing `.`, `+`, etc. (e.g. "Booking.com", "C++") used to throw or mis-match. Empty-brand guard added.

### Env + ops

- **`OPENROUTER_API_KEY`** in `site/.env.local` for dev; Railway env var for prod. Missing key → `503 service unavailable` (no longer the leak-y 500 message it used to be).
- **In-memory caches / rate-limit are per-instance.** Railway currently runs a single replica, so this works. If you ever scale to multiple replicas, move both maps to Redis or shared SQLite (the admin console's better-sqlite3 setup on `feat/console-foundation` is the obvious home).
- **Header gotcha (historical):** the `X-Title` header sent to OpenRouter must be pure ASCII — an em-dash (U+2014) crashes the `Headers` constructor. We use `-` or `|`, not `—`.

### Costs (rough)

`openai/gpt-4o` + 8-result web plugin = ~$0.07 per uncached scan. Cache hits are ~$0. Retry on template doubles the cost when it fires (we observed it fires on roughly 2–4 % of unknown-brand scans).

## Section seam blending (dark routes)

The dark homepage initially showed visible horizontal seams where one section's tinted bg butted up against the body's `var(--bg)` (`#08080b`). Fix is uniform: every section whose bg differs from the body uses a **vertical fade gradient** that resolves to `var(--bg)` at top and bottom so seams disappear into the body tone.

- **Solid-bg sections** (Loop, Testimonials, LogoMarquee) — outer `style.background = 'linear-gradient(to bottom, var(--bg) 0%, <tint> 8%, <tint> 92%, var(--bg) 100%)'`. The middle 84% shows the tint at full opacity; top/bottom 8% fades to body. LogoMarquee uses 14% fade because the section is short. Border-top/bottom hairlines were dropped where they'd fight the fade.
- **ChatDemo (the long pinned one)** — original solid radial `#14141c → #17171c` was a visible rectangle. Replaced with `var(--bg)` base + 3-4 **layered low-alpha white radial-gradients** with `transparent` endpoints at offset positions (50/30, 78/80, 22/76, etc). Each radial fades to nothing at its outer edge → no rectangle, just an atmospheric halo around the floating cards. Brand-safe: pure white over pure ink, no chromatic tints. Mobile fallback (short section) uses 3 glows; desktop 500vh uses 4 glows spread vertically so depth holds across the full pin.

Adjacent sections with no bg inherit `var(--bg)` so every seam resolves to the same base tone. Apply the same pattern when adding new dark sections — never butt a tinted bg directly against body bg.

## Mobile-first responsive patterns

The site shipped responsive in a single sweep — 33 files touched across the dark feature pages, pricing, chrome, light pages, sections, and globals. Canonical pattern set (use these names in commits and reviews):

- **P1 — Hero 2-col**: `className="grid grid-cols-1 gap-10 md:grid-cols-[1.02fr_1fr] md:gap-16 items-center"`. Used by every dark feature page's hero (left text + right mockup).
- **P2 — Equal 2-col**: `grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12`. Used by FeatureBlock pairs and 1fr-1fr sub-sections.
- **P3 — N-col**: `grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8` (3-col); same with `md:grid-cols-4` for 4-col; `grid-cols-2 md:grid-cols-5` for MetricsStrip's 5-col.
- **P4 — FAQ sticky**: `grid grid-cols-1 gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16` + move sticky to the inner child via `lg:sticky lg:top-24` so the sidebar only sticks at lg+ (stacked layout would break sticky on mobile).
- **P5 — Comparison tables**: wrap with `<div className="-mx-4 overflow-x-auto md:mx-0 md:overflow-visible"><div className="min-w-[640px] md:min-w-0 px-4 md:px-0">…</div></div>`. Keeps fixed-fr grid templates inside; user horizontal-scrolls on mobile.
- **P6 — Dashboard mock wrap**: `<div className="overflow-x-auto md:overflow-visible"><div className="min-w-[420px] md:min-w-0">{mock}</div></div>`. Preserves the dense fixed-px internal grids by letting users horizontal-scroll them on phones.

**Mobile-first by convention.** Default class targets mobile (`grid-cols-1`, `gap-6`, smaller padding), responsive prefixes (`sm: md: lg:`) add desktop behavior. Inline `style={{ gridTemplateColumns: '...' }}` is the OLD pattern — replace with `className` whenever the grid needs to collapse. `globals.css` carries the matching mobile compression: `.display-xl/lg/md` `clamp()` floors go to `2rem / 1.75rem / 1.5rem` so headlines compress under 320px, and section padding has a `@media (max-width: 640px)` override compressing to `clamp(2.5rem, 7vw, 4rem)`.

**Chrome mobile specifics**: mega-menu dropdown clamped to `w-[min(480px,calc(100vw-2rem))]` + `hidden lg:block` (mobile uses the drawer). Mobile drawer has `max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain`. Footer columns default `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`. Sticky header pads with `pt-[env(safe-area-inset-top)]` for the iOS notch. Hamburger is 44×44px tap target.

## Architecture

### Content is centralized, not inline

`site/lib/content.ts` is the single source of truth for nearly all copy. Key exports:

- `brand`, `nav` — brand identity + the 4-item header nav (Features parent has NO href; it's a mega-menu trigger only. Children: 7 items — AI Visibility Tracking / GEO Improvement Suggestions / Sentiment Analysis / Brand Perception / Fanout Query / AI Crawlability / Platform Coverage. "Brand Perception" and "Sentiment Analysis" are now DISTINCT pages — see route map below)
- `features` (3 entries), `platforms` (10 AI engines), `aiEngines`, `integrations`
- `customers` (8 logos), `customerStories` (3 featured), `testimonials` (9, short-form)
- `pricingTiers` (4: Free/Starter/Growth/Enterprise) — **STALE**, no longer drives `/pricing`. The dark rebuild hardcodes 3 tiers ($79/$229/Enterprise) inside `components/pricing/PricingTiers.tsx`. `addOns`
- `faqs` (10), `principles` (4), `leadership` (4), `companyStats` (4), `homeMetrics` (4)
- `compareCompetitors` + `compareMatrix` (for the /compare hub and vs-pages)
- `blogCategories` (3), `blogPosts` (12)
- `changelogEntries` (8), `docsSections`, `offices` (3)

When editing copy, edit there first. Pages import from this file and render the data — don't add new hardcoded strings unless they're truly page-specific.

Pages with meaningful inline content: `app/page.tsx` (homepage section composition), the 9 dark pages' `components/<feature>/FeatureContent.tsx` composers (heavy section + copy co-location, by design), `app/docs/page.tsx` (quickStart tiles, browseSurfaces, frameworkQuickstarts), `app/blog/BlogIndex.tsx` (filter logic). Legal pages have prose-style inline content by nature.

**Testimonials are short-form (~20–28 words each).** Intentionally trimmed for card-readable length in `TestimonialRail`. If you add more, match that length. Preserve concrete numbers (e.g. "8.4× mentions", "5.2× share of voice") and real-sounding voice.

### Pages map 1:1 to routes (Next.js App Router)

**Marketing surface — 26+ routes on `main`. Most ship dark — see "Dark theme" section below for the current scope. Light theme is rare now (mostly redirects). Route list:**

```
/                                              (DARK — homepage, uses components/home/*)
/features                                      (REDIRECT → / via redirect('/') — no longer a destination)
/features/ai-visibility-tracking               (DARK — components/ai-visibility/*)
/features/geo-improvement-suggestions          (DARK — components/geo/*)
/features/sentiment-analysis                   (DARK — components/sentiment/*. Nav label now reads "Sentiment Analysis" — was previously "Brand Perception" until a dedicated brand-perception page was built; URL slug unchanged)
/features/brand-perception                     (DARK — components/brand-perception/*. NEW page built from product spec PDF. 7 sections: Hero / Four Dimensions / Perception Attributes table / How It Works 3-step / From Description to Direction / 10-Q FAQ / Final CTA. Distinct from sentiment-analysis — that one tracks positive/neutral/negative tone, brand-perception extracts the WHAT — ease of use, audience fit, pricing perception, maturity, etc.)
/features/fanout-query                         (DARK — components/fanout/*)
/features/ai-crawlability                      (DARK — components/crawl/*)
/features/platform-coverage                    (LIGHT — unchanged from initial rebuild)
/pricing                                       (DARK — components/pricing/* with 3 tiers + billing toggle)
/affiliate                                     (DARK — components/affiliate/*)
/blog                                          (DARK — components/blog/*, ChipRail filter + featured card + post grid + newsletter band + FAQ)
/blog/category/geo                             (DARK — same composer with initialCategory='geo')
/blog/category/ai-search                       (DARK — same composer with initialCategory='ai-search')
/blog/category/seo                             (DARK — same composer with initialCategory='seo')
/compare
/compare/clovion-vs-profound
/alternatives/profound
/customers                                     (DARK — components/customers/*, LogoWall hero mock + filter grid + testimonials + FAQ)
/docs
/docs/getting-started
/free-ai-visibility-score                      (DARK — components/free-score/*, interactive scan via /api/free-score)
/about
/changelog
/legal/privacy
/legal/terms
```

The dark feature pages all share the same architecture: a server `page.tsx` exports `Metadata` + embeds 1–2 JSON-LD blocks (FAQPage + optionally SoftwareApplication) + wraps a client `FeatureContent` composer in `<div className="clv-dark clv-ai-vis-page">`. The `.clv-ai-vis-page` class is the scope token for Hanken Grotesk paragraphs (despite the name suggesting AI-visibility-only — it's shared across all 6 dark feature/pricing/affiliate pages).

**Admin console — `/admin/*` tree (on `feat/console-foundation`, not yet merged to main):**

`/admin` overview, `/admin/login`, `/admin/accounts` (+ `[id]` detail), `/admin/acquisition`, `/admin/activation`, `/admin/alerts`, `/admin/audit`, `/admin/engagement`, `/admin/flags`, `/admin/funnels`, `/admin/gdpr`, `/admin/operations`, `/admin/performance`, `/admin/pipeline`, `/admin/retention`, `/admin/revenue`. Has its own `app/admin/layout.tsx` (separate from the marketing root layout), its own `/admin/login` sub-layout, and reads env vars from `site/.env.example`. Architecture decisions are captured in `CLOVION_CONSOLE_PRD.md` at the repo root; planning notes in `ADMIN_BUILD_PLAN.md` / `ADMIN_PRD_SPEC.md` / `ADMIN_REVIEW_NOTES.md` / `ADMIN_METRICS_RESEARCH.md`. The marketing surface uses `FooterGate` (also added on this branch) to hide the marketing Footer on admin routes.

**Root layout (`app/layout.tsx`)** wires three fonts:
- Saans-TRIAL-SemiBold via `next/font/local` (`--font-display` / `--font-body`)
- JetBrains Mono via `next/font/google` (`--font-mono`)
- **Hanken Grotesk** via `next/font/google` (weights 400/500, `--font-body-reg`) — used only on pages with the `.clv-ai-vis-page` scope class to give paragraph copy a true regular weight (Saans ships only SemiBold)

Plus `<ChromeHeader />` + `<ChromeFooter />` gates (pick light or dark chrome by pathname), `<ThemeShell />` (toggles `.clv-dark` on `<html>` for SPA navigations), an inline pre-hydration `<script>` that synchronously sets `.clv-dark` based on a path check that matches all dark routes, **Google Analytics 4**, **Google Tag Manager**, the **`LeadCaptureModal`** (mounted once at the bottom of `<body>` so any "Get Free Score" CTA across the site can open it), and SEO/verification metadata. `<html suppressHydrationWarning>` is intentional — the bootstrap script mutates className before React hydration. See the dark-theme architecture section below for the full scoping story.

### Component layers

- `components/ui.tsx` — server-rendered primitives: `Container`, `Section`, `Button`, `Card`, `Eyebrow`, `Tag`, `GradientOrb`, `HeroShade`, `ArrowRight`, `Check`, `HairlineDivider`, `HaloMark`. `Button` variants: `primary` | `secondary` | `ghost` | `invert`. The `Button` primitive carries the dataLayer tracking props (`trackLocation` / `trackEvent` / `trackPlan`). **Matcher is case-insensitive** — `extractText(children).toLowerCase().includes('free trial' | 'free score' | 'book a demo')` — so title-case ("Start Free Trial") and lowercase variants both route to `start_trial` / `get_free_score` / `book_demo` events. **External-URL detection** (`/^(https?:|mailto:|tel:)/i`): when `href` matches, renders plain `<a>` instead of Next.js `<Link>`. **Same-domain heuristic** layered on top: URLs whose hostname is `clovion.ai` or any `*.clovion.ai` subdomain (`app.clovion.ai/login`, `app.clovion.ai/signup`, etc.) render **without** `target=_blank`/`rel=noopener` — they navigate in the same tab so the user moves into the product, not a new window. Off-domain externals (calendly.com, social) keep `target=_blank rel=noopener noreferrer`. Internal `href` still renders `<Link>`. Omitting `href` renders a real `<button>` and forwards any `onClick` from props (the `<button>` path spreads `...rest` then overrides with an inner onClick that calls `fireTracking()` followed by `rest.onClick?.(e)`).
- `components/sections.tsx` — composed marketing sections used on the LIGHT routes: `AIEngineStrip`, `FAQ`, `CTABanner`, `StatStrip`, `FeatureGrid`, `TestimonialRail`, `TestimonialPullQuote` (legacy). Marked `'use client'`. Not used on dark feature pages.
- `components/Chrome.tsx` — client gate. Routes pathname to light Header/Footer or dark HomeHeader/HomeFooter. All dark routes match the `HOME_ROUTES` Set inside Chrome (mirrors `DARK_ROUTES` in ThemeShell and the inline bootstrap OR-chain in `app/layout.tsx`).
- `components/Header.tsx` + `components/Footer.tsx` — LIGHT variants for non-dark routes. **"Features" is a `<button>` (not a Link)** — it has no href, exists only to open the mega-menu on hover/focus. Mobile nav renders Features as a non-link section header with its 6 children flat-listed below.
- `components/HomeHeader.tsx` + `components/HomeFooter.tsx` — DARK variants. Same nav-button treatment for Features. **HomeFooter Company group is intentionally lighter than Footer** — only About / Customers / Affiliate Program (Compare / vs Profound / Profound alternatives were removed from the dark variant; light Footer keeps them).
- `components/ThemeShell.tsx` — tiny client gate. On `usePathname()` change, toggles `.clv-dark` on `document.documentElement` based on `DARK_ROUTES` (Set of explicit paths) plus a prefix scan for `/blog/`, `/news/`, `/webinars/`, `/resources/`, `/faq/`, `/compare/`, `/alternatives/`, `/docs/`, `/legal/`. Pairs with the inline bootstrap script in `app/layout.tsx`.

**Dark feature page components** — one directory per route, each with the same internal pattern (`FeatureContent.tsx` composer + per-section mocks + utility helpers):
- `components/ai-visibility/` — HeroDashboard, EngineGrid, SentimentChart, CitationPanel, GapFinder, WindowChrome, FeatureContent
- `components/geo/` — FixQueue, CategoryExplorer (segmented + animated bars), RulePanel, DiffPanel, ResolvedPanel, IntegrationStrip, StellarOrbit (score-climb ring gauge), GeoWindow, FeatureContent
- `components/sentiment/` — SentimentDashboard, SentimentExplorer, SentimentDetailCard (rose→emerald morph), SentimentDiagnosed, SentimentImproved, SentUtilities, FeatureContent
- `components/brand-perception/` — FeatureContent only (single composer file, ~1100 lines). All sections inlined: Hero (with per-engine attribute extraction mock), Four Dimensions intro, 8-row Perception Attributes table, 3-step How It Works (Surfaced/Diagnosed/Improved), From Description to Direction perception card, sticky 10-Q FAQ accordion, dark Final CTA. Built from product spec PDF — copy must remain verbatim, never paraphrased
- `components/fanout/` — FanoutDashboard, FanoutExplorer, FanoutExpanded, FanoutAnalyzed, FanoutImproved, FanoutMap (sequential branch reveal), FanoutUtilities, FeatureContent
- `components/crawl/` — CrawlDashboard (3-preset robots.txt selector), CrawlExplorer, CrawlAccessOpened (diff), CrawlContentReadable (dark FAIL rule), CrawlFilesGenerated, CrawlMap (4-gate sequential), CrawlUtilities, FeatureContent
- `components/pricing/` — PricingTiers (3 tiers + billing toggle + Recommended pill), ComparisonTable (17-row matrix), FeatureContent
- `components/affiliate/` — ReferralFlow (3-node animated loop), FeatureContent
- `components/customers/` — LogoWall (hero mock), FeatureContent (server wrapper exports Metadata + JSON-LD; client composer renders LogoWall hero + 5-tile metrics + 3 featured case stories + filterable 28-row grid + 6 testimonials + customer FAQ + dark FinalCTA), utils
- `components/blog/` — FeatureContent (server wrapper at `app/blog/page.tsx` + 3 category-page wrappers all pass `initialCategory` into the same client composer; sections are hero + featured card + ChipRail filter + post grid + newsletter band + blog FAQ + dark FinalCTA), utils
- **`components/cms/PostHeader.tsx`** — the **canonical** header for every CMS post `[slug]` template (blog + news). Renders, in this fixed order: back-link → eyebrow → title → **cover image (always directly below the title)** → excerpt → meta. Both `app/blog/[slug]/page.tsx` and `app/news/[slug]/page.tsx` use it. **Never hand-roll a post header / place the cover image in a separate later section again** — that's what put the blog cover below the excerpt/meta. Add new post types via this component so the cover stays under the title.
- `components/home/*` — homepage `/` section components (updated 2026-06-23 — see "Section components for /" below)

**Dead code from the prior homepage design** (orphan, safe to delete):
- `components/Hero.tsx`, `components/HomeInteractive.tsx`, `components/SpotlightCard.tsx` — replaced by `home/*` equivalents
- `app/pricing/PricingTiers.tsx` — intentional orphan left by the pricing rebuild (new version is `components/pricing/PricingTiers.tsx`)

**Stale `/features` links** flagged by audit (2 anchors still target the redirect-to-home route — clicking lands on `/` silently but semantically wrong): `components/home/PillarStepper.tsx` `MockPanel`'s `<Link href="/features">` (renders for Perception, Rankings, Recommendations pillars; Visibility is full-bleed so no link), `components/ai-visibility/FeatureContent.tsx` (~line 715). Down from 4 — Loop now goes to Calendly, free-score's old link was removed in its dark redesign. Cleanup-worthy.

**Name collision watchout.** Two `LogoMarquee` exports coexist: the OLD text-wordmark version in `components/sections.tsx` was previously used by `app/features/page.tsx`, but `/features` now just redirects to `/` so that consumer is gone. The NEW real-image marquee at `components/home/LogoMarquee.tsx` is homepage-only. The text-wordmark version may now be orphaned — audit before relying on it.

#### Dark theme — broad coverage (was just `/`)

Originally only `/` shipped dark per the 2026-06-19 design handoff. Subsequent sessions expanded dark scope dramatically. Now covers: `/`, all 7 `/features/*` pages (ai-visibility-tracking, geo-improvement-suggestions, sentiment-analysis, brand-perception, fanout-query, ai-crawlability, platform-coverage), `/pricing`, `/affiliate`, `/free-ai-visibility-score`, `/customers`, `/about`, `/changelog`, and every page under `/blog/`, `/news/`, `/webinars/`, `/resources/`, `/faq/`, `/compare/`, `/alternatives/`, `/docs/`, `/legal/` prefixes. Light theme is rare now (mostly redirects, legacy `/features` redirect-to-home). Don't add to `DARK_ROUTES` (or the prefix list) without explicit user authorization for that page.

**Homepage font override.** `app/page.tsx`'s root wrapper carries a `clv-home` class. A `globals.css` rule — `.clv-home, .clv-home * { font-family: var(--font-saans) … !important }` — forces **everything on `/` to Saans SemiBold**, overriding the JetBrains-mono labels and Hanken/`--font-body-reg` body text used inside the coded mocks (the `!important` beats their inline `font-family`). Per the user's directive that the whole homepage be Saans SemiBold. Scoped to `/` only (other routes keep mono/Hanken).

**Section components for `/`** — under `components/home/`, used only by `app/page.tsx`:

- `HomeHero.tsx` — centered hero. Headline reads `See how AI {RotatingLogo} sees your brand` where `RotatingLogo` crossfades through six engine SVGs (ChatGPT → Claude → Gemini → Perplexity → Grok → Google AI) every 2s. CTA row: **Start Free Trial** (→ `https://app.clovion.ai/signup`, same-tab via the Button same-domain heuristic) + **Get Free Score** (→ `/free-ai-visibility-score`). Below: dashboard `HeroBento` mock (dark, fully coded, `IntersectionObserver` reveal). It's a single app-window frame ("Workspaces / Clovion AI / Citations" chrome bar) split into two panels by a hairline: **left** = Citation Score (emerald `4.4%` count-up + "Cited in 46 of 1038 cited answers" + 5 muted **ink-alpha** bars (greyscale ramp) that pop up one-by-one **once** on scroll-in (staggered `scaleY` transition, not a loop), topped by colored third-party brand glyphs — Microsoft/Monday/green-check/Atlassian/Asana); **right** = Citation categories (custom SVG donut that draws segments via `stroke-dashoffset`, **ink-alpha grey** segments + **emerald `#047857` for Owned** (the one positive accent), `16,542` count-up center, staggered legend with %/counts). **Both charts follow the brandbook palette (section 09): one ink + alphas of ink, emerald positive-only, no new hues, no glows.** The donut is **interactive** — hovering a segment thickens/brightens it while the others dim, syncs the matching legend row (also hoverable), and shows a cursor-following dark tooltip (label / value / % of total). Chrome bar uses red/amber/green mac traffic-light dots. The card surface flips to white via the `LIGHT` palette spread (like the PillarStepper mocks). A floating **"Ask Clovion AI" composer** overlays the lower area (rises in with an expo spring while the dashboard fades to white around it (a radial white fade centered under the composer — content dissolves into a bright mist, not a dark dim), then gently floats): a single-row chatbox with the Clovion `HaloMark` logo, a typewriter that cycles two lines ("Ask Clovion AI" → "Ask about your AI visibility") with a trailing caret, and a black "Send →" pill. The composer is `pointer-events:none` so the donut hover still works beneath it. All transitions use a local `EASE` cubic-bezier literal (never `var(--*)` in a transition shorthand); reduced-motion snaps to final. Replaced the earlier "28.4% visibility + 5 engine rows" bento.
- `PillarStepper.tsx` — sticky-pinned 4-pillar section. **Scroll-driven** (no wheel hijack — that was ripped out after 5 failed iterations; see commit `503bb12`). Left: vertical pillar list. Right: framed product-UI mocks (`MockVisibility`, `MockPerception`, `MockRankings`, `MockRecommendations`). **Heading lives INSIDE the sticky pin** AND **stays pinned at the top of the viewport** throughout the pillar scroll (not centered) so the H2 + subtitle remain visible above whatever pillar is active.
  - `STEP_VH = 60` (`const` at top of file) → pin container is `4 × 60 = 240vh`. Sticky inner is 100vh, **`justifyContent: 'flex-start'` + `paddingTop: clamp(64px, 11vh, 110px)`** so the heading anchors near the top of the viewport throughout the pin.
  - One passive `scroll` listener + rAF-throttled `compute()` reads `pinRef.current.getBoundingClientRect()`, maps progress 0→1 across the engagement window to idx via `Math.floor(progress * N)`. Active pillar setter only fires when idx changes; `prog` (fractional progress within the active pillar) updates when delta > 1%. No `preventDefault`, no gesture-detection state machine, no `scrollTo`-based snap.
  - Mobile: `matchMedia('(max-width: 1000px)')` early-return — listener doesn't attach, pillars stack with all 4 mocks rendered linearly.
  - **Right column ratio** is `minmax(220px, 0.32fr) 1.68fr` (pillar list / mock) — widened from the original 0.5fr/1.5fr so the mock panel takes ~84% of the grid. **The mock slot tracks the active pillar's aspect** — `width: 100%; aspectRatio: PILLARS[active].mockAspect; maxHeight: calc(100vh - 300px)` — so each dashboard fills its frame edge-to-edge with no letterbox or dark gap (this replaced the old fixed `clamp()` slot height that caused gaps on tall viewports).
  - **Heading H2 line-height is 1.2** (was 1.05 — opens the two H2 lines so they don't crash together) and **subtitle font-size 1.075rem** (was 0.95rem — slightly bigger for readability). Heading wrapper marginBottom `clamp(40px, 5vh, 72px)`.
  - **`MockPanel.isFullBleed` is driven by `Pillar.mockAspect`**, NOT by sku. Any pillar with a `mockAspect: 'W / H'` field is rendered full-bleed — no headline, no body copy, no "Explore..." link inside the card; the picture IS the visual. The outer card shrinks to that aspect, aligned `flex-start` so its top sits at the top of the slot. Pillars **without** `mockAspect` keep the chrome layout (h3 + body + Link + inner subtle-bg mock frame).
  - **All four mocks are now fully coded — JSX + CSS + inline SVG, ZERO raster.** They live under `components/home/mocks/` (the PNGs in `public/home/` and the `next/image` import were deleted). Each is a client component `export function MockX({ show }: { show: boolean })` that fills its 100%×100% full-bleed slot and plays a choreographed reveal when `show` flips false→true. Dark-surface dashboards (`var(--white)`/`var(--ink)` tokens, monochrome competitor glyphs, emerald `var(--positive)` only for affordances, a single muted red `#e5484d` for negative/need-work/high pills+dots). Scale via **container-query units (`cqw`)** — `containerType: 'size'` on each root — so they read correctly at any width.
    - `mocks/motion.ts` — shared primitives: `cb` (= `'cubic-bezier(0.16, 1, 0.3, 1)'`, the literal to inline in transition shorthands), `useReducedMotion`, `useReveal(active)` (latches), `useCountUp`, `useStagger`, `useTypewriter`. All snap to final under `prefers-reduced-motion: reduce`.
    - `mocks/glyphs.tsx` — monochrome inline-SVG marks (`MondayGlyph`, `PipedriveGlyph`, `SalesforceGlyph`, `ChatGptGlyph`, `DiamondCheck`, `EngineGlyph`, `UserGlyph`), all `currentColor`, distinguished by shape not color.
    - **Pillar 1 `MockVisibility`** (`1864 / 1075`) — KPI count-up tiles, scaleX breakdown bars, `stroke-dasharray` line chart (3 series), fly-in Jun 12 tooltip.
    - **Pillar 2 `MockPerception`** (`1834 / 961`) — a **once-through choreography** driven by a single `setTimeout` phase timeline (NOT chained on rAF completion — that races/stalls): (1) prompt types, (2) Monday card types, (3) Pipedrive card types, (4) highlights paint in one-by-one (sequential `background-color` transition), (5) **two black attribute notes** pop per card, each CSS-anchored beside a highlight (above/below it, annotation-style) — Monday: "Industry: SaaS" above "strong free tier" + "Buyer Persona: Founder" below "…advanced features are locked"; Pipedrive: "Buyer Persona: Founder" above "flexible modern CRM" + "Perception: Easy to use" below "power and flexibility" (config in `CARD_NOTES`), (6) right "Perception Drivers and Gaps" sidebar reveals last (heading typewriter + driver/gap reveal; each box shows its top 3 rows) — with a faint **skeleton** reserving the sidebar space during the build-up. No intro response box, no colored tag rows (one black note per card instead); extra gap between the Monday and Pipedrive cards. Reduced-motion jumps `phase` straight to final.
    - **Pillar 3 `MockRankings`** (`1920 / 1280`) — stagger table rows, rank-flip, scaleX share bars, glyph pop-in, insight cards slide up.
    - **Pillar 4 `MockRecommendations`** (`1876 / 1192`) — tab underline slide, 0→49 count, 45ms row stream, subtle "New" pill pulse, one-shot "Closed: 1" pulse.
  - **Footgun (enforced by review):** never put `var(--*)` inside a `transition` shorthand — React drops it and the transition silently never fires. Import `cb` from `mocks/motion` and inline it instead.
- `ChatDemo.tsx` — desktop: 500vh scroll-pinned section. Phase A (`p 0 → 0.5`): 20 floating frosted-glass `WindowCard` instances with engine logos drift then converge into a chat box, each card staggered. Phase B (`p 0.54 → 1`): the chat materializes and steps through `prompt → typing dots → "Thought for 163s" → streamed response → analysis card → row reveal`. Progress is written to CSS custom properties `--pa` and `--cardin` on the sticky element; component state tracks `step` and `words` for the response stream. **Mobile (< 640px) early-returns to a static fallback**: just the headline + chat card mock with the analysis card already revealed, no 500vh pin, no floating cards, no scroll-driven step machine — the long animation is desktop-only by design. Section bg is **atmospheric** (`var(--bg)` base + 3–4 layered low-alpha white radial-gradients with transparent endpoints) so the section has no visible rectangle edges against the body — see "Section seam blending" below.
- `MetricsStrip.tsx` — 5-tile metrics row (`6 / 25 / 24h / 0–100 / AI-ready`) with a `<TypingHeadline>` at the top.
- `LogoMarquee.tsx` — 34s infinite-scroll customer logos with `WebkitMaskImage` edge fades and `animationPlayState: paused` on hover. Uses real customer logos (Canon, DHL, Netpower, Reckitt, SDS Manager, Unilever) from `public/logos/ko-*.png`. **Each logo is pre-baked to an 800×200 transparent canvas** with the brand content centered (via `magick TRIMMED -resize 720x130 -gravity center -extent 800x200`) so every tile renders at the same uniform size in the marquee — current CSS is `h-[40px] md:h-[56px] w-auto object-contain` so all 6 land at 224×56 with the content varying inside the box. Without canvas normalization, raw aspect ratios ranged from 1.94 (Reckitt) to 13.5 (Netpower) and the marquee rendered them at wildly different visual heights. **Usage rights cleared with the user** before shipping.
- `Testimonials.tsx` — 3-card grid (Mirjam Meling / Jordan Lucena / Morten André Hjelle). Quotes are long-form here (vs. the short-form testimonials in `lib/content.ts` used by `TestimonialRail` elsewhere).
- `Loop.tsx` — dark "Tracking. Intelligence. Improvement. One loop." section with a `<TypingHeadline>` and 3 node cards (Track / Analyze / Improve) on a vertically-faded `var(--ink-surface)` background. **No "Node 01/02/03" labels** (removed); the Track/Analyze/Improve label is centered above each card. CTAs: **Start Free Trial** (→ `/pricing`) + **Talk to an Expert** (opens Calendly via `openCalendly('home_loop')`, was "See the product" → dead `/features` link). Component is `'use client'` because the Calendly handler needs onClick.
- `HomeFAQ.tsx` + `homeFaqs.ts` — homepage-scoped FAQ section, slotted between `<Loop />` and `<HomeCTA />` in `app/page.tsx`. Renders 15 Q/A from `homeFaqs.ts` in the canonical sticky `5fr/7fr` accordion pattern (sidebar headline + accordion items with plus-icon rotation, `var(--ease-out-expo)` reveal). FAQPage JSON-LD is embedded directly on `app/page.tsx` so the schema lives alongside the page metadata. Copy is locked — sourced from the user's `Homepage FAQ.pdf` spec.
- `HomeCTA.tsx` — final dark rounded CTA banner with `<TypingHeadline>` and dual CTAs.
- `TypingHeadline.tsx` — **static text only.** Originally a continuous type-out/hold/delete cycle with blinking caret — that was removed per user direction. Now a pure server-component render: `<Tag style={style}>{text}</Tag>`. Caret + animation gone. The `caretColor` prop is still in the signature (kept for backwards compat with existing call sites) but unused. Used by `MetricsStrip`, `Testimonials`, `Loop`, `HomeCTA`. Feature-page `FeatureContent.tsx` files have their OWN inline TypingHeadline copies — those are NOT touched by this change and still animate.

**Theme scoping mechanism** — `.clv-dark` is the single class that flips the whole token system from light to dark. Applied in three layers, belt-and-suspenders against FOUC:

1. **Inline pre-hydration script in `app/layout.tsx`** — runs synchronously when the browser parses the head, with an OR-chain matching all 14 dark route paths. This makes `<html>` carry `.clv-dark` from the very first CSS application, so the body bg paints `#08080b` instead of cream-flashing on initial load.
2. **`<ThemeShell />`** — client component, no markup. On `usePathname()` change, mirrors the script: adds `.clv-dark` for routes in the `DARK_ROUTES` Set plus the prefix scan list, removes it elsewhere. Handles SPA navigation that the inline script can't see.
3. **`<div className="clv-dark clv-ai-vis-page">` wrapper in each dark page's `page.tsx`** — scopes dark tokens to the page content even if the global class hasn't been applied yet. The companion `.clv-ai-vis-page` class scopes Hanken Grotesk to paragraphs on dark feature pages (`#root p` style rule in globals.css).

**Adding a new dark route requires updating all 4 places:** the bootstrap script in `app/layout.tsx`, `DARK_ROUTES` in `ThemeShell.tsx`, the routing OR-chain in `Chrome.tsx`, and the page's own wrapper div className. Easy to miss any one of them — the page will render but FOUC or chrome-mismatch.

**`<html suppressHydrationWarning>` is intentional** and must stay — the bootstrap script modifies the className before React hydration, so the SSR'd html (no `.clv-dark`) differs from the live DOM (`.clv-dark` already added). Without `suppressHydrationWarning` the console fills with hydration warnings.

**Design tokens** (defined in `app/globals.css`, all light defaults; `.clv-dark` overrides to dark):
- Full ink alpha ramp: `--ink-90 / --ink-80 / --ink-70 / … / --ink-035`. In light, dark-on-cream at decreasing alpha. In `.clv-dark`, white-on-black at decreasing alpha.
- `--white`, `--subtle`, `--line`, `--ink-surface` — surface tokens that flip on dark scope.
- `--on-ink`, `--on-ink-70`, `--on-ink-60`, etc. — contrast text for dark surfaces (always white-on-dark, regardless of scope).
- `--positive`, `--positive-bg`, `--positive-border` — emerald accent. Light scope: `#047857` / `#ecfdf5`. Dark scope: `#34d399` / `rgba(16,185,129,0.14)` / `rgba(16,185,129,0.34)`. **Used only inside dashboard mocks** to mark affordance ("where you win", "↑ +18%" lifts, dark CTA panels' StellarOrbit/CrawlMap accents). Not a brand color — body copy and CTAs stay B&W.
- `--ink-25` — added 2026-06-19 for fanout/crawl mocks' "competitor" mid-gray dot. Light: `rgba(10,10,15,0.24)`, dark: `rgba(255,255,255,0.24)`.
- `--logo-filter` — flips between `brightness(0)` (light) and `brightness(0) invert(1)` (dark) so engine SVGs render the right tone without per-logo asset duplication.
- `--font-body-reg` — Hanken Grotesk via `next/font/google`. Applied only via the `.clv-ai-vis-page p { font-family: var(--font-body-reg); font-weight: 400 }` scoped rule. All other pages still use Saans SemiBold for paragraphs.
- `--header-bg`, `--focus-ring`, `--container-max`, `--section`, `--section-sm`, `--radius-pill`, `--radius-card`, `--shadow-card`, `--shadow-soft`, `--ease-out-expo`, `--display-{xl,lg,md,sm}`, `--track-display-{xl,lg,md,sm}`, `--text-lead` — layout / type / motion atoms used inline-style throughout `components/home/*` and all dark feature page components.

**`.clv-chat-island`** — a CSS class that resets to the light token ramp inside the chat box on the dark `ChatDemo` section. Used so the mock chat UI reads as a bright real-product surface glowing against the black page.

**`.clv-dark .btn-*` overrides** — `.btn-primary` is hardcoded dark-bg-white-text in the base layer, which collapses on a dark page. In `.clv-dark` scope: primary swaps to white-bg-ink-text, secondary to translucent-white-on-dark, invert / ghost adjusted to match. So Button primitives auto-flip without per-call variant changes.

**Keyframes** (in `globals.css`, prefixed `clv-` to avoid Tailwind collision): `clv-blink`, `clv-marquee`, `clv-pulse`, `clv-flow`, `clv-ping`, `clv-chatdot`, `clv-drift`, `clv-logo-fade`, `clv-sweep` (ai-visibility scan), `clv-spin` (rotating orbit ring), `clv-twinkle` (star pulse), `clv-orb` (glowing core pulse with shifting box-shadow). The last three were added for the GEO StellarOrbit; a `prefers-reduced-motion` media query in globals.css disables `clv-spin`/`clv-twinkle`/`clv-orb`/`clv-marquee` on requesting devices.

**When editing the homepage:** values are inlined with `style={{ … }}` referencing `var(--*)` — not Tailwind utilities — because Tailwind tokens are hardcoded to light values and don't auto-flip. Keep that pattern. For any new dark-scoped element, reach for `var(--ink)`, `var(--white)`, etc. instead of `text-ink`, `bg-white`.

**When NOT to extend this pattern:** new routes default to LIGHT (the brand book), but most new routes have been authorized as dark via design-system handoffs. Don't add a route to `DARK_ROUTES` (or the prefix list) without explicit confirmation for THAT page.

**Dark feature page authoring pattern:**

1. New components under `site/components/<feature>/` (one dir per page): a `FeatureContent.tsx` composer + per-section mock components + a small utilities file (Window wrapper + reveal hook + token constants).
2. Server `page.tsx` with `export const metadata`, embeds JSON-LD (FAQPage always, SoftwareApplication when relevant) via `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />`, wraps `<FeatureContent />` in `<div className="clv-dark clv-ai-vis-page">`.
3. Add route to all 4 dark-theme machinery spots (`app/layout.tsx` bootstrap, `ThemeShell.tsx` DARK_ROUTES, `Chrome.tsx` OR-chain, page wrapper div className).
4. Add to nav: `lib/content.ts` `nav.primary[Features].children` for mega-menu entry + `Footer.tsx` + `HomeFooter.tsx` Product groups for footer entry.
5. Mocks use inline `style={{ ... }}` with `var(--*)` references (NOT Tailwind utilities). Each mock has its own reveal-on-mount pattern (rAF + setTimeout fallback) and a TypingHeadline composed inside `FeatureContent.tsx` (the typing-headline helper is duplicated across feature pages because the `reserve` prop variant and other small tweaks differ).
6. **`TypingHeadline` gotcha**: dynamic `const Tag = as || 'h2'` rendering may trigger TypeScript "implicit any" or "unused @ts-expect-error" warnings depending on how the agent wrote it. Render `<Tag>` directly without preemptive `@ts-expect-error` — TS narrows correctly.

**`var(--*)` inside React's `transition` shorthand is a silent footgun.** Setting `style={{ transition: 'opacity 0.5s var(--ease-out-expo), transform 0.5s var(--ease-out-expo)', transitionDelay: '610ms' }}` looks fine but the resulting longhand `transition-property` / `transition-duration` / `transition-timing-function` come out **empty** — the shorthand parses but React's style serialization can't expand it with the `var()` reference, so no transition ever fires (the only thing that survives is the explicit `transitionDelay`). **Workaround:** inline the literal cubic-bezier value instead, e.g. `transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'`. Discovered while debugging the Competitive Positioning bars not animating; the symptom was inline `opacity: 1` but computed opacity stuck at 0. Use the literal value in any new mock — the design-token-by-name approach only works when you use the CSS class or set the property as its own longhand.

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
        <Button href="https://app.clovion.ai/signup" variant="primary" size="lg">Start free trial</Button>
        <Button href="/free-ai-visibility-score" variant="secondary" size="lg">Get free score</Button>
      </div>
    </div>
  </Container>
</Section>
```

The light-hero pattern above applies to LIGHT routes only. Dark feature pages use a different hero structure (2-col grid: TypingHeadline + lead + dual CTAs + trust pills on the left; product mockup component on the right) — see any of the `components/<feature>/FeatureContent.tsx` files for canonical examples. `/affiliate` and `/pricing` use centered hero variants instead. The homepage hero (`components/home/HomeHero.tsx`) uses its own rotating-engine-logo treatment (`See how AI {RotatingLogo} sees your brand`) — no gradient, the rotating logo IS the emphasis.

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

Pattern that emerged for the dark feature pages added 2026-06-19 (auto-saved scripts in `.claude/projects/.../workflows/scripts/`, persisted via the Workflow tool):
- Per page, fire **two parallel workflows** simultaneously: one for components (5–7 agents creating mock files in a new dir), one for integration (3–5 agents editing dark-theme machinery + page.tsx + nav). Workflow tool returns a runId immediately; both run in parallel via background tasks.
- The Workflow tool's script body is plain JS — TypeScript syntax (type annotations, interfaces) inside the script body fails to parse. Inside agent prompts, TypeScript JSX text is fine (it's just a string).
- Triple-backtick code fences inside JS template literals close the template literal early — use string concatenation (`["import...", "..."].join("\n")`) instead for embedding code samples in prompts.

The pattern: parallel `agent()` calls inside `parallel(...)` phases for mechanical multi-file changes. Use `pipeline()` for staged work where each item flows through multiple stages.

### Extracting user-attached images from a chat session

When the user pastes images directly into chat (e.g. Figma exports for the visibility slideshow), they are NOT auto-saved to disk — Write/Edit only handle text. But the raw base64 payload IS in the session JSONL at `~/.claude/projects/<project-slug>/<session-id>.jsonl`. To recover the bytes:

```python
import json, base64, os
SESSION = "/Users/sohamsarker/.claude/projects/-Users-sohamsarker-Clovion-AI/<session-id>.jsonl"
with open(SESSION) as f:
    for line in f:
        entry = json.loads(line)
        msg = entry.get("message", {})
        if msg.get("role") != "user": continue
        for idx, block in enumerate(msg.get("content", []) or []):
            if isinstance(block, dict) and block.get("type") == "image":
                src = block.get("source", {})
                if src.get("type") == "base64":
                    # write base64.b64decode(src["data"]) to a file
                    ...
```

Filter to user-role messages, skip small thumbnails (`len(data) > 50000` is a decent floor for full-size attachments), and check dimensions with `sips -g pixelWidth -g pixelHeight` to identify which is which. Then `Read` each via the vision tool to confirm content before renaming + dropping into the right `/public/` folder. This pattern was used to extract the 4 hi-res visibility-frame PNGs.

## Brand and voice conventions

User-confirmed preferences. Treat as load-bearing:

- **Brand is "Clovion AI"**. Twin-chevron mark + Saans Semibold wordmark.
- **Strict B&W brand book.** No purple, no chromatic accents. **Light theme is the default**; dark is reserved for the 9 currently-dark routes (`/`, 5 dark feature pages, `/pricing`, `/affiliate`, `/free-ai-visibility-score`). Each was authorized by a specific design-system handoff — don't extend the dark scope to new routes without per-page confirmation. Memory file `feedback_light_theme.md` records the homepage override; the broader dark scope grew via subsequent handoffs.
- **Saans-TRIAL-SemiBold is the typography for UI + headings.** Paragraphs on the 6 dark feature/pricing/affiliate pages use **Hanken Grotesk 400** via the `.clv-ai-vis-page p` scoped rule (Saans ships only SemiBold; Hanken gives true regular weight for body copy). All other pages still use Saans SemiBold for everything.
- **Homepage hero emphasizes via a rotating engine logo, not a gradient.** Headline reads `See how AI {RotatingLogo} sees your brand` (no period). Dark feature pages use a TypingHeadline cycle. Light pages use plain ink headlines — no gradients, no rotating logos.
- **Hero headlines are ≤5 words on light routes.** Dark feature pages have longer typed headlines (e.g. "See how one prompt becomes many.", "Make your site readable to AI.") — that's intentional for those pages.
- **CTAs are title-cased.** "Start Free Trial" → `https://app.clovion.ai/signup` (same-tab, in-product); "Get Free Score" → `/free-ai-visibility-score`; "Log in" → `https://app.clovion.ai/login`; "Sign up" → `https://app.clovion.ai/signup`; "Talk to Sales" / "Talk to an Expert" → Calendly PopupWidget (see "Talk-to-Sales → Calendly" section). Button analytics matcher is case-insensitive (`text.toLowerCase().includes('free trial')`) so old lowercase still routes to `start_trial`/`get_free_score` events if it ever reappears. The Loop section's secondary CTA is "Talk to an Expert" (Calendly) — not "See the product". Sales CTAs ("Talk to Sales", "Talk to an Expert") are fine in pricing/enterprise/legal/home-loop contexts. No "View demo" / "Book a demo" — that variant was tried in the hero and removed.
- **Header top-right CTAs are Log in / Sign up**, both pointing at `app.clovion.ai`. Hero CTAs (Start Free Trial / Get Free Score) live below the headline, not in the header.
- **Humanized voice.** Avoid triplet sentence rhythm, em-dash overuse, AI-startup buzzwords ("leverage", "unlock", "closed loop", "operating system", "the only X built for Y"). Vary sentence length. Section leads 20–25 words.
- **Header nav is short — 4 items.** Features (mega-menu trigger only, NOT a link) / Pricing / Customers / Blog. The Features mega-menu has 7 children: AI Visibility Tracking / GEO Improvement Suggestions / Sentiment Analysis / Brand Perception / Fanout Query / AI Crawlability / Platform Coverage. **Sentiment Analysis and Brand Perception are now distinct pages** — Sentiment Analysis (URL `/features/sentiment-analysis`) tracks positive/neutral/negative tone of AI mentions; Brand Perception (URL `/features/brand-perception`) extracts WHAT AI says about your brand (ease of use, audience fit, pricing perception, maturity, etc.). **Compare and Docs live in the Footer only.** `/features` itself is a `redirect('/')` — direct URL silently lands on home, no 404, no destination page. The Header renders Features as a `<button>` (not a Link) because the nav data has no href on that item.

## When editing

- Copy changes → `lib/content.ts` first, then inline strings in pages. Dark page copy is mostly inlined per-section in `components/<feature>/FeatureContent.tsx` — that's intentional, the dark sections are tightly co-located with their copy and aren't reused.
- **`lib/content.ts` data that's now stale:** `pricingTiers` (4 entries: Free/Starter/Growth/Enterprise at $0/$99/$399/Enterprise) is no longer used by `/pricing` — the new page hardcodes 3 tiers ($79/$229/Enterprise) in `components/pricing/PricingTiers.tsx`. Don't trust `pricingTiers` for pricing display. Other content.ts data (features pillars, customers, faqs, etc.) is still active.
- New marketing sections for the LIGHT routes → add to `components/sections.tsx`. New mocks for a NEW dark feature page → add a new `components/<feature>/` directory following the established pattern (FeatureContent composer + per-mock files + utilities file). Don't cross the streams.
- New dark route → update all 4 machinery spots (layout bootstrap, ThemeShell DARK_ROUTES, Chrome OR-chain, page wrapper div). Add to Features mega-menu via `lib/content.ts` nav.primary[Features].children. Add to Footer + HomeFooter Product groups.
- Design tokens → `tailwind.config.ts` for colors/spacing/animation (LIGHT side only — Tailwind utilities don't auto-flip on `.clv-dark`), `globals.css` for component classes (`.btn-*`, `.card`, `.section-y-*`, font tokens) AND the design-system CSS variables (`--ink-*`, `--positive`, `--logo-filter`, etc.) that DO auto-flip via `.clv-dark`. On the homepage, reach for `style={{ color: 'var(--ink)' }}` instead of `text-ink`.
- Featured cards that should feel premium → wrap in `<SpotlightCard>`
- New horizontal carousel → reuse the `TestimonialRail` scaffold; don't roll your own snap logic
- New page → `app/<route>/page.tsx` with `export const metadata` for SEO, hero pattern above, `<HeroShade />` inside the hero `<Section>`. Compose with `Section` + `Container` + `components/sections.tsx`. Client components can't export metadata — the canonical pattern is a server `page.tsx` that exports Metadata + JSON-LD and wraps a client `FeatureContent` composer. See `app/customers/page.tsx`, `app/blog/page.tsx`, or any of the 5 dark feature pages for examples.
- Editing the PillarStepper mocks → they are **fully coded** under `site/components/home/mocks/` (no images). Use inline `style={{ ... 'var(--*)' }}` tokens (never Tailwind `text-ink`/`bg-white`), import animation hooks + the `cb` easing literal from `mocks/motion`, import brand marks from `mocks/glyphs`. **Never** put `var(--*)` inside a `transition` shorthand (use `cb`). Keep emerald `var(--positive)` to affordances and the single `#e5484d` red to negative/need-work/high indicators only. Sizing uses container-query units (`cqw`); the slot in `PillarStepper` already tracks each pillar's `mockAspect`. Honor `prefers-reduced-motion` (the hooks snap to final).
- Touching the logo → edit `logo-reference.png` (gitignored at repo root) → re-run the potrace pipeline (see HaloMark section) → paste new path data into `HaloMark` in `components/ui.tsx`. Single source — Header and Footer both consume it. Do not eyeball SVG coordinates.
- Bumping Next.js or any dependency → check `npm audit` first; Railway's vuln scanner hard-blocks deploys on HIGH CVEs. Patch within the major (e.g. `^14.2.x`) — avoid Next 16 unless you're prepared for the breaking-change cleanup.
- Deploy verification → curl `https://www.clovion.ai/?cb=$(date +%s)` for cache-busted live HTML, not the `*.up.railway.app` URL (it's no longer bound). Use `railway logs --build <id>` when a deploy fails — the security scanner output lives there, not in the runtime log.
- Multi-page mechanical sweeps (e.g. weight conversion, hero pattern application) → write a script in `.claude/workflows/` and run via the Workflow tool. Past scripts are precedents.
- New "Talk to Sales" CTA → use `<TalkToSalesButton location="<page>_<slot>">` for server components, or pass `onClick={(e) => { e.preventDefault(); openCalendly('<page>_<slot>') }}` to the `Button` primitive for client components. Do NOT pass `href={CALENDLY_URL}` — that would render an external `<a target=_blank>` instead of triggering the popup. See "Talk-to-Sales → Calendly" section for the full callsite table.
- Editing copy in `components/home/PillarStepper.tsx` → the H2 + subtitle are load-bearing user-locked strings ("Everything you need to understand and improve AI visibility." / "Millions of buying decisions now start with AI. Most brands don't know how they're represented — or whether AI recommends them at all. Clovion helps you earn more."). NEVER rewrite. Layout-fit asks ("make it 2 lines") mean change font sizes/maxWidth/lineHeight — not the words. Same rule for any string inside an `h1`/`h2`/`p` across the marketing site unless the user explicitly asks for a rewrite.

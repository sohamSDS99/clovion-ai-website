# COMPARISON_TEMPLATE.md

Reusable contract for Clovion competitor-comparison pages, extracted from the
**design source of truth**: `site/app/compare/clovion-vs-peec-ai/page.tsx`
(the "vs Peec AI" page, rebuilt in PR #61). Both new pages
(`/compare/clovion-vs-searchable`, `/compare/clovion-vs-otterly`) consume this
contract. Do NOT reuse the raw hex/placeholder styling baked into the source
HTML files — pull tokens from here.

## Route + file convention

- URL: `/compare/clovion-vs-<slug>` (mirrors `clovion-vs-peec-ai`).
- File: `app/compare/clovion-vs-<slug>/page.tsx` — a **server component** that
  `export const metadata` + renders inline `<script type="application/ld+json">`
  for the FAQPage schema. No client `FeatureContent` split (unlike dark pages).
- The page is a **LIGHT_EXCEPTION**: already registered in `ThemeShell.tsx`,
  `Chrome.tsx`, and the `app/layout.tsx` bootstrap OR-chain. No `clv-dark`
  wrapper — instead a `.clv-<slug>-light` scope div sets `--bg: #FAF9F7`.

## Palette tokens (the "Clove" orange accent set)

Declared as `const` at the top of the page (NOT Tailwind utilities — those don't
auto-flip). Orange marks the **Clovion side + CTAs**; the competitor side stays
ink-on-warm-white so "ours" always reads as the branded column.

| Token | Value | Use |
|-------|-------|-----|
| `BRAND` | `#C2410C` | Clovion accent, eyebrow, table header, featured price |
| `BRAND_GLOW` | `#EA580C` | CTA gradient start |
| `BRAND_STRONG` | `#9A3412` | CTA gradient end, on-white orange text |
| `BRAND_TINT` | `#FBEEE7` | Clovion column fill, flow-chip bg |
| `BRAND_BORDER` | `rgba(194,65,12,0.22)` | Clovion column hairlines |
| page bg | `#FAF9F7` | set via `--bg` on the scope div |

Neutral/ink tokens come from globals.css and auto-resolve LIGHT inside the scope:
`var(--ink)`, `--ink-80/70/60/50/40/30/25`, `var(--white)`, `var(--subtle)`,
`var(--line)`, `var(--font-display)`, `var(--font-mono)`, `--shadow-soft`.

## Shared primitives (from `@/components/ui` + `@/components/FAQAccordion`)

`Section`, `Container`, `Button`, `Eyebrow`, `ArrowRight`, `Check`, `HeroShade`,
`FAQAccordion`. Section backgrounds alternate `default` ⇄ `bg="subtle"`.

## Local presentational helpers (copy verbatim from the Peec page)

- `Flow({ steps, accent })` — the Measure→Diagnose→… chip row with connector bars.
- `Track({ name, desc, steps, accent })` — a positioning card (competitor = neutral,
  Clovion = `accent`, orange left-border).
- `EnginePeecCell({ value })` — engine-table competitor cell: `true` → neutral
  "Yes" pill, string → muted limitation text ("Paid add-on", "Not offered").
- `PriceCard({ name, who, plans, note, featured })` — pricing card; `featured`
  gets the orange ring + orange prices.
- `ChooseCard({ title, items, accent })` — "When to choose X" bullet card.
- `TableHead({ label })` — 3-col grid header (`COLS = '1fr 1.25fr 1.25fr'`), orange
  Clovion column.
- `headCell` / `bodyCell` CSSProperties for table cells.

## Section map (order = source HTML; render = Peec components)

1. **Hero** — `<Section className="section-y-xl relative overflow-hidden">` + `grid-bg`
   + `<HeroShade />`, centered, h1 with orange `<span>` on the tail phrase,
   subhead, dual `Button` (Start Free Trial → `app.clovion.ai/signup`, Compare
   pricing → `#pricing`). `data-track-location="compare_<slug>_hero"`.
2. **Positioning** — `<Section bg="subtle">`, Eyebrow "How they differ" + h2 +
   lead, then two stacked `Track`s (competitor first, Clovion accent second).
3. **Feature table** — `<Section>`, Eyebrow "At a glance" + h2 "Feature by
   feature." + lead, `TableHead label="Category"` + rows from `glance[]`.
4. **Engine coverage** *(Otterly only — present in its source HTML; Searchable
   omits it)* — `<Section bg="subtle">`, Eyebrow "Engine coverage", engine table
   using `EnginePeecCell`, caption note below.
5. **Pricing** — `<Section id="pricing">`, Eyebrow "Pricing" + h2 "Side by side."
   + lead, two `PriceCard`s (Clovion `featured`).
6. **When to choose** — `<Section bg="subtle">`, Eyebrow "Which to choose" + h2
   "The right fit for your team." (Peec design element), two `ChooseCard`s.
7. **FAQ** — `<FAQAccordion headline="Common questions" items={faqs} />`.
8. **Final CTA** — inline orange gradient band (`.clv-cta-orange`), headline
   "See what to fix — not just where you stand.", dual Button (Start Free Trial +
   Get Free Score → `/free-ai-visibility-score`), + a `verified` source note.

## SEO

- `metadata.title` / `metadata.description` from each source HTML `<head>`
  (title separator normalized `—` → `:` to match the Peec sibling).
- FAQPage JSON-LD preserved from each source `<head>`, emitted via
  `<script type="application/ld+json">`.

## Content fidelity rules

Copy, table rows, pricing figures, FAQ text, and JSON-LD are VERBATIM from the
source HTML. Two internal editorial notes in the source HTML are omitted (they
are instructions to the builder, not page copy): the yellow "Confirm before
publishing…" pricing flag, and the "— re-check before each publish" tail on the
verified note (Peec drops the latter too).

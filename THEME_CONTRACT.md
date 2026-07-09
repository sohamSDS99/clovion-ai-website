# THEME_CONTRACT — FREE TOOLS dark → light migration

Single source of truth for converting the 5 "FREE TOOLS" footer pages from the
legacy `.clv-dark` theme to Clovion's light **white + Clove-orange** palette,
matching the light feature pages (`brand-audit`, `recommendation-engine`) and
`pricing`. Every per-page subagent MUST apply this verbatim. **Theme only** — do
not touch copy, DOM structure, props, state, logic, or the tools' functionality
(forms, `/api/*` calls, generators, checkers must still run).

Decisions locked with the user:
- **All dark panels convert to LIGHT** (match feature pages). The ONLY dark
  surface that survives is the **final CTA band** (self-scoped `.clv-dark`).
- Accent = **Clove orange** (`pricing` remap), not emerald.

---

## 0. Verified token facts (why a naive flip fails)

- `--ink`, `--white`, `--subtle`, `--line`, and every `--ink-NN` alpha ALREADY
  resolve to correct light values once `.clv-dark` is off. **Leave these as-is.**
- `--on-ink*` = `#ffffff` in **every** scope. It NEVER flips. On a light page it
  is white-on-white → invisible. **Must be rewritten.**
- `--ink-surface` = `#0a0a0f` (near-black) in **every** scope. It NEVER flips.
  Every `background: var(--ink-surface)` is a deliberately-dark panel. **Must be
  rewritten** (except inside the final-CTA `.clv-dark` band).
- `--positive` (emerald `#047857` light) is remapped to orange on the wrapper.

## 1. Page wrapper (each page's `app/**/page.tsx`)

Drop `clv-dark`; keep `clv-ai-vis-page`. Add the light bg + orange accent remap.
Import `CSSProperties` from `react` if not already imported.

```tsx
import type { CSSProperties } from 'react'

const lightWrapper = {
  ['--bg' as string]: '#FAF9F7',
  ['--positive' as string]: '#C2410C',
  ['--positive-bg' as string]: '#FBEEE7',
  ['--positive-border' as string]: 'rgba(194,65,12,0.34)',
  background: '#FAF9F7',
  color: 'var(--ink)',
} as CSSProperties

// ...
return (
  <div className="clv-ai-vis-page" style={lightWrapper}>
    {/* JSON-LD scripts + <FeatureContent /> unchanged */}
  </div>
)
```

## 2. Token find → replace table

Apply everywhere in the page's component dir, EXCEPT inside a `.clv-dark`
final-CTA band (see §3).

| OLD (dark / non-flipping)                    | NEW (light)                                   | Notes |
|----------------------------------------------|-----------------------------------------------|-------|
| `var(--on-ink)`                              | `var(--ink)`                                  | body/heading text |
| `var(--on-ink-90)`                           | `var(--ink-90)`                               | |
| `var(--on-ink-70)`                           | `var(--ink-70)`                               | |
| `var(--on-ink-60)`                           | `var(--ink-60)`                               | |
| `var(--on-ink-50)`                           | `var(--ink-50)`                               | |
| `var(--on-ink-40)`                           | `var(--ink-40)`                               | |
| `var(--on-ink-15)`                           | `var(--line)`                                 | hairline borders |
| `var(--on-ink-10)`                           | `var(--ink-10)`                               | |
| `var(--on-ink, #fff)`                        | `var(--ink)`                                  | drop the #fff fallback |
| `background: var(--ink-surface)` (a **card/section**) | `background: var(--white)`            | primary surface |
| `background: var(--ink-surface)` (a **recessed / code / input** surface) | `background: var(--subtle)` | pick by role |
| `var(--ink-surface, var(--ink))`             | `var(--white)`                                | drop dark fallback |
| `rgba(255,255,255, α)` as **border**         | `var(--line)`                                 | |
| `rgba(255,255,255, α)` as **text**           | `rgba(10,10,15, α)` (or `var(--ink-NN)`)      | keep the same α |
| `rgba(255,255,255, α)` as **dot-grid/glow decoration** | `rgba(10,10,15, 0.05)` or delete    | keep decoration subtle |
| `#0f0f14` / `#12121a` / `#161619` (dark code/terminal bg) | `var(--subtle)` (`#F5F3EF`)      | light code surface |
| `#1a1a22` (dark code border)                 | `var(--line)`                                 | |
| `#f4f4f6` / `#f0f0f2` (light text on dark)   | `var(--ink)`                                  | code text |
| `#20202b → #0a0a0f` dark radial gradients    | `var(--white)` (flat) or light `--subtle` wash | ThankYou-style cards |
| `caretColor="var(--on-ink)"`                 | `caretColor="var(--ink)"`                     | TypingHeadline |
| `--logo-filter` usage                        | leave as-is                                   | auto-flips to `brightness(0)` |

**DO NOT flip these** (already correct on light):
- `color: '#0a0a0f'` used as **text on a light/accent button** (e.g. orange/positive
  button label) — that is dark text on a light button, correct. Verify context
  before changing any literal `#0a0a0f`.
- `background: var(--ink)` used as a **small solid dot/pill/bar** inside a light
  chart (e.g. a strong-signal marker) — that's an intentional dark accent on
  light, keep it.
- All `var(--ink-NN)` alpha tokens.

## 3. Final CTA band — KEEP DARK

The last CTA section is wrapped in an inner `<div className="clv-dark" …>` and
uses `var(--on-ink)` / `var(--on-ink-70)` / `var(--ink-surface)` text on a dark
card. This matches `brand-audit`/`recommendation-engine` exactly. **Leave this
block and its `--on-ink*` usages untouched** — it is a correct dark band on a
light page. If a page has NO `.clv-dark` wrapper on its final CTA but renders a
dark full-bleed CTA via `--ink-surface`, WRAP that one section in `.clv-dark`
rather than converting it, so it reads as the brand's dark CTA band.

## 4. Product-mock "window" surfaces → LIGHT

`WindowChrome`-style mock frames (free-score) and any product-screenshot mock
must render as **white dashboards** (like the homepage PillarStepper mocks and
the feature-page mocks): surface `var(--white)`, text `var(--ink)`, hairlines
`var(--line)`, chrome dots keep their mac traffic-light colors. If a component
has a `dark` boolean prop gating dark vs light styling, drive it to the light
branch (`dark={false}` or equivalent) rather than deleting the prop.

## 5. Accent usage

`--positive` now = Clove orange (`#C2410C`) via the wrapper remap. Anything that
was emerald affordance (✓ checks, "strong"/"pass" states, positive lifts,
progress fills) becomes orange automatically. Do not hardcode orange hexes in
components — let the remapped `--positive` / `--positive-bg` / `--positive-border`
carry it. Severity reds/ambers (blocked/fail states) stay as they are.

## 6. Cross-cutting machinery (Phase 0 only — DONE by orchestrator, do NOT touch)

- `components/ThemeShell.tsx` — remove `/free-ai-visibility-score` from
  `DARK_ROUTES`; remove `/tools` from `DARK_PREFIXES`.
- `components/Chrome.tsx` — remove `/free-ai-visibility-score` from
  `HOME_ROUTES`; remove `/tools` from `HOME_PREFIXES`.
- `app/layout.tsx` — remove `/tools` from the bootstrap `pre[]` array and
  `/free-ai-visibility-score` from the OR-chain.
- `components/tools/shared/{ToolLeadModal,ToolResultModal}.tsx` — converted by
  the orchestrator (shared by all 4 tool pages).

## 7. Definition of done (per page)

1. `page.tsx` wrapper = light + orange (§1). No `clv-dark` on the page root.
2. Zero `--on-ink*`, zero `rgba(255,255,255,*)`, zero dark hex backgrounds —
   EXCEPT inside the final-CTA `.clv-dark` band.
3. Copy, DOM, props, state, and all tool logic byte-for-byte preserved.
4. Final CTA renders as a dark band; everything else light.
5. Product mocks render as white surfaces.

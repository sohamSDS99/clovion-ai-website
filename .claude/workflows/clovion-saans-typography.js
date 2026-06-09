export const meta = {
  name: 'clovion-saans-typography',
  description: 'Swap entire site typography to Saans Semibold. 4 parallel agents — foundation files + global weight conversion.',
  phases: [
    { title: 'Saans + weight pass', detail: 'layout.tsx, globals.css, tailwind.config.ts, and a sed-driven weight conversion all running in parallel' }
  ]
}

const ROOT = '/Users/sohamsarker/Clovion AI/site'

phase('Saans + weight pass')

await parallel([
  // ------------------------------------------------------------------
  // AGENT 1 — Load Saans from Fontshare in app/layout.tsx
  // ------------------------------------------------------------------
  () => agent(`Update ${ROOT}/app/layout.tsx to load Saans from Fontshare and stop loading Inter/Inter Tight from Google Fonts.

# Goal
Saans (from Fontshare) becomes the primary font for display + body. JetBrains Mono stays as the code/mono font.

# Required changes
1. Read the file first
2. Remove the next/font/google imports for Inter and Inter_Tight
3. Remove the \`display\` and \`body\` font constants
4. Keep JetBrains_Mono (the mono font) — it stays via next/font/google
5. Add a \`<head>\` element inside the <html> tag (BEFORE <body>) containing:
   - <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
   - <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=saans@400,500,600,700&display=swap" />
6. In the <html> tag's className, remove the Inter/Inter Tight variables (display.variable, body.variable). Keep only mono.variable.
7. The body className stays \`font-sans antialiased\` (Tailwind picks up the new font-family via CSS variable)

# Final shape (rough)
\`\`\`tsx
import './globals.css'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap'
})

export const metadata: Metadata = { /* unchanged */ }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={mono.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=saans@400,500,600,700&display=swap"
        />
      </head>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
\`\`\`

# Constraints
- Preserve metadata block exactly
- Don't change Header/Footer imports
- Don't break TypeScript types

Use Read then Write (full rewrite is cleanest here). Report what changed.`, { label: 'foundation:layout' }),

  // ------------------------------------------------------------------
  // AGENT 2 — Set Saans as display + body, semibold default in globals.css
  // ------------------------------------------------------------------
  () => agent(`Update ${ROOT}/app/globals.css to make Saans Semibold (600) the default for the whole site.

# Required changes
1. Read the file
2. In the :root block, ADD or replace these CSS variables:
   --font-display: 'Saans', 'Inter Tight', system-ui, sans-serif;
   --font-body: 'Saans', 'Inter', system-ui, sans-serif;
   --font-mono: var(--font-mono, ui-monospace), 'JetBrains Mono', monospace;
   (Keep existing --bg, --ink, --muted, --subtle, --line, --gradient-hero)
   NOTE: Next.js's next/font sets --font-mono dynamically from the head; the fallback above is just in case.
3. In the body{} rule, change \`font-family: var(--font-body), system-ui, sans-serif;\` to keep the same, AND add \`font-weight: 600;\` (after font-family)
4. Update .display-xl: keep font-weight: 600 (already 600). Confirm.
5. Update .display-lg: change font-weight from 500 → 600
6. Update .display-md: change font-weight from 500 → 600
7. Update .display-sm: change font-weight from 500 → 600
8. Update .btn: change font-weight from 500 → 600 (if .btn has font-weight)
9. Update .eyebrow: change font-weight from 500 → 600
10. The .lead class doesn't set font-weight — leave it (it inherits body's 600 now)
11. .tag: keep at 500 (it's small caps, 500 still reads bold enough — actually change to 600 too for consistency)

# After your edits
- Body text renders as Saans 600
- All display-* headlines render as Saans 600
- Everything inherits Saans 600 unless overridden by a Tailwind font-weight class
- The site looks confident and uniformly heavy

Use Edit tool with precise old_string/new_string for each change. Report each change.`, { label: 'foundation:css' }),

  // ------------------------------------------------------------------
  // AGENT 3 — Verify tailwind config still maps font tokens correctly
  // ------------------------------------------------------------------
  () => agent(`Verify ${ROOT}/tailwind.config.ts has the right fontFamily mapping.

# What it should be
The fontFamily block should map Tailwind utilities to the CSS vars set in globals.css:
\`\`\`
fontFamily: {
  display: ['var(--font-display)', 'system-ui', 'sans-serif'],
  sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
}
\`\`\`

This is already in place. Just confirm by reading the file. If it matches, report "no changes needed". If anything differs, fix it.

Don't change colors, borderRadius, animation, keyframes — only validate fontFamily.`, { label: 'foundation:tailwind' }),

  // ------------------------------------------------------------------
  // AGENT 4 — Convert all font-light/font-normal/font-medium → font-semibold
  // ------------------------------------------------------------------
  () => agent(`Convert every Tailwind font-weight class lighter than semibold across the entire codebase to font-semibold.

# Why
The brand is moving to Saans Semibold uniformly. Lighter weights (font-light, font-normal, font-medium) need to become font-semibold so nothing reads lighter than the new default.

# Pre-check
Run a grep to count starting occurrences (use Bash):
\`\`\`
grep -rEo 'font-(light|normal|medium)\\b' "${ROOT}/app" "${ROOT}/components" --include="*.tsx" --include="*.css" | wc -l
\`\`\`
Note the count.

# Replacement (macOS sed)
Run these three commands (use the Bash tool). On macOS, sed -i requires an empty extension argument: \`sed -i ''\`.

\`\`\`
find "${ROOT}/app" "${ROOT}/components" -type f \\( -name "*.tsx" -o -name "*.css" \\) -exec sed -i '' -E 's/font-light([^a-zA-Z0-9-])/font-semibold\\1/g' {} +
find "${ROOT}/app" "${ROOT}/components" -type f \\( -name "*.tsx" -o -name "*.css" \\) -exec sed -i '' -E 's/font-normal([^a-zA-Z0-9-])/font-semibold\\1/g' {} +
find "${ROOT}/app" "${ROOT}/components" -type f \\( -name "*.tsx" -o -name "*.css" \\) -exec sed -i '' -E 's/font-medium([^a-zA-Z0-9-])/font-semibold\\1/g' {} +
\`\`\`

The trailing-char trick: \`([^a-zA-Z0-9-])\` ensures we don't match a longer class accidentally (e.g. avoiding "font-medium-foo" if it ever existed). The captured char is restored via \\1.

# Verify
Re-run the grep — count should be 0 (or very close to zero; legitimate substrings inside larger words might survive, but Tailwind classnames shouldn't).

\`\`\`
grep -rEo 'font-(light|normal|medium)\\b' "${ROOT}/app" "${ROOT}/components" --include="*.tsx" --include="*.css" | wc -l
\`\`\`

# Report
- Starting count
- Ending count
- Whether sed reported any errors
- Any unexpected substring matches (if any survive, mention them with grep)`, { label: 'weights:convert' })
])

log('Saans + semibold pass complete across foundation files and all page weights')

return { done: true }

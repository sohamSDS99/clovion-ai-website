export const meta = {
  name: 'clovion-saans-local',
  description: 'Replace Fontshare General Sans with the user-provided local Saans-TRIAL-SemiBold via next/font/local',
  phases: [
    { title: 'Extract font', detail: 'Unzip Saans-TRIAL-SemiBold.otf into site/app/fonts/' },
    { title: 'Wire it up', detail: 'Update layout.tsx + globals.css in parallel' }
  ]
}

const ROOT = '/Users/sohamsarker/Clovion AI/site'
const ZIP = '/Users/sohamsarker/Downloads/saans-font-family 2.zip'

// ====================================================================
// PHASE 1 — Extract font file (must complete before layout.tsx edit)
// ====================================================================
phase('Extract font')

await agent(`Extract the Saans static SemiBold OTF from the user's zip and place it in ${ROOT}/app/fonts/.

# Commands to run
\`\`\`
mkdir -p "${ROOT}/app/fonts"
unzip -j -o "${ZIP}" "saans-font-family/Saans-TRIAL-SemiBold.otf" -d "${ROOT}/app/fonts/"
ls -la "${ROOT}/app/fonts/"
\`\`\`

The -j flag strips the directory prefix from the archive so the file lands directly at ${ROOT}/app/fonts/Saans-TRIAL-SemiBold.otf. The -o flag overwrites if it exists.

Report the final ls output to confirm the file is there.`, { label: 'extract:saans' })

log('Font extracted — proceeding to wire it up')

// ====================================================================
// PHASE 2 — Update layout.tsx + globals.css in parallel
// ====================================================================
phase('Wire it up')

await parallel([
  // ----------------------------------------------------------------
  // AGENT — Replace Fontshare with next/font/local in layout.tsx
  // ----------------------------------------------------------------
  () => agent(`Update ${ROOT}/app/layout.tsx to load Saans-TRIAL-SemiBold via next/font/local and remove the Fontshare General Sans CDN link.

# Required final shape
\`\`\`tsx
import './globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

const saans = localFont({
  src: './fonts/Saans-TRIAL-SemiBold.otf',
  variable: '--font-saans',
  display: 'swap',
  weight: '600',
  style: 'normal'
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap'
})

export const metadata: Metadata = {
  /* UNCHANGED — keep the existing metadata exactly */
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`\${saans.variable} \${mono.variable}\`}>
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
\`\`\`

# Notes
- REMOVE the entire <head>...</head> block — Fontshare link is no longer needed
- ADD localFont import + saans constant
- Combine \`saans.variable\` and \`mono.variable\` in the html className (use a template literal or array .join(' '))
- Preserve the metadata object EXACTLY (don't paraphrase the title/description)
- The body className stays \`font-sans antialiased\` — Tailwind's font-sans utility chains to var(--font-body) which we update in globals.css

# How to perform the edit
1. Read the current layout.tsx to capture the metadata block verbatim
2. Use Write to replace the whole file with the new shape, preserving metadata exactly

Report the diff summary.`, { label: 'wire:layout' }),

  // ----------------------------------------------------------------
  // AGENT — Repoint --font-display and --font-body to Saans in globals.css
  // ----------------------------------------------------------------
  () => agent(`Update ${ROOT}/app/globals.css so the CSS variables resolve to the new Saans font.

# Find this block in :root (near the top of globals.css):
\`\`\`
--font-display: 'General Sans', 'Inter Tight', system-ui, sans-serif;
--font-body: 'General Sans', 'Inter', system-ui, sans-serif;
\`\`\`

# Replace it with:
\`\`\`
--font-display: var(--font-saans), 'Inter Tight', system-ui, sans-serif;
--font-body: var(--font-saans), 'Inter', system-ui, sans-serif;
\`\`\`

The var(--font-saans) reference points to the CSS variable that next/font/local injects on the <html> element (set by the layout.tsx update happening in parallel). CSS resolves nested var() references at consumption time, so font-family: var(--font-body) will correctly expand to the Saans font.

# Notes
- DO NOT change any other CSS variable (--bg, --ink, --muted, --subtle, --line, --gradient-hero stay)
- DO NOT change body{} or display-* class rules — they already reference these vars correctly
- DO NOT touch the font-weight: 600 default added in the previous Saans pass

Use Edit tool with precise old_string/new_string. Report what changed.`, { label: 'wire:css' })
])

log('Saans wired locally — restart the dev server to pick up the new font')

return { done: true }

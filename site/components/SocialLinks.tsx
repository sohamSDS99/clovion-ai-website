/**
 * Footer social links, styled to match the AskAiSummary chips exactly:
 * rounded-square chip + monochrome glyph, same bg/border/opacity/hover and
 * light/dark variants. Glyphs are inline (currentColor) so they invert with
 * the variant without a filter.
 */

const SOCIALS = [
  {
    name: 'X',
    href: 'https://x.com/clovionai',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/clovion-ai/?viewAsMember=true',
    path: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8 17v-7H6v7zm-1-8.1a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2zM18 17v-3.7c0-1.9-1-2.8-2.4-2.8-1.1 0-1.7.6-2 1V10h-2v7h2v-3.6c0-.9.6-1.5 1.4-1.5s1 .5 1 1.5V17z'
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/clovion.ai/',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/clovionai/',
    path: 'M15.12 5.32H17V2.14A26.11 26.11 0 0 0 14.26 2c-2.72 0-4.58 1.66-4.58 4.7v2.6H6.61v3.56h3.07V22h3.68v-9.14h3.06l.46-3.56h-3.52V7.05c0-1.03.28-1.73 1.76-1.73Z'
  }
]

export function SocialLinks({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const dark = variant === 'dark'
  const chip = dark
    ? 'bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08]'
    : 'bg-white border border-line hover:border-ink/30'
  const icon = dark ? 'text-white opacity-70 group-hover:opacity-100' : 'text-ink opacity-50 group-hover:opacity-90'

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {SOCIALS.map((s) => (
        <a
          key={s.name}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={s.name}
          className={`group inline-flex items-center justify-center h-10 w-10 rounded-xl transition-colors ${chip}`}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden className={`transition-opacity ${icon}`}>
            <path d={s.path} />
          </svg>
        </a>
      ))}
    </div>
  )
}

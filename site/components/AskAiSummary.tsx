/**
 * "Ask AI for a summary" — a row of engine chips in the footer. Each opens that
 * AI in a new tab with a prompt pre-filled, so a visitor can ask the model to
 * describe Clovion in its own words (the on-brand GEO move). ChatGPT / Claude /
 * Perplexity / Grok take a `?q=` prefill; Gemini has none, so it routes through
 * Google AI Mode (`udm=50`). Icons render monochrome via the same filter trick
 * the homepage engine logos use, keeping the B&W brand book.
 */

const PROMPT =
  'What is Clovion AI and what does it do? Give a short summary of the platform, who it is for, and its main features.'
const q = encodeURIComponent(PROMPT)

const ENGINES = [
  { name: 'ChatGPT', logo: '/logos/chatgpt.svg', href: `https://chatgpt.com/?q=${q}` },
  { name: 'Claude', logo: '/logos/claude.svg', href: `https://claude.ai/new?q=${q}` },
  { name: 'Perplexity', logo: '/logos/perplexity.svg', href: `https://www.perplexity.ai/search?q=${q}` },
  { name: 'Gemini', logo: '/logos/gemini.svg', href: `https://www.google.com/search?udm=50&q=${q}` },
  { name: 'Grok', logo: '/logos/grok-icon.svg', href: `https://grok.com/?q=${q}` }
]

export function AskAiSummary({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const dark = variant === 'dark'
  const chip = dark
    ? 'bg-white/[0.04] border border-white/10 hover:border-white/25 hover:bg-white/[0.08]'
    : 'bg-white border border-line hover:border-ink/30'
  const icon = dark ? 'opacity-70 group-hover:opacity-100' : 'opacity-50 group-hover:opacity-90'

  return (
    <div>
      <div
        className={`text-[0.78rem] font-semibold uppercase tracking-[0.08em] mb-4 ${dark ? '' : 'text-ink-50'}`}
        style={dark ? { color: 'rgba(255,255,255,0.50)' } : undefined}
      >
        Ask AI for a summary
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        {ENGINES.map((e) => (
          <a
            key={e.name}
            href={e.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask ${e.name} to summarize Clovion AI`}
            title={`Ask ${e.name} about Clovion AI`}
            className={`group inline-flex items-center justify-center h-10 w-10 rounded-xl transition-colors ${chip}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={e.logo}
              alt=""
              width={18}
              height={18}
              className={`transition-opacity ${icon}`}
              style={{ filter: dark ? 'brightness(0) invert(1)' : 'brightness(0)' }}
            />
          </a>
        ))}
      </div>
    </div>
  )
}

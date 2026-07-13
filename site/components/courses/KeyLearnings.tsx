// "Key learnings" callout for course lessons — same visual language as the
// blog's Key Takeaways blockquote card (.clv-light-article .cms-prose
// blockquote:has(ul) in globals.css): soft gray panel, bold display heading,
// orange dot bullets. Rendered from structured typeData rather than bodyHtml,
// so the styling is inlined here instead of relying on the :has() selector.

const ORANGE = '#C2410C'

export function KeyLearnings({ items }: { items: string[] }) {
  const learnings = items.filter(Boolean)
  if (learnings.length === 0) return null
  return (
    <aside
      aria-label="Key learnings"
      style={{
        padding: '1.6rem 1.9rem',
        background: '#F1F1F4',
        borderRadius: 16,
        color: 'rgba(10, 10, 15, 0.82)',
        fontSize: '1rem',
        lineHeight: 1.65
      }}
    >
      <h2
        style={{
          margin: 0,
          fontFamily: 'var(--font-display), system-ui, sans-serif',
          fontWeight: 700,
          fontSize: '1.3rem',
          lineHeight: 1.25,
          color: 'var(--ink)'
        }}
      >
        Key learnings
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: '1.1em 0 0' }}>
        {learnings.map((text, i) => (
          <li
            key={i}
            style={{ display: 'flex', gap: 14, marginTop: i > 0 ? '1em' : 0 }}
          >
            <span
              aria-hidden
              style={{
                marginTop: '0.55em',
                width: 7,
                height: 7,
                borderRadius: 999,
                background: ORANGE,
                flexShrink: 0
              }}
            />
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

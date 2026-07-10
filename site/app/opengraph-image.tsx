import { ImageResponse } from 'next/og'

// Site-wide default share card. Next's file convention applies this to every
// route that doesn't declare its own OG image (in metadata or its own
// opengraph-image file) — so the homepage, pricing, tools, and feature pages
// all share a real branded 1200x630 card instead of no image. Generated at
// request time from JSX (next/og), so there's no static PNG to keep in sync.
export const alt = 'Clovion AI — Track your brand visibility in AI search'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0A0F',
          color: '#FAF9F7',
          padding: '80px',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid rgba(250,249,247,0.18)',
              borderRadius: '999px',
              padding: '10px 22px',
              fontSize: '22px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(250,249,247,0.72)'
            }}
          >
            <div style={{ display: 'flex', width: '12px', height: '12px', borderRadius: '999px', background: '#C2410C' }} />
            AI Search Visibility
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: '68px',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: '900px'
          }}
        >
          Track your brand visibility in AI search
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', fontSize: '38px', fontWeight: 700 }}>
            Clovion
            <div style={{ display: 'flex', color: '#C2410C' }}>AI</div>
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: 'rgba(250,249,247,0.6)' }}>
            ChatGPT · Claude · Perplexity · Gemini
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}

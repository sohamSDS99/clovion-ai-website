// Inline-SVG brand glyphs for the PillarStepper mocks — colored to mimic the
// real product reference screenshots (no raster). Distinguished by shape AND
// brand color.

import type { CSSProperties } from 'react'
import { BRAND } from './palette'

type GlyphProps = { size?: number; style?: CSSProperties }

function wrap(size: number, style: CSSProperties | undefined, children: React.ReactNode) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden style={{ display: 'block', flexShrink: 0, ...style }}>
      {children}
    </svg>
  )
}

/** Monday — three rounded bars (red / yellow / green). */
export function MondayGlyph({ size = 20, style }: GlyphProps) {
  return wrap(
    size,
    style,
    <g>
      <rect x="3" y="7" width="4.2" height="10" rx="2.1" fill={BRAND.mondayRed} />
      <rect x="9.9" y="7" width="4.2" height="10" rx="2.1" fill={BRAND.mondayYellow} />
      <rect x="16.8" y="7" width="4.2" height="10" rx="2.1" fill={BRAND.mondayGreen} />
    </g>
  )
}

/** Pipedrive — green circle with a P. */
export function PipedriveGlyph({ size = 20, style }: GlyphProps) {
  return wrap(
    size,
    style,
    <>
      <circle cx="12" cy="12" r="9.2" fill={BRAND.pipedrive} />
      <path
        d="M10.4 17.6V7.6c.7-.3 1.6-.4 2.6-.4 2.3 0 3.9 1.6 3.9 3.9s-1.5 4-3.7 4c-.7 0-1.3-.1-1.7-.4"
        fill="none"
        stroke="#ffffff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  )
}

/** Salesforce — blue cloud. */
export function SalesforceGlyph({ size = 20, style }: GlyphProps) {
  return wrap(
    size,
    style,
    <path
      fill={BRAND.salesforce}
      d="M9.6 7.2a3.4 3.4 0 016.1.7 2.9 2.9 0 013.4 2.9 2.9 2.9 0 01-2.9 2.9H7.3a3 3 0 01-.5-6 3.4 3.4 0 012.8-.5z"
    />
  )
}

/** ChatGPT — dark interlocked swirl. */
export function ChatGptGlyph({ size = 20, style }: GlyphProps) {
  return wrap(
    size,
    style,
    <path
      fill="none"
      stroke={BRAND.chatgpt}
      strokeWidth="1.5"
      strokeLinejoin="round"
      strokeLinecap="round"
      d="M12 5.4a3.2 3.2 0 015.6 2.1 3.2 3.2 0 011.4 5 3.2 3.2 0 01-3.4 4.6 3.2 3.2 0 01-5.6-.6 3.2 3.2 0 01-1.4-5A3.2 3.2 0 0112 5.4zm0 3.1v7M8.7 10.3l6.6 3.4M15.3 10.3l-6.6 3.4"
    />
  )
}

/** Competitor diamond-check mark — indigo diamond with white check. */
export function DiamondCheck({ size = 20, style }: GlyphProps) {
  return wrap(
    size,
    style,
    <>
      <rect x="5.6" y="5.6" width="12.8" height="12.8" rx="3" transform="rotate(45 12 12)" fill={BRAND.diamond} />
      <path d="M9 12.2l2.1 2.1L15.2 10" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

/** Generic engine fallback — neutral spark. */
export function EngineGlyph({ size = 20, style }: GlyphProps) {
  return wrap(size, style, <path fill="rgba(10,10,15,0.4)" d="M12 3l1.9 5.6L19.5 10l-5.6 1.4L12 17l-1.9-5.6L4.5 10l5.6-1.4L12 3z" />)
}

/** User glyph (Brand Perception prompt) — neutral grey. */
export function UserGlyph({ size = 18, style }: GlyphProps) {
  return wrap(
    size,
    style,
    <path
      fill="rgba(10,10,15,0.6)"
      d="M12 12a3.4 3.4 0 100-6.8A3.4 3.4 0 0012 12zm0 1.6c-3 0-6 1.6-6 4v1.2h12V17.6c0-2.4-3-4-6-4z"
    />
  )
}

// Fixed LIGHT palette for the PillarStepper mocks.
//
// The mocks faithfully mimic the product reference screenshots: WHITE dashboards
// with dark text and real colors. They are intentionally theme-INDEPENDENT (they
// render as white cards on the dark homepage, exactly like the original PNGs).
//
// We do this by re-defining the design tokens to their light values ON each mock
// root via inline CSS custom properties (same trick as .clv-chat-island). All the
// `var(--ink)` etc. lookups inside then resolve light, with no per-child edits.

import type { CSSProperties } from 'react'

export const LIGHT = {
  '--white': '#ffffff',
  '--ink': '#0a0a0f',
  '--ink-surface': '#0f0f14',
  '--ink-90': 'rgba(10,10,15,0.92)',
  '--ink-80': 'rgba(10,10,15,0.80)',
  '--ink-70': 'rgba(10,10,15,0.64)',
  '--ink-60': 'rgba(10,10,15,0.55)',
  '--ink-50': 'rgba(10,10,15,0.46)',
  '--ink-40': 'rgba(10,10,15,0.36)',
  '--ink-25': 'rgba(10,10,15,0.22)',
  '--ink-10': 'rgba(10,10,15,0.07)',
  '--line': '#ececef',
  '--subtle': '#f6f7f9',
  '--positive': '#15a04a',
  '--positive-bg': '#dcfce7',
  '--positive-border': '#bbf7d0',
  '--on-ink': '#ffffff',
  '--on-ink-60': 'rgba(255,255,255,0.6)'
} as CSSProperties

// Real competitor brand colors (the mocks mimic the colorful product UI).
export const BRAND = {
  mondayRed: '#ff3d57',
  mondayYellow: '#ffcb00',
  mondayGreen: '#00c875',
  pipedrive: '#1f7d3a',
  salesforce: '#00a1e0',
  diamond: '#5b5bd6',
  chatgpt: '#0a0a0f'
}

// Restrained brights used for pills / dots, matching the screenshots.
export const RED = '#e5484d'
export const RED_BG = '#fde8e8'
export const RED_BORDER = '#f7cfcf'
export const BLUE = '#2563eb'

// Colored tag chips (Brand Perception), matching the screenshot.
export const TAG_COLORS: Record<string, { bg: string; fg: string }> = {
  'Company Size: Startup': { bg: '#ede9fe', fg: '#6d28d9' },
  'Industry: SaaS': { bg: '#dbeafe', fg: '#1d4ed8' },
  'Use Case: CRM': { bg: '#dcfce7', fg: '#15803d' },
  'Buyer Persona: Founder': { bg: '#fee2e2', fg: '#b91c1c' },
  'Intent: Easiest': { bg: '#fce7f3', fg: '#be185d' },
  'Perception: Easy to use': { bg: '#fef9c3', fg: '#a16207' },
  'Perception (Negative): Expensive': { bg: '#fee2e2', fg: '#b91c1c' }
}

// Brand Perception highlight tints (positive green / negative red / neutral yellow).
export const HL = {
  pos: '#cdf3d8',
  neg: '#fcdada',
  neu: '#fdf0a6'
}

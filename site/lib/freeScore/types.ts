// v2 free-score result shape — SINGLE engine (ChatGPT), web-grounded.
//
// Differs from the legacy v1 type (app/api/free-score/route.ts) in two ways:
//   - no `platforms[4]` array (one engine now)
//   - each prompt carries `cited` (was the brand's domain cited as a source?)
// The four subscores are unchanged; Citation Strength survives because the
// scan is web-grounded.

export type Subscore = {
  label: 'Mention Rate' | 'Sentiment' | 'Citation Strength' | 'Competitive Position'
  value: number
  note: string
}

export type PromptResult = {
  prompt: string // a real category buyer-query (8–14 words)
  excerpt: string // short quote of how ChatGPT answered
  engines: string[] // always ['ChatGPT'] in v2 — kept array-shaped for the existing PromptCards UI
  brandMentioned: boolean
  brandWord: string // the brand token to highlight in the excerpt
  cited?: boolean // did the brand's own domain appear as a cited source?
}

export type Recommendation = {
  severity: 'HIGH' | 'MED' | 'LOW'
  problem: string
  fix: string
  lift: string // e.g. "+7 points"
}

export type FreeScoreResult = {
  brand: string
  category: string
  competitors: string[]
  evidence_excerpts?: string[]
  score: number
  subscores: Subscore[]
  prompts: PromptResult[]
  recommendations: Recommendation[]
  engine: 'ChatGPT'
}

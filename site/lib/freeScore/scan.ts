// The consolidated v2 scan pipeline — single engine (ChatGPT), web-grounded.
//
// Two phases, ~2–3 web searches total (cost ≈ $0.036/scan — see RFC Rev 2 §5):
//   1. research()  — Responses API + `web_search` tool gathers the brand's
//                    current ChatGPT presence (identity, category, 3 direct
//                    competitors, per-prompt findings, cited sources).
//   2. score()     — Chat Completions (no tools, JSON mode) reasons over that
//                    brief to emit the scored result. JSON mode lives here
//                    (the reliable path) rather than fighting tool+schema
//                    combination on the research call.
//
// NOTE (API version): targets the `openai` SDK Responses API. Tool id is
// `web_search_preview` for openai@4.x (verified against 4.104); newer majors
// may rename it to `web_search` — update WEB_SEARCH_TOOL if you bump the SDK.

import { getOpenAI, FREE_SCORE_MODEL } from '@/lib/openai'
import type { FreeScoreResult } from './types'
import { validateShape, detectTemplate, normalize } from './validate'

const RESEARCH_TIMEOUT_MS = 25_000
const SCORE_TIMEOUT_MS = 15_000
const MAX_RESPONSE_BYTES = 100_000
const WEB_SEARCH_TOOL = { type: 'web_search_preview' as const }

// Bounded in-process concurrency (P3): cap simultaneous OpenAI calls across all
// in-flight scans so a burst can't open unbounded sockets or blow RPM. A tiny
// semaphore — no dep (avoids p-limit's ESM-only packaging).
const MAX_CONCURRENCY = Number(process.env.SCAN_CONCURRENCY || 15)
let activeCalls = 0
const waiters: Array<() => void> = []
function withSlot<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const run = () => {
      activeCalls++
      fn()
        .then(resolve, reject)
        .finally(() => {
          activeCalls--
          waiters.shift()?.()
        })
    }
    if (activeCalls < MAX_CONCURRENCY) run()
    else waiters.push(run)
  })
}

export class ScanError extends Error {
  code: 'timeout' | 'upstream'
  constructor(code: 'timeout' | 'upstream', message: string) {
    super(message)
    this.code = code
    this.name = 'ScanError'
  }
}

const RESEARCH_SYSTEM = `You are Clovion AI's ChatGPT-visibility researcher. Use web search (at most ~3 searches) to gather GROUNDED facts about how ChatGPT-style answers treat a brand. The user has paid you to look, not to guess from memory.

Write a concise plain-text research brief covering:
- Brand display name and a 2-4 word product category.
- Exactly 3 DIRECT competitors — same buying-decision category AND geography. Not adjacent-category players (a vector DB is not an LLM-API rival; a university is not an edtech platform).
- ~10 real category buyer-intent prompts (8-14 words each) a prospect would actually ask — e.g. "best collaborative workspace for engineering teams 2026", not "what is the best X".
- For each prompt: would the brand surface naturally in a grounded answer? With what sentiment? Does the brand's OWN domain appear as a cited source?
- At least 3 LITERAL short quotes from real sources that mention the brand, each with its source domain.

Be honest: if the brand barely surfaces, say so explicitly. Never invent mentions or citations.`

const SCORING_SYSTEM = `You are Clovion AI's scoring engine. Convert the research brief into a brand-specific JSON report about the brand's visibility in ChatGPT (one engine only).

HARD RULES (violations are rejected):
1. Ground every score in the brief. Never score from generic memory.
2. NO round mid-band defaults. Forbidden for unknown brands: 40, 45, 50, 55, 60 and other multiples of 5. Pick specific integers (e.g. 37, 42, 67, 81, 23). The overall score must NOT be a multiple of 5.
3. Recommendation "lift" integers must vary by brand and finding — never reuse a fixed triplet across brands. Size each lift to the real magnitude of the gap.
4. Different brands must produce different scores. A tiny/unknown brand scores LOW with a specific reason — not 45.
5. Include 3 literal evidence_excerpts (short quotes from the brief), and the brand name must appear in at least one.
6. Competitors: exactly 3 direct same-category, same-geography rivals.

OUTPUT — return THIS JSON object only, no markdown:
{
  "brand": string,
  "category": string,
  "competitors": [string, string, string],
  "evidence_excerpts": [string, string, string],
  "score": number,                                  // 0-100, NOT a multiple of 5
  "subscores": [
    { "label": "Mention Rate",         "value": number, "note": "How often your brand appears when buyers ask ChatGPT about your category." },
    { "label": "Sentiment",            "value": number, "note": "How positively ChatGPT describes your brand across answers." },
    { "label": "Citation Strength",    "value": number, "note": "How often ChatGPT cites your own domain as a source." },
    { "label": "Competitive Position", "value": number, "note": "Your share of voice versus the top three competitors." }
  ],
  "prompts": [   // ~10 entries, one per researched buyer prompt
    { "prompt": string, "excerpt": string, "engines": ["ChatGPT"], "brandMentioned": boolean, "brandWord": string, "cited": boolean }
  ],
  "recommendations": [   // exactly 3, severity HIGH -> MED -> LOW, ordered by impact
    { "severity": "HIGH" | "MED" | "LOW", "problem": string, "fix": string, "lift": string }   // lift like "+7 points"
  ],
  "engine": "ChatGPT"
}

SCORING (compute, don't vibe):
- Mention Rate: fraction of the ~10 prompts that surface the brand -> percentage.
- Sentiment: effusive 80-95, positive 65-80, neutral 45-65, mixed 30-45, negative 10-30.
- Citation Strength: brand's own domain cited as a source — heavy 70-95, occasional 35-65, rare 10-35.
- Competitive Position: share of voice vs the 3 competitors — dominant 75-95, contender 45-70, trailing 15-40.
- Overall: weighted average rounded to a specific integer NOT divisible by 5.
Each recommendation names a concrete, specific fix (a page, partner type, channel) tied to the brief — never generic "improve content marketing".`

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

// Run `fn` with an AbortController that fires after `ms`; map abort -> ScanError.
async function withTimeout<T>(fn: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    return await fn(controller.signal)
  } catch (e) {
    const err = e as { name?: string; message?: string }
    if (err?.name === 'AbortError') throw new ScanError('timeout', `upstream timeout after ${ms}ms`)
    throw new ScanError('upstream', err?.message || 'upstream error')
  } finally {
    clearTimeout(timer)
  }
}

// Defensive text extraction from a Responses API result across SDK shapes.
function extractResponsesText(resp: unknown): string {
  const r = resp as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> }
  if (typeof r.output_text === 'string' && r.output_text.trim()) return r.output_text
  const parts: string[] = []
  for (const item of r.output ?? []) {
    for (const c of item.content ?? []) {
      if (typeof c.text === 'string') parts.push(c.text)
    }
  }
  return parts.join('\n').trim()
}

function parseJson(raw: string): FreeScoreResult {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/i, '').trim()
  if (cleaned.length > MAX_RESPONSE_BYTES) throw new ScanError('upstream', 'response too large')
  try {
    return JSON.parse(cleaned) as FreeScoreResult
  } catch {
    throw new ScanError('upstream', 'malformed json')
  }
}

async function research(domain: string): Promise<string> {
  const client = getOpenAI()
  const params = {
    model: FREE_SCORE_MODEL,
    tools: [WEB_SEARCH_TOOL],
    instructions: RESEARCH_SYSTEM,
    input: `Brand domain: ${JSON.stringify(domain)}\nToday: ${today()}\nResearch this brand's current ChatGPT visibility and write the brief.`,
    max_output_tokens: 1600,
  }
  const resp = await withSlot(() =>
    withTimeout(
      (signal) =>
        client.responses.create(
          params as Parameters<typeof client.responses.create>[0],
          { signal }
        ),
      RESEARCH_TIMEOUT_MS
    )
  )
  const text = extractResponsesText(resp)
  if (!text) throw new ScanError('upstream', 'empty research response')
  return text
}

async function score(
  domain: string,
  brief: string,
  temperature: number,
  retryReason?: string
): Promise<FreeScoreResult> {
  const client = getOpenAI()
  const system =
    SCORING_SYSTEM +
    (retryReason
      ? `\n\n--- RETRY ---\nThe previous response was rejected: ${retryReason}. Produce specific integers grounded in the brief; avoid mid-band defaults and tightly-clustered low-integer lifts.`
      : '')
  const params = {
    model: FREE_SCORE_MODEL,
    temperature,
    messages: [
      { role: 'system', content: system },
      {
        role: 'user',
        content: `Brand domain: ${JSON.stringify(domain)}\nToday: ${today()}\n\nResearch brief:\n${brief}\n\nUsing ONLY the brief above, return the JSON object. No markdown.`,
      },
    ],
    response_format: { type: 'json_object' as const },
    max_tokens: 1800,
  }
  const resp = await withSlot(() =>
    withTimeout(
      (signal) =>
        client.chat.completions.create(
          params as Parameters<typeof client.chat.completions.create>[0],
          { signal }
        ),
      SCORE_TIMEOUT_MS
    )
  )
  const content = (resp as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]?.message?.content
  if (!content) throw new ScanError('upstream', 'empty scoring response')
  return parseJson(content)
}

// research -> score -> validate -> single retry on shape/template -> normalize
export async function runScan(domain: string): Promise<FreeScoreResult> {
  const brief = await research(domain)

  let result = await score(domain, brief, 0.6)
  const shapeErr = validateShape(result)
  const templateErr = shapeErr ? null : detectTemplate(result)

  if (shapeErr || templateErr) {
    const reason = shapeErr || templateErr || 'invalid'
    console.warn(`[free-score] v2 rejected (${reason}) — retrying domain=${domain}`)
    try {
      const retry = await score(domain, brief, 0.9, reason)
      const retryShapeErr = validateShape(retry)
      if (!retryShapeErr) {
        result = retry // accept retry (shape-valid; template best-effort)
      } else if (shapeErr) {
        throw new ScanError('upstream', `invalid shape after retry: ${retryShapeErr}`)
      }
      // else: first was shape-valid but templated, retry shape-invalid → keep first
    } catch (e) {
      if (shapeErr) throw e instanceof ScanError ? e : new ScanError('upstream', String(e))
      // first was only templated → keep it (best effort), don't fail the user
    }
  }

  return normalize(result)
}

// Free AI Visibility Score — backend.
//
// Single GPT-4o:online call (OpenAI via OpenRouter, web-grounded) does
// discovery + visibility scan + structured JSON in one shot. The model
// searches the web for the brand, identifies competitors, and scores
// how AI engines describe it across mention rate, sentiment, citation
// strength, and competitive positioning.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const ANALYZER_SYSTEM = `You are Clovion AI's visibility analyst. Given a domain, perform a web-grounded analysis of how AI search engines (ChatGPT, Claude, Perplexity, Google AI Overviews) describe and recommend this brand.

Use web search to:
1. Identify the brand: what it does, who it serves, what product category it competes in.
2. Find 3-5 top competitors in that category.
3. Assess AI visibility signals: brand mentions in buyer queries, sentiment when AI describes it, citation strength (is the brand's own domain referenced as a source?), and competitive positioning vs the top 3 competitors.

Be honest. Small / unknown / very new brands should score LOW. Established category leaders should score HIGH. Use your web search results as ground truth — never fabricate competitors, sources, or prompt examples.

Return ONLY a JSON object matching this exact schema. No markdown, no preamble, no trailing commentary.

{
  "brand": string — the brand's display name (e.g. "Notion", "Stripe"),
  "category": string — short product category (e.g. "collaborative workspace", "payments infrastructure"),
  "competitors": string[] — top 3 competitors by name,
  "score": number 0-100 — overall AI visibility,
  "subscores": [
    { "label": "Mention Rate", "value": number 0-100, "note": "How often your brand appears when buyers ask AI about your category." },
    { "label": "Sentiment", "value": number 0-100, "note": "How positively AI describes your brand across answers." },
    { "label": "Citation Strength", "value": number 0-100, "note": "How often AI cites your own domain as a source." },
    { "label": "Competitive Position", "value": number 0-100, "note": "Your share of voice versus the top three competitors." }
  ],
  "platforms": [
    { "name": "ChatGPT", "score": number 0-100, "strong": boolean },
    { "name": "Claude", "score": number 0-100, "strong": boolean },
    { "name": "Perplexity", "score": number 0-100, "strong": boolean },
    { "name": "AI Overviews", "score": number 0-100, "strong": boolean }
  ],
  "prompts": [  // exactly 3 — buyer-style queries in the brand's category
    {
      "prompt": string — real buyer-style question (8-14 words),
      "excerpt": string — 2-3 sentence AI answer in the style of ChatGPT/Claude — DRAFT this from your web-research findings,
      "engines": string[] — 1-3 engine names from ["ChatGPT","Claude","Perplexity","AI Overviews"] where this pattern shows up,
      "brandMentioned": boolean — whether the AI answer mentions THIS brand,
      "brandWord": string — the brand name to highlight in the excerpt
    }
  ],
  "recommendations": [  // exactly 3, ordered by severity HIGH -> MED -> LOW
    {
      "severity": "HIGH" | "MED" | "LOW",
      "problem": string — short observation (one sentence) about a current gap,
      "fix": string — concrete, actionable fix (one sentence) that improves the gap,
      "lift": string — estimated visibility impact, e.g. "+8 visibility points"
    }
  ]
}

The "strong" flag on a platform should be true when score >= 70.
"score" overall should approximately equal the weighted average of the four subscores.
"value" in subscores is the percentage 0-100, NOT a 0-1 fraction.`

type Subscore = { label: string; value: number; note: string }
type Platform = { name: string; score: number; strong: boolean }
type PromptEntry = {
  prompt: string
  excerpt: string
  engines: string[]
  brandMentioned: boolean
  brandWord: string
}
type Recommendation = { severity: 'HIGH' | 'MED' | 'LOW'; problem: string; fix: string; lift: string }

export type FreeScoreResult = {
  brand: string
  category: string
  competitors: string[]
  score: number
  subscores: Subscore[]
  platforms: Platform[]
  prompts: PromptEntry[]
  recommendations: Recommendation[]
}

function normalizeDomain(input: string): string {
  let d = input.trim().toLowerCase()
  d = d.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
  return d
}

export async function POST(request: Request) {
  let body: { domain?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid JSON body' }, { status: 400 })
  }

  if (typeof body.domain !== 'string' || body.domain.trim().length === 0) {
    return Response.json({ error: 'domain is required' }, { status: 400 })
  }

  const domain = normalizeDomain(body.domain)
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain)) {
    return Response.json({ error: 'domain looks invalid' }, { status: 400 })
  }

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return Response.json({ error: 'OPENROUTER_API_KEY not configured' }, { status: 500 })
  }

  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://www.clovion.ai',
      'X-Title': 'Clovion AI - Free Visibility Score'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o:online',
      temperature: 0.2,
      messages: [
        { role: 'system', content: ANALYZER_SYSTEM },
        { role: 'user', content: `Analyze the AI visibility of the brand at this domain: ${domain}\n\nReturn the JSON object only.` }
      ],
      response_format: { type: 'json_object' }
    })
  })

  if (!upstream.ok) {
    const text = await upstream.text().catch(() => '')
    return Response.json(
      { error: 'upstream error', status: upstream.status, detail: text.slice(0, 800) },
      { status: 502 }
    )
  }

  const data = (await upstream.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    return Response.json({ error: 'empty response from model' }, { status: 502 })
  }

  let parsed: FreeScoreResult
  try {
    parsed = JSON.parse(content) as FreeScoreResult
  } catch {
    return Response.json(
      { error: 'model returned non-JSON', content: content.slice(0, 600) },
      { status: 502 }
    )
  }

  return Response.json({ domain, result: parsed })
}

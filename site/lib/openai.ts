// Native OpenAI client singleton (HMR-safe).
//
// Used by the v2 free-score scan: web-grounded research via the Responses API
// `web_search` tool + a Chat Completions scoring pass, both on gpt-4o-mini.

import OpenAI from 'openai'

type OpenAIGlobal = typeof globalThis & { __clvOpenAI?: OpenAI }
const g = globalThis as OpenAIGlobal

export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured')
  if (!g.__clvOpenAI) {
    g.__clvOpenAI = new OpenAI({ apiKey })
  }
  return g.__clvOpenAI
}

// gpt-4o-mini by default; overridable for evals / fallback to a stronger model
// on the scoring pass if mini's synthesis proves too weak (see build plan P1).
export const FREE_SCORE_MODEL = process.env.FREE_SCORE_MODEL || 'gpt-4o-mini'

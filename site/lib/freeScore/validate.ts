// Domain validation + anti-template hardening for the v2 scan.
// Ported from the legacy route (app/api/free-score/route.ts), minus the
// platform[4] checks (single engine now).

import type { FreeScoreResult } from './types'

// ── Domain normalize + validate (SSRF defence) ─────────────────────────

export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
}

export type DomainCheck = { ok: true } | { ok: false; reason: string }

export function validateDomain(d: string): DomainCheck {
  if (d.length === 0) return { ok: false, reason: 'domain is required' }
  if (d.length > 253) return { ok: false, reason: 'domain too long' }
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(d)) return { ok: false, reason: 'domain format invalid' }
  if (/^\d+\.\d+\.\d+\.\d+/.test(d)) return { ok: false, reason: 'IP addresses not allowed' }
  if (/^(localhost|127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/i.test(d)) {
    return { ok: false, reason: 'private addresses not allowed' }
  }
  return { ok: true }
}

// ── Shape + range validation ───────────────────────────────────────────

export function validateShape(r: FreeScoreResult): string | null {
  if (!r || typeof r !== 'object') return 'response is not an object'
  if (typeof r.brand !== 'string' || !r.brand.trim()) return 'brand missing'
  if (!Array.isArray(r.subscores) || r.subscores.length !== 4) return 'subscores missing or wrong length'
  if (!Array.isArray(r.prompts) || r.prompts.length < 1) return 'prompts missing'
  if (!Array.isArray(r.recommendations) || r.recommendations.length < 1) return 'recommendations missing'
  if (!Number.isFinite(r.score) || r.score < 0 || r.score > 100) return 'overall score out of range [0,100]'
  if (!r.subscores.every((s) => Number.isFinite(s.value) && s.value >= 0 && s.value <= 100)) {
    return 'subscore value out of range [0,100]'
  }
  return null
}

// ── Template detector (smell-counting; reject at >= 3) ───────────────────

const CANONICAL_LIFT_TRIPLETS = [
  '8/5/3', '11/7/4', '12/8/5', '10/6/3', '9/6/3', '10/5/3', '9/5/3', '7/5/3', '7/4/3', '6/4/3',
]

export function detectTemplate(r: FreeScoreResult): string | null {
  const reasons: string[] = []
  let smells = 0

  if (r.score === 45) {
    smells += 2
    reasons.push('score is exactly 45 (canonical default)')
  }

  const subvals = r.subscores.map((s) => s.value)
  const allSubMult5 = subvals.every((v) => Number.isInteger(v) && v % 5 === 0)
  const allSubMidBand = subvals.every((v) => v >= 35 && v <= 65)
  if (allSubMult5 && allSubMidBand) {
    smells += 2
    reasons.push('all subscores are mid-band multiples of 5')
  }

  const liftNums = r.recommendations
    .map((x) => {
      const m = (x.lift || '').match(/\+?(\d+)/)
      return m ? parseInt(m[1], 10) : null
    })
    .filter((n): n is number => typeof n === 'number')
    .sort((a, b) => b - a)
  const liftSig = liftNums.join('/')
  if (liftSig && CANONICAL_LIFT_TRIPLETS.includes(liftSig)) {
    smells += 2
    reasons.push(`recommendation lift triplet ${liftSig} matches known default`)
  } else if (liftNums.length >= 3) {
    const tight =
      liftNums[0] < 13 &&
      Math.abs(liftNums[0] - liftNums[1]) <= 4 &&
      Math.abs(liftNums[1] - liftNums[2]) <= 3
    if (tight) {
      smells += 1
      reasons.push(`lifts ${liftSig} are small and tightly clustered`)
    }
  }

  if (!Array.isArray(r.evidence_excerpts) || r.evidence_excerpts.length < 2) {
    smells += 2
    reasons.push('evidence_excerpts missing or fewer than 2 quotes')
  } else {
    const brandLow = (r.brand || '').toLowerCase().trim()
    const brandStripped = brandLow.replace(/\s+/g, '')
    const present =
      r.evidence_excerpts.some((e) => typeof e === 'string' && e.toLowerCase().includes(brandLow)) ||
      r.evidence_excerpts.some(
        (e) => typeof e === 'string' && e.toLowerCase().replace(/\s+/g, '').includes(brandStripped)
      )
    if (brandLow && !present) {
      smells += 2
      reasons.push('brand name absent from all evidence_excerpts')
    }
  }

  return smells >= 3 ? `template smells (count=${smells}): ${reasons.join('; ')}` : null
}

// ── Normalize: clamp + enforce single engine on every prompt ─────────────

export function normalize(r: FreeScoreResult): FreeScoreResult {
  return {
    ...r,
    engine: 'ChatGPT',
    score: clamp(r.score),
    subscores: r.subscores.map((s) => ({ ...s, value: clamp(s.value) })),
    prompts: r.prompts.map((p) => ({
      ...p,
      engines: ['ChatGPT'],
      brandWord: p.brandWord || r.brand,
    })),
  }
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

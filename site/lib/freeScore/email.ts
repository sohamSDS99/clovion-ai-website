// Report email (P4 — the "both" delivery). Fire-and-forget from /api/scan after
// the on-page result is returned; an ESP failure must never fail the scan.

import { Resend } from 'resend'
import type { FreeScoreResult } from './types'

const FROM = process.env.REPORT_EMAIL_FROM || 'Clovion AI <onboarding@resend.dev>'

export async function sendReportEmail(to: string, result: FreeScoreResult): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key || !to) return
  try {
    const resend = new Resend(key)
    await resend.emails.send({
      from: FROM,
      to,
      subject: `Your AI visibility score: ${result.score}/100 — ${result.brand}`,
      html: renderReport(result),
    })
  } catch (e) {
    console.warn('[free-score] report email failed:', (e as Error).message)
  }
}

function renderReport(r: FreeScoreResult): string {
  const sub = r.subscores
    .map(
      (s) =>
        `<tr><td style="padding:6px 0;color:#52525b">${esc(s.label)}</td><td style="padding:6px 0;text-align:right;font-weight:600">${s.value}/100</td></tr>`
    )
    .join('')
  const recs = r.recommendations
    .map(
      (x) =>
        `<li style="margin:0 0 10px"><strong>${esc(x.severity)} · ${esc(x.problem)}</strong><br/><span style="color:#52525b">${esc(x.fix)}</span> <span style="color:#047857">${esc(x.lift)}</span></li>`
    )
    .join('')
  return `<!doctype html><html><body style="margin:0;background:#fafaf7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0a0a0f">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px">
    <p style="font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#71717a;margin:0 0 8px">Clovion AI · Free visibility score</p>
    <h1 style="font-size:22px;margin:0 0 4px">${esc(r.brand)} scored ${r.score}/100 in ChatGPT</h1>
    <p style="color:#52525b;margin:0 0 24px">Category: ${esc(r.category)} · vs ${r.competitors.map(esc).join(', ')}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 24px">${sub}</table>
    <h2 style="font-size:16px;margin:0 0 12px">Top fixes</h2>
    <ul style="padding-left:18px;font-size:14px;margin:0 0 28px">${recs}</ul>
    <a href="https://app.clovion.ai/signup" style="display:inline-block;background:#0a0a0f;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:600">Start free trial</a>
    <p style="color:#a1a1aa;font-size:12px;margin:24px 0 0">This is a one-time, directional snapshot from a single prompt batch. The full Clovion product tracks more engines daily.</p>
  </div></body></html>`
}

function esc(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  )
}

// Report email (P4 — the "both" delivery). Fire-and-forget from /api/scan after
// the on-page result is returned; an ESP failure must never fail the scan.
//
// Layout ported from the Clovion design project (visibility-score-email.html).
// All brand / competitor / score / subscore / recommendation copy is dynamic —
// nothing brand-specific is hardcoded. Two deliberate adaptations for email:
//   1. The static "score-gauge.png" (baked to one score) is replaced by an
//      email-safe big-number badge that reflects the real score.
//   2. The design-system font <link> and SVG logo asset are dropped (email
//      clients strip <link>/SVG); the inline Saans→system font stacks remain.

import { Resend } from 'resend'
import type { FreeScoreResult, Recommendation } from './types'

const FROM = process.env.REPORT_EMAIL_FROM || 'Clovion AI <free-score@clovion.ai>'

const SIGNUP_URL = 'https://app.clovion.ai/signup'

// White Clovion lockup, hosted on a CDN so it renders in every client (Gmail
// strips inline SVG / data: image URIs, so a remote PNG is required).
const LOGO_URL = 'https://res.cloudinary.com/doajh6jwk/image/upload/v1782804104/Clovion-Logo-white_xoqx8t.png'

// Font stacks — Saans/JetBrains render where available (Apple Mail), else fall
// back to the system stack. Kept as constants to keep the template readable.
const SANS = "'Saans',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif"
const MONO = "'JetBrains Mono','SF Mono',Menlo,Consolas,monospace"

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
  const brand = esc(r.brand)
  const category = esc(r.category)
  const competitors = joinAnd(r.competitors)
  const score = clampScore(r.score)

  const breakdown = r.subscores
    .map((s, i) => metricRow(s.label, s.value, i === r.subscores.length - 1))
    .join('')

  const fixes = r.recommendations
    .slice(0, 3)
    .map((rec, i, arr) => fixCard(rec, i === arr.length - 1))
    .join('')

  const competitorLine = r.competitors.length
    ? ` &mdash; measured against ${competitors}.`
    : '.'

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>Your AI visibility score</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body, table, td { margin:0; padding:0; }
    img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; display:block; }
    table { border-collapse:separate; border-spacing:0; mso-table-lspace:0pt; mso-table-rspace:0pt; }
    a { text-decoration:none; }
    body { width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; background-color:#050506; }
    .px { padding-left:40px; padding-right:40px; }
    @media only screen and (max-width:620px) {
      .container { width:100% !important; }
      .px { padding-left:24px !important; padding-right:24px !important; }
      .badge { width:180px !important; height:180px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#050506;">
  <!-- preheader -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#050506; opacity:0;">
    ${score}/100. Here's how ChatGPT describes ${brand} &mdash; and the three fixes worth the most points.
    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#050506;">
    <tr>
      <td align="center" style="padding:32px 16px 48px 16px;">

        <!-- ============ CARD ============ -->
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#0e0e14; border:1px solid #23232c; border-radius:20px; overflow:hidden; border-collapse:separate; border-spacing:0;">

          <!-- masthead -->
          <tr>
            <td class="px" style="padding-top:30px; padding-bottom:26px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle"><img src="${LOGO_URL}" width="108" height="27" alt="Clovion AI" style="display:block; width:108px; height:27px; border:0;" /></td>
                  <td align="right" valign="middle" style="font-family:${MONO}; font-size:10.5px; letter-spacing:0.16em; text-transform:uppercase; color:#6f6f78; font-weight:600;">
                    Free&nbsp;visibility&nbsp;score
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- hairline -->
          <tr><td class="px"><div style="height:1px; line-height:1px; font-size:1px; background-color:#1c1c24;">&nbsp;</div></td></tr>

          <!-- HERO -->
          <tr>
            <td class="px" align="center" style="padding-top:40px; padding-bottom:8px;">
              <div style="font-family:${MONO}; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#7f7f87; font-weight:600; padding-bottom:18px;">01&nbsp;&mdash;&nbsp;${brand}&nbsp;&middot;&nbsp;ChatGPT</div>
              <h1 style="margin:0; font-family:${SANS}; font-size:34px; line-height:1.08; letter-spacing:-0.028em; color:#ffffff; font-weight:600;">How ChatGPT<br />describes ${brand}</h1>
            </td>
          </tr>

          <!-- score badge (email-safe; reflects the real score) -->
          <tr>
            <td align="center" style="padding-top:34px; padding-bottom:18px;">
              <table role="presentation" class="badge" cellpadding="0" cellspacing="0" border="0" style="width:200px; height:200px; background-color:#101018; border:2px solid #2b2b36; border-radius:100px; border-collapse:separate; border-spacing:0;">
                <tr>
                  <td align="center" valign="middle" style="width:200px; height:200px;">
                    <div style="font-family:${SANS}; font-size:66px; line-height:1; letter-spacing:-0.03em; color:#ffffff; font-weight:600;">${score}<span style="font-size:24px; letter-spacing:0; color:#5f5f68;">&nbsp;/&nbsp;100</span></div>
                    <div style="font-family:${MONO}; font-size:10px; letter-spacing:0.18em; text-transform:uppercase; color:#7f7f87; font-weight:600; padding-top:12px;">Visibility&nbsp;score</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td class="px" align="center" style="padding-bottom:40px;">
              <p style="margin:0 auto; max-width:430px; font-family:${SANS}; font-size:15.5px; line-height:1.6; color:#a9a9b0; font-weight:600;">
                A <strong style="color:#ffffff; font-weight:600;">${score}/100</strong> visibility score in <strong style="color:#ffffff; font-weight:600;">${category}</strong>${competitorLine}
              </p>
            </td>
          </tr>

          <!-- hairline -->
          <tr><td class="px"><div style="height:1px; line-height:1px; font-size:1px; background-color:#1c1c24;">&nbsp;</div></td></tr>

          <!-- BREAKDOWN -->
          <tr>
            <td class="px" style="padding-top:36px; padding-bottom:6px;">
              <div style="font-family:${MONO}; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#7f7f87; font-weight:600;">02&nbsp;&mdash;&nbsp;The&nbsp;breakdown</div>
            </td>
          </tr>
          <tr>
            <td class="px" style="padding-top:18px; padding-bottom:8px;">
${breakdown}
            </td>
          </tr>

          <!-- hairline -->
          <tr><td class="px" style="padding-top:32px;"><div style="height:1px; line-height:1px; font-size:1px; background-color:#1c1c24;">&nbsp;</div></td></tr>

          <!-- TOP FIXES -->
          <tr>
            <td class="px" style="padding-top:36px; padding-bottom:6px;">
              <div style="font-family:${MONO}; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#7f7f87; font-weight:600;">03&nbsp;&mdash;&nbsp;Top&nbsp;fixes</div>
              <div style="font-family:${SANS}; font-size:14px; color:#76767e; font-weight:600; padding-top:8px;">Ranked by expected lift.</div>
            </td>
          </tr>
          <tr>
            <td class="px" style="padding-top:22px; padding-bottom:4px;">
${fixes}
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td class="px" align="center" style="padding-top:36px; padding-bottom:10px;">
              <!--[if mso]>
              <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${SIGNUP_URL}" style="height:52px;v-text-anchor:middle;width:280px;" arcsize="100%" fillcolor="#ffffff" stroke="f">
                <w:anchorlock/>
                <center style="color:#0a0a0f;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Start Free Trial &rarr;</center>
              </v:roundrect>
              <![endif]-->
              <!--[if !mso]><!-- -->
              <a href="${SIGNUP_URL}" style="display:inline-block; background-color:#ffffff; color:#0a0a0f; font-family:${SANS}; font-size:16px; font-weight:600; letter-spacing:-0.01em; line-height:52px; padding:0 30px; border-radius:999px; text-align:center;">Start Free Trial&nbsp;&nbsp;&rarr;</a>
              <!--<![endif]-->
            </td>
          </tr>
          <tr>
            <td class="px" align="center" style="padding-top:14px; padding-bottom:42px;">
              <div style="font-family:${MONO}; font-size:11px; letter-spacing:0.06em; color:#6a6a72; font-weight:600;">Get Free Trial for 7 Days &mdash; No Credit Card Required</div>
            </td>
          </tr>

        </table>
        <!-- ============ /CARD ============ -->

        <!-- footer -->
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px;">
          <tr>
            <td align="center" style="padding:26px 24px 8px 24px;">
              <img src="${LOGO_URL}" width="92" height="23" alt="Clovion AI" style="display:block; width:92px; height:23px; margin:0 auto; border:0;" />
              <p style="margin:14px 0 0 0; font-family:${SANS}; font-size:12px; line-height:1.6; color:#4d4d54; font-weight:600;">
                You're receiving this because you requested a free visibility score.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`
}

// A breakdown metric: label, value/100, and a white-fill progress bar.
function metricRow(label: string, value: number, last: boolean): string {
  const v = clampScore(value)
  return `              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-bottom:${last ? '4' : '22'}px;">
                <tr>
                  <td style="font-family:${SANS}; font-size:15px; color:#d6d6db; font-weight:600;">${esc(label)}</td>
                  <td align="right" style="font-family:${MONO}; font-size:14px; color:#ffffff; font-weight:600;">${v}<span style="color:#5f5f68;">/100</span></td>
                </tr>
                <tr><td colspan="2" style="padding-top:10px;">${bar(v)}</td></tr>
              </table>`
}

function bar(v: number): string {
  const w = clampScore(v)
  if (w >= 100) {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="height:7px; border-collapse:separate; border-spacing:0;"><tr><td bgcolor="#ffffff" style="height:7px; line-height:7px; font-size:1px; border-radius:4px;">&nbsp;</td></tr></table>`
  }
  if (w <= 0) {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="height:7px; border-collapse:separate; border-spacing:0;"><tr><td bgcolor="#26262f" style="height:7px; line-height:7px; font-size:1px; border-radius:4px;">&nbsp;</td></tr></table>`
  }
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="height:7px; border-collapse:separate; border-spacing:0;"><tr><td width="${w}%" bgcolor="#ffffff" style="height:7px; line-height:7px; font-size:1px; border-radius:4px 0 0 4px;">&nbsp;</td><td width="${100 - w}%" bgcolor="#26262f" style="height:7px; line-height:7px; font-size:1px; border-radius:0 4px 4px 0;">&nbsp;</td></tr></table>`
}

// A "top fix" card: severity pill + expected lift, then problem (title) and fix (body).
function fixCard(rec: Recommendation, last: boolean): string {
  const pill = severityPill(rec.severity)
  return `              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#15151c; border:1px solid #25252e; border-radius:14px; border-collapse:separate; border-spacing:0;${last ? '' : ' margin-bottom:12px;'}">
                <tr><td style="padding:16px 18px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td valign="middle">
                        <span style="display:inline-block; font-family:${MONO}; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; font-weight:600; padding:4px 8px; border-radius:999px; ${pill.style}">${esc(pill.label)}</span>
                      </td>
                      <td align="right" valign="middle" style="font-family:${MONO}; font-size:13px; color:#34d399; font-weight:600;">${esc(liftPts(rec.lift))}</td>
                    </tr>
                  </table>
                  <div style="font-family:${SANS}; font-size:15.5px; line-height:1.4; color:#ffffff; font-weight:600; padding-top:12px;">${esc(rec.problem)}</div>
                  <div style="font-family:${SANS}; font-size:14px; line-height:1.55; color:#9a9aa1; font-weight:600; padding-top:5px;">${esc(rec.fix)}</div>
                </td></tr>
              </table>`
}

function severityPill(severity: string): { label: string; style: string } {
  const s = String(severity).trim().toUpperCase()
  if (s.startsWith('HIGH')) {
    return { label: 'High', style: 'color:#0e0e14; background-color:#ffffff;' }
  }
  if (s.startsWith('MED')) {
    return { label: 'Med', style: 'color:#c9c9d0; background-color:#22222b; border:1px solid #34343f;' }
  }
  if (s.startsWith('LOW')) {
    return { label: 'Low', style: 'color:#9a9aa1; background-color:#1a1a22; border:1px solid #2c2c36;' }
  }
  // Unknown severity: render it as-is in the muted style.
  const label = severity ? severity[0].toUpperCase() + severity.slice(1).toLowerCase() : 'Fix'
  return { label, style: 'color:#9a9aa1; background-color:#1a1a22; border:1px solid #2c2c36;' }
}

// "+12 points" -> "+12 pts" for the compact card; tolerant of any phrasing.
function liftPts(lift: string): string {
  return String(lift).replace(/\bpoints?\b/i, 'pts')
}

function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

// Oxford-comma join: ["Nike","Adidas","Puma"] -> "Nike, Adidas, and Puma".
function joinAnd(arr: string[]): string {
  const a = arr.map(esc)
  if (a.length === 0) return ''
  if (a.length === 1) return a[0]
  if (a.length === 2) return `${a[0]} and ${a[1]}`
  return `${a.slice(0, -1).join(', ')}, and ${a[a.length - 1]}`
}

function esc(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string
  )
}

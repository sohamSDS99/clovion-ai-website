/**
 * Renders CMS-rendered bodyHtml (a constrained allow-list: h2–h4, p, ul/ol,
 * blockquote, a, strong/em, table, img) with the site's B&W brand typography.
 * Styling lives in the .cms-prose block in app/globals.css.
 */

// CMS content arrives in two paragraph conventions:
//   • clean  — one <p> per paragraph (blog). Consecutive <p> are real breaks.
//   • fragmented — a paragraph is split into several <p> (one per typed line),
//     with an empty <p></p> between paragraphs (some research reports).
// Rendered raw, fragmented content reads as a broken, gapless wall of text.
// Normalize both to clean <p>-per-paragraph so one CSS spacing rule works:
//   1. Strip a leading <br> inside a <p> (a spacing hack that doubles the gap).
//   2. If empty <p> are used systematically as delimiters (>=3 — distinguishes a
//      real convention from an incidental blank line), merge each run of
//      fragment <p> into one paragraph and drop the delimiters.
//   3. Remove any leftover empty <p>.
// Runs server-side on the string (same as extractToc). The >=3 threshold is a
// heuristic ceiling: a research report shorter than 3 paragraphs would not be
// de-fragmented — fix the source content if that ever ships.
const EMPTY_P = /<p>(?:\s|&nbsp;)*<\/p>/gi;
const LEADING_BR = /<p>(?:\s|&nbsp;)*<br\s*\/?>\s*/gi;

export function normalizeProse(html: string): string {
  if (!html) return "";
  let out = html.replace(LEADING_BR, "<p>");
  const emptyCount = (out.match(EMPTY_P) || []).length;
  if (emptyCount >= 3) {
    const BREAK = String.fromCharCode(1);
    out = out
      .split(EMPTY_P)
      .join(BREAK) // empty <p> → paragraph-boundary sentinel
      .replace(/<\/p>\s*<p>/gi, " ") // join fragment <p> within a paragraph
      .split(BREAK)
      .join(""); // sentinels now sit between clean </p><p> → drop them
  }
  return out.replace(EMPTY_P, ""); // strip any leftover empty <p>
}

export function ProseHtml({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={`cms-prose ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: normalizeProse(html) }}
    />
  );
}

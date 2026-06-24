/**
 * Renders CMS-rendered bodyHtml (a constrained allow-list: h2–h4, p, ul/ol,
 * blockquote, a, strong/em, table, img) with the site's B&W brand typography.
 * Styling lives in the .cms-prose block in app/globals.css.
 */
export function ProseHtml({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={`cms-prose ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

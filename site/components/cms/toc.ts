/**
 * Extracts a table of contents from CMS bodyHtml and guarantees every H2 has a
 * stable `id` to anchor to. Runs server-side on the raw HTML string (no DOM) so
 * the sticky sidebar (ArticleToc) can scroll-spy against the rendered headings.
 *
 * Only H2s drive the sidebar — the Profound-style rail tracks top-level sections,
 * not every sub-heading. H3/H4 are left untouched.
 */
export type TocItem = { id: string; text: string };

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/&[a-z]+;|&#\d+;/gi, " ") // collapse HTML entities
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripTags(inner: string): string {
  return inner
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export function extractToc(html: string): { html: string; toc: TocItem[] } {
  if (!html) return { html: html ?? "", toc: [] };

  const toc: TocItem[] = [];
  const used = new Set<string>();

  const processed = html.replace(
    /<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi,
    (full, attrs: string, inner: string) => {
      const text = stripTags(inner);
      if (!text) return full; // empty heading → skip, leave markup alone

      const existing = /\bid\s*=\s*["']([^"']+)["']/i.exec(attrs);
      let id = existing ? existing[1] : slugify(text) || `section-${toc.length + 1}`;

      // De-dupe so two same-titled sections still get unique anchors.
      let candidate = id;
      let n = 2;
      while (used.has(candidate)) candidate = `${id}-${n++}`;
      id = candidate;
      used.add(id);

      toc.push({ id, text });

      if (existing) {
        // Honour the CMS-provided id but rewrite it if de-duping changed it.
        if (existing[1] === id) return full;
        const newAttrs = attrs.replace(
          /\bid\s*=\s*["'][^"']+["']/i,
          `id="${id}"`
        );
        return `<h2${newAttrs}>${inner}</h2>`;
      }
      return `<h2${attrs} id="${id}">${inner}</h2>`;
    }
  );

  return { html: processed, toc };
}

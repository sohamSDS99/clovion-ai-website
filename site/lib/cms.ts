/**
 * Clovion CMS public read API client (headless integration).
 *
 * Reads published content from the CMS's versioned public API and renders it on
 * the marketing site. Server-side fetches only (no CORS); ISR-cached with tags
 * so the CMS publish webhook can revalidate on demand (see app/api/cms-revalidate).
 *
 * CMS_API_URL defaults to the production CMS so reads work without extra env.
 */
import type {
  CmsType,
  CmsContent,
  CmsSummary,
  ResourcePublic,
  CmsAuthor,
  CourseContent,
  CourseLessonSummary,
} from "./cms-types";
import { CMS_TYPE_SLUG } from "./cms-types";

const CMS_BASE = (
  process.env.CMS_API_URL ?? "https://clovion-cms-production.up.railway.app"
).replace(/\/+$/, "");
const PUBLIC = `${CMS_BASE}/api/public/v1`;
const REVALIDATE = Number(process.env.CMS_REVALIDATE_SECONDS ?? 300);

function tagsFor(type: CmsType, slug?: string): string[] {
  const t = ["cms", `cms:${type.toLowerCase()}`];
  if (slug) t.push(`cms:${type.toLowerCase()}:${slug}`);
  return t;
}

async function cmsFetch<T>(
  path: string,
  tags: string[]
): Promise<{ ok: boolean; status: number; json: T | null }> {
  const res = await fetch(`${PUBLIC}${path}`, {
    next: { revalidate: REVALIDATE, tags },
    headers: { accept: "application/json" },
  });
  if (res.status === 404) return { ok: false, status: 404, json: null };
  if (!res.ok) {
    console.error(`[cms] ${path} -> ${res.status}`);
    return { ok: false, status: res.status, json: null };
  }
  return { ok: true, status: res.status, json: (await res.json()) as T };
}

/** List published items of a type (newest first). Returns [] on failure. */
export async function listContent(
  type: CmsType,
  opts: { limit?: number; cursor?: string } = {}
): Promise<{ items: CmsSummary[]; nextCursor: string | null }> {
  const qs = new URLSearchParams({ type });
  if (opts.limit) qs.set("limit", String(opts.limit));
  if (opts.cursor) qs.set("cursor", opts.cursor);
  const { json } = await cmsFetch<{
    data: CmsSummary[];
    pagination: { nextCursor: string | null };
  }>(`/content?${qs.toString()}`, tagsFor(type));
  return {
    items: json?.data ?? [],
    nextCursor: json?.pagination?.nextCursor ?? null,
  };
}

/** All published slugs of a type — for generateStaticParams. */
export async function listSlugs(type: CmsType): Promise<string[]> {
  const { items } = await listContent(type, { limit: 100 });
  return items.map((i) => i.slug);
}

/** A single published item by type + slug, or null (404 / unpublished). */
export async function getContent(
  type: CmsType,
  slug: string
): Promise<CmsContent | null> {
  const { json } = await cmsFetch<{ data: CmsContent }>(
    `/content/${CMS_TYPE_SLUG[type]}/${encodeURIComponent(slug)}`,
    tagsFor(type, slug)
  );
  return json?.data ?? null;
}

/** A single course lesson incl. the `course` navigation block (typed view of
 *  getContent("COURSE", …) — same endpoint, narrowed payload type). */
export async function getCourseLesson(
  slug: string
): Promise<CourseContent | null> {
  return (await getContent("COURSE", slug)) as CourseContent | null;
}

/** All published course lessons with their typeData, for grouping into courses
 *  on /courses. The COURSE list endpoint includes typeData; if a CMS build
 *  omits it, fall back to fetching the affected items individually (each fetch
 *  is ISR-cached, so this stays cheap). */
export async function listCourseLessons(
  limit = 100
): Promise<CourseLessonSummary[]> {
  const { items } = await listContent("COURSE", { limit });
  const summaries = items as CourseLessonSummary[];
  if (summaries.every((s) => s.typeData?.courseSlug)) return summaries;
  return Promise.all(
    summaries.map(async (s) => {
      if (s.typeData?.courseSlug) return s;
      const full = await getCourseLesson(s.slug);
      return full ? { ...s, typeData: full.typeData } : s;
    })
  );
}

/** Gated-safe resource view incl. its lead-form definition (no PDF URL). */
export async function getResource(slug: string): Promise<ResourcePublic | null> {
  const { json } = await cmsFetch<{ data: ResourcePublic }>(
    `/resources/${encodeURIComponent(slug)}`,
    tagsFor("RESOURCE", slug)
  );
  return json?.data ?? null;
}

/** Public author profile + their published items. */
export async function getAuthor(
  slug: string
): Promise<{ author: CmsAuthor; items: CmsSummary[] } | null> {
  const { json } = await cmsFetch<{ data: { author: CmsAuthor; items: CmsSummary[] } }>(
    `/authors/${encodeURIComponent(slug)}`,
    ["cms", `cms:author:${slug}`]
  );
  return json?.data ?? null;
}

/**
 * Submit a gated-resource lead (server-side, used by the /api/resource-lead
 * proxy so the browser never calls the CMS cross-origin). Returns the short-
 * lived signed download URL on success.
 */
export async function submitResourceLead(
  slug: string,
  payload: { email: string; data: Record<string, unknown> }
): Promise<{ ok: boolean; downloadUrl?: string; error?: string }> {
  try {
    const res = await fetch(
      `${PUBLIC}/resources/${encodeURIComponent(slug)}/lead`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );
    const body = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: body?.error?.message ?? `Submit failed (${res.status})` };
    }
    return { ok: true, downloadUrl: body?.downloadUrl };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export const cmsConfig = { base: CMS_BASE, public: PUBLIC, revalidate: REVALIDATE };

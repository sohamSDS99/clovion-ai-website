/**
 * Receives the Clovion CMS publish webhook and revalidates the affected pages
 * so newly published / unpublished content appears within seconds (Next ISR
 * on-demand revalidation).
 *
 * The CMS POSTs { action, type, slug, path, redirectFrom? } with
 *   Authorization: Bearer <PUBLIC_SITE_CACHE_PURGE_TOKEN>
 * which must equal this app's CMS_REVALIDATE_SECRET.
 */
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.CMS_REVALIDATE_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    type?: string;
    slug?: string;
    path?: string;
  } | null;

  const type = (body?.type ?? "").toLowerCase();
  const slug = body?.slug;
  const path = body?.path;

  // Tag-based revalidation matches the tags set in lib/cms.ts.
  revalidateTag("cms");
  if (type) {
    revalidateTag(`cms:${type}`);
    if (slug) revalidateTag(`cms:${type}:${slug}`);
  }
  if (path) revalidatePath(`/${path.replace(/^\/+/, "")}`);

  return NextResponse.json({ revalidated: true, type, slug, at: new Date().toISOString() });
}

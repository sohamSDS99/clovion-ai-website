/**
 * Server-side proxy for gated-resource lead submission, so the browser never
 * calls the CMS cross-origin. Forwards { slug, email, data } to the CMS public
 * lead endpoint and returns the short-lived signed download URL.
 */
import { NextResponse } from "next/server";
import { submitResourceLead } from "@/lib/cms";
import { sendMetaConversion } from "@/lib/meta/capi";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    email?: string;
    data?: Record<string, unknown>;
    metaEventId?: string;
  } | null;

  if (!body?.slug || !body?.email) {
    return NextResponse.json({ error: "slug and email are required." }, { status: 400 });
  }

  const result = await submitResourceLead(body.slug, {
    email: body.email,
    data: body.data ?? {},
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Submission failed." }, { status: 502 });
  }

  // Server copy of the Lead conversion (deduped against the browser Pixel via
  // metaEventId). No-ops when META_CAPI_TOKEN is unset; never throws.
  await sendMetaConversion({
    req,
    eventName: "Lead",
    eventId: body.metaEventId || undefined,
    email: body.email,
  });

  return NextResponse.json({ downloadUrl: result.downloadUrl });
}

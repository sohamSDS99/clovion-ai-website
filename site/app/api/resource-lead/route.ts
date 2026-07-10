/**
 * Server-side proxy for gated-resource lead submission, so the browser never
 * calls the CMS cross-origin. Forwards { slug, email, data } to the CMS public
 * lead endpoint and returns the short-lived signed download URL.
 *
 * On a successful download it also fires a "lead_magnet_downloaded" event to
 * the Make.com scenario (same array/[{event,timestamp,data}] shape as
 * /api/lead). Best-effort and fire-and-forget: a webhook/geo failure never
 * blocks or delays the visitor's download.
 */
import { NextResponse } from "next/server";
import { submitResourceLead } from "@/lib/cms";
import { sendMetaConversion } from "@/lib/meta/capi";

export const runtime = "nodejs";

const WEBHOOK_URL =
  process.env.RESOURCE_LEAD_WEBHOOK_URL ||
  "https://hook.eu1.make.com/ye5xg4ycfogmmntn4kfzgvxok7ll3wal";

// ISO-8601 with an explicit +00:00 offset (matches the Make scenario examples).
function isoUtc(d: Date): string {
  return d.toISOString().replace("Z", "+00:00");
}

// Best-effort first/last name from the email local part, e.g.
// "john.doe@x.com" -> { first: "John", last: "Doe" }. Splits on . _ - +,
// strips trailing digit runs, title-cases. Falls back to the raw local part
// as the first name when there's nothing to split.
function namesFromEmail(email: string): { first_name: string; last_name: string } {
  const local = email.split("@")[0] || "";
  const parts = local
    .split(/[._+\-]+/)
    .map((p) => p.replace(/\d+$/, "").trim())
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  if (parts.length === 0) return { first_name: local, last_name: "" };
  return { first_name: parts[0], last_name: parts.slice(1).join(" ") };
}

function clientIp(req: Request): string | undefined {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    undefined
  );
}

// Resolve a country name from the visitor IP via ipapi.co (free, no key).
// Returns null on any failure or for private/loopback IPs — never throws.
// ponytail: free tier is 1k/day; swap RESOURCE_LEAD_GEO if volume outgrows it.
async function countryFromIp(ip: string | undefined): Promise<string | null> {
  if (!ip || /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|fc|fd)/i.test(ip)) {
    return null;
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country_name/`, {
      signal: controller.signal,
      headers: { "user-agent": "clovion-lead/1.0" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const name = (await res.text()).trim();
    return name && !/error|reserved|undefined/i.test(name) ? name : null;
  } catch {
    return null;
  }
}

// Fire the lead-magnet event to Make. Best-effort; logs and swallows failures.
async function notifyWebhook(args: {
  email: string;
  slug: string;
  resourceTitle: string;
  ip: string | undefined;
}) {
  const { email, slug, resourceTitle, ip } = args;
  const { first_name, last_name } = namesFromEmail(email);
  const country = await countryFromIp(ip);
  const payload = [
    {
      event: "lead_magnet_downloaded",
      timestamp: isoUtc(new Date()),
      data: {
        first_name,
        last_name,
        email,
        country,
        lead_magnet: resourceTitle || slug,
        lead_magnet_slug: slug,
        user_type: "lead_magnet_download",
        event: "lead_magnet_downloaded",
      },
    },
  ];
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) console.warn("[resource-lead] webhook non-2xx", res.status);
  } catch (err) {
    console.warn("[resource-lead] webhook failed", err);
  }
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    email?: string;
    resourceTitle?: string;
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

  // Notify the Make scenario that a lead magnet was downloaded. Fire-and-forget
  // (the geo lookup + webhook shouldn't delay the visitor's download); Railway
  // runs a persistent node process so the request completes after we respond.
  void notifyWebhook({
    email: body.email,
    slug: body.slug,
    resourceTitle: body.resourceTitle ?? "",
    ip: clientIp(req),
  });

  return NextResponse.json({ downloadUrl: result.downloadUrl });
}

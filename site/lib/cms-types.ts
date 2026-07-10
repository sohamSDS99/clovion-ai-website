/**
 * Types mirroring the Clovion CMS public read API (/api/public/v1).
 * Source of truth: clovion-cms lib/public/serialize.ts (PublicContent).
 */

export type CmsType = "BLOG" | "RESEARCH" | "NEWS" | "WEBINAR" | "RESOURCE" | "FAQ";

export const CMS_TYPE_SLUG: Record<CmsType, string> = {
  BLOG: "blog",
  // RESEARCH is a gated downloadable report — served by the CMS under the same
  // /resources gated endpoints as RESOURCE (see lib/cms getResource).
  RESEARCH: "research",
  NEWS: "news",
  WEBINAR: "webinar",
  RESOURCE: "resource",
  FAQ: "faq",
};

export interface CmsSeo {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface CmsAuthor {
  displayName: string;
  slug: string;
  title?: string | null;
  bio?: string | null;
  avatar?: string | null;
  socials?: Record<string, string>;
}

export interface CmsTag {
  name: string;
  slug: string;
}
export interface CmsCategory {
  name: string;
  slug: string;
}

/** Full single-item payload (GET /content/{type}/{slug} -> { data }). */
export interface CmsContent {
  id: string;
  type: CmsType;
  title: string;
  slug: string;
  excerpt: string | null;
  bodyHtml: string;
  coverImageUrl: string | null;
  seo: CmsSeo;
  jsonLd: Record<string, unknown>;
  publishedAt: string | null;
  author: CmsAuthor | null;
  tags: CmsTag[];
  category: CmsCategory | null;
  typeData: Record<string, unknown>;
}

/** Lightweight list item (GET /content?type=… -> { data: [...] }). */
export type CmsSummary = Omit<CmsContent, "bodyHtml" | "jsonLd" | "typeData">;

/* ── Per-type typeData shapes (parse from CmsContent.typeData) ─────────────── */
export interface WebinarData {
  startAt?: string;
  endAt?: string;
  timezone?: string;
  registrationUrl?: string;
  speakerNames?: string[];
  recordingUrl?: string;
  isRecorded?: boolean;
}
export interface ResourceData {
  resourceKind?: string;
  gated?: boolean;
  leadFormId?: string | null;
}
export interface FaqData {
  faqItems?: { question: string; answer: string }[];
}
export interface NewsData {
  sourceUrl?: string;
  dateline?: string;
}

/** Public gated-resource view (GET /resources/{slug}) + its lead form. */
export interface ResourceLeadField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
}
export interface ResourcePublic extends CmsContent {
  gated: boolean;
  leadForm?: { id: string; name: string; fields: ResourceLeadField[] } | null;
  leadSubmitUrl?: string;
}

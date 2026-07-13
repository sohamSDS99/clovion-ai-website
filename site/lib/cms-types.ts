/**
 * Types mirroring the Clovion CMS public read API (/api/public/v1).
 * Source of truth: clovion-cms lib/public/serialize.ts (PublicContent).
 */

export type CmsType =
  | "BLOG"
  | "RESEARCH"
  | "NEWS"
  | "WEBINAR"
  | "RESOURCE"
  | "FAQ"
  | "COURSE";

export const CMS_TYPE_SLUG: Record<CmsType, string> = {
  BLOG: "blog",
  // RESEARCH is a gated downloadable report — served by the CMS under the same
  // /resources gated endpoints as RESOURCE (see lib/cms getResource).
  RESEARCH: "research",
  NEWS: "news",
  WEBINAR: "webinar",
  RESOURCE: "resource",
  FAQ: "faq",
  COURSE: "course",
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

/** Cover image with responsive WebP variants + intrinsic size. Lets a card pick
 *  the right-sized source (srcset) and decide cover-vs-contain from the ratio. */
export interface CmsCoverImage {
  url: string;
  thumb: string | null;
  md: string | null;
  lg: string | null;
  width: number | null;
  height: number | null;
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
  coverImage: CmsCoverImage | null;
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

/* ── COURSE — one CMS item per lesson; lessons group into a course by
   typeData.courseSlug. The single-item endpoint additionally returns a
   `course` block with the full lesson list + prev/next for navigation. ───── */
export interface CourseDownload {
  label: string;
  url: string;
  filename?: string;
}
export interface CourseLessonData {
  courseSlug: string;
  courseTitle: string;
  lessonNumber: number;
  keyLearnings?: string[];
  downloads?: CourseDownload[];
}
export interface CourseNavItem {
  slug: string;
  title: string;
}
export interface CourseOutlineLesson {
  slug: string;
  title: string;
  lessonNumber: number;
  excerpt: string;
  /** Estimated read time in minutes (~200 wpm). Optional for older payloads. */
  readMinutes?: number;
  /** Number of downloadable worksheets/templates attached to the lesson. */
  downloadsCount?: number;
}
export interface CourseNav {
  courseSlug: string;
  courseTitle: string;
  lessons: CourseOutlineLesson[];
  prev: CourseNavItem | null;
  next: CourseNavItem | null;
}
/** Single-lesson payload — CmsContent plus the course navigation context.
 *  `course` is optional for safety: a lesson still renders standalone if the
 *  CMS omits it. */
export interface CourseContent extends CmsContent {
  typeData: CourseLessonData & Record<string, unknown>;
  course?: CourseNav | null;
}
/** COURSE list item — the list endpoint includes typeData for grouping on the
 *  /courses landing page. Optional for safety (see listCourseLessons). */
export type CourseLessonSummary = CmsSummary & {
  typeData?: CourseLessonData;
};

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

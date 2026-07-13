/**
 * Course grouping + overview helpers shared by the /courses index, the
 * /courses/[courseSlug] landing page, the lesson route, and the sitemap.
 *
 * The CMS models a course as one item per LESSON; lessons group into a course
 * by typeData.courseSlug. The list endpoint's typeData lacks readMinutes /
 * downloadsCount, so overviews additionally fetch the FIRST lesson's full
 * payload and merge in its `course.lessons` outline (which carries both).
 * Every fetch is ISR-cached by lib/cms, so this stays cheap.
 */
import { getCourseLesson, listCourseLessons } from "./cms";
import type { CourseLessonSummary, CourseOutlineLesson } from "./cms-types";

export type Course = {
  slug: string;
  title: string;
  lessons: CourseLessonSummary[];
};

/** One curriculum row for the index/landing pages — list-summary fields merged
 *  with the outline's readMinutes/downloadsCount (null/0 when the CMS omits
 *  them, so callers can degrade gracefully). */
export type CurriculumLesson = {
  slug: string;
  title: string;
  lessonNumber: number;
  excerpt: string | null;
  readMinutes: number | null;
  downloadsCount: number;
};

export type CourseOverview = Course & {
  curriculum: CurriculumLesson[];
  /** Sum of per-lesson readMinutes; 0 = unknown (render nothing). */
  totalMinutes: number;
  totalDownloads: number;
};

/** Group the flat lesson list (one CMS item per lesson) into courses by
 *  typeData.courseSlug, lessons ordered by lessonNumber. Lessons without
 *  course typeData degrade to a single-lesson course so nothing is dropped. */
export function groupCourses(items: CourseLessonSummary[]): Course[] {
  const bySlug = new Map<string, Course>();
  for (const item of items) {
    const slug = item.typeData?.courseSlug ?? item.slug;
    const title = item.typeData?.courseTitle ?? item.title;
    const course = bySlug.get(slug) ?? { slug, title, lessons: [] };
    course.lessons.push(item);
    bySlug.set(slug, course);
  }
  const courses = [...bySlug.values()];
  for (const course of courses) {
    course.lessons.sort(
      (a, b) => (a.typeData?.lessonNumber ?? 0) - (b.typeData?.lessonNumber ?? 0)
    );
  }
  return courses;
}

function buildCurriculum(
  course: Course,
  outline: CourseOutlineLesson[]
): CurriculumLesson[] {
  const bySlug = new Map(outline.map((l) => [l.slug, l]));
  return course.lessons.map((lesson, i) => {
    const o = bySlug.get(lesson.slug);
    return {
      slug: lesson.slug,
      title: lesson.title,
      lessonNumber: o?.lessonNumber ?? lesson.typeData?.lessonNumber ?? i + 1,
      excerpt: o?.excerpt || lesson.excerpt,
      readMinutes: o?.readMinutes ?? null,
      downloadsCount: o?.downloadsCount ?? lesson.typeData?.downloads?.length ?? 0,
    };
  });
}

async function toOverview(course: Course): Promise<CourseOverview> {
  // The grouped summaries lack readMinutes/downloadsCount — the first lesson's
  // full payload carries the authoritative outline. Falls back to summary data
  // when the CMS omits the course block.
  const first = course.lessons[0];
  const full = first ? await getCourseLesson(first.slug) : null;
  const curriculum = buildCurriculum(course, full?.course?.lessons ?? []);
  const totalMinutes = curriculum.reduce((sum, l) => sum + (l.readMinutes ?? 0), 0);
  const totalDownloads = curriculum.reduce((sum, l) => sum + l.downloadsCount, 0);
  return { ...course, curriculum, totalMinutes, totalDownloads };
}

/** All published courses with curriculum + totals, for the /courses index. */
export async function listCourseOverviews(limit = 100): Promise<CourseOverview[]> {
  const courses = groupCourses(await listCourseLessons(limit));
  return Promise.all(courses.map(toOverview));
}

/** One course by its courseSlug, or null — for the course landing page. */
export async function getCourseOverview(
  courseSlug: string
): Promise<CourseOverview | null> {
  const courses = groupCourses(await listCourseLessons(100));
  const course = courses.find((c) => c.slug === courseSlug);
  return course ? toOverview(course) : null;
}

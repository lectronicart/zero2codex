import { level1Lessons } from "./level1Lessons.ts";
import { level2Lessons } from "./level2Lessons.ts";
import { level3Lessons } from "./level3Lessons.ts";
import { level4Lessons } from "./level4Lessons.ts";
import { level5Lessons } from "./level5Lessons.ts";
import { level6Lessons } from "./level6Lessons.ts";
import { validateLessons, type Lesson } from "./lessonSchema.ts";

export const playableLessons: Lesson[] = validateLessons([
  ...level1Lessons,
  ...level2Lessons,
  ...level3Lessons,
  ...level4Lessons,
  ...level5Lessons,
  ...level6Lessons,
]) as Lesson[];

export const playableLessonIds = new Set(playableLessons.map((lesson) => lesson.id));

export function getLessonById(lessonId: string): Lesson | null {
  return playableLessons.find((lesson) => lesson.id === lessonId) ?? null;
}

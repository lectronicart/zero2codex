import { level2Lessons } from "./level2Lessons.ts";
import { validateLessons, type Lesson } from "./lessonSchema.ts";

export const playableLessons: Lesson[] = validateLessons([...level2Lessons]) as Lesson[];

export const playableLessonIds = new Set(playableLessons.map((lesson) => lesson.id));

export function getLessonById(lessonId: string): Lesson | null {
  return playableLessons.find((lesson) => lesson.id === lessonId) ?? null;
}

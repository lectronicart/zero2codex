import { courseLevels, courseStats } from "../src/content/course.ts";
import { playableLessons } from "../src/content/lessons.ts";

declare const console: {
  error: (message: string) => void;
  log: (message: string) => void;
};
declare const process: {
  exitCode?: number;
};

const errors: string[] = [];
const allCourseLessons = courseLevels.flatMap((level) => level.lessons);
const lessonIds = allCourseLessons.map((lesson) => lesson.id);
const uniqueLessonIds = new Set(lessonIds);
const level2Lessons = playableLessons.filter((lesson) => lesson.levelId === 2);
const level3Lessons = playableLessons.filter((lesson) => lesson.levelId === 3);

if (courseStats.totalLevels !== 17) {
  errors.push(`Expected 17 levels, found ${courseStats.totalLevels}.`);
}

if (courseStats.totalLessons !== 151) {
  errors.push(`Expected 151 course-map lessons, found ${courseStats.totalLessons}.`);
}

if (uniqueLessonIds.size !== lessonIds.length) {
  errors.push("Lesson IDs must be unique.");
}

for (const level of courseLevels) {
  if (level.lessons.length === 0) {
    errors.push(`Level ${level.id} has no lessons.`);
  }
}

if (level2Lessons.length !== 13) {
  errors.push(`Expected 13 playable Level 2 lessons, found ${level2Lessons.length}.`);
}

if (level3Lessons.length !== 13) {
  errors.push(`Expected 13 playable Level 3 lessons, found ${level3Lessons.length}.`);
}

for (const lesson of [...level2Lessons, ...level3Lessons]) {
  const terminalSteps = lesson.sections.filter(
    (section) => section.type === "terminalStep",
  );

  if (terminalSteps.length === 0) {
    errors.push(`${lesson.id} has no terminalStep section.`);
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Content OK: ${courseStats.totalLevels} levels, ${courseStats.totalLessons} map lessons, ${level2Lessons.length} Level 2 lessons, ${level3Lessons.length} Level 3 lessons.`,
  );
}

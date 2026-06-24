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
const level1Lessons = playableLessons.filter((lesson) => lesson.levelId === 1);
const level2Lessons = playableLessons.filter((lesson) => lesson.levelId === 2);
const level3Lessons = playableLessons.filter((lesson) => lesson.levelId === 3);
const level4Lessons = playableLessons.filter((lesson) => lesson.levelId === 4);
const level5Lessons = playableLessons.filter((lesson) => lesson.levelId === 5);
const level6Lessons = playableLessons.filter((lesson) => lesson.levelId === 6);

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

if (level1Lessons.length !== 6) {
  errors.push(`Expected 6 playable Level 1 lessons, found ${level1Lessons.length}.`);
}

if (level3Lessons.length !== 13) {
  errors.push(`Expected 13 playable Level 3 lessons, found ${level3Lessons.length}.`);
}

if (level4Lessons.length !== 17) {
  errors.push(`Expected 17 playable Level 4 lessons, found ${level4Lessons.length}.`);
}

if (level5Lessons.length !== 14) {
  errors.push(`Expected 14 playable Level 5 lessons, found ${level5Lessons.length}.`);
}

if (level6Lessons.length !== 12) {
  errors.push(`Expected 12 playable Level 6 lessons, found ${level6Lessons.length}.`);
}

for (const lesson of level1Lessons) {
  const interactions = lesson.sections.filter(
    (section) => section.type === "foundationInteraction",
  );

  if (interactions.length === 0) {
    errors.push(`${lesson.id} has no foundationInteraction section.`);
  }

  const quickChecks = lesson.sections.filter((section) => section.type === "quiz");
  if (quickChecks.length === 0) {
    errors.push(`${lesson.id} has no quick-check quiz.`);
  }
}

for (const lesson of [...level2Lessons, ...level3Lessons]) {
  const terminalSteps = lesson.sections.filter(
    (section) => section.type === "terminalStep",
  );

  if (terminalSteps.length === 0) {
    errors.push(`${lesson.id} has no terminalStep section.`);
  }
}

for (const lesson of level4Lessons) {
  const activeSections = lesson.sections.filter(
    (section) => section.type !== "narrative",
  );
  if (activeSections.length === 0) {
    errors.push(`${lesson.id} has no active interaction.`);
  }
}

for (const lesson of level5Lessons) {
  const interactions = lesson.sections.filter(
    (section) => section.type === "conceptInteraction",
  );
  if (interactions.length === 0) {
    errors.push(`${lesson.id} has no conceptInteraction section.`);
  }

  const codexSections = lesson.sections.filter(
    (section) =>
      section.type === "narrative" &&
      section.title === "Why this matters with Codex",
  );
  if (codexSections.length !== 1) {
    errors.push(
      `${lesson.id} must have exactly one "Why this matters with Codex" section.`,
    );
  }
}

for (const lesson of level6Lessons) {
  const activeSections = lesson.sections.filter(
    (section) => section.type !== "narrative",
  );
  if (activeSections.length === 0) {
    errors.push(`${lesson.id} has no active interaction.`);
  }

  const codexSections = lesson.sections.filter(
    (section) =>
      section.type === "narrative" &&
      section.title === "Why this matters with Codex",
  );
  if (codexSections.length !== 1) {
    errors.push(
      `${lesson.id} must have exactly one "Why this matters with Codex" section.`,
    );
  }
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  process.exitCode = 1;
} else {
  console.log(
    `Content OK: ${courseStats.totalLevels} levels, ${courseStats.totalLessons} map lessons, ${level1Lessons.length} Level 1 lessons, ${level2Lessons.length} Level 2 lessons, ${level3Lessons.length} Level 3 lessons, ${level4Lessons.length} Level 4 lessons, ${level5Lessons.length} Level 5 lessons, ${level6Lessons.length} Level 6 lessons.`,
  );
}

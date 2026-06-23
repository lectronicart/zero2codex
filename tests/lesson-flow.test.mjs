import test from "node:test";
import assert from "node:assert/strict";
import { getLessonById, playableLessons } from "../src/content/lessons.ts";
import { createTerminalSession, runTerminalCommand } from "../src/terminal/state.ts";
import { validateTerminalStep } from "../src/terminal/validation.ts";
import {
  completeLesson,
  defaultProgressState,
  updateLessonPosition,
} from "../src/progress/progressStore.ts";

test("all Level 2 lessons have at least one terminalStep", () => {
  const level2 = playableLessons.filter((lesson) => lesson.levelId === 2);
  assert.equal(level2.length, 13);
  for (const lesson of level2) {
    assert.ok(lesson.sections.some((section) => section.type === "terminalStep"), lesson.id);
  }
});

test("all Level 2 terminal lessons can be completed with their intended commands", () => {
  const solutions = {
    "2.1": ["pwd"],
    "2.2": ["ls"],
    "2.3": ["cd projects/demo"],
    "2.4": ["cd .."],
    "2.5": ["cd ~"],
    "2.6": ["mkdir sandbox"],
    "2.7": ["touch notes.txt"],
    "2.8": ["rm draft.txt"],
    "2.9": ["rm -r old-project"],
    "2.10": ["cp notes.txt backup-notes.txt"],
    "2.11": ["mv draft.txt final.txt"],
    "2.12": [
      "mkdir portfolio",
      "mkdir portfolio/assets",
      "touch portfolio/README.md",
      "cp notes.txt portfolio/notes.txt",
      "mv todo.txt portfolio/tasks.txt",
      "rm draft.txt",
    ],
    "2.13": [
      "pwd",
      "ls",
      "mkdir review",
      "touch review/notes.txt",
      "cp guide.txt review/guide-copy.txt",
      "rm old.txt",
    ],
  };

  for (const [lessonId, commands] of Object.entries(solutions)) {
    const lesson = getLessonById(lessonId);
    assert.ok(lesson, lessonId);
    const step = lesson.sections.find((section) => section.type === "terminalStep");
    assert.ok(step, lessonId);
    let terminal = createTerminalSession({
      initialFileSystem: step.initialFileSystem,
      startingDirectory: step.startingDirectory,
    });

    for (const command of commands) {
      terminal = runTerminalCommand(terminal, command);
    }

    assert.equal(validateTerminalStep(step, terminal).ok, true, lessonId);
  }
});

test("learner can complete the Level 2 final challenge", () => {
  const lesson = getLessonById("2.12");
  assert.ok(lesson);
  const step = lesson.sections.find((section) => section.type === "terminalStep");
  assert.ok(step);

  let terminal = createTerminalSession({
    initialFileSystem: step.initialFileSystem,
    startingDirectory: step.startingDirectory,
  });
  for (const command of [
    "mkdir portfolio",
    "mkdir portfolio/assets",
    "touch portfolio/README.md",
    "cp notes.txt portfolio/notes.txt",
    "mv todo.txt portfolio/tasks.txt",
    "rm draft.txt",
  ]) {
    terminal = runTerminalCommand(terminal, command);
  }

  const result = validateTerminalStep(step, terminal);
  assert.equal(result.ok, true);

  let progress = updateLessonPosition(defaultProgressState, lesson.id, lesson.sections.length - 1);
  progress = completeLesson(progress, lesson.id, "2026-06-23T00:00:00.000Z");
  assert.ok(progress.completedLessons.includes("2.12"));
  assert.equal(progress.completionDates["2.12"], "2026-06-23T00:00:00.000Z");
});

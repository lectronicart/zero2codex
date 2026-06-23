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

const lessonSolutions = {
  "2.1": [["pwd"]],
  "2.2": [["ls"]],
  "2.3": [["cd projects/demo"]],
  "2.4": [["cd .."]],
  "2.5": [["cd ~"]],
  "2.6": [["mkdir sandbox"]],
  "2.7": [["touch notes.txt"]],
  "2.8": [["rm draft.txt"]],
  "2.9": [["rm -r old-project"]],
  "2.10": [["cp notes.txt backup-notes.txt"]],
  "2.11": [["mv draft.txt final.txt"]],
  "2.12": [[
    "mkdir portfolio",
    "mkdir portfolio/assets",
    "touch portfolio/README.md",
    "cp notes.txt portfolio/notes.txt",
    "mv todo.txt portfolio/tasks.txt",
    "rm draft.txt",
  ]],
  "2.13": [[
    "pwd",
    "ls",
    "mkdir review",
    "touch review/notes.txt",
    "cp guide.txt review/guide-copy.txt",
    "rm old.txt",
  ]],
  "3.1": [["cat notes.txt"]],
  "3.2": [["head -n 3 roadmap.txt"]],
  "3.3": [["tail -n 2 server.log"]],
  "3.4": [["echo Terminal practice matters"]],
  "3.5": [['echo "First draft" > notes.txt']],
  "3.6": [['echo "Second line" >> notes.txt']],
  "3.7": [["cat source.txt > copy.txt"]],
  "3.8": [['grep "Codex" notes.txt']],
  "3.9": [['grep -r "Codex" docs', 'rg "terminal" docs']],
  "3.10": [['cat notes.txt | grep "Codex"']],
  "3.11": [["wc -l notes.txt"]],
  "3.12": [[
    'grep "ERROR" logs/app.log',
    'grep "ERROR" logs/app.log | wc -l',
    'grep "timeout" logs/app.log > timeout-report.txt',
    "cat timeout-report.txt",
  ]],
  "3.13": [
    ["head -n 2 guide.txt"],
    [
      'echo "Codex review note" > review.txt',
      'echo "Check logs before guessing" >> review.txt',
    ],
    ['grep "ERROR" logs/app.log | wc -l'],
  ],
};

test("all Level 2 and Level 3 lessons have at least one terminalStep", () => {
  for (const levelId of [2, 3]) {
    const levelLessons = playableLessons.filter((lesson) => lesson.levelId === levelId);
    assert.equal(levelLessons.length, 13);
    for (const lesson of levelLessons) {
      assert.ok(lesson.sections.some((section) => section.type === "terminalStep"), lesson.id);
    }
  }
});

test("all Level 2 and Level 3 terminal lessons can be completed with intended commands", () => {
  for (const [lessonId, stepSolutions] of Object.entries(lessonSolutions)) {
    const lesson = getLessonById(lessonId);
    assert.ok(lesson, lessonId);
    const steps = lesson.sections.filter((section) => section.type === "terminalStep");
    assert.equal(steps.length, stepSolutions.length, lessonId);

    for (const [index, commands] of stepSolutions.entries()) {
      const result = runTerminalStep(steps[index], commands);
      assert.equal(result.ok, true, `${lessonId} step ${index + 1}`);
    }
  }
});

test("learner can complete one file-writing lesson", () => {
  const lesson = getLessonById("3.5");
  assert.ok(lesson);
  const step = lesson.sections.find((section) => section.type === "terminalStep");
  assert.ok(step);
  const result = runTerminalStep(step, ['echo "First draft" > notes.txt']);
  assert.equal(result.ok, true);
});

test("learner can complete one search lesson", () => {
  const lesson = getLessonById("3.8");
  assert.ok(lesson);
  const step = lesson.sections.find((section) => section.type === "terminalStep");
  assert.ok(step);
  const result = runTerminalStep(step, ['grep "Codex" notes.txt']);
  assert.equal(result.ok, true);
});

test("learner can complete the final log-investigation challenge", () => {
  const lesson = getLessonById("3.12");
  assert.ok(lesson);
  const step = lesson.sections.find((section) => section.type === "terminalStep");
  assert.ok(step);

  const result = runTerminalStep(step, [
    'grep "ERROR" logs/app.log',
    'grep "ERROR" logs/app.log | wc -l',
    'grep "timeout" logs/app.log > timeout-report.txt',
    "cat timeout-report.txt",
  ]);
  assert.equal(result.ok, true);

  let progress = updateLessonPosition(defaultProgressState, lesson.id, lesson.sections.length - 1);
  progress = completeLesson(progress, lesson.id, "2026-06-23T00:00:00.000Z");
  assert.ok(progress.completedLessons.includes("3.12"));
  assert.equal(progress.completionDates["3.12"], "2026-06-23T00:00:00.000Z");
});

function runTerminalStep(step, commands) {
  let terminal = createTerminalSession({
    initialFileSystem: step.initialFileSystem,
    startingDirectory: step.startingDirectory,
  });

  for (const command of commands) {
    terminal = runTerminalCommand(terminal, command);
  }

  return validateTerminalStep(step, terminal);
}

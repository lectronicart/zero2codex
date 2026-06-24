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
import { validateReviewChallenge } from "../src/foundations/levelOneValidation.ts";

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

const level4Solutions = {
  "4.2": [["git init"]],
  "4.3": [["git status"]],
  "4.4": [["git add README.md", "git status"]],
  "4.5": [[
    "git add .",
    'git commit -m "Start tiny tracker"',
  ]],
  "4.6": [[
    `echo "console.log('Tracker ready');" > app.js`,
    "git status",
    "git add app.js",
    'git commit -m "Show tracker ready message"',
  ]],
  "4.7": [["git log --oneline"]],
  "4.8": [["git diff", "git add README.md", "git diff --staged"]],
  "4.9": [["git diff", "git restore README.md", "git status"]],
  "4.11": [[
    "git remote add origin https://example.test/tiny-tracker.git",
    "git remote -v",
    "git push",
  ]],
  "4.12": [[
    "git clone https://github.com/zero2codex/tiny-site.git",
    "cd tiny-site",
    "git pull",
    "git status",
  ]],
  "4.13": [[
    "git branch feature",
    "git switch feature",
    "git checkout main",
    "git checkout -b experiment",
    "git branch",
  ]],
  "4.14": [[
    "git switch -c feature/add-note",
    'echo "Feature ready" > feature.txt',
    "git add feature.txt",
    'git commit -m "Add feature note"',
    "git switch main",
    "git merge feature/add-note",
    "git status",
  ]],
  "4.15": [["git diff"]],
  "4.16": [[
    "git diff",
    "git add README.md",
    "git diff --staged",
    'git commit -m "Explain project setup"',
  ]],
  "4.17": [[
    "git init",
    "git status",
    'echo "Track projects safely." >> README.md',
    "git add README.md app.js",
    'git commit -m "Start tiny tracker"',
    "git switch -c feature/add-note",
    'echo "Feature ready" > feature.txt',
    "git add feature.txt",
    'git commit -m "Add feature note"',
    "git switch main",
    "git merge feature/add-note",
    "git log --oneline",
    "git diff",
    "git remote add origin https://example.test/tiny-tracker.git",
    "git remote -v",
    "git push",
  ]],
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

test("all six Level 1 lessons render from the playable lesson registry", () => {
  const levelLessons = playableLessons.filter((lesson) => lesson.levelId === 1);
  assert.deepEqual(
    levelLessons.map((lesson) => lesson.id),
    ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6"],
  );

  for (const lesson of levelLessons) {
    assert.ok(lesson.sections.some((section) => section.type === "foundationInteraction"));
    assert.ok(lesson.sections.some((section) => section.type === "quiz"));
    assert.ok(
      lesson.sections.some(
        (section) =>
          section.type === "narrative" && section.title === "Why this matters later",
      ),
    );
  }
});

test("Level 1 completion advances through the existing progress store", () => {
  let progress = defaultProgressState;

  for (const lessonId of ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6"]) {
    const lesson = getLessonById(lessonId);
    assert.ok(lesson);
    progress = updateLessonPosition(progress, lesson.id, lesson.sections.length - 1);
    progress = completeLesson(progress, lesson.id, `2026-06-23T00:00:0${lessonId.at(-1)}.000Z`);
  }

  assert.deepEqual(progress.completedLessons, ["1.1", "1.2", "1.3", "1.4", "1.5", "1.6"]);
  assert.equal(getLessonById("1.6")?.nextLessonId, "2.1");
});

test("the Find the Project challenge has a valid complete answer", () => {
  const lesson = getLessonById("1.6");
  assert.ok(lesson);
  const section = lesson.sections.find(
    (candidate) =>
      candidate.type === "foundationInteraction" &&
      candidate.interaction.kind === "levelOneReviewChallenge",
  );
  assert.ok(section);

  const state = {
    classifications: section.interaction.answer.classifications,
    selectedTreePath: section.interaction.answer.treePath,
    pathSegments: section.interaction.answer.pathSegments,
    fileType: section.interaction.answer.fileType,
    readmePurpose: section.interaction.answer.readmePurpose,
    sourceFolder: section.interaction.answer.sourceFolder,
    nextConcept: section.interaction.answer.nextConcept,
  };

  assert.equal(validateReviewChallenge(section.interaction.answer, state), true);
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

test("all 17 Level 4 lessons are playable and contain an active interaction", () => {
  const levelLessons = playableLessons.filter((lesson) => lesson.levelId === 4);
  assert.equal(levelLessons.length, 17);
  assert.deepEqual(
    levelLessons.map((lesson) => lesson.id),
    Array.from({ length: 17 }, (_, index) => `4.${index + 1}`),
  );

  for (const lesson of levelLessons) {
    assert.ok(
      lesson.sections.some((section) => section.type !== "narrative"),
      lesson.id,
    );
  }
  assert.equal(getLessonById("4.17")?.nextLessonId, "5.1");
});

test("all 14 Level 5 lessons are playable, interactive, and Codex-relevant", () => {
  const levelLessons = playableLessons.filter((lesson) => lesson.levelId === 5);
  assert.deepEqual(
    levelLessons.map((lesson) => lesson.id),
    Array.from({ length: 14 }, (_, index) => `5.${index + 1}`),
  );

  for (const lesson of levelLessons) {
    assert.ok(
      lesson.sections.some((section) => section.type === "conceptInteraction"),
      `${lesson.id} needs a concept interaction`,
    );
    assert.equal(
      lesson.sections.filter(
        (section) =>
          section.type === "narrative" &&
          section.title === "Why this matters with Codex",
      ).length,
      1,
      `${lesson.id} needs one Codex relevance section`,
    );
  }

  assert.equal(getLessonById("5.14")?.nextLessonId, "6.1");
});

test("every Level 4 terminal exercise can be completed with intended commands", () => {
  for (const [lessonId, stepSolutions] of Object.entries(level4Solutions)) {
    const lesson = getLessonById(lessonId);
    assert.ok(lesson, lessonId);
    const steps = lesson.sections.filter((section) => section.type === "terminalStep");
    assert.equal(steps.length, stepSolutions.length, lessonId);

    for (const [index, commands] of stepSolutions.entries()) {
      const result = runTerminalStep(steps[index], commands);
      assert.equal(
        result.ok,
        true,
        `${lessonId} step ${index + 1}: ${result.message}`,
      );
    }
  }
});

test("learner can complete an add and commit cycle", () => {
  const lesson = getLessonById("4.6");
  assert.ok(lesson);
  const step = lesson.sections.find((section) => section.type === "terminalStep");
  assert.ok(step);
  assert.equal(runTerminalStep(step, level4Solutions["4.6"][0]).ok, true);
});

test("learner can complete the branch and merge lesson", () => {
  const lesson = getLessonById("4.14");
  assert.ok(lesson);
  const step = lesson.sections.find((section) => section.type === "terminalStep");
  assert.ok(step);
  assert.equal(runTerminalStep(step, level4Solutions["4.14"][0]).ok, true);
});

test("the Full Git Workflow Challenge validates its final state", () => {
  const lesson = getLessonById("4.17");
  assert.ok(lesson);
  const step = lesson.sections.find((section) => section.type === "terminalStep");
  assert.ok(step);
  assert.equal(runTerminalStep(step, level4Solutions["4.17"][0]).ok, true);
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
    setupCommands: step.setupCommands,
  });

  for (const command of commands) {
    terminal = runTerminalCommand(terminal, command);
  }

  return validateTerminalStep(step, terminal);
}

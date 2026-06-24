import test from "node:test";
import assert from "node:assert/strict";
import {
  completeLesson,
  defaultProgressState,
  loadProgress,
  restartLesson,
  saveProgress,
  updateLessonPosition,
} from "../src/progress/progressStore.ts";
import { createTerminalSession, runTerminalCommand } from "../src/terminal/state.ts";
import { getNode } from "../src/terminal/vfs.ts";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}

test("progress saves and reloads from localStorage-compatible storage", () => {
  const storage = memoryStorage();
  let progress = updateLessonPosition(defaultProgressState, "2.1", 2);
  progress = completeLesson(progress, "2.1", "2026-06-23T00:00:00.000Z");
  saveProgress(progress, storage);

  const reloaded = loadProgress(storage);
  assert.deepEqual(reloaded.completedLessons, ["2.1"]);
  assert.equal(reloaded.currentLessonId, "2.1");
  assert.equal(reloaded.currentSectionIndex, 2);
  assert.equal(reloaded.completionDates["2.1"], "2026-06-23T00:00:00.000Z");
});

test("Level 1 progress persists through the existing storage shape", () => {
  const storage = memoryStorage();
  let progress = updateLessonPosition(defaultProgressState, "1.6", 7);
  progress = completeLesson(progress, "1.6", "2026-06-23T00:00:00.000Z");
  saveProgress(progress, storage);

  const reloaded = loadProgress(storage);
  assert.ok(reloaded.completedLessons.includes("1.6"));
  assert.equal(reloaded.currentLessonId, "1.6");
  assert.equal(reloaded.sectionHighWaterMark["1.6"], 7);
});

test("Level 4 progress persists through the existing storage shape", () => {
  const storage = memoryStorage();
  let progress = updateLessonPosition(defaultProgressState, "4.17", 2);
  progress = completeLesson(progress, "4.17", "2026-06-24T00:00:00.000Z");
  saveProgress(progress, storage);

  const reloaded = loadProgress(storage);
  assert.ok(reloaded.completedLessons.includes("4.17"));
  assert.equal(reloaded.currentLessonId, "4.17");
  assert.equal(reloaded.sectionHighWaterMark["4.17"], 2);
});

test("Level 5 progress persists through the existing storage shape", () => {
  const storage = memoryStorage();
  let progress = updateLessonPosition(defaultProgressState, "5.14", 3);
  progress = completeLesson(progress, "5.14", "2026-06-24T12:00:00.000Z");
  saveProgress(progress, storage);

  const reloaded = loadProgress(storage);
  assert.ok(reloaded.completedLessons.includes("5.14"));
  assert.equal(reloaded.currentLessonId, "5.14");
  assert.equal(reloaded.sectionHighWaterMark["5.14"], 3);
});

test("Level 6 progress persists through the existing storage shape", () => {
  const storage = memoryStorage();
  let progress = updateLessonPosition(defaultProgressState, "6.12", 3);
  progress = completeLesson(progress, "6.12", "2026-06-24T18:00:00.000Z");
  saveProgress(progress, storage);

  const reloaded = loadProgress(storage);
  assert.ok(reloaded.completedLessons.includes("6.12"));
  assert.equal(reloaded.currentLessonId, "6.12");
  assert.equal(reloaded.sectionHighWaterMark["6.12"], 3);
});

test("restarting a lesson clears section resume state", () => {
  const progress = updateLessonPosition(defaultProgressState, "2.1", 2);
  const restarted = restartLesson(progress, "2.1");
  assert.equal(restarted.currentSectionIndex, 0);
  assert.equal(restarted.sectionHighWaterMark["2.1"], undefined);
});

test("terminal reset starts from the original lesson file system", () => {
  const config = {
    initialFileSystem: {
      home: {
        type: "directory",
        children: {
          codex: {
            type: "directory",
            children: {},
          },
        },
      },
    },
  };
  const changed = runTerminalCommand(createTerminalSession(config), "mkdir scratch");
  assert.equal(getNode(changed.fileSystem, "/home/codex/scratch")?.type, "directory");

  const reset = createTerminalSession(config);
  assert.equal(getNode(reset.fileSystem, "/home/codex/scratch"), null);
});

test("terminal reset clears lesson-scoped simulated HTTP request history", () => {
  const config = {
    mockHttpEndpointIds: ["creator.health"],
  };
  const changed = runTerminalCommand(
    createTerminalSession(config),
    "curl https://api.creator-dashboard.test/health",
  );
  assert.equal(changed.httpState.history.length, 1);

  const reset = createTerminalSession(config);
  assert.equal(reset.httpState.history.length, 0);
  assert.deepEqual(reset.httpState.enabledEndpointIds, ["creator.health"]);
});

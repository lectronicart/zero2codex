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

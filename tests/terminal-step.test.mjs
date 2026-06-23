import test from "node:test";
import assert from "node:assert/strict";
import { createTerminalSession, runTerminalCommand } from "../src/terminal/state.ts";
import { validateTerminalStep } from "../src/terminal/validation.ts";

test("terminalStep validation checks command history, cwd, and file system", () => {
  const step = {
    expectedCommands: ["mkdir sandbox", "touch sandbox/notes.txt"],
    expectedCurrentDirectory: "/home/codex",
    expectedFileSystem: {
      exists: [{ path: "/home/codex/sandbox/notes.txt", type: "file" }],
    },
    successMessage: "done",
    failureFeedback: "not yet",
  };

  let state = createTerminalSession();
  assert.equal(validateTerminalStep(step, state).ok, false);
  state = runTerminalCommand(state, "mkdir sandbox");
  state = runTerminalCommand(state, "touch sandbox/notes.txt");
  assert.deepEqual(validateTerminalStep(step, state), { ok: true, message: "done" });
});

test("terminalStep validation catches absent-path expectations", () => {
  const step = {
    expectedCommands: ["rm old.txt"],
    expectedFileSystem: {
      absent: ["/home/codex/old.txt"],
    },
    successMessage: "removed",
    failureFeedback: "still there",
  };

  let state = createTerminalSession({
    initialFileSystem: {
      home: {
        type: "directory",
        children: {
          codex: {
            type: "directory",
            children: {
              "old.txt": "delete me",
            },
          },
        },
      },
    },
  });
  state = runTerminalCommand(state, "rm old.txt");
  assert.equal(validateTerminalStep(step, state).ok, true);
});

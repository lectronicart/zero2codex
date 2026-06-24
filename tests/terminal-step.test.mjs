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

test("terminalStep validation checks latest command output", () => {
  const step = {
    expectedCommands: ['grep "Codex" notes.txt'],
    expectedOutput: {
      contains: ["notes.txt:2:Codex reads files"],
    },
    successMessage: "found",
    failureFeedback: "not found",
  };

  let state = createTerminalSession({
    initialFileSystem: {
      home: {
        type: "directory",
        children: {
          codex: {
            type: "directory",
            children: {
              "notes.txt": "hello\nCodex reads files",
            },
          },
        },
      },
    },
  });

  assert.equal(validateTerminalStep(step, state).ok, false);
  state = runTerminalCommand(state, 'grep "Codex" notes.txt');
  assert.deepEqual(validateTerminalStep(step, state), { ok: true, message: "found" });
});

test("terminalStep validation checks Git repository state", () => {
  const step = {
    expectedCommands: ["git add .", 'git commit -m "Start project"'],
    expectedGit: {
      currentBranch: "main",
      commitCount: 1,
      latestCommitMessage: "Start project",
      clean: true,
      snapshot: [{ path: "README.md", content: "# Project" }],
    },
    successMessage: "saved",
    failureFeedback: "not saved",
  };
  let state = createTerminalSession({
    initialFileSystem: {
      home: {
        type: "directory",
        children: {
          codex: {
            type: "directory",
            children: {
              project: {
                type: "directory",
                children: { "README.md": "# Project" },
              },
            },
          },
        },
      },
    },
    startingDirectory: "/home/codex/project",
    setupCommands: ["git init"],
  });
  state = runTerminalCommand(state, "git add .");
  state = runTerminalCommand(state, 'git commit -m "Start project"');
  assert.deepEqual(validateTerminalStep(step, state), {
    ok: true,
    message: "saved",
  });
});

test("terminalStep validation checks structured simulated HTTP state", () => {
  const step = {
    expectedCommands: [
      'curl -X POST -H "Content-Type: application/json" -d \'{"title":"First project"}\' https://api.creator-dashboard.test/projects',
    ],
    expectedHttp: {
      requestCount: 1,
      method: "POST",
      host: "api.creator-dashboard.test",
      path: "/projects",
      headers: { "Content-Type": "application/json" },
      jsonBody: { title: "First project" },
      status: 201,
      responseJsonPaths: ["project"],
    },
    successMessage: "created",
    failureFeedback: "not created",
  };

  let state = createTerminalSession({
    mockHttpEndpointIds: ["creator.projects.create"],
  });
  state = runTerminalCommand(
    state,
    'curl -X POST -H "Content-Type: application/json" -d \'{"title":"First project"}\' https://api.creator-dashboard.test/projects',
  );
  assert.deepEqual(validateTerminalStep(step, state), {
    ok: true,
    message: "created",
  });
});

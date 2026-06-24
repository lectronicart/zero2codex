import test from "node:test";
import assert from "node:assert/strict";
import {
  findRepository,
  getGitDiff,
  getGitStatus,
  getHeadCommit,
  mockRemoteUrls,
} from "../src/git/simulator.ts";
import {
  createTerminalSession,
  runTerminalCommand,
} from "../src/terminal/state.ts";
import { getNode } from "../src/terminal/vfs.ts";

function projectTree() {
  return {
    home: {
      type: "directory",
      children: {
        codex: {
          type: "directory",
          children: {
            project: {
              type: "directory",
              children: {
                "README.md": "# Project",
                "app.js": 'console.log("start");',
              },
            },
          },
        },
      },
    },
  };
}

function start() {
  return createTerminalSession({
    initialFileSystem: projectTree(),
    startingDirectory: "/home/codex/project",
  });
}

function run(state, ...commands) {
  return commands.reduce(
    (current, command) => runTerminalCommand(current, command),
    state,
  );
}

function repository(state) {
  const value = findRepository(state.gitState, state.currentDirectory);
  assert.ok(value);
  return value;
}

function lastEntry(state) {
  return state.entries.at(-1)?.text ?? "";
}

test("git init creates a repository and duplicate init is helpful", () => {
  let state = run(start(), "git init");
  assert.ok(state.gitState.repositories["/home/codex/project"]);
  assert.match(state.lastOutput.join("\n"), /Initialized empty Git repository/);

  state = run(state, "git init");
  assert.match(state.lastOutput.join("\n"), /already tracking/);
  assert.equal(Object.keys(state.gitState.repositories).length, 1);
});

test("git status distinguishes untracked, staged, modified, and clean states", () => {
  let state = run(start(), "git init");
  let status = getGitStatus(state.fileSystem, repository(state));
  assert.deepEqual(status.untracked, ["README.md", "app.js"]);

  state = run(state, "git add README.md");
  status = getGitStatus(state.fileSystem, repository(state));
  assert.deepEqual(status.staged.map((change) => change.path), ["README.md"]);
  assert.deepEqual(status.untracked, ["app.js"]);

  state = run(state, 'git commit -m "Add project guide"');
  status = getGitStatus(state.fileSystem, repository(state));
  assert.deepEqual(status.untracked, ["app.js"]);

  state = run(state, 'echo "# Updated project" > README.md');
  status = getGitStatus(state.fileSystem, repository(state));
  assert.deepEqual(status.unstaged.map((change) => change.path), ["README.md"]);

  state = run(state, "git add .", 'git commit -m "Track project files"');
  assert.equal(getGitStatus(state.fileSystem, repository(state)).clean, true);
});

test("git add and commit create deterministic snapshots and history", () => {
  const state = run(
    start(),
    "git init",
    "git add .",
    'git commit -m "Create starter project"',
    'echo "Second line" >> README.md',
    "git add README.md",
    'git commit -m "Improve project guide"',
    "git log --oneline",
  );
  const repo = repository(state);
  const head = getHeadCommit(repo);

  assert.equal(repo.commitOrder.length, 2);
  assert.equal(head?.message, "Improve project guide");
  assert.equal(head?.snapshot["README.md"], "# Project\nSecond line");
  assert.deepEqual(
    state.lastOutput.map((line) => line.replace(/^[a-f0-9]{7} /, "")),
    ["Improve project guide", "Create starter project"],
  );
});

test("git diff shows working and staged line changes", () => {
  let state = run(
    start(),
    "git init",
    "git add .",
    'git commit -m "Start project"',
    'echo "# Project guide" > README.md',
  );
  let repo = repository(state);
  assert.match(getGitDiff(state.fileSystem, repo).join("\n"), /-# Project/);
  assert.match(
    getGitDiff(state.fileSystem, repo).join("\n"),
    /\+# Project guide/,
  );

  state = run(state, "git add README.md");
  repo = repository(state);
  assert.equal(getGitDiff(state.fileSystem, repo).length, 0);
  assert.match(
    getGitDiff(state.fileSystem, repo, true).join("\n"),
    /\+# Project guide/,
  );
});

test("branches can be created, listed, switched, and checked out", () => {
  let state = run(
    start(),
    "git init",
    "git add .",
    'git commit -m "Start project"',
    "git branch feature",
    "git branch",
  );
  assert.deepEqual(state.lastOutput, ["  feature", "* main"]);

  state = run(state, "git switch feature");
  assert.equal(repository(state).currentBranch, "feature");

  state = run(state, "git checkout main", "git checkout -b experiment");
  assert.equal(repository(state).currentBranch, "experiment");
  assert.ok(Object.hasOwn(repository(state).branches, "experiment"));
});

test("branch switching blocks uncommitted work", () => {
  const state = run(
    start(),
    "git init",
    "git add .",
    'git commit -m "Start project"',
    "git branch feature",
    'echo "unfinished" > README.md',
    "git switch feature",
  );
  assert.match(lastEntry(state), /blocks the switch/);
  assert.equal(repository(state).currentBranch, "main");
});

test("git merge handles fast-forward and non-conflicting histories", () => {
  let state = run(
    start(),
    "git init",
    "git add .",
    'git commit -m "Start project"',
    "git switch -c feature",
    'echo "feature" > feature.txt',
    "git add feature.txt",
    'git commit -m "Add feature"',
    "git switch main",
    "git merge feature",
  );
  assert.equal(repository(state).currentBranch, "main");
  assert.equal(getNode(state.fileSystem, "/home/codex/project/feature.txt")?.type, "file");

  state = run(
    state,
    "git switch -c docs",
    'echo "docs" > docs.txt',
    "git add docs.txt",
    'git commit -m "Add docs"',
    "git switch main",
    'echo "main work" > main.txt',
    "git add main.txt",
    'git commit -m "Add main work"',
    "git merge docs",
  );
  assert.equal(getNode(state.fileSystem, "/home/codex/project/docs.txt")?.type, "file");
  assert.equal(getNode(state.fileSystem, "/home/codex/project/main.txt")?.type, "file");
  assert.match(getHeadCommit(repository(state))?.message ?? "", /Merge branch/);
});

test("git merge records a guided conflict without overwriting files", () => {
  const state = run(
    start(),
    "git init",
    "git add .",
    'git commit -m "Start project"',
    "git switch -c feature",
    'echo "feature version" > README.md',
    "git add README.md",
    'git commit -m "Edit guide on feature"',
    "git switch main",
    'echo "main version" > README.md',
    "git add README.md",
    'git commit -m "Edit guide on main"',
    "git merge feature",
  );
  assert.deepEqual(repository(state).conflict?.files, ["README.md"]);
  assert.match(lastEntry(state), /Merge paused/);
});

test("git restore returns a tracked file to the latest commit", () => {
  const state = run(
    start(),
    "git init",
    "git add .",
    'git commit -m "Start project"',
    'echo "mistake" > README.md',
    "git restore README.md",
  );
  const node = getNode(state.fileSystem, "/home/codex/project/README.md");
  assert.equal(node?.type, "file");
  assert.equal(node.content, "# Project");
  assert.equal(getGitStatus(state.fileSystem, repository(state)).clean, true);
});

test("mocked remotes support add, listing, push, clone, and pull", () => {
  let state = run(
    start(),
    "git init",
    "git add .",
    'git commit -m "Start project"',
    "git remote add origin https://example.test/project.git",
    "git remote -v",
  );
  assert.match(state.lastOutput.join("\n"), /origin/);
  state = run(state, "git push");
  assert.equal(
    state.gitState.remotes["https://example.test/project.git"].branches.main,
    repository(state).branches.main,
  );

  let shared = createTerminalSession();
  shared = run(
    shared,
    `git clone ${mockRemoteUrls.notesApp} first`,
    `git clone ${mockRemoteUrls.notesApp} second`,
    "cd first",
    'echo "Team note" >> notes.txt',
    "git add notes.txt",
    'git commit -m "Add team note"',
    "git push",
    "cd ../second",
    "git pull",
  );
  const node = getNode(shared.fileSystem, "/home/codex/second/notes.txt");
  assert.equal(node?.type, "file");
  assert.match(node.content, /Team note/);
  assert.match(shared.lastOutput.join("\n"), /Pulled origin\/main/);
});

test("git clone uses a built-in preset and never accepts arbitrary URLs", () => {
  let state = run(
    createTerminalSession(),
    `git clone ${mockRemoteUrls.tinySite}`,
  );
  assert.equal(getNode(state.fileSystem, "/home/codex/tiny-site/index.html")?.type, "file");
  assert.ok(state.gitState.repositories["/home/codex/tiny-site"]);

  state = run(state, "git clone https://github.com/unknown/private.git");
  assert.match(lastEntry(state), /mocked repositories/);
});

test("terminal reset rebuilds the original Git lesson state", () => {
  const config = {
    initialFileSystem: projectTree(),
    startingDirectory: "/home/codex/project",
    setupCommands: [
      "git init",
      "git add .",
      'git commit -m "Start project"',
    ],
  };
  const changed = run(
    createTerminalSession(config),
    'echo "change" >> README.md',
    "git add README.md",
  );
  assert.equal(getGitStatus(changed.fileSystem, repository(changed)).staged.length, 1);

  const reset = createTerminalSession(config);
  assert.equal(getGitStatus(reset.fileSystem, repository(reset)).clean, true);
  assert.equal(repository(reset).commitOrder.length, 1);
  assert.deepEqual(reset.history, []);
});

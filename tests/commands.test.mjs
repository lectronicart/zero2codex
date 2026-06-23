import test from "node:test";
import assert from "node:assert/strict";
import { executeCommand } from "../src/terminal/commands.ts";
import { getNode, createFileSystem } from "../src/terminal/vfs.ts";

function run(state, input) {
  const result = executeCommand(state.fileSystem, state.currentDirectory, input);
  return {
    fileSystem: result.fileSystem,
    currentDirectory: result.currentDirectory,
    output: result.output,
    error: result.error,
    clear: result.clear,
  };
}

function start() {
  return {
    fileSystem: createFileSystem({
      home: {
        type: "directory",
        children: {
          codex: {
            type: "directory",
            children: {
              projects: { type: "directory", children: { demo: { type: "directory" } } },
              "notes.txt": "hello",
              "draft.txt": "draft",
            },
          },
        },
      },
    }),
    currentDirectory: "/home/codex",
  };
}

test("pwd prints the current directory", () => {
  const result = run(start(), "pwd");
  assert.deepEqual(result.output, ["/home/codex"]);
});

test("ls lists folders and files", () => {
  const result = run(start(), "ls");
  assert.deepEqual(result.output, ["draft.txt  notes.txt  projects/"]);
});

test("cd supports relative, parent, home, and absolute paths", () => {
  let state = run(start(), "cd projects/demo");
  assert.equal(state.currentDirectory, "/home/codex/projects/demo");
  state = run(state, "cd ..");
  assert.equal(state.currentDirectory, "/home/codex/projects");
  state = run(state, "cd ~");
  assert.equal(state.currentDirectory, "/home/codex");
  state = run(state, "cd /home/codex/projects");
  assert.equal(state.currentDirectory, "/home/codex/projects");
});

test("mkdir creates folders", () => {
  const result = run(start(), "mkdir sandbox");
  assert.equal(getNode(result.fileSystem, "/home/codex/sandbox")?.type, "directory");
});

test("touch creates files", () => {
  const result = run(start(), "touch todo.txt");
  assert.equal(getNode(result.fileSystem, "/home/codex/todo.txt")?.type, "file");
});

test("rm removes files and requires -r for folders", () => {
  let state = run(start(), "rm draft.txt");
  assert.equal(getNode(state.fileSystem, "/home/codex/draft.txt"), null);
  state = run(state, "mkdir temp");
  const blocked = run(state, "rm temp");
  assert.match(blocked.error, /Use rm -r/);
  const removed = run(state, "rm -r temp");
  assert.equal(getNode(removed.fileSystem, "/home/codex/temp"), null);
});

test("cp copies files without deleting the source", () => {
  const result = run(start(), "cp notes.txt backup.txt");
  assert.equal(getNode(result.fileSystem, "/home/codex/notes.txt")?.type, "file");
  assert.equal(getNode(result.fileSystem, "/home/codex/backup.txt")?.type, "file");
});

test("mv renames files", () => {
  const result = run(start(), "mv draft.txt final.txt");
  assert.equal(getNode(result.fileSystem, "/home/codex/draft.txt"), null);
  assert.equal(getNode(result.fileSystem, "/home/codex/final.txt")?.type, "file");
});

test("cat reads files", () => {
  const result = run(start(), "cat notes.txt");
  assert.deepEqual(result.output, ["hello"]);
});

test("echo prints text", () => {
  const result = run(start(), "echo hello terminal");
  assert.deepEqual(result.output, ["hello terminal"]);
});

test("clear marks output for clearing", () => {
  const result = run(start(), "clear");
  assert.equal(result.clear, true);
});

test("help explains supported commands", () => {
  const result = run(start(), "help");
  assert.match(result.output.join(" "), /pwd, ls, cd/);
});

test("invalid paths and unsupported commands produce beginner-friendly errors", () => {
  assert.match(run(start(), "cd missing").error, /does not exist/);
  assert.match(run(start(), "grep hello notes.txt").error, /not supported/);
});

test("commands cannot delete the virtual root", () => {
  assert.match(run(start(), "rm -r /").error, /will not delete the root/);
});

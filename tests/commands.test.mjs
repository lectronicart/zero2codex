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

function text(...lines) {
  return lines.join("\n");
}

function advancedStart() {
  return {
    fileSystem: createFileSystem({
      home: {
        type: "directory",
        children: {
          codex: {
            type: "directory",
            children: {
              "notes.txt": text(
                "hello",
                "Codex reads files",
                "terminal practice helps",
              ),
              "long.txt": text(
                "line 1",
                "line 2",
                "line 3",
                "line 4",
                "line 5",
                "line 6",
                "line 7",
                "line 8",
                "line 9",
                "line 10",
                "line 11",
                "line 12",
              ),
              "app.log": text(
                "INFO start",
                "ERROR missing file",
                "WARN retry",
                "ERROR retry failed",
              ),
              docs: {
                type: "directory",
                children: {
                  "guide.txt": text("Codex guide", "terminal search"),
                  "notes.txt": "plain notes",
                },
              },
            },
          },
        },
      },
    }),
    currentDirectory: "/home/codex",
  };
}

function fileContent(fileSystem, path) {
  const node = getNode(fileSystem, path);
  assert.equal(node?.type, "file");
  return node.content;
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

test("cat reads multiple files and rejects folders", () => {
  const result = run(advancedStart(), "cat notes.txt app.log");
  assert.deepEqual(result.output.slice(0, 3), [
    "hello",
    "Codex reads files",
    "terminal practice helps",
  ]);
  assert.match(run(advancedStart(), "cat docs").error, /folder/);
});

test("head and tail preview file lines", () => {
  assert.deepEqual(run(advancedStart(), "head -n 2 long.txt").output, [
    "line 1",
    "line 2",
  ]);
  assert.deepEqual(run(advancedStart(), "tail -n 2 long.txt").output, [
    "line 11",
    "line 12",
  ]);
  assert.equal(run(advancedStart(), "head long.txt").output.length, 10);
  assert.match(run(advancedStart(), "tail -n nope long.txt").error, /positive whole number/);
});

test("echo prints text", () => {
  const result = run(start(), "echo hello terminal");
  assert.deepEqual(result.output, ["hello terminal"]);
});

test("redirects create, overwrite, and append virtual files", () => {
  let state = run(advancedStart(), 'echo "First draft" > notes.txt');
  assert.equal(fileContent(state.fileSystem, "/home/codex/notes.txt"), "First draft");
  state = run(state, 'echo "Second line" >> notes.txt');
  assert.equal(fileContent(state.fileSystem, "/home/codex/notes.txt"), text("First draft", "Second line"));
  state = run(state, 'echo "Replacement" > notes.txt');
  assert.equal(fileContent(state.fileSystem, "/home/codex/notes.txt"), "Replacement");
});

test("cat output can be redirected to copy file contents", () => {
  const result = run(advancedStart(), "cat notes.txt > copy.txt");
  assert.equal(
    fileContent(result.fileSystem, "/home/codex/copy.txt"),
    text("hello", "Codex reads files", "terminal practice helps"),
  );
});

test("grep searches files and folders recursively", () => {
  assert.deepEqual(run(advancedStart(), 'grep "Codex" notes.txt').output, [
    "notes.txt:2:Codex reads files",
  ]);
  assert.deepEqual(run(advancedStart(), 'grep -r "Codex" docs').output, [
    "docs/guide.txt:1:Codex guide",
  ]);
});

test("rg simulates recursive text search", () => {
  assert.deepEqual(run(advancedStart(), 'rg "terminal" docs').output, [
    "docs/guide.txt:2:terminal search",
  ]);
});

test("wc counts lines, words, and characters", () => {
  assert.deepEqual(run(advancedStart(), "wc -l notes.txt").output, ["3 notes.txt"]);
  assert.deepEqual(run(advancedStart(), "wc notes.txt").output, ["3 7 47 notes.txt"]);
});

test("pipes pass output into the next command", () => {
  assert.deepEqual(run(advancedStart(), 'cat notes.txt | grep "Codex"').output, [
    "Codex reads files",
  ]);
  assert.deepEqual(run(advancedStart(), 'grep "ERROR" app.log | wc -l').output, ["2"]);
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
  assert.match(run(start(), "curl https://example.com").error, /not supported/);
  assert.match(run(advancedStart(), "grep hello docs").error, /recursive search/);
  assert.match(run(advancedStart(), "cat notes.txt | grep hello | wc -l").error, /one pipe/);
  assert.match(run(advancedStart(), "echo hello >").error, /file path/);
});

test("commands cannot delete the virtual root", () => {
  assert.match(run(start(), "rm -r /").error, /will not delete the root/);
});

test("commands cannot escape the virtual file system root", () => {
  const result = run(advancedStart(), 'echo "safe" > ../../../../outside.txt');
  assert.equal(result.error, undefined);
  assert.equal(fileContent(result.fileSystem, "/outside.txt"), "safe");
});

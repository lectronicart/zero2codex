import test from "node:test";
import assert from "node:assert/strict";
import { parseCommand } from "../src/terminal/parser.ts";

test("parser keeps quoted strings together", () => {
  const parsed = parseCommand('echo "hello Codex"');
  assert.equal(parsed.ok, true);
  assert.equal(parsed.command, "echo");
  assert.deepEqual(parsed.args, ["hello Codex"]);
});

test("parser preserves curl headers, JSON bodies, and quoted query strings", () => {
  const parsed = parseCommand(
    `curl -X POST -H "Content-Type: application/json" -d '{"title":"First project"}' "https://api.creator-dashboard.test/projects?status=active&limit=3"`,
  );
  assert.equal(parsed.ok, true);
  assert.equal(parsed.command, "curl");
  assert.deepEqual(parsed.args, [
    "-X",
    "POST",
    "-H",
    "Content-Type: application/json",
    "-d",
    '{"title":"First project"}',
    "https://api.creator-dashboard.test/projects?status=active&limit=3",
  ]);
});

test("parser recognizes one pipe between commands", () => {
  const parsed = parseCommand('cat notes.txt | grep "Codex"');
  assert.equal(parsed.ok, true);
  assert.equal(parsed.command, "cat");
  assert.deepEqual(parsed.args, ["notes.txt"]);
  assert.deepEqual(parsed.pipe, {
    command: "grep",
    args: ["Codex"],
    raw: "grep Codex",
  });
});

test("parser recognizes overwrite and append redirects", () => {
  const overwrite = parseCommand('echo "hello" > notes.txt');
  assert.equal(overwrite.ok, true);
  assert.deepEqual(overwrite.redirect, {
    mode: "overwrite",
    path: "notes.txt",
  });

  const append = parseCommand('echo "again" >> notes.txt');
  assert.equal(append.ok, true);
  assert.deepEqual(append.redirect, {
    mode: "append",
    path: "notes.txt",
  });
});

test("parser rejects invalid or unsupported syntax", () => {
  assert.equal(parseCommand("cat notes.txt | grep Codex | wc -l").ok, false);
  assert.equal(parseCommand("echo hi >").ok, false);
  assert.equal(parseCommand("echo hi ; rm notes.txt").ok, false);
  assert.equal(parseCommand('echo "missing').ok, false);
});

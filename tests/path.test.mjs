import test from "node:test";
import assert from "node:assert/strict";
import {
  getBaseName,
  getParentPath,
  normalizePath,
  resolvePath,
} from "../src/terminal/path.ts";

test("normalizes absolute paths", () => {
  assert.equal(normalizePath("/home/codex/../codex/projects/./demo"), "/home/codex/projects/demo");
  assert.equal(normalizePath("/../../../../"), "/");
});

test("resolves relative, parent, home, and absolute paths", () => {
  assert.equal(resolvePath("/home/codex", "projects/demo"), "/home/codex/projects/demo");
  assert.equal(resolvePath("/home/codex/projects/demo", ".."), "/home/codex/projects");
  assert.equal(resolvePath("/home/codex/projects/demo", "~"), "/home/codex");
  assert.equal(resolvePath("/home/codex", "/tmp/example"), "/tmp/example");
});

test("path resolution cannot escape the virtual root", () => {
  assert.equal(resolvePath("/home/codex", "../../../../../../.."), "/");
  assert.equal(resolvePath("/", ".."), "/");
});

test("returns parent and basename", () => {
  assert.equal(getParentPath("/home/codex/projects/demo"), "/home/codex/projects");
  assert.equal(getBaseName("/home/codex/projects/demo"), "demo");
});

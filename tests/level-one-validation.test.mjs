import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyPath,
  getFileExtension,
  getKnownFileType,
  validateClassification,
  validateMatches,
  validatePathClassification,
  validatePathSegments,
  validateReviewChallenge,
  validateSequence,
  validateSingleChoice,
} from "../src/foundations/levelOneValidation.ts";

test("classifies files and folders with explicit answers", () => {
  const items = [
    { id: "readme", correctCategory: "file" },
    { id: "src", correctCategory: "folder" },
  ];

  assert.equal(
    validateClassification(items, { readme: "file", src: "folder" }),
    true,
  );
  assert.equal(
    validateClassification(items, { readme: "folder", src: "folder" }),
    false,
  );
});

test("validates a folder-tree choice", () => {
  assert.equal(validateSingleChoice("pictures", "pictures"), true);
  assert.equal(validateSingleChoice("documents", "pictures"), false);
});

test("validates path segments in exact order", () => {
  const expected = ["Home", "Documents", "Projects", "README.md"];
  assert.equal(validatePathSegments(expected, expected), true);
  assert.equal(
    validatePathSegments(expected, ["Home", "Projects", "Documents", "README.md"]),
    false,
  );
});

test("classifies absolute and relative paths", () => {
  assert.equal(classifyPath("/home/learner/README.md"), "absolute");
  assert.equal(classifyPath("src/server.js"), "relative");
  assert.equal(classifyPath("C:\\Users\\Learner\\README.md"), "absolute");

  const examples = [
    { id: "one", path: "/home/learner/README.md", correctKind: "absolute" },
    { id: "two", path: "README.md", correctKind: "relative" },
  ];
  assert.equal(
    validatePathClassification(examples, { one: "absolute", two: "relative" }),
    true,
  );
});

test("matches common file extensions to likely file types", () => {
  assert.equal(getFileExtension("README.md"), ".md");
  assert.equal(getFileExtension("package.json"), ".json");
  assert.equal(getFileExtension(".gitignore"), ".gitignore");
  assert.equal(getKnownFileType("server.js"), "JavaScript code");
  assert.equal(getKnownFileType("logo.png"), "image");
});

test("validates file-type matching", () => {
  const items = [
    { id: "readme", correctMatchId: "guide" },
    { id: "server", correctMatchId: "code" },
  ];
  assert.equal(validateMatches(items, { readme: "guide", server: "code" }), true);
  assert.equal(validateMatches(items, { readme: "code", server: "code" }), false);
});

test("validates ordered program steps", () => {
  const correct = ["click", "read", "save", "show"];
  assert.equal(validateSequence(correct, correct), true);
  assert.equal(validateSequence(correct, ["click", "save", "read", "show"]), false);
});

test("validates terminal concept classifications", () => {
  const items = [
    { id: "click-folder", correctCategory: "desktop" },
    { id: "type-location", correctCategory: "terminal" },
  ];
  assert.equal(
    validateClassification(items, {
      "click-folder": "desktop",
      "type-location": "terminal",
    }),
    true,
  );
});

test("validates the complete Level 1 review challenge", () => {
  const answer = {
    classifications: {
      readme: "file",
      src: "folder",
    },
    treePath: "Home/Documents/Projects/tiny-api/README.md",
    pathSegments: ["Home", "Documents", "Projects", "tiny-api", "README.md"],
    fileType: "Markdown text",
    readmePurpose: "Project notes and setup instructions",
    sourceFolder: "src",
    nextConcept: "show what is here",
  };
  const state = {
    classifications: {
      readme: "file",
      src: "folder",
    },
    selectedTreePath: "Home/Documents/Projects/tiny-api/README.md",
    pathSegments: ["Home", "Documents", "Projects", "tiny-api", "README.md"],
    fileType: "Markdown text",
    readmePurpose: "Project notes and setup instructions",
    sourceFolder: "src",
    nextConcept: "show what is here",
  };

  assert.equal(validateReviewChallenge(answer, state), true);
  assert.equal(
    validateReviewChallenge(answer, { ...state, sourceFolder: "data" }),
    false,
  );
});

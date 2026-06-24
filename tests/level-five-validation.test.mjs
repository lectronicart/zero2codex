import test from "node:test";
import assert from "node:assert/strict";
import {
  advanceRequest,
  canSendRequest,
  isRequestComplete,
  parseJsonSafely,
  sendRequest,
  validateAssignments,
  validateChoice,
  validateJsonAnswers,
  validateOrder,
  validateSystemBuilder,
} from "../src/concepts/levelFiveValidation.ts";

test("assignment interactions validate every item relationship", () => {
  const items = [
    { id: "browser", correctCategoryId: "client" },
    { id: "permissions", correctCategoryId: "server" },
  ];
  assert.equal(
    validateAssignments(items, { browser: "client", permissions: "server" }),
    true,
  );
  assert.equal(
    validateAssignments(items, { browser: "server", permissions: "server" }),
    false,
  );
});

test("sequence interactions require the exact order", () => {
  assert.equal(validateOrder(["review", "build", "deploy"], ["review", "build", "deploy"]), true);
  assert.equal(validateOrder(["review", "build", "deploy"], ["build", "review", "deploy"]), false);
});

test("request simulator only sends the documented request", () => {
  const initial = { method: "POST", path: "/api/projects", phaseIndex: 0, sent: false };
  assert.equal(canSendRequest("GET", "/api/projects", initial), false);
  assert.deepEqual(sendRequest("GET", "/api/projects", initial), initial);

  const ready = { ...initial, method: "GET" };
  const sent = sendRequest("GET", "/api/projects", ready);
  assert.equal(sent.sent, true);
  assert.equal(isRequestComplete(sent, 3), false);
});

test("request simulator advances through phases and stops at the response", () => {
  let state = sendRequest("GET", "/api/projects", {
    method: "GET",
    path: "/api/projects",
    phaseIndex: 0,
    sent: false,
  });
  state = advanceRequest(state, 3);
  state = advanceRequest(state, 3);
  state = advanceRequest(state, 3);
  assert.equal(state.phaseIndex, 2);
  assert.equal(isRequestComplete(state, 3), true);
});

test("JSON inspector parses valid JSON and rejects invalid JSON", () => {
  const valid = parseJsonSafely('{"published":false,"tags":["design"]}');
  assert.equal(valid.ok, true);
  const invalid = parseJsonSafely("{published:false}");
  assert.equal(invalid.ok, false);
});

test("JSON questions validate inspected data types", () => {
  const questions = [
    { id: "published", correctOption: "boolean" },
    { id: "tags", correctOption: "array" },
  ];
  assert.equal(
    validateJsonAnswers(questions, { published: "boolean", tags: "array" }),
    true,
  );
  assert.equal(
    validateJsonAnswers(questions, { published: "string", tags: "array" }),
    false,
  );
});

test("data-table choices validate the intended record action", () => {
  assert.equal(validateChoice("update", "update"), true);
  assert.equal(validateChoice("delete", "update"), false);
});

test("system builders validate every required component slot", () => {
  const slots = [
    { id: "frontend", correctComponentId: "react" },
    { id: "database", correctComponentId: "postgres" },
  ];
  assert.equal(
    validateSystemBuilder(slots, { frontend: "react", database: "postgres" }),
    true,
  );
  assert.equal(
    validateSystemBuilder(slots, { frontend: "postgres", database: "react" }),
    false,
  );
});

import test from "node:test";
import assert from "node:assert/strict";
import { parseCurlArgs } from "../src/http/curl.ts";
import { allMockEndpointIds } from "../src/http/endpoints.ts";
import {
  createHttpState,
  executeCurlCommand,
} from "../src/http/state.ts";
import { parseMockUrl } from "../src/http/url.ts";
import {
  createTerminalSession,
  runTerminalCommand,
} from "../src/terminal/state.ts";

test("mock URL parsing identifies scheme, host, path, query, and fragment", () => {
  const parsed = parseMockUrl(
    "https://api.creator-dashboard.test/projects?status=active&limit=3#results",
  );
  assert.equal(parsed.scheme, "https");
  assert.equal(parsed.host, "api.creator-dashboard.test");
  assert.equal(parsed.path, "/projects");
  assert.deepEqual(parsed.query, { status: "active", limit: "3" });
  assert.equal(parsed.fragment, "results");
});

test("mock URL parsing rejects non-HTTPS and every real or unknown host", () => {
  assert.throws(
    () => parseMockUrl("http://api.creator-dashboard.test/health"),
    /https/,
  );
  assert.throws(() => parseMockUrl("https://api.github.com/user"), /offline/);
  assert.throws(() => parseMockUrl("https://example.com"), /offline/);
});

test("curl parser supports the documented flag combinations", () => {
  const parsed = parseCurlArgs([
    "-i",
    "-X",
    "POST",
    "-H",
    "Content-Type: application/json",
    "-H",
    "Accept: application/json",
    "-d",
    '{"title":"First project"}',
    "https://api.creator-dashboard.test/projects",
  ]);
  assert.equal(parsed.includeResponseHeaders, true);
  assert.equal(parsed.method, "POST");
  assert.deepEqual(parsed.headers, {
    "content-type": "application/json",
    accept: "application/json",
  });
  assert.equal(parsed.body, '{"title":"First project"}');
});

test("curl parser defaults -d to POST and rejects unsupported syntax", () => {
  assert.equal(
    parseCurlArgs([
      "-d",
      '{"title":"First project"}',
      "https://api.creator-dashboard.test/projects",
    ]).method,
    "POST",
  );
  assert.throws(
    () =>
      parseCurlArgs([
        "--upload-file",
        "secret.txt",
        "https://api.creator-dashboard.test/projects",
      ]),
    /does not support/,
  );
  assert.throws(
    () =>
      parseCurlArgs([
        "https://api.creator-dashboard.test/health",
        "https://api.creator-dashboard.test/projects",
      ]),
    /one URL/,
  );
});

test("GET routing handles query parameters and response headers", () => {
  const result = executeCurlCommand(
    createHttpState(["creator.projects.list"]),
    [
      "-i",
      "-H",
      "Accept: application/json",
      "https://api.creator-dashboard.test/projects?status=active&limit=1",
    ],
  );
  assert.equal(result.error, undefined);
  assert.match(result.output.join("\n"), /HTTP\/1.1 200 OK/);
  assert.match(result.output.join("\n"), /Content-Type: application\/json/);
  const exchange = result.httpState.history[0];
  assert.equal(exchange.request.url.query.status, "active");
  assert.equal(exchange.request.url.query.limit, "1");
  assert.equal(exchange.request.headers.accept, "application/json");
  assert.equal(exchange.response.status, 200);
});

test("POST routing parses and validates a JSON request body", () => {
  const result = executeCurlCommand(
    createHttpState(["creator.projects.create"]),
    [
      "-X",
      "POST",
      "-H",
      "Content-Type: application/json",
      "-d",
      '{"title":"First project"}',
      "https://api.creator-dashboard.test/projects",
    ],
  );
  const exchange = result.httpState.history[0];
  assert.deepEqual(exchange.request.jsonBody, { title: "First project" });
  assert.equal(exchange.response.status, 201);
  assert.match(exchange.response.body, /First project/);
});

test("the simulator exposes every required status-code teaching path", () => {
  const scenarios = [
    {
      status: 200,
      args: ["https://api.creator-dashboard.test/health"],
    },
    {
      status: 201,
      args: [
        "-X",
        "POST",
        "-H",
        "Content-Type: application/json",
        "-d",
        '{"title":"Created"}',
        "https://api.creator-dashboard.test/projects",
      ],
    },
    {
      status: 400,
      args: ["https://api.creator-dashboard.test/tasks"],
    },
    {
      status: 401,
      args: ["https://api.creator-dashboard.test/users/me"],
    },
    {
      status: 403,
      args: [
        "-H",
        "Authorization: Bearer WRONG_DEMO_TOKEN",
        "https://api.creator-dashboard.test/users/me",
      ],
    },
    {
      status: 404,
      args: ["https://api.creator-dashboard.test/missing"],
    },
    {
      status: 429,
      args: ["https://api.github.test/user/repos?simulate=rate-limit"],
    },
    {
      status: 500,
      args: [
        "https://api.creator-dashboard.test/projects?simulate=server-error",
      ],
    },
  ];

  for (const scenario of scenarios) {
    const result = executeCurlCommand(
      createHttpState(allMockEndpointIds),
      scenario.args,
    );
    assert.equal(
      result.httpState.history[0].response.status,
      scenario.status,
      `expected ${scenario.status}`,
    );
  }
});

test("invalid JSON and wrong content type produce distinct diagnoses", () => {
  const invalidJson = executeCurlCommand(
    createHttpState(["creator.projects.create"]),
    [
      "-X",
      "POST",
      "-H",
      "Content-Type: application/json",
      "-d",
      "{bad json}",
      "https://api.creator-dashboard.test/projects",
    ],
  );
  assert.equal(
    invalidJson.httpState.history[0].response.diagnosis,
    "invalid-json",
  );

  const wrongType = executeCurlCommand(
    createHttpState(["creator.projects.create"]),
    [
      "-X",
      "POST",
      "-d",
      '{"title":"No header"}',
      "https://api.creator-dashboard.test/projects",
    ],
  );
  assert.equal(
    wrongType.httpState.history[0].response.diagnosis,
    "wrong-content-type",
  );
});

test("simulated curl never calls fetch or another browser network primitive", () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    throw new Error("fetch must never run");
  };

  try {
    const result = executeCurlCommand(
      createHttpState(["creator.health"]),
      ["https://api.creator-dashboard.test/health"],
    );
    assert.equal(result.httpState.history[0].response.status, 200);
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("terminal entries distinguish HTTP status, headers, bodies, and errors", () => {
  const success = runTerminalCommand(
    createTerminalSession({
      mockHttpEndpointIds: ["creator.health"],
    }),
    "curl -i https://api.creator-dashboard.test/health",
  );
  assert.ok(success.entries.some((item) => item.kind === "http-status"));
  assert.ok(success.entries.some((item) => item.kind === "http-header"));
  assert.ok(success.entries.some((item) => item.kind === "http-body"));

  const failure = runTerminalCommand(
    createTerminalSession({
      mockHttpEndpointIds: ["creator.tasks"],
    }),
    "curl -i https://api.creator-dashboard.test/tasks",
  );
  assert.ok(failure.entries.some((item) => item.kind === "http-error-status"));
  assert.ok(failure.entries.some((item) => item.kind === "http-error-body"));
});

import type { TerminalSessionState } from "../terminal/types.ts";
import type { MockHttpDiagnosis, MockHttpMethod } from "./types.ts";

export type HttpExpectation = {
  requestCount?: number;
  method?: MockHttpMethod;
  host?: string;
  path?: string;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  jsonBody?: unknown;
  status?: number;
  responseBodyContains?: string[];
  responseJsonPaths?: string[];
  diagnosis?: MockHttpDiagnosis;
  historyStatuses?: number[];
  historyDiagnoses?: MockHttpDiagnosis[];
};

export function validateHttpExpectation(
  expected: HttpExpectation | undefined,
  state: TerminalSessionState,
): { ok: true } | { ok: false; message: string } {
  if (!expected) {
    return { ok: true };
  }

  const history = state.httpState.history;
  if (
    expected.requestCount !== undefined &&
    history.length !== expected.requestCount
  ) {
    return {
      ok: false,
      message: `The simulated request history has ${history.length} request(s), not ${expected.requestCount}.`,
    };
  }

  const latest = history.at(-1);
  if (!latest) {
    return { ok: false, message: "No simulated HTTP request has been made yet." };
  }

  if (expected.method && latest.request.method !== expected.method) {
    return { ok: false, message: `The latest request used ${latest.request.method}, not ${expected.method}.` };
  }
  if (expected.host && latest.request.url.host !== expected.host) {
    return { ok: false, message: "The latest request used the wrong mock API host." };
  }
  if (expected.path && latest.request.url.path !== expected.path) {
    return { ok: false, message: `The latest request path is ${latest.request.url.path}, not ${expected.path}.` };
  }

  for (const [key, value] of Object.entries(expected.query ?? {})) {
    if (latest.request.url.query[key] !== value) {
      return { ok: false, message: `The ${key} query parameter is not ${value} yet.` };
    }
  }

  for (const [name, value] of Object.entries(expected.headers ?? {})) {
    if (latest.request.headers[name.toLowerCase()] !== value) {
      return { ok: false, message: `The ${name} request header is not correct yet.` };
    }
  }

  if (
    expected.jsonBody !== undefined &&
    JSON.stringify(latest.request.jsonBody) !== JSON.stringify(expected.jsonBody)
  ) {
    return { ok: false, message: "The latest request JSON body is not correct yet." };
  }

  if (expected.status !== undefined && latest.response.status !== expected.status) {
    return { ok: false, message: `The latest response status is ${latest.response.status}, not ${expected.status}.` };
  }

  for (const snippet of expected.responseBodyContains ?? []) {
    if (!latest.response.body.includes(snippet)) {
      return { ok: false, message: `The latest response body does not include ${snippet} yet.` };
    }
  }

  for (const path of expected.responseJsonPaths ?? []) {
    if (!hasJsonPath(latest.response.jsonBody, path)) {
      return { ok: false, message: `The latest JSON response does not contain ${path}.` };
    }
  }

  if (expected.diagnosis && latest.response.diagnosis !== expected.diagnosis) {
    return { ok: false, message: `The latest response does not demonstrate ${expected.diagnosis} yet.` };
  }

  const statuses = history.map((exchange) => exchange.response.status);
  for (const status of expected.historyStatuses ?? []) {
    if (!statuses.includes(status)) {
      return { ok: false, message: `The request history has not produced status ${status} yet.` };
    }
  }

  const diagnoses = history
    .map((exchange) => exchange.response.diagnosis)
    .filter((value): value is MockHttpDiagnosis => Boolean(value));
  for (const diagnosis of expected.historyDiagnoses ?? []) {
    if (!diagnoses.includes(diagnosis)) {
      return { ok: false, message: `The request history has not demonstrated ${diagnosis} yet.` };
    }
  }

  return { ok: true };
}

function hasJsonPath(value: unknown, path: string) {
  let current: unknown = value;
  for (const segment of path.split(".")) {
    if (typeof current !== "object" || current === null || !(segment in current)) {
      return false;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return true;
}

import { mockEndpointCatalog } from "./endpoints.ts";
import type {
  MockEndpointDefinition,
  MockHttpRequest,
  MockHttpResponse,
} from "./types.ts";

export function routeMockRequest(
  request: MockHttpRequest,
  enabledEndpointIds: string[],
): { endpointId: string | null; response: MockHttpResponse } {
  const enabled = new Set(enabledEndpointIds);
  const candidates = mockEndpointCatalog.filter(
    (endpoint) =>
      enabled.has(endpoint.id) &&
      endpoint.host === request.url.host,
  );

  for (const endpoint of candidates) {
    const pathParams = matchPath(endpoint, request.url.path);
    if (!pathParams || !endpoint.methods.includes(request.method)) {
      continue;
    }
    return {
      endpointId: endpoint.id,
      response: endpoint.handle(request, pathParams),
    };
  }

  return {
    endpointId: null,
    response: {
      status: 404,
      statusText: "Not Found",
      headers: {
        "Content-Type": "application/json",
        "X-Zero2Codex-Simulated": "true",
      },
      body: JSON.stringify(
        { error: `No simulated endpoint matches ${request.method} ${request.url.path}` },
        null,
        2,
      ),
      jsonBody: {
        error: `No simulated endpoint matches ${request.method} ${request.url.path}`,
      },
      diagnosis: request.url.path === "/" ? "wrong-url" : "not-found",
    },
  };
}

function matchPath(
  endpoint: MockEndpointDefinition,
  requestPath: string,
): Record<string, string> | null {
  const patternParts = endpoint.pathPattern.split("/").filter(Boolean);
  const requestParts = requestPath.split("/").filter(Boolean);
  if (patternParts.length !== requestParts.length) {
    return null;
  }

  const params: Record<string, string> = {};
  for (let index = 0; index < patternParts.length; index += 1) {
    const pattern = patternParts[index];
    const value = requestParts[index];
    if (pattern.startsWith(":")) {
      params[pattern.slice(1)] = decodeURIComponent(value);
      continue;
    }
    if (pattern !== value) {
      return null;
    }
  }
  return params;
}

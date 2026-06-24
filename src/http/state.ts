import { formatCurlResponse, parseCurlArgs } from "./curl.ts";
import { routeMockRequest } from "./router.ts";
import type {
  CurlCommandResult,
  MockHttpRequest,
  MockHttpState,
  MockHttpSummary,
} from "./types.ts";

export function createHttpState(
  enabledEndpointIds: string[] = [],
): MockHttpState {
  return {
    enabledEndpointIds: [...enabledEndpointIds],
    history: [],
    sequence: 0,
  };
}

export function executeCurlCommand(
  state: MockHttpState,
  args: string[],
): CurlCommandResult {
  try {
    const curl = parseCurlArgs(args);
    const next: MockHttpState = {
      enabledEndpointIds: [...state.enabledEndpointIds],
      history: [...state.history],
      sequence: state.sequence + 1,
    };
    const request: MockHttpRequest = {
      id: `request-${next.sequence}`,
      method: curl.method,
      url: curl.url,
      headers: { ...curl.headers },
      body: curl.body,
      includeResponseHeaders: curl.includeResponseHeaders,
    };

    if (curl.body !== undefined) {
      try {
        request.jsonBody = JSON.parse(curl.body);
      } catch {
        // Invalid JSON is routed to a deterministic 400 response.
      }
    }

    const routed = routeMockRequest(request, next.enabledEndpointIds);
    next.history.push({
      request,
      response: routed.response,
      endpointId: routed.endpointId,
    });

    return {
      httpState: next,
      output: formatCurlResponse(
        routed.response,
        curl.includeResponseHeaders,
      ),
    };
  } catch (error) {
    return {
      httpState: state,
      output: [],
      error:
        error instanceof Error
          ? error.message
          : "That simulated curl request could not run.",
    };
  }
}

export function getHttpSummary(
  state: MockHttpState,
): MockHttpSummary | null {
  const latest = state.history.at(-1);
  if (!latest) {
    return null;
  }
  return {
    method: latest.request.method,
    path: latest.request.url.path,
    status: latest.response.status,
    requestCount: state.history.length,
  };
}

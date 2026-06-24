export type MockHttpMethod = "GET" | "POST";

export type MockHttpDiagnosis =
  | "wrong-url"
  | "missing-query"
  | "invalid-json"
  | "missing-authorization"
  | "wrong-authorization"
  | "wrong-content-type"
  | "not-found"
  | "rate-limit"
  | "server-error";

export type ParsedMockUrl = {
  href: string;
  scheme: "https";
  host: string;
  path: string;
  query: Record<string, string>;
  fragment: string;
};

export type MockHttpRequest = {
  id: string;
  method: MockHttpMethod;
  url: ParsedMockUrl;
  headers: Record<string, string>;
  body?: string;
  jsonBody?: unknown;
  includeResponseHeaders: boolean;
};

export type MockHttpResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  jsonBody?: unknown;
  diagnosis?: MockHttpDiagnosis;
};

export type MockHttpExchange = {
  request: MockHttpRequest;
  response: MockHttpResponse;
  endpointId: string | null;
};

export type MockHttpState = {
  enabledEndpointIds: string[];
  history: MockHttpExchange[];
  sequence: number;
};

export type MockEndpointDefinition = {
  id: string;
  host: string;
  pathPattern: string;
  methods: MockHttpMethod[];
  handle: (
    request: MockHttpRequest,
    pathParams: Record<string, string>,
  ) => MockHttpResponse;
};

export type CurlCommand = {
  method: MockHttpMethod;
  url: ParsedMockUrl;
  headers: Record<string, string>;
  body?: string;
  includeResponseHeaders: boolean;
};

export type CurlCommandResult = {
  httpState: MockHttpState;
  output: string[];
  error?: string;
};

export type MockHttpSummary = {
  method: MockHttpMethod;
  path: string;
  status: number;
  requestCount: number;
};

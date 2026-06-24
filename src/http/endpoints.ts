import type {
  MockEndpointDefinition,
  MockHttpRequest,
  MockHttpResponse,
} from "./types.ts";

const projects = [
  { id: 1, title: "Portfolio launch", status: "active" },
  { id: 2, title: "Course site", status: "done" },
  { id: 3, title: "Newsletter refresh", status: "active" },
  { id: 4, title: "Workshop page", status: "active" },
];

function json(
  status: number,
  statusText: string,
  value: unknown,
  diagnosis?: MockHttpResponse["diagnosis"],
): MockHttpResponse {
  return {
    status,
    statusText,
    headers: {
      "Content-Type": "application/json",
      "X-Zero2Codex-Simulated": "true",
    },
    body: JSON.stringify(value, null, 2),
    jsonBody: value,
    diagnosis,
  };
}

function text(
  status: number,
  statusText: string,
  body: string,
  diagnosis?: MockHttpResponse["diagnosis"],
): MockHttpResponse {
  return {
    status,
    statusText,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Zero2Codex-Simulated": "true",
    },
    body,
    diagnosis,
  };
}

function authorization(request: MockHttpRequest) {
  return request.headers.authorization ?? "";
}

export const mockEndpointCatalog: MockEndpointDefinition[] = [
  {
    id: "creator.health",
    host: "api.creator-dashboard.test",
    pathPattern: "/health",
    methods: ["GET"],
    handle: () => text(200, "OK", "Creator Dashboard API is healthy."),
  },
  {
    id: "creator.projects.list",
    host: "api.creator-dashboard.test",
    pathPattern: "/projects",
    methods: ["GET"],
    handle: (request) => {
      if (request.url.query.simulate === "server-error") {
        return json(
          500,
          "Internal Server Error",
          { error: "The simulated project service failed." },
          "server-error",
        );
      }

      const status = request.url.query.status;
      if (status && !["active", "done"].includes(status)) {
        return json(
          400,
          "Bad Request",
          { error: "status must be active or done" },
          "missing-query",
        );
      }

      const limitText = request.url.query.limit;
      const limit = limitText === undefined ? projects.length : Number(limitText);
      if (!Number.isInteger(limit) || limit <= 0) {
        return json(
          400,
          "Bad Request",
          { error: "limit must be a positive whole number" },
          "missing-query",
        );
      }

      const filtered = status
        ? projects.filter((project) => project.status === status)
        : projects;
      return json(200, "OK", { projects: filtered.slice(0, limit) });
    },
  },
  {
    id: "creator.projects.create",
    host: "api.creator-dashboard.test",
    pathPattern: "/projects",
    methods: ["POST"],
    handle: (request) => {
      if (request.headers["content-type"] !== "application/json") {
        return json(
          400,
          "Bad Request",
          { error: "Content-Type must be application/json" },
          "wrong-content-type",
        );
      }

      if (request.body === undefined) {
        return json(
          400,
          "Bad Request",
          { error: "A JSON request body is required" },
          "invalid-json",
        );
      }

      let value: unknown;
      try {
        value = JSON.parse(request.body);
      } catch {
        return json(
          400,
          "Bad Request",
          { error: "The request body is not valid JSON" },
          "invalid-json",
        );
      }

      if (
        typeof value !== "object" ||
        value === null ||
        typeof (value as { title?: unknown }).title !== "string" ||
        !(value as { title: string }).title.trim()
      ) {
        return json(
          400,
          "Bad Request",
          { error: "title is required" },
          "invalid-json",
        );
      }

      const created = {
        id: 5,
        title: (value as { title: string }).title,
        status: "active",
      };
      return json(201, "Created", { project: created });
    },
  },
  {
    id: "creator.projects.detail",
    host: "api.creator-dashboard.test",
    pathPattern: "/projects/:id",
    methods: ["GET"],
    handle: (_request, params) => {
      const project = projects.find((item) => String(item.id) === params.id);
      return project
        ? json(200, "OK", { project })
        : json(
            404,
            "Not Found",
            { error: `No project exists with id ${params.id}` },
            "not-found",
          );
    },
  },
  {
    id: "creator.tasks",
    host: "api.creator-dashboard.test",
    pathPattern: "/tasks",
    methods: ["GET"],
    handle: (request) =>
      request.url.query.projectId
        ? json(200, "OK", {
            tasks: [
              { id: 1, projectId: Number(request.url.query.projectId), title: "Review draft" },
            ],
          })
        : json(
            400,
            "Bad Request",
            { error: "projectId query parameter is required" },
            "missing-query",
          ),
  },
  {
    id: "creator.users.me",
    host: "api.creator-dashboard.test",
    pathPattern: "/users/me",
    methods: ["GET"],
    handle: (request) => {
      const value = authorization(request);
      if (!value) {
        return json(
          401,
          "Unauthorized",
          { error: "Authorization header is required" },
          "missing-authorization",
        );
      }
      if (value !== "Bearer DEMO_TOKEN") {
        return json(
          403,
          "Forbidden",
          { error: "The fake demo token is not allowed" },
          "wrong-authorization",
        );
      }
      return json(200, "OK", { user: { id: 1, name: "Demo Creator" } });
    },
  },
  {
    id: "github.user.repos",
    host: "api.github.test",
    pathPattern: "/user/repos",
    methods: ["GET"],
    handle: (request) => {
      if (request.url.query.simulate === "rate-limit") {
        return json(
          429,
          "Too Many Requests",
          { error: "Simulated API rate limit reached" },
          "rate-limit",
        );
      }
      const value = authorization(request);
      if (!value) {
        return json(
          401,
          "Unauthorized",
          { error: "Authorization header is required" },
          "missing-authorization",
        );
      }
      if (value !== "Bearer ghp_demo_not_real") {
        return json(
          403,
          "Forbidden",
          { error: "The fake GitHub-style token is not allowed" },
          "wrong-authorization",
        );
      }
      return json(200, "OK", {
        repositories: [
          { name: "creator-dashboard", visibility: "public" },
          { name: "demo-project", visibility: "private" },
        ],
        rateLimit: { remaining: 59 },
      });
    },
  },
  {
    id: "github.issues",
    host: "api.github.test",
    pathPattern: "/repos/demo-user/demo-project/issues",
    methods: ["GET"],
    handle: () => json(200, "OK", { issues: [{ number: 12, title: "Improve empty state" }] }),
  },
  {
    id: "github.pulls",
    host: "api.github.test",
    pathPattern: "/repos/demo-user/demo-project/pulls",
    methods: ["GET"],
    handle: () => json(200, "OK", { pulls: [{ number: 4, title: "Add project filters" }] }),
  },
  {
    id: "openai.demo.models",
    host: "api.openai.test",
    pathPattern: "/v1/models",
    methods: ["GET"],
    handle: (request) => {
      const value = authorization(request);
      if (!value) {
        return json(
          401,
          "Unauthorized",
          { error: "A fake Authorization header is required" },
          "missing-authorization",
        );
      }
      if (value !== "Bearer sk-demo-not-real") {
        return json(
          403,
          "Forbidden",
          { error: "Only the intentionally fake course token is accepted" },
          "wrong-authorization",
        );
      }
      return json(200, "OK", { models: ["demo-model"] });
    },
  },
];

export const allMockEndpointIds = mockEndpointCatalog.map((endpoint) => endpoint.id);

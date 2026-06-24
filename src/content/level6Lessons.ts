import type {
  ConceptInteractionSection,
  Lesson,
  TerminalStepSection,
} from "./lessonSchema.ts";

const creatorEndpoints = [
  "creator.health",
  "creator.projects.list",
  "creator.projects.create",
  "creator.projects.detail",
  "creator.tasks",
  "creator.users.me",
];

const narrative = (
  id: string,
  title: string,
  body: string,
  keyPoints?: string[],
) => ({
  id,
  type: "narrative" as const,
  title,
  body,
  keyPoints,
});

const whyCodex = (id: string, body: string) =>
  narrative(id, "Why this matters with Codex", body);

const quiz = (
  id: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
) => ({
  id,
  type: "quiz" as const,
  title: "Quick check",
  question,
  options,
  correctIndex,
  explanation,
});

const concept = (
  id: string,
  title: string,
  section: Omit<ConceptInteractionSection, "id" | "type" | "title">,
): ConceptInteractionSection => ({
  id,
  type: "conceptInteraction",
  title,
  ...section,
});

const terminalStep = (
  id: string,
  title: string,
  step: Omit<TerminalStepSection, "id" | "type" | "title">,
): TerminalStepSection => ({
  id,
  type: "terminalStep",
  title,
  ...step,
});

export const level6Lessons: Lesson[] = [
  {
    id: "6.1",
    levelId: 6,
    title: "What Is a URL, Really?",
    subtitle: "Read the address of an internet resource one part at a time.",
    estimatedMinutes: 8,
    nextLessonId: "6.2",
    completionMessage: "You can identify the main parts of a URL.",
    sections: [
      narrative(
        "6.1-intro",
        "A URL is a structured address",
        "A URL tells a client where and how to request a resource. In https://api.creator-dashboard.test/projects?status=active#results, https is the scheme, api.creator-dashboard.test is the domain, /projects is the path, status=active is a query parameter, and results is a fragment. The fragment stays in the client and is not sent to the server.",
      ),
      concept("6.1-anatomy", "Label a URL", {
        instructions: "Match each visible URL piece to its role.",
        simulationLabel: "Simulation: URL anatomy",
        hint: "The scheme comes before ://, the domain names the host, and the path begins with /.",
        successMessage: "Correct. You separated the address into scheme, domain, path, query, and fragment.",
        failureFeedback: "Read the punctuation around each piece: ://, /, ?, and # are useful clues.",
        interaction: {
          kind: "assignment",
          prompt: "Label https://api.creator-dashboard.test/projects?status=active#results",
          categories: [
            { id: "scheme", label: "Scheme / protocol" },
            { id: "domain", label: "Domain / host" },
            { id: "path", label: "Path" },
            { id: "query", label: "Query parameter" },
            { id: "fragment", label: "Fragment" },
          ],
          items: [
            { id: "https", label: "https", description: "How the client communicates.", correctCategoryId: "scheme" },
            { id: "host", label: "api.creator-dashboard.test", description: "The named mock service.", correctCategoryId: "domain" },
            { id: "projects", label: "/projects", description: "The resource location inside the service.", correctCategoryId: "path" },
            { id: "status", label: "status=active", description: "A filter after the question mark.", correctCategoryId: "query" },
            { id: "results", label: "results", description: "A client-side location after #.", correctCategoryId: "fragment" },
          ],
        },
      }),
      whyCodex(
        "6.1-codex",
        "Give Codex the exact URL and name the part you suspect. A wrong host, path, or query parameter causes different failures, so precise URL language makes debugging faster.",
      ),
      quiz(
        "6.1-check",
        "Which URL part usually filters a collection?",
        ["A query parameter", "The scheme", "The fragment"],
        0,
        "Query parameters follow ? and often filter, search, sort, or limit results.",
      ),
    ],
  },
  {
    id: "6.2",
    levelId: 6,
    title: "Your First curl",
    subtitle: "Make a harmless GET request inside the offline simulator.",
    estimatedMinutes: 8,
    nextLessonId: "6.3",
    completionMessage: "You made your first browser-safe curl request.",
    sections: [
      narrative(
        "6.2-intro",
        "curl sends requests from a terminal",
        "curl is a terminal tool for transferring data with URLs. A plain curl URL uses GET here. The /health endpoint returns a short plain-text response so you can confirm the simulated API is available. This lesson never contacts the internet.",
      ),
      terminalStep("6.2-terminal", "Check API health", {
        instructions:
          "Run curl https://api.creator-dashboard.test/health. Expect the text Creator Dashboard API is healthy.",
        mockHttpEndpointIds: ["creator.health"],
        expectedCommands: [
          "curl https://api.creator-dashboard.test/health",
        ],
        expectedOutput: {
          equals: ["Creator Dashboard API is healthy."],
        },
        expectedHttp: {
          method: "GET",
          host: "api.creator-dashboard.test",
          path: "/health",
          status: 200,
          responseBodyContains: ["healthy"],
        },
        successMessage:
          "The offline health endpoint returned 200 OK and a plain-text body.",
        hint: "Use curl followed by the complete https URL.",
        failureFeedback:
          "Use the exact mock URL. No real service is contacted.",
      }),
      whyCodex(
        "6.2-codex",
        "A tested curl command gives Codex concrete evidence. You can ask it to explain the request or reproduce it in code without sharing a real secret.",
      ),
      quiz(
        "6.2-check",
        "What HTTP method did plain curl use in this lesson?",
        ["GET", "POST", "DELETE"],
        0,
        "A plain curl URL uses GET in this simulator.",
      ),
    ],
  },
  {
    id: "6.3",
    levelId: 6,
    title: "Query Parameters in Action",
    subtitle: "Filter and limit a collection through the URL.",
    estimatedMinutes: 9,
    nextLessonId: "6.4",
    completionMessage: "You filtered a mock API collection with query parameters.",
    sections: [
      narrative(
        "6.3-intro",
        "Query parameters refine a request",
        "A query string begins after ?. Each key=value pair adds information to the request. An ampersand joins multiple parameters. Here, status=active filters projects and limit=3 caps the number returned.",
      ),
      terminalStep("6.3-terminal", "Filter active projects", {
        instructions:
          'Run curl "https://api.creator-dashboard.test/projects?status=active&limit=3". Expect JSON containing only active projects, with at most three records.',
        mockHttpEndpointIds: ["creator.projects.list"],
        expectedCommands: [
          'curl "https://api.creator-dashboard.test/projects?status=active&limit=3"',
        ],
        expectedHttp: {
          method: "GET",
          path: "/projects",
          query: { status: "active", limit: "3" },
          status: 200,
          responseJsonPaths: ["projects"],
          responseBodyContains: ["Portfolio launch", "Newsletter refresh"],
        },
        successMessage:
          "The API received both query parameters and returned the filtered JSON collection.",
        hint: "Quote the full URL so the ampersand stays inside one argument.",
        failureFeedback:
          "Use /projects with status=active and limit=3 in the query string.",
      }),
      whyCodex(
        "6.3-codex",
        "When results look wrong, ask Codex to inspect the exact query parameters and compare them with the API documentation. Small spelling or value mistakes matter.",
      ),
      quiz(
        "6.3-check",
        "What separates two query parameters?",
        ["&", "#", "/"],
        0,
        "An ampersand joins query parameters after the question mark.",
      ),
    ],
  },
  {
    id: "6.4",
    levelId: 6,
    title: "Status Codes Are a Language",
    subtitle: "Use response categories as evidence about what happened.",
    estimatedMinutes: 9,
    nextLessonId: "6.5",
    completionMessage: "You can interpret common 2xx, 4xx, and 5xx responses.",
    sections: [
      narrative(
        "6.4-intro",
        "The first digit gives you a category",
        "HTTP status codes summarize the result. 2xx means the request succeeded. 4xx means the request could not be fulfilled because of the request, credentials, or resource. 5xx means the server failed while handling a request. The response body often gives the next clue.",
      ),
      concept("6.4-status", "Diagnose common status codes", {
        instructions: "Match each status to the most useful beginner interpretation.",
        simulationLabel: "Simulation: status diagnosis",
        hint: "200 and 201 are success; 400–499 are request-side problems; 500 is server-side.",
        successMessage: "Correct. You used each code as evidence instead of treating every failure as the same problem.",
        failureFeedback: "Start with the first digit, then read the specific code.",
        interaction: {
          kind: "assignment",
          prompt: "Classify each response.",
          categories: [
            { id: "success", label: "Success" },
            { id: "request", label: "Request, credentials, or resource problem" },
            { id: "server", label: "Server problem" },
          ],
          items: [
            { id: "200", label: "200 OK", description: "The request succeeded.", correctCategoryId: "success" },
            { id: "201", label: "201 Created", description: "A resource was created.", correctCategoryId: "success" },
            { id: "400", label: "400 Bad Request", description: "The request data is invalid or incomplete.", correctCategoryId: "request" },
            { id: "401", label: "401 Unauthorized", description: "Required credentials are missing or invalid.", correctCategoryId: "request" },
            { id: "403", label: "403 Forbidden", description: "The identity is known but not allowed.", correctCategoryId: "request" },
            { id: "404", label: "404 Not Found", description: "The requested endpoint or resource was not found.", correctCategoryId: "request" },
            { id: "429", label: "429 Too Many Requests", description: "The client has reached a rate limit.", correctCategoryId: "request" },
            { id: "500", label: "500 Internal Server Error", description: "The server failed while handling the request.", correctCategoryId: "server" },
          ],
        },
      }),
      whyCodex(
        "6.4-codex",
        "Include the status code and response body when asking Codex for help. A 401 needs a different investigation from a 404 or 500.",
      ),
      quiz(
        "6.4-check",
        "Which category is 500?",
        ["A server-side failure", "A successful creation", "A query parameter"],
        0,
        "5xx responses describe server-side failures.",
      ),
    ],
  },
  {
    id: "6.5",
    levelId: 6,
    title: "Request Headers",
    subtitle: "Send metadata and inspect response headers.",
    estimatedMinutes: 9,
    nextLessonId: "6.6",
    completionMessage: "You sent an Accept header and inspected response metadata.",
    sections: [
      narrative(
        "6.5-intro",
        "Headers carry metadata",
        "Request headers describe the request. Accept says which response format the client understands. Content-Type describes the request body format. Authorization carries credentials. Response headers describe the returned content. curl -i includes response headers before the body.",
      ),
      terminalStep("6.5-terminal", "Ask for JSON and inspect headers", {
        instructions:
          'Run curl -i -H "Accept: application/json" "https://api.creator-dashboard.test/projects?limit=1". Expect HTTP/1.1 200 OK, a Content-Type header, and a JSON body.',
        mockHttpEndpointIds: ["creator.projects.list"],
        expectedCommands: [
          'curl -i -H "Accept: application/json" "https://api.creator-dashboard.test/projects?limit=1"',
        ],
        expectedOutput: {
          contains: [
            "HTTP/1.1 200 OK",
            "Content-Type: application/json",
            "\"projects\"",
          ],
        },
        expectedHttp: {
          method: "GET",
          path: "/projects",
          query: { limit: "1" },
          headers: { Accept: "application/json" },
          status: 200,
        },
        successMessage:
          "You sent request metadata and used -i to inspect response metadata plus the JSON body.",
        hint: "Place -i and -H before the quoted URL.",
        failureFeedback:
          "Send Accept: application/json and include response headers with -i.",
      }),
      whyCodex(
        "6.5-codex",
        "Ask Codex to compare headers with the API contract, but remove real Authorization values first. Header names and safe example values are usually enough.",
      ),
      quiz(
        "6.5-check",
        "Which header describes a JSON request body?",
        ["Content-Type: application/json", "Accept: text/html", "Status: 200"],
        0,
        "Content-Type tells the server how to interpret the body being sent.",
      ),
    ],
  },
  {
    id: "6.6",
    levelId: 6,
    title: "Sending Data with POST",
    subtitle: "Create a mock project with a JSON request body.",
    estimatedMinutes: 11,
    nextLessonId: "6.7",
    completionMessage: "You sent a validated POST request and received 201 Created.",
    sections: [
      narrative(
        "6.6-intro",
        "POST sends data for processing",
        "GET reads. POST commonly sends a request body to create something. The method says POST, Content-Type says the body is JSON, and -d supplies the JSON text. The mock API validates all three before returning 201 Created.",
      ),
      terminalStep("6.6-terminal", "Create First project", {
        instructions:
          'Run curl -i -X POST -H "Content-Type: application/json" -d \'{"title":"First project"}\' "https://api.creator-dashboard.test/projects". Expect 201 Created and a JSON project object.',
        mockHttpEndpointIds: ["creator.projects.create"],
        expectedCommands: [
          'curl -i -X POST -H "Content-Type: application/json" -d \'{"title":"First project"}\' "https://api.creator-dashboard.test/projects"',
        ],
        expectedOutput: {
          contains: ["HTTP/1.1 201 Created", "\"First project\""],
        },
        expectedHttp: {
          method: "POST",
          path: "/projects",
          headers: { "Content-Type": "application/json" },
          jsonBody: { title: "First project" },
          status: 201,
          responseJsonPaths: ["project"],
        },
        successMessage:
          "The method, content type, and JSON body were valid, so the mock API returned 201 Created.",
        hint: "Keep the JSON inside single quotes and use the exact Content-Type header.",
        failureFeedback:
          "Check the POST method, Content-Type header, JSON quotes, and /projects URL.",
      }),
      whyCodex(
        "6.6-codex",
        "Codex can draft a POST request, but verify the method, content type, JSON fields, and response handling yourself. Never paste a real secret into the prompt.",
      ),
      quiz(
        "6.6-check",
        "What does -d provide?",
        ["The request body", "The response status", "The domain"],
        0,
        "-d supplies data for the request body.",
      ),
    ],
  },
  {
    id: "6.7",
    levelId: 6,
    title: "Your First Real Public API",
    subtitle: "Practice a realistic public endpoint without making a live request.",
    estimatedMinutes: 9,
    nextLessonId: "6.8",
    completionMessage: "You inspected a realistic public-API response safely.",
    sections: [
      narrative(
        "6.7-intro",
        "Public means no credential is required",
        "A public API endpoint can be called without an account credential, although it may still have limits and rules. This course uses a realistic fictional endpoint. It is called public for the lesson concept, but every response is generated in memory and no external request occurs.",
      ),
      terminalStep("6.7-terminal", "Read three public projects", {
        instructions:
          'Run curl "https://api.creator-dashboard.test/projects?limit=3". Expect a JSON object with a projects array.',
        mockHttpEndpointIds: ["creator.projects.list"],
        expectedCommands: [
          'curl "https://api.creator-dashboard.test/projects?limit=3"',
        ],
        expectedHttp: {
          method: "GET",
          path: "/projects",
          query: { limit: "3" },
          status: 200,
          responseJsonPaths: ["projects"],
        },
        successMessage:
          "The mock public endpoint returned structured JSON without an Authorization header.",
        hint: "Use the /projects endpoint with limit=3.",
        failureFeedback:
          "Use the complete fictional .test URL. The simulator stays offline.",
      }),
      whyCodex(
        "6.7-codex",
        "Codex can explain an unfamiliar response shape or help draft parsing code. Confirm the documentation and avoid assuming a public API has no limits.",
      ),
      quiz(
        "6.7-check",
        "Did this lesson call a live public API?",
        ["No. The response came from the browser-safe simulator.", "Yes. It contacted a real service."],
        0,
        "The endpoint is realistic but fictional and entirely offline.",
      ),
    ],
  },
  {
    id: "6.8",
    levelId: 6,
    title: "OpenAI API Keys and Secret Safety",
    subtitle: "Treat credentials as secrets and respond correctly to exposure.",
    estimatedMinutes: 11,
    nextLessonId: "6.9",
    completionMessage: "You can recognize unsafe secret handling and the correct recovery steps.",
    sections: [
      narrative(
        "6.8-intro",
        "API keys are credentials",
        "An API key can authorize usage and spending. It is not decoration. Do not paste real keys into public code, screenshots, Git commits, chat messages, or frontend client code when server-side secrecy is required. Environment variables and .env files commonly keep secrets out of source. .gitignore can prevent a new .env file from being committed, but it cannot erase a key that was already committed. A leaked key should be revoked or rotated immediately.",
        [
          "Course examples such as DEMO_TOKEN, sk-demo-not-real, and ghp_demo_not_real are intentionally fake.",
          "Fake course tokens cannot access OpenAI, GitHub, or any real service.",
          "Never give Codex a real secret unless a narrowly authorized workflow truly requires it.",
        ],
      ),
      concept("6.8-safety", "Spot unsafe secret practices", {
        instructions: "Classify each practice as safer or unsafe.",
        simulationLabel: "Simulation: fake credentials only",
        hint: "Anything public, committed, screenshotted, or shipped to frontend code is unsafe for a server-side secret.",
        successMessage: "Correct. You protected secrets before sharing code or asking for help.",
        failureFeedback: "Treat API keys like passwords with possible billing access.",
        interaction: {
          kind: "assignment",
          prompt: "How should each practice be classified?",
          categories: [
            { id: "safer", label: "Safer practice" },
            { id: "unsafe", label: "Unsafe practice" },
          ],
          items: [
            { id: "env", label: "Read a server-side key from an environment variable", description: "The value stays outside committed source code.", correctCategoryId: "safer" },
            { id: "gitignore", label: "Add .env to .gitignore before committing it", description: "Helps prevent a new local secret file from entering Git.", correctCategoryId: "safer" },
            { id: "rotate", label: "Revoke and rotate a leaked key", description: "Stops relying on a credential that may be copied.", correctCategoryId: "safer" },
            { id: "commit", label: "Commit sk-demo-not-real as if it were a real key", description: "Real credentials do not belong in Git history.", correctCategoryId: "unsafe" },
            { id: "screenshot", label: "Post a screenshot containing a real key", description: "Images can expose credentials too.", correctCategoryId: "unsafe" },
            { id: "frontend", label: "Embed a server-secret key in browser JavaScript", description: "Visitors can inspect frontend code.", correctCategoryId: "unsafe" },
            { id: "chat", label: "Paste a real key into a general chat message", description: "The secret is shared unnecessarily.", correctCategoryId: "unsafe" },
          ],
        },
      }),
      whyCodex(
        "6.8-codex",
        "Give Codex placeholder names such as OPENAI_API_KEY or sk-demo-not-real, not the real value. If a secret appears in a diff or chat, stop, revoke it, and rotate it.",
      ),
      quiz(
        "6.8-check",
        "What should happen first after a real API key leaks?",
        ["Revoke or rotate it", "Only add the file to .gitignore", "Rename the variable"],
        0,
        "A leaked credential must be invalidated. .gitignore cannot undo exposure.",
      ),
    ],
  },
  {
    id: "6.9",
    levelId: 6,
    title: "Calling the GitHub API",
    subtitle: "Use a fake Authorization header with a GitHub-style endpoint.",
    estimatedMinutes: 10,
    nextLessonId: "6.10",
    completionMessage: "You called a mock authenticated API with an intentionally fake token.",
    sections: [
      narrative(
        "6.9-intro",
        "Authenticated endpoints require credentials",
        "A GitHub-style API often uses an Authorization header. This lesson accepts only ghp_demo_not_real, an intentionally fake public token. The response includes repository JSON and simulated rate-limit information. No GitHub account or network request is involved.",
      ),
      terminalStep("6.9-terminal", "List mock repositories", {
        instructions:
          'Run curl -i -H "Authorization: Bearer ghp_demo_not_real" "https://api.github.test/user/repos". Expect 200 OK and a repositories array.',
        mockHttpEndpointIds: ["github.user.repos"],
        expectedCommands: [
          'curl -i -H "Authorization: Bearer ghp_demo_not_real" "https://api.github.test/user/repos"',
        ],
        expectedHttp: {
          method: "GET",
          host: "api.github.test",
          path: "/user/repos",
          headers: { Authorization: "Bearer ghp_demo_not_real" },
          status: 200,
          responseJsonPaths: ["repositories", "rateLimit"],
        },
        successMessage:
          "The fake Authorization header unlocked the mock repository response. Nothing reached GitHub.",
        hint: "Use the exact fake token ghp_demo_not_real after Bearer.",
        failureFeedback:
          "Check the Authorization header, fake token, and /user/repos path.",
      }),
      whyCodex(
        "6.9-codex",
        "Codex can explain a GitHub-style response or draft a request using a placeholder. Remove real tokens from commands, logs, screenshots, and prompts.",
      ),
      quiz(
        "6.9-check",
        "What does 429 usually mean?",
        ["The client reached a rate limit", "Authentication succeeded", "A resource was created"],
        0,
        "429 Too Many Requests tells the client to slow down or wait.",
      ),
    ],
  },
  {
    id: "6.10",
    levelId: 6,
    title: "Reading API Documentation",
    subtitle: "Find the contract before building the request.",
    estimatedMinutes: 10,
    nextLessonId: "6.11",
    completionMessage: "You can extract the important parts of an API documentation entry.",
    sections: [
      narrative(
        "6.10-intro",
        "Documentation is the request contract",
        "Before calling an endpoint, find its method, path, parameters, request body, authentication requirements, response example, and possible errors. Do not guess from the endpoint name alone.",
      ),
      concept("6.10-docs", "Read a mock documentation entry", {
        instructions:
          "Build the documentation map for: POST /projects; requires Content-Type: application/json; body {\"title\":\"string\"}; returns 201 with project; errors 400.",
        simulationLabel: "Simulation: API documentation",
        hint: "Match the action, address, metadata, input, success, and failure separately.",
        successMessage: "Correct. You extracted the complete request-and-response contract.",
        failureFeedback: "Read each documented field instead of inferring it.",
        interaction: {
          kind: "systemBuilder",
          prompt: "Place each documented detail in its role.",
          slots: [
            { id: "method", label: "Method", description: "The action to send.", correctComponentId: "post" },
            { id: "path", label: "Endpoint path", description: "The resource address.", correctComponentId: "projects" },
            { id: "auth", label: "Authentication", description: "Whether a credential is required.", correctComponentId: "public" },
            { id: "header", label: "Required header", description: "How the body is formatted.", correctComponentId: "content-type" },
            { id: "body", label: "Request body", description: "The JSON fields to send.", correctComponentId: "title" },
            { id: "success", label: "Success response", description: "The expected good result.", correctComponentId: "created" },
            { id: "error", label: "Documented error", description: "A likely failure to handle.", correctComponentId: "bad-request" },
          ],
          components: [
            { id: "created", label: "201 with project JSON", description: "Successful creation." },
            { id: "title", label: '{"title":"string"}', description: "Required JSON shape." },
            { id: "projects", label: "/projects", description: "Collection path." },
            { id: "post", label: "POST", description: "Creation method." },
            { id: "public", label: "No credential required", description: "Public mock endpoint." },
            { id: "content-type", label: "Content-Type: application/json", description: "Body metadata." },
            { id: "bad-request", label: "400 for invalid input", description: "Request validation failure." },
          ],
          summary: "POST /projects accepts JSON with a title, needs the JSON content type, requires no credential, returns 201 on success, and can return 400 for invalid input.",
        },
      }),
      whyCodex(
        "6.10-codex",
        "Give Codex the relevant documentation excerpt and ask it to cite which method, parameters, headers, and response shape it used. You still verify the result against the source.",
      ),
      quiz(
        "6.10-check",
        "What should you find before writing a request?",
        ["Method, path, inputs, auth, responses, and errors", "Only the endpoint name", "A real API key"],
        0,
        "The full contract prevents avoidable guessing.",
      ),
    ],
  },
  {
    id: "6.11",
    levelId: 6,
    title: "When API Requests Go Wrong",
    subtitle: "Treat error responses as evidence and recover one clue at a time.",
    estimatedMinutes: 16,
    nextLessonId: "6.12",
    completionMessage: "You reproduced and identified the major beginner API failure modes.",
    sections: [
      narrative(
        "6.11-intro",
        "An error message is evidence, not a personal insult",
        "A failed request tells you where to look next. Compare the URL and documentation, inspect required query parameters and headers, validate JSON, check authorization safely, notice rate limits, and separate request problems from server failures.",
      ),
      terminalStep("6.11-terminal", "Build an API error evidence set", {
        instructions:
          "Run these eight simulated requests in order: the host root for a wrong URL; /tasks without projectId; POST /projects with invalid JSON and JSON content type; /users/me without authorization; POST /projects with JSON but no Content-Type; /missing; the GitHub repos endpoint with ?simulate=rate-limit; and /projects?simulate=server-error.",
        mockHttpEndpointIds: [
          ...creatorEndpoints,
          "github.user.repos",
        ],
        expectedCommands: [
          "curl -i https://api.creator-dashboard.test/",
          "curl -i https://api.creator-dashboard.test/tasks",
          'curl -i -X POST -H "Content-Type: application/json" -d \'{bad json}\' https://api.creator-dashboard.test/projects',
          "curl -i https://api.creator-dashboard.test/users/me",
          'curl -i -X POST -d \'{"title":"No header"}\' https://api.creator-dashboard.test/projects',
          "curl -i https://api.creator-dashboard.test/missing",
          'curl -i "https://api.github.test/user/repos?simulate=rate-limit"',
          'curl -i "https://api.creator-dashboard.test/projects?simulate=server-error"',
        ],
        expectedHttp: {
          requestCount: 8,
          status: 500,
          diagnosis: "server-error",
          historyStatuses: [400, 401, 404, 429, 500],
          historyDiagnoses: [
            "wrong-url",
            "missing-query",
            "invalid-json",
            "missing-authorization",
            "wrong-content-type",
            "not-found",
            "rate-limit",
            "server-error",
          ],
        },
        successMessage:
          "You built a complete evidence set: wrong URL, missing query, invalid JSON, missing authorization, wrong content type, missing endpoint, rate limit, and server failure.",
        hint:
          "Use -i so each response shows its status. Run the scenarios exactly in the listed order.",
        failureFeedback:
          "Keep collecting the eight distinct failure clues. Reset if the request history becomes confusing.",
      }),
      whyCodex(
        "6.11-codex",
        "Give Codex the safe request shape, status, and response body—not a real secret. Ask it to explain the evidence and propose the smallest next check instead of guessing broadly.",
      ),
      quiz(
        "6.11-check",
        "What is the best first response to a 400 error?",
        ["Compare the request with the documented inputs", "Rotate every credential", "Assume the server is permanently broken"],
        0,
        "400 points to the request shape, values, headers, or required parameters.",
      ),
    ],
  },
  {
    id: "6.12",
    levelId: 6,
    title: "From curl to Code",
    subtitle: "Translate a tested request into JavaScript fetch concepts.",
    estimatedMinutes: 13,
    nextLessonId: "7.1",
    completionMessage: "Level 6 complete. You can test, explain, debug, and translate safe API requests.",
    sections: [
      narrative(
        "6.12-intro",
        "A tested request becomes a code plan",
        "A curl command and a fetch call describe the same essential request pieces: URL, method, headers, body, and response handling. This lesson does not execute JavaScript. It uses the offline terminal request as evidence, then maps each part into a conceptual fetch call.",
      ),
      terminalStep("6.12-terminal", "Test the source request", {
        instructions:
          'Run curl -H "Accept: application/json" "https://api.creator-dashboard.test/projects?status=active". Verify the JSON response before translating it.',
        mockHttpEndpointIds: ["creator.projects.list"],
        expectedCommands: [
          'curl -H "Accept: application/json" "https://api.creator-dashboard.test/projects?status=active"',
        ],
        expectedHttp: {
          method: "GET",
          path: "/projects",
          query: { status: "active" },
          headers: { Accept: "application/json" },
          status: 200,
          responseJsonPaths: ["projects"],
        },
        successMessage:
          "The source request works in the simulator. You now have evidence to translate.",
        hint: "Use GET implicitly, include the Accept header, and keep status=active in the URL.",
        failureFeedback:
          "Test the exact curl request before mapping it to code.",
      }),
      concept("6.12-translate", "Map curl pieces to fetch", {
        instructions:
          "Match each tested curl detail to the corresponding JavaScript fetch concept. No code will execute.",
        simulationLabel: "Simulation: curl-to-code translation",
        hint: "The URL remains the URL; headers become the headers option; GET can be explicit or default; response.json() parses JSON.",
        successMessage: "Correct. You preserved the URL, method, headers, and response handling across tools.",
        failureFeedback: "Translate each request part directly instead of changing the contract.",
        interaction: {
          kind: "assignment",
          prompt: "Connect the tested curl request to this conceptual fetch call.",
          categories: [
            { id: "url", label: "fetch URL" },
            { id: "method", label: "method option" },
            { id: "headers", label: "headers option" },
            { id: "response", label: "response handling" },
          ],
          items: [
            { id: "curl-url", label: "https://api.creator-dashboard.test/projects?status=active", description: "The complete requested resource.", correctCategoryId: "url" },
            { id: "curl-method", label: "GET", description: "The read operation used by curl.", correctCategoryId: "method" },
            { id: "curl-accept", label: "Accept: application/json", description: "Request metadata describing the preferred response.", correctCategoryId: "headers" },
            { id: "json", label: "response.json()", description: "Conceptual parsing of the returned JSON body.", correctCategoryId: "response" },
          ],
        },
      }),
      whyCodex(
        "6.12-codex",
        "Codex can translate a tested curl command into fetch code and explain each line. Verify that the URL, method, headers, body, status handling, and JSON parsing still match—and replace any real secret with a placeholder before sharing.",
      ),
      quiz(
        "6.12-check",
        "What should stay consistent when curl becomes code?",
        ["URL, method, headers, body, and response handling", "Only the variable names", "A pasted real API key"],
        0,
        "Translation changes syntax, not the request contract.",
      ),
    ],
  },
];

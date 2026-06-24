# Level 6 HTTP and API Handoff

Last updated: 2026-06-24

## Delivered

Level 6, "Talk to the Internet," contains 12 complete playable lessons covering
URL anatomy, curl, query parameters, status codes, headers, POST and JSON,
public APIs, secret safety, GitHub-style APIs, documentation reading, error
diagnosis, and curl-to-fetch translation.

All HTTP behavior is simulated in memory. The app makes no real HTTP request,
accepts no real credential, and connects to no external service.

## Mock HTTP Architecture

- `src/http/types.ts`: request, response, exchange, endpoint, curl, and state types.
- `src/http/url.ts`: parses URLs and rejects every host outside the fictional
  allowlist.
- `src/http/curl.ts`: parses the supported curl subset and formats terminal output.
- `src/http/endpoints.ts`: owns endpoint definitions and deterministic responses.
- `src/http/router.ts`: matches enabled endpoints by host, method, and path.
- `src/http/state.ts`: executes requests and stores resettable lesson history.
- `src/http/validation.ts`: validates request and response details for lessons.

The terminal delegates `curl` to this layer. React only renders terminal output
and the accessible HTTP state strip.

## Supported curl Syntax

```text
curl <url>
curl -i <url>
curl -X GET <url>
curl -X POST <url>
curl -H "Header-Name: value" <url>
curl -d '{"key":"value"}' <url>
```

The flags above can be combined. `-d` defaults to POST. One URL is accepted.
URLs containing `&` should be quoted.

Unsupported by design: arbitrary flags, multiple URLs, curl pipes/redirects,
cookies, file uploads, multipart bodies, certificates, live redirects,
streaming, WebSockets, and full shell/curl compatibility.

## Mock API Universe

Creator Dashboard:

- `GET /health`
- `GET /projects`
- `POST /projects`
- `GET /projects/:id`
- `GET /tasks`
- `GET /users/me`

GitHub-style:

- `GET /user/repos`
- `GET /repos/demo-user/demo-project/issues`
- `GET /repos/demo-user/demo-project/pulls`

OpenAI-style secret demonstration:

- `GET /v1/models`

The allowed hosts are `api.creator-dashboard.test`, `api.github.test`, and
`api.openai.test`. Each lesson enables only the endpoints it needs.

## Lesson Schema Additions

`terminalStep` now accepts:

- `mockHttpEndpointIds`
- `expectedHttp.requestCount`
- expected method, host, path, query parameters, and request headers
- expected JSON body
- expected status and response-body snippets
- expected response JSON paths
- expected diagnosis
- expected status and diagnosis history

These checks validate structured state rather than relying only on terminal
text or command history.

## Safety Boundaries

- No `fetch`, XMLHttpRequest, service worker, backend, proxy, or live DNS.
- Unknown and real hosts are rejected before routing.
- No credential storage or transmission.
- Only visibly fake credentials are used: `DEMO_TOKEN`, `sk-demo-not-real`,
  and `ghp_demo_not_real`.
- Reset recreates HTTP state and clears request history.
- Level 6 explicitly teaches revocation/rotation after exposure and explains
  that `.gitignore` cannot undo a committed secret.

## Test Coverage

- URL anatomy and query parsing.
- Curl flags, headers, JSON bodies, and unsupported syntax.
- Endpoint routing and lesson endpoint enablement.
- 200, 201, 400, 401, 403, 404, 429, and 500 paths.
- Invalid JSON, wrong content type, authorization, and rate-limit diagnoses.
- A monkeypatched `fetch` assertion proving request execution does not call it.
- Structured terminal-step validation and HTTP reset.
- All 12 lessons, required terminal solutions, progress persistence, and
  content validation.
- Playwright flows for GET, query, POST, authorization, debugging,
  curl-to-code translation, and mobile layout.

## Known Limitations

- The parser is a teaching subset, not real curl.
- Query parameters are represented as one value per key.
- There is no simulated latency, retry policy, cache, cookies, pagination
  protocol, file transfer, or streaming.
- JavaScript fetch is explained conceptually and is not executed.

## Final Verification

- 101 unit and lesson-flow tests passed.
- 27 Playwright integration tests passed.
- Content validation found all 12 Level 6 lessons.
- TypeScript, ESLint, and the production build passed.
- Visible browser checks passed for POST/201 output, all eight error diagnoses,
  mobile overflow, accessible HTTP state, and console health.
- The production build retains the existing non-blocking chunk-size warning.

## Recommended Next Goal Mode Task

Implement Supabase email/password authentication and authenticated progress
sync while preserving anonymous localStorage progress for migration. Keep
Google OAuth postponed and keep all terminal/Git/HTTP simulations browser-safe.

# zero2codex

zero2codex is a free, gamified beginner course for learning terminal basics,
coding fundamentals, and OpenAI Codex workflows through an interactive course
map, safe browser-based terminal lessons, local progress, and original
beginner-friendly content.

The project is inspired by the product mechanics of `zero2claude.dev`, but the
branding, content, visuals, and implementation must stay original.

## Current Status

This repo is in active MVP curriculum implementation.

Implemented now:

- Vite + React + TypeScript app scaffold.
- React Router route shell.
- Tailwind CSS Vite integration plus custom CSS design tokens.
- Public course map driven by `src/content/course.ts`.
- Full 17-level, 151-lesson outline from the build guide.
- Playable Level 1 foundational-learning path with 6 lessons.
- Playable Level 2 terminal-learning path with 13 lessons.
- Playable Level 3 reading-and-writing-files path with 13 lessons.
- Playable Level 4 Git-learning path with 17 lessons.
- Playable Level 5 software-systems path with 14 lessons.
- Playable Level 6 HTTP/API path with 12 lessons.
- Reusable file, folder, path, file-type, program, and terminal concept interactions.
- Browser-safe virtual terminal with an in-memory file system.
- Safe simulated support for file inspection, writing, appending, search, pipes,
  and counts.
- Browser-safe Git repositories, staging, commits, diffs, branches, merges,
  restore, mocked remotes, push, pull, and clone.
- Browser-safe mock HTTP routing and a deliberately limited simulated `curl`.
- Local progress storage for lesson completion and resume state.
- Placeholder routes for `/login` and `/register`.

Not implemented yet:

- Supabase.
- Email/password account creation.
- Google OAuth.
- Protected routes.
- Progress sync.
- Achievements.

## Product Blueprint

Read the full build guide before changing the product direction:

```text
docs/ZERO2CODEX_BUILD_GUIDE.html
```

Also read the project memory files in `docs/` before starting a new coding
session.

## Setup

Install dependencies:

```sh
npm install
```

Start the local dev server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Run static checks:

```sh
npm run typecheck
npm run lint
npm run test
npm run test:integration
npm run validate:content
```

## Safe Terminal

The lesson terminal is a browser-only simulation. It never runs commands on the
learner's computer and never connects to a backend shell.

Supported terminal commands:

```text
pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, head, tail, echo, grep, rg, wc, git, curl, clear, help
```

Supported Git commands:

```text
git init
git status
git add <path>
git add .
git commit -m "message"
git log
git log --oneline
git diff
git diff --staged
git branch
git branch <name>
git switch <name>
git switch -c <name>
git checkout <name>
git checkout -b <name>
git merge <branch>
git restore <path>
git remote add origin <url>
git remote -v
git push
git pull
git clone <mocked-url>
```

Supported syntax:

```text
cat notes.txt | grep "Codex"
grep "ERROR" app.log | wc -l
echo "hello" > notes.txt
echo "another line" >> notes.txt
```

Supported simulated curl syntax:

```text
curl <mock-url>
curl -i <mock-url>
curl -X GET <mock-url>
curl -X POST <mock-url>
curl -H "Header-Name: value" <mock-url>
curl -d '{"key":"value"}' <mock-url>
```

Flags may be combined for Level 6 exercises. `-d` defaults to `POST` unless
`-X` is supplied. Quote URLs containing `&`.

The mock API universe includes:

```text
https://api.creator-dashboard.test/health
https://api.creator-dashboard.test/projects
https://api.creator-dashboard.test/projects/:id
https://api.creator-dashboard.test/tasks
https://api.creator-dashboard.test/users/me
https://api.github.test/user/repos
https://api.github.test/repos/demo-user/demo-project/issues
https://api.github.test/repos/demo-user/demo-project/pulls
https://api.openai.test/v1/models
```

Endpoints are enabled per lesson. Requests are parsed and routed entirely
in memory; the simulator never uses `fetch`, XMLHttpRequest, a service worker,
or a backend. Only the fictional `.test` hosts above are accepted.

Known limitations:

- The parser intentionally supports only one pipe at a time.
- Redirects support overwrite with `>` and append with `>>`.
- `grep` is simple text matching with optional `-r`; advanced regular
  expressions are not implemented.
- `rg` is a beginner-friendly recursive search simulation, not real ripgrep.
- Git is a teaching simulation, not production Git. It does not model ignored
  files, rebasing, stashing, tags, hooks, LFS, or a full conflict editor.
- `git pull` supports clean fast-forward learning scenarios and stops on
  divergent history.
- `git clone` accepts only built-in lesson repository URLs.
- `curl` supports only `GET`, `POST`, `-i`, `-X`, `-H`, and `-d`.
- It accepts one URL per command and intentionally omits cookies, uploads,
  redirects, compression, certificates, streaming, WebSockets, and the full
  HTTP/curl specifications.
- Pipes and file redirects are not available for simulated `curl`.
- Only lesson-enabled fictional endpoints can return a response.
- No command reaches GitHub, a backend, a real shell, or the learner's files.
- Codex CLI, live HTTP, backend APIs, and Supabase are not implemented yet.

## Level 1 Architecture

Level 1, "Computers Are Not Magic," is a six-lesson confidence layer that
prepares a total beginner for terminal navigation without touching the
learner's device.

Key files:

- `src/content/level1Lessons.ts`: all Level 1 lesson copy and interaction data.
- `src/content/lessonSchema.ts`: the Zod-backed `foundationInteraction`
  section and its typed variants.
- `src/components/LessonRunner.tsx`: accessible sorting, matching, folder,
  path, sequence, and review renderers.
- `src/foundations/levelOneValidation.ts`: framework-free validation helpers.
- `tests/level-one-validation.test.mjs`: focused unit coverage.
- `tests/e2e/level-one.spec.mjs`: rendered lesson, progress, recovery,
  keyboard, mobile, and Level 2 transition coverage.

The simulations are browser-only. They do not inspect local files, execute
commands, connect to an operating system, or require an account.

### Authoring Foundational Lessons

1. Add lesson content to a level-specific content file.
2. Use short `narrative` sections for definitions and "Why this matters later."
3. Use `foundationInteraction` for active practice and keep answer rules in
   the validation module.
4. Include a `quiz` quick check and beginner-safe recovery copy.
5. Label fictional trees, paths, desktops, and terminal previews as
   simulations.
6. Register the lesson in `src/content/lessons.ts`.
7. Add unit coverage for validation and Playwright coverage for the rendered
   flow.

## Level 4 Git Architecture

Level 4, "Your Code Has a History," adds a browser-only Git model on top of the
existing virtual filesystem. The virtual filesystem remains the working
directory source of truth; Git stores immutable commit snapshots, a staging
snapshot, branch pointers, and mocked remotes.

Key files:

- `src/git/types.ts`: serializable Git repository, commit, branch, remote, and
  conflict types.
- `src/git/simulator.ts`: Git commands, status, diffs, snapshots, branches,
  merges, restore, mocked remotes, push, pull, and clone.
- `src/git/validation.ts`: lesson assertions for repository state, status,
  history, snapshots, diffs, branches, remotes, and pushed branches.
- `src/content/level4Lessons.ts`: all 17 Level 4 lessons and the Full Git
  Workflow Challenge.
- `tests/git-simulator.test.mjs`: focused Git command and reset coverage.
- `tests/e2e/level-four.spec.mjs`: rendered add/commit, branch/merge, final
  challenge, recovery, keyboard, progress, and mobile coverage.

### Authoring Git Lessons

1. Give each `terminalStep` a browser-safe `initialFileSystem`.
2. Use `setupCommands` for deterministic hidden setup such as an initial commit.
3. Put learner commands in `expectedCommands`.
4. Validate the outcome with `expectedGit`, not command history alone.
5. Keep remote URLs mocked and state clearly that no network request occurs.
6. Include a recovery hint and beginner-safe failure feedback.
7. Add the intended solution to lesson-flow tests and a rendered test for major
   workflows.

## Level 5 Concept Architecture

Level 5, "How Software Actually Works," uses one Zod-backed
`conceptInteraction` section with six focused interaction kinds:

- `assignment`: sort responsibilities or concepts into categories.
- `sequence`: order a safe process such as deployment.
- `requestResponse`: step through a simulated HTTP/API round trip.
- `jsonInspector`: inspect valid JSON and identify nested value types.
- `dataTable`: reason about records and SQL-style actions without execution.
- `systemBuilder`: connect browser, server, API, database, hosting, and DNS.

Key files:

- `src/content/level5Lessons.ts`: all 14 Level 5 lessons.
- `src/concepts/levelFiveValidation.ts`: framework-free interaction logic.
- `src/components/ConceptInteraction.tsx`: accessible interaction rendering.
- `tests/level-five-validation.test.mjs`: state and validation unit coverage.
- `tests/e2e/level-five.spec.mjs`: rendered core flows and mobile coverage.

### Authoring Level 5 Lessons

1. Keep conceptual content in `src/content/level5Lessons.ts`.
2. Use `conceptInteraction` for meaningful practice, not decoration.
3. Label every model as a browser-only simulation.
4. Include one narrative section titled exactly `Why this matters with Codex`.
5. Keep diagrams readable as text and operable with buttons and selects.
6. Register new lesson files in `src/content/lessons.ts`.
7. Add pure validation tests and rendered tests for important workflows.

## Level 6 Mock HTTP Architecture

Level 6, "Talk to the Internet," adds an offline HTTP model to the existing
terminal without adding browser networking.

Key files:

- `src/http/types.ts`: serializable request, response, exchange, and endpoint types.
- `src/http/url.ts`: strict fictional-host URL parsing.
- `src/http/curl.ts`: intentionally limited curl argument parsing and output.
- `src/http/endpoints.ts`: lesson-safe mock endpoint definitions.
- `src/http/router.ts`: method, host, and path routing.
- `src/http/state.ts`: resettable per-lesson request history.
- `src/http/validation.ts`: structured request/response lesson assertions.
- `src/content/level6Lessons.ts`: all 12 Level 6 lessons.
- `tests/http-simulator.test.mjs`: HTTP/parser/routing/safety unit coverage.
- `tests/e2e/level-six.spec.mjs`: rendered HTTP learning workflows.

All credentials shown in Level 6 are visibly fake: `DEMO_TOKEN`,
`sk-demo-not-real`, and `ghp_demo_not_real`. They cannot access any real
service.

## MVP Direction

The first playable MVP should include:

- The public course map.
- Email/password account creation and login through Supabase Auth.
- Authenticated progress sync on top of the current local progress fallback.
- Level 1 complete and three Level 8 Codex teaser lessons.
- Starter achievements.

Google OAuth is intentionally postponed until production OAuth branding and
redirect setup are ready.

## Originality Rules

- Do not copy zero2claude lesson text, source code, assets, or visual details.
- Do match the quality bar: clear progression, account-backed progress,
  gamified learning, terminal-native design, and beginner-friendly lessons.
- Use official OpenAI docs as the source for Codex-specific behavior.

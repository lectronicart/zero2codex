# Project Memory

> Legacy snapshot. Use `docs/STATE.md` for current operational context. This
> file is retained for history and is not required startup reading.

Last updated: 2026-06-24

## Project Snapshot

Repository name/path:

```text
zero2codex (LectronicArt Skool 1st Asset)
```

Current repo shape:

- Git repository on branch `main`.
- Local `main` has been merged and pushed to GitHub.
- `docs/` contains project memory files.
- `docs/ZERO2CODEX_BUILD_GUIDE.html` contains the full course/product blueprint.
- Vite + React + TypeScript application scaffold exists.
- React Router is configured.
- Tailwind CSS is integrated through the Vite plugin.
- `README.md` and `AGENTS.md` exist.
- `package.json` and `package-lock.json` exist.
- `src/content/course.ts` contains the 17-level, 151-lesson outline.
- `src/content/level1Lessons.ts` contains the complete playable Level 1 lesson set.
- `src/content/level2Lessons.ts` contains the complete playable Level 2 lesson set.
- `src/content/level3Lessons.ts` contains the complete playable Level 3 lesson set.
- `src/content/level4Lessons.ts` contains the complete playable Level 4 lesson set.
- `src/content/level5Lessons.ts` contains the complete playable Level 5 lesson set.
- `src/content/level6Lessons.ts` contains the complete playable Level 6 lesson set.
- `src/concepts/` contains framework-free Level 5 interaction logic.
- `src/terminal/` contains the browser-safe virtual terminal simulator.
- `src/git/` contains the browser-safe Git simulator and validation.
- `src/http/` contains the browser-safe mock HTTP router, curl parser, state,
  endpoints, and validation.
- `src/progress/progressStore.ts` contains localStorage progress persistence.
- No Supabase, auth implementation, progress sync, achievements, or real terminal execution yet.

## Known Facts

- The project is in active curriculum implementation.
- The intended product is zero2codex: a free, gamified, beginner-friendly course that teaches coding fundamentals and OpenAI Codex workflows.
- The reference inspiration is `zero2claude.dev`.
- The current app has a public course map plus playable Levels 1 through 6.
- The desired product is a web course/app with interactive lessons, progress, gamification, terminal/Codex practice, and eventually community and admin tools.
- Google OAuth is postponed.
- The next auth phase should use Supabase email/password.

## Current Docs

- `docs/STATE.md`: current operational context and next action.
- `docs/DECISIONS.md`: durable decisions and pending choices.
- `docs/ZERO2CODEX_BUILD_GUIDE.html`: primary build guide and product blueprint.
- `docs/PROJECT_MEMORY.md`, `docs/HANDOFF.md`, and `docs/NEXT_STEPS.md`:
  historical snapshots retained for reference.

## Current App Entry Points

- `src/main.tsx`: React entry point.
- `src/App.tsx`: route configuration.
- `src/pages/CourseMapPage.tsx`: public course map.
- `src/pages/LessonShellPage.tsx`: lesson route that runs playable lessons or shows a planned placeholder.
- `src/pages/SetupShellPage.tsx`: placeholder login/register route content.
- `src/content/course.ts`: course outline data.
- `src/content/lessons.ts`: playable lesson registry.
- `src/content/lessonSchema.ts`: Zod-backed lesson schema.
- `src/content/level1Lessons.ts`: Level 1 foundational lesson content.
- `src/content/level2Lessons.ts`: Level 2 terminal lesson content.
- `src/content/level3Lessons.ts`: Level 3 reading/writing/searching lesson content.
- `src/content/level4Lessons.ts`: Level 4 Git lesson content.
- `src/content/level5Lessons.ts`: Level 5 software-systems lesson content.
- `src/content/level6Lessons.ts`: Level 6 HTTP/API lesson content.
- `src/components/ConceptInteraction.tsx`: Level 5 conceptual interaction UI.
- `src/concepts/levelFiveValidation.ts`: pure Level 5 state and validation.
- `src/terminal/`: path resolver, virtual file system, parser, command handlers, terminal state, and validation helpers.
- `src/git/`: Git snapshots, staging, history, branches, merges, mocked remotes,
  and lesson validation.
- `src/http/`: fictional-host URL parsing, curl parsing, endpoint catalog,
  routing, request history, response formatting, and lesson validation.
- `src/components/LessonRunner.tsx`: section-based lesson runner.
- `src/foundations/levelOneValidation.ts`: Level 1 interaction validation.
- `src/components/TerminalPanel.tsx`: browser-safe terminal UI.
- `src/styles.css`: Tailwind import and design system CSS.

## Guidance For Future AI Coding Sessions

This section records earlier working conventions. Current sessions should
follow `AGENTS.md` and `docs/STATE.md`, then load other references only when
the task requires them.

When adding code:

- Keep the first version small and runnable.
- Add setup and run instructions to `README.md`.
- Add a `.gitignore` that matches the chosen stack.
- Prefer simple, readable structure until the project needs more.
- Add verification steps, even if they are only "open this file" or "run this command".
- Do not copy zero2claude text, assets, or source code. Use it only as inspiration for mechanics and quality.

Current verification commands:

```sh
npm run typecheck
npm run lint
npm run test
npm run test:integration
npm run validate:content
npm run build
```

Current browser-safe terminal commands:

```text
pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, head, tail, echo, grep, rg, wc, git, curl, clear, help
```

Supported shell-like syntax is intentionally limited to one pipe plus `>` and
`>>` redirects.

Current dev command:

```sh
npm run dev -- --host 127.0.0.1
```

When changing direction:

- Record durable decisions in `docs/DECISIONS.md`.
- Refresh `docs/STATE.md` with the current objective and next action.

## Beginner-Friendly Principles

- Make the next action obvious.
- Explain the reason for new tools or dependencies.
- Avoid adding architecture before there is a working first version.
- Keep examples concrete.
- Prefer progress that can be seen, run, or reviewed.

Level 4 Git support:

- `init`, `status`, `add`, `commit`, `log`, `diff`, `branch`, `switch`,
  `checkout`, `merge`, `restore`, `remote`, `push`, `pull`, and mocked `clone`.
- State is rebuilt from lesson files plus deterministic setup commands on reset.
- No real Git process, GitHub connection, authentication, or network access.

Level 5 concept support:

- Assignment sorting, ordered flows, request/response walkthroughs, JSON
  inspection, data-table decisions, and system builders.
- All software-system models remain in-browser teaching simulations.
- No real SQL, database, hosting, deployment, or DNS operation.

Level 6 HTTP support:

- Fictional `.test` hosts only, enabled per lesson.
- Simulated GET/POST, query parameters, request headers, JSON bodies, response
  headers, status codes, errors, and resettable request history.
- `curl` supports only `-i`, `-X`, `-H`, and `-d`.
- No `fetch`, XMLHttpRequest, live HTTP, credentials, backend, GitHub, or
  OpenAI connection.

## Unknowns To Resolve

- What exact Supabase project and environment variables should be used?
- Should MVP email auth require email confirmation?
- What exact Level 8 Codex teaser should follow auth and progress work?
- Whether Supabase auth or Level 7 should follow the completed Level 6 slice.

# Handoff

Last updated: 2026-06-24

## Current State

zero2codex is a Vite + React + TypeScript course app with a 17-level,
151-lesson course map and complete playable Levels 1 through 6.

Implemented:

- Level 1: six foundational lessons and Find the Project challenge.
- Level 2: 13 terminal navigation and file-management lessons.
- Level 3: 13 reading, writing, searching, piping, and counting lessons.
- Level 4: 17 Git lessons and Full Git Workflow Challenge.
- Level 5: 14 software-system lessons using the Creator Project Tracker.
- Level 6: 12 offline HTTP/API lessons using fictional mock services.
- Zod-backed lesson schemas, reusable lesson runner, localStorage progress,
  browser-safe terminal/Git/HTTP simulators, and conceptual interactions.
- Keyboard-accessible controls, text alternatives, responsive layouts, pure
  validation tests, and Playwright integration coverage.

Not implemented:

- Supabase, accounts, authentication, progress sync, or protected routes.
- Real shell, GitHub, live HTTP/API, SQL, database, cloud, deployment, DNS, or
  Codex CLI execution.
- Achievements, forum, analytics, admin CMS, or Google OAuth.

## Live Preview

Keep the app visible at:

```text
http://127.0.0.1:4187/
```

Restart if necessary:

```sh
npm run dev -- --host 127.0.0.1 --port 4187
```

## Current Curriculum Architecture

- `src/content/level5Lessons.ts`: all 14 lessons.
- `src/content/lessonSchema.ts`: `conceptInteraction` discriminated union.
- `src/components/ConceptInteraction.tsx`: reusable React interaction views.
- `src/concepts/levelFiveValidation.ts`: pure state and validation helpers.
- `tests/level-five-validation.test.mjs`: interaction unit coverage.
- `tests/e2e/level-five.spec.mjs`: rendered Level 5 workflows.
- `docs/LEVEL5_SOFTWARE_SYSTEMS_HANDOFF.md`: detailed Level 5 notes.
- `docs/LEVEL6_HTTP_API_HANDOFF.md`: mock HTTP, curl, lessons, safety, and tests.

Interaction kinds are `assignment`, `sequence`, `requestResponse`,
`jsonInspector`, `dataTable`, and `systemBuilder`. They are teaching models,
not general-purpose simulators.

The Level 6 HTTP layer lives in `src/http/`. Endpoint definitions are separate
from curl parsing and terminal UI. Requests are routed only to lesson-enabled
fictional `.test` hosts and stored in resettable per-lesson history.

## Verification

Run:

```sh
npm run typecheck
npm run lint
npm run test
npm run test:integration
npm run validate:content
npm run build
```

Latest verification:

- 101 unit and lesson-flow tests passed.
- 27 Playwright integration tests passed, including all Level 6 HTTP flows.
- Content validation found all 12 Level 6 lessons.
- TypeScript, ESLint, and the production build passed.
- The existing non-blocking Vite chunk-size warning remains.
- Visible in-app-browser QA passed for POST/201 output, the complete eight-case
  API error history, mobile overflow, accessible HTTP state, and console
  health.

## Next Exact Action

Implement Supabase email/password authentication plus anonymous-progress
migration, followed by authenticated progress sync. Google OAuth remains
postponed.

## Restart Checklist

1. Read README, AGENTS, project memory, decisions, next steps, and this handoff.
2. Read the Level 5 and Level 6 implementation handoffs before changing
   interaction or HTTP architecture.
3. Run `rg --files --hidden -g '!.git'` and `git status --short`.
4. Confirm the live preview at `http://127.0.0.1:4187/`.
5. Preserve all Level 1–6 tests and browser-safe boundaries.

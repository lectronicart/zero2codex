# Handoff

Last updated: 2026-06-24

## Current State

zero2codex is a Vite + React + TypeScript course app with a 17-level,
151-lesson course map and complete playable Levels 1 through 5.

Implemented:

- Level 1: six foundational lessons and Find the Project challenge.
- Level 2: 13 terminal navigation and file-management lessons.
- Level 3: 13 reading, writing, searching, piping, and counting lessons.
- Level 4: 17 Git lessons and Full Git Workflow Challenge.
- Level 5: 14 software-system lessons using the Creator Project Tracker.
- Zod-backed lesson schemas, reusable lesson runner, localStorage progress,
  browser-safe terminal/Git simulators, and conceptual system interactions.
- Keyboard-accessible controls, text alternatives, responsive layouts, pure
  validation tests, and Playwright integration coverage.

Not implemented:

- Supabase, accounts, authentication, progress sync, or protected routes.
- Real shell, GitHub, HTTP, API, SQL, database, cloud, deployment, DNS, or
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

## Level 5 Architecture

- `src/content/level5Lessons.ts`: all 14 lessons.
- `src/content/lessonSchema.ts`: `conceptInteraction` discriminated union.
- `src/components/ConceptInteraction.tsx`: reusable React interaction views.
- `src/concepts/levelFiveValidation.ts`: pure state and validation helpers.
- `tests/level-five-validation.test.mjs`: interaction unit coverage.
- `tests/e2e/level-five.spec.mjs`: rendered Level 5 workflows.
- `docs/LEVEL5_SOFTWARE_SYSTEMS_HANDOFF.md`: detailed Level 5 notes.

Interaction kinds are `assignment`, `sequence`, `requestResponse`,
`jsonInspector`, `dataTable`, and `systemBuilder`. They are teaching models,
not general-purpose simulators.

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

Latest complete verification:

- 84 unit and flow tests passed.
- 21 Playwright tests passed.
- Content validation found all 14 Level 5 lessons.
- Production build passed with the existing non-blocking chunk-size warning.
- Visible browser QA passed for the HTTP response flow and mobile system map
  with no relevant console warnings or errors.

## Next Exact Action

After preserving the Level 5 work, choose between:

1. Supabase email/password authentication plus anonymous-progress migration.
2. Level 6 safe HTTP and public-API practice.

The documented product roadmap currently prioritizes Supabase email/password
auth, then authenticated progress sync. Google OAuth remains postponed.

## Restart Checklist

1. Read README, AGENTS, project memory, decisions, next steps, and this handoff.
2. Read `docs/LEVEL5_SOFTWARE_SYSTEMS_HANDOFF.md` before changing conceptual
   interaction architecture.
3. Run `rg --files --hidden -g '!.git'` and `git status --short`.
4. Confirm the live preview at `http://127.0.0.1:4187/`.
5. Preserve all Level 1–5 tests and browser-safe boundaries.

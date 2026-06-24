# Handoff

Last updated: 2026-06-24

## Current State

zero2codex is a Vite + React + TypeScript course app with a 17-level,
151-lesson course map and complete playable Levels 1 through 4.

Implemented:

- Level 1: six foundational lessons plus the Find the Project challenge.
- Level 2: 13 terminal navigation and file-management lessons.
- Level 3: 13 file reading, writing, searching, piping, and counting lessons.
- Level 4: 17 Git lessons plus the Full Git Workflow Challenge.
- Zod-backed lesson schema and reusable lesson runner.
- Browser-safe virtual filesystem and terminal.
- Browser-safe Git simulator with staging, commits, history, diffs, branches,
  switching, checkout, merges, guided conflicts, restore, mocked remotes,
  push, pull, and clone.
- Local lesson progress and resume state through `localStorage`.
- Accessible keyboard controls, recovery feedback, responsive layouts, and
  Playwright integration coverage.
- Placeholder `/login` and `/register` routes.

Not implemented:

- Level 5 and later playable lesson content.
- Real shell, Git, GitHub, local-device, backend, or arbitrary code execution.
- Supabase, accounts, email/password authentication, progress sync, protected
  routes, achievements, Codex CLI simulation, or Google OAuth.

## Live Preview

A Vite development server is currently running at:

```text
http://127.0.0.1:4187/
```

The app is open in a visible in-app browser tab. `AGENTS.md` now requires future
sessions to keep a working preview open, reload it after frontend changes, and
verify the affected workflow before handoff.

If the process is no longer running, restart it with:

```sh
npm run dev -- --host 127.0.0.1 --port 4187
```

Binding localhost may require elevated sandbox permission.

## Architecture

Important files:

- `src/content/course.ts`: static 17-level course map.
- `src/content/lessons.ts`: playable lesson registry.
- `src/content/lessonSchema.ts`: Zod-backed lesson and interaction schema.
- `src/content/level1Lessons.ts`: Level 1 content.
- `src/content/level2Lessons.ts`: Level 2 content.
- `src/content/level3Lessons.ts`: Level 3 content.
- `src/content/level4Lessons.ts`: Level 4 content.
- `src/foundations/levelOneValidation.ts`: Level 1 interaction rules.
- `src/terminal/`: virtual filesystem, parser, commands, session state, and
  terminal-step validation.
- `src/git/`: Git domain state, command behavior, snapshots, diffs, branches,
  mocked remotes, and Git lesson validation.
- `src/components/LessonRunner.tsx`: section-based lesson rendering.
- `src/components/TerminalPanel.tsx`: terminal UI and Git state strip.
- `src/progress/progressStore.ts`: local progress persistence.
- `docs/LEVEL1_IMPLEMENTATION_HANDOFF.md`: Level 1 implementation details.
- `docs/LEVEL4_GIT_IMPLEMENTATION_HANDOFF.md`: Git/Level 4 implementation
  details and intentional limitations.

The virtual filesystem is the Git working-directory source of truth. Git stores
a separate staging snapshot, immutable commit snapshots, branch pointers,
remotes, and conflict state. Every lesson reset rebuilds its original state
from the initial filesystem plus deterministic `setupCommands`.

## Files Changed This Session

Current tracked modifications:

- `AGENTS.md`
- `README.md`
- `docs/DECISIONS.md`
- `docs/HANDOFF.md`
- `docs/NEXT_STEPS.md`
- `docs/PROJECT_MEMORY.md`
- `package.json`
- `scripts/validate-content.ts`
- `src/components/LessonRunner.tsx`
- `src/components/TerminalPanel.tsx`
- `src/content/course.ts`
- `src/content/lessonSchema.ts`
- `src/content/lessons.ts`
- `src/pages/LessonShellPage.tsx`
- `src/styles.css`
- `src/terminal/commands.ts`
- `src/terminal/state.ts`
- `src/terminal/types.ts`
- `src/terminal/validation.ts`
- `tests/lesson-flow.test.mjs`
- `tests/progress.test.mjs`
- `tests/terminal-step.test.mjs`

Current untracked additions:

- `docs/LEVEL1_IMPLEMENTATION_HANDOFF.md`
- `docs/LEVEL4_GIT_IMPLEMENTATION_HANDOFF.md`
- `docs/lectronicart_project_operating_system_v1/`
- `playwright.config.mjs`
- `src/content/level1Lessons.ts`
- `src/content/level4Lessons.ts`
- `src/foundations/`
- `src/git/`
- `tests/e2e/`
- `tests/git-simulator.test.mjs`
- `tests/level-one-validation.test.mjs`

Do not discard or overwrite these changes. They contain the complete Level 1
and Level 4 implementations.

Outside the repository, the `jack-html-generator` skill was installed at:

```text
~/.codex/skills/jack-html-generator
```

Codex must be restarted before that new skill appears in a fresh skill list.

## Verification

The latest complete verification passed:

```sh
npm run typecheck
npm run lint
npm run test
npm run test:integration
npm run validate:content
npm run build
```

Results:

- 74 unit tests passed.
- 14 Playwright tests passed.
- Content validation found 17 levels, 151 map lessons, 6 Level 1 lessons,
  13 Level 2 lessons, 13 Level 3 lessons, and 17 Level 4 lessons.
- Production build succeeded.
- In-app browser QA passed for desktop branch/merge and mobile Git lesson
  layouts with no relevant console warnings or errors.
- Mobile browser QA found no horizontal page overflow.

The production build emits a non-blocking warning because the main JavaScript
chunk is approximately 517 kB after minification.

## Errors And Friction

- Local Vite and Playwright web servers initially failed with `listen EPERM`
  inside the sandbox. Rerunning with elevated permission succeeded.
- Production build found two type issues not exposed by the faster standalone
  typecheck: Git command-result narrowing and `flatMap` inference. Both were
  fixed, and the build now passes.
- The in-app browser screenshot API is `tab.screenshot(...)`, not
  `tab.playwright.screenshot(...)`.
- Playwright creates `test-results/`; it was removed after verification.
- The Git simulator intentionally stops divergent pulls and merge conflicts
  instead of pretending to support production-grade resolution.

## Unfinished Work

- Review, stage, and commit the current Level 1/Level 4 implementation and
  documentation changes.
- Decide whether the untracked Project Operating System directory belongs in
  the repository commit.
- Implement Level 5, "How Software Actually Works."
- Decide when to prioritize Supabase email/password auth and synced progress.
- Create a hosted preview if the app needs a URL outside the local Codex
  environment.
- Later: achievements, Codex teaser lessons, and advanced course levels.

## Next Exact Action

Before starting another feature:

1. Run `git diff --check` and review `git status --short`.
2. Review the complete Level 1 and Level 4 diff.
3. Decide whether to include
   `docs/lectronicart_project_operating_system_v1/`.
4. Stage and commit the approved current implementation.

After preserving the current work, the next Goal Mode task is to implement all
14 Level 5 lessons with browser-safe conceptual interactions for code,
websites, client/server, HTTP, APIs, JSON, databases, frontend/backend, cloud,
deployment, DNS, and domains.

## Restart Checklist

1. Read `README.md`, `AGENTS.md`, this file, `docs/DECISIONS.md`, and
   `docs/NEXT_STEPS.md`.
2. Run `rg --files --hidden -g '!.git'`.
3. Run `git status --short`; expect a dirty worktree until the current
   implementation is committed.
4. Confirm `http://127.0.0.1:4187/` is running and visible in the in-app
   browser, or restart it.
5. Read `docs/LEVEL4_GIT_IMPLEMENTATION_HANDOFF.md` before changing Git or
   terminal architecture.

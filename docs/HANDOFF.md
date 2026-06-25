# Handoff

> Legacy snapshot. Use `docs/STATE.md` for the active objective, verification
> status, blockers, and next action.

Last updated: 2026-06-25

## Current State

zero2codex is currently on branch `codex/course-map-ui-refresh`. This branch is
focused on making the course map feel much closer to the zero2claude reference
structure while keeping zero2codex branding, copy, colors, and implementation
original.

Implemented in this slice:

- Dense single-stack course map with collapsible levels, outside level markers,
  progress rails, a continue-learning strip, and tighter spacing.
- Persistent `Cards` / `List` course-map switch.
- Responsive card layout that shifts from four columns down to one column.
- Original one-line explanations beneath all 151 lesson titles in
  `src/content/course.ts`.
- Shared progress, resume, and lesson-link behavior across both layouts.
- Validation that requires a subtitle for every course-map lesson.
- Updated course-map end-to-end coverage for stacked layout, mobile layout, and
  layout-switch persistence.
- Complete playable Levels 1 through 6 remain intact.

Still not implemented:

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

Important: the current session hit an in-app browser localhost policy rejection
while trying to capture the new card view. The preview server should remain
running, but rendered card-view QA is not fully closed out.

## Files Changed In This Slice

Tracked modifications:

- `src/pages/CourseMapPage.tsx`
- `src/components/LevelCard.tsx`
- `src/components/AppShell.tsx`
- `src/content/course.ts`
- `src/styles.css`
- `scripts/validate-content.ts`
- `docs/HANDOFF.md`
- `docs/DECISIONS.md`
- `docs/NEXT_STEPS.md`

Untracked additions:

- `tests/e2e/course-map.spec.mjs`
- `design-qa.md`

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

Latest verification in this card-view pass:

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run test` passed with 101 tests.
- `npm run validate:content` passed.
- `npm run build` passed.
- `node --check tests/e2e/course-map.spec.mjs` passed.
- `git diff --check` passed.
- The existing non-blocking Vite chunk-size warning still appears during build.

Not re-run after the latest Cards/List work:

- Full `npm run test:integration`.
- In-app browser rendered QA of the new card view at desktop and mobile sizes.

## Unfinished Work

- Visually verify the new `Cards` layout against the supplied screenshot.
- Tune any remaining spacing, clipping, or card-height differences after
  rendered QA.
- Decide whether `design-qa.md` should remain a committed project artifact.

## Errors / Blockers

- The in-app browser rejected `http://127.0.0.1:4187/` during card-view capture
  with a localhost URL policy error, which blocked rendered QA for the new
  layout.
- Production build still reports the existing non-blocking Vite chunk-size
  warning.

## Next Exact Action

Restore rendered access to `http://127.0.0.1:4187/` in the in-app browser, then
switch the course map to `Cards`, verify desktop and mobile fidelity, and
adjust CSS only if the rendered comparison exposes issues.

## Restart Checklist

Superseded by `AGENTS.md` and `docs/STATE.md`. This checklist is retained only
as part of the historical snapshot.

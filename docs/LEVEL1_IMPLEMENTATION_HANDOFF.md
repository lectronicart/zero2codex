# Level 1 Implementation Handoff

Last updated: 2026-06-23

## Architecture

Level 1 uses the existing lesson runner plus one new Zod-backed section type:
`foundationInteraction`. Content lives in `src/content/level1Lessons.ts`;
validation lives in `src/foundations/levelOneValidation.ts`; React rendering
lives in `src/components/LessonRunner.tsx`.

## New Content and Components

- Six playable lessons: files, folders, paths, file types, programs, terminal.
- Final "Find the Project" challenge inside Lesson 1.6.
- Reusable interactions: classification, folder choice/tree, path builder,
  absolute/relative classification, file-type matching, ordered steps, and
  Level 1 review.
- All trees, paths, desktop examples, and terminal previews are labeled as
  simulations.

## Validation and Tests

- Unit tests cover file/folder classification, tree choice, path building,
  path kinds, extensions, matching, sequencing, terminal concepts, review
  progression, and progress persistence.
- Playwright tests cover all six routes, lesson completion, localStorage,
  hints, recovery feedback, keyboard activation, mobile overflow, final
  challenge completion, and routing to Level 2.

## Accessibility

Interactions use native buttons, selects, radio roles, labels, visible focus
outlines, text feedback, and non-drag alternatives. Paths and trees scroll or
wrap safely on small screens.

## Known Limitations

- Review mode is not implemented anywhere in the current lesson engine.
- Level 1 progress is localStorage-only until authenticated sync exists.
- Simulations intentionally do not access real files, devices, terminals, or
  operating-system APIs.

## Recommended Next Goal Mode Task

Implement Supabase email/password authentication and preserve anonymous Level
1 through Level 3 progress for later account migration. Google OAuth remains
postponed.

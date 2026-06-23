# Handoff

Last updated: 2026-06-23

## Current State

This repository now has the first zero2codex app scaffold plus the playable Level 2 terminal-learning slice.

What exists now:

- A Git repository on branch `main`.
- Local root commit `63b2984` exists: `Build Level 2 virtual terminal lessons`.
- GitHub remote `origin` is configured as `https://github.com/lectronicart/zero2codex.git`.
- Remote `origin/main` has a separate initial commit `76cf894` containing only `README.md`.
- Local `main` and `origin/main` currently have unrelated histories. The local commit has not been pushed yet.
- A `docs/` folder with project memory files.
- `docs/ZERO2CODEX_BUILD_GUIDE.html`, a research-backed build guide for the full course/product.
- A Vite + React + TypeScript app scaffold.
- React Router route shell.
- Tailwind CSS Vite integration plus custom CSS design tokens.
- Public course map driven by `src/content/course.ts`.
- Full 17-level, 151-lesson course outline with MVP/playable markers.
- Playable route flow for all 13 Level 2 lessons.
- Browser-safe virtual terminal simulator.
- Local progress completion and resume state through `localStorage`.
- Placeholder route shells for `/login` and `/register`.
- No Supabase, email auth, Google OAuth, authenticated progress sync, achievements, real terminal execution, Git simulator, or Codex CLI simulator yet.
- `git status --short` currently shows `?? docs/lectronicart_project_operating_system_v1/`, an untracked folder not inspected or committed in the terminal-slice commit.

Project direction:

- Build a free, gamified, beginner-friendly digital course inspired by `zero2claude.dev`.
- Teach coding fundamentals plus OpenAI Codex workflows.
- Keep the mechanics close in spirit to the reference course, but write original zero2codex content, branding, and implementation.
- Use `docs/ZERO2CODEX_BUILD_GUIDE.html` as the main product blueprint.
- Google OAuth is postponed; the next auth phase should start with Supabase email/password.

Future coding sessions should inspect the guide and the existing app scaffold before changing architecture.

Current viewable version:

- No hosted/deployed URL exists yet.
- Run locally with `npm run dev -- --host 127.0.0.1`.
- Then open `http://127.0.0.1:5173/`.
- Playable routes include `/lesson/2.1` through `/lesson/2.13`.

## Files Added For Project Memory

- `docs/HANDOFF.md`: quick state transfer for the next human or AI session.
- `docs/NEXT_STEPS.md`: practical backlog of what to do next.
- `docs/DECISIONS.md`: decision log for project choices.
- `docs/PROJECT_MEMORY.md`: durable overview of facts, conventions, and session guidance.
- `docs/ZERO2CODEX_BUILD_GUIDE.html`: full build guide for the zero2codex course/app.

## App Files Added

- `README.md`: setup, status, and MVP direction.
- `AGENTS.md`: instructions for future Codex sessions.
- `package.json` / `package-lock.json`: npm scripts and pinned dependencies.
- `src/content/course.ts`: typed source of truth for the 17-level course map.
- `src/content/lessonSchema.ts`: Zod-backed schema for playable lesson content.
- `src/content/level2Lessons.ts`: complete Level 2 playable lessons.
- `src/content/lessons.ts`: playable lesson registry.
- `src/terminal/`: virtual file system, path resolver, parser, command handlers, session state, and terminalStep validation.
- `src/progress/progressStore.ts`: localStorage progress store.
- `src/App.tsx`: route shell.
- `src/pages/`: current public map and placeholder pages.
- `src/components/`: app shell, level card, terminal preview, lesson runner, and terminal UI components.
- `src/styles.css`: Tailwind import plus zero2codex design tokens/styles.

## Terminal Architecture

- The terminal is a browser simulation only. It never calls a real shell, backend, iframe terminal, WebContainer, or local computer API.
- `src/terminal/vfs.ts` stores folders/files in memory and clones state on file-system changes.
- `src/terminal/path.ts` resolves relative paths, absolute paths, `..`, and `~` while clamping traversal inside the virtual root.
- `src/terminal/parser.ts` tokenizes simple commands and quoted strings.
- `src/terminal/commands.ts` handles supported commands and beginner-friendly errors.
- `src/terminal/state.ts` manages command history and terminal output entries.
- `src/terminal/validation.ts` validates terminalStep command history, current directory, expected paths, missing paths, and file contents.
- `src/components/TerminalPanel.tsx` renders the terminal log, prompt path, reset control, command input, and up/down history navigation.

## Supported Commands

- `pwd`
- `ls`
- `cd`
- `mkdir`
- `touch`
- `rm`
- `cp`
- `mv`
- `cat`
- `echo`
- `clear`
- `help`

Unsupported by design in this phase: real shell execution, Git, Codex CLI, pipes, redirects, grep, rg, wc, curl, backend calls, arbitrary code execution, and host file access.

## Lesson Section Schema

Playable lessons are validated in `src/content/lessonSchema.ts` with Zod. Current section types:

- `narrative`
- `quiz`
- `fillInBlank`
- `checklist`
- `promptTemplate`
- `terminalStep`

`terminalStep` supports lesson-specific initial file systems, starting directory, expected command strings or regex patterns, expected current directory, expected files/folders, absent paths, success message, hint, failure feedback, and reset behavior through the terminal UI.

## Test Coverage

- `tests/path.test.mjs`: path normalization, relative/absolute/home/parent resolution, root escape clamping, parent/basename helpers.
- `tests/commands.test.mjs`: every supported command plus invalid paths, unsupported commands, folder deletion guard, and root deletion guard.
- `tests/terminal-step.test.mjs`: terminalStep command/current-directory/file-system validation.
- `tests/lesson-flow.test.mjs`: every Level 2 lesson has a terminalStep, all 13 Level 2 terminal steps can be completed with intended commands, and the final Level 2 challenge can be completed end-to-end with progress completion.
- `tests/progress.test.mjs`: localStorage-compatible save/load, lesson restart resume reset, and terminal reset from the original lesson file system.

## Files Changed In The Latest Implementation Session

App/config files in commit `63b2984`:

- `.gitignore`
- `AGENTS.md`
- `README.md`
- `eslint.config.js`
- `index.html`
- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `vite.config.ts`
- `src/main.tsx`
- `src/App.tsx`
- `src/styles.css`
- `src/vite-env.d.ts`
- `src/content/course.ts`
- `src/components/AppShell.tsx`
- `src/components/LevelCard.tsx`
- `src/components/TerminalPreview.tsx`
- `src/pages/CourseMapPage.tsx`
- `src/pages/LessonShellPage.tsx`
- `src/content/lessonSchema.ts`
- `src/content/level2Lessons.ts`
- `src/content/lessons.ts`
- `src/terminal/types.ts`
- `src/terminal/path.ts`
- `src/terminal/vfs.ts`
- `src/terminal/parser.ts`
- `src/terminal/commands.ts`
- `src/terminal/state.ts`
- `src/terminal/validation.ts`
- `src/progress/progressStore.ts`
- `src/components/LessonRunner.tsx`
- `src/components/TerminalPanel.tsx`
- `scripts/validate-content.ts`
- `tests/path.test.mjs`
- `tests/commands.test.mjs`
- `tests/terminal-step.test.mjs`
- `tests/lesson-flow.test.mjs`
- `src/pages/NotFoundPage.tsx`
- `src/pages/SetupShellPage.tsx`

Memory/docs updated:

- `docs/HANDOFF.md`
- `docs/NEXT_STEPS.md`
- `docs/DECISIONS.md`
- `docs/PROJECT_MEMORY.md`

Post-commit memory update in this session:

- `docs/HANDOFF.md`
- `docs/NEXT_STEPS.md`
- `docs/DECISIONS.md`

## What A Future AI Session Should Do First

1. Read all files in `docs/`.
2. Run `rg --files --hidden -g '!.git'` to see the current repo shape.
3. Check `git status --short` before editing.
4. Open or read `docs/ZERO2CODEX_BUILD_GUIDE.html` before scaffolding code.
5. If source files have been added since this handoff, inspect them before suggesting changes.
6. Update these memory files when meaningful project facts change.

## Verification Notes

Current verification commands:

```sh
npm run typecheck
npm run lint
npm run test
npm run validate:content
npm run build
```

All five passed after the terminal slice was added.

Additional checks performed:

- Verified `src/content/course.ts` exports 17 levels and 151 lessons.
- Verified `src/content/level2Lessons.ts` exports 13 playable Level 2 lessons, each with at least one `terminalStep`.
- Started the Vite dev server at `http://127.0.0.1:5173/`.
- Verified `/`, `/lesson/2.1`, and `/lesson/2.12` returned HTTP 200 from the dev server.
- Ran Playwright against desktop `/` and mobile `/lesson/2.1`.
- Verified a learner can advance to the terminal, run `pwd`, and receive the success feedback in the browser.
- Saved inspection screenshots at `/private/tmp/zero2codex-home.png` and `/private/tmp/zero2codex-lesson-mobile-viewport.png`.

The dev server can be started with:

```sh
npm run dev -- --host 127.0.0.1
```

In this sandbox, binding the dev server required elevated permissions.

## Errors Or Friction Encountered

- Starting Vite still requires elevated permissions in this sandbox.
- The in-app browser tool was not exposed. Browser QA used Playwright with the repo's dev dependency.
- Playwright's browser binary had to be installed before browser smoke tests could run.
- GitHub push attempt failed because `origin/main` already contains an initial README commit that local `main` does not have.
- `git fetch origin main` succeeded and showed remote commit `76cf894`.
- Attempted merge with `git merge origin/main --allow-unrelated-histories --no-edit`, but the tool approval was blocked by the current Codex usage limit, so no merge was performed.
- `gh` is not installed, so PR creation through GitHub CLI is not available from this environment.

## Known Limitations

- Only Level 2 is playable. Level 1 and Level 8 are still planned placeholders despite MVP markers.
- Terminal state is in memory and resets on lesson restart or terminal reset; progress is what persists.
- The terminal intentionally does not support pipes, redirects, grep, rg, wc, curl, Git, Codex CLI commands, or real shell execution.
- `rm -r` is supported as an explicit folder delete, but this is still a simplified teaching simulator.
- Progress is local only. It does not sync across browsers or accounts yet.

## Unfinished Work

- Local commit `63b2984` still needs to be integrated with remote commit `76cf894` and pushed to GitHub.
- The remote initial README description should be preserved in substance when resolving the README merge.
- No Supabase setup or environment variables yet.
- No email/password account creation yet.
- No synced progress store yet.
- No protected routes yet.
- No Level 1 playable lesson content yet.
- No Google OAuth; it is intentionally postponed.

## Next Exact Action

Resolve the GitHub remote history and push the local project.

Recommended exact steps:

- Inspect `git status -sb`.
- Inspect `git show origin/main:README.md`.
- Merge remote history with `git merge origin/main --allow-unrelated-histories`.
- Resolve the expected `README.md` conflict by keeping the richer local README while preserving the remote short description in substance.
- Run `npm run typecheck`, `npm run lint`, `npm run test`, `npm run validate:content`, and `npm run build`.
- Commit the merge if needed.
- Push with `git push -u origin main`.

After GitHub push is complete, the next product task is to write the complete playable Level 1 lesson set using the existing lesson schema and lesson runner.

Recommended next Goal Mode task:

- Create all six Level 1 lessons.
- Keep every lesson beginner-friendly and original.
- Include at least one active interaction in every lesson.
- Reuse the current local progress flow.
- Run `npm run typecheck`, `npm run lint`, `npm run test`, `npm run validate:content`, and `npm run build`.

## Open Questions

- What exact Supabase project should be used for email auth?
- Should email confirmation be disabled for local/MVP previews?
- What should the first lesson schema validator enforce?

# Project Memory

Last updated: 2026-06-23

## Project Snapshot

Repository name/path:

```text
zero2codex (LectronicArt Skool 1st Asset)
```

Current repo shape:

- Git repository on branch `main`.
- No commits yet.
- `docs/` contains project memory files.
- `docs/ZERO2CODEX_BUILD_GUIDE.html` contains the full course/product blueprint.
- Vite + React + TypeScript application scaffold exists.
- React Router is configured.
- Tailwind CSS is integrated through the Vite plugin.
- `README.md` and `AGENTS.md` exist.
- `package.json` and `package-lock.json` exist.
- `src/content/course.ts` contains the 17-level, 151-lesson outline.
- `src/content/level2Lessons.ts` contains the complete playable Level 2 lesson set.
- `src/terminal/` contains the browser-safe virtual terminal simulator.
- `src/progress/progressStore.ts` contains localStorage progress persistence.
- No Supabase, auth implementation, progress sync, achievements, or real terminal execution yet.

## Known Facts

- The project is in its initial setup phase.
- The intended product is zero2codex: a free, gamified, beginner-friendly course that teaches coding fundamentals and OpenAI Codex workflows.
- The reference inspiration is `zero2claude.dev`.
- The current app has a public course map plus a playable Level 2 terminal-learning slice.
- The desired product is a web course/app with interactive lessons, progress, gamification, terminal/Codex practice, and eventually community and admin tools.
- Google OAuth is postponed.
- The next auth phase should use Supabase email/password.

## Current Docs

- `docs/HANDOFF.md`: current state and restart instructions.
- `docs/NEXT_STEPS.md`: practical backlog.
- `docs/DECISIONS.md`: durable decisions and pending choices.
- `docs/PROJECT_MEMORY.md`: this overview.
- `docs/ZERO2CODEX_BUILD_GUIDE.html`: primary build guide and product blueprint.

## Current App Entry Points

- `src/main.tsx`: React entry point.
- `src/App.tsx`: route configuration.
- `src/pages/CourseMapPage.tsx`: public course map.
- `src/pages/LessonShellPage.tsx`: lesson route that runs playable lessons or shows a planned placeholder.
- `src/pages/SetupShellPage.tsx`: placeholder login/register route content.
- `src/content/course.ts`: course outline data.
- `src/content/lessons.ts`: playable lesson registry.
- `src/content/lessonSchema.ts`: Zod-backed lesson schema.
- `src/terminal/`: path resolver, virtual file system, parser, command handlers, terminal state, and validation helpers.
- `src/components/LessonRunner.tsx`: section-based lesson runner.
- `src/components/TerminalPanel.tsx`: browser-safe terminal UI.
- `src/styles.css`: Tailwind import and design system CSS.

## Guidance For Future AI Coding Sessions

Start each session by reading the docs folder and inspecting the repository. Read `docs/ZERO2CODEX_BUILD_GUIDE.html` before scaffolding or changing the product direction.

Use these commands for orientation:

```sh
rg --files --hidden -g '!.git'
git status --short
```

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
npm run validate:content
npm run build
```

Current dev command:

```sh
npm run dev -- --host 127.0.0.1
```

When changing direction:

- Record durable decisions in `docs/DECISIONS.md`.
- Refresh `docs/HANDOFF.md` with the latest state.
- Move completed items out of `docs/NEXT_STEPS.md` or mark them done.

## Beginner-Friendly Principles

- Make the next action obvious.
- Explain the reason for new tools or dependencies.
- Avoid adding architecture before there is a working first version.
- Keep examples concrete.
- Prefer progress that can be seen, run, or reviewed.

## Unknowns To Resolve

- What exact Supabase project and environment variables should be used?
- Should MVP email auth require email confirmation?
- Should Level 1 or auth be the next implementation task?
- What exact Supabase project and environment variables should be used?

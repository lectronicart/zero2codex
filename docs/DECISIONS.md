# Decisions

Last updated: 2026-06-23

This file records durable project decisions so future sessions can understand why the repo is shaped the way it is.

## Decision Log

### 2026-06-23: Current viewable version is local Vite until deployment is configured

Decision: Treat the current viewable project as a local Vite app, not a hosted deployment.

Why: The GitHub remote exists, but pushing is not complete yet because `origin/main` has an unrelated initial README commit. No Vercel, Netlify, GitHub Pages, or other static deployment has been configured.

Impact:

- Use `npm run dev -- --host 127.0.0.1` and open `http://127.0.0.1:5173/` to view the app locally.
- Resolve the remote history and push before setting up hosted deployment.
- A future hosted preview should be recorded in `README.md` and `docs/HANDOFF.md`.

### 2026-06-23: Build the Level 2 terminal slice before auth

Decision: Add a browser-safe virtual terminal, local progress, a reusable lesson runner, and all 13 Level 2 terminal lessons before adding Supabase auth.

Why: The new Goal Mode task prioritizes the terminal-learning experience and explicitly forbids real shell access, backend execution, auth, Supabase, Google login, Git simulation, and Codex CLI simulation in this phase.

Impact:

- `src/terminal/` owns terminal logic separate from React UI.
- `src/content/level2Lessons.ts` owns the Level 2 lesson content.
- `src/content/lessonSchema.ts` validates lesson data with Zod.
- `src/progress/progressStore.ts` persists completion locally through `localStorage`.
- The terminal supports only `pwd`, `ls`, `cd`, `mkdir`, `touch`, `rm`, `cp`, `mv`, `cat`, `echo`, `clear`, and `help`.
- Future Git, Codex, pipes, redirects, grep, curl, auth, and sync work should build on these seams without connecting to a real shell.

### 2026-06-23: zero2codex will be a Codex-focused course inspired by zero2claude

Decision: Build zero2codex as a free, gamified, beginner-friendly digital course similar in mechanics and ambition to `zero2claude.dev`, but focused on OpenAI Codex.

Why: The project owner's business goal is to create a core digital asset that teaches coding fundamentals and Codex workflows.

Impact:

- `docs/ZERO2CODEX_BUILD_GUIDE.html` is the primary blueprint.
- Future sessions should preserve the reference-inspired learning mechanics while creating original content, design, branding, and implementation.
- The proposed course scale is 17 levels and 151 lessons, adapted for Codex.

### 2026-06-23: Start implementation with a thin MVP, not the full 151 lessons

Decision: Treat the full guide as the vision, but implement in slices.

Why: The lesson engine, terminal simulator, and content schema must prove out before building accounts, dashboards, admin tools, community features, or all lessons.

Impact:

- Recommended first app milestone: course map, lesson shell, localStorage progress, Level 1 content, and basic interactive section renderers.
- Backend, forum, learner map, AI onboarding, and admin CMS should wait until the core learning loop works.

### 2026-06-23: Scaffold with Vite, React, TypeScript, React Router, and Tailwind

Decision: Use Vite + React + TypeScript + React Router + Tailwind CSS Vite integration for the app scaffold.

Why: This matches the build guide's SPA direction, keeps the course map fast to build, and leaves room for a reusable lesson engine.

Impact:

- `src/content/course.ts` is the current source of truth for the course map.
- `src/App.tsx` owns the route shell.
- `src/styles.css` imports Tailwind and defines the zero2codex design tokens.
- Current verification commands are `npm run typecheck`, `npm run lint`, and `npm run build`.

### 2026-06-23: Postpone Google OAuth and start auth with email/password

Decision: Do not implement Google OAuth in the MVP scaffold. The next auth phase should use Supabase email/password first.

Why: Google OAuth production setup requires branding, redirect, and consent-screen work outside the first implementation task.

Impact:

- `/login` and `/register` are placeholders only.
- No Supabase client, OAuth buttons, callback route, or provider token storage has been added yet.
- Future auth work should keep the course map public and protect lesson/progress surfaces when sync exists.

### 2026-06-23: First implementation task is complete

Decision: The first task is limited to scaffold, route shell, design tokens, README, AGENTS.md, and a static 17-level course map.

Why: This creates a visible, reviewable base without mixing in auth, lessons, terminal simulation, or backend decisions.

Impact:

- The app currently shows all 151 planned lessons and marks the scaffold MVP targets plus the playable Level 2 slice.
- Lesson, login, and register routes intentionally explain that their real implementation comes later.
- Next work should add validation or email auth, not broad product features.

### 2026-06-23: Pin package versions after scaffold install

Decision: Replace initial `latest` dependency ranges with the concrete versions installed by `npm install`.

Why: The scaffold should be reproducible enough for future beginner-friendly sessions and easier to review when dependencies change.

Impact:

- `package.json` and `package-lock.json` now agree on the installed React, Vite, Tailwind, TypeScript, and ESLint versions.
- Future dependency upgrades should be intentional and verified with `npm run typecheck`, `npm run lint`, and `npm run build`.

### 2026-06-23: Start with project memory before source code

Decision: Create starter memory files in `docs/` before adding any app or source-code scaffold.

Why: The repository currently has no code, no README, and no committed history. Memory files give future human and AI sessions a shared starting point without pretending the project direction is already settled.

Impact:

- Future sessions should read `docs/` before making changes.
- Future sessions should update these files when the project gains code, tooling, or a clearer product direction.
- This decision has been superseded by the Vite + React + TypeScript scaffold decision above.

### 2026-06-23: Keep early documentation beginner-friendly

Decision: Write the starter docs in plain language with practical checklists.

Why: The project appears to be in a learning or first-asset phase. Beginner-friendly notes should make it easier to resume work without needing to reconstruct context.

Impact:

- Prefer clear steps over dense architecture notes.
- Explain assumptions and unknowns directly.
- Keep the next tasks small and concrete.

## Pending Decisions

- Supabase project and environment setup.
- Whether Level 1 content or auth comes next.
- Progress sync data model.
- Whether local/MVP email auth disables email confirmation.
- Whether the first playable slice should start with Level 1 lessons before auth or after auth.

## How To Add A Decision

Use this format:

```md
### YYYY-MM-DD: Short decision title

Decision: What was chosen.

Why: The reason for the choice.

Alternatives considered: Other options, if useful.

Impact: What future sessions should know because of this choice.
```

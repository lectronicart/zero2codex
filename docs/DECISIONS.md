# Decisions

Last updated: 2026-06-25

This file records durable project decisions so future sessions can understand why the repo is shaped the way it is.

## Decision Log

### 2026-06-25: Use one concise state file for session continuity

Decision: Make `docs/STATE.md` the only required operational memory for a new
coding session. Keep `AGENTS.md` focused on durable rules and use progressive
disclosure for the README, build guide, decision log, and subsystem handoffs.

Why: Requiring every session to load the full build guide and several
overlapping memory files consumed substantial context, repeated discoverable
facts, and allowed duplicated current-state claims to drift out of sync.

Impact:

- New sessions read `docs/STATE.md`, then inspect the working tree.
- `docs/STATE.md` stays under 900 words and contains only the active objective,
  important boundaries, verification status, blockers, and next action.
- The build guide is read only for product, curriculum, or major architecture
  changes.
- `docs/DECISIONS.md` is searched by topic rather than loaded by default.
- `docs/PROJECT_MEMORY.md`, `docs/HANDOFF.md`, and `docs/NEXT_STEPS.md` remain
  historical snapshots and are no longer maintained as parallel current state.

### 2026-06-25: Keep both stacked and card course-map layouts behind one persistent toggle

Decision: Keep the dense single-stack course map as the default view, but add a
persistent `Cards` / `List` layout toggle that stores the learner's preference
in `localStorage`.

Why: The single stack is still the clearest default for the full learning path,
but the user also wants a compact card view that feels closer to the visual
reference and makes level scanning faster on wide screens.

Impact:

- `src/pages/CourseMapPage.tsx` owns the layout mode state and persistence.
- `src/components/LevelCard.tsx` supports both list and card presentation while
  reusing the same progress and lesson-link data.
- Course-map QA now needs to cover both layouts, not just the stacked view.

### 2026-06-25: Require a one-line subtitle for every course-map lesson

Decision: Treat the short explanation beneath each lesson title as required
course-map content, not optional decoration.

Why: The redesigned UI depends on those subtitles to make lesson names scannable
for beginners and to better match the intended educational feel of the reference.

Impact:

- `src/content/course.ts` now carries an original subtitle for all 151 lessons.
- `scripts/validate-content.ts` should fail if any lesson subtitle is missing.
- Future lesson authoring work must include both a title and a concise beginner
  explanation for the course-map surface.

### 2026-06-24: Use a dense single-stack course map before further curriculum expansion

Decision: Replace the two-column level grid and large landing-page hero with a
compact learning dashboard plus one full-width expandable level stack.

Why: The course map is the core product surface. Establishing its information
hierarchy now prevents future levels from multiplying an early card-grid design
that was harder to scan and less aligned with the intended terminal-course
experience.

Impact:

- Level rows are compact, collapsible, and show progress at a glance.
- Level numbers sit outside the cards to create a continuous learning path.
- Every lesson summary includes an original one-line explanation.
- The design uses the zero2claude screenshots only as structural and quality
  references; zero2codex copy, colors, components, and implementation remain
  original.

### 2026-06-24: Teach HTTP through an offline allowlisted mock universe

Decision: Add a pure TypeScript mock HTTP layer and a deliberately limited
`curl` command for Level 6. Only lesson-enabled fictional `.test` hosts can be
routed, and no browser network API is used.

Why: Learners need realistic request, response, status, header, JSON, auth, and
debugging practice without real credentials, external services, or accidental
network access.

Impact:

- `src/http/` owns HTTP parsing, endpoint definitions, routing, state, output,
  and validation separately from React and terminal presentation.
- Request history is resettable and scoped to each terminal lesson.
- Level 6 uses only `DEMO_TOKEN`, `sk-demo-not-real`, and
  `ghp_demo_not_real`.
- Live GitHub/OpenAI calls, arbitrary URLs, cookies, uploads, OAuth, backend
  APIs, and full curl/HTTP compatibility remain out of scope.

### 2026-06-24: Teach Level 5 through one focused conceptual interaction union

Decision: Add a `conceptInteraction` lesson section with assignment, sequence,
request/response, JSON inspector, data-table, and system-builder variants.

Why: Level 5 needs active browser-safe models for software relationships, but
the Level 1 `foundationInteraction` is tied to files, folders, and paths. A
small separate union keeps content data-driven without creating a generic
visual editor or pretending to run real services.

Impact:

- `src/content/level5Lessons.ts` owns all 14 lessons.
- `src/concepts/levelFiveValidation.ts` owns framework-free behavior.
- Every Level 5 lesson includes one exact "Why this matters with Codex"
  narrative section.
- HTTP, APIs, JSON, SQL, databases, cloud, deployment, and DNS remain
  conceptual browser simulations.

### 2026-06-24: Keep a visible live preview during implementation

Decision: Keep the local Vite app running at `http://127.0.0.1:4187/` in a
visible in-app browser tab while implementing changes.

Why: The project owner wants every change to remain immediately testable
inside the Codex project, and rendered verification catches interaction and
layout issues that static checks do not.

Impact:

- `AGENTS.md` contains the permanent live-preview workflow.
- Future frontend sessions should reload the existing tab after changes and
  verify the affected workflow, console health, and responsive behavior.
- Do not close the tab or stop the development server unless requested or a
  restart is required.

### 2026-06-24: Build the browser-safe Git course before authentication

Decision: Implement Level 4 with a reusable in-memory Git simulator before
Supabase authentication.

Why: The explicit Goal Mode objective continued the completed Level 1 through
Level 3 course sequence. The build guide also places the Git simulator inside
the virtual-terminal phase before Git lessons.

Impact:

- `src/git/` owns Git domain logic separately from React and terminal
  presentation.
- The virtual filesystem remains the working-directory source of truth.
- Git commits use deterministic immutable snapshots and hashes.
- Lesson reset rebuilds Git state from the original virtual filesystem and
  safe setup commands.
- GitHub, authentication, real Git execution, and network access remain out of
  scope.

### 2026-06-23: Use one reusable foundational interaction section for Level 1

Decision: Extend the lesson schema with a typed `foundationInteraction` section
for classification, choices, path building, path classification, matching,
sequencing, and the Level 1 review challenge.

Why: The existing quiz and terminal sections could not express the requested
file, folder, path, file-type, program, and terminal simulations cleanly.

Impact:

- Level 1 content lives in `src/content/level1Lessons.ts`.
- Validation remains framework-free in
  `src/foundations/levelOneValidation.ts`.
- No real filesystem, terminal, device, account, or backend access was added.
- Future foundational lessons can reuse the same accessible controls.

### 2026-06-23: Merge and push main to GitHub

Decision: Merge the remote README-only initial commit into local `main`, keep the full local project README while preserving the remote short description, and push `main` to GitHub.

Why: The GitHub repository already had an initial README commit, so the local project history could not be pushed until the histories were integrated.

Impact:

- Current local and remote `main` are both at `f3d9158`.
- `origin` points to `https://github.com/lectronicart/zero2codex.git`.
- The repo is ready for hosted preview setup.
- `docs/lectronicart_project_operating_system_v1/` remains untracked and needs an explicit decision.

### 2026-06-23: Current viewable version is local Vite until deployment is configured

Decision: Treat the current viewable project as a local Vite app, not a hosted deployment.

Why: No Vercel, Netlify, GitHub Pages, or other static deployment has been configured yet.

Impact:

- This remains a local-only preview decision.
- The active preview convention was superseded on 2026-06-24: use
  `npm run dev -- --host 127.0.0.1 --port 4187` and open
  `http://127.0.0.1:4187/`.
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

### 2026-06-23: Extend the safe terminal for Level 3 before Git

Decision: Add Level 3 reading-and-writing-file lessons plus safe simulated support for `head`, `tail`, `grep`, `rg`, `wc`, one pipe, and `>` / `>>` redirects.

Why: Level 3 depends on inspecting file contents, writing text, searching files, counting results, and combining small commands before learners are ready for Git.

Impact:

- `src/content/level3Lessons.ts` owns the Level 3 lesson content.
- `src/terminal/parser.ts` now parses quoted strings plus one pipe and one redirect.
- `src/terminal/commands.ts` handles command output flow for pipe and redirect scenarios.
- `src/terminal/validation.ts` can validate latest command output through `expectedOutput`.
- This is still not a real shell. Multi-stage pipes, advanced regex, Git, Codex CLI, curl, backend APIs, and host file access remain out of scope.

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
- Progress sync data model.
- Whether local/MVP email auth disables email confirmation.
- Whether Supabase email auth or the Level 8 Codex teaser comes next.
- Whether the next curriculum slice is Level 7 or an MVP account/sync phase.

## How To Add A Decision

Use this format:

```md
### YYYY-MM-DD: Short decision title

Decision: What was chosen.

Why: The reason for the choice.

Alternatives considered: Other options, if useful.

Impact: What future sessions should know because of this choice.
```

# Project State

Last updated: 2026-06-25

This is the single source of truth for current operational context. Keep it
short. Use source code and Git for discoverable implementation details, the
decision log for durable rationale, and the build guide only for product-level
direction.

## Snapshot

zero2codex is a Vite, React, and TypeScript learning app with a public
content-driven course map covering 17 levels and 151 planned lessons. Levels 1
through 6 are playable.

The app currently includes a Zod-backed lesson system, a browser-safe virtual
terminal and filesystem, a browser-safe Git simulator, an offline mock HTTP
router with simulated `curl`, and local progress persistence through
`localStorage`.

Supabase, accounts, authenticated progress sync, achievements, real shell
execution, live HTTP/API calls, and Codex CLI execution are not implemented.
Login and registration routes are placeholders. Google OAuth remains
postponed.

## Active Work

Branch: `codex/course-map-ui-refresh`

Current objective: finish and verify the course-map UI refresh while preserving
original zero2codex branding, content, colors, and source code.

The current working tree includes:

- A dense collapsible list layout with progress and resume behavior.
- A persistent `Cards` / `List` layout switch.
- A responsive card layout from four columns down to one.
- Original one-line subtitles for all 151 lessons.
- Content validation requiring every course-map lesson subtitle.
- Updated end-to-end coverage for course-map layouts and persistence.

Treat all existing working-tree changes as belonging to this active slice.
Inspect `git status --short` rather than maintaining a duplicate file list here.

## Verification Status

Passed during the current UI slice:

- `npm run typecheck`
- `npm run lint`
- `npm run test` with 101 tests
- `npm run validate:content`
- `npm run build`
- `node --check tests/e2e/course-map.spec.mjs`
- `git diff --check`

Still required after the latest Cards/List changes:

- Rendered desktop and mobile QA of the Cards layout.
- Console-health check in the live preview.
- Full `npm run test:integration`.

The production build has an existing non-blocking Vite chunk-size warning.
The previous session also encountered an in-app browser localhost policy error
while attempting rendered QA.

## Next Exact Action

1. Confirm or restart the preview at `http://127.0.0.1:4187/` with:

   ```sh
   npm run dev -- --host 127.0.0.1 --port 4187
   ```

2. Open the course map, switch to `Cards`, and verify desktop and mobile
   layout, interaction, persistence, and console health.
3. Adjust CSS only if rendered comparison reveals a problem.
4. Run `npm run test:integration`, then rerun relevant static checks.
5. Decide whether `design-qa.md` should remain a committed artifact.

## Current Constraints

- Preserve all playable Level 1 through 6 behavior and tests.
- Keep simulations browser-only and offline.
- Do not copy zero2claude text, assets, visuals, or implementation.
- Use official OpenAI documentation when adding Codex-specific teaching
  material.
- Keep content data separate from UI components.

## Near-Term Roadmap

After this UI slice:

1. Add Supabase email/password authentication.
2. Add authenticated progress sync while preserving the local fallback.
3. Add the first Codex teaser lessons.
4. Add starter achievements.
5. Continue Level 7 package-manager and project-setup concepts.

Open choices include the Supabase project, email-confirmation behavior, the
progress-sync data model, and whether account work or Level 7 comes first.

## Reference Map

- `README.md`: setup and implemented subsystem architecture.
- `docs/ZERO2CODEX_BUILD_GUIDE.html`: long-term product and curriculum
  blueprint; read only when changing direction.
- `docs/DECISIONS.md`: durable historical reasoning; search by topic.
- `docs/LEVEL*_HANDOFF.md`: focused subsystem history.
- `docs/PROJECT_MEMORY.md`, `docs/HANDOFF.md`, and `docs/NEXT_STEPS.md`: legacy
  snapshots retained for history, not startup reading.

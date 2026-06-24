# Next Steps

Last updated: 2026-06-24

## Now

1. Keep the live project preview available.
   - Use `http://127.0.0.1:4187/`.
   - Keep the in-app browser tab visible.
   - Reload and test the affected workflow after frontend changes.

2. Decide the MVP account sequence.
   - Select the Supabase project.
   - Decide whether email confirmation is required for the local/MVP preview.
   - Add email/password registration and login before progress sync.

3. Add authenticated progress sync.
   - Preserve the localStorage fallback.
   - Migrate anonymous progress after signup or login.

## Next

4. Create a hosted preview.
   - The current preview is local only.
   - Record any deployed URL in `README.md` and `docs/HANDOFF.md`.

5. Add the first Codex teaser lessons.
   - Use current official OpenAI documentation.
   - Keep simulated and real Codex actions clearly distinguished.

## Later

- Add starter achievements.
- Build Levels 6 and 7.
- Expand Level 8 and advanced Codex workflows.
- Add review mode, dashboard, notes, community, analytics, and admin features
  only after the core learning loop is validated.

## Completed

- Course shell, routes, visual tokens, and 17-level course map.
- Local progress persistence.
- Complete playable Level 1.
- Complete playable Level 2.
- Complete playable Level 3.
- Browser-safe terminal and virtual filesystem.
- Browser-safe Git simulator.
- Complete playable Level 4 and Full Git Workflow Challenge.
- Complete playable Level 5 with 14 browser-safe software-system lessons.
- Reusable conceptual interaction schema, renderers, and pure validation.
- Unit, content, build, accessibility-oriented, responsive, and Playwright
  verification for the current learning path.

## Verification Commands

```sh
npm run typecheck
npm run lint
npm run test
npm run test:integration
npm run validate:content
npm run build
```

## Suggested Next Goal Prompt

```text
Read README.md, AGENTS.md, docs/HANDOFF.md, docs/DECISIONS.md,
docs/NEXT_STEPS.md, the build guide, and the Level 5 handoff. Confirm the live
preview is running at http://127.0.0.1:4187/. Then implement Supabase
email/password authentication while preserving anonymous local progress for
future migration. Keep Google OAuth postponed.
```

## Watch Outs

- Do not replace browser-safe simulations with real network or device access.
- Do not copy zero2claude text, assets, or implementation.
- Do not introduce real shell, GitHub, backend, or learner-device access into
  browser simulations.
- Google OAuth remains postponed.
- The installed `jack-html-generator` skill requires a Codex restart before it
  becomes available to a new session.

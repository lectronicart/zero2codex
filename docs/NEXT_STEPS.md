# Next Steps

Last updated: 2026-06-24

## Now

1. Review and preserve the current implementation.
   - Run `git diff --check`.
   - Review the Level 1 and Level 4 changes.
   - Decide whether to include
     `docs/lectronicart_project_operating_system_v1/`.
   - Stage and commit the approved work.

2. Keep the live project preview available.
   - Use `http://127.0.0.1:4187/`.
   - Keep the in-app browser tab visible.
   - Reload and test the affected workflow after frontend changes.

3. Implement Level 5, "How Software Actually Works."
   - Build all 14 lessons.
   - Use browser-safe conceptual interactions.
   - Do not add real servers, APIs, databases, DNS changes, or device access.
   - Prepare learners for Level 6 HTTP practice.

## Next

4. Decide the MVP account sequence.
   - Select the Supabase project.
   - Decide whether email confirmation is required for the local/MVP preview.
   - Add email/password registration and login before progress sync.

5. Add authenticated progress sync.
   - Preserve the localStorage fallback.
   - Migrate anonymous progress after signup or login.

6. Create a hosted preview.
   - The current preview is local only.
   - Record any deployed URL in `README.md` and `docs/HANDOFF.md`.

7. Add the first Codex teaser lessons.
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
docs/NEXT_STEPS.md, the build guide, and the Level 4 handoff. Confirm the live
preview is running at http://127.0.0.1:4187/. Then implement all 14 Level 5
lessons using original, beginner-safe, browser-only conceptual interactions.
Preserve Levels 1 through 4 and run the complete verification suite.
```

## Watch Outs

- The worktree currently contains uncommitted Level 1 and Level 4 work.
- Do not discard the untracked lesson, Git, foundation, test, or handoff files.
- Do not copy zero2claude text, assets, or implementation.
- Do not introduce real shell, GitHub, backend, or learner-device access into
  browser simulations.
- Google OAuth remains postponed.
- The installed `jack-html-generator` skill requires a Codex restart before it
  becomes available to a new session.

# Next Steps

> Legacy snapshot. Use `docs/STATE.md` for the current ordered work and
> near-term roadmap.

Last updated: 2026-06-25

## Now

1. Finish course-map card-view QA.
   - Restore rendered access to `http://127.0.0.1:4187/` in the in-app browser.
   - Switch to `Cards` and compare the implementation against the supplied
     screenshot at desktop and mobile sizes.
   - Fix any remaining spacing, clipping, or card-height issues only after
     rendered comparison.

2. Decide whether to keep `design-qa.md`.
   - Keep it if the repo should preserve design-audit evidence.
   - Remove or replace it if it was only a temporary working artifact.

3. Keep the live project preview available.
   - Use `http://127.0.0.1:4187/`.
   - Keep the in-app browser tab visible.
   - Reload and test the affected workflow after frontend changes.

4. Decide the MVP account sequence.
   - Select the Supabase project.
   - Decide whether email confirmation is required for the local/MVP preview.
   - Add email/password registration and login before progress sync.

5. Add authenticated progress sync.
   - Preserve the localStorage fallback.
   - Migrate anonymous progress after signup or login.

## Next

6. Re-run full integration coverage after the course-map UI slice settles.
   - Run `npm run test:integration`.
   - Confirm the new Cards/List behaviors are covered and passing end to end.

7. Create a hosted preview.
   - The current preview is local only.
   - Record any deployed URL in `README.md` and `docs/HANDOFF.md`.

8. Add the first Codex teaser lessons.
   - Use current official OpenAI documentation.
   - Keep simulated and real Codex actions clearly distinguished.

## Later

- Add starter achievements.
- Build Level 7.
- Expand Level 8 and advanced Codex workflows.
- Add review mode, dashboard, notes, community, analytics, and admin features
  only after the core learning loop is validated.

## Completed

- Course-map UI redesign into one dense collapsible level stack.
- Responsive Cards/List course-map layout switch.
- Original one-line explanations for all 151 course-map lessons.
- Course shell, routes, visual tokens, and 17-level course map.
- Local progress persistence.
- Complete playable Level 1.
- Complete playable Level 2.
- Complete playable Level 3.
- Browser-safe terminal and virtual filesystem.
- Browser-safe Git simulator.
- Complete playable Level 4 and Full Git Workflow Challenge.
- Complete playable Level 5 with 14 browser-safe software-system lessons.
- Complete playable Level 6 with 12 offline HTTP/API lessons.
- Browser-safe mock HTTP router, simulated curl, and structured HTTP lesson
  validation.
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

Superseded. New sessions should read `docs/STATE.md` and follow its
`Next Exact Action` section.

## Watch Outs

- Do not replace browser-safe simulations with real network or device access.
- Do not copy zero2claude text, assets, or implementation.
- Do not introduce real shell, GitHub, backend, or learner-device access into
  browser simulations.
- Google OAuth remains postponed.
- The current unfinished blocker is rendered card-view QA, not content or
  simulator behavior.
- The installed `jack-html-generator` skill requires a Codex restart before it
  becomes available to a new session.

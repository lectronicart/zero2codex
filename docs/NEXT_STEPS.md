# Next Steps

Last updated: 2026-06-23

This is the practical starter backlog. The project direction is defined in `docs/ZERO2CODEX_BUILD_GUIDE.html`: build zero2codex, a Codex-focused version of the zero2claude-style beginner course.

## Current Task List

1. Write playable Level 1 lessons. `recommended next Goal Mode task`
   - Use the existing lesson schema and lesson runner.
   - Every Level 1 lesson needs at least one active interaction.
   - Keep copy original, concrete, and beginner-friendly.
   - Re-run the full verification set.

2. Plan Supabase email auth. `not started`
   - Google OAuth remains postponed.
   - Decide whether local/MVP preview should disable email confirmation.
   - Add `.env.example` only when Supabase variables are actually needed.

3. Implement email account creation and sign-in. `not started`
   - Add Supabase client setup.
   - Build `/register`, `/login`, and logout.
   - Keep the course map public.
   - Protect lesson routes only once progress sync is ready.

4. Add authenticated progress sync. `not started`
   - Local progress exists now.
   - Authenticated Supabase sync comes second.
   - Migrate anonymous progress after signup/login.

5. Add starter achievements. `not started`
   - First Command.
   - Path Finder.
   - Level 2 Complete.

6. Add Codex teaser lessons. `not started`
   - Use official OpenAI docs for Codex-specific claims.
   - Keep simulations honest and clearly labeled.

7. Extend terminal later. `not started`
   - Add grep, rg, wc, pipes, and redirects only when Level 3 needs them.
   - Do not execute real shell commands in the browser.

8. Update project memory after each implementation slice. `ongoing`
   - Add major choices to `docs/DECISIONS.md`.
   - Update current facts in `docs/PROJECT_MEMORY.md`.
   - Add a fresh summary to `docs/HANDOFF.md`.

## Current Verification Commands

Run these before handoff when dependencies are installed:

```sh
npm run typecheck
npm run lint
npm run test
npm run validate:content
npm run build
```

## Good First AI Prompt

Use a prompt like this when returning to the project:

```text
Read the docs folder first. Then write the complete Level 1 playable lesson set using the existing lesson schema and lesson runner. Keep content original and beginner-friendly, add active interactions to every lesson, and run npm run typecheck, npm run lint, npm run test, npm run validate:content, and npm run build.
```

## Watch Outs

- Do not copy zero2claude text, assets, or code into zero2codex.
- Do not let future sessions ignore the build guide.
- Do not add Google OAuth until production OAuth setup is ready.
- Do not skip beginner-friendly documentation.
- Do not turn placeholder routes into fake working auth.
- Keep memory files short enough that future sessions will actually read them.

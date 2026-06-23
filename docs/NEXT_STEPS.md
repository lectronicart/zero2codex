# Next Steps

Last updated: 2026-06-23

This is the practical starter backlog. The project direction is defined in `docs/ZERO2CODEX_BUILD_GUIDE.html`: build zero2codex, a Codex-focused version of the zero2claude-style beginner course.

## Current Task List

1. Resolve GitHub remote history and push. `next exact action`
   - Local `main` has commit `63b2984`.
   - `origin/main` has a separate initial README commit `76cf894`.
   - Merge with `--allow-unrelated-histories`.
   - Keep the richer local README while preserving the remote short description in substance.
   - Run the full verification set.
   - Push `main` to `origin`.

2. Create a viewable hosted preview. `not started`
   - The project is viewable locally with `npm run dev -- --host 127.0.0.1`.
   - No deployed URL exists yet.
   - Choose Vercel, Netlify, GitHub Pages, or another static host after GitHub push is resolved.

3. Write playable Level 1 lessons. `recommended next Goal Mode task`
   - Use the existing lesson schema and lesson runner.
   - Every Level 1 lesson needs at least one active interaction.
   - Keep copy original, concrete, and beginner-friendly.
   - Re-run the full verification set.

4. Plan Supabase email auth. `not started`
   - Google OAuth remains postponed.
   - Decide whether local/MVP preview should disable email confirmation.
   - Add `.env.example` only when Supabase variables are actually needed.

5. Implement email account creation and sign-in. `not started`
   - Add Supabase client setup.
   - Build `/register`, `/login`, and logout.
   - Keep the course map public.
   - Protect lesson routes only once progress sync is ready.

6. Add authenticated progress sync. `not started`
   - Local progress exists now.
   - Authenticated Supabase sync comes second.
   - Migrate anonymous progress after signup/login.

7. Add starter achievements. `not started`
   - First Command.
   - Path Finder.
   - Level 2 Complete.

8. Add Codex teaser lessons. `not started`
   - Use official OpenAI docs for Codex-specific claims.
   - Keep simulations honest and clearly labeled.

9. Extend terminal later. `not started`
   - Add grep, rg, wc, pipes, and redirects only when Level 3 needs them.
   - Do not execute real shell commands in the browser.

10. Update project memory after each implementation slice. `ongoing`
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

## Current Viewable Version

Local only:

```sh
npm run dev -- --host 127.0.0.1
```

Then open:

```text
http://127.0.0.1:5173/
```

No deployed URL exists yet.

## Watch Outs

- Do not copy zero2claude text, assets, or code into zero2codex.
- Do not let future sessions ignore the build guide.
- Do not add Google OAuth until production OAuth setup is ready.
- Do not skip beginner-friendly documentation.
- Do not turn placeholder routes into fake working auth.
- Keep memory files short enough that future sessions will actually read them.

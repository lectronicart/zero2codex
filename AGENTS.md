# zero2codex Agent Instructions

## Start Here

Before editing, read:

1. `README.md`
2. `docs/ZERO2CODEX_BUILD_GUIDE.html`
3. `docs/PROJECT_MEMORY.md`
4. `docs/HANDOFF.md`
5. `docs/DECISIONS.md`
6. `docs/NEXT_STEPS.md`

Then run:

```sh
rg --files --hidden -g '!.git'
git status --short
```

## Current Implementation Boundary

The current app includes the scaffold plus the playable Level 2 terminal slice:

- Route shell.
- Design tokens.
- Static content-driven 17-level course map.
- Zod-backed playable lesson schema.
- Complete Level 2 terminal-learning lessons.
- Browser-safe virtual terminal simulator.
- Local progress persistence through `localStorage`.
- Placeholder login/register routes and planned-lesson fallback routes.

Do not assume Supabase, email auth, Google OAuth, authenticated progress sync,
achievements, real shell execution, Git simulation, Codex CLI simulation, or
backend APIs exist until files for those systems are added.

## Product Rules

- Keep zero2codex original in branding, copy, visuals, and source code.
- Use zero2claude only as product-quality and mechanics inspiration.
- Do not copy zero2claude text, assets, or implementation.
- Teach OpenAI Codex using official OpenAI docs as source material.
- Keep the course beginner-friendly and practical.

## Engineering Rules

- Prefer small, reviewable slices.
- Keep content data separate from UI components.
- Keep `src/content/course.ts` as the source of truth for the course map until a
  lesson content system exists.
- Add tests or validators when adding behavior that can regress.
- Run `npm run typecheck`, `npm run lint`, and `npm run build` before handoff
  when dependencies are installed.

## Near-Term Roadmap

1. Add Level 1 playable lessons.
2. Add Supabase email/password auth.
3. Add authenticated progress sync.
4. Add the first Codex teaser lessons.
5. Add starter achievements.
6. Extend terminal commands for Level 3 when needed.

Google OAuth remains postponed.

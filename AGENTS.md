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

The current app includes the scaffold plus playable Levels 1 through 5:

- Route shell.
- Design tokens.
- Static content-driven 17-level course map.
- Zod-backed playable lesson schema.
- Complete Level 2 terminal-learning lessons.
- Complete Level 3 reading-and-writing-files lessons.
- Complete Level 4 Git lessons.
- Complete Level 5 software-systems concept lessons.
- Browser-safe virtual terminal simulator.
- Browser-safe Git simulator layered on the virtual file system.
- Local progress persistence through `localStorage`.
- Placeholder login/register routes and planned-lesson fallback routes.

Do not assume Supabase, email auth, Google OAuth, authenticated progress sync,
achievements, real shell execution, Codex CLI simulation, or backend APIs exist
until files for those systems are added.

The virtual terminal currently supports `pwd`, `ls`, `cd`, `mkdir`, `touch`,
`rm`, `cp`, `mv`, `cat`, `head`, `tail`, `echo`, `grep`, `rg`, `wc`, `clear`,
`git`, and `help`, plus one pipe and basic `>` / `>>` redirects.

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

## Live Preview Rule

- Keep a working development build open in a visible in-app browser tab while
  implementing changes.
- Use `http://127.0.0.1:4187/` unless that port is unavailable.
- After frontend changes, reload the live tab and verify the affected workflow,
  console health, and responsive layout before handoff.
- Do not close the live preview tab or stop its development server unless the
  user asks or the server must be restarted.

## Near-Term Roadmap

1. Add Supabase email/password auth.
2. Add authenticated progress sync.
3. Add the first Codex teaser lessons.
4. Add starter achievements.
5. Continue with Level 6 HTTP practice.

Google OAuth remains postponed.

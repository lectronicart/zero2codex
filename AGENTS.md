# zero2codex Agent Instructions

## Start Here

Before editing:

1. Read `docs/STATE.md`.
2. Run:

```sh
git status --short
```

Read other documents only when the task needs them:

- Repository map: use `rg --files --hidden -g '!.git'` only when needed.
- Setup or existing architecture: relevant sections of `README.md`.
- Product, curriculum, or major architecture direction:
  `docs/ZERO2CODEX_BUILD_GUIDE.html`.
- Historical rationale: search `docs/DECISIONS.md` for the relevant topic.
- A specific implemented subsystem: its focused handoff file in `docs/`.

Do not read every file in `docs/` by default.

## Memory Maintenance

- `docs/STATE.md` is the only current operational memory.
- Keep it under 900 words and update it at handoff when the active objective,
  boundaries, blockers, verification state, or next action changes.
- Do not duplicate details that are quickly discoverable from source code or
  `git status`.
- Add to `docs/DECISIONS.md` only for durable choices whose reasoning will
  matter later.
- `docs/PROJECT_MEMORY.md`, `docs/HANDOFF.md`, and `docs/NEXT_STEPS.md` are
  legacy snapshots. They are not required startup reading.

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
- Run the relevant checks listed in `docs/STATE.md` before handoff.

## Safety Boundary

- Preserve the browser-safe teaching simulations.
- Do not add real shell execution, learner-device file access, arbitrary
  network requests, or real GitHub/OpenAI credentials unless a future task
  explicitly changes that product boundary.
- Simulated `curl` must remain limited to fictional lesson-enabled `.test`
  endpoints until that boundary is deliberately revised.

## Live Preview Rule

- Keep a working development build open in a visible in-app browser tab while
  implementing changes.
- Use `http://127.0.0.1:4187/` unless that port is unavailable.
- After frontend changes, reload the live tab and verify the affected workflow,
  console health, and responsive layout before handoff.
- Do not close the live preview tab or stop its development server unless the
  user asks or the server must be restarted.

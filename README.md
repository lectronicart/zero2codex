# zero2codex

zero2codex is a free, gamified beginner course for learning terminal basics,
coding fundamentals, and OpenAI Codex workflows through an interactive course
map, safe browser-based terminal lessons, local progress, and original
beginner-friendly content.

The project is inspired by the product mechanics of `zero2claude.dev`, but the
branding, content, visuals, and implementation must stay original.

## Current Status

This repo is in the first MVP scaffold phase.

Implemented now:

- Vite + React + TypeScript app scaffold.
- React Router route shell.
- Tailwind CSS Vite integration plus custom CSS design tokens.
- Public course map driven by `src/content/course.ts`.
- Full 17-level, 151-lesson outline from the build guide.
- Playable Level 2 terminal-learning path with 13 lessons.
- Browser-safe virtual terminal with an in-memory file system.
- Local progress storage for lesson completion and resume state.
- Placeholder routes for `/login` and `/register`.

Not implemented yet:

- Supabase.
- Email/password account creation.
- Google OAuth.
- Protected routes.
- Progress sync.
- Achievements.

## Product Blueprint

Read the full build guide before changing the product direction:

```text
docs/ZERO2CODEX_BUILD_GUIDE.html
```

Also read the project memory files in `docs/` before starting a new coding
session.

## Setup

Install dependencies:

```sh
npm install
```

Start the local dev server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Run static checks:

```sh
npm run typecheck
npm run lint
npm run test
npm run validate:content
```

## MVP Direction

The first playable MVP should include:

- The public course map.
- Email/password account creation and login through Supabase Auth.
- Authenticated progress sync on top of the current local progress fallback.
- Level 1 complete and three Level 8 Codex teaser lessons.
- Starter achievements.

Google OAuth is intentionally postponed until production OAuth branding and
redirect setup are ready.

## Originality Rules

- Do not copy zero2claude lesson text, source code, assets, or visual details.
- Do match the quality bar: clear progression, account-backed progress,
  gamified learning, terminal-native design, and beginner-friendly lessons.
- Use official OpenAI docs as the source for Codex-specific behavior.

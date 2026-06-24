# Level 4 Git Implementation Handoff

Last updated: 2026-06-24

## Architecture

Level 4 layers a browser-safe Git model on the existing virtual filesystem.
The virtual filesystem is the working directory. Git separately stores an
index snapshot, immutable commit snapshots, branch pointers, current branch,
mocked remotes, and guided conflict state.

Git domain logic is framework-free:

- `src/git/types.ts`: serializable domain types.
- `src/git/simulator.ts`: commands, snapshots, status, diffs, history,
  branching, merging, recovery, and mocked remotes.
- `src/git/validation.ts`: lesson-state validation.
- `src/terminal/state.ts`: routes parsed `git` commands into the simulator.
- `src/components/TerminalPanel.tsx`: terminal UI plus a compact Git state
  strip.

## Supported Commands

The simulator supports `git init`, `status`, `add`, `commit`, `log`, `diff`,
`branch`, `switch`, `checkout`, `merge`, `restore`, `remote add`, `remote -v`,
`push`, `pull`, and `clone`.

All operations remain in memory. No real Git process, local repository,
GitHub account, network request, backend, or arbitrary execution is used.

## Lesson System

`src/content/level4Lessons.ts` contains all 17 lessons and the Full Git
Workflow Challenge.

The existing `terminalStep` section gained:

- `setupCommands`: deterministic hidden setup that is rebuilt on reset.
- `expectedGit`: assertions for initialization, branch, commits, messages,
  status paths, clean state, snapshots, diffs, remotes, conflicts, and pushed
  branches.

The final challenge validates the complete repository result rather than only
the typed commands.

## Test Coverage

- `tests/git-simulator.test.mjs`: every required Git command, status states,
  duplicate init, commits, diffs, branches, switch blocking, fast-forward and
  three-way merge, guided conflicts, restore, remote setup, push, pull, clone,
  and lesson reset.
- `tests/terminal-step.test.mjs`: Git-aware lesson validation.
- `tests/lesson-flow.test.mjs`: all 17 lessons, every terminal solution,
  add/commit, branch/merge, and final challenge.
- `tests/progress.test.mjs`: Level 4 local progress persistence.
- `tests/e2e/level-four.spec.mjs`: rendered workflows, hints, recovery,
  keyboard submission, mobile layout, completion, and Level 5 routing.

## Accessibility

The terminal remains keyboard-operable through its labeled input and form
submission. Git state is exposed as text with an ARIA label, and success,
working, staged, remote, and conflict state never depend on color alone.

## Intentional Limitations

- No real Git or GitHub access.
- No authentication, OAuth, pull requests, or hosted publishing.
- Clone uses built-in repository presets only.
- Pull supports clean fast-forward cases and stops on divergent history.
- Branch switching blocks any uncommitted or untracked work so beginner
  exercises cannot lose files.
- Conflicts receive guided feedback but no full resolution editor.
- No `.gitignore` rules, rebase, stash, cherry-pick, tags, hooks, LFS, or
  advanced Git flags.
- Empty folders are not stored in commit snapshots.

## Recommended Next Goal Mode Task

Implement Level 5, "How Software Actually Works," with browser-safe
interactive models for code, websites, client/server, HTTP, APIs, JSON,
databases, frontend/backend, cloud, deployment, DNS, and domains. Keep account
and backend work separate unless the product roadmap is intentionally changed.

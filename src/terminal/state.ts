import { resolvePath } from "./path.ts";
import { executeCommand } from "./commands.ts";
import { parseCommand } from "./parser.ts";
import { createFileSystem } from "./vfs.ts";
import { createGitState, executeGitCommand } from "../git/simulator.ts";
import type {
  FileTreeInput,
  TerminalOutputEntry,
  TerminalSessionState,
} from "./types.ts";

let entryId = 0;

export type TerminalSessionConfig = {
  initialFileSystem?: Record<string, FileTreeInput>;
  startingDirectory?: string;
  welcomeMessage?: string;
  setupCommands?: string[];
};

export function createTerminalSession({
  initialFileSystem = {},
  startingDirectory = "/home/codex",
  welcomeMessage = "Safe terminal ready. Type help if you get stuck.",
  setupCommands = [],
}: TerminalSessionConfig = {}): TerminalSessionState {
  const fileSystem = createFileSystem(initialFileSystem);
  const currentDirectory = resolvePath(
    fileSystem.homeDirectory,
    startingDirectory,
    fileSystem.homeDirectory,
  );

  let session: TerminalSessionState = {
    fileSystem,
    gitState: createGitState(),
    currentDirectory,
    history: [],
    entries: [entry("system", welcomeMessage)],
    lastOutput: [],
  };

  for (const command of setupCommands) {
    session = runTerminalCommand(session, command);
    const lastEntry = session.entries.at(-1);
    if (lastEntry?.kind === "error") {
      throw new Error(`Terminal setup failed for "${command}": ${lastEntry.text}`);
    }
  }

  return {
    ...session,
    history: [],
    entries: [entry("system", welcomeMessage)],
    lastOutput: [],
  };
}

export function runTerminalCommand(
  state: TerminalSessionState,
  input: string,
): TerminalSessionState {
  const trimmed = input.trim();
  if (!trimmed) {
    return state;
  }

  const parsed = parseCommand(trimmed);
  const gitResult =
    parsed.ok && parsed.command === "git"
      ? parsed.pipe || parsed.redirect
        ? {
            fileSystem: state.fileSystem,
            gitState: state.gitState,
            output: [],
            error:
              "Git commands cannot use pipes or redirects in this Level 4 simulator.",
          }
        : executeGitCommand(
            state.fileSystem,
            state.currentDirectory,
            state.gitState,
            parsed.args,
          )
      : null;
  const result =
    gitResult ??
    executeCommand(state.fileSystem, state.currentDirectory, trimmed);
  const inputEntry = entry("input", trimmed, state.currentDirectory);
  const outputEntries = result.error
    ? [entry("error", result.error)]
    : result.output.map((line) => entry("output", line));

  return {
    fileSystem: result.fileSystem,
    gitState: gitResult?.gitState ?? state.gitState,
    currentDirectory:
      "currentDirectory" in result
        ? result.currentDirectory
        : state.currentDirectory,
    history: [...state.history, trimmed],
    entries:
      "clear" in result && result.clear
        ? []
        : [...state.entries, inputEntry, ...outputEntries],
    lastOutput: result.error ? [] : result.output,
  };
}

export function getHistoryCommand(
  history: string[],
  currentIndex: number | null,
  direction: "previous" | "next",
): { command: string; index: number | null } {
  if (history.length === 0) {
    return { command: "", index: null };
  }

  if (direction === "previous") {
    const nextIndex =
      currentIndex === null
        ? history.length - 1
        : Math.max(0, currentIndex - 1);
    return { command: history[nextIndex], index: nextIndex };
  }

  if (currentIndex === null) {
    return { command: "", index: null };
  }

  const nextIndex = currentIndex + 1;
  if (nextIndex >= history.length) {
    return { command: "", index: null };
  }

  return { command: history[nextIndex], index: nextIndex };
}

function entry(
  kind: TerminalOutputEntry["kind"],
  text: string,
  prompt?: string,
): TerminalOutputEntry {
  entryId += 1;
  return {
    id: `${Date.now()}-${entryId}`,
    kind,
    text,
    prompt,
  };
}

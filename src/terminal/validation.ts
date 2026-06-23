import { resolvePath } from "./path.ts";
import { getNode } from "./vfs.ts";
import type { TerminalSessionState } from "./types.ts";

export type CommandExpectation =
  | string
  | {
      pattern: string;
    };

export type FileSystemExpectation = {
  exists?: Array<{
    path: string;
    type?: "file" | "directory";
    content?: string;
  }>;
  absent?: string[];
};

export type TerminalStepValidationInput = {
  expectedCommands?: CommandExpectation[];
  expectedCurrentDirectory?: string;
  expectedFileSystem?: FileSystemExpectation;
  successMessage: string;
  failureFeedback: string;
};

export type TerminalStepValidationResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

export function validateTerminalStep(
  step: TerminalStepValidationInput,
  state: TerminalSessionState,
): TerminalStepValidationResult {
  if (!commandsMatch(step.expectedCommands ?? [], state.history)) {
    return { ok: false, message: step.failureFeedback };
  }

  if (step.expectedCurrentDirectory) {
    const expected = resolvePath(
      state.fileSystem.homeDirectory,
      step.expectedCurrentDirectory,
      state.fileSystem.homeDirectory,
    );

    if (state.currentDirectory !== expected) {
      return { ok: false, message: step.failureFeedback };
    }
  }

  const fsResult = validateFileSystem(step.expectedFileSystem, state);
  if (!fsResult.ok) {
    return { ok: false, message: fsResult.message || step.failureFeedback };
  }

  return { ok: true, message: step.successMessage };
}

function commandsMatch(expected: CommandExpectation[], history: string[]) {
  let historyIndex = 0;

  for (const expectation of expected) {
    let matched = false;

    while (historyIndex < history.length) {
      const command = history[historyIndex];
      historyIndex += 1;

      if (matchesCommand(expectation, command)) {
        matched = true;
        break;
      }
    }

    if (!matched) {
      return false;
    }
  }

  return true;
}

function matchesCommand(expectation: CommandExpectation, command: string) {
  const normalized = command.trim().replace(/\s+/g, " ");

  if (typeof expectation === "string") {
    return normalized === expectation.trim().replace(/\s+/g, " ");
  }

  return new RegExp(expectation.pattern).test(normalized);
}

function validateFileSystem(
  expected: FileSystemExpectation | undefined,
  state: TerminalSessionState,
): { ok: true } | { ok: false; message?: string } {
  if (!expected) {
    return { ok: true };
  }

  for (const item of expected.exists ?? []) {
    const path = resolvePath(
      state.fileSystem.homeDirectory,
      item.path,
      state.fileSystem.homeDirectory,
    );
    const node = getNode(state.fileSystem, path);

    if (!node) {
      return { ok: false, message: `${path} is not there yet.` };
    }

    if (item.type && node.type !== item.type) {
      return { ok: false, message: `${path} exists, but it is not a ${item.type}.` };
    }

    if (item.content !== undefined) {
      if (node.type !== "file" || node.content !== item.content) {
        return { ok: false, message: `${path} does not contain the expected text yet.` };
      }
    }
  }

  for (const pathInput of expected.absent ?? []) {
    const path = resolvePath(
      state.fileSystem.homeDirectory,
      pathInput,
      state.fileSystem.homeDirectory,
    );

    if (getNode(state.fileSystem, path)) {
      return { ok: false, message: `${path} is still there.` };
    }
  }

  return { ok: true };
}

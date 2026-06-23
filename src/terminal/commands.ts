import { resolvePath } from "./path.ts";
import { parseCommand } from "./parser.ts";
import {
  copyAt,
  createDirectoryAt,
  getDirectory,
  getNode,
  listDirectory,
  moveAt,
  readFileAt,
  removeAt,
  touchFileAt,
} from "./vfs.ts";
import type { CommandResult, VirtualFileSystem } from "./types.ts";

const helpText = [
  "Supported commands: pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, echo, clear, help.",
  "Paths can be relative, absolute with /, parent folders with .., or home with ~.",
  "This is a browser-safe simulator. It never runs commands on your computer.",
];

export function executeCommand(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  rawInput: string,
): CommandResult {
  const parsed = parseCommand(rawInput);

  if (!parsed.ok) {
    return failure(fileSystem, currentDirectory, parsed.error);
  }

  const { command, args } = parsed;

  if (!command) {
    return success(fileSystem, currentDirectory, []);
  }

  try {
    switch (command) {
      case "pwd":
        requireArgCount(command, args, 0);
        return success(fileSystem, currentDirectory, [currentDirectory]);

      case "ls": {
        requireMaxArgs(command, args, 1);
        const target = resolvePath(
          currentDirectory,
          args[0] ?? ".",
          fileSystem.homeDirectory,
        );
        return success(fileSystem, currentDirectory, [listDirectory(fileSystem, target).join("  ")]);
      }

      case "cd": {
        requireMaxArgs(command, args, 1);
        const target = resolvePath(
          currentDirectory,
          args[0] ?? "~",
          fileSystem.homeDirectory,
        );
        const node = getNode(fileSystem, target);
        if (!node) {
          throw new Error(`${target} does not exist yet.`);
        }
        if (node.type !== "directory") {
          throw new Error(`${target} is a file, not a folder you can cd into.`);
        }
        return success(fileSystem, target, []);
      }

      case "mkdir": {
        requireAtLeastArgs(command, args, 1);
        let next = fileSystem;
        for (const path of args) {
          next = createDirectoryAt(next, currentDirectory, path);
        }
        return success(next, currentDirectory, []);
      }

      case "touch": {
        requireAtLeastArgs(command, args, 1);
        let next = fileSystem;
        for (const path of args) {
          next = touchFileAt(next, currentDirectory, path);
        }
        return success(next, currentDirectory, []);
      }

      case "rm": {
        const recursive = args.includes("-r") || args.includes("-rf") || args.includes("-fr");
        const targets = args.filter((arg) => !arg.startsWith("-"));
        const unsupported = args.find(
          (arg) => arg.startsWith("-") && !["-r", "-rf", "-fr"].includes(arg),
        );
        if (unsupported) {
          throw new Error(`rm does not support ${unsupported} in this lesson.`);
        }
        requireAtLeastArgs(command, targets, 1);
        let next = fileSystem;
        for (const path of targets) {
          next = removeAt(next, currentDirectory, path, recursive);
        }
        return success(next, currentDirectory, []);
      }

      case "cp": {
        requireArgCount(command, args, 2);
        return success(copyAt(fileSystem, currentDirectory, args[0], args[1]), currentDirectory, []);
      }

      case "mv": {
        requireArgCount(command, args, 2);
        const next = moveAt(fileSystem, currentDirectory, args[0], args[1]);
        const movedCurrent = getDirectory(next, currentDirectory)
          ? currentDirectory
          : fileSystem.homeDirectory;
        return success(next, movedCurrent, []);
      }

      case "cat": {
        requireAtLeastArgs(command, args, 1);
        return success(
          fileSystem,
          currentDirectory,
          args.map((path) => readFileAt(fileSystem, currentDirectory, path)),
        );
      }

      case "echo":
        return success(fileSystem, currentDirectory, [args.join(" ")]);

      case "clear":
        requireArgCount(command, args, 0);
        return {
          fileSystem,
          currentDirectory,
          output: [],
          clear: true,
        };

      case "help":
        requireArgCount(command, args, 0);
        return success(fileSystem, currentDirectory, helpText);

      default:
        return failure(
          fileSystem,
          currentDirectory,
          `${command} is not supported here. Type help to see the safe commands.`,
        );
    }
  } catch (error) {
    return failure(
      fileSystem,
      currentDirectory,
      error instanceof Error ? error.message : "That command could not run.",
    );
  }
}

function success(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  output: string[],
): CommandResult {
  return { fileSystem, currentDirectory, output };
}

function failure(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  error: string,
): CommandResult {
  return { fileSystem, currentDirectory, output: [], error };
}

function requireArgCount(command: string, args: string[], count: number) {
  if (args.length !== count) {
    throw new Error(`${command} expects ${count} argument${count === 1 ? "" : "s"}.`);
  }
}

function requireAtLeastArgs(command: string, args: string[], count: number) {
  if (args.length < count) {
    throw new Error(`${command} needs at least ${count} argument${count === 1 ? "" : "s"}.`);
  }
}

function requireMaxArgs(command: string, args: string[], count: number) {
  if (args.length > count) {
    throw new Error(`${command} expects at most ${count} argument${count === 1 ? "" : "s"}.`);
  }
}

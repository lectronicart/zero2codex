import { resolvePath } from "./path.ts";
import { parseCommand } from "./parser.ts";
import {
  collectFilesAt,
  copyAt,
  createDirectoryAt,
  getDirectory,
  getNode,
  listDirectory,
  moveAt,
  readFileAt,
  removeAt,
  touchFileAt,
  writeFileAt,
} from "./vfs.ts";
import type {
  CommandResult,
  ParsedSimpleCommand,
  VirtualFileSystem,
} from "./types.ts";

const helpText = [
  "Supported commands: pwd, ls, cd, mkdir, touch, rm, cp, mv, cat, head, tail, echo, grep, rg, wc, git, clear, help.",
  "Supported syntax: one pipe with |, overwrite with >, append with >>.",
  "Paths can be relative, absolute with /, parent folders with .., or home with ~.",
  "This is a browser-safe simulator. It never runs commands on your computer.",
];

type CommandInput = {
  fileSystem: VirtualFileSystem;
  currentDirectory: string;
  stdin?: string[];
};

export function executeCommand(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  rawInput: string,
): CommandResult {
  const parsed = parseCommand(rawInput);

  if (!parsed.ok) {
    return failure(fileSystem, currentDirectory, parsed.error);
  }

  const first = runSimpleCommand(
    { fileSystem, currentDirectory },
    {
      command: parsed.command,
      args: parsed.args,
      raw: parsed.raw,
    },
  );

  if (first.error) {
    return first;
  }

  let final = first;

  if (parsed.pipe) {
    if (final.clear) {
      return failure(final.fileSystem, final.currentDirectory, "clear cannot be piped.");
    }

    final = runSimpleCommand(
      {
        fileSystem: final.fileSystem,
        currentDirectory: final.currentDirectory,
        stdin: final.output,
      },
      parsed.pipe,
    );

    if (final.error) {
      return final;
    }
  }

  if (parsed.redirect) {
    if (final.clear) {
      return failure(final.fileSystem, final.currentDirectory, "clear cannot be redirected.");
    }

    try {
      const next = writeFileAt(
        final.fileSystem,
        final.currentDirectory,
        parsed.redirect.path,
        final.output.join("\n"),
        parsed.redirect.mode,
      );

      return success(next, final.currentDirectory, []);
    } catch (error) {
      return failure(
        final.fileSystem,
        final.currentDirectory,
        error instanceof Error ? error.message : "That redirect could not write a file.",
      );
    }
  }

  return final;
}

function runSimpleCommand(
  input: CommandInput,
  simpleCommand: ParsedSimpleCommand,
): CommandResult {
  const { fileSystem, currentDirectory, stdin } = input;
  const { command, args } = simpleCommand;

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

      case "cat":
        return success(fileSystem, currentDirectory, readCatOutput(fileSystem, currentDirectory, args, stdin));

      case "head":
        return success(fileSystem, currentDirectory, readHeadOrTailOutput(fileSystem, currentDirectory, args, stdin, "head"));

      case "tail":
        return success(fileSystem, currentDirectory, readHeadOrTailOutput(fileSystem, currentDirectory, args, stdin, "tail"));

      case "echo":
        return success(fileSystem, currentDirectory, [args.join(" ")]);

      case "grep":
        return success(fileSystem, currentDirectory, searchWithGrep(fileSystem, currentDirectory, args, stdin));

      case "rg":
        return success(fileSystem, currentDirectory, searchWithRg(fileSystem, currentDirectory, args));

      case "wc":
        return success(fileSystem, currentDirectory, countWithWc(fileSystem, currentDirectory, args, stdin));

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

function readCatOutput(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  args: string[],
  stdin?: string[],
) {
  if (args.length === 0) {
    if (stdin) {
      return stdin;
    }
    throw new Error("cat needs at least 1 file path.");
  }

  return args.flatMap((path) =>
    splitLines(readFileAt(fileSystem, currentDirectory, path)),
  );
}

function readHeadOrTailOutput(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  args: string[],
  stdin: string[] | undefined,
  mode: "head" | "tail",
) {
  let count = 10;
  let remaining = args;

  if (remaining[0] === "-n") {
    const parsedCount = Number(remaining[1]);
    if (!Number.isInteger(parsedCount) || parsedCount <= 0) {
      throw new Error(`${mode} -n needs a positive whole number.`);
    }

    count = parsedCount;
    remaining = remaining.slice(2);
  } else if (remaining[0]?.startsWith("-")) {
    throw new Error(`${mode} only supports -n <number> in this lesson.`);
  }

  if (remaining.length > 1) {
    throw new Error(`${mode} reads one file at a time in this lesson.`);
  }

  const lines =
    remaining.length === 1
      ? splitLines(readFileAt(fileSystem, currentDirectory, remaining[0]))
      : stdin;

  if (!lines) {
    throw new Error(`${mode} needs a file path, or pipe text into it.`);
  }

  return mode === "head" ? lines.slice(0, count) : lines.slice(-count);
}

function searchWithGrep(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  args: string[],
  stdin?: string[],
) {
  let recursive = false;
  let remaining = args;

  if (remaining[0] === "-r") {
    recursive = true;
    remaining = remaining.slice(1);
  } else if (remaining[0]?.startsWith("-")) {
    throw new Error("grep only supports -r in this lesson.");
  }

  const pattern = remaining[0];
  const paths = remaining.slice(1);

  if (!pattern) {
    throw new Error("grep needs the text to search for.");
  }

  if (paths.length === 0) {
    if (!stdin) {
      throw new Error("grep needs a file path, or pipe text into it.");
    }

    return searchLines(stdin, pattern);
  }

  return paths.flatMap((path) =>
    searchFiles(fileSystem, currentDirectory, path, pattern, recursive),
  );
}

function searchWithRg(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  args: string[],
) {
  if (args[0]?.startsWith("-")) {
    throw new Error("rg flags are not supported in this lesson. Try rg text folder.");
  }

  const pattern = args[0];
  const paths = args.slice(1);

  if (!pattern) {
    throw new Error("rg needs the text to search for.");
  }

  return (paths.length > 0 ? paths : ["."]).flatMap((path) =>
    searchFiles(fileSystem, currentDirectory, path, pattern, true),
  );
}

function searchFiles(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  inputPath: string,
  pattern: string,
  recursive: boolean,
) {
  const entries = collectFilesAt(fileSystem, currentDirectory, inputPath, recursive);

  return entries.flatMap((entry) =>
    splitLines(entry.content).flatMap((line, index) =>
      line.includes(pattern)
        ? [`${displayPath(entry.path, fileSystem.homeDirectory)}:${index + 1}:${line}`]
        : [],
    ),
  );
}

function searchLines(lines: string[], pattern: string) {
  return lines.filter((line) => line.includes(pattern));
}

function countWithWc(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  args: string[],
  stdin?: string[],
) {
  let remaining = args;
  let flags: string[] = [];

  while (remaining[0]?.startsWith("-")) {
    const flagText = remaining[0].slice(1);
    if (!flagText || [...flagText].some((flag) => !["l", "w", "c"].includes(flag))) {
      throw new Error("wc supports only -l, -w, and -c in this lesson.");
    }

    flags = [...flags, ...flagText];
    remaining = remaining.slice(1);
  }

  const selectedFlags = flags.length > 0 ? Array.from(new Set(flags)) : ["l", "w", "c"];

  if (remaining.length === 0) {
    if (!stdin) {
      throw new Error("wc needs a file path, or pipe text into it.");
    }

    return [formatCounts(countText(stdin.join("\n"), stdin.length), selectedFlags)];
  }

  return remaining.map((path) => {
    const content = readFileAt(fileSystem, currentDirectory, path);
    const counts = countText(content);
    return `${formatCounts(counts, selectedFlags)} ${displayPath(resolvePath(currentDirectory, path, fileSystem.homeDirectory), fileSystem.homeDirectory)}`;
  });
}

function countText(text: string, pipedLineCount?: number) {
  return {
    l: pipedLineCount ?? (text ? splitLines(text).length : 0),
    w: text.trim() ? text.trim().split(/\s+/).length : 0,
    c: text.length,
  };
}

function formatCounts(
  counts: Record<"l" | "w" | "c", number>,
  flags: string[],
) {
  return flags.map((flag) => String(counts[flag as "l" | "w" | "c"])).join(" ");
}

function splitLines(text: string) {
  return text === "" ? [] : text.split(/\r?\n/);
}

function displayPath(path: string, homeDirectory: string) {
  if (path === homeDirectory) {
    return "~";
  }

  if (path.startsWith(`${homeDirectory}/`)) {
    return path.slice(homeDirectory.length + 1);
  }

  return path;
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

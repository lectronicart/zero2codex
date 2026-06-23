const ROOT = "/";

export function normalizePath(path: string): string {
  const segments: string[] = [];

  for (const part of path.split("/")) {
    if (!part || part === ".") {
      continue;
    }

    if (part === "..") {
      segments.pop();
      continue;
    }

    segments.push(part);
  }

  return `${ROOT}${segments.join("/")}`.replace(/\/$/, "") || ROOT;
}

export function resolvePath(
  currentDirectory: string,
  inputPath = "",
  homeDirectory = "/home/codex",
): string {
  const trimmed = inputPath.trim();

  if (!trimmed || trimmed === "~") {
    return normalizePath(homeDirectory);
  }

  if (trimmed.startsWith("~/")) {
    return normalizePath(`${homeDirectory}/${trimmed.slice(2)}`);
  }

  if (trimmed.startsWith(ROOT)) {
    return normalizePath(trimmed);
  }

  return normalizePath(`${currentDirectory}/${trimmed}`);
}

export function getPathSegments(path: string): string[] {
  return normalizePath(path)
    .split("/")
    .filter(Boolean);
}

export function getParentPath(path: string): string {
  const segments = getPathSegments(path);
  segments.pop();
  return segments.length === 0 ? ROOT : `${ROOT}${segments.join("/")}`;
}

export function getBaseName(path: string): string {
  const segments = getPathSegments(path);
  return segments.at(-1) ?? "";
}

export function isSafeEntryName(name: string): boolean {
  return Boolean(name) && name !== "." && name !== ".." && !name.includes("/");
}

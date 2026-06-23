import {
  getBaseName,
  getParentPath,
  getPathSegments,
  isSafeEntryName,
  normalizePath,
  resolvePath,
} from "./path.ts";
import type {
  DirectoryNode,
  FileNode,
  FileTreeInput,
  VfsNode,
  VirtualFileSystem,
} from "./types.ts";

export function directory(
  children: Record<string, VfsNode> = {},
): DirectoryNode {
  return { type: "directory", children };
}

export function file(content = ""): FileNode {
  return { type: "file", content };
}

export function cloneNode<T extends VfsNode>(node: T): T {
  if (node.type === "file") {
    return file(node.content) as T;
  }

  return directory(
    Object.fromEntries(
      Object.entries(node.children).map(([name, child]) => [
        name,
        cloneNode(child),
      ]),
    ),
  ) as T;
}

export function cloneFileSystem(fileSystem: VirtualFileSystem): VirtualFileSystem {
  return {
    root: cloneNode(fileSystem.root),
    homeDirectory: fileSystem.homeDirectory,
  };
}

export function createFileSystem(
  tree: Record<string, FileTreeInput> = {},
  homeDirectory = "/home/codex",
): VirtualFileSystem {
  const fileSystem = {
    root: directory(),
    homeDirectory: normalizePath(homeDirectory),
  };

  writeTree(fileSystem.root, tree);
  ensureDirectory(fileSystem, fileSystem.homeDirectory);

  return fileSystem;
}

export function getNode(
  fileSystem: VirtualFileSystem,
  absolutePath: string,
): VfsNode | null {
  const segments = getPathSegments(absolutePath);
  let current: VfsNode = fileSystem.root;

  for (const segment of segments) {
    if (current.type !== "directory") {
      return null;
    }

    const nextNode: VfsNode | undefined = current.children[segment];
    if (!nextNode) {
      return null;
    }

    current = nextNode;
  }

  return current;
}

export function pathExists(
  fileSystem: VirtualFileSystem,
  absolutePath: string,
): boolean {
  return getNode(fileSystem, absolutePath) !== null;
}

export function getDirectory(
  fileSystem: VirtualFileSystem,
  absolutePath: string,
): DirectoryNode | null {
  const node = getNode(fileSystem, absolutePath);
  return node?.type === "directory" ? node : null;
}

export function ensureDirectory(
  fileSystem: VirtualFileSystem,
  absolutePath: string,
): DirectoryNode {
  let current = fileSystem.root;

  for (const segment of getPathSegments(absolutePath)) {
    const existing = current.children[segment];
    if (existing?.type === "file") {
      throw new Error(`${absolutePath} cannot be both a file and a folder.`);
    }

    if (!existing) {
      current.children[segment] = directory();
    }

    current = current.children[segment] as DirectoryNode;
  }

  return current;
}

export function listDirectory(
  fileSystem: VirtualFileSystem,
  absolutePath: string,
): string[] {
  const node = getNode(fileSystem, absolutePath);

  if (!node) {
    throw new Error(`Nothing exists at ${absolutePath}.`);
  }

  if (node.type === "file") {
    return [getBaseName(absolutePath)];
  }

  return Object.entries(node.children)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, child]) => (child.type === "directory" ? `${name}/` : name));
}

export function createDirectoryAt(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  inputPath: string,
): VirtualFileSystem {
  const next = cloneFileSystem(fileSystem);
  const target = resolvePath(currentDirectory, inputPath, next.homeDirectory);
  const parent = getDirectory(next, getParentPath(target));
  const name = getBaseName(target);

  if (!parent) {
    throw new Error(`The folder ${getParentPath(target)} does not exist yet.`);
  }

  if (!isSafeEntryName(name)) {
    throw new Error("Choose a folder name without /, . or ...");
  }

  if (parent.children[name]) {
    throw new Error(`${target} already exists.`);
  }

  parent.children[name] = directory();
  return next;
}

export function touchFileAt(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  inputPath: string,
): VirtualFileSystem {
  const next = cloneFileSystem(fileSystem);
  const target = resolvePath(currentDirectory, inputPath, next.homeDirectory);
  const parent = getDirectory(next, getParentPath(target));
  const name = getBaseName(target);

  if (!parent) {
    throw new Error(`The folder ${getParentPath(target)} does not exist yet.`);
  }

  if (!isSafeEntryName(name)) {
    throw new Error("Choose a file name without /, . or ...");
  }

  const existing = parent.children[name];
  if (existing?.type === "directory") {
    throw new Error(`${target} is a folder, so touch cannot turn it into a file.`);
  }

  parent.children[name] = existing ?? file();
  return next;
}

export function removeAt(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  inputPath: string,
  recursive = false,
): VirtualFileSystem {
  const next = cloneFileSystem(fileSystem);
  const target = resolvePath(currentDirectory, inputPath, next.homeDirectory);

  if (target === "/") {
    throw new Error("The simulator will not delete the root folder.");
  }

  const parent = getDirectory(next, getParentPath(target));
  const name = getBaseName(target);
  const existing = parent?.children[name];

  if (!parent || !existing) {
    throw new Error(`${target} does not exist.`);
  }

  if (existing.type === "directory") {
    const childCount = Object.keys(existing.children).length;
    if (!recursive) {
      throw new Error(`${target} is a folder. Use rm -r ${inputPath} to remove folders.`);
    }
    if (childCount > 0 && !recursive) {
      throw new Error(`${target} is not empty.`);
    }
  }

  delete parent.children[name];
  return next;
}

export function copyAt(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  sourcePath: string,
  destinationPath: string,
): VirtualFileSystem {
  const next = cloneFileSystem(fileSystem);
  const source = resolvePath(currentDirectory, sourcePath, next.homeDirectory);
  const destination = resolvePath(
    currentDirectory,
    destinationPath,
    next.homeDirectory,
  );
  const sourceNode = getNode(next, source);

  if (!sourceNode) {
    throw new Error(`${source} does not exist.`);
  }

  const destinationNode = getNode(next, destination);
  const finalPath =
    destinationNode?.type === "directory"
      ? normalizePath(`${destination}/${getBaseName(source)}`)
      : destination;
  const parent = getDirectory(next, getParentPath(finalPath));
  const name = getBaseName(finalPath);

  if (!parent) {
    throw new Error(`The folder ${getParentPath(finalPath)} does not exist yet.`);
  }

  if (parent.children[name]) {
    throw new Error(`${finalPath} already exists. Choose a new name.`);
  }

  parent.children[name] = cloneNode(sourceNode);
  return next;
}

export function moveAt(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  sourcePath: string,
  destinationPath: string,
): VirtualFileSystem {
  const copied = copyAt(fileSystem, currentDirectory, sourcePath, destinationPath);
  return removeAt(copied, currentDirectory, sourcePath, true);
}

export function readFileAt(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  inputPath: string,
): string {
  const target = resolvePath(currentDirectory, inputPath, fileSystem.homeDirectory);
  const node = getNode(fileSystem, target);

  if (!node) {
    throw new Error(`${target} does not exist.`);
  }

  if (node.type === "directory") {
    throw new Error(`${target} is a folder. cat reads files.`);
  }

  return node.content;
}

function writeTree(target: DirectoryNode, tree: Record<string, FileTreeInput>) {
  for (const [name, value] of Object.entries(tree)) {
    if (!isSafeEntryName(name)) {
      throw new Error(`Invalid virtual file system entry name: ${name}`);
    }

    if (typeof value === "string") {
      target.children[name] = file(value);
      continue;
    }

    if (value.type === "directory") {
      const child = directory();
      target.children[name] = child;
      writeTree(child, value.children ?? {});
      continue;
    }

    target.children[name] = file(value.content ?? "");
  }
}

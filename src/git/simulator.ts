import {
  getBaseName,
  normalizePath,
  resolvePath,
} from "../terminal/path.ts";
import {
  cloneFileSystem,
  createDirectoryAt,
  file,
  getDirectory,
  getNode,
} from "../terminal/vfs.ts";
import type {
  DirectoryNode,
  VirtualFileSystem,
  VfsNode,
} from "../terminal/types.ts";
import type {
  GitChange,
  GitCommandResult,
  GitCommit,
  GitRepositoryState,
  GitSnapshot,
  GitState,
  GitStatus,
  GitWorkspaceSummary,
  MockRemoteRepository,
} from "./types.ts";

const DEFAULT_BRANCH = "main";
const TIMESTAMP_BASE = Date.UTC(2026, 0, 1, 12, 0, 0);

export const mockRemoteUrls = {
  tinySite: "https://github.com/zero2codex/tiny-site.git",
  notesApp: "https://github.com/zero2codex/notes-app.git",
} as const;

export function createGitState(): GitState {
  return {
    repositories: {},
    remotes: createDefaultRemotes(),
    sequence: 0,
  };
}

export function cloneGitState(state: GitState): GitState {
  return {
    repositories: Object.fromEntries(
      Object.entries(state.repositories).map(([path, repository]) => [
        path,
        cloneRepository(repository),
      ]),
    ),
    remotes: Object.fromEntries(
      Object.entries(state.remotes).map(([url, remote]) => [
        url,
        cloneRemote(remote),
      ]),
    ),
    sequence: state.sequence,
  };
}

export function executeGitCommand(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  gitState: GitState,
  args: string[],
): GitCommandResult {
  const [subcommand, ...subcommandArgs] = args;

  try {
    if (!subcommand) {
      return success(fileSystem, gitState, [
        "Git simulator commands: init, status, add, commit, log, diff, branch, switch, checkout, merge, restore, remote, push, pull, clone.",
        "This is a local browser simulation. It never contacts GitHub or runs real Git.",
      ]);
    }

    if (subcommand === "init") {
      return runInit(fileSystem, currentDirectory, gitState, subcommandArgs);
    }

    if (subcommand === "clone") {
      return runClone(fileSystem, currentDirectory, gitState, subcommandArgs);
    }

    const repository = findRepository(gitState, currentDirectory);
    if (!repository) {
      throw new Error(
        "This folder is not a Git repository yet. Run git init here, or move into a cloned project.",
      );
    }

    switch (subcommand) {
      case "status":
        return runStatus(fileSystem, gitState, repository, subcommandArgs);
      case "add":
        return runAdd(fileSystem, currentDirectory, gitState, repository, subcommandArgs);
      case "commit":
        return runCommit(fileSystem, gitState, repository, subcommandArgs);
      case "log":
        return runLog(fileSystem, gitState, repository, subcommandArgs);
      case "diff":
        return runDiff(fileSystem, gitState, repository, subcommandArgs);
      case "branch":
        return runBranch(fileSystem, gitState, repository, subcommandArgs);
      case "switch":
        return runSwitch(
          fileSystem,
          gitState,
          repository,
          subcommandArgs,
          "switch",
        );
      case "checkout":
        return runSwitch(
          fileSystem,
          gitState,
          repository,
          subcommandArgs,
          "checkout",
        );
      case "merge":
        return runMerge(fileSystem, gitState, repository, subcommandArgs);
      case "restore":
        return runRestore(
          fileSystem,
          currentDirectory,
          gitState,
          repository,
          subcommandArgs,
        );
      case "remote":
        return runRemote(fileSystem, gitState, repository, subcommandArgs);
      case "push":
        return runPush(fileSystem, gitState, repository, subcommandArgs);
      case "pull":
        return runPull(fileSystem, gitState, repository, subcommandArgs);
      default:
        throw new Error(
          `git ${subcommand} is not supported in this course simulator.`,
        );
    }
  } catch (error) {
    return failure(
      fileSystem,
      gitState,
      error instanceof Error ? error.message : "That Git command could not run.",
    );
  }
}

export function findRepository(
  state: GitState,
  currentDirectory: string,
): GitRepositoryState | null {
  const normalized = normalizePath(currentDirectory);
  const roots = Object.keys(state.repositories)
    .filter((root) => normalized === root || normalized.startsWith(`${root}/`))
    .sort((a, b) => b.length - a.length);
  return roots[0] ? state.repositories[roots[0]] : null;
}

export function getHeadCommit(
  repository: GitRepositoryState,
): GitCommit | null {
  const hash = repository.branches[repository.currentBranch];
  return hash ? repository.commits[hash] ?? null : null;
}

export function getGitStatus(
  fileSystem: VirtualFileSystem,
  repository: GitRepositoryState,
): GitStatus {
  const head = getHeadCommit(repository)?.snapshot ?? {};
  const working = snapshotDirectory(fileSystem, repository.rootPath);
  const staged = diffSnapshots(head, repository.index);
  const trackedPaths = new Set([
    ...Object.keys(head),
    ...Object.keys(repository.index),
  ]);
  const unstaged = diffSnapshots(repository.index, working).filter((change) =>
    trackedPaths.has(change.path),
  );
  const untracked = Object.keys(working)
    .filter((path) => !trackedPaths.has(path))
    .sort();

  return {
    branch: repository.currentBranch,
    staged,
    unstaged,
    untracked,
    clean:
      staged.length === 0 && unstaged.length === 0 && untracked.length === 0,
  };
}

export function getGitWorkspaceSummary(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  state: GitState,
): GitWorkspaceSummary | null {
  const repository = findRepository(state, currentDirectory);
  if (!repository) {
    return null;
  }

  const status = getGitStatus(fileSystem, repository);
  return {
    repositoryRoot: repository.rootPath,
    branch: repository.currentBranch,
    stagedCount: status.staged.length,
    unstagedCount: status.unstaged.length,
    untrackedCount: status.untracked.length,
    commitCount: repository.commitOrder.length,
    remoteCount: Object.keys(repository.remotes).length,
    conflictCount: repository.conflict?.files.length ?? 0,
  };
}

export function getGitDiff(
  fileSystem: VirtualFileSystem,
  repository: GitRepositoryState,
  staged = false,
): string[] {
  const before = staged
    ? getHeadCommit(repository)?.snapshot ?? {}
    : repository.index;
  const after = staged
    ? repository.index
    : snapshotDirectory(fileSystem, repository.rootPath);
  const trackedPaths = new Set([
    ...Object.keys(getHeadCommit(repository)?.snapshot ?? {}),
    ...Object.keys(repository.index),
  ]);
  const paths = diffSnapshots(before, after)
    .map((change) => change.path)
    .filter((path) => staged || trackedPaths.has(path));

  return paths.flatMap((path) =>
    renderFileDiff(path, before[path], after[path]),
  );
}

export function snapshotDirectory(
  fileSystem: VirtualFileSystem,
  rootPath: string,
): GitSnapshot {
  const root = getNode(fileSystem, rootPath);
  if (!root || root.type !== "directory") {
    throw new Error(`${rootPath} is not a folder Git can track.`);
  }

  const snapshot: GitSnapshot = {};
  collectSnapshot(root, "", snapshot);
  return sortSnapshot(snapshot);
}

function runInit(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  state: GitState,
  args: string[],
): GitCommandResult {
  requireArgCount("git init", args, 0);
  const existing = findRepository(state, currentDirectory);
  if (existing) {
    return success(fileSystem, state, [
      `Git is already tracking the simulated repository at ${existing.rootPath}.`,
    ]);
  }

  const rootPath = normalizePath(currentDirectory);
  if (!getDirectory(fileSystem, rootPath)) {
    throw new Error(`${rootPath} is not a folder.`);
  }

  const next = cloneGitState(state);
  next.repositories[rootPath] = {
    rootPath,
    currentBranch: DEFAULT_BRANCH,
    branches: { [DEFAULT_BRANCH]: null },
    commits: {},
    commitOrder: [],
    index: {},
    remotes: {},
  };

  return success(fileSystem, next, [
    `Initialized empty Git repository in ${rootPath}.`,
    "Git can now compare changes in this folder. Nothing has been committed yet.",
  ]);
}

function runStatus(
  fileSystem: VirtualFileSystem,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  requireArgCount("git status", args, 0);
  const status = getGitStatus(fileSystem, repository);
  const output = [`On branch ${status.branch}`];

  if (repository.conflict) {
    output.push(
      "",
      "Merge needs guidance:",
      ...repository.conflict.files.map((path) => `  both changed: ${path}`),
    );
  }

  if (status.staged.length > 0) {
    output.push(
      "",
      "Changes staged for the next commit:",
      ...status.staged.map((change) => `  ${change.kind}: ${change.path}`),
    );
  }

  if (status.unstaged.length > 0) {
    output.push(
      "",
      "Changes not staged yet:",
      ...status.unstaged.map((change) => `  ${change.kind}: ${change.path}`),
    );
  }

  if (status.untracked.length > 0) {
    output.push(
      "",
      "Untracked files:",
      ...status.untracked.map((path) => `  ${path}`),
    );
  }

  if (status.clean) {
    output.push("", "nothing to commit, working tree clean");
  } else {
    output.push(
      "",
      "Use git add to choose changes for the next checkpoint.",
    );
  }

  return success(fileSystem, state, output);
}

function runAdd(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  requireAtLeastArgs("git add", args, 1);
  const next = cloneGitState(state);
  const nextRepository = next.repositories[repository.rootPath];
  const working = snapshotDirectory(fileSystem, repository.rootPath);

  if (args.length === 1 && args[0] === ".") {
    nextRepository.index = working;
    return success(fileSystem, next, [
      "Staged every current change in this repository for the next commit.",
    ]);
  }

  for (const inputPath of args) {
    const relativePath = toRepositoryRelativePath(
      repository,
      currentDirectory,
      inputPath,
    );
    const matchingPaths = Object.keys(working).filter(
      (path) => path === relativePath || path.startsWith(`${relativePath}/`),
    );
    const trackedMatches = Object.keys(nextRepository.index).filter(
      (path) => path === relativePath || path.startsWith(`${relativePath}/`),
    );

    if (matchingPaths.length === 0 && trackedMatches.length === 0) {
      throw new Error(
        `${inputPath} is not a file Git can stage from this location.`,
      );
    }

    for (const path of trackedMatches) {
      if (!(path in working)) {
        delete nextRepository.index[path];
      }
    }
    for (const path of matchingPaths) {
      nextRepository.index[path] = working[path];
    }
  }

  nextRepository.index = sortSnapshot(nextRepository.index);
  return success(fileSystem, next, [
    `Staged ${args.join(", ")} for the next commit.`,
  ]);
}

function runCommit(
  fileSystem: VirtualFileSystem,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  if (args[0] !== "-m" || args.length !== 2 || !args[1].trim()) {
    throw new Error('Use git commit -m "a short message".');
  }

  const head = getHeadCommit(repository);
  if (diffSnapshots(head?.snapshot ?? {}, repository.index).length === 0) {
    throw new Error(
      "There are no staged changes to commit. Use git add first.",
    );
  }

  const next = cloneGitState(state);
  const nextRepository = next.repositories[repository.rootPath];
  const commit = createCommit(next, nextRepository, args[1], [
    nextRepository.branches[nextRepository.currentBranch],
  ]);
  nextRepository.commits[commit.hash] = commit;
  nextRepository.commitOrder.push(commit.hash);
  nextRepository.branches[nextRepository.currentBranch] = commit.hash;
  nextRepository.conflict = undefined;

  return success(fileSystem, next, [
    `[${nextRepository.currentBranch} ${commit.hash}] ${commit.message}`,
    `${Object.keys(commit.snapshot).length} tracked file(s) in this checkpoint.`,
  ]);
}

function runLog(
  fileSystem: VirtualFileSystem,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  if (args.length > 1 || (args[0] && args[0] !== "--oneline")) {
    throw new Error("git log supports only the optional --oneline flag here.");
  }

  const commits = getReachableCommits(repository);
  if (commits.length === 0) {
    return success(fileSystem, state, [
      "No commits yet. Your first checkpoint will appear here.",
    ]);
  }

  if (args[0] === "--oneline") {
    return success(
      fileSystem,
      state,
      commits.map((commit) => `${commit.hash} ${commit.message}`),
    );
  }

  return success(
    fileSystem,
    state,
    commits.flatMap((commit, index) => [
      `commit ${commit.hash}`,
      `Date: ${commit.timestamp}`,
      "",
      `    ${commit.message}`,
      ...(index === commits.length - 1 ? [] : [""]),
    ]),
  );
}

function runDiff(
  fileSystem: VirtualFileSystem,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  if (
    args.length > 1 ||
    (args[0] && !["--staged", "--cached"].includes(args[0]))
  ) {
    throw new Error("Use git diff or git diff --staged in this lesson.");
  }

  const staged = args[0] === "--staged" || args[0] === "--cached";
  const output = getGitDiff(fileSystem, repository, staged);
  return success(
    fileSystem,
    state,
    output.length > 0
      ? output
      : [
          staged
            ? "No staged differences. The index matches the latest commit."
            : "No unstaged differences. Tracked files match the staging area.",
        ],
  );
}

function runBranch(
  fileSystem: VirtualFileSystem,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  if (args.length === 0) {
    return success(
      fileSystem,
      state,
      Object.keys(repository.branches)
        .sort()
        .map((branch) =>
          branch === repository.currentBranch ? `* ${branch}` : `  ${branch}`,
        ),
    );
  }

  requireArgCount("git branch", args, 1);
  validateBranchName(args[0]);
  if (repository.branches[args[0]] !== undefined) {
    throw new Error(`A branch named ${args[0]} already exists.`);
  }

  const next = cloneGitState(state);
  const nextRepository = next.repositories[repository.rootPath];
  nextRepository.branches[args[0]] =
    nextRepository.branches[nextRepository.currentBranch];
  return success(fileSystem, next, [
    `Created branch ${args[0]} at the current checkpoint.`,
  ]);
}

function runSwitch(
  fileSystem: VirtualFileSystem,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
  command: "switch" | "checkout",
): GitCommandResult {
  const createFlag = command === "switch" ? "-c" : "-b";
  const create = args[0] === createFlag;
  const branchName = create ? args[1] : args[0];

  if (
    !branchName ||
    (create && args.length !== 2) ||
    (!create && args.length !== 1)
  ) {
    throw new Error(
      command === "switch"
        ? "Use git switch branch-name or git switch -c new-branch."
        : "Use git checkout branch-name or git checkout -b new-branch.",
    );
  }

  const status = getGitStatus(fileSystem, repository);
  if (!status.clean) {
    throw new Error(
      "Save or restore your current changes before switching branches. This simulator blocks the switch so nothing is lost.",
    );
  }

  validateBranchName(branchName);
  const next = cloneGitState(state);
  const nextRepository = next.repositories[repository.rootPath];

  if (create) {
    if (nextRepository.branches[branchName] !== undefined) {
      throw new Error(`A branch named ${branchName} already exists.`);
    }
    nextRepository.branches[branchName] =
      nextRepository.branches[nextRepository.currentBranch];
  } else if (nextRepository.branches[branchName] === undefined) {
    throw new Error(`No branch named ${branchName} exists yet.`);
  }

  nextRepository.currentBranch = branchName;
  nextRepository.conflict = undefined;
  const targetHash = nextRepository.branches[branchName];
  const snapshot = targetHash
    ? nextRepository.commits[targetHash]?.snapshot ?? {}
    : {};
  nextRepository.index = cloneSnapshot(snapshot);
  const nextFileSystem = applySnapshot(
    fileSystem,
    nextRepository.rootPath,
    snapshot,
  );

  return success(nextFileSystem, next, [
    create
      ? `Switched to a new branch '${branchName}'.`
      : `Switched to branch '${branchName}'.`,
  ]);
}

function runMerge(
  fileSystem: VirtualFileSystem,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  requireArgCount("git merge", args, 1);
  const sourceBranch = args[0];
  if (repository.branches[sourceBranch] === undefined) {
    throw new Error(`No branch named ${sourceBranch} exists.`);
  }
  if (sourceBranch === repository.currentBranch) {
    throw new Error("That branch is already checked out.");
  }
  if (!getGitStatus(fileSystem, repository).clean) {
    throw new Error(
      "Commit or restore current changes before merging so the result stays clear.",
    );
  }

  const oursHash = repository.branches[repository.currentBranch];
  const theirsHash = repository.branches[sourceBranch];
  if (!theirsHash) {
    return success(fileSystem, state, ["Nothing to merge from that branch."]);
  }
  if (oursHash === theirsHash) {
    return success(fileSystem, state, ["Already up to date."]);
  }

  const next = cloneGitState(state);
  const nextRepository = next.repositories[repository.rootPath];

  if (!oursHash || isAncestor(repository, oursHash, theirsHash)) {
    nextRepository.branches[nextRepository.currentBranch] = theirsHash;
    const snapshot = nextRepository.commits[theirsHash].snapshot;
    nextRepository.index = cloneSnapshot(snapshot);
    return success(
      applySnapshot(fileSystem, repository.rootPath, snapshot),
      next,
      [`Fast-forwarded ${repository.currentBranch} to ${sourceBranch}.`],
    );
  }

  if (isAncestor(repository, theirsHash, oursHash)) {
    return success(fileSystem, state, ["Already up to date."]);
  }

  const baseHash = findCommonAncestor(repository, oursHash, theirsHash);
  const base = baseHash ? repository.commits[baseHash].snapshot : {};
  const ours = repository.commits[oursHash].snapshot;
  const theirs = repository.commits[theirsHash].snapshot;
  const merge = mergeSnapshots(base, ours, theirs);

  if (merge.conflicts.length > 0) {
    nextRepository.conflict = {
      sourceBranch,
      files: merge.conflicts,
    };
    return failure(
      fileSystem,
      next,
      `Merge paused because both branches changed ${merge.conflicts.join(
        ", ",
      )}. In a real project you would review those files and choose the final content. This Level 4 simulator does not edit conflicts.`,
    );
  }

  nextRepository.index = merge.snapshot;
  const commit = createCommit(
    next,
    nextRepository,
    `Merge branch '${sourceBranch}'`,
    [oursHash, theirsHash],
  );
  nextRepository.commits[commit.hash] = commit;
  nextRepository.commitOrder.push(commit.hash);
  nextRepository.branches[nextRepository.currentBranch] = commit.hash;
  const nextFileSystem = applySnapshot(
    fileSystem,
    repository.rootPath,
    merge.snapshot,
  );
  return success(nextFileSystem, next, [
    `Merged ${sourceBranch} into ${repository.currentBranch}.`,
    `[${repository.currentBranch} ${commit.hash}] ${commit.message}`,
  ]);
}

function runRestore(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  requireArgCount("git restore", args, 1);
  const head = getHeadCommit(repository);
  if (!head) {
    throw new Error("There is no commit to restore from yet.");
  }
  const relativePath = toRepositoryRelativePath(
    repository,
    currentDirectory,
    args[0],
  );
  const committedContent = head.snapshot[relativePath];
  if (committedContent === undefined) {
    throw new Error(
      `${args[0]} is not in the latest commit, so Git has no saved version to restore.`,
    );
  }

  const working = snapshotDirectory(fileSystem, repository.rootPath);
  working[relativePath] = committedContent;
  const nextFileSystem = applySnapshot(
    fileSystem,
    repository.rootPath,
    working,
  );
  return success(nextFileSystem, state, [
    `Restored ${relativePath} from the latest commit. Uncommitted edits to that file were discarded.`,
  ]);
}

function runRemote(
  fileSystem: VirtualFileSystem,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  if (args[0] === "add") {
    if (args.length !== 3) {
      throw new Error("Use git remote add origin <url>.");
    }
    const [, name, url] = args;
    if (repository.remotes[name]) {
      throw new Error(`A remote named ${name} already exists.`);
    }
    const next = cloneGitState(state);
    next.repositories[repository.rootPath].remotes[name] = url;
    return success(fileSystem, next, [
      `Added simulated remote ${name}. No network connection was made.`,
    ]);
  }

  if (args.length === 1 && args[0] === "-v") {
    const entries = Object.entries(repository.remotes);
    return success(
      fileSystem,
      state,
      entries.length > 0
        ? entries.flatMap(([name, url]) => [
            `${name}\t${url} (fetch)`,
            `${name}\t${url} (push)`,
          ])
        : ["No remotes configured."],
    );
  }

  throw new Error("Use git remote add origin <url> or git remote -v.");
}

function runPush(
  fileSystem: VirtualFileSystem,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  if (args.length > 2) {
    throw new Error("Use git push, or git push origin branch-name.");
  }
  const remoteName = args[0] ?? "origin";
  const branch = args[1] ?? repository.currentBranch;
  const url = repository.remotes[remoteName];
  if (!url) {
    throw new Error(
      `No ${remoteName} remote is configured. Use git remote add ${remoteName} <url>.`,
    );
  }
  const hash = repository.branches[branch];
  if (hash === undefined) {
    throw new Error(`No local branch named ${branch} exists.`);
  }
  if (!hash) {
    throw new Error("Create at least one commit before pushing.");
  }

  const next = cloneGitState(state);
  const nextRepository = next.repositories[repository.rootPath];
  const existingRemote = next.remotes[url];
  const remote: MockRemoteRepository = existingRemote
    ? cloneRemote(existingRemote)
    : {
        url,
        defaultBranch: branch,
        branches: {},
        commits: {},
      };
  for (const [commitHash, commit] of Object.entries(nextRepository.commits)) {
    remote.commits[commitHash] = cloneCommit(commit);
  }
  remote.branches[branch] = hash;
  next.remotes[url] = remote;

  return success(fileSystem, next, [
    `Pushed ${branch} to ${remoteName} in the simulated remote.`,
    "No GitHub login or network request occurred.",
  ]);
}

function runPull(
  fileSystem: VirtualFileSystem,
  state: GitState,
  repository: GitRepositoryState,
  args: string[],
): GitCommandResult {
  if (args.length > 2) {
    throw new Error("Use git pull, or git pull origin branch-name.");
  }
  if (!getGitStatus(fileSystem, repository).clean) {
    throw new Error("Commit or restore local changes before pulling.");
  }
  const remoteName = args[0] ?? "origin";
  const branch = args[1] ?? repository.currentBranch;
  const url = repository.remotes[remoteName];
  const remote = url ? state.remotes[url] : undefined;
  if (!url || !remote) {
    throw new Error(
      `The simulated ${remoteName} remote has no downloadable project state.`,
    );
  }
  const remoteHash = remote.branches[branch];
  if (!remoteHash) {
    throw new Error(`The simulated remote has no branch named ${branch}.`);
  }
  const localHash = repository.branches[repository.currentBranch];
  if (localHash === remoteHash) {
    return success(fileSystem, state, ["Already up to date."]);
  }
  if (localHash && !isAncestorAcross(repository, remote, localHash, remoteHash)) {
    throw new Error(
      "Local and remote history have both moved. This Level 4 simulator stops here so you can learn the safer, simple pull case first.",
    );
  }

  const next = cloneGitState(state);
  const nextRepository = next.repositories[repository.rootPath];
  for (const [hash, commit] of Object.entries(remote.commits)) {
    nextRepository.commits[hash] = cloneCommit(commit);
    if (!nextRepository.commitOrder.includes(hash)) {
      nextRepository.commitOrder.push(hash);
    }
  }
  nextRepository.branches[nextRepository.currentBranch] = remoteHash;
  const snapshot = nextRepository.commits[remoteHash].snapshot;
  nextRepository.index = cloneSnapshot(snapshot);
  return success(
    applySnapshot(fileSystem, repository.rootPath, snapshot),
    next,
    [`Pulled ${remoteName}/${branch} into ${repository.currentBranch}.`],
  );
}

function runClone(
  fileSystem: VirtualFileSystem,
  currentDirectory: string,
  state: GitState,
  args: string[],
): GitCommandResult {
  if (args.length < 1 || args.length > 2) {
    throw new Error("Use git clone <url> or git clone <url> folder-name.");
  }
  const [url, requestedName] = args;
  const remote = state.remotes[url];
  if (!remote) {
    throw new Error(
      "That URL is not one of this lesson's mocked repositories. No network request was made.",
    );
  }
  const inferredName = getBaseName(url).replace(/\.git$/, "");
  const folderName = requestedName ?? inferredName;
  const targetPath = resolvePath(
    currentDirectory,
    folderName,
    fileSystem.homeDirectory,
  );
  if (getNode(fileSystem, targetPath)) {
    throw new Error(`${targetPath} already exists.`);
  }

  let nextFileSystem = createDirectoryAt(
    fileSystem,
    currentDirectory,
    folderName,
  );
  const branch = remote.defaultBranch;
  const hash = remote.branches[branch];
  const snapshot = hash ? remote.commits[hash]?.snapshot ?? {} : {};
  nextFileSystem = applySnapshot(nextFileSystem, targetPath, snapshot);

  const next = cloneGitState(state);
  next.repositories[targetPath] = {
    rootPath: targetPath,
    currentBranch: branch,
    branches: { ...remote.branches },
    commits: Object.fromEntries(
      Object.entries(remote.commits).map(([commitHash, commit]) => [
        commitHash,
        cloneCommit(commit),
      ]),
    ),
    commitOrder: orderRemoteCommits(remote),
    index: cloneSnapshot(snapshot),
    remotes: { origin: url },
  };

  return success(nextFileSystem, next, [
    `Cloned mocked repository into ${folderName}/.`,
    "The files came from a built-in lesson preset, not the internet.",
  ]);
}

function createCommit(
  state: GitState,
  repository: GitRepositoryState,
  message: string,
  parents: Array<string | null>,
): GitCommit {
  state.sequence += 1;
  const timestamp = new Date(
    TIMESTAMP_BASE + state.sequence * 60_000,
  ).toISOString();
  const parentHashes = parents.filter((parent): parent is string => Boolean(parent));
  const hash = makeHash(
    `${state.sequence}|${message}|${parentHashes.join(",")}|${JSON.stringify(
      repository.index,
    )}`,
  );
  return {
    hash,
    message,
    timestamp,
    parents: parentHashes,
    snapshot: cloneSnapshot(repository.index),
  };
}

function createDefaultRemotes(): Record<string, MockRemoteRepository> {
  const tinySnapshot = {
    "README.md": "# Tiny Site\nA safe project for learning Git.",
    "index.html": "<h1>Hello from the tiny site</h1>",
    "styles.css": "body { font-family: sans-serif; }",
  };
  const tinyCommit: GitCommit = {
    hash: "7ab31d2",
    message: "Create tiny site starter",
    timestamp: "2026-01-01T09:00:00.000Z",
    parents: [],
    snapshot: tinySnapshot,
  };
  const notesFirst: GitCommit = {
    hash: "31c8a10",
    message: "Start notes app",
    timestamp: "2026-01-01T10:00:00.000Z",
    parents: [],
    snapshot: {
      "README.md": "# Notes App",
      "notes.txt": "First note",
    },
  };
  const notesSecond: GitCommit = {
    hash: "4d921ee",
    message: "Add project guide",
    timestamp: "2026-01-01T10:05:00.000Z",
    parents: [notesFirst.hash],
    snapshot: {
      ...notesFirst.snapshot,
      "guide.txt": "Pull before starting shared work.",
    },
  };

  return {
    [mockRemoteUrls.tinySite]: {
      url: mockRemoteUrls.tinySite,
      defaultBranch: DEFAULT_BRANCH,
      branches: { [DEFAULT_BRANCH]: tinyCommit.hash },
      commits: { [tinyCommit.hash]: tinyCommit },
    },
    [mockRemoteUrls.notesApp]: {
      url: mockRemoteUrls.notesApp,
      defaultBranch: DEFAULT_BRANCH,
      branches: { [DEFAULT_BRANCH]: notesSecond.hash },
      commits: {
        [notesFirst.hash]: notesFirst,
        [notesSecond.hash]: notesSecond,
      },
    },
  };
}

function collectSnapshot(
  node: DirectoryNode,
  prefix: string,
  snapshot: GitSnapshot,
) {
  for (const [name, child] of Object.entries(node.children).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    if (name === ".git") {
      continue;
    }
    const path = prefix ? `${prefix}/${name}` : name;
    if (child.type === "file") {
      snapshot[path] = child.content;
    } else {
      collectSnapshot(child, path, snapshot);
    }
  }
}

function applySnapshot(
  fileSystem: VirtualFileSystem,
  rootPath: string,
  snapshot: GitSnapshot,
): VirtualFileSystem {
  const next = cloneFileSystem(fileSystem);
  const root = getDirectory(next, rootPath);
  if (!root) {
    throw new Error(`${rootPath} is not available for a Git snapshot.`);
  }
  root.children = {};

  for (const [relativePath, content] of Object.entries(snapshot)) {
    writeSnapshotFile(root, relativePath, content);
  }
  return next;
}

function writeSnapshotFile(
  root: DirectoryNode,
  relativePath: string,
  content: string,
) {
  const segments = relativePath.split("/").filter(Boolean);
  const name = segments.pop();
  if (!name) {
    return;
  }
  let current = root;
  for (const segment of segments) {
    const existing: VfsNode | undefined = current.children[segment];
    if (existing?.type === "file") {
      throw new Error(`${relativePath} collides with a file.`);
    }
    if (!existing) {
      current.children[segment] = { type: "directory", children: {} };
    }
    current = current.children[segment] as DirectoryNode;
  }
  current.children[name] = file(content);
}

function diffSnapshots(before: GitSnapshot, after: GitSnapshot): GitChange[] {
  const paths = Array.from(
    new Set([...Object.keys(before), ...Object.keys(after)]),
  ).sort();
  const changes: GitChange[] = [];

  for (const path of paths) {
    if (!(path in before)) {
      changes.push({ path, kind: "added" });
      continue;
    }
    if (!(path in after)) {
      changes.push({ path, kind: "deleted" });
      continue;
    }
    if (before[path] !== after[path]) {
      changes.push({ path, kind: "modified" });
    }
  }

  return changes;
}

function renderFileDiff(
  path: string,
  before: string | undefined,
  after: string | undefined,
): string[] {
  const beforeLines = before === undefined ? [] : before.split(/\r?\n/);
  const afterLines = after === undefined ? [] : after.split(/\r?\n/);
  const lines = [
    `diff -- ${path}`,
    before === undefined ? "--- /dev/null" : `--- a/${path}`,
    after === undefined ? "+++ /dev/null" : `+++ b/${path}`,
    `@@ -1,${beforeLines.length} +1,${afterLines.length} @@`,
  ];
  const max = Math.max(beforeLines.length, afterLines.length);
  for (let index = 0; index < max; index += 1) {
    const oldLine = beforeLines[index];
    const newLine = afterLines[index];
    if (oldLine === newLine && oldLine !== undefined) {
      lines.push(` ${oldLine}`);
    } else {
      if (oldLine !== undefined) {
        lines.push(`-${oldLine}`);
      }
      if (newLine !== undefined) {
        lines.push(`+${newLine}`);
      }
    }
  }
  return lines;
}

function mergeSnapshots(
  base: GitSnapshot,
  ours: GitSnapshot,
  theirs: GitSnapshot,
): { snapshot: GitSnapshot; conflicts: string[] } {
  const snapshot: GitSnapshot = {};
  const conflicts: string[] = [];
  const paths = Array.from(
    new Set([
      ...Object.keys(base),
      ...Object.keys(ours),
      ...Object.keys(theirs),
    ]),
  ).sort();

  for (const path of paths) {
    const baseValue = base[path];
    const ourValue = ours[path];
    const theirValue = theirs[path];
    let value: string | undefined;

    if (ourValue === theirValue) {
      value = ourValue;
    } else if (ourValue === baseValue) {
      value = theirValue;
    } else if (theirValue === baseValue) {
      value = ourValue;
    } else {
      conflicts.push(path);
      continue;
    }

    if (value !== undefined) {
      snapshot[path] = value;
    }
  }

  return { snapshot: sortSnapshot(snapshot), conflicts };
}

function toRepositoryRelativePath(
  repository: GitRepositoryState,
  currentDirectory: string,
  inputPath: string,
): string {
  const absolute = resolvePath(currentDirectory, inputPath);
  if (
    absolute !== repository.rootPath &&
    !absolute.startsWith(`${repository.rootPath}/`)
  ) {
    throw new Error("Git can only stage paths inside this repository.");
  }
  if (absolute === repository.rootPath) {
    return "";
  }
  return absolute.slice(repository.rootPath.length + 1);
}

function getReachableCommits(repository: GitRepositoryState): GitCommit[] {
  const commits: GitCommit[] = [];
  const seen = new Set<string>();
  const queue = [repository.branches[repository.currentBranch]].filter(
    (hash): hash is string => Boolean(hash),
  );
  while (queue.length > 0) {
    const hash = queue.shift();
    if (!hash || seen.has(hash)) {
      continue;
    }
    seen.add(hash);
    const commit = repository.commits[hash];
    if (!commit) {
      continue;
    }
    commits.push(commit);
    queue.push(...commit.parents);
  }
  return commits;
}

function findCommonAncestor(
  repository: GitRepositoryState,
  first: string,
  second: string,
): string | null {
  const firstAncestors = collectAncestors(repository.commits, first);
  const queue = [second];
  const seen = new Set<string>();
  while (queue.length > 0) {
    const hash = queue.shift();
    if (!hash || seen.has(hash)) {
      continue;
    }
    if (firstAncestors.has(hash)) {
      return hash;
    }
    seen.add(hash);
    queue.push(...(repository.commits[hash]?.parents ?? []));
  }
  return null;
}

function isAncestor(
  repository: GitRepositoryState,
  ancestor: string,
  descendant: string,
) {
  return collectAncestors(repository.commits, descendant).has(ancestor);
}

function isAncestorAcross(
  repository: GitRepositoryState,
  remote: MockRemoteRepository,
  ancestor: string,
  descendant: string,
) {
  return collectAncestors(
    { ...remote.commits, ...repository.commits },
    descendant,
  ).has(ancestor);
}

function collectAncestors(
  commits: Record<string, GitCommit>,
  start: string,
): Set<string> {
  const result = new Set<string>();
  const queue = [start];
  while (queue.length > 0) {
    const hash = queue.shift();
    if (!hash || result.has(hash)) {
      continue;
    }
    result.add(hash);
    queue.push(...(commits[hash]?.parents ?? []));
  }
  return result;
}

function orderRemoteCommits(remote: MockRemoteRepository) {
  const head = remote.branches[remote.defaultBranch];
  if (!head) {
    return [];
  }
  return Array.from(collectAncestors(remote.commits, head)).reverse();
}

function cloneRepository(repository: GitRepositoryState): GitRepositoryState {
  return {
    ...repository,
    branches: { ...repository.branches },
    commits: Object.fromEntries(
      Object.entries(repository.commits).map(([hash, commit]) => [
        hash,
        cloneCommit(commit),
      ]),
    ),
    commitOrder: [...repository.commitOrder],
    index: cloneSnapshot(repository.index),
    remotes: { ...repository.remotes },
    conflict: repository.conflict
      ? {
          sourceBranch: repository.conflict.sourceBranch,
          files: [...repository.conflict.files],
        }
      : undefined,
  };
}

function cloneRemote(remote: MockRemoteRepository): MockRemoteRepository {
  return {
    ...remote,
    branches: { ...remote.branches },
    commits: Object.fromEntries(
      Object.entries(remote.commits).map(([hash, commit]) => [
        hash,
        cloneCommit(commit),
      ]),
    ),
  };
}

function cloneCommit(commit: GitCommit): GitCommit {
  return {
    ...commit,
    parents: [...commit.parents],
    snapshot: cloneSnapshot(commit.snapshot),
  };
}

function cloneSnapshot(snapshot: GitSnapshot): GitSnapshot {
  return { ...snapshot };
}

function sortSnapshot(snapshot: GitSnapshot): GitSnapshot {
  return Object.fromEntries(
    Object.entries(snapshot).sort(([a], [b]) => a.localeCompare(b)),
  );
}

function validateBranchName(name: string) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(name) || name.includes("..")) {
    throw new Error(
      "Use a simple branch name with letters, numbers, dots, slashes, dashes, or underscores.",
    );
  }
}

function makeHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

function success(
  fileSystem: VirtualFileSystem,
  gitState: GitState,
  output: string[],
): GitCommandResult {
  return { fileSystem, gitState, output };
}

function failure(
  fileSystem: VirtualFileSystem,
  gitState: GitState,
  error: string,
): GitCommandResult {
  return { fileSystem, gitState, output: [], error };
}

function requireArgCount(command: string, args: string[], count: number) {
  if (args.length !== count) {
    throw new Error(
      `${command} expects ${count} argument${count === 1 ? "" : "s"}.`,
    );
  }
}

function requireAtLeastArgs(command: string, args: string[], count: number) {
  if (args.length < count) {
    throw new Error(
      `${command} needs at least ${count} argument${count === 1 ? "" : "s"}.`,
    );
  }
}

import { normalizePath } from "../terminal/path.ts";
import type { TerminalSessionState } from "../terminal/types.ts";
import {
  findRepository,
  getGitDiff,
  getGitStatus,
  getHeadCommit,
} from "./simulator.ts";

export type GitExpectation = {
  initialized?: boolean;
  repositoryRoot?: string;
  currentBranch?: string;
  branches?: string[];
  commitCount?: number;
  latestCommitMessage?: string;
  stagedPaths?: string[];
  unstagedPaths?: string[];
  untrackedPaths?: string[];
  clean?: boolean;
  remotes?: Array<{
    name: string;
    url: string;
  }>;
  pushedBranches?: Array<{
    remoteName: string;
    branch: string;
  }>;
  snapshot?: Array<{
    path: string;
    content?: string;
  }>;
  workingDiffContains?: string[];
  stagedDiffContains?: string[];
  conflictFiles?: string[];
};

export function validateGitExpectation(
  expected: GitExpectation | undefined,
  state: TerminalSessionState,
): { ok: true } | { ok: false; message: string } {
  if (!expected) {
    return { ok: true };
  }

  const repository = expected.repositoryRoot
    ? state.gitState.repositories[normalizePath(expected.repositoryRoot)] ?? null
    : findRepository(state.gitState, state.currentDirectory);

  if (expected.initialized === false) {
    return repository
      ? { ok: false, message: "A Git repository still exists here." }
      : { ok: true };
  }

  if (!repository) {
    return {
      ok: false,
      message: "This folder is not initialized as a Git repository yet.",
    };
  }

  if (
    expected.currentBranch &&
    repository.currentBranch !== expected.currentBranch
  ) {
    return {
      ok: false,
      message: `The current branch is ${repository.currentBranch}, not ${expected.currentBranch}.`,
    };
  }

  for (const branch of expected.branches ?? []) {
    if (repository.branches[branch] === undefined) {
      return { ok: false, message: `The ${branch} branch does not exist yet.` };
    }
  }

  if (
    expected.commitCount !== undefined &&
    repository.commitOrder.length !== expected.commitCount
  ) {
    return {
      ok: false,
      message: `This repository has ${repository.commitOrder.length} commit(s), not ${expected.commitCount}.`,
    };
  }

  if (expected.latestCommitMessage) {
    const latest = getHeadCommit(repository);
    if (latest?.message !== expected.latestCommitMessage) {
      return {
        ok: false,
        message: "The latest commit message is not the expected message yet.",
      };
    }
  }

  const status = getGitStatus(state.fileSystem, repository);
  const stagedPaths = status.staged.map((change) => change.path);
  const unstagedPaths = status.unstaged.map((change) => change.path);

  const stagedResult = includesAll(
    stagedPaths,
    expected.stagedPaths,
    "staged",
  );
  if (!stagedResult.ok) {
    return stagedResult;
  }

  const unstagedResult = includesAll(
    unstagedPaths,
    expected.unstagedPaths,
    "unstaged",
  );
  if (!unstagedResult.ok) {
    return unstagedResult;
  }

  const untrackedResult = includesAll(
    status.untracked,
    expected.untrackedPaths,
    "untracked",
  );
  if (!untrackedResult.ok) {
    return untrackedResult;
  }

  if (expected.clean !== undefined && status.clean !== expected.clean) {
    return {
      ok: false,
      message: expected.clean
        ? "The working tree is not clean yet."
        : "The working tree has no changes yet.",
    };
  }

  for (const remote of expected.remotes ?? []) {
    if (repository.remotes[remote.name] !== remote.url) {
      return {
        ok: false,
        message: `The ${remote.name} remote is not configured as expected yet.`,
      };
    }
  }

  for (const pushed of expected.pushedBranches ?? []) {
    const url = repository.remotes[pushed.remoteName];
    const remote = url ? state.gitState.remotes[url] : undefined;
    const localHash = repository.branches[pushed.branch];
    if (!remote || !localHash || remote.branches[pushed.branch] !== localHash) {
      return {
        ok: false,
        message: `${pushed.branch} has not been pushed to ${pushed.remoteName} yet.`,
      };
    }
  }

  const snapshot = getHeadCommit(repository)?.snapshot ?? {};
  for (const item of expected.snapshot ?? []) {
    if (!(item.path in snapshot)) {
      return {
        ok: false,
        message: `${item.path} is not in the latest commit yet.`,
      };
    }
    if (item.content !== undefined && snapshot[item.path] !== item.content) {
      return {
        ok: false,
        message: `${item.path} does not have the expected committed content yet.`,
      };
    }
  }

  const workingDiff = getGitDiff(state.fileSystem, repository, false).join("\n");
  for (const snippet of expected.workingDiffContains ?? []) {
    if (!workingDiff.includes(snippet)) {
      return {
        ok: false,
        message: `The unstaged diff does not include ${snippet} yet.`,
      };
    }
  }

  const stagedDiff = getGitDiff(state.fileSystem, repository, true).join("\n");
  for (const snippet of expected.stagedDiffContains ?? []) {
    if (!stagedDiff.includes(snippet)) {
      return {
        ok: false,
        message: `The staged diff does not include ${snippet} yet.`,
      };
    }
  }

  const conflictFiles = repository.conflict?.files ?? [];
  const conflictResult = includesAll(
    conflictFiles,
    expected.conflictFiles,
    "conflicted",
  );
  if (!conflictResult.ok) {
    return conflictResult;
  }

  return { ok: true };
}

function includesAll(
  actual: string[],
  expected: string[] | undefined,
  label: string,
): { ok: true } | { ok: false; message: string } {
  for (const path of expected ?? []) {
    if (!actual.includes(path)) {
      return {
        ok: false,
        message: `${path} is not ${label} yet.`,
      };
    }
  }
  return { ok: true };
}

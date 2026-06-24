import type { VirtualFileSystem } from "../terminal/types.ts";

export type GitSnapshot = Record<string, string>;

export type GitCommit = {
  hash: string;
  message: string;
  timestamp: string;
  parents: string[];
  snapshot: GitSnapshot;
};

export type GitConflictState = {
  sourceBranch: string;
  files: string[];
};

export type GitRepositoryState = {
  rootPath: string;
  currentBranch: string;
  branches: Record<string, string | null>;
  commits: Record<string, GitCommit>;
  commitOrder: string[];
  index: GitSnapshot;
  remotes: Record<string, string>;
  conflict?: GitConflictState;
};

export type MockRemoteRepository = {
  url: string;
  defaultBranch: string;
  branches: Record<string, string | null>;
  commits: Record<string, GitCommit>;
};

export type GitState = {
  repositories: Record<string, GitRepositoryState>;
  remotes: Record<string, MockRemoteRepository>;
  sequence: number;
};

export type GitCommandResult = {
  fileSystem: VirtualFileSystem;
  gitState: GitState;
  output: string[];
  error?: string;
};

export type GitChangeKind = "added" | "modified" | "deleted";

export type GitChange = {
  path: string;
  kind: GitChangeKind;
};

export type GitStatus = {
  branch: string;
  staged: GitChange[];
  unstaged: GitChange[];
  untracked: string[];
  clean: boolean;
};

export type GitWorkspaceSummary = {
  repositoryRoot: string;
  branch: string;
  stagedCount: number;
  unstagedCount: number;
  untrackedCount: number;
  commitCount: number;
  remoteCount: number;
  conflictCount: number;
};

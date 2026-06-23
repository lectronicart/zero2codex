export type FileNode = {
  type: "file";
  content: string;
};

export type DirectoryNode = {
  type: "directory";
  children: Record<string, VfsNode>;
};

export type VfsNode = FileNode | DirectoryNode;

export type FileTreeInput =
  | string
  | {
      type?: "file";
      content?: string;
    }
  | {
      type: "directory";
      children?: Record<string, FileTreeInput>;
    };

export type VirtualFileSystem = {
  root: DirectoryNode;
  homeDirectory: string;
};

export type CommandResult = {
  fileSystem: VirtualFileSystem;
  currentDirectory: string;
  output: string[];
  error?: string;
  clear?: boolean;
};

export type ParsedSimpleCommand = {
  command: string;
  args: string[];
  raw: string;
};

export type RedirectMode = "overwrite" | "append";

export type ParsedCommand =
  | {
      ok: true;
      command: string;
      args: string[];
      raw: string;
      pipe?: ParsedSimpleCommand;
      redirect?: {
        mode: RedirectMode;
        path: string;
      };
    }
  | {
      ok: false;
      error: string;
      raw: string;
    };

export type TerminalOutputEntry = {
  id: string;
  kind: "input" | "output" | "error" | "system" | "success";
  text: string;
  prompt?: string;
};

export type TerminalSessionState = {
  fileSystem: VirtualFileSystem;
  currentDirectory: string;
  history: string[];
  entries: TerminalOutputEntry[];
  lastOutput: string[];
};

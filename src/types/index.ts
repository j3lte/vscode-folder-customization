import type { Uri } from "vscode";

export type ExtensionFolder = {
  color?: string;
  path: string;
  badge?: string;
  tooltip?: string;
};

export type ExtensionFolderInput = {
  color?: string | null;
  path: string;
  badge?: string | null;
  tooltip?: string | null;
};

export type GitAPIState = "uninitialized" | "initialized";

export interface GitRepository {
  state: GitRepositoryState;
  rootUri: {
    fsPath: string;
    path: string;
  };
  repository: {
    getBranches: () => Promise<GitBranch[]>;
  };
}

export type CommandCTX = { fsPath: string; path: string; query: string; scheme: string };

export const enum GitStatus {
  INDEX_MODIFIED,
  INDEX_ADDED,
  INDEX_DELETED,
  INDEX_RENAMED,
  INDEX_COPIED,

  MODIFIED,
  DELETED,
  UNTRACKED,
  IGNORED,
  INTENT_TO_ADD,
  INTENT_TO_RENAME,
  TYPE_CHANGED,

  ADDED_BY_US,
  ADDED_BY_THEM,
  DELETED_BY_US,
  DELETED_BY_THEM,
  BOTH_ADDED,
  BOTH_DELETED,
  BOTH_MODIFIED,
}

export interface Change {
  uri: Uri;
  originalUri: Uri;
  renameUri?: Uri;
  status: GitStatus;
}

export interface GitRepositoryState {
  HEAD?: GitBranch;
  mergeChanges?: Change[];
  workingTreeChanges?: Change[];
  indexChanges?: Change[];
  untrackedChanges?: Change[];
  onDidChange: (listener: () => void) => void;
}

export interface GitBranch {
  type: number;
  name?: string;
  upstream: Upstream;
  commit: string;
  ahead: number;
  behind: number;
}

export interface Upstream {
  name: string;
  remote: string;
  commit: string;
}

import type { Event, FileDecorationProvider, ProviderResult, Uri } from "vscode";
import { EventEmitter, FileDecoration, ThemeColor, extensions, workspace } from "vscode";
import type { ExtensionFolder, GitAPIState, GitRepository } from "@/types";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

const GIT_EXTENSION_ID = "vscode.git";
const GIT_API_VERSION = 1;

export class FolderCustomizationProvider implements FileDecorationProvider {
  private readonly _onDidChangeFileDecorations: EventEmitter<Uri | Uri[] | undefined> = new EventEmitter<
    Uri | Uri[] | undefined
  >();

  get onDidChangeFileDecorations() {
    return this._onDidChangeFileDecorations.event;
  }

  private _gitAPI: {
    onDidChangeState: Event<GitAPIState>;
    onDidOpenRepository: Event<GitRepository>;
    onDidCloseRepository: Event<GitRepository>;
    getAPI: (version: number) => unknown;
    repositories: GitRepository[];
  } | null = null;

  private async initializeGitAPI() {
    const gitExtension = extensions.getExtension(GIT_EXTENSION_ID);

    if (gitExtension) {
      const activeGitExtension = gitExtension.isActive ? gitExtension.exports : await gitExtension.activate();

      if (activeGitExtension) {
        this._gitAPI = activeGitExtension.getAPI(GIT_API_VERSION);
        this._gitAPI!.repositories?.forEach((repo) => {
          repo.state.onDidChange(() => {
            this.fireOnChange();
          });
        });
      }
    }
  }

  public fireOnChange() {
    this._onDidChangeFileDecorations.fire(undefined);
  }

  constructor() {
    this.initializeGitAPI();

    workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(getExtensionWithOptionalName("folders"))) {
        this.fireOnChange();
      }
    });
  }

  private isUriChanged(uri: Uri): boolean {
    if (this._gitAPI && this._gitAPI.repositories && this._gitAPI.repositories.length > 0) {
      const changeIncluded = this._gitAPI.repositories.find((repo) => {
        return [
          ...(repo.state.workingTreeChanges || []),
          ...(repo.state.untrackedChanges || []),
          ...(repo.state.indexChanges || []),
          ...(repo.state.mergeChanges || []),
        ].find(
          (change) =>
            change.uri.path === uri.path || change.originalUri.path === uri.path || change.renameUri?.path === uri.path,
        );
      });
      return typeof changeIncluded !== "undefined";
    }
    return false;
  }

  provideFileDecoration(uri: Uri): ProviderResult<FileDecoration> {
    const folders =
      workspace.getConfiguration(getExtensionWithOptionalName()).get<Array<ExtensionFolder>>("folders") || [];

    const isUriChanged = this.isUriChanged(uri);
    const projectPath = cleanPath(uri.fsPath);

    const matchFolders = folders
      .filter((folder) => projectPath.includes(folder.path))
      .sort((a, b) => b.path.length - a.path.length);

    const firstMatchWithColor = matchFolders.find((folder) => folder.color);
    const firstMatchWithBadge = matchFolders.find((folder) => folder.badge);
    const firstMatchWithTooltip = matchFolders.find((folder) => folder.tooltip);

    const firstMatch = matchFolders[0];

    if (firstMatch) {
      const color = firstMatch.color && !isUriChanged ? firstMatch.color : undefined;
      const fileDecorationColor = !isUriChanged ? color || firstMatchWithColor?.color : undefined;
      const themeColor = fileDecorationColor ? new ThemeColor(fileDecorationColor) : undefined;

      return new FileDecoration(
        firstMatch.badge || firstMatchWithBadge?.badge,
        firstMatch.tooltip || firstMatchWithTooltip?.tooltip,
        themeColor,
      );
    }

    return undefined;
  }
}

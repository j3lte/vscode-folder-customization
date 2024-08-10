import type { Event, FileDecorationProvider, ProviderResult, Uri } from "vscode";
import { EventEmitter, FileDecoration, ThemeColor, extensions, workspace } from "vscode";
import type { Change, ExtensionFolder, GitAPIState, GitRepository } from "@/types";
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

        this._gitAPI?.onDidChangeState(() => {
          this.fireOnChange();
        });
        this._gitAPI?.onDidOpenRepository((repo) => {
          repo.state.onDidChange(() => {
            this.fireOnChange();
          });
          this.fireOnChange();
        });
        this._gitAPI?.onDidCloseRepository(() => {
          this.fireOnChange();
        });

        this.fireOnChange();
      }
    }
  }

  private getAllGitChanges(): Change[] {
    if (this._gitAPI && this._gitAPI.repositories && this._gitAPI.repositories.length > 0) {
      return this._gitAPI.repositories.reduce((acc, repo) => {
        return [
          ...acc,
          ...(repo.state.workingTreeChanges || []),
          ...(repo.state.untrackedChanges || []),
          ...(repo.state.untrackedTreeChanges || []),
          ...(repo.state.indexChanges || []),
          ...(repo.state.mergeChanges || []),
        ];
      }, [] as Change[]);
    }
    return [];
  }

  public fireOnChange() {
    this._onDidChangeFileDecorations.fire(undefined);
  }

  constructor() {
    this.initializeGitAPI();

    workspace.onDidChangeConfiguration((e) => {
      if (
        e.affectsConfiguration(getExtensionWithOptionalName("folders")) ||
        e.affectsConfiguration(getExtensionWithOptionalName("colorChangedFolders"))
      ) {
        this.fireOnChange();
      }
    });
  }

  /**
   * @param uri {Uri} Location of the file or folder
   * @param ignore {boolean} Whether to ignore this and always return false
   * @returns {boolean} Whether the file or folder has been changed
   */
  private isUriChanged(uri: Uri, ignore?: boolean): boolean {
    if (ignore) {
      return false;
    }
    const changes = this.getAllGitChanges();

    return changes.length === 0
      ? false
      : changes.some((change) => {
          return (
            change.uri.path === uri.path ||
            change.uri.path.includes(uri.path) ||
            (change.originalUri &&
              (change.originalUri.path === uri.path || change.originalUri.path.includes(uri.path))) ||
            (change.renameUri && (change.renameUri.path === uri.path || change.renameUri.path.includes(uri.path)))
          );
        });
  }

  provideFileDecoration(uri: Uri): ProviderResult<FileDecoration> {
    const folders =
      workspace.getConfiguration(getExtensionWithOptionalName()).get<Array<ExtensionFolder>>("folders") || [];
    const ignoreChangedFiles = workspace
      .getConfiguration(getExtensionWithOptionalName())
      .get<boolean>("colorChangedFolders");

    const isUriChanged = this.isUriChanged(uri, ignoreChangedFiles);
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
      const themeColor =
        fileDecorationColor && fileDecorationColor !== "__blocked__" ? new ThemeColor(fileDecorationColor) : undefined;

      const badge = firstMatch.badge || firstMatchWithBadge?.badge;
      const tooltip = firstMatch.tooltip || firstMatchWithTooltip?.tooltip;

      const decoration = new FileDecoration(
        badge && badge !== "__blocked__" && badge.length > 0 && badge.length <= 2 ? badge : undefined,
        tooltip && tooltip !== "__blocked__" ? tooltip : undefined,
        themeColor,
      );

      return decoration;
    }

    return undefined;
  }
}

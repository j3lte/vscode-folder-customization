import { workspace } from "vscode";
import type { ExtensionFolder, ExtensionFolderInput } from "@/types";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { getExtensionWithOptionalName } from "@/utils";

export const updateConfig = (
  pathInput: Partial<ExtensionFolderInput>,
  { toRemove = false, provider }: { toRemove?: boolean; provider: FolderCustomizationProvider },
) => {
  const config = workspace.getConfiguration(getExtensionWithOptionalName());
  const folders = [...((config.get("folders") as ExtensionFolder[]) || [])];

  const existingPath = folders?.find((item) => item.path === pathInput.path);

  if (toRemove && existingPath) {
    const index = folders.indexOf(existingPath);
    folders.splice(index, 1);
    config.update("folders", folders);
  } else if (existingPath) {
    existingPath.color = pathInput.color === null ? undefined : pathInput.color || existingPath.color;
    existingPath.badge = pathInput.badge === null ? undefined : pathInput.badge || existingPath.badge;
    existingPath.tooltip = pathInput.tooltip === null ? undefined : pathInput.tooltip || existingPath.tooltip;
    config.update("folders", folders);
  } else {
    const input: Partial<ExtensionFolder> = {
      path: pathInput.path,
    };
    if (pathInput.color) {
      input.color = pathInput.color;
    }
    if (pathInput.badge) {
      input.badge = pathInput.badge;
    }
    if (pathInput.tooltip) {
      input.tooltip = pathInput.tooltip;
    }
    config.update("folders", [...folders, pathInput]);
  }

  provider.fireOnChange();
};

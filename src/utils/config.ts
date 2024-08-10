import { workspace } from "vscode";
import type { ExtensionFolder, ExtensionFolderInput } from "@/types";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { getExtensionWithOptionalName } from "@/utils";

const getConfigAndFolders = () => {
  const config = workspace.getConfiguration(getExtensionWithOptionalName());
  const folders = [...((config.get("folders") as ExtensionFolder[]) || [])];
  return { config, folders };
};

export const updateConfigForAll = (
  input: Array<Partial<ExtensionFolderInput>>,
  { toRemove = false, provider }: { toRemove?: boolean; provider: FolderCustomizationProvider },
) => {
  const { config, folders } = getConfigAndFolders();
  let fireOnChange = false;

  const inputPaths = input.map((item) => item.path);
  const existingFolders = folders.filter((item) => inputPaths.includes(item.path));
  const newFolders = input.filter((item) => !existingFolders.find((existing) => existing.path === item.path));

  if (toRemove && existingFolders.length > 0) {
    existingFolders.forEach((existingPath) => {
      const index = folders.indexOf(existingPath);
      folders.splice(index, 1);
    });
    fireOnChange = true;
    config.update("folders", folders);
  } else {
    existingFolders.forEach((existingFolder) => {
      const inputItem = input.find((item) => item.path === existingFolder.path);
      if (inputItem) {
        fireOnChange = true;
        existingFolder.color = inputItem.color === null ? undefined : inputItem.color || existingFolder.color;
        existingFolder.badge = inputItem.badge === null ? undefined : inputItem.badge || existingFolder.badge;
        existingFolder.tooltip = inputItem.tooltip === null ? undefined : inputItem.tooltip || existingFolder.tooltip;
      }
    });
    newFolders.forEach((newFolder) => {
      if (newFolder.path) {
        fireOnChange = true;
        const input: ExtensionFolder = {
          path: newFolder.path,
        };
        if (newFolder.color) {
          input.color = newFolder.color;
        }
        if (newFolder.badge) {
          input.badge = newFolder.badge;
        }
        if (newFolder.tooltip) {
          input.tooltip = newFolder.tooltip;
        }
        folders.push(input);
      }
    });
    config.update("folders", folders);
  }

  if (fireOnChange) {
    provider.fireOnChange();
  }
};

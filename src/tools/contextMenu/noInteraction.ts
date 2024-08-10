import type { Uri } from "vscode";
import { commands } from "vscode";
import type { ExtensionFolderInput } from "@/types";
import { updateConfigForAll } from "@/utils/config";
import { filterFolders } from "@/utils/fs";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

/**
 * Simple function to clear a customization
 */
const noInteractionCommand = (
  provider: FolderCustomizationProvider,
  commandName: string,
  input: Omit<Partial<ExtensionFolderInput>, "path">,
  toRemove?: boolean,
) =>
  commands.registerCommand(getExtensionWithOptionalName(commandName), async (_, uris: Array<Uri>) => {
    const filtered = await filterFolders(uris);
    if (!filtered.length) {
      return;
    }

    updateConfigForAll(
      filtered.map((uri) => ({
        ...input,
        path: cleanPath(uri.fsPath),
      })),
      { provider, toRemove },
    );
  });

export const clearColor = (provider: FolderCustomizationProvider) =>
  noInteractionCommand(provider, "clearColor", { color: null });

export const blockColor = (provider: FolderCustomizationProvider) =>
  noInteractionCommand(provider, "blockColor", { color: "__blocked__" });

export const clearBadge = (provider: FolderCustomizationProvider) =>
  noInteractionCommand(provider, "clearBadge", { badge: null });

export const blockBadge = (provider: FolderCustomizationProvider) =>
  noInteractionCommand(provider, "blockBadge", { badge: "__blocked__" });

export const clearTooltip = (provider: FolderCustomizationProvider) =>
  noInteractionCommand(provider, "clearTooltip", { tooltip: null });

export const clearCustomization = (provider: FolderCustomizationProvider) =>
  noInteractionCommand(provider, "clearCustomization", {}, true);

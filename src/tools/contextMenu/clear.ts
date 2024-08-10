import { commands } from "vscode";
import type { CommandCTX, ExtensionFolderInput } from "@/types";
import { updateConfigForAll } from "@/utils/config";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

/**
 * Simple function to clear a customization
 */
const clearCommand = (
  provider: FolderCustomizationProvider,
  commandName: string,
  input: Omit<Partial<ExtensionFolderInput>, "path">,
  toRemove?: boolean,
) =>
  commands.registerCommand(getExtensionWithOptionalName(commandName), (_, ctxs: Array<CommandCTX>) => {
    updateConfigForAll(
      ctxs.map((ctx) => ({
        ...input,
        path: cleanPath(ctx.fsPath),
      })),
      { provider, toRemove },
    );
  });

export const clearColor = (provider: FolderCustomizationProvider) =>
  clearCommand(provider, "clearColor", { color: null });

export const clearBadge = (provider: FolderCustomizationProvider) =>
  clearCommand(provider, "clearBadge", { badge: null });

export const clearTooltip = (provider: FolderCustomizationProvider) =>
  clearCommand(provider, "clearTooltip", { tooltip: null });

export const clearCustomization = (provider: FolderCustomizationProvider) =>
  clearCommand(provider, "clearCustomization", {}, true);

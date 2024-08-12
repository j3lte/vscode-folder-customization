import type { ExtensionContext } from "vscode";
import {
  blockBadge,
  blockColor,
  clearBadge,
  clearColor,
  clearCustomization,
  clearTooltip,
} from "@/tools/contextMenu/noInteraction";
import resetWorkspace from "@/tools/contextMenu/resetWorkspace";
import setColor from "@/tools/contextMenu/setColor";
import setEmojiBadge from "@/tools/contextMenu/setEmojiBadge";
import setTextBadge from "@/tools/contextMenu/setTextBadge";
import setTooltip from "@/tools/contextMenu/setTooltip";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";

export const registerContextMenu = async (context: ExtensionContext, provider: FolderCustomizationProvider) => {
  const disposables = [
    setColor(provider, context),
    clearColor(provider),
    blockColor(provider),

    setTextBadge(provider),
    setEmojiBadge(provider),
    blockBadge(provider),
    clearBadge(provider),

    setTooltip(provider),
    clearTooltip(provider),

    clearCustomization(provider),
    resetWorkspace(provider),
  ];
  context.subscriptions.push(...disposables);
  return disposables;
};

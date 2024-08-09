import type { ExtensionContext } from "vscode";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { clearBadge, clearColor, clearCustomization, clearTooltip } from "./contextMenu/clear";
import resetWorkspace from "./contextMenu/resetWorkspace";
import setColor from "./contextMenu/setColor";
import setEmojiBadge from "./contextMenu/setEmojiBadge";
import setTextBadge from "./contextMenu/setTextBadge";
import setTooltip from "./contextMenu/setTooltip";

export const registerContextMenu = async (context: ExtensionContext, provider: FolderCustomizationProvider) => {
  context.subscriptions.push(
    setColor(provider, context),
    setTextBadge(provider),
    setEmojiBadge(provider),
    setTooltip(provider),
    clearBadge(provider),
    clearColor(provider),
    clearCustomization(provider),
    clearTooltip(provider),
    resetWorkspace(provider),
  );
};

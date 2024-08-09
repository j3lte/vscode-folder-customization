import type { ExtensionContext } from "vscode";
import { window } from "vscode";
import { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { registerContextMenu } from "@/tools/register-context-menu";
import { firstTimeRun } from "@/utils";

export function activate(context: ExtensionContext) {
  const isEnabled = context.globalState.get("isEnabled");

  if (isEnabled !== false) {
    firstTimeRun(context);

    const provider = new FolderCustomizationProvider();
    context.subscriptions.push(window.registerFileDecorationProvider(provider));

    registerContextMenu(context, provider);
  }
}

export function deactivate() {}

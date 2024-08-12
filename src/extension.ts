import type { Disposable, ExtensionContext } from "vscode";
import { registerFileDecorationProvider } from "@/tools/folder-customization-provider";
import { registerContextMenu } from "@/tools/register-context-menu";
import { firstTimeRun } from "@/utils";

let disposables: Disposable[] = [];

export function activate(context: ExtensionContext) {
  disposables = [];

  const isEnabled = context.globalState.get("isEnabled");

  if (isEnabled !== false) {
    firstTimeRun(context);

    const { disposable, provider } = registerFileDecorationProvider(context);
    disposables.push(disposable);

    registerContextMenu(context, provider).then((newDisposables) => {
      disposables.push(...newDisposables);
    });
  }
}

export function deactivate() {
  disposables.forEach((disposable) => disposable.dispose());
  disposables = [];
}

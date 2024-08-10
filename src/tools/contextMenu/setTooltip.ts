import type { Uri } from "vscode";
import { commands, window } from "vscode";
import { updateConfigForAll } from "@/utils/config";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider) =>
  commands.registerCommand(getExtensionWithOptionalName("setTooltip"), async (_, ctxs: Array<Uri>) => {
    const value = await window.showInputBox({
      prompt: "Enter a tooltip",
    });

    updateConfigForAll(
      ctxs.map((ctx) => ({
        path: cleanPath(ctx.fsPath),
        tooltip: value,
      })),
      { provider },
    );
  });

export default disposable;

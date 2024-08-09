import { commands, window } from "vscode";
import { updateConfig } from "@/utils/config";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider) =>
  commands.registerCommand(getExtensionWithOptionalName("setTooltip"), async (ctx) => {
    const value = await window.showInputBox({
      prompt: "Enter a tooltip",
    });

    updateConfig(
      {
        path: cleanPath(ctx.fsPath),
        tooltip: value,
      },
      { provider },
    );
  });

export default disposable;

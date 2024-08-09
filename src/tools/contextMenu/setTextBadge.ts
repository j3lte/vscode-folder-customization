import { commands, window } from "vscode";
import { updateConfig } from "@/utils/config";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider) =>
  commands.registerCommand(getExtensionWithOptionalName("setTextBadge"), async (ctx) => {
    const value = await window.showInputBox({
      prompt: "Enter a symbol",
      placeHolder: "Example: TX",
      validateInput: (value): string | null => {
        if (value.length > 2) {
          return "Symbol must be 2 characters or less";
        }
        return null;
      },
    });

    updateConfig(
      {
        path: cleanPath(ctx.fsPath),
        badge: value,
      },
      { provider },
    );
  });

export default disposable;

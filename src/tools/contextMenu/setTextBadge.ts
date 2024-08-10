import type { Uri } from "vscode";
import { commands, window } from "vscode";
import { updateConfigForAll } from "@/utils/config";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider) =>
  commands.registerCommand(getExtensionWithOptionalName("setTextBadge"), async (_, ctxs: Array<Uri>) => {
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

    updateConfigForAll(
      ctxs.map((ctx) => ({
        path: cleanPath(ctx.fsPath),
        badge: value,
      })),
      { provider },
    );
  });

export default disposable;

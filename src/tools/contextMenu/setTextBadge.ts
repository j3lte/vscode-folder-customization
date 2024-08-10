import type { Uri } from "vscode";
import { commands, window } from "vscode";
import { updateConfigForAll } from "@/utils/config";
import { filterFolders } from "@/utils/fs";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider) =>
  commands.registerCommand(getExtensionWithOptionalName("setTextBadge"), async (_, uris: Array<Uri>) => {
    const filtered = await filterFolders(uris);
    if (!filtered.length) {
      return;
    }

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
      filtered.map((uri) => ({
        path: cleanPath(uri.fsPath),
        badge: value,
      })),
      { provider },
    );
  });

export default disposable;

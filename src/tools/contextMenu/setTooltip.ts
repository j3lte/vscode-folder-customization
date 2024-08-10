import type { Uri } from "vscode";
import { commands, window } from "vscode";
import { updateConfigForAll } from "@/utils/config";
import { filterFolders } from "@/utils/fs";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider) =>
  commands.registerCommand(getExtensionWithOptionalName("setTooltip"), async (_, uris: Array<Uri>) => {
    const filtered = await filterFolders(uris);
    if (!filtered.length) {
      return;
    }

    const value = await window.showInputBox({
      prompt: "Enter a tooltip",
    });

    updateConfigForAll(
      filtered.map((uri) => ({
        path: cleanPath(uri.fsPath),
        tooltip: value,
      })),
      { provider },
    );
  });

export default disposable;

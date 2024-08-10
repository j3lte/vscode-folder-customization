import type { ExtensionContext, Uri } from "vscode";
import { commands, window } from "vscode";
import { updateConfigForAll } from "@/utils/config";
import { filterFolders } from "@/utils/fs";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getColorsForPicker, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider, context: ExtensionContext) =>
  commands.registerCommand(getExtensionWithOptionalName("setColor"), async (_, uris: Array<Uri>) => {
    const filtered = await filterFolders(uris);
    if (!filtered.length) {
      return;
    }
    const availableColors = await getColorsForPicker(context);
    const selected = await window.showQuickPick(availableColors, {
      placeHolder: "Select a color",
    });

    if (!selected) {
      return;
    }

    updateConfigForAll(
      filtered.map((uri) => ({
        path: cleanPath(uri.fsPath),
        color: selected.description,
      })),
      { provider },
    );
  });

export default disposable;

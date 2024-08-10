import type { ExtensionContext, Uri } from "vscode";
import { commands, window } from "vscode";
import { updateConfigForAll } from "@/utils/config";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getColorsForPicker, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider, context: ExtensionContext) =>
  commands.registerCommand(getExtensionWithOptionalName("setColor"), async (_, ctxs: Array<Uri>) => {
    const availableColors = await getColorsForPicker(context);
    const selected = await window.showQuickPick(availableColors, {
      placeHolder: "Select a color",
    });

    if (!selected) {
      return;
    }

    updateConfigForAll(
      ctxs.map((ctx) => ({
        path: cleanPath(ctx.fsPath),
        color: selected.description,
      })),
      { provider },
    );
  });

export default disposable;

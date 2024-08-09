import type { ExtensionContext } from "vscode";
import { commands, window } from "vscode";
import { updateConfig } from "@/utils/config";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getColorsForPicker, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider, context: ExtensionContext) =>
  commands.registerCommand(getExtensionWithOptionalName("setColor"), async (ctx) => {
    const availableColors = await getColorsForPicker(context);
    const selected = await window.showQuickPick(availableColors, {
      placeHolder: "Select a color",
    });

    if (!selected) {
      return;
    }

    updateConfig(
      {
        path: cleanPath(ctx.fsPath),
        color: selected.description,
      },
      { provider },
    );
  });

export default disposable;

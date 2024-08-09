import { commands, window } from "vscode";
import emoji from "emojilib";
import { updateConfig } from "@/utils/config";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider) =>
  commands.registerCommand(getExtensionWithOptionalName("setEmojiBadge"), async (ctx) => {
    const availableEmojis = Object.keys(emoji).map((key) => ({
      label: `${key} (${emoji[key][0]})`,
    }));
    const selected = await window.showQuickPick(availableEmojis, {
      placeHolder: "Select an emoji",
    });

    if (!selected) {
      return;
    }

    const emojiKey = selected.label.split(" ")[0];

    updateConfig(
      {
        path: cleanPath(ctx.fsPath),
        badge: emojiKey,
      },
      { provider },
    );
  });

export default disposable;

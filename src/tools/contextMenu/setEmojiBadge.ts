import type { Uri } from "vscode";
import { commands, window } from "vscode";
import emoji from "emojilib";
import { updateConfigForAll } from "@/utils/config";
import { filterFolders } from "@/utils/fs";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { cleanPath, getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider) =>
  commands.registerCommand(getExtensionWithOptionalName("setEmojiBadge"), async (_, uris: Array<Uri>) => {
    const filtered = await filterFolders(uris);
    if (!filtered.length) {
      return;
    }

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

    updateConfigForAll(
      filtered.map((uri) => ({
        path: cleanPath(uri.fsPath),
        badge: emojiKey,
      })),
      { provider },
    );
  });

export default disposable;

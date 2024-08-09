/* eslint-disable no-useless-escape */
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ExtensionContext, QuickPickItem } from "vscode";
import { Uri, commands, window, workspace } from "vscode";

export const firstTimeRun = (context: ExtensionContext) => {
  const flag = "FOLDER_CUSTOMIZATION_FIRST_TIME_RUN";

  if (context.globalState.get(flag, true)) {
    window
      .showInformationMessage(
        "Thank you for installing Folder Customization! To activate it, please reload the window.",
        "Reload Window",
      )
      .then((choice) => {
        if (choice === "Reload Window") {
          commands.executeCommand("workbench.action.reloadWindow");
        }
      });

    context.globalState.update(flag, false);
  }
};

export const getColorsForPicker = async (context: ExtensionContext): Promise<Array<QuickPickItem>> => {
  const pkgPath = path.join(__dirname, "..", "package.json");
  const { contributes } = JSON.parse(await readFile(pkgPath, "utf-8"));
  const colors = contributes.colors as Array<{
    id: string;
    description: string;
  }>;

  const mapped = colors
    // Sort by description. Some descriptions are the same, so sort by ID second
    .sort((a, b) => a.description.localeCompare(b.description) || a.id.localeCompare(b.id))
    // We append the ID number to the descriptions that are the same
    .reduce(
      (acc, { id, description }, _i, arr) => {
        const hasOtherWithSameDescription = arr.filter((item) => item.description === description).length > 1;

        if (hasOtherWithSameDescription) {
          const idNumber = acc.filter((item) => item.origDescription === description).length + 1;
          acc.push({
            id,
            description: `${description} (${idNumber})`,
            origDescription: description,
          });
        } else {
          acc.push({ id, description, origDescription: description });
        }

        return acc;
      },
      [] as Array<{ id: string; description: string; origDescription: string }>,
    )
    // Map to the format that the QuickPick expects
    .map<QuickPickItem>(({ id, description }) => {
      const iconPath = Uri.file(path.join(context.extensionPath, "resources", "color_icons", `${id}.png`));

      return {
        label: description,
        description: id,
        iconPath,
      };
    });

  return mapped;
};

export const EXTENSION_ID = "folder-customization";

/**
 * Get the extension ID with an optional section.
 * @param section The optional section.
 * @returns The extension ID with the optional section.
 */
export const getExtensionWithOptionalName = (section?: string) =>
  !section ? EXTENSION_ID : `${EXTENSION_ID}.${section}`;

export const cleanPath = (path: string) => {
  const isWindows = path.includes(":\\");
  const ws = workspace?.workspaceFolders?.[0];
  if (isWindows) {
    return path.replace(new RegExp(`.*\(${ws?.name})`), "$1") + "\\";
  }
  return path.replace(new RegExp(`.*\/(${ws?.name})`), "$1") + "/";
};

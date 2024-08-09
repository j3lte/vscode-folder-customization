import { commands, window, workspace } from "vscode";
import type { FolderCustomizationProvider } from "@/tools/folder-customization-provider";
import { getExtensionWithOptionalName } from "@/utils";

const disposable = (provider: FolderCustomizationProvider) =>
  commands.registerCommand(getExtensionWithOptionalName("resetWorkspace"), async () => {
    window
      .showInformationMessage("This will reset all customizations for this workspace. Are you sure?", "Yes")
      .then((choice) => {
        if (choice === "Yes") {
          const config = workspace.getConfiguration(getExtensionWithOptionalName());
          config.update("folders", []);
          provider.fireOnChange();
        }
      });
  });

export default disposable;

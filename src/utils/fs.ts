import type { Uri } from "vscode";
import { stat } from "fs/promises";

export const filterFolders = async (uris: Uri[]): Promise<Uri[]> => {
  const folders: Uri[] = [];
  for (const uri of uris) {
    if (!uri.fsPath) {
      continue;
    }
    try {
      const statResult = await stat(uri.fsPath);
      if (statResult.isDirectory()) {
        folders.push(uri);
      }
    } catch (_) {
      // Ignore
    }
  }
  return folders;
};

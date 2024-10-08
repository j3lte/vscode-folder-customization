<div style="padding: 0 25px 0">
<div align="center"><img src="https://github.com/j3lte/vscode-folder-customization/raw/main/resources/images/icon.png" alt="Logo" height="128" /></div><h1 align="center">Folder Customization</h1><h3 align="center" style="border:none">Set a color, text badge, emoji badge or tooltip for any folder in your workspace.</h2>
<br/>
<div align="center">
<img src="https://github.com/j3lte/vscode-folder-customization/raw/main/assets/recording.gif" alt="Recording" />
</div>
<div align="center"><br />This extension allows you to customize your folders in your workspace settings, by setting a color, badge (text or emoji) and tooltip. This is visible in the Explorer view and the tabs.</div>
<br/>


## Features

Right click on a folder in the Explorer view and select `Folder Customization` to open the context menu.<br />

![Folder Customization](https://github.com/j3lte/vscode-folder-customization/raw/main/assets/screenshots/screenshot-2.png)

Select an emoji badge for a folder.
<br />

![Folder Customization](https://github.com/j3lte/vscode-folder-customization/raw/main/assets/screenshots/screenshot-3.png)

Select a color for a folder.
<br />

![Folder Customization](https://github.com/j3lte/vscode-folder-customization/raw/main/assets/screenshots/screenshot-4.png)

| **Features**                                      |
| ------------------------------------------------- |
| Customize the color of a folder (256 ANSI Colors) |
| Set a text badge for a folder                     |
| Set an emoji as text badge for a folder           |
| Set a tooltip for a folder                        |

## Requirements

This extension does not have any additional requirements. Internally it uses the `vscode.git` extension to determine if it should set a color or not.

## Usage

> Right click on a folder in the Explorer view and select `Folder Customization` to open the context menu.

| Command                           | Description                                                                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `Set Color`                       | _Set the color of the folder. This will colorize the folder (and all subfolders) in the Explorer view and the tabs (name)._            |
| `Clear Color`                     | _Clear the color of the folder while keeping the badge and tooltip._                                                                   |
| `Set Text Badge`                  | _Set a text badge for the folder. This will show next to the name of a file/folder. Note that a Text Badge can only be **2** letters._ |
| `Set Emoji Badge`                 | _Set an emoji badge for the folder. This will show next to the name of a file/folder._                                                 |
| `Clear Badge`                     | _Clear the badge of the folder while keeping the color and tooltip._                                                                   |
| `Set Tooltip`                     | _Set a tooltip for the folder. This will show when hovering over a file/folder in the Explorer view._                                  |
| `Clear Tooltip`                   | _Clear the tooltip of the folder while keeping the color and badge._                                                                   |
| `Block Color`                     | _Block the parent folder from setting a color._                                                                                        |
| `Block Badge`                     | _Block the parent folder from setting a badge._                                                                                        |
| `Clear All Folder Customizations` | _Clear all customizations of the folder._                                                                                              |
| `Reset Workspace`                 | _Clear all customizations of all folders in the workspace._                                                                            |

## Extension Settings

### Folders

This extension wlll save the configuration for every folder in `folder-customization.folders` in your workspace settings. This has the following keys:

| Key       | Description                                                             |
| --------- | ----------------------------------------------------------------------- |
| `path`    | Path of the folder                                                      |
| `color`   | Color of the folder (`foldercustomization.AnsiColor0-255`) _(optional)_ |
| `badge`   | Badge text of the folder _(optional)_                                   |
| `tooltip` | Tooltip of the folder _(optional)_                                      |

> These settings don't have to set by hand, you can use the context menu (see **Usage**) in the Explorer view to set these settings per folder.
> Note: When `color` or `badge` is set as `"__blocked__"`, it means it will block the parent folder from setting a color, or badge. This doesn't work for `tooltip`.

### Other settings

- `folder-customization.colorChangedFolders` - _Color changed folders in the Explorer view._ (default: `false`)

## Release notes

Please see the [changelog](CHANGELOG.md) for the information about the latest updates.

## Following extension guidelines

The extension follows the [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) that are provided by Microsoft

# Folder Customization

This extension allows you to customize your folders in your workspace settings, by setting a color, badge (text or emoji) and tooltip. This is visible in the Explorer view and the tabs.

![Folder Customization](https://i.imgur.com/9P8JkZg.png)

## Features

![Folder Customization](https://i.imgur.com/KI9Yk2q.png)
![Folder Customization](https://i.imgur.com/3ZjRzAj.png)
![Folder Customization](https://i.imgur.com/Lm5WoDl.png)

- Customize the color of a folder (256 ANSI Colors)
- Set a text badge for a folder
- Set an emjoi as text badge for a folder
- Set a tooltip for a folder

## Requirements

This extension does not have any additional requirements. Internally it uses the `vscode.git` extension to determine if it should set a color or not.

## Usage

> Right click on a folder in the Explorer view and select `Folder Customization` to open the context menu.

| Command                           | Description                                                                                                                            |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `Set Color`                       | _Set the color of the folder. This will colorize the folder (and all subfolders) in the Explorer view and the tabs (name)._            |
| `Clear Folder Color`              | _Clear the color of the folder while keeping the badge and tooltip._                                                                   |
| `Set Folder Text Badge`           | _Set a text badge for the folder. This will show next to the name of a file/folder. Note that a Text Badge can only be **2** letters._ |
| `Set Folder Emoji Badge`          | _Set an emoji badge for the folder. This will show next to the name of a file/folder._                                                 |
| `Clear Folder Badge`              | _Clear the badge of the folder while keeping the color and tooltip._                                                                   |
| `Set Folder Tooltip`              | _Set a tooltip for the folder. This will show when hovering over a file/folder in the Explorer view._                                  |
| `Clear Folder Tooltip`            | _Clear the tooltip of the folder while keeping the color and badge._                                                                   |
| `Clear All Folder Customizations` | _Clear all customizations of the folder._                                                                                              |
| `Reset Workspace`                 | _Clear all customizations of all folders in the workspace._                                                                            |

## Extension Settings

This extension wlll save the configuration for every folder in `folder-customization.folders` in your workspace settings. This has the following keys:
- `path` - Path of the folder
- `color` - Color of the folder (`foldercustomization.AnsiColor0-255`) (optional)
- `badge` - Badge text of the folder (optional)
- `tooltip` - Tooltip of the folder (optional)

> These settings don't have to set by hand, you can use the context menu (see **Usage**) in the Explorer view to set these settings per folder.

## Release notes

Please see the [changelog](CHANGELOG.md) for the information about the latest updates.

## Following extension guidelines

The extension follows the [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines) that are provided by Microsoft

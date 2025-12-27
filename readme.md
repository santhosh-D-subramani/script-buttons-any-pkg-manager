

# Universal Script Buttons

> **DISCLAIMER:** This extension is a **fork** of the original [Script Buttons](https://marketplace.visualstudio.com/items?itemName=JackWaterfall.script-buttons) by JackWaterfall. It is maintained electronically by a separate author to provide additional support for multiple package managers (**pnpm**, **yarn**, **bun**) which are not available in the original version. This is **not** the original extension.

**A generic, multi-manager version of "Script Buttons".**

This extension builds upon the ease of use of the original but extends it to the modern JavaScript ecosystem. It automatically detects your scripts and lets you run them with your preferred tool.

Make running custom scripts easier!

## Features

When a `package.json` file is detected in the current workspace folder, a button is created on the status bar for each script. When this button is clicked, it runs the script in a terminal using your **preferred package manager**.

![scripts](images/scripts.png)

### Multi-Package Manager Support (New!)
Unlike the original extension which defaults to `npm`, this version allows you to switch between:
* `npm`
* `pnpm`
* `yarn`
* `bun`

You can change this globally or per workspace in your VS Code settings.

### Custom Scripts
Scripts can also be loaded in from a `script-buttons.json` file. 

![scripts](images/script-buttons.json.png)

When no scripts can be found a warning message will be displayed.

![no-scripts](images/no-scripts.png)

> Tip: If you have since added a package.json/script-buttons.json file or have modified existing scripts clicking the refresh button will attempt to find scripts again and update the buttons.

## Extension Settings

This extension contributes the following settings:

* `script-buttons.packageManager`: Select the package manager to use for running scripts.
    * Options: `npm` (default), `pnpm`, `yarn`, `bun`.

To change this, go to **File > Preferences > Settings**, search for "Script Buttons", and choose your preferred tool from the dropdown.

## Known Issues

There are currently no known issues.

## Release Notes

### 1.0.0 (Fork Release)
* Forked from original `Script Buttons` v1.1.1.
* Added `configuration` to package.json for selecting package managers.
* Added logic to support `pnpm`, `yarn`, and `bun` commands.
* Updated status bar labels to reflect the active package manager.

---

### Original History (JackWaterfall)

**1.1.1**
Added an NPM install button if a package.json file is detected.

**1.1.0**
Added the ability to define scripts without a package.json file, this is done using a script-buttons.json file.

**1.0.0**
Initial release.
import { promises as fsPromises } from 'fs';
import vscode from 'vscode';
import { workspace } from 'vscode';
import { Disposable, PackageJson, Scripts } from './types';

const { readFile } = fsPromises;

export function activate(context: vscode.ExtensionContext) {
  const disposables: Disposable[] = [];
  const terminals: { [name: string]: vscode.Terminal } = {};
  const cwd = getWorkspaceFolderPath();

  function addDisposable(disposable: Disposable) {
    context.subscriptions.push(disposable);
    disposables.push(disposable);
  }

  function cleanup() {
    disposables.forEach((disposable) => disposable.dispose());
  }

  function createStatusBarItem(text: string, tooltip?: string, command?: string, color?: string) {
    const item = vscode.window.createStatusBarItem(1, 0);
    item.text = text;
    item.command = command;
    item.tooltip = tooltip;
    item.color = color;

    addDisposable(item);
    item.show();

    return item;
  }

  function getWorkspaceFolderPath() {
    const workspaceFolder = workspace.workspaceFolders?.[0];
    const path = workspaceFolder?.uri.fsPath;
    return path;
  }

  async function getJsonFile<T>(path: string) {
    const fileBuffer = await readFile(path);
    const data = JSON.parse(fileBuffer.toString()) as T;
    return data;
  }

  async function getPackageJson() {
    const packageJson = await getJsonFile<PackageJson>(`${cwd}/package.json`);
    return packageJson;
  }

  async function getConfigJson() {
    const config = await getJsonFile<Scripts>(`${cwd}/script-buttons.json`);
    return config;
  }

  function createErrorMessage() {
    createStatusBarItem(`$(circle-slash) Script Buttons`, `No scripts found!`, undefined);
  }

  function createRefreshButton() {
    createStatusBarItem(
      '$(refresh)',
      'Script Buttons: Refetches the scripts from your package.json file',
      'script-buttons.refreshScripts',
    );
  }

  
  function createScriptButtonsAndCommands(scripts: Scripts, isNpm = false, packageManager = 'npm') {
    for (const name in scripts) {
      
      let command = scripts[name];
      
      if (isNpm) {
        if (packageManager === 'npm' || packageManager === 'pnpm' || packageManager === 'bun') {
           command = `${packageManager} run ${name}`;
        } else if (packageManager === 'yarn') {
           command = `yarn ${name}`;
        }
      }

      const vscCommand = createVscCommand(command, name, isNpm);

      const color = isNpm ? 'white' : undefined;
      createStatusBarItem(name, command, vscCommand, color);
    }
  }

  function createVscCommand(command: string, name: string, isNpm = false) {
    const vscCommand = `script-buttons.${isNpm && 'npm-'}${name.replace(' ', '')}`;

    const commandDisposable = vscode.commands.registerCommand(vscCommand, async () => {
      let terminal = terminals[vscCommand];

      if (terminal) {
        delete terminals[vscCommand];
        terminal.dispose();
      }

      terminal = vscode.window.createTerminal({
        name,
        cwd,
      });

      terminals[vscCommand] = terminal;

      terminal.show(true);
      terminal.sendText(command);
    });

    addDisposable(commandDisposable);
    return vscCommand;
  }

  async function init() {
    cleanup();
    registerCommands();
    createRefreshButton();

    
    const config = vscode.workspace.getConfiguration('script-buttons');
    const pm = config.get<string>('packageManager') || 'npm';

    let scripts: Scripts = {};

    try {
      const packageJson = await getPackageJson();
      console.log('Loaded package.json!');

      
      const installCmd = pm === 'yarn' ? 'yarn install' : `${pm} install`;
      const vscCommand = createVscCommand(installCmd, 'install', true);
      
      
      const label = pm.charAt(0).toUpperCase() + pm.slice(1);
      createStatusBarItem(`${label} Install`, installCmd, vscCommand, 'white');

      
      createScriptButtonsAndCommands(packageJson.scripts, true, pm);
      scripts = { ...scripts, ...packageJson.scripts };
    } catch {
      console.log('No package.json found!');
    }

    try {
      const configScripts = await getConfigJson();
      console.log('Loaded script-buttons.json!');

      createScriptButtonsAndCommands(configScripts);
      scripts = { ...scripts, ...configScripts };
    } catch {
      console.log('No script-buttons.json found!');
    }

    if (!Object.keys(scripts).length) {
      createErrorMessage();
    }
  }

  function registerCommands() {
    const refreshScriptsDisposable = vscode.commands.registerCommand(
      'script-buttons.refreshScripts',
      () => {
        init();
      },
    );

    addDisposable(refreshScriptsDisposable);
  }

  init();
}
export function deactivate() {}

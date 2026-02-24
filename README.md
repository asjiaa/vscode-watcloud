# WATcloud for VS Code

Connect to a WATcloud login node, bootstrap the environment, and see Slurm cluster status without leaving the editor.

## Prerequisites

- [Remote - SSH](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh) extension
- SSH key and cluster username (from WATcloud onboarding)

## Installation

1. Install from latest `vscode-watcloud-ui-*.vsix`.
2. Install from latest `vscode-watcloud-workspace-*.vsix`

To view cluster status and generate job commands on remote VS Code server on first-time connect.

3. Navigate to **Extensions** tab on VS Code sidebar.
4. Scroll to **WATcloud Remote** extension and click **Install in SSH: `<login-node>`**

## Usage

1. Click the **WATcloud** cloud icon in the activity bar to open the view.
2. **Auto-generate SSH Config** — adds `wato-login1` / `wato-login2` entries to `~/.ssh/config`. Also available in the view welcome when unconfigured.
3. **Connect to Node** — right-click a configured login node, or use Command Palette. Opens a new Remote-SSH window; bootstrap verifies a first-time connection.
4. **Login Nodes** / **Compute Nodes** — cluster views on local vs remote VS Code server. Use **Refresh Login Nodes** or **Refresh Compute Nodes** in the view title bar.
5. **Start Job** — from the Compute Nodes view title bar or Command Palette. Builds an `srun` command (CPU, memory, GRES, time) and runs it in the terminal.

## Development

**Prerequisites:** Node.js, npm, and VS Code with the `code` CLI in your PATH.

### Structure

- `packages/ui` — Local extension. Login views, SSH config, connect, bootstrap. Installs the workspace extension via extensionPack.
- `packages/workspace` — Remote extension. Compute views, Slurm service, job command. Runs on the SSH remote.

### Build

```bash
# Install dependencies
npm install

# Compile both packages
npm run compile

# Watch mode (compile on change)
npm run watch
```

### Package

```bash
# Package both extensions
npm run package

# Or package individually
npm run package:ui
npm run package:workspace
```

### Install

```bash
npm run install
```
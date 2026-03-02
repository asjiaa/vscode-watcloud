# WATcloud for VS Code

Connect to a WATcloud login node, bootstrap the environment, and see Slurm cluster status without leaving the editor.

## Prerequisites

- SSH key and cluster username (from WATcloud onboarding)

## Installation

1. Install from latest `vscode-watcloud-ui-*.vsix`
2. Install from latest `vscode-watcloud-workspace-*.vsix`

To view cluster status and start jobs, install the extension on the remote server:

3. Navigate to the **Extensions** tab in the VS Code sidebar
4. Find **WATcloud Remote** and click **Install in SSH: `<login-node>`**

## Usage

### SSH Configuration

**Auto-generate SSH Config** adds `wato-login1` / `wato-login2` entries to `~/.ssh/config`. Available in the view welcome screen when unconfigured.

### Connecting to a Login Node

**Connect to Node** via right-click a configured login node in the WATcloud view, or use the Command Palette. Opens a new Remote-SSH window and verifies the environment on first-time connection.

### Cluster Status

**Login Nodes** / **Compute Nodes** cluster view available on the local and remote VS Code server respectively. Use **Refresh Login Nodes** or **Refresh Compute Nodes** in the view title bar to update status.

### Starting a Job

**Start Job** — available from the Compute Nodes view title bar or Command Palette. Prompts for CPU, memory, GRES, and time, then submits an `srun` job and automatically opens a tunnel to the compute node in a new VS Code window.

> **First-time tunnel:** GitHub authentication may be required the first time a tunnel is established. If the tunnel fails to connect, open the **Output** panel (`Ctrl+Shift+U` / `Cmd+Shift+U`) and select **WATcloud Tunnel** from the dropdown to view the authentication link.

## Development

**Prerequisites:** Node.js, npm, and VS Code with the `code` CLI in your PATH.

### Structure

- `packages/ui` — Local extension. Login views, SSH config, connect, bootstrap. Installs the workspace extension via extensionPack.
- `packages/workspace` — Remote extension. Compute views, Slurm service, start job. Runs on the SSH remote.

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
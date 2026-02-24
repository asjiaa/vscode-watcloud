import * as vscode from 'vscode'
import { ComputeProvider } from './views/compute'
import { SlurmService } from './services/slurm'
import { startJobCommand } from './commands/job'

export async function activate(context: vscode.ExtensionContext) {
    vscode.commands.executeCommand('setContext', 'watcloud.remote', vscode.env.remoteName === 'ssh-remote')

    const computeProvider = new ComputeProvider()
    vscode.window.registerTreeDataProvider('watcloud-compute', computeProvider)

    context.subscriptions.push(
        vscode.commands.registerCommand('watcloud.refreshCompute', async () => {
            try {
                await SlurmService.status()
                computeProvider.refresh()
                vscode.window.showInformationMessage('Compute node status refreshed')
            } catch (err) {
                vscode.window.showErrorMessage(`Compute node status refresh failed: ${err}`)
            }
        })
    )

    context.subscriptions.push(
        vscode.commands.registerCommand('watcloud.job', async () => {
            await startJobCommand()
        })
    )

    computeProvider.refresh()
}

export function deactivate() {}

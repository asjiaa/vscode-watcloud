import * as vscode from 'vscode'
import { generateSshCommand } from './commands/ssh'
import { SshConfigService } from './services/ssh'
import { LoginProvider } from './views/login'
import { LoginNodeItem } from './views/node'
import { ConnectService } from './services/connect'

export async function activate(context: vscode.ExtensionContext) {
    vscode.commands.executeCommand('setContext', 'watcloud.remote', vscode.env.remoteName === 'ssh-remote')
    vscode.commands.executeCommand('setContext', 'watcloud.config', SshConfigService.check())

    const loginProvider = new LoginProvider()
    vscode.window.registerTreeDataProvider('watcloud-login', loginProvider)

    context.subscriptions.push(
        vscode.commands.registerCommand('watcloud.ssh', async (node?: LoginNodeItem) => {
            const host = node?.label
            await generateSshCommand(host)
            loginProvider.refresh()
        })
    )

    context.subscriptions.push(
        vscode.commands.registerCommand('watcloud.connect', async (node?: LoginNodeItem) => {
            const host =
                node?.label ??
                (await vscode.window.showQuickPick(['wato-login1', 'wato-login2'], { prompt: 'Login Node' }))
            if (!host) return

            if (!SshConfigService.check(host)) {
                vscode.window.showErrorMessage(`Login node ${host} is not configured`)
                return
            }

            const ok = await ConnectService.verify(host)
            if (!ok) {
                vscode.window.showErrorMessage(`SSH connect to ${host} failed`)
                return
            }

            await ConnectService.connect(host)
            vscode.window.showInformationMessage(`Connected to ${host}`)
            loginProvider.refresh()
        })
    )

    context.subscriptions.push(
        vscode.commands.registerCommand('watcloud.refreshLogin', () => {
            loginProvider.refresh()
            vscode.window.showInformationMessage('Login node configuration refreshed')
        })
    )
}

export function deactivate() {}

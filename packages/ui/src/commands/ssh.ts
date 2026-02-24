import * as vscode from 'vscode'
import { SshConfigService } from '../services/ssh'

export async function generateSshCommand(node?: string) {
    let host = node
    if (!host) {
        host = await vscode.window.showQuickPick(['wato-login1', 'wato-login2'], {
            prompt: 'Machine'
        })
        if (!host) return
    }

    if (SshConfigService.check(host)) {
        const proceed = await vscode.window.showWarningMessage(
            `${host} already exists as host in SSH config file`,
            { modal: true },
            'Continue'
        )
        if (proceed !== 'Continue') return
    }

    const user = await vscode.window.showInputBox({
        prompt: 'Compute Cluster Username',
        placeHolder: 'The username that you submitted via the onboarding form'
    })
    if (!user) return

    const identityFile = await vscode.window.showInputBox({
        prompt: 'SSH Key Path',
        placeHolder: 'The path to the SSH key that you submitted via the onboarding form',
        value: '~/.ssh/id_rsa',
        validateInput: (text) => SshConfigService.validate(text)
    })
    if (!identityFile) return

    try {
        SshConfigService.generate(host, user, identityFile)
        vscode.window.showInformationMessage(`Auto-generated new SSH config entry for ${host}`)
        vscode.commands.executeCommand('setContext', 'watcloud.config', true)
    } catch (error) {
        vscode.window.showErrorMessage(`${error}`)
    }
}

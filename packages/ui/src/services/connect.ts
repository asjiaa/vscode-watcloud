import * as vscode from 'vscode'
import * as cp from 'child_process'

export class ConnectService {
    /**
     * Verify valid host connection, handle initial SSH host key verification
     */
    static async verify(host: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            const ssh = cp.spawn('ssh', [
                '-o', 'BatchMode=yes',
                '-o', 'ConnectTimeout=10',
                '-o', 'StrictHostKeyChecking=accept-new',
                host,
                'exit'
            ])

            ssh.on('close', code => resolve(code === 0))
            ssh.on('error', () => resolve(false))
        })
    }

    static async connect(host: string): Promise<void> {
        const ext = vscode.extensions.getExtension('ms-vscode-remote.remote-ssh')

        if (!ext) {
            const install = await vscode.window.showErrorMessage(
                'Remote - SSH extension is required to connect',
                'Install'
            )

            if (install) {
                vscode.commands.executeCommand(
                    'workbench.extensions.installExtension',
                    'ms-vscode-remote.remote-ssh'
                )
            }
            return
        }

        const uri = vscode.Uri.parse(`vscode-remote://ssh-remote+${host}/`)

        await vscode.commands.executeCommand(
            'vscode.openFolder',
            uri,
            { forceNewWindow: true }
        )
    }
}

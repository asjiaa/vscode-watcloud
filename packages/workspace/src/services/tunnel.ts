import * as cp from 'child_process'
import * as path from 'path'
import * as vscode from 'vscode'

export interface Tunnel {
    name: string
    remote: string
}

const output = vscode.window.createOutputChannel('WATcloud Remote')

export class TunnelService {
    private static proc: cp.ChildProcess | null = null

    static async start(
        flags: string[],
        context: vscode.ExtensionContext
    ): Promise<void> {

        const tunnel = await TunnelService.launch(
            flags,
            context.extensionPath
        )

        if (!tunnel) {
            vscode.window.showErrorMessage('Failed to start tunnel')
            return
        }

        const uri = vscode.Uri.parse(
            `vscode-remote://tunnel+${tunnel.name}${tunnel.remote}`
        )

        await vscode.commands.executeCommand(
            'vscode.openFolder',
            uri,
            { forceNewWindow: true }
        )
    }

    static stop(): void {
        TunnelService.proc?.kill()
        TunnelService.proc = null
    }

    private static launch(
        flags: string[],
        ext: string
    ): Promise<Tunnel | null> {

        return new Promise((resolve) => {

            const script = path.join(ext, 'scripts', 'tunnel.sh')
            const args = [...flags, 'bash', script]

            const proc = cp.spawn('srun', args, { shell: false })

            let buffer = ''
            let resolved = false

            const filter = (chunk: Buffer) => {
                output.append(chunk.toString())
                
                if (resolved) return

                buffer += chunk.toString()

                const match = buffer.match(/https:\/\/vscode\.dev\/tunnel\/([^\s/]+)(\/[^\s]*)/)
                if (match) {
                    resolved = true
                    resolve({
                        name: match[1],
                        remote: match[2],
                    })
                }
            }

            proc.stdout.on('data', filter)
            proc.stderr.on('data', filter)

            proc.on('error', () => {
                if (!resolved) resolve(null)
            })

            proc.on('close', () => {
                if (!resolved) resolve(null)
            })
        })
    }
}
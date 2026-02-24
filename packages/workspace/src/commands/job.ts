import * as vscode from 'vscode'

export async function startJobCommand() {
    const cpus = await vscode.window.showInputBox({
        prompt: 'CPU',
        placeHolder: 'Request number of CPUs per task',
        validateInput: text => /^\d*$/.test(text) ? null : 'Integer input required'
    })
    if (cpus === undefined) return

    const mem = await vscode.window.showInputBox({
        prompt: 'Memory',
        placeHolder: 'Request memory in GiB',
        validateInput: text => /^\d*$/.test(text) ? null : 'Integer input required'
    })
    if (mem === undefined) return

    const gres: string[] = []

    while (true) {
        const tmpdisk = gres.some(e => e.startsWith('tmpdisk:'))
        const shard = gres.some(e => e.startsWith('shard:'))
        const gpu = gres.some(e => e.startsWith('gpu:'))

        const options: string[] = ['Continue']
        if (!tmpdisk) options.push('tmpdisk')
        if (!shard && !gpu) options.push('shard', 'gpu')

        const resource = await vscode.window.showQuickPick(options, {
            placeHolder: 'Select a Generic Resource (GRES)'
        })

        if (resource === undefined) return
        if (resource === 'Continue') break

        let entry = ''
        if (resource === 'tmpdisk') {
            const size = await vscode.window.showInputBox({
                prompt: 'Temporary Disk Space',
                placeHolder: 'Request temporary disk space in MiB',
                validateInput: text => text && /^\d*$/.test(text) ? null : 'Integer input required'
            })
            if (size === undefined) return
            if (size) entry = `tmpdisk:${size}`
        } else if (resource === 'shard' || resource === 'gpu') {
            const type = await vscode.window.showInputBox({
                prompt: 'Type',
                placeHolder: 'See available GPU types with scontrol'
            })
            if (type === undefined) return
            const count = await vscode.window.showInputBox({
                prompt: resource === 'shard' ? 'VRAM' : 'GPU',
                placeHolder: resource === 'shard' ? 'Request size of VRAM in MiB' : 'Request number of whole GPUs',
                validateInput: text => text && /^\d*$/.test(text) ? null : 'Integer input required'
            })
            if (count === undefined) return
            if (count) {
                entry = type ? `${resource}:${type.trim().toLowerCase().replace(/ /g, '_')}:${count}` : `${resource}:${count}`
            }
        }

        if (entry) gres.push(entry)
    }

    const time = await vscode.window.showInputBox({
        prompt: 'Running Time',
        placeHolder: 'Request running time in hour:minute:second format',
        validateInput: text => /^(?:\d{1,2}:\d{1,2}:\d{1,2})?$/.test(text) ? null : 'hour:minute:second input required'
    })
    if (time === undefined) return

    const flags: string[] = ['srun']

    if (cpus) flags.push(`--cpus-per-task ${cpus}`)
    if (mem) flags.push(`--mem ${mem}G`)
    if (gres.length > 0) flags.push(`--gres ${gres.join(',')}`)

    if (time) {
        const [h, m, s] = time.split(':').map(v => v.padStart(2, '0'))
        flags.push(`--time ${h}:${m}:${s}`)
    }

    flags.push('--pty bash')

    const terminal = vscode.window.activeTerminal || vscode.window.createTerminal()
    terminal.show()
    terminal.sendText(flags.join(' '), false)
}

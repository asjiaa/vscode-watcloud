import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

export class SshConfigService {
    private static readonly config = path.join(os.homedir(), '.ssh', 'config')
    private static readonly nodes = ['wato-login1', 'wato-login2']
    
    static check(host?: string): boolean {
        if (!fs.existsSync(this.config)) return false
        const content = fs.readFileSync(this.config, 'utf-8')
        const check = (h: string) =>
            new RegExp(`^Host\\s+(?:[^\\n]*\\s)?${h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\s|$)`, 'm').test(content)
        return host ? check(host) : this.nodes.some(check)
    }

    static generate(host: string, user: string, identityFile: string): string {
        let content = ''
        if (fs.existsSync(this.config)) {
            content = fs.readFileSync(this.config, 'utf-8')
        }
        const prefix = content.length > 0 ? '\n'.repeat(2 - (content.match(/\n*$/)?.[0].length ?? 0)).slice(0, 2) : ''
        const entry = `${prefix}Host ${host}\n  HostName ${host}.ext.watonomous.ca\n  User ${user}\n  IdentityFile ${identityFile}\n`
        fs.appendFileSync(this.config, entry, { mode: 0o600 })
        return this.config.replace(os.homedir(), '~')
    }

    static validate(filepath: string): string | undefined {
        const resolved = filepath.startsWith('~/') ? path.join(os.homedir(), filepath.slice(2)) : filepath
        if (!fs.existsSync(resolved)) {
            return `${resolved} not found`
        }
        return undefined
    }
}

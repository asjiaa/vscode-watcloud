import * as vscode from 'vscode'
import { LoginNodeItem } from './node'
import { SshConfigService } from '../services/ssh'

export class LoginProvider implements vscode.TreeDataProvider<LoginNodeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<LoginNodeItem | undefined | void> = new vscode.EventEmitter<LoginNodeItem | undefined | void>()
    readonly onDidChangeTreeData: vscode.Event<LoginNodeItem | undefined | void> = this._onDidChangeTreeData.event

    private readonly nodes = ['wato-login1', 'wato-login2']

    refresh(): void {
        this._onDidChangeTreeData.fire()
    }

    getTreeItem(element: LoginNodeItem): vscode.TreeItem {
        return element
    }

    getChildren(element?: LoginNodeItem): Thenable<LoginNodeItem[]> {
        if (element) {
            return Promise.resolve([])
        }

        if (!SshConfigService.check()) {
            return Promise.resolve([])
        }

        const nodes = this.nodes.map(node => {
            const configured = SshConfigService.check(node)
            return new LoginNodeItem(node, configured)
        })

        return Promise.resolve(nodes)
    }
}

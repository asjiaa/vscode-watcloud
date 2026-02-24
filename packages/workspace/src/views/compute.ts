import * as vscode from 'vscode'
import { SlurmService, ComputeNode } from '../services/slurm'

export class ComputeProvider implements vscode.TreeDataProvider<ComputeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<ComputeItem | undefined | void>()
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event

    refresh(): void {
        this._onDidChangeTreeData.fire()
    }

    getTreeItem(element: ComputeItem): vscode.TreeItem {
        return element
    }

    async getChildren(element?: ComputeItem): Promise<ComputeItem[]> {
        if (!element) {
            const nodes = await SlurmService.status()
            if (!nodes.length) {
                return [new ComputeItem('No compute nodes found', vscode.TreeItemCollapsibleState.None, 'empty')]
            }

            const partitions = Array.from(new Set(nodes.map(n => n.partition)))
            return partitions.map(p => new ComputeItem(
                p,
                vscode.TreeItemCollapsibleState.Collapsed,
                'partition',
                nodes.filter(n => n.partition === p)
            ))
        }

        if (element.contextValue === 'partition') {
            return element.nodes!.map(n => new ComputeItem(
                n.name,
                vscode.TreeItemCollapsibleState.None,
                'node',
                undefined,
                n.state
            ))
        }

        return []
    }
}

export class ComputeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly contextValue: string,
        public readonly nodes?: ComputeNode[],
        public readonly state?: string
    ) {
        super(label, collapsibleState)

        if (state) {
            this.tooltip = state
            this.iconPath = this.getIcon(state)
        } else if (contextValue === 'partition') {
            this.iconPath = new vscode.ThemeIcon('layers')
        } else if (contextValue === 'empty') {
            this.iconPath = new vscode.ThemeIcon('info')
        }
    }

    private getIcon(state: string): vscode.ThemeIcon {
        const s = state.toLowerCase()
        if (s.includes('idle')) return new vscode.ThemeIcon('circle-filled', new vscode.ThemeColor('charts.green'))
        else if (s.includes('down') || s.includes('drain') || s.includes('fail')) return new vscode.ThemeIcon('circle-filled', new vscode.ThemeColor('charts.red'))
        return new vscode.ThemeIcon('circle-filled', new vscode.ThemeColor('charts.yellow'))
    }
}

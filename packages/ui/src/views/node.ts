import * as vscode from 'vscode'

export class LoginNodeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly configured: boolean
    ) {
        super(label, vscode.TreeItemCollapsibleState.None)
        this.tooltip = this.configured ? `${this.label} configured` : `${this.label} not configured`

        this.iconPath = new vscode.ThemeIcon(
            this.configured ? 'pass-filled' : 'circle-large-outline',
            new vscode.ThemeColor(this.configured ? 'testing.iconPassed' : 'descriptionForeground')
        )

        this.contextValue = this.configured ? 'loginNodeConfigured' : 'loginNodeUnconfigured'
    }
}

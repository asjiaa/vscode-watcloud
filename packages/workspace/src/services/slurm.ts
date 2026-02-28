import * as cp from 'child_process'

export interface ComputeNode {
    name: string
    state: string
}

export class SlurmService {
    static async status(): Promise<ComputeNode[]> {
        return new Promise((resolve, reject) => {
            cp.exec('sinfo -Nel -h', (err, stdout) => {
                if (err) return reject(err)

                const nodes: ComputeNode[] = stdout
                    .trim()
                    .split('\n')
                    .map(line => {
                        const parts = line.trim().split(/\s+/)
                        return {
                            name: parts[0],
                            state: parts[3].replace('*', '')
                        }
                    })

                resolve(nodes)
            })
        })
    }
}

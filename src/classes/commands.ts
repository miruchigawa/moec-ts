import * as fs from "node:fs"
import * as path from "node:path"
import { Command } from "@app/classes"

export class Commands {
    public commands: Map<string, Command>
    
    constructor() {
        this.commands = new Map()
    }
    
    public async sync() {
        const root = path.join(__dirname, "..", "commands")
        
        for (const file of fs.readdirSync(root)) {
            const mod = await import(path.join(root, file))
            const cmd = new mod.default()
            
            this.commands.set(cmd.name, cmd)
        }
    }
    
    public grab(name: string) {
        return this.commands.get(name)
    }
}
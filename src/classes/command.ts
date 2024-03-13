import * as path from "node:path"
import { User } from "@app/classes"
import { Socket, GetMessage, Role, CommandConfig } from "@app/types"

export class Command {
    public name: string
    public description: string
    public permission: 'sudo' | 'all'
    public group: string
    public cooldown: number
    public requireArg: boolean
    public prices: number
    
    constructor(config: CommandConfig) {
        this.name = config.name
        this.description = config.description ?? "Testing command."
        this.permission = config.permission ?? "all"
        this.group = config.group ?? "default"
        this.cooldown = config.cooldown ?? 1000 * 10
        this.requireArg = config.requireArg ?? false
        this.prices = config.prices ?? 0
    }
    
    public async script(_: Socket, __: GetMessage) {
        const file = path.join(__dirname, "..", "commands", this.name + ".js")
        throw new Error("Script not implemented: Please implement script method, fileof " + file)
    }
    
    public async run(client: Socket, message: GetMessage) {
        const cooldown = this.getCooldown(client, message.user)
        const users = await message.user.data()
        
        console.log(users)
        
        try {
            if (this.requireArg && !message.chat.args.length) {
                await message.room.send(`Invalid command arguments, see *.help ${this.name}* for more information.`)
                return
            }
            
            if (!this.hasPerm(message.user)) {
                await message.room.send("You're not allowed to execute this command.")
                return
            }
            if (cooldown && cooldown.cooldown) return
            if (cooldown) {
                await message.room.send("Slow down.. (>~< \")")
                this.setCooldown(client, message.user)
                return
            }
            
            await this.script(client, message)
            this.addCooldown(client, message.user)
        }catch(error){
            const ermsg = (error as Error).message
            await message.room.send(`*0xOf1:* ${this.name}\n*0xOf2:* ${ermsg}\n\nYou can report this error to Luna moderators.`)
        }
    }
    
    private getCooldown(sock: Socket, user: User) {
        const meta = `${user.id}-${this.name}`
        const data = sock.cooldown.get(meta)
        const timestamp = Date.now()
        
        if (data && ((timestamp - data.timestamp) >= this.cooldown)) {
            sock.cooldown.delete(meta)
        }
        
        return sock.cooldown.get(meta)
    }
    
    private addCooldown(sock: Socket, user: User) {
        const meta = `${user.id}-${this.name}`
        const timestamp = Date.now()
        
        sock.cooldown.set(meta, { cooldown: false, timestamp })
    }
    
    private setCooldown(sock: Socket, user: User) {
        const meta = `${user.id}-${this.name}`
        const data = sock.cooldown.get(meta)
        
        sock.cooldown.set(meta, { cooldown: true, timestamp: data?.timestamp ?? 0 })
    }
    
    private hasPerm(user: User) {
        const isDeveloper = () => user.role === Role.Developer
        return isDeveloper() ? true : this.permission !== "sudo"
    }
}
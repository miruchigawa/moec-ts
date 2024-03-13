import { Command } from "@app/classes"
import { Socket, GetMessage } from "@app/types"

export default class extends Command {
    constructor() {
        super({
            name: "help",
            description: "Show help command.",
            cooldown: 1000 * 60 * 1
        })
    }
    
    public async script(sock: Socket, message: GetMessage) {
        const name = message.chat.text.trim().split(" ").slice(1)[0]
        
        if (!name) {
            const menu = this.makeMenu(sock)
            await message.user.dm(menu)
            await message.room.send("*Command List* successfully sent to your DM.")
            return
        }
        
        const info = this.gatherInfo(sock, name)
        await message.room.send(info)
    }
    
    private shortByGroup(sock: Socket) {
        const groups: { [key: string]: string[] } = {}
        
        for (const [n, v] of sock.commands.commands) {
            const name = this.upperFirstChar(v.group)
            if (name == "Default") continue
            if (!groups[name]) groups[name] = []
            groups[name].push(n)
        }
        
        return groups
    }
    
    private upperFirstChar(text: string) {
        return text.trim()[0].toUpperCase() + text.trim().slice(1)
    }
    
    private makeMenu(sock: Socket) {
        const groups = this.shortByGroup(sock)
        let result = "*# Command List*\n"
        
        for (const group in groups) {
            result += "\n"
            result += `*- ${group}* (${groups[group].length})\n`
            result += groups[group].join(", ")
            result += "\n"
        }
        
        result += "\n"
        result += "Use command *.help <command>* for more information"
        
        return result
    }
    
    private gatherInfo(sock: Socket, name: string) {
        const data = sock.commands.grab(name)
        
        if (!data) {
            return "Command *" + name + "* is not exists."
        }
        
        let text = "*# Command Information* \n"
        + "*- Name:* " + name + "\n"
        + "*- Description:* " + data.description + "\n"
        + "*- Permission:* " + data.permission
        
        return text
    }
}
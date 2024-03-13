import * as fs from "fs"
import * as path from "path"
import { Event } from "@app/classes"
import { Socket, GetMessage, EventValue } from "@app/types"

export class Events {
    public list: Map<string, Event>
    public data: Map<string, { name: string, value: EventValue[]}>
    
    constructor() {
        this.list = new Map()
        this.data = new Map()
    }
    
    public sets(id: string, name: string, value: EventValue[]) {
        this.data.set(id, { name, value })
    }
    
    public delete(id: string) {
        this.data.delete(id)
    }
    
    public async handle(sock: Socket, message: GetMessage) {
        const event = this.data.get(message.user.id)
        if (!event) return
        const func = this.list.get(event?.name)
        if (!func) return
        const input = message.chat.text.toLowerCase()
        
        try {
            await func.run(sock, message, event.value)
        }catch(error: unknown){
            const ermsg = (error as Error).message
            await message.room.send(`*0xOf1:* ${event.name}\n*0xOf2:* ${ermsg}\n\nYou can report this error to Luna moderators.`)
        }
    }
    
    public async sync() {
        const root = path.join(__dirname, "..", "events")
        
        for (const file of fs.readdirSync(root)) {
            const mod = await import(path.join(root, file))
            const event = new mod.default()
            
            this.list.set(event.name, event)
        }
    }
}
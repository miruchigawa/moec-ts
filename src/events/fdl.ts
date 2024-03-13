import { Event } from "@app/classes"
import { Socket, GetMessage, EventValue } from "@app/types"

export default class extends Event {
    constructor() {
        super("fdl")
    }
    
    public async run(sock: Socket, message: GetMessage, value: EventValue[]) {
        const input = message.chat.text.trim().toLowerCase()
        const selected = value.filter(v => v.key == input)
        
        if (!selected.length) return
        
        await message.room.send({ video: { url: selected[0].value } })
        sock.events.delete(message.user.id)
    }
}
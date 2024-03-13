import { Event } from "@app/classes"
import { Socket, GetMessage, EventValue } from "@app/types"

export default class extends Event {
    constructor() {
        super("daily")
    }
    
    public async run(sock: Socket, message: GetMessage, value: EventValue[]) {
        const input = message.chat.text.trim().toLowerCase()
        const selected = value.filter(v => v.key == input)
        
        if (!selected.length) return
        
        const user = await message.user.data()
        
        switch (selected[0].key) {
        case "yen":
            await message.user.addYen(2)
            await message.room.send(`*${user.name}* successfully claimed daily reward, *2¥, Yen!*`)
            break
        case "exp":
            await message.user.addExp(1200)
            await message.room.send(`*${user.name}* successfully claimed daily reward, *1200 Exp, Experience Points!*`)
            break
        }
        
        await message.user.update({ daily_claimed: true, daily_timestamp: Date.now() })
        sock.events.delete(message.user.id)
    }
}
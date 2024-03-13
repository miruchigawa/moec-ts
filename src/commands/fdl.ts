import axios from "axios"
import { Command } from "@app/classes"
import { Socket, GetMessage } from "@app/types"

export default class extends Command {
    constructor() {
        super({
            name: "fdl",
            description: "Facebook downloader.",
            requireArg: true,
            group: "fun"
        })
    }
    
    public async script(sock: Socket, message: GetMessage) {
        const encoded = encodeURIComponent(message.chat.args[0])
        const data = await axios.get(`https://fun-api.miwudev.my.id/api/get?url=${encoded}`)
        const val = []
        let text = "*# Facebook Downloader*\n\nPlease send choice quality: "
        
        for (const key in data.data) {
            val.push({ key, value: data.data[key] })
            text += key + " "
        }
        
        sock.events.sets(message.user.id, "fdl", val)
        await message.room.send(text)
    }
}
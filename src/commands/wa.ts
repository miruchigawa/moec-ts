import { Command } from "@app/classes"
import { Socket, GetMessage } from "@app/types"

export default class extends Command {
    constructor() {
        super({
            name: "wa",
            cooldown: 1000 * 60 * 5,
            group: "misc"
        })
    }
    
    public async script(sock: Socket, message: GetMessage) {
        await message.room.send("*# Join Whatsapp*\n\n*Join now:* https://chat.whatsapp.com/BViHZKWvrfKFejbYu8XTn9")
    }
}
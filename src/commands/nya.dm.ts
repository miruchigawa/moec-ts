import { Command } from "@app/classes"
import { Socket, GetMessage } from "@app/types"

export default class extends Command {
    constructor() {
        super({
            name: "nya-dm"
        })
    }
    
    public async script(sock: Socket, message: GetMessage) {
        await message.user.dm("meow.")
        await message.room.send("nya.")
    }
}
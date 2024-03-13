import { Command } from "@app/classes"
import { Socket, GetMessage } from "@app/types"

export default class extends Command {
    constructor() {
        super({
            name: "status",
            description: "Get your basic user status card.",
            group: "users",
            cooldown: 1000 * 60 * 3
        })
    }
    
    public async script(sock: Socket, message: GetMessage) {
        const user = await message.user.data()
        const text = "*# Status Information*\n\n"
            + "*- ID:*\t" + user.id + "\n"
            + "*- Username:*\t" + user.name + "\n"
            + "*- Exp:*\t" + user.exp + "\n"
            + "*- Level:*\t" + user.level + "\n"
            + "*- Trust Factor:* " + user.tf_level + "\n"
            + "*- Yen:*\t" + user.yen + "\n"
            + "*- Chat Count:*\t" + user.chat_count + "\n"
            + "*- Gacha Count:*\t" + user.gacha_count
        await message.room.send(text)
    }
}
import { Command } from "@app/classes"
import { Socket, GetMessage } from "@app/types"

export default class extends Command {
    constructor() {
        super({
            name: "daily"
        })
    }
    
    public async script(sock: Socket, message: GetMessage) {
        const user = await message.user.data()
        const timestamp = Date.now()
        const cooldown = 1000 * 60 * 60 * 24
        
        if (user.daily_claimed && ((user.daily_timestamp - timestamp) >= cooldown)) {
            await message.user.update({ daily_claimed: false })
        }
        else if (user.daily_claimed) {
            const remaining = user.daily_timestamp + cooldown - timestamp
            const hours = Math.floor(remaining / (1000 * 60 * 60))
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((remaining % (1000 * 60)) / 1000)
            await message.room.send(`You already claimed your daily reward. You can claim it again in *${hours} hours, ${minutes} minutes, ${seconds} seconds*`)
            return
        }
        
        sock.events.sets(message.user.id, "daily", [{key: "yen", value: 2}, {key: "exp", value: 1200}])
        await message.room.send(`*# Daily Reward*

*- Exp:* 1200 experience
*- Yen:* 2¥ yen

Send message of your choice to choose the daily reward..`)
    }
}
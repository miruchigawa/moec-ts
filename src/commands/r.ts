import { Command } from "@app/classes"
import { Socket, GetMessage } from "@app/types"

export default class extends Command {
    constructor() {
        super({
            name: "r",
            description: "Get remaining restart time.",
            group: "misc"
        })
    }
    
    public async script(sock: Socket, message: GetMessage) {
        const processUptimeInSeconds = process.uptime();
        const countdownTimeInSeconds = 2 * 60 * 60;
        const restartTimeInSeconds = countdownTimeInSeconds - processUptimeInSeconds;
        const hours = Math.floor(restartTimeInSeconds / 3600);
        const minutes = Math.floor((restartTimeInSeconds % 3600) / 60);
        const seconds = Math.floor(restartTimeInSeconds % 60);

        await message.room.send(`Restart schedule in *${hours} hours, ${minutes} minutes, ${seconds} seconds*`)
    }
}
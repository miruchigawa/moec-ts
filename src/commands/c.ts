import { exec } from "child_process"
import { inspect } from "util"
import { Command } from "@app/classes"
import { Socket, GetMessage } from "@app/types"

export default class extends Command {
    constructor() {
        super({
            name: "c",
            description: "Control & Admin task controller.",
            group: "misc",
            permission: "sudo",
            requireArg: true
        })
    }
    
    public async script(sock: Socket, message: GetMessage) {
        const [ task, ...args ] = message.chat.args
        let result: string
        
        //console.log(task)
        switch (task) {
        case "cshell":
            result = await this.shell(args)
            break;
        default:
            result = `Invalid command arguments, see *.help ${this.name}* for more information.`
            break;
        }
        
        await message.room.send(result)
    }
    
    private shell(args: string[]): Promise<string>{
        return new Promise<string>((resolve, reject) => {
            exec(args.join(" "), (err, stdout, stderr) => {
                if (err) {
                    reject(err)
                    return
                }
                let result = stdout || stderr;
                if (typeof result !== "string") {
                    result = inspect(result)
                }
                resolve(result)
            })
        })
    }
}
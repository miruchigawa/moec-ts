import { WAMessage, AnyMessageContent, MiscMessageGenerationOptions, isJidGroup } from "@whiskeysockets/baileys"
import { Socket } from "@app/types"

export class Room {
    constructor(
        private sock: Socket,
        private msg: WAMessage
    ) {}
    
    get id() {
        return this.msg.key.remoteJid ?? ""
    }
    
    get isGroup() {
        return isJidGroup(this.id) ?? false
    }
    
    public async send(content: AnyMessageContent | string, options: MiscMessageGenerationOptions = {}) {
        
        if (typeof content === "string") {
            content = { text: content }
        }
        
        return this.sock.sendMessage(this.id, content, options)
    }
}
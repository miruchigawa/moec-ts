import { WAMessage, AnyMessageContent, MiscMessageGenerationOptions, isJidGroup, downloadMediaMessage } from "@whiskeysockets/baileys"
import { MsgType, Socket } from "@app/types"
import config from "@app/config.json"

export class Chat {
    constructor(
        private sock: Socket,
        private msg: WAMessage,
        private jid: string
    ) {}
    
    get isBroadcast() {
        return this.msg.broadcast ?? false
    }
    
    get isSelf() {
        return this.msg.key.fromMe ?? false
    }
    
    get type() {
        return this.isBroadcast ? MsgType.Broadcast : this.getTypeofMsg()
    }
    
    get text() {
        switch(this.type) {
        case MsgType.Conversation:
            return this.msg.message?.conversation ?? ""
        case MsgType.ExtendedText:
            return this.msg.message?.extendedTextMessage?.text ?? ""
        case MsgType.Edited:
            return this.msg.message?.editedMessage?.message?.protocolMessage?.editedMessage?.conversation ?? ""
        case MsgType.Reaction:
            return this.msg.message?.reactionMessage?.text ?? ""
        case MsgType.Image:
            return this.msg.message?.imageMessage?.caption ?? ""
        case MsgType.Video:
            return this.msg.message?.videoMessage?.caption ?? ""
        case MsgType.ViewOnceImage:
            return this.msg.message?.viewOnceMessageV2?.message?.imageMessage?.caption ?? ""
        case MsgType.ViewOnceVideo:
            return this.msg.message?.viewOnceMessageV2?.message?.videoMessage?.caption ?? ""
        default:
            return ""
        }
    }
    
    get media() {
        switch(this.type) {
        case MsgType.Image:
        case MsgType.Video:
            return () => downloadMediaMessage(this.msg, "buffer", {})
        case MsgType.ViewOnceImage:
        case MsgType.ViewOnceVideo:
            return () => downloadMediaMessage(this.msg, "buffer", {})
        default:
            return undefined
        }
    }
    
    get isCommand() {
        return config.prefix.includes(this.text.trim()[0]) && this.text.trim().length > 1
    }
    
    get commandName() {
        return this.text.trim().slice(1).split(" ")[0]
    }
    
    get args() {
        return this.text.trim().split(" ").slice(1)
    }

    get reactionContent() {
        if (this.type !== MsgType.Reaction) return undefined
        const key = this.msg.message?.reactionMessage?.key
        
        return {
            user: key?.participant ?? (key?.fromMe ? "bot" : key?.remoteJid) ?? "",
            fromMe: key?.fromMe ?? false,
            id: key?.id ?? "",
            raw: key
        }
    }
    
    /**
     * Reply chat (shortcut)
     * 
     * @params content - Content message
     * @params options - options
     * 
     * @returns message information
     */
    public async reply(content: AnyMessageContent | string, options: Partial<MiscMessageGenerationOptions>) {
        
        if (typeof content === "string") {
            content = { text: content }
        }
        
        return this.sock.sendMessage(this.jid, content, {quoted: this.msg, ...options})
    }
    
    /**
     * Get message type
     * 
     * @returns Typeof message
     **/
    private getTypeofMsg() {
        if (this.msg.message?.conversation) return MsgType.Conversation
        if (this.msg.message?.extendedTextMessage) return MsgType.ExtendedText
        if (this.msg.message?.editedMessage) return MsgType.Edited
        if (this.msg.message?.stickerMessage) return MsgType.Sticker
        if (this.msg.message?.reactionMessage) return MsgType.Reaction
        if (this.msg.message?.imageMessage) return MsgType.Image
        if (this.msg.message?.videoMessage) return MsgType.Video
        if (this.msg.message?.audioMessage) return MsgType.Audio
        if (this.msg.message?.viewOnceMessageV2?.message?.imageMessage) return MsgType.ViewOnceImage
        if (this.msg.message?.viewOnceMessageV2?.message?.videoMessage) return MsgType.ViewOnceVideo
        return MsgType.Any
    }
}
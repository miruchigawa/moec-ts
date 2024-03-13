import {WAMessage, AnyMessageContent, MiscMessageGenerationOptions } from "@whiskeysockets/baileys"
import { Role, Socket, IUser } from "@app/types"
import config from "@app/config.json"

export class User {
    constructor(
        private sock: Socket,
        private msg: WAMessage
    ) {}
    
    get id() {
        return this.msg.key.participant ?? (this.msg.key.fromMe ? "bot" : this.msg.key.remoteJid) ?? ""
    }
    
    get name() {
        return this.msg.pushName ?? ""
    }
    
    get role() {
        return config.developer.ids.includes(this.id) ? Role.Developer : Role.User
    }
    
    public async data() {
        let data = await this.sock.database.select("*").from<IUser>("users").where({ uid: this.id })
        if (!data.length) {
            await this.sock.database("users").insert({ uid: this.id, name: this.name })
            data = await this.sock.database.select("*").from<IUser>("users").where({ uid: this.id })
        }
        return data[0]!
    }
    
    public async update(user: Partial<IUser>) {
        return this.sock.database("users").where({ uid: this.id }).update(user)
    }
    
    public async addYen(value: number) {
        return this.sock.database("users").where({ uid: this.id }).increment({ yen: value })
    }
    
    public async decYen(value: number) {
        return this.sock.database("users").where({ uid: this.id }).decrement({ yen: value })
    }
    
    public async addExp(value: number) {
        return this.sock.database("users").where({ uid: this.id }).increment({ exp: value })
    }
    
    public async decExp(value: number) {
        return this.sock.database("users").where({ uid: this.id }).decrement({ exp: value })
    }
    
    public async dm(content: AnyMessageContent | string, options: MiscMessageGenerationOptions = {}) {
        
        if (typeof content === "string") {
            content = { text: content }
        }
        
        return this.sock.sendMessage(this.id, content, options)
    }
}
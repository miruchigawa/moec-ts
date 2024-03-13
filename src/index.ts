/* THIRD PARTY LIBRARY */
import socket, { DisconnectReason as R, useMultiFileAuthState, WASocket } from "@whiskeysockets/baileys"
import { ILogObj, Logger } from "tslog"
import { Boom as B } from "@hapi/boom"
import * as fs from "node:fs"
import * as path from "node:path"
import knex from "knex"
import P from "pino"
import "dotenv/config"

/* LOCAL LIBRARY */
import { WAConnection, WAMessages, Socket, GetMessage, MsgType, Role } from "@app/types"
import { getMessage } from "@app/functions"
import { Commands, Events } from "@app/classes"
import config from "@app/config.json"


const log = new Logger<ILogObj>()
const main = async function() {
    const { state, saveCreds } = await useMultiFileAuthState("sessions")
    const sock = socket({
        auth: state,
        logger: P({ level: "silent" }),
        printQRInTerminal: true,
        syncFullHistory: true
    }) as Socket
    
    sock.commands = new Commands()
    sock.cooldown = new Map()
    sock.events = new Events()
    sock.spams = new Map()
    sock.database = knex({
        client: "better-sqlite3",
        connection: {
            filename: "./database/dev.sqlite3"
        },
        useNullAsDefault: true
    })
    
    sock.ev.on("messages.upsert", (v) => handleMessages(sock, v))
    sock.ev.on("connection.update", handleConnection)
    sock.ev.on("creds.update", saveCreds)
    await sock.commands.sync()
    await sock.events.sync()
}

/**
 * This function used for handle connection between client and wa socket
 * 
 * @params connection - Connection info: 'close' | 'open' | 'connecting'
 * @params lastDisconnect - About disconnect error information eg: status code, date, etc.
 */
function handleConnection({ connection, lastDisconnect }: WAConnection) {
    const canRecover = () => {
        return (lastDisconnect?.error as B)?.output?.statusCode !== R.loggedOut
    }
    
    switch (connection) {
    case "open":
        log.info("Client connected to server.")
        break
    case "close":
        if (canRecover()) {
            log.info("Client just disconnect, starting session...")
            main()
        }else{
            log.error("Can't recover connection, please remove old sessions and try again.")
        }
        break
    case "connecting":
        log.info("Connrcting to server, please wait...")
        break
    }
}

/**
 * This function used for handle upcoming messages
 * 
 * @params messages - Array of message
 * @params type - Type of message eg: 'notify'
 */
async function handleMessages(sock: Socket, { messages, type }: WAMessages) {
    for (const msg of messages) {
        const message = await getMessage(sock, msg)
        const command = sock.commands.grab(message.chat.commandName)
        
        if (message.chat.isBroadcast) continue
        if (message.chat.isSelf) continue
        if (!message.room.isGroup && !config.private) continue
        
        if (message.chat.isCommand && command) {
            command.run(sock, message)
            continue
        }
        
        await sock.events.handle(sock, message)
        
        log.info(`Get message at ${message.room.id} from ${message.user.name} <${message.user.id}>: ${message.chat.text}`)
    }
}

main().catch((e) => log.fatal(e))
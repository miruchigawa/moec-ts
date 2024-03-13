import { Knex } from "knex"
import { ConnectionState, WAMessage, WASocket, MessageUpsertType } from "@whiskeysockets/baileys"
import { Commands, User, Chat, Room, Events } from "@app/classes"

export type WAConnection = Partial<ConnectionState>
export type WAMessages = { messages: WAMessage[], type: MessageUpsertType}
export type GetMessage = {user: User, chat: Chat, room: Room}
export type Args = { required: boolean, script: (...args: any) => any }
export type EventValue = { key: string, value: any }
export type CooldownProps = { cooldown: boolean, triger: boolean, timestamp: number }
export type CommandConfig = {
    name: string,
    description?: string,
    permission?: 'sudo' | 'all'
    group?: string
    cooldown?: number
    requireArg?: boolean
    prices?: number
}

export interface IUser {
    id: number
    uid: string
    name: string
    exp: number
    level: number
    yen: number
    tf_level: number
    chat_count: number
    gacha_count: number
    daily_claimed: boolean
    daily_timestamp: number
    created_at: Date
}

export interface Socket extends WASocket {
    commands: Commands,
    cooldown: Map<string, {cooldown: boolean, timestamp: number}>
    events: Events
    spams: Map<string, string>
    database: Knex
}

export enum Role {
    Developer,
    User
}

export enum MsgType {
    Any = "any",
    Sticker = "sticker",
    Reaction = "reaction",
    Edited = "edited",
    ViewOnceImage = "viewOnceImage",
    ViewOnceVideo = "viewOnceVideo",
    ExtendedText = "extendedText",
    Broadcast = "broadcast",
    Conversation = "conversation",
    Image = "image",
    Video = "video",
    Audio = "audio"
}
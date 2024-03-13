import { WAMessage } from "@whiskeysockets/baileys"
import { User, Room, Chat } from "@app/classes"
import { Socket, GetMessage } from "@app/types"

export async function getMessage(sock: Socket, msg: WAMessage): Promise<GetMessage> {
    const user = new User(sock, msg)
    const room = new Room(sock, msg)
    const chat = new Chat(sock, msg, room.id)
    await sock.readMessages([msg.key])
    return { user, room, chat }
}
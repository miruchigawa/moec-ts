import { Socket, GetMessage, EventValue } from "@app/types"

export class Event {
    constructor(
        public name: string
    ) {}
    
    public async run(sock: Socket, message: GetMessage, value: EventValue[]) {
        throw new Error()
    }
}
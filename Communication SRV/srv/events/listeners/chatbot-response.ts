import { Listener, ChatbotResponse, Events } from "@ijchatbotapp/common";
import { queueGroupName } from "./query-group-name";
import { Message } from "node-nats-streaming";
import { Chat } from "../../models/chat";

enum ResponseStatus {
    Query = 'chatbot:query-pending',
    Responded = 'chatbot:responded',
    Reported = 'chatbot:response-reported'
}

export class ChatbotResponseListener extends Listener<ChatbotResponse> {

    readonly subject = Events.ChatbotResponse;

    queueGroupName = queueGroupName;

    async onMessage(data: ChatbotResponse['data'], msg: Message) {
        // * Find the event ticket that the order is reserving
        const chat = await Chat.findById(data.textId);

        // * If no event, throw error
        if (!chat) {
            throw new Error('Text Prompt not found');
        }

        // * Mark the event as being reserved by setting its orderId property
        chat.set({
            response: data.response,
            responseId: data.responseId,
            responseDate: new Date(),
            status: ResponseStatus.Responded      
        });

        // * Save the ticket
        await chat.save();

        // * getting the events
        // const chats = await Chat.find();

        // * emit events using socketIO
        // global.io.emit('chats', chats);
        global.io.emit('chat', chat);

        // * updated about event ticket is updated
        // await new EventUpdatedPublisher(this.client).publish({
        //     id: event.id,
        //     name: event.name,
        //     version: event.version,
        //     creatorId: event.creatorId,
        //     price: event.price,
            // date: event.date.toISOString(),
        //     ticketLeft: event.ticketsLeft,
        // });

        // * ack the message
        msg.ack();
    }

}
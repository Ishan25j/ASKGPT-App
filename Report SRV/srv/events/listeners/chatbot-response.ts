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
            status: ResponseStatus.Responded      
        });

        // * Save the ticket
        await chat.save();

        // * ack the message
        msg.ack();
    }

}
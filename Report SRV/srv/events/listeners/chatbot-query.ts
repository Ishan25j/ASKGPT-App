import { Listener, ChatbotQuery, Events } from "@ijchatbotapp/common";
import { queueGroupName } from "./query-group-name";
import { Message } from "node-nats-streaming";
import { Chat } from "../../models/chat";

enum ResponseStatus {
    Query = 'chatbot:query-pending',
    Responded = 'chatbot:responded',
    Reported = 'chatbot:response-reported'
}

export class ReportQueryListener extends Listener<ChatbotQuery> {

    readonly subject = Events.ChatbotQuery;

    queueGroupName = queueGroupName;

    async onMessage(data: ChatbotQuery['data'], msg: Message) {
        // * Find the event ticket that the order is reserving
        // const chat = await Chat.findById(data.textId);

        // // * If no event, throw error
        // if (!chat) {
        //     throw new Error('Text Prompt not found');
        // }

        // * Mark the event as being reserved by setting its orderId property
        const chat = Chat.build({
            userId: data.userId,
            text: data.text,
            status: ResponseStatus.Query
        })

        // * Save the ticket
        await chat.save();

        // * ack the message
        msg.ack();
    }

}
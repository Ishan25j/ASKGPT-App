import { Listener, ReportResponse, Events } from "@ijchatbotapp/common";
import { queueGroupName } from "./query-group-name";
import { Message } from "node-nats-streaming";
import { Chat } from "../../models/chat";

export class ReportResponseListener extends Listener<ReportResponse> {

    readonly subject = Events.ReportResponse;

    queueGroupName = queueGroupName;

    async onMessage(data: ReportResponse['data'], msg: Message) {
        // * Find the event ticket that the order is reserving
        const chat = await Chat.findById(data.textId);

        // * If no event, throw error
        if (!chat) {
            throw new Error('Text Prompt not found');
        }

        // * Mark the event as being reserved by setting its orderId property
        chat.set({
            status: data.status      
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
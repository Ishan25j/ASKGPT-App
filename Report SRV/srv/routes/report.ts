
import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { requireAuth, validateRequest } from "@ijchatbotapp/common";
import { Chat } from "../models/chat";
import { natsWrapper } from "../nats-wrapper";
import { ReportResponsePublisher } from "../events/publishers/report-response";
import { ReportChat } from "../models/report";

const router = express.Router();

enum ResponseStatus {
    Query = 'chatbot:query-pending',
    Responded = 'chatbot:responded',
    Reported = 'chatbot:response-reported'
}

router.post('/api/chats/report', requireAuth, [
    body('text')
        .not()
        .isEmpty()
        .withMessage('Text is required'),
], validateRequest, async (req: Request, res: Response) => {

    const { textId, responseId, responseRequired} = req.body;

    // * Find the event ticket that the order is reserving
    const chat = await Chat.findOne({textId: textId});

    // * If no event, throw error
    if (!chat) {
        throw new Error('Text Prompt not found');
    }
    chat.set({
        status: ResponseStatus.Reported
    })

    await chat.save();

    const reportChat = ReportChat.build({
        userId: req.currentUser!.id,
        textId: textId,
        responseId: responseId,
        responseRequired: responseRequired,
    })

    await reportChat.save();

    // * will not execute if in test environment
    if (process.env.NODE_ENV !== 'test') {
        
        // * emit event into socketIO
        const chats = await Chat.find({userId: req.currentUser!.id});
        global.io.emit('chats', chats);
    }
    
    // * emit event created event

    await new ReportResponsePublisher(natsWrapper.client).publish({
        userId: req.currentUser!.id,
        textId: textId,
        responseId: responseId,
        responseRequired: responseRequired,
        status: ResponseStatus.Reported
    });

    res.status(201).send(event);
});

export { router as createReportRouter };
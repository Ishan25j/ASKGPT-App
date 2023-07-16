
import express, { Request, Response } from "express";
import { body } from 'express-validator';
import { requireAuth, validateRequest } from "@ijchatbotapp/common";
import { Chat } from "../models/chat";
import { natsWrapper } from "../nats-wrapper";
import { ChatbotQueryPublisher } from "../events/publishers/chatbot-query";

const router = express.Router();

enum ResponseStatus {
    Query = 'chatbot:query-pending',
    Responded = 'chatbot:responded',
    Reported = 'chatbot:response-reported'
}

router.post('/api/chats/new', requireAuth, [
    body('text')
        .not()
        .isEmpty()
        .withMessage('Text is required'),
], validateRequest, async (req: Request, res: Response) => {

    const { text, } = req.body;

    const chat = Chat.build({
        userId: req.currentUser!.id,
        text: text,
        status: ResponseStatus.Query,
        textDate: new Date()
    })

    await chat.save();

    // * will not execute if in test environment
    if (process.env.NODE_ENV !== 'test') {
        
        // * emit event into socketIO
        const chats = await Chat.find({userId: req.currentUser!.id});
        global.io.emit('chats', chats);
    }
    
    // * emit event created event

    await new ChatbotQueryPublisher(natsWrapper.client).publish({
        userId: req.currentUser!.id,
        textId: chat.id,
        text: chat.text,
        status: ResponseStatus.Query
    });

    res.status(201).send(chat);
});

export { router as createChatRouter };
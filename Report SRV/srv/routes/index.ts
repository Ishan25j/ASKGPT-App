import express, {Request, Response} from 'express';
import { Chat } from '../models/chat';

// * Custom NPM module
import { NotFoundError } from "@ijchatbotapp/common";

const router = express.Router();

router.get('/api/events/texts/:textId',async (req: Request, res: Response) => {

    
    const chat = await Chat.findById(req.params.textId);
    
    if (!chat) {
        throw new NotFoundError();
    }

    res.send(event);
});

router.get('/api/events/responses/:responseId',async (req: Request, res: Response) => {

    
    const chat = await Chat.findById(req.params.responseId);
    
    if (!chat) {
        throw new NotFoundError();
    }

    res.send(chat);
});

export { router as indexChatsRouter };
import express, {Request, Response} from 'express';
import { Chat } from '../models/chat';

// * Custom NPM module
import { NotFoundError } from "@ijchatbotapp/common";

const router = express.Router();

router.get('/api/events',async (req: Request, res: Response) => {

    // * get current time
    // const currentDate = new Date();
    
    const chatlist = await Chat.find({});
    
    if (!chatlist) {
        throw new NotFoundError();
    }

    // * filter out the events which are past
    const chats = chatlist.filter(chatData => {
        return (chatData.userId === req.currentUser?.id);
    })

    res.send(chats);
});

export { router as showChatsRouter };
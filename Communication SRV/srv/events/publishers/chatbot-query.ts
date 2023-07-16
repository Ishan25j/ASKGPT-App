import { Publisher, Events, ChatbotQuery} from "@ijchatbotapp/common";

export class ChatbotQueryPublisher extends Publisher<ChatbotQuery> {
    
    // * make the subject immutable using 'readonly' keyword
    readonly subject = Events.ChatbotQuery;
    
}
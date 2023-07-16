import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
// import { ResponseStatus } from "@ijchatbotapp/common";

enum ResponseStatus {
    Query = 'chatbot:query-pending',
    Responded = 'chatbot:responded',
    Reported = 'chatbot:response-reported'
}

// * verifying attributes before passing to the constructor for adding data to database
interface ChatAtts {
    userId: string;
    text: string;
    textDate: Date;
    response?: string;
    responseId?: string;
    responseDate?: Date;
    status?: ResponseStatus
}


// * For adding additional properties in future
// * means a interface that describes the properties that a document has
interface ChatDoc extends mongoose.Document{
    userId: string;
    text: string;
    response?: string;
    responseId?: string;
    textDate: Date;
    responseDate?: Date;
    status?: ResponseStatus

    // * added for managing version of the document
    version: number;
}

// * A interface that describes the properties tha a model has
interface ChatModel extends mongoose.Model<ChatDoc>{
    build(attrs: ChatAtts) : ChatDoc;
}

// * create schema for Event
const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    textDate: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    response: {
        type: String,
        // required: true
    },
    responseId: {
        type: String,
        // required: true
    },
    status: {
        type: String,
        required: true
    },
    responseDate: {
        type: mongoose.Schema.Types.Date,
        // required: true
    }  
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// * this set the versionKey to `version` instead of `__v`
chatSchema.set('versionKey', 'version');

// * added the plugin to update the version of the document
chatSchema.plugin(updateIfCurrentPlugin);


// * create a static method to create a document that satisfy the given types
chatSchema.statics.build = (attrs: ChatAtts) => {
    return new Chat(attrs);
}

// * create a model
const Chat = mongoose.model<ChatDoc, ChatModel>('Chat', chatSchema);

// * export model
export { Chat };
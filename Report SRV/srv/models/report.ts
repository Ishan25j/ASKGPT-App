import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
// import { ResponseStatus } from "@ijchatbotapp/common";

enum ResponseStatus {
    Query = 'chatbot:query-pending',
    Responded = 'chatbot:responded',
    Reported = 'chatbot:response-reported'
}

// * verifying attributes before passing to the constructor for adding data to database
interface ReportChatAtts {
    userId: string;
    textId: string;
    responseId: string;
    responseRequired: string;
}


// * For adding additional properties in future
// * means a interface that describes the properties that a document has
interface ReportChatDoc extends mongoose.Document{
    userId: string;
    textId: string;
    responseId: string;
    responseRequired: string;

    // * added for managing version of the document
    version: number;
}

// * A interface that describes the properties tha a model has
interface ReportChatModel extends mongoose.Model<ReportChatDoc>{
    build(attrs: ReportChatAtts) : ReportChatDoc;
}

// * create schema for Event
const reportChatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    textId: {
        type: String,
        required: true
    },
    responseId: {
        type: String,
        required: true
    },
    responseRequired: {
        type: String,
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
reportChatSchema.set('versionKey', 'version');

// * added the plugin to update the version of the document
reportChatSchema.plugin(updateIfCurrentPlugin);


// * create a static method to create a document that satisfy the given types
reportChatSchema.statics.build = (attrs: ReportChatAtts) => {
    return new ReportChat(attrs);
}

// * create a model
const ReportChat = mongoose.model<ReportChatDoc, ReportChatModel>('Chat', reportChatSchema);

// * export model
export { ReportChat };
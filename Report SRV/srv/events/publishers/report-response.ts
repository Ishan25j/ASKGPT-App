import { Publisher, Events, ReportResponse} from "@ijchatbotapp/common";

export class ReportResponsePublisher extends Publisher<ReportResponse> {
    
    // * make the subject immutable using 'readonly' keyword
    readonly subject = Events.ReportResponse;
    
}
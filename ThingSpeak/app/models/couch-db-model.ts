module ThingSpeak.Models {

    export interface couchDbModel {
        offset?: number;
        rows?:Row[];
        total_rows?:number;
    }

    export interface PuchDbObject {
        rows?: Row[];
        offset?: number;
        total_rows?: number;
    }

    export interface Row {
        id?: string;
        doc?: SalesDoc;
        key?: string;
        value?: Value;
    }

    export interface SalesDoc {
        _id?: string;
        _attachments?: Attachments;
        _rev?: string;
        salesData?: SalesForm;
    }

    export interface OrderDoc {
        _id?: string;
        _attachments?: Attachments;
        _rev?: string;
        orderForm?: OrderForm;
    }

    export interface Attachments {
        attachmentId?: AttachmentItsId;
    }

    export interface AttachmentItsId {
        data?: string;
        content_type?: string;
        digest?: string;
    }

    export interface Value {
        rev?: string;
    }
}
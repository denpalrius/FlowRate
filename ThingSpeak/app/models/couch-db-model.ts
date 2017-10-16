module ThingSpeak.Models {
    // To parse this data:
    //
    //   import { couchDbModel } from "./GettingStarted;
    //   let value: GettingStarted = JSON.parse(json);

    export interface couchDbModel {
        offset?: number;
        rows?:Row[];
        total_rows?:number;
    }

    export interface PuchDbObject {
        rows: Row[];
        offset: number;
        total_rows: number;
    }

    export interface Row {
        id: string;
        doc: Doc;
        key: string;
        value: Value;
    }

    export interface Doc {
        _id: string;
        _attachments?: Attachments;
        _rev?: string;
        salesData: SalesForm;
    }

    export interface Attachments {
        "attachment/its-id": AttachmentItsId;
    }

    export interface AttachmentItsId {
        data: string;
        content_type: string;
        digest: string;
    }

    export interface Value {
        rev: string;
    }
}
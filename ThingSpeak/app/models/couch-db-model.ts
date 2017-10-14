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

    export interface Row {
        key?:string;
        id?:string;
        value?: string;
    }

}
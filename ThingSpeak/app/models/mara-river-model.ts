module ThingSpeak.Models {
    "use strict";
    export interface Channel {
        id?: number;
        name?: string;
        description?: string;
        latitude?: string;
        longitude?: string;
        field1?: string;
        field2?: string;
        field3?: string;
        field4?: string;
        created_at?: Date;
        updated_at?: Date;
        elevation?: string;
        last_entry_id?: number;
    }

    export interface Feed {
        created_at?: Date;
        entry_id?: number;
        field1?: string;
    }
    //A low cost, open source water level logger on the Mara River 
    //near Serena Lodge in the Maasai Mara National Reserve, Kenya.
    export interface MaraRiverFlow {
        channel?: Channel;
        feeds?: Feed[];
    }
}
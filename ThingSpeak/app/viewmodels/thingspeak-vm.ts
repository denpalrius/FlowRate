module ThingSpeak.ViewModels {

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

    export interface MaraRiverFlow {
        channel?: Channel;
        feeds?: Feed[];
    }

}
module ThingSpeak.ViewModels {

    export interface iChannel {
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

    export interface iFeed {
        created_at?: Date;
        entry_id?: number;
        field1?: string;
    }

    export interface iMaraRiverFlow {
        channel?: iChannel;
        feeds?: iFeed[];
    }
    
    export enum iuserRole {
        admin = 1,
        standard = 2
    }

    export interface iUser {
        id?: string;
        name?: string;
        email?: string;
        phone?: string;
        photoURL?: string;
        role?: iuserRole;
    }

    export interface iSensor {
        id?: string;
        physicalAddress?: string;
        lat?: number;
        lon?: number;
        installedOn?: string;
        installedBy?: string;
    }
}
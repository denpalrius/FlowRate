module ThingSpeak.ViewModels {

    export interface iChannel {
        id: number;
        name: string;
        description: string;
        latitude: string;
        longitude: string;
        field1: string;
        field2: string;
        created_at: string;
        updated_at: string;
        last_entry_id: number;
    }

    export interface iFeed {
        created_at?: string;
        entry_id?: number;
        field1?: string;
    }

    export interface iFlowRate {
        channel?: iChannel;
        feeds?: iFeed[];
    }
    
    export enum iuserRole {
        admin = 1,
        standard = 2
    }

    export interface iUser {
        id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        photoURL?: string;
        provider?: any;
        role?: iuserRole;
        createdAt?: any;
    }

    export interface iSensor {
        id?: string;
        physicalAddress?: string;
        lat?: number;
        lon?: number;
        status?: boolean;
        installedOn?: string;
        installedBy?: string;
    }

    export interface Sensor {
        id?: string;
        physicalAddress?: string;
        status?: boolean;
        installedBy?: string;
        channel?: iChannel;
    }
}
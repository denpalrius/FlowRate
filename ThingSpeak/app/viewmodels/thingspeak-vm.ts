module ThingSpeak.ViewModels {

    export interface iChannel {
        id?: string;
        name?: string;
        description?: string;
        latitude?: string;
        longitude?: string;
        field1?: string;
        field2?: string;
        created_at?: string;
        updated_at?: string;
        last_entry_id?: number;
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
    
    export enum UserRole {
        admin = 1,
        manager = 2,
        standard = 3
    }

    export interface iUserRole {
        role?: string;
        value?: number;
    }

    export interface iUser {
        id?: string;
        fullName?: string;
        email?: string;
        phone?: string;
        photoUrl?: string;
        provider?: any;
        role?: UserRole;
        createdAt?: any;
        emailVerified?: boolean;
        token?: any;
    }

    export interface newUser extends iUser {
        password?: string;
    }
    export interface iSensor extends iChannel {
        physicalAddress?: string;
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
module ThingSpeak.Models {
    
    export interface SalesForm {
        id?: string;
        date?: string;
        companyName?: string;
        location?: string;
        phoneNumber?: number;
        contactPerson?: string;
        salesPerson?: string;
        salonOwner?: string;
        brancesNumber?: number;
        salonsEmployees?: number;
        dayCustomers?: string;
        weekdayCustomers?: number;
        weekendCustomers?: number;
        gelCharges?: string;
        gelMarketPrice?: string;
        machineInterest?: string;
        machineBenefit?: string;
        machineWorth?: string;
        customersSignature?: string;
        salesPersonSignature?: string;
        managersSignature?: string;
    }
}
module ThingSpeak.Models {
    
    export interface SalesForm {
        dateCreated?: string;
        companyCode?: string;
        companyName?: string;
        location?: string;
        phoneNumber?: string;
        contactPerson?: string;
        salesPerson?: string;
        salonOwner?: string;
        brancesNumber?: number;
        salonsEmployees?: number;
        dayCustomers?: number;
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

    export interface OrderForm {
        companyData?: SalesForm;
        orderDate?: string;
        modeOfPayment?: PaymentMode;
        orderItems?: OrderItem[];
        lastAggregateTotalPrice?: string;
    }

    export interface OrderItem{
        ItemNumber?: string;
        description?: string;
        unitPrice?: string;
        quantity?: string;
        totalPrice?: string;
    }

    export enum PaymentMode {
        cash,
        cheque,
        other
    }
}
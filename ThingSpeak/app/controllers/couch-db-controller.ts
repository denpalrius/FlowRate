module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        dateToday?: string;
        salesFormData?: Models.SalesForm;
        orderFormData?: Models.OrderForm;
        newOrderItem?: Models.OrderItem;
    }

    interface ICouchDbScope extends ng.IScope {
        couchDbScope?: ICurrentScope;
    }

    export class CouchDbController {
        constructor(
            private $scope: ICouchDbScope,
            private $state: angular.ui.IStateService,
            private couchDbService: Services.CouchDbService) {

            var that: CouchDbController = this;
            that.init();
        }

        private init() {
            var that: CouchDbController = this;

            that.$scope.couchDbScope = {};
            that.$scope.couchDbScope.salesFormData = {};
            that.$scope.couchDbScope.orderFormData = {};
            that.$scope.couchDbScope.newOrderItem = {};

            that.$scope.couchDbScope.salesFormData.dateCreated = that.setDate();
            that.$scope.couchDbScope.orderFormData.orderDate = that.setDate();

            var dummySalesData = {
                brancesNumber: 3,
                companyName: "Ukulima coop",
                contactPerson:"Njoroge",
                date:"Monday, Oct 16, 2017, 8:19 PM",
                dayCustomers:13,
                gelCharges:"2300",
                gelMarketPrice:"1200",
                location:"Nairobi",
                machineBenefit:"Serving ↵more ↵customers↵at a time↵Yeah!",
                machineWorth: "It's actually good",
                phoneNumber:"0712345678",
                machineInterest: "Lemme choose a date" ,
                salesPerson: "Jane",
                salonOwner: "Maina",
                salonsEmployees:15,
                weekdayCustomers: 45,
                weekendCustomers:23,
            } 
            that.$scope.couchDbScope.salesFormData = dummySalesData;

            var dummyOrderData: Models.OrderForm = {
                orderDate: that.setDate(),
                companyData: dummySalesData,
                lastAggregateTotalPrice:"", 
                modeOfPayment: Models.PaymentMode.cheque,
                orderItems: [{
                    ItemNumber: new Date().getSeconds().toString() + new Date().getMilliseconds().toString(),
                    description: "Shaving Gel",
                    quantity: "23",
                    unitPrice: "700",
                    totalPrice:""
                }, {
                    ItemNumber: new Date().getSeconds().toString() + new Date().getMilliseconds().toString(),
                    description: "Nail cutters",
                    quantity: "23",
                    unitPrice: "2345",
                    totalPrice: ""
                    }, {
                        ItemNumber: new Date().getSeconds().toString() + new Date().getMilliseconds().toString(),
                        description: "For manicure",
                        quantity: "7",
                        unitPrice: "123",
                        totalPrice: ""
                    }]
            }
            that.$scope.couchDbScope.orderFormData = dummyOrderData;
        }

        private setTotalItemPrice(orderData: Models.OrderForm){
            if (orderData) {
                orderData.orderItems.forEach((item) => {
                    if (isNaN(parseFloat(item.unitPrice)) && isNaN(parseFloat(item.quantity))){
                        item.totalPrice = (parseFloat(item.unitPrice) * parseFloat(item.quantity)).toString();
                    }
                });
            }
        }

        private setDate(): string{
            var that: CouchDbController = this;

            var dateOptions = {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }; 

            return new Date().toLocaleTimeString("en-us", dateOptions);
        }

        private generateCompanyCode(salesFormData: Models.SalesForm) {
            var that: CouchDbController = this;

            if (salesFormData && salesFormData.companyName) {
                var companyCode = "";
                var nameArray = salesFormData.companyName.split('');

                for (var i = 0; i < nameArray.length; i++) {
                    companyCode += nameArray[i];
                    if (i > 3) {
                        break;
                    }
                }
                var datePart = new Date().getDay() + new Date().getMonth() + new Date().getDay();
                companyCode += datePart;

                if (salesFormData.salonOwner) {
                    var salonOwnerArray = salesFormData.salonOwner.split("");
                    for (var i = 0; i < salonOwnerArray.length; i++) {
                        companyCode += salonOwnerArray[i];
                        if (i > 3) {
                            break;
                        }
                    }
                }
                else {
                    companyCode += Helpers.GuidHelper.getNewGUIDString().slice(1, 6);
                }
                companyCode += new Date().getMilliseconds();

                salesFormData.companyCode = companyCode;
            }
        }

        private changePayment() {
            var that: CouchDbController = this;
            console.log("Choosen option: ", that.$scope.couchDbScope.orderFormData.modeOfPayment);
        }
        private submitSalesData() {
            var that: CouchDbController = this;
            that.generateCompanyCode(that.$scope.couchDbScope.salesFormData); 
            that.couchDbService.addSalesData(that.$scope.couchDbScope.salesFormData);

            that.$scope.couchDbScope.salesFormData = {};
        }

        private submitOrderForm() {
            var that: CouchDbController = this;

            that.setTotalItemPrice(that.$scope.couchDbScope.orderFormData);

            that.couchDbService.submitOrderData(that.$scope.couchDbScope.orderFormData);

            that.$scope.couchDbScope.orderFormData = {};

        }
        private addNewOrderItem() {
            var that: CouchDbController = this;

            if (that.$scope.couchDbScope.newOrderItem && that.$scope.couchDbScope.orderFormData){
                that.$scope.couchDbScope.orderFormData.orderItems.push(that.$scope.couchDbScope.newOrderItem);
            }
        }
    }
}
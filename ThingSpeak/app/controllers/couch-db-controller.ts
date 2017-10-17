module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        dateToday?: string;
        allSalesData?: Models.SalesForm[];
        salesFormData?: Models.SalesForm;
        allSalesDocs?: Models.SalesDoc[];
        selectedSalesDoc?: Models.SalesDoc;
        searchTerm?:string;
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
            private couchDbService: Services.CouchDbService,
            private $timeout: ng.ITimeoutService) {

            var that: CouchDbController = this;
            that.init();
        }

        private init() {
            var that: CouchDbController = this;

            that.$scope.couchDbScope = {};
            that.$scope.couchDbScope.salesFormData = {};
            that.$scope.couchDbScope.orderFormData = {};
            that.$scope.couchDbScope.newOrderItem = {};
            that.$scope.couchDbScope.allSalesDocs = [];
            that.$scope.couchDbScope.selectedSalesDoc = {};
            that.$scope.couchDbScope.searchTerm = "";
            
            that.$scope.couchDbScope.salesFormData.dateCreated = that.setDate();
            that.$scope.couchDbScope.orderFormData.orderDate = that.setDate();
            that.$scope.couchDbScope.orderFormData.modeOfPayment = Models.PaymentMode.cash;

            var dummySalesData = {
                brancesNumber: 3,
                companyName: "Ukulima coop",
                contactPerson: "Njoroge",
                date: "Monday, Oct 16, 2017, 8:19 PM",
                dayCustomers: 13,
                gelCharges: "2300",
                gelMarketPrice: "1200",
                location: "Nairobi",
                machineBenefit: "Serving ↵more ↵customers↵at a time↵Yeah!",
                machineWorth: "It's actually good",
                phoneNumber: "0712345678",
                machineInterest: "Lemme choose a date",
                salesPerson: "Jane",
                salonOwner: "Maina",
                salonsEmployees: 15,
                weekdayCustomers: 45,
                weekendCustomers: 23,
            }
            //that.$scope.couchDbScope.salesFormData = dummySalesData;

            var dummyOrderData: Models.OrderForm = {
                orderDate: that.setDate(),
                companyData: dummySalesData,
                lastAggregateTotalPrice: "",
                modeOfPayment: Models.PaymentMode.cheque,
                orderItems: [{
                    ItemNumber: new Date().getSeconds().toString() + new Date().getMilliseconds().toString(),
                    description: "Shaving Gel",
                    quantity: "23",
                    unitPrice: "700",
                    totalPrice: ""
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
            //that.$scope.couchDbScope.orderFormData = dummyOrderData;

            that.$scope.couchDbScope.allSalesDocs = that.loadAllSalesData();



        }

        private changeState(state:string) {
            var that: CouchDbController = this;
            //that.$state.go(state);

            console.log("state: ", state);
        }
        private loadAllSalesData():Models.SalesDoc[] {
            var that: CouchDbController = this;

            var salesDoc = that.couchDbService.loadSalesDocs();
            console.log("salesDoc: ", salesDoc);

            if (salesDoc.length > 0) {
                that.$scope.couchDbScope.selectedSalesDoc = salesDoc[0];
            }
            return salesDoc;
        
        }
        private setTotalItemPrice(orderItem: Models.OrderItem){
            if (orderItem) {
                var unitPrice = parseFloat(orderItem.unitPrice);
                var quantity = parseFloat(orderItem.quantity);
                if (!isNaN(unitPrice) && !isNaN(quantity)) {
                    orderItem.totalPrice = (unitPrice * quantity).toString();
                }
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

        private submitSalesData() {
            var that: CouchDbController = this;
            that.generateCompanyCode(that.$scope.couchDbScope.salesFormData); 
            that.couchDbService.addSalesData(that.$scope.couchDbScope.salesFormData);

            that.$scope.couchDbScope.salesFormData = {};
        }

        private addNewOrderItem() {
            var that: CouchDbController = this;

            if (that.$scope.couchDbScope.newOrderItem && that.$scope.couchDbScope.orderFormData) {
                that.setTotalItemPrice(that.$scope.couchDbScope.newOrderItem);
                that.$scope.couchDbScope.orderFormData.orderItems.push(that.$scope.couchDbScope.newOrderItem);

                that.$scope.couchDbScope.newOrderItem = {};
            }
        }
        private submitOrderForm() {
            var that: CouchDbController = this;

            that.$scope.couchDbScope.orderFormData.orderItems.map((item) => {
                if (!item.totalPrice){
                    that.setTotalItemPrice(item);
                }
            });

            that.couchDbService.submitOrderData(that.$scope.couchDbScope.orderFormData);

            that.$scope.couchDbScope.orderFormData = {};

        }
        private selectOrderCompany(doc:Models.SalesDoc) {
            var that: CouchDbController = this;
            that.$scope.couchDbScope.selectedSalesDoc = doc;

            console.log("Selected doc: ", doc.salesData);
            console.log("SearchTerm: ", that.$scope.couchDbScope.searchTerm);

            that.$scope.couchDbScope.searchTerm = "";
        }
    }
}
module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        dateToday?: string;
        salesFormData?: Models.SalesForm;

        expenses?: Models.couchDbModel;
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
            that.$scope.couchDbScope.expenses = {};

            that.getDate();

            //that.loadSalesData();
        }

        private getDate() {
            var that: CouchDbController = this;

            var dateOptions = {
                weekday: "long",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }; 

            var today = new Date().toLocaleTimeString("en-us", dateOptions);
            that.$scope.couchDbScope.salesFormData.date = today;
        }

        public loadSalesData() {
            var that: CouchDbController = this;

            var salesData:any = [];
            var db = new PouchDB("dmm-kenya");

            db.allDocs({ include_docs: true })
                .then(function (sales: any) {
                    salesData = sales.rows;

                    console.log("Sales Data: ", salesData[0].doc);

                })
                .catch(function (err: any) {
                    console.log(err);
                });
        }

        private submitSalesData() {
            var that: CouchDbController = this;

            var dt = that.$scope.couchDbScope.salesFormData;
            //db.put(dt);

            var db = new PouchDB("dmm-kenya");

            var newSalesForm = {
                "_id": new Date().toISOString(),
                "companyName": "st",
                "location": "st",
                "contactPerson": "st",
                "phoneNumber": 123,
                "salonOwner": "st",
                "salesPerson": "st",
                "brancesNumber": 123,
                "salonsEmployees": 123,
                "dayCustomers": "st",
                "weekdayCustomers": 123,
                "weekendCustomers": 123,
                "gelCharges": "st",
                "gelMarketPrice": "st",
                "machineWorth": "st",
                "machineBenefit": "st",
                "machineInterest": "st",
                "customersSignature": "st",
                "salesPersonSignature": "st",
                "managersSignature": "st"
            };
            //db.put(newSalesForm);
            //add then
            //add catch

        }
        private loadCouchData() {
            var that: CouchDbController = this;

            //that.$scope.couchDbScope.expenses = that.couchDbService.getItems();

            //that.couchDbService.getExpenses().done((expenses) => {
            //    that.$scope.couchDbScope.expenses = expenses;

            //    console.log("Expenses: ", that.$scope.couchDbScope.expenses.rows);

            //});

            //that.$scope.couchDbScope.expenses.rows = that.couchDbService.getPouchExpenses();
            //console.log("Expenses: ", that.$scope.couchDbScope.expenses.rows);

        }
    }
}
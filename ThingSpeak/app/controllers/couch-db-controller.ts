module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        dateToday?: string;
        salesFormData?: Models.couchDbModel;

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
            that.$scope.couchDbScope.dateToday = "";
            that.$scope.couchDbScope.salesFormData = {};


            that.$scope.couchDbScope.dateToday = that.getDate();
            that.submitSalesData();

            that.$scope.couchDbScope.expenses = {};

            //that.loadCouchData();
        }

        private getDate(): string {
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

        private submitSalesData() {
            var that: CouchDbController = this;

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
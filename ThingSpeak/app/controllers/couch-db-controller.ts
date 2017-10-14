module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
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
            that.$scope.couchDbScope = {}
            that.$scope.couchDbScope.expenses = {}

            that.loadCouchData();
        }

        private loadCouchData() {
            var that: CouchDbController = this;

            //that.$scope.couchDbScope.expenses = that.couchDbService.getItems();

            that.couchDbService.getExpenses().done((expenses) => {
                that.$scope.couchDbScope.expenses = expenses;

                console.log("Expenses: ", that.$scope.couchDbScope.expenses.rows);

            });

        }
    }
}
module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {


    }

    interface ICouchDbScope extends ng.IScope {
        coachDbScope?: ICurrentScope;
    }

    export class CouchDbController {
        constructor(
            private $scope: ICouchDbScope ) {

            var that: CouchDbController = this;
            that.init();
        }

        private init() {
            var that: CouchDbController = this;

        }
    }
}
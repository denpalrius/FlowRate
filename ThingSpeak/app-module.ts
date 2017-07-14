module ThingSpeak{
    "use strict";

    export class AppModule {
        constructor() {
            // module
            let ngFlowRate: ng.IModule = angular.module("ngFlowRate", ["dndLists"]);

            // services
            ngFlowRate.service("httpService", ["$http", Services.HttpService]);
          
            // controllers
            ngFlowRate.controller("FlowRateController", ["$scope","httpService", Controllers.FlowRateController]);
           
            // bootstrap the app when everything has been loaded
            angular.element(document).ready(function () {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
    }
}
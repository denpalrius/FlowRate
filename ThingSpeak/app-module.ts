module ThingSpeak{
    "use strict";

    export class AppModule {
        constructor() {
            // module
            let ngFlowRate: ng.IModule = angular.module("ngFlowRate",
                [
                    "ui.router"
                ]);

            // configs
            ngFlowRate.config(["$urlRouterProvider", "$stateProvider", "$locationProvider", Configs.RouteConfig]);
            ngFlowRate.config([Configs.AppConfig]);

            //Directives

            //Filters
            ngFlowRate.filter("TsRemoveStringFilter", Filters.TsRemoveStringFilter);
            
            // services
            ngFlowRate.service("httpService", ["$http", Services.HttpService]);
            ngFlowRate.service("thingSpeakService", ["httpService", Services.ThingSpeakService]);
          
            // controllers
            ngFlowRate.controller("AdminController", ["$scope", Controllers.AdminController]);
            ngFlowRate.controller("HomeController", ["$scope", "$rootScope", "$state", Controllers.HomeController]);
            ngFlowRate.controller("FlowRateController", ["$scope", "$rootScope", "$state", "httpService", "thingSpeakService","$timeout", Controllers.FlowRateController]);
            ngFlowRate.controller("AboutController", ["$scope", Controllers.AboutController]);

            // bootstrap the app when everything has been loaded
            angular.element(document).ready(() => {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
    }
}
module ThingSpeak{
    "use strict";

    export class AppModule {
        constructor() {
            // module
            let ngFlowRate: ng.IModule = angular.module("ngFlowRate", ["ui.router","dndLists"]);

            // configs
            ngFlowRate.config(["$urlRouterProvider", "$stateProvider", "$locationProvider", Configs.RouteConfig]);

            //Directives
            ngFlowRate.directive("tsWidgetHeader",Directives.TsWidgetHeader);

            // services
            ngFlowRate.service("httpService", ["$http", Services.HttpService]);
          
            // controllers
            ngFlowRate.controller("NavigationController", ["$scope", "$location", Controllers.NavigationController]);
            ngFlowRate.controller("HomeController", ["$scope", "$state", Controllers.HomeController]);
            ngFlowRate.controller("FlowRateController", ["$scope", "$state", "httpService", Controllers.FlowRateController]);
            ngFlowRate.controller("AboutController", ["$scope", Controllers.AboutController]);
            ngFlowRate.controller("MapViewController", ["$scope", Controllers.MapViewController]);

           
            // bootstrap the app when everything has been loaded
            angular.element(document).ready(function () {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
    }
}
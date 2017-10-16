module ThingSpeak{
    "use strict";

    export class AppModule {
        constructor() {
            // module
            let ngFlowRate: ng.IModule = angular.module("ngFlowRate",
                [
                    "ui.router",
                    "ngMap",
                    "ngMaterial",
                    "angularSpinner",
                    "nemLogging",
                    "ngCookies",
                    "ngMessages",
                    "ngResource",
                    "ngSanitize",
                    "circularMenu-directive",
                    "dndLists"]);

            // configs
            ngFlowRate.config(["$urlRouterProvider", "$stateProvider", "$locationProvider", Configs.RouteConfig]);
            ngFlowRate.config(["$mdThemingProvider","$mdIconProvider", Configs.ThemeConfig]);
            ngFlowRate.config([Configs.AppConfig]);

            //Directives
            ngFlowRate.directive("tsStickyHeader", Directives.tsStickyHeader);
            ngFlowRate.directive("dsSortingAlgorithms", Directives.dsSortingAlgorithms);

            //Filters
            ngFlowRate.filter("TsRemoveStringFilter", Filters.TsRemoveStringFilter);
            
            // services
            ngFlowRate.service("httpService", ["$http", Services.HttpService]);
            ngFlowRate.service("mapDataService", ["httpService", Services.MapDataService]);
            ngFlowRate.service("thingSpeakService", ["httpService", Services.ThingSpeakService]);
            ngFlowRate.service("CouchDbService", ["$http","httpService", Services.CouchDbService]);
          
            // controllers
            ngFlowRate.controller("AdminController", ["$scope", Controllers.AdminController]);
            ngFlowRate.controller("NavigationController", ["$scope", "$location", Controllers.NavigationController]);
            ngFlowRate.controller("HomeController", ["$scope", "$rootScope", "$state","mapDataService", "NgMap", Controllers.HomeController]);
            ngFlowRate.controller("FlowRateController", ["$scope", "$rootScope", "$state", "httpService","thingSpeakService", "usSpinnerService", Controllers.FlowRateController]);
            ngFlowRate.controller("AboutController", ["$scope", Controllers.AboutController]);
            ngFlowRate.controller("CouchDbController", ["$scope", "$state","CouchDbService", Controllers.CouchDbController]);

            // bootstrap the app when everything has been loaded
            angular.element(document).ready(() => {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
    }
}
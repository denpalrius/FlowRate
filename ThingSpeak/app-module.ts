﻿module ThingSpeak{
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

            //Directives
            ngFlowRate.directive("tsWidgetHeader", Directives.menuToggle);
            ngFlowRate.directive("tsStickyHeader", Directives.tsStickyHeader);
            ngFlowRate.directive("dsSortingAlgorithms", Directives.dsSortingAlgorithms);

            //Filters
            ngFlowRate.filter("tsRemoveStringFilter", Filters.TsRemoveStringFilter);
            
            // services
            ngFlowRate.service("httpService", ["$http", Services.HttpService]);
          
            // controllers
            ngFlowRate.controller("AdminController", ["$scope", Controllers.AdminController]);
            ngFlowRate.controller("HomeController", ["$scope", "$rootScope", "$state",  Controllers.HomeController]);
            ngFlowRate.controller("FlowRateController", ["$scope", "$rootScope", "$state", "httpService", "usSpinnerService", Controllers.FlowRateController]);
            ngFlowRate.controller("AboutController", ["$scope", Controllers.AboutController]);
            ngFlowRate.controller("MapViewController", ["$scope", "$state","nemSimpleLogger", Controllers.MapViewController]);

           
            // bootstrap the app when everything has been loaded
            angular.element(document).ready(() => {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
    }
}
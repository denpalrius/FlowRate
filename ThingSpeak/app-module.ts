module ThingSpeak{
    "use strict";

    export class AppModule {
        constructor() {
            // module
            let ngFlowRate: ng.IModule = angular.module("ngFlowRate",
                [
                    "ui.router",
                    "uiGmapgoogle-maps",
                    "ngMap",
                    "nemLogging",
                    "ngCookies",
                    "ngMessages",
                    "ngResource",
                    "ngSanitize",
                    "ngTouch",
                    "circularMenu-directive",
                    "dndLists"]);

            // configs
            ngFlowRate.config(["$urlRouterProvider", "$stateProvider", "$locationProvider", Configs.RouteConfig]);

            //Directives
            ngFlowRate.directive("tsWidgetHeader", Directives.menuToggle);
            ngFlowRate.directive("tsStickyHeader", Directives.tsStickyHeader);

            // services
            ngFlowRate.service("httpService", ["$http", Services.HttpService]);
          
            // controllers
            ngFlowRate.controller("AdminController", ["$scope", Controllers.AdminController]);
            ngFlowRate.controller("HomeController", ["$scope", "$rootscope", "$state",  Controllers.HomeController]);
            ngFlowRate.controller("FlowRateController", ["$scope", "$rootscope", "$state", "httpService", Controllers.FlowRateController]);
            ngFlowRate.controller("AboutController", ["$scope", Controllers.AboutController]);
            ngFlowRate.controller("MapViewController", ["$scope", "$state","nemSimpleLogger", Controllers.MapViewController]);

           
            // bootstrap the app when everything has been loaded
            angular.element(document).ready(() => {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
    }
}
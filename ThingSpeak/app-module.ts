module ThingSpeak{
    "use strict";

    export class AppModule {
        constructor() {
            // module
            let ngFlowRate: ng.IModule = angular.module("ngFlowRate", ["ngRoute", "ngMaterial", "ngMessages", "ngAnimate","ui.bootstrap", "ngCookies", "firebase"]);

            // configs
            ngFlowRate.config([Configs.AppConfig]);
            ngFlowRate.config(["$routeProvider", "$locationProvider", Configs.RouteConfig]);
            ngFlowRate.config(["$mdThemingProvider", "$mdIconProvider", Configs.ThemeConfig]);

            //Directives
            ngFlowRate.directive("tsGoogleMap", ["$timeout", "$log", "$rootScope", "HttpService", Directives.TsGoogleMap]);

            //Filters
            ngFlowRate.filter("TsRemoveStringFilter", Filters.TsRemoveStringFilter);

            // services
            ngFlowRate.service("HttpService", ["$http", Services.HttpService]);
            ngFlowRate.service("MapService", ["$rootScope", Services.MapService]);
            ngFlowRate.service("ThingSpeakService", ["HttpService", Services.ThingSpeakService]);
            ngFlowRate.service("FirebaseService", ["$cookies",Services.FirebaseService]);

            // controllers
            ngFlowRate.controller("LoginController", ["$scope", "$location", "FirebaseService", Controllers.LoginController]);
            ngFlowRate.controller("HomeController", ["$scope", "$rootScope", "$timeout", "$location", "$cookies", "FirebaseService", "MapService", "$mdSidenav", Controllers.HomeController]);
            ngFlowRate.controller("AdminController", ["$scope", "FirebaseService", Controllers.AdminController]);
            ngFlowRate.controller("FlowRateController", ["$scope", "$rootScope", "$location", "HttpService", "ThingSpeakService", "$timeout", Controllers.FlowRateController]);
            ngFlowRate.controller("AboutController", ["$scope", Controllers.LoginController]);

            // bootstrap the app when everything has been loaded
            angular.element(document).ready(() => {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
    }
}
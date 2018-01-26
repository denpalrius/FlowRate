module ThingSpeak{
    "use strict";

    export class AppModule {
        constructor() {
            // module
            let ngFlowRate: ng.IModule = angular.module("ngFlowRate", ["ngRoute", "ngMaterial", "ngMessages", "firebase"]);

            // configs
            ngFlowRate.config([Configs.AppConfig]);
            ngFlowRate.config(["$routeProvider", "$locationProvider", Configs.RouteConfig]);
            ngFlowRate.config(["$mdThemingProvider", "$mdIconProvider", Configs.ThemeConfig]);

            //Directives
            ngFlowRate.directive("tsGoogleMap", ["$timeout", "$log", Directives.TsGoogleMap]);

            //Filters
            ngFlowRate.filter("TsRemoveStringFilter", Filters.TsRemoveStringFilter);

            // services
            ngFlowRate.service("HttpService", ["$http", Services.HttpService]);
            ngFlowRate.service("ThingSpeakService", ["HttpService", Services.ThingSpeakService]);
            ngFlowRate.service("FirebaseService", ["$firebaseObject", Services.FirebaseService]);

            // controllers
            ngFlowRate.controller("AdminController", ["$scope", Controllers.AdminController]);
            ngFlowRate.controller("HomeController", ["$scope", "$rootScope", "$location", "FirebaseService", Controllers.HomeController]);
            ngFlowRate.controller("FlowRateController", ["$scope", "$rootScope", "$location", "HttpService", "ThingSpeakService","$timeout", Controllers.FlowRateController]);
            ngFlowRate.controller("AboutController", ["$scope", Controllers.AboutController]);

            // bootstrap the app when everything has been loaded
            angular.element(document).ready(() => {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
    }
}
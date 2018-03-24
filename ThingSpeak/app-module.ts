module Flux{
    "use strict";

    export class AppModule {
        constructor() {
            // module
            let ngFlux: ng.IModule = angular.module("ngFlux", ["ngRoute", "ngMaterial", "ngMessages", "ngAnimate","ui.bootstrap", "ngCookies", "firebase"]);

            // configs
            ngFlux.config([Configs.AppConfig]);
            ngFlux.config(["$routeProvider", "$locationProvider", Configs.RouteConfig]);
            ngFlux.config(["$mdThemingProvider", "$mdIconProvider", Configs.ThemeConfig]);

            //Directives
            ngFlux.directive("tsGoogleMap", ["$timeout", "$log", "$rootScope", "HttpService", Directives.TsGoogleMap]);

            //Filters
            ngFlux.filter("TsRemoveStringFilter", Filters.TsRemoveStringFilter);

            // services
            ngFlux.service("HttpService", ["$http", Services.HttpService]);
            ngFlux.service("MapService", ["$rootScope", Services.MapService]);
            ngFlux.service("ThingSpeakService" ,["HttpService", "FirebaseService", Services.ThingSpeakService]);
            ngFlux.service("FirebaseService", ["$cookies",Services.FirebaseService]);

            // controllers
            ngFlux.controller("LoginController", ["$scope", "$location", "FirebaseService", "$mdToast", Controllers.LoginController]);
            ngFlux.controller("HomeController", ["$scope", "$rootScope", "$timeout", "$location", "$cookies", "FirebaseService", "MapService", Controllers.HomeController]);
            ngFlux.controller("AdminController", ["$scope", "$location", "FirebaseService", "HttpService", "$mdToast", Controllers.AdminController]);
            ngFlux.controller("FlowRateController", ["$scope", "$rootScope", "$location", "HttpService", "ThingSpeakService", "$timeout", Controllers.FlowRateController]);
            ngFlux.controller("ProfileController", ["$scope", Controllers.ProfileController]);

            // bootstrap the app when everything has been loaded
            angular.element(document).ready(() => {
                angular.bootstrap(document, ["ngFlux"]);
            });
        }
    }
}
var Flux;
(function (Flux) {
    "use strict";
    var AppModule = (function () {
        function AppModule() {
            var ngFlux = angular.module("ngFlux", ["ngRoute", "ngMaterial", "ngMessages", "ngAnimate", "ui.bootstrap", "ngCookies", "firebase"]);
            ngFlux.config([Flux.Configs.AppConfig]);
            ngFlux.config(["$routeProvider", "$locationProvider", Flux.Configs.RouteConfig]);
            ngFlux.config(["$mdThemingProvider", "$mdIconProvider", Flux.Configs.ThemeConfig]);
            ngFlux.directive("tsGoogleMap", ["$timeout", "$log", "$rootScope", "HttpService", Flux.Directives.TsGoogleMap]);
            ngFlux.filter("TsRemoveStringFilter", Flux.Filters.TsRemoveStringFilter);
            ngFlux.service("HttpService", ["$http", Flux.Services.HttpService]);
            ngFlux.service("MapService", ["$rootScope", Flux.Services.MapService]);
            ngFlux.service("ThingSpeakService", ["HttpService", "FirebaseService", Flux.Services.ThingSpeakService]);
            ngFlux.service("FirebaseService", ["$cookies", Flux.Services.FirebaseService]);
            ngFlux.controller("LoginController", ["$scope", "$location", "FirebaseService", "$mdToast", Flux.Controllers.LoginController]);
            ngFlux.controller("HomeController", ["$scope", "$rootScope", "$timeout", "$location", "$cookies", "FirebaseService", "MapService", Flux.Controllers.HomeController]);
            ngFlux.controller("AdminController", ["$scope", "$location", "FirebaseService", "HttpService", "$mdToast", Flux.Controllers.AdminController]);
            ngFlux.controller("FlowRateController", ["$scope", "$rootScope", "$location", "HttpService", "ThingSpeakService", "$timeout", Flux.Controllers.FlowRateController]);
            ngFlux.controller("ProfileController", ["$scope", Flux.Controllers.ProfileController]);
            angular.element(document).ready(function () {
                angular.bootstrap(document, ["ngFlux"]);
            });
        }
        return AppModule;
    }());
    Flux.AppModule = AppModule;
})(Flux || (Flux = {}));

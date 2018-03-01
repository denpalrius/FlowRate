var ThingSpeak;
(function (ThingSpeak) {
    var Configs;
    (function (Configs) {
        var RouteConfig = (function () {
            function RouteConfig($routeProvider, $locationProvider) {
                $routeProvider
                    .when("/login", {
                    templateUrl: '/app/views/login.html',
                    controllerAs: 'LoginCtrl',
                    controller: 'LoginController',
                })
                    .when("/home", {
                    templateUrl: '/app/views/home.html',
                    controllerAs: 'HomeCtrl',
                    controller: 'HomeController',
                })
                    .when("/about", {
                    templateUrl: '/app/views/about.html',
                    controllerAs: 'AboutCtrl',
                    controller: 'AboutController',
                })
                    .when("/admin", {
                    templateUrl: '/app/views/admin.html',
                    controllerAs: 'AdminCtrl',
                    controller: 'AdminController',
                })
                    .when("/flowrate", {
                    templateUrl: '/app/views/flow-rate.html',
                    controllerAs: 'FlowRateCtrl',
                    controller: 'FlowRateController',
                })
                    .otherwise({
                    redirectTo: "/home",
                });
                $locationProvider.html5Mode(true);
            }
            return RouteConfig;
        }());
        Configs.RouteConfig = RouteConfig;
    })(Configs = ThingSpeak.Configs || (ThingSpeak.Configs = {}));
})(ThingSpeak || (ThingSpeak = {}));

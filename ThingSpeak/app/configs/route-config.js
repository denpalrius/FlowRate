var Flux;
(function (Flux) {
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
                    .when("/admin", {
                    templateUrl: '/app/views/admin.html',
                    controllerAs: 'AdminCtrl',
                    controller: 'AdminController',
                })
                    .when("/profile", {
                    templateUrl: '/app/views/profile.html',
                    controllerAs: 'ProfCtrl',
                    controller: 'ProfileController',
                })
                    .otherwise({
                    redirectTo: "/home",
                });
                $locationProvider.html5Mode(true);
            }
            return RouteConfig;
        }());
        Configs.RouteConfig = RouteConfig;
    })(Configs = Flux.Configs || (Flux.Configs = {}));
})(Flux || (Flux = {}));

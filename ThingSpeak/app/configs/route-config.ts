module ThingSpeak.Configs {
    export class RouteConfig {
        constructor($routeProvider: ng.route.IRouteProvider, $locationProvider: ng.ILocationProvider) {
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
    }
}
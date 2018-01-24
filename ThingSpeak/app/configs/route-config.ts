module ThingSpeak.Configs {
    export class RouteConfig {
        constructor(
            $urlRouterProvider: angular.ui.IUrlRouterProvider,
            $stateProvider: angular.ui.IStateProvider,
            $locationProvider: ng.ILocationProvider) {

            // For any unmatched url, send to 404
            //$urlRouterProvider.when('', '/');
            //$urlRouterProvider.otherwise('/404');

            $locationProvider.hashPrefix('');
            $urlRouterProvider.otherwise('/');   

            $stateProvider
                .state('home', {
                    url: '/',
                    controller: 'HomeController',
                    controllerAs: 'HomeCtrl',
                    templateUrl: 'app/views/home-view.html'
                })
                .state('about', {
                    url: '/about',
                    controller: 'AboutController',
                    controllerAs: 'AboutCtrl',
                    templateUrl: 'app/views/about-view.html'
                })
                .state('flowrate', {
                    url: '/flowrate',
                    controller: 'FlowRateController',
                    controllerAs: 'FlowRateCtrl',
                    templateUrl: 'app/views/raw-flow-rate-view.html'
                })
                .state('Admin', {
                    url: '/admin',
                    controller: 'AdminController',
                    controllerAs: 'AdminCtrl',
                    templateUrl: 'app/views/admin-view.html'
                });
        }
    }
}
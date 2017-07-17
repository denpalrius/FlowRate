﻿module ThingSpeak.Configs {
    export class RouteConfig {
        constructor(
            $urlRouterProvider: angular.ui.IUrlRouterProvider,
            $stateProvider: angular.ui.IStateProvider,
            $locationProvider: ng.ILocationProvider) {
            
            $locationProvider.hashPrefix('');
            $urlRouterProvider.otherwise('/');

            $stateProvider
                //.state('home', {
                //        url: '/',
                //        controller: 'HomeController',
                //        controllerAs: 'HomeCtrl',
                //        templateUrl: '/app/views/home-view.html'
                //})

                .state('home', {
                    url: '/',
                    controller: 'HomeController',
                    controllerAs: 'HomeCtrl',
                    templateUrl: 'app/views/home/home-view.html'
                })

                .state('about', {
                    url: '/about',
                    controller: 'AboutController',
                    controllerAs: 'AboutCtrl',
                    templateUrl: 'app/views/about-view.html'
                })
                .state('mapview', {
                    url: '/mapview',
                    controller: 'MapViewController',
                    controllerAs: 'MapViewCtrl',
                    templateUrl: 'app/views/map-view.html'
                })
                .state('flowrate', {
                    url: '/flowrate',
                    controller: 'FlowRateController',
                    controllerAs: 'FlowRateCtrl',
                    templateUrl: 'app/views/raw-flow-rate-view.html'
                });

        }
    }
}
var ThingSpeak;
(function (ThingSpeak) {
    var Configs;
    (function (Configs) {
        var AppConfig = (function () {
            function AppConfig() {
            }
            AppConfig.ApiUrl = "https://thingspeak.com/channels/16153/feed.json";
            return AppConfig;
        }());
        Configs.AppConfig = AppConfig;
    })(Configs = ThingSpeak.Configs || (ThingSpeak.Configs = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Configs;
    (function (Configs) {
        var GoogleMapsConfig = (function () {
            function GoogleMapsConfig() {
            }
            return GoogleMapsConfig;
        }());
        Configs.GoogleMapsConfig = GoogleMapsConfig;
    })(Configs = ThingSpeak.Configs || (ThingSpeak.Configs = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Configs;
    (function (Configs) {
        var RouteConfig = (function () {
            function RouteConfig($urlRouterProvider, $stateProvider, $locationProvider) {
                // For any unmatched url, send to 404
                //$urlRouterProvider.when('', '/');
                //$urlRouterProvider.otherwise('/404');
                $locationProvider.hashPrefix('');
                $urlRouterProvider.otherwise('/');
                $stateProvider
                    .state('Home', {
                    url: '/',
                    controller: 'HomeController',
                    controllerAs: 'HomeCtrl',
                    templateUrl: 'app/views/home-view.html'
                })
                    .state('About', {
                    url: '/about',
                    controller: 'AboutController',
                    controllerAs: 'AboutCtrl',
                    templateUrl: 'app/views/about-view.html'
                })
                    .state('Map', {
                    url: '/map',
                    controller: 'MapViewController',
                    controllerAs: 'MapViewCtrl',
                    templateUrl: 'app/views/map-view.html'
                })
                    .state('Flow Rate', {
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
            return RouteConfig;
        }());
        Configs.RouteConfig = RouteConfig;
    })(Configs = ThingSpeak.Configs || (ThingSpeak.Configs = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var AboutController = (function () {
            function AboutController($scope) {
                this.$scope = $scope;
                var that = this;
                that.init();
            }
            AboutController.prototype.init = function () {
                var that = this;
            };
            return AboutController;
        }());
        Controllers.AboutController = AboutController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var AdminController = (function () {
            function AdminController($scope) {
                this.$scope = $scope;
                var that = this;
                that.init();
            }
            AdminController.prototype.init = function () {
                var that = this;
            };
            return AdminController;
        }());
        Controllers.AdminController = AdminController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var FlowRateController = (function () {
            function FlowRateController($scope, $state, httpService) {
                this.$scope = $scope;
                this.$state = $state;
                this.httpService = httpService;
                var that = this;
                that.init();
            }
            FlowRateController.prototype.init = function () {
                var that = this;
                that.$scope.flowRateScope = {};
                that.$scope.flowRateScope.maraRiverFlowRate = {};
                that.$scope.flowRateScope.channel = {};
                that.$scope.flowRateScope.feeds = [];
                that.$scope.flowRateScope.reorderFeeds = [];
                that.$scope.flowRateScope.selectedFeed = [];
                that.$scope.flowRateScope.$stickies = [];
                that.getData();
                //TODO: Do a progress ring
                //TODO: Paginate the table
                //TODO: Add charts for Field 1, field 2 ad field 3
                //TODO: Map
            };
            FlowRateController.prototype.getData = function () {
                var deferred = $.Deferred();
                var that = this;
                console.log("Fetching data....");
                that.httpService.get(ThingSpeak.Configs.AppConfig.ApiUrl)
                    .done(function (response) {
                    var maraRiverFlowRateData = response.data;
                    that.$scope.flowRateScope.maraRiverFlowRate = maraRiverFlowRateData;
                    that.$scope.flowRateScope.channel = maraRiverFlowRateData.channel;
                    that.$scope.flowRateScope.feeds = maraRiverFlowRateData.feeds;
                    console.log("Mara River Flow Rate: ", that.$scope.flowRateScope.maraRiverFlowRate);
                    deferred.resolve(that.$scope.flowRateScope.maraRiverFlowRate);
                })
                    .fail(function (error) {
                    console.log("Failed to get the JSON data");
                    deferred.reject(error);
                });
                console.log("Done fetching data....");
                //*Assuming all data is loaded
                return deferred;
            };
            FlowRateController.prototype.selectFeed = function (feed) {
                var that = this;
                that.$scope.flowRateScope.selectedFeed = feed;
                console.log("Selected Feed: ", feed.entry_id);
            };
            FlowRateController.prototype.openReorderDialog = function () {
                var that = this;
                that.$scope.flowRateScope.reorderFeeds = angular.copy(that.$scope.flowRateScope.feeds);
                console.log("Reorder list: ", that.$scope.flowRateScope.reorderFeeds);
            };
            return FlowRateController;
        }());
        Controllers.FlowRateController = FlowRateController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var HomeController = (function () {
            function HomeController($scope, $state) {
                this.$scope = $scope;
                this.$state = $state;
                var that = this;
                that.init();
            }
            HomeController.prototype.init = function () {
                var that = this;
                that.$scope.homeScope = {};
                that.$scope.homeScope.pageTitle = "Agenda Reordering";
                that.$scope.homeScope.displayLabel = "";
                that.fillMenu();
            };
            HomeController.prototype.fillMenu = function () {
                var that = this;
                that.$scope.homeScope.menuConfig = {
                    "buttonWidth": 60,
                    "menuRadius": 180,
                    "color": "#393c41",
                    "offset": 25,
                    "textColor": "#ffffff",
                    "showIcons": true,
                    "onlyIcon": false,
                    "textAndIcon": true,
                    "gutter": {
                        "top": 35,
                        "right": 50,
                        "bottom": 35,
                        "left": 35
                    },
                    "angles": {
                        "topLeft": 0,
                        "topRight": 90,
                        "bottomRight": 180,
                        "bottomLeft": 270
                    }
                };
                that.$scope.homeScope.menuItems = [{
                        "title": "Flow Rate",
                        "color": "#424242",
                        "rotate": 0,
                        "show": 0,
                        "titleColor": "#fff",
                        "icon": { "color": "#fff", "name": "fa fa-line-chart", "size": 20 }
                    }, {
                        "title": "Map",
                        "color": "#303030",
                        "rotate": 0,
                        "show": 0,
                        "titleColor": "#fff",
                        "icon": { "color": "#fff", "name": "fa fa-map", "size": 20 }
                    }, {
                        "title": "About",
                        "color": "#212121",
                        "rotate": 0,
                        "show": 0,
                        "titleColor": "#fff",
                        "icon": { "color": "#fff", "name": "fa fa-info", "size": 25 }
                    }, {
                        "title": "Admin",
                        "color": "#000000",
                        "rotate": 0,
                        "show": 0,
                        "titleColor": "#fff",
                        "icon": { "color": "#fff", "name": "fa fa-sliders", "size": 20 }
                    }];
            };
            HomeController.prototype.onWingClick = function (wing) {
                var that = this;
                that.$state.go(wing.title);
            };
            return HomeController;
        }());
        Controllers.HomeController = HomeController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var MapViewController = (function () {
            function MapViewController($scope, $state, uiGmapGoogleMapApi, nemSimpleLogger) {
                this.$scope = $scope;
                this.$state = $state;
                this.uiGmapGoogleMapApi = uiGmapGoogleMapApi;
                this.nemSimpleLogger = nemSimpleLogger;
                var that = this;
                that.init();
            }
            MapViewController.prototype.init = function () {
                var that = this;
                that.$scope.mapScope = {};
                that.$scope.mapScope.mapName = "";
                that.loadMap();
            };
            MapViewController.prototype.loadMap = function () {
                var that = this;
                var customMapStyle = [
                    {
                        "featureType": "administrative",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#444444"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#f2f2f2"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "color": "#bab8cb"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "labels",
                        "stylers": [
                            {
                                "color": "#9a3fa0"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [
                            {
                                "saturation": -100
                            },
                            {
                                "lightness": 45
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "color": "#8e2b2b"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#30a4d3"
                            },
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "visibility": "on"
                            },
                            {
                                "hue": "#00a3ff"
                            }
                        ]
                    }
                ];
                that.$scope.mapScope.map = {
                    center: {
                        latitude: -1.2920659,
                        longitude: 36.8219462
                    },
                    zoom: 8,
                    options: {
                        styles: customMapStyle,
                        streetViewControl: false,
                        mapTypeControl: false,
                        scaleControl: false,
                        rotateControl: false,
                        zoomControl: false
                    },
                    bounds: {
                        northeast: {
                            latitude: 0.17687,
                            longitude: 37.90833
                        },
                        southwest: {
                            latitude: -0.17687,
                            longitude: -37.90833
                        }
                    }
                };
                console.log("Map Center: ", that.$scope.mapScope.map.center);
            };
            return MapViewController;
        }());
        Controllers.MapViewController = MapViewController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var NavigationController = (function () {
            function NavigationController($scope, $location) {
                this.$scope = $scope;
                this.$location = $location;
                var that = this;
                //that.$scope.navigationScope.isSelected = function (path) {
                //    return this.isSelected(path)
                //}.bind(this);
            }
            NavigationController.prototype.isSelected = function (path) {
                return this.$location.path().substr(0, path.length) == path;
            };
            NavigationController.prototype.getPath = function (path) {
                var that = this;
                console.log(that.$location.path());
                return path === that.$location.path();
            };
            ;
            return NavigationController;
        }());
        Controllers.NavigationController = NavigationController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Directives;
    (function (Directives) {
        "use strict";
        function menuToggle() {
            return {
                restrict: "AE",
                scope: {
                    title: '@',
                    isOpen: '@',
                    isMenuCollapsed: '@',
                    section: '='
                },
                templateUrl: '/app/views/templates/ts-widget.html',
                link: function ($scope, $elm, $attr) {
                    var controller = $elm.parent().controller();
                    $scope.isOpen = function () { return controller.isOpen($scope.section); };
                    $scope.toggle = function () {
                        controller.toggleOpen($scope.section);
                    };
                }
            };
        }
        Directives.menuToggle = menuToggle;
    })(Directives = ThingSpeak.Directives || (ThingSpeak.Directives = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Directives;
    (function (Directives) {
        "use strict";
        function setStickies(stickies, $scope) {
            if (typeof stickies === "object" && stickies instanceof jQuery && stickies.length > 0) {
                $scope.$stickies = stickies.each(function () {
                    var $thisSticky = $(this).wrap('<div class="followWrap" />');
                    $thisSticky
                        .data("originalPosition", $thisSticky.offset().top)
                        .data("originalHeight", $thisSticky.outerHeight())
                        .parent()
                        .height($thisSticky.outerHeight());
                });
                $scope.$window.off("scroll.stickies").on("scroll.stickies", function () {
                    whenScrolling($scope);
                });
            }
        }
        function whenScrolling($scope) {
            $scope.$stickies.each(function (i) {
                var $thisSticky = $(this), $stickyPosition = $thisSticky.data("originalPosition");
                if ($stickyPosition <= $scope.$window.scrollTop()) {
                    var $nextSticky = $scope.$stickies.eq(i + 1), $nextStickyPosition = $nextSticky.data("originalPosition") -
                        $thisSticky.data("originalHeight");
                    $thisSticky.addClass("fixed");
                    if ($nextSticky.length > 0 &&
                        $thisSticky.offset().top >= $nextStickyPosition) {
                        $thisSticky.addClass("absolute").css("top", $nextStickyPosition);
                        console.log("$nextSticky: ", $nextSticky);
                    }
                }
                else {
                    var $prevSticky = $scope.$stickies.eq(i - 1);
                    $thisSticky.removeClass("fixed");
                    if ($prevSticky.length > 0 &&
                        $scope.$window.scrollTop() <=
                            $thisSticky.data("originalPosition") -
                                $thisSticky.data("originalHeight")) {
                        $prevSticky.removeClass("absolute").removeAttr("style");
                    }
                }
            });
        }
        function tsStickyHeader() {
            return {
                restrict: "AE",
                scope: {
                    title: '@',
                    isOpen: '@',
                    isMenuCollapsed: '@',
                    section: '=',
                    list: '='
                },
                link: function ($scope, $elm, $attr) {
                    $scope.$window = angular.element(window);
                    $scope.$stickies = $elm;
                    $scope.$watch('list', function () {
                        if ($scope.list.length > 0) {
                            setStickies($elm.eq(0).children(), $scope);
                        }
                    });
                }
            };
        }
        Directives.tsStickyHeader = tsStickyHeader;
    })(Directives = ThingSpeak.Directives || (ThingSpeak.Directives = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Models;
    (function (Models) {
        "use strict";
    })(Models = ThingSpeak.Models || (ThingSpeak.Models = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Models;
    (function (Models) {
        "use strict";
    })(Models = ThingSpeak.Models || (ThingSpeak.Models = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Services;
    (function (Services) {
        var HttpService = (function () {
            function HttpService($http) {
                this.$http = $http;
                var that = this;
            }
            HttpService.prototype.get = function (url) {
                var that = this;
                var deferred = $.Deferred();
                that.$http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (successresponse) {
                    deferred.resolve(successresponse);
                }, function (errorResponse) {
                    deferred.reject(errorResponse);
                });
                return deferred;
            };
            return HttpService;
        }());
        Services.HttpService = HttpService;
    })(Services = ThingSpeak.Services || (ThingSpeak.Services = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    "use strict";
    var AppModule = (function () {
        function AppModule() {
            // module
            var ngFlowRate = angular.module("ngFlowRate", [
                "ui.router",
                "uiGmapgoogle-maps",
                "nemLogging",
                "ngCookies",
                "ngMessages",
                "ngResource",
                "ngSanitize",
                "ngTouch",
                "circularMenu-directive",
                "dndLists"]);
            // configs
            ngFlowRate.config(["$urlRouterProvider", "$stateProvider", "$locationProvider", ThingSpeak.Configs.RouteConfig]);
            //Directives
            ngFlowRate.directive("tsWidgetHeader", ThingSpeak.Directives.menuToggle);
            ngFlowRate.directive("tsStickyHeader", ThingSpeak.Directives.tsStickyHeader);
            // services
            ngFlowRate.service("httpService", ["$http", ThingSpeak.Services.HttpService]);
            // controllers
            ngFlowRate.controller("AdminController", ["$scope", ThingSpeak.Controllers.AdminController]);
            ngFlowRate.controller("HomeController", ["$scope", "$state", ThingSpeak.Controllers.HomeController]);
            ngFlowRate.controller("FlowRateController", ["$scope", "$state", "httpService", ThingSpeak.Controllers.FlowRateController]);
            ngFlowRate.controller("AboutController", ["$scope", ThingSpeak.Controllers.AboutController]);
            ngFlowRate.controller("MapViewController", ["$scope", "$state", "nemSimpleLogger", ThingSpeak.Controllers.MapViewController]);
            // bootstrap the app when everything has been loaded
            angular.element(document).ready(function () {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
        return AppModule;
    }());
    ThingSpeak.AppModule = AppModule;
})(ThingSpeak || (ThingSpeak = {}));
//# sourceMappingURL=app.js.map
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
        var RouteConfig = (function () {
            function RouteConfig($urlRouterProvider, $stateProvider, $locationProvider) {
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
                //that.$scope.flowRateScope = {};
                that.$scope.flowRateScope.maraRiverFlowRate = {};
                that.$scope.flowRateScope.channel = {};
                that.$scope.flowRateScope.feeds = [];
                that.$scope.flowRateScope.reorderFeeds = [];
                that.$scope.flowRateScope.selectedFeed = [];
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
                that.$scope.homeScope.pageTitle = "Compare Positions";
                that.$scope.homeScope.sourcePos = "2.3.4";
                that.$scope.homeScope.destinationPos = "3.3.41s";
                that.$scope.homeScope.largerPos = 0;
            };
            HomeController.prototype.checkPosition = function () {
                var that = this;
                var rs = that.comparePositions(that.$scope.homeScope.sourcePos, that.$scope.homeScope.destinationPos);
                console.log("Largest Position:", rs);
                that.$scope.homeScope.largerPos = parseFloat(rs);
            };
            HomeController.prototype.containsNaN = function (numArray) {
                numArray.forEach(function (item) {
                    if (isNaN(item)) {
                        return true;
                    }
                    return false;
                });
                return false;
            };
            HomeController.prototype.comparePositions = function (sourcePos, destinationPos) {
                var that = this;
                var sourcePosArray = sourcePos.split('.').map(function (n) { return parseInt(n, 10); });
                var destinationPosArray = destinationPos.split('.').map(function (n) { return parseInt(n, 10); });
                console.log('SourcePosArray: ', sourcePosArray);
                console.log('DestinationPosArray: ', destinationPosArray);
                if (that.containsNaN(sourcePosArray) || that.containsNaN(destinationPosArray)) {
                    console.log('You have NaN values');
                    return "Contains NaN";
                }
                for (var i = 0; i < sourcePosArray.length; i++) {
                    if (sourcePosArray[i] === destinationPosArray[i]) {
                        continue;
                    }
                    else {
                        if (i > 0) {
                            //SourceDec and destinationDec are temporary decimal numbers to be used for comparison
                            var sourceDec = parseFloat(sourcePosArray[i - 1].toString() + "." + sourcePosArray[i].toString());
                            var destinationDec = 0;
                            if (destinationPosArray.length === 1) {
                                destinationDec = parseFloat(destinationPosArray[i - 1].toString() + "." + destinationPosArray[i].toString());
                            }
                            else {
                                destinationDec = parseFloat(destinationPosArray[i - 1].toString() + "." + destinationPosArray[i].toString());
                            }
                            console.log('sourceDec:', sourceDec);
                            console.log('destinationDec:', destinationDec);
                            return sourceDec > destinationDec ? sourcePos : destinationPos;
                        }
                        else {
                            if (sourcePosArray[i] > destinationPosArray[i]) {
                                return sourcePos;
                            }
                            else {
                                return destinationPos;
                            }
                        }
                    }
                }
                if (destinationPosArray.length > sourcePosArray.length) {
                    return destinationPos;
                }
                else if (destinationPosArray.length === sourcePosArray.length) {
                    return "Equal";
                }
                return "Things went wrong";
            };
            HomeController.prototype.othercomparePositions = function (positions) {
                var that = this;
                positions.split(",").reduce(function (initialPos, followingPosition) {
                    var initialPosArray = initialPos.split('.').map(function (n) { return parseInt(n, 10); });
                    var followingPositionArray = followingPosition.split('.').map(function (n) { return parseInt(n, 10); });
                    console.log('initialPosArray: ', initialPosArray);
                    console.log('followingPositionArray: ', followingPositionArray);
                    if (that.containsNaN(initialPosArray) || that.containsNaN(followingPositionArray)) {
                        console.log('You have NaN values');
                        return "Contains Strings";
                    }
                    for (var i = 0; i < initialPosArray.length; i++) {
                        if (initialPosArray[i] === followingPositionArray[i]) {
                            continue;
                        }
                        else {
                            if (i > 0) {
                                var dec1 = parseFloat(initialPosArray[i - 1].toString() + "." + initialPosArray[i].toString());
                                //if (followingPositionArray.length) {
                                //}
                                var dec2 = parseFloat(followingPositionArray[i - 1].toString() + "." + followingPositionArray[i].toString());
                                console.log('Dec1:', dec1);
                                console.log('Dec1:', dec2);
                                return dec1 > dec2 ? initialPos : followingPosition;
                            }
                            else {
                                if (initialPosArray[i] > followingPositionArray[i]) {
                                    return initialPos;
                                }
                                else {
                                    return followingPosition;
                                }
                            }
                        }
                    }
                    if (followingPositionArray.length > initialPosArray.length) {
                        return followingPosition;
                    }
                    else {
                        return "Equal";
                    }
                });
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
            function MapViewController($scope) {
                this.$scope = $scope;
                var that = this;
                that.init();
            }
            MapViewController.prototype.init = function () {
                var that = this;
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
        function tsWidgetHeader() {
            return {
                restrict: "AE",
                scope: {
                    title: '@',
                    subtitle: '@',
                    rightText: '@',
                    isMenuCollapsed: '@',
                    collapseMenu: '@'
                },
                templateUrl: '/app/views/templates/ts-widget.html',
                link: function (scope, $elm, $attr) {
                    //scope.selectedmenu = function (isMenuCollapsed){
                    //}
                    //    scope.collapseMenu({ isMenuCollapsed: isMenuCollapsed});
                    //}
                }
            };
        }
        Directives.tsWidgetHeader = tsWidgetHeader;
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
            var ngFlowRate = angular.module("ngFlowRate", ["ui.router", "dndLists"]);
            // configs
            ngFlowRate.config(["$urlRouterProvider", "$stateProvider", "$locationProvider", ThingSpeak.Configs.RouteConfig]);
            //Directives
            ngFlowRate.directive("tsWidgetHeader", ThingSpeak.Directives.tsWidgetHeader);
            // services
            ngFlowRate.service("httpService", ["$http", ThingSpeak.Services.HttpService]);
            // controllers
            ngFlowRate.controller("NavigationController", ["$scope", "$location", ThingSpeak.Controllers.NavigationController]);
            ngFlowRate.controller("HomeController", ["$scope", "$state", ThingSpeak.Controllers.HomeController]);
            ngFlowRate.controller("FlowRateController", ["$scope", "$state", "httpService", ThingSpeak.Controllers.FlowRateController]);
            ngFlowRate.controller("AboutController", ["$scope", ThingSpeak.Controllers.AboutController]);
            ngFlowRate.controller("MapViewController", ["$scope", ThingSpeak.Controllers.MapViewController]);
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
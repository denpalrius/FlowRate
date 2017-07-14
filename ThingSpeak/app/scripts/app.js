var ThingSpeak;
(function (ThingSpeak) {
    "use strict";
    var AppModule = (function () {
        function AppModule() {
            // module
            var ngFlowRate = angular.module("ngFlowRate", ["dndLists"]);
            // services
            ngFlowRate.service("httpService", ["$http", ThingSpeak.Services.HttpService]);
            // controllers
            ngFlowRate.controller("FlowRateController", ["$scope", "httpService", ThingSpeak.Controllers.FlowRateController]);
            // bootstrap the app when everything has been loaded
            angular.element(document).ready(function () {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
        return AppModule;
    }());
    ThingSpeak.AppModule = AppModule;
})(ThingSpeak || (ThingSpeak = {}));
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
    var Controllers;
    (function (Controllers) {
        "use strict";
        var MapController = (function () {
            function MapController($scope) {
                this.$scope = $scope;
                var that = this;
                that.init();
            }
            MapController.prototype.init = function () {
                var that = this;
            };
            return MapController;
        }());
        Controllers.MapController = MapController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
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
        var HomeController = (function () {
            function HomeController($scope) {
                this.$scope = $scope;
                var that = this;
                that.init();
            }
            HomeController.prototype.init = function () {
                var that = this;
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
        var FlowRateController = (function () {
            function FlowRateController($scope, httpService) {
                this.$scope = $scope;
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
                var data = that.getData();
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
//# sourceMappingURL=app.js.map
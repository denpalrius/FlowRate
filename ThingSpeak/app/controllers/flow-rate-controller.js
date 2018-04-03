var Flux;
(function (Flux) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var FlowRateController = (function () {
            function FlowRateController($scope, $rootScope, $location, HttpService, ThingSpeakService, $timeout) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$location = $location;
                this.HttpService = HttpService;
                this.ThingSpeakService = ThingSpeakService;
                this.$timeout = $timeout;
                var that = this;
                that.init();
            }
            FlowRateController.prototype.init = function () {
                var that = this;
                that.$scope.flowRateScope = {};
                that.$scope.flowRateScope.maraRiverFlowRate = {};
                that.$scope.flowRateScope.maraRiverFlowRate.channel = {};
                that.$scope.flowRateScope.maraRiverFlowRate.feeds = [];
                that.$scope.flowRateScope.channel = {};
                that.$scope.flowRateScope.feeds = [];
                that.$scope.flowRateScope.sensors = [];
                that.$scope.flowRateScope.pageLoadingFinished = false;
                that.$scope.flowRateScope.reorderFeeds = [];
                that.$scope.flowRateScope.selectedFeed = [];
                that.$scope.flowRateScope.$stickies = [];
                that.getFlowRateData();
            };
            FlowRateController.prototype.getFlowRateData = function () {
                var that = this;
                that.$scope.flowRateScope.pageLoadingFinished = false;
                that.ThingSpeakService.getThingSpeakData()
                    .done(function (response) {
                    that.$timeout(0).then(function () {
                        that.$scope.flowRateScope.maraRiverFlowRate = response;
                        var mapCenter = [
                            that.$scope.flowRateScope.maraRiverFlowRate.channel.latitude.toString(),
                            that.$scope.flowRateScope.maraRiverFlowRate.channel.longitude.toString()
                        ];
                        that.$rootScope.$emit("map-center-updated", mapCenter);
                        that.$scope.flowRateScope.sensors.push(that.$scope.flowRateScope.maraRiverFlowRate.channel);
                        that.$rootScope.$emit("sensors-updated", that.$scope.flowRateScope.sensors);
                        that.$scope.flowRateScope.pageLoadingFinished = true;
                    });
                })
                    .fail(function () {
                    console.log("Failed to get the JSON data");
                });
            };
            FlowRateController.prototype.getData = function () {
                var that = this;
                that.$scope.flowRateScope.pageLoadingFinished = false;
                console.log("Loading started...", that.$scope.flowRateScope.pageLoadingFinished);
                var deferred = $.Deferred();
                that.HttpService.get(Flux.Configs.AppConfig.ApiUrl)
                    .done(function (response) {
                    console.log("response.data", response.data);
                    that.$scope.flowRateScope.maraRiverFlowRate = response.data;
                    deferred.resolve(that.$scope.flowRateScope.maraRiverFlowRate);
                    console.log("maraRiverFlowRate: ", that.$scope.flowRateScope.maraRiverFlowRate);
                    var mapCenter = [
                        that.$scope.flowRateScope.maraRiverFlowRate.channel.latitude.toString(),
                        that.$scope.flowRateScope.maraRiverFlowRate.channel.longitude.toString()
                    ];
                    that.$rootScope.$emit("map-center-updated", mapCenter);
                    that.$scope.flowRateScope.sensors.push(that.$scope.flowRateScope.channel);
                    that.$rootScope.$emit("sensors-updated", that.$scope.flowRateScope.sensors);
                    that.$scope.flowRateScope.pageLoadingFinished = true;
                    console.log("Page loaded", that.$scope.flowRateScope.pageLoadingFinished);
                })
                    .fail(function (error) {
                    console.log("Failed to get the JSON data");
                    deferred.reject(error);
                });
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
    })(Controllers = Flux.Controllers || (Flux.Controllers = {}));
})(Flux || (Flux = {}));

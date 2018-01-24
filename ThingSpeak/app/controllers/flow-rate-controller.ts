module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        maraRiverFlowRate?: ViewModels.MaraRiverFlow;
        channel?: ViewModels.Channel;
        feeds?: ViewModels.Feed[];
        reorderFeeds?: ViewModels.Feed[];
        sensors?: ViewModels.Channel[];

        pageLoadingFinished?: boolean;

        isReorderFormVisible?: boolean;
        selectedFeed?: ViewModels.Feed;
        $window?: Window;
        $stickies?: any;
    }

    interface IFlowRateScope extends ng.IScope {
        flowRateScope?: ICurrentScope;
    }

    export class FlowRateController {
        constructor(
            private $scope: IFlowRateScope,
            private $rootScope: ng.IRootScopeService,
            private $state: angular.ui.IStateProvider,
            private httpService: Services.HttpService,
            private thingSpeakService: Services.ThingSpeakService,
            private $timeout: ng.ITimeoutService) {

            var that: FlowRateController = this;
            that.init();
        }

        private init() {
            var that: FlowRateController = this;

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
            
            //that.getData();
            that.getFlowRateData();

            //TODO: Do a progress ring
            //TODO: Paginate the table
            //TODO: Add charts for Field 1, field 2 ad field 3
            //TODO: Map

        }

        public getFlowRateData(){
            var that: FlowRateController = this;
            that.$scope.flowRateScope.pageLoadingFinished = false;
            //console.log("Loading started...", that.$scope.flowRateScope.pageLoadingFinished);

            that.thingSpeakService.getThingSpeakData()
                .done((response: ViewModels.MaraRiverFlow) => {
                    that.$timeout(0).then(() => {
                        that.$scope.flowRateScope.maraRiverFlowRate = response;

                        //console.log("Feeds: ", that.$scope.flowRateScope.maraRiverFlowRate.feeds);

                        var mapCenter =
                            [
                                that.$scope.flowRateScope.maraRiverFlowRate.channel.latitude.toString(),
                                that.$scope.flowRateScope.maraRiverFlowRate.channel.longitude.toString()
                            ];

                        that.$rootScope.$emit("map-center-updated", mapCenter);

                        that.$scope.flowRateScope.sensors.push(that.$scope.flowRateScope.maraRiverFlowRate.channel);
                        that.$rootScope.$emit("sensors-updated", that.$scope.flowRateScope.sensors);

                        that.$scope.flowRateScope.pageLoadingFinished = true;
                        //console.log("Page loaded", that.$scope.flowRateScope.pageLoadingFinished);
                    });
                })
                .fail(() => {
                    console.log("Failed to get the JSON data");
                });
        }

        public getData(): JQueryDeferred<ViewModels.MaraRiverFlow> {
            var that: FlowRateController = this;
            that.$scope.flowRateScope.pageLoadingFinished = false;
            console.log("Loading started...", that.$scope.flowRateScope.pageLoadingFinished);

            var deferred = $.Deferred();
            
            that.httpService.get(Configs.AppConfig.ApiUrl)
                .done((response: Models.IHttpResponse) => {

                    console.log("response.data", response.data);

                    that.$scope.flowRateScope.maraRiverFlowRate = response.data;
                    deferred.resolve(that.$scope.flowRateScope.maraRiverFlowRate);

                    console.log("maraRiverFlowRate: ", that.$scope.flowRateScope.maraRiverFlowRate);

                    var mapCenter =
                        [
                            that.$scope.flowRateScope.maraRiverFlowRate.channel.latitude.toString(),
                            that.$scope.flowRateScope.maraRiverFlowRate.channel.longitude.toString()
                        ];
                    that.$rootScope.$emit("map-center-updated", mapCenter);

                    that.$scope.flowRateScope.sensors.push(that.$scope.flowRateScope.channel);
                    that.$rootScope.$emit("sensors-updated", that.$scope.flowRateScope.sensors);

                    that.$scope.flowRateScope.pageLoadingFinished = true;
                    console.log("Page loaded", that.$scope.flowRateScope.pageLoadingFinished);
                })
                .fail((error: Models.IHttpResponse) => {
                    console.log("Failed to get the JSON data");
                    deferred.reject(error);
                });

            return deferred;
        }

        private selectFeed(feed: ViewModels.Feed) {
            var that: FlowRateController = this;
            that.$scope.flowRateScope.selectedFeed = feed;

            console.log("Selected Feed: " ,feed.entry_id);
        }

        private openReorderDialog() {
            var that: FlowRateController = this;

            that.$scope.flowRateScope.reorderFeeds = angular.copy(that.$scope.flowRateScope.feeds);

            console.log("Reorder list: ", that.$scope.flowRateScope.reorderFeeds);
        }
    }
}
module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        maraRiverFlowRate?: ViewModels.MaraRiverFlow;
        channel?: ViewModels.Channel;
        feeds?: ViewModels.Feed[];
        reorderFeeds?: ViewModels.Feed[];
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
            private httpService: Services.HttpService) {

            var that: FlowRateController = this;
            that.init();
        }

        private init() {
            var that: FlowRateController = this;

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
        }


    
        public getData(): JQueryDeferred<ViewModels.MaraRiverFlow> {
            var deferred = $.Deferred();
            var that: FlowRateController = this;
            console.log("Fetching data....");
            that.httpService.get(Configs.AppConfig.ApiUrl)
                .done((response: Models.IHttpResponse) => {
                    var maraRiverFlowRateData: ViewModels.MaraRiverFlow = response.data;
                    that.$scope.flowRateScope.maraRiverFlowRate = maraRiverFlowRateData;
                    that.$scope.flowRateScope.channel = maraRiverFlowRateData.channel;
                    that.$scope.flowRateScope.feeds = maraRiverFlowRateData.feeds;

                    deferred.resolve(that.$scope.flowRateScope.maraRiverFlowRate);
                })
                .fail((error: Models.IHttpResponse) => {
                    console.log("Failed to get the JSON data");
                    deferred.reject(error);
                }).then((val) => {
                    console.log("Then: ", val);

                    var sensorLocation = {
                        latitude: that.$scope.flowRateScope.channel.latitude,
                        longitude: that.$scope.flowRateScope.channel.longitude,
                    }
                    //Notify of loaded map center
                    that.$rootScope.$emit("map-center-loaded", sensorLocation);
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
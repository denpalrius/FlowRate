module ThingSpeak.Controllers {
    "use strict";

    export interface ICurrentScope {
        maraRiverFlowRate?: ViewModels.MaraRiverFlow;
        channel?: ViewModels.Channel;
        feeds?: ViewModels.Feed[];
        reorderFeeds?: ViewModels.Feed[];
        isReorderFormVisible?: boolean;
        selectedFeed?: ViewModels.Feed;
    }

    interface IFlowRateScope extends ng.IScope {
        flowRateScope?: ICurrentScope;
    }

    export class FlowRateController {
        constructor(
            private $scope: IFlowRateScope,
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

            var data = that.getData();
        
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

                    console.log("Mara River Flow Rate: ", that.$scope.flowRateScope.maraRiverFlowRate);

                    deferred.resolve(that.$scope.flowRateScope.maraRiverFlowRate);
                })
                .fail((error: Models.IHttpResponse) => {
                    console.log("Failed to get the JSON data");
                    deferred.reject(error);
                });
            console.log("Done fetching data....");


            //*Assuming all data is loaded

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
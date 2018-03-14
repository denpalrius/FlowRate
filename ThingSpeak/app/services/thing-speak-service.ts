module ThingSpeak.Services {
    export class ThingSpeakService {
        constructor(private HttpService: Services.HttpService) {
            var that: ThingSpeakService = this;
        }

        public getThingSpeakData(): JQueryDeferred<ViewModels.iFlowRate> {
            var that: ThingSpeakService = this;

            var deferred = $.Deferred();
            that.HttpService.get(Configs.AppConfig.ApiUrl)
                .done((response: Models.IHttpResponse) => {
                    var maraRiverFlowRate = response.data;
                    deferred.resolve(maraRiverFlowRate);
                })
                .fail((error: Models.IHttpResponse) => {
                    console.log("Failed to get the maraRiverFlowRate JSON data");
                    deferred.reject(error);
                });

            return deferred;
        }
    }
}

module ThingSpeak.Services {
    export class ThingSpeakService {
        constructor(private httpService: Services.HttpService) {
            var that: ThingSpeakService = this;
        }

        public getThingSpeakData(): JQueryDeferred<ViewModels.MaraRiverFlow> {
            var that: ThingSpeakService = this;

            var deferred = $.Deferred();
            that.httpService.get(Configs.AppConfig.ApiUrl)
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

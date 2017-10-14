module ThingSpeak.Services {
    export class MapDataService {
        constructor(private httpService: Services.HttpService) {
            var that: MapDataService = this;
        }

        public loadMapData() {
            var that: MapDataService = this;
           
            var deferred = $.Deferred();
            that.httpService.get(Configs.AppConfig.kenyaCountiesUri)
                .done((response: Models.IHttpResponse) => {
                    var mapDataResponse = response;
                    deferred.resolve(mapDataResponse);
                })
                .fail((error: Models.IHttpResponse) => {
                    console.log("Failed to get the GeoJSON data");
                    deferred.reject(error);
                });
            return deferred;
        }
    }
}
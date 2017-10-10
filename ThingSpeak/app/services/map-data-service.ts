module ThingSpeak.Services {
    export class MapDataService {
        constructor(private httpService: Services.HttpService) {
            var that: MapDataService = this;
        }

        public loadMapData() {
            var that: MapDataService = this;
           
            var deferred = $.Deferred();
            that.httpService.get(Configs.AppConfig.mapDataUri)
                .done((response: Models.IHttpResponse) => {
                    var mapData = response.data;
                    deferred.resolve(mapData);
                })
                .fail((error: Models.IHttpResponse) => {
                    console.log("Failed to get the GeoJSON data");
                    deferred.reject(error);
                });

            return deferred;
        }
    }
}
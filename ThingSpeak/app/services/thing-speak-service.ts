module ThingSpeak.Services {
    export class ThingSpeakService {
        constructor(
            private HttpService: Services.HttpService,
            private FirebaseService: Services.FirebaseService) {
            var that: ThingSpeakService = this;
        }

        public getThingSpeakData(): JQueryDeferred<any> {
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

        public getAllSensors(): JQueryDeferred<any> {
            var that: ThingSpeakService = this;
            var deferred = $.Deferred();

            that.FirebaseService.readList("sensors")
                .done((sensors: ViewModels.iSensor[]) => {
                    deferred.resolve(sensors);
                }).fail((error: any) => {
                    deferred.reject(error);
                });
            return deferred;
        }

        public getSensor(sensorId: any): JQueryDeferred<any>{
            var that: ThingSpeakService = this;
            var deferred = $.Deferred();

            that.FirebaseService.read("sensors", sensorId)
                .done((sensor: any) => {
                    deferred.resolve(sensor);
                }).fail((error: any) => {
                    deferred.reject(error);
                });
            return deferred;
        }

    }
}

var Flux;
(function (Flux) {
    var Services;
    (function (Services) {
        var ThingSpeakService = (function () {
            function ThingSpeakService(HttpService, FirebaseService) {
                this.HttpService = HttpService;
                this.FirebaseService = FirebaseService;
                var that = this;
            }
            ThingSpeakService.prototype.getThingSpeakData = function () {
                var that = this;
                var deferred = $.Deferred();
                that.HttpService.get(Flux.Configs.AppConfig.ApiUrl)
                    .done(function (response) {
                    var maraRiverFlowRate = response.data;
                    deferred.resolve(maraRiverFlowRate);
                })
                    .fail(function (error) {
                    console.log("Failed to get the maraRiverFlowRate JSON data");
                    deferred.reject(error);
                });
                return deferred;
            };
            ThingSpeakService.prototype.getAllSensors = function () {
                var that = this;
                var deferred = $.Deferred();
                that.FirebaseService.readList("sensors")
                    .done(function (sensors) {
                    deferred.resolve(sensors);
                }).fail(function (error) {
                    deferred.reject(error);
                });
                return deferred;
            };
            ThingSpeakService.prototype.getSensor = function (sensorId) {
                var that = this;
                var deferred = $.Deferred();
                that.FirebaseService.read("sensors", sensorId)
                    .done(function (sensor) {
                    deferred.resolve(sensor);
                }).fail(function (error) {
                    deferred.reject(error);
                });
                return deferred;
            };
            return ThingSpeakService;
        }());
        Services.ThingSpeakService = ThingSpeakService;
    })(Services = Flux.Services || (Flux.Services = {}));
})(Flux || (Flux = {}));

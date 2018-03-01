var ThingSpeak;
(function (ThingSpeak) {
    var Services;
    (function (Services) {
        var ThingSpeakService = (function () {
            function ThingSpeakService(HttpService) {
                this.HttpService = HttpService;
                var that = this;
            }
            ThingSpeakService.prototype.getThingSpeakData = function () {
                var that = this;
                var deferred = $.Deferred();
                that.HttpService.get(ThingSpeak.Configs.AppConfig.ApiUrl)
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
            return ThingSpeakService;
        }());
        Services.ThingSpeakService = ThingSpeakService;
    })(Services = ThingSpeak.Services || (ThingSpeak.Services = {}));
})(ThingSpeak || (ThingSpeak = {}));

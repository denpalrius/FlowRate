var Flux;
(function (Flux) {
    var Configs;
    (function (Configs) {
        var AppConfig = (function () {
            function AppConfig() {
            }
            return AppConfig;
        }());
        AppConfig.ApiUrl = "https://thingspeak.com/channels/16153/feed.json";
        AppConfig.googleMapsKey = "AIzaSyD-GStdYSjF3KUTNa3Xqxc_2BYx4kH-WNw";
        AppConfig.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD-GStdYSjF3KUTNa3Xqxc_2BYx4kH-WNw";
        AppConfig.firebaseConfig = {
            apiKey: "AIzaSyCJPEz7gppJusDGFuaBWyLhKrU--cgECfc",
            authDomain: "thingspeak-1501090556379.firebaseapp.com",
            databaseURL: "https://thingspeak-1501090556379.firebaseio.com",
            projectId: "thingspeak-1501090556379",
            storageBucket: "thingspeak-1501090556379.appspot.com",
            messagingSenderId: "311714038874"
        };
        AppConfig.firebaseRefs = {
            sensors: "sensors",
            users: "users"
        };
        AppConfig.cookies = {
            userToken: "USERTOKEN",
            UserProfile: "USERPROFILE"
        };
        Configs.AppConfig = AppConfig;
    })(Configs = Flux.Configs || (Flux.Configs = {}));
})(Flux || (Flux = {}));

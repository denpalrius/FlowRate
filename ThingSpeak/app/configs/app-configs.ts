module ThingSpeak.Configs {
    export class AppConfig {
        public static ApiUrl: string = "https://thingspeak.com/channels/16153/feed.json";
        public static googleMapsKey: string = "AIzaSyD-GStdYSjF3KUTNa3Xqxc_2BYx4kH-WNw";
        public static googleMapsUrl: string = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD-GStdYSjF3KUTNa3Xqxc_2BYx4kH-WNw";

        public static firebaseConfig = {
            apiKey: "AIzaSyCJPEz7gppJusDGFuaBWyLhKrU--cgECfc",
            authDomain: "thingspeak-1501090556379.firebaseapp.com",
            databaseURL: "https://thingspeak-1501090556379.firebaseio.com",
            projectId: "thingspeak-1501090556379",
            storageBucket: "thingspeak-1501090556379.appspot.com",
            messagingSenderId: "311714038874"
        };
    }
}
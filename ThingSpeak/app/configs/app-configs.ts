module ThingSpeak.Configs {
    export class AppConfig {
        public static ApiUrl: string = "https://thingspeak.com/channels/16153/feed.json";

        //public static couchDbPath: string = "http://mzitoh:suse@192.168.15.180:5984/dmm-kenya";
        public static couchDbPath: string = "http://mzitoh:suse@localhost:5984/dmm-kenya";

        public static kenyaCountiesUri: string = "https://raw.githubusercontent.com/mikelmaron/kenya-election-data/master/data/counties.geojson";
        public static mapDataUri: string = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp";

        public static googleMapsKey: string = "AIzaSyD-GStdYSjF3KUTNa3Xqxc_2BYx4kH-WNw";
        public static googleMapsUrl: string = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD-GStdYSjF3KUTNa3Xqxc_2BYx4kH-WNw";
    }
}
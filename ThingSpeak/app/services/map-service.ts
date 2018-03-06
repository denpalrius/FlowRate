module ThingSpeak.Services {
    export class MapService {
        constructor() {
            var that: MapService = this;
        }

        public getUserLocation(): JQueryDeferred<google.maps.LatLng> {
            if (navigator.geolocation) {
                var deferred = $.Deferred();

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        deferred.resolve(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    },
                    (error) => {
                        deferred.reject("User did not accept location permission");
                    });
            } else {
                deferred.reject("Geolocation not supported");
            }

            return deferred;
        }

        public intitializeGoogleMapsAutoComplete() {
            let searchInput = $("#googleMapAutocompleteBox")[0] as HTMLInputElement;
            var googleMapAutoComplete = new google.maps.places.Autocomplete(searchInput);
            googleMapAutoComplete.addListener('place_changed', (e: google.maps.MouseEvent) => {
                var place = googleMapAutoComplete.getPlace();
                console.log("googleMapAutoComplete place", place.formatted_address);

                //TODO: load nearby sensors

            });
        }
    }
}

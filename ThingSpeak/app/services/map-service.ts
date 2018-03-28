module Flux.Services {
    export class MapService {
        constructor(private $rootScope: ng.IRootScopeService) {
            var that: MapService = this;

            //that.intitializeGoogleMapsAutoComplete("googleMapAutocompleteBoxMobile");
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

        public intitializeGoogleMapsAutoComplete(elm: string) {
            var that: MapService = this;

            let searchInput = $(elm)[0] as HTMLInputElement;

            console.log(elm, searchInput);

            if (searchInput) {
                var googleMapAutoComplete = new google.maps.places.Autocomplete(searchInput);

                googleMapAutoComplete.addListener('place_changed', (e: google.maps.MouseEvent) => {
                    var place = googleMapAutoComplete.getPlace();
                    that.$rootScope.$emit('auto-complete-location-changed', place);
                });
            }
        }
    }
}

var Flux;
(function (Flux) {
    var Services;
    (function (Services) {
        var MapService = (function () {
            function MapService($rootScope) {
                this.$rootScope = $rootScope;
                var that = this;
            }
            MapService.prototype.getUserLocation = function () {
                if (navigator.geolocation) {
                    var deferred = $.Deferred();
                    navigator.geolocation.getCurrentPosition(function (position) {
                        deferred.resolve(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                    }, function (error) {
                        deferred.reject("User did not accept location permission");
                    });
                }
                else {
                    deferred.reject("Geolocation not supported");
                }
                return deferred;
            };
            MapService.prototype.intitializeGoogleMapsAutoComplete = function (elm) {
                var that = this;
                var searchInput = document.getElementById(elm);
                if (searchInput) {
                    var googleMapAutoComplete = new google.maps.places.Autocomplete(searchInput);
                    googleMapAutoComplete.addListener('place_changed', function (e) {
                        var place = googleMapAutoComplete.getPlace();
                        that.$rootScope.$emit('auto-complete-location-changed', place);
                    });
                }
            };
            return MapService;
        }());
        Services.MapService = MapService;
    })(Services = Flux.Services || (Flux.Services = {}));
})(Flux || (Flux = {}));

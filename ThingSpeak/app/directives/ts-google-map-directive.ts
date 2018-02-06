module ThingSpeak.Directives {
    "use strict";

    interface IScope extends ng.IScope {
        map: google.maps.Map;
        marker: google.maps.Marker;
        userLocation: google.maps.LatLng;
        types: any;
        infoWindow: google.maps.InfoWindow;
        geocoder: google.maps.Geocoder;
        getUserLocationClick: Function;
        displaySensorClick: Function;
        currentLocation?: string;
        selectedSensor?: ViewModels.iSensor;
        sensors?: ViewModels.iSensor[];
        showSensorDetails: boolean;
        photoUrl: string;
        googleMapAutoComplete?: google.maps.places.Autocomplete;
    }

    function handleLocationError(browserHasGeolocation: any, infoWindow: any, pos: any, map: any) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }

    function getUserLocationFn(_navigator: Navigator): JQueryDeferred<google.maps.LatLng> {
        if (_navigator.geolocation) {
            var deferred = $.Deferred();

            _navigator.geolocation.getCurrentPosition(
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

    function getUserAddress(_position: google.maps.LatLng, _address: string): JQueryDeferred<google.maps.GeocoderResult> {
        var deferred = $.Deferred();
        var geocoder = new google.maps.Geocoder();

        var req: google.maps.GeocoderRequest = null;
        if (_position) {
            req = {
                location: _position,
            };
        }
        else if (_address) {
            req = {
                address: _address,
            };
        }

        if (req) {
            geocoder.geocode(req, function (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) {
                if (status == google.maps.GeocoderStatus.OK) {
                    //console.log("Reverse Geocode results: ", results)
                    if (results.length) {
                        //console.log("Reverse Geocode", results[0]);
                        deferred.resolve(results[0]);

                    } else {
                        console.log("No results found");
                        //TODO: add description
                        deferred.reject(null);
                    }
                }
                else {
                    console.log("Geocoder failed due to: " + status);
                    //TODO: add description
                    deferred.reject(null);
                }
            });
        }

        return deferred;
    }

    function loadCurrentAddress(pos: google.maps.LatLng, scope: IScope, $timeout: ng.ITimeoutService) {
        getUserAddress(pos, null)
            .done((geoCodeResult: google.maps.GeocoderResult) => {
                $timeout(0).then(() => {
                    scope.currentLocation = geoCodeResult.formatted_address;
                    //console.log("Reverse output Address", scope.currentLocation);
                });
            })
            .fail((error) => {
                //TODO: handle error
            });
    }

    function loadListeners(scope: IScope, $timeout: ng.ITimeoutService) {
        // click map listener  
        scope.map.addListener('click', (e) => {
            var clickLocation: google.maps.LatLng = e.latLng;
            scope.marker.setPosition(clickLocation);
            getUserAddress(clickLocation, null)
                .done((geoCodeResult: google.maps.GeocoderResult) => {
                    $timeout(0).then(() => {
                        scope.currentLocation = geoCodeResult.formatted_address;
                        //console.log("Reverse output: ", scope.currentLocation);
                    });
                })
                .fail((error) => {
                    console.log("Failed to load user")
                });
        });

        // click autocomplete listener
        scope.googleMapAutoComplete.addListener('place_changed', (e: google.maps.MouseEvent) => {
            var place = scope.googleMapAutoComplete.getPlace();
            //console.warn("Event : ", e);

            $timeout(0).then(() => {
                scope.marker.setPosition(place.geometry.location);
                scope.currentLocation = place.formatted_address;
                scope.map.setCenter(place.geometry.location);
            });
        });

    }

    function attachSearchBar(): google.maps.places.Autocomplete {
        //console.log("Input : ", $("#googleMapSearchBox"));
        let searchInput = $("#googleMapSearchBox")[0] as HTMLInputElement;
        return new google.maps.places.Autocomplete(searchInput);
    }

    function setDataOnMap(coords: google.maps.LatLng, scope: IScope, $timeout: ng.ITimeoutService) {
        getUserAddress(coords, null)
            .done((geoCodeResult: google.maps.GeocoderResult) => {
                $timeout(0).then(() => {
                    scope.currentLocation = geoCodeResult.formatted_address;
                    scope.marker.setPosition(coords);
                    scope.map.setCenter(coords);

                    //console.log("Reverse output Address", scope.currentLocation);
                });
            })
            .fail((error) => {
                //TODO: handle error
                console.log("Failed to get address details, ", error);
            });

    }

    function loadMapStyles(http: Services.HttpService): JQueryDeferred<google.maps.MapTypeStyle[]> {
        var deferred = $.Deferred();

        http.get("app/scripts/map-style.json")
            .done((response: Models.IHttpResponse) => {
                console.log("Loaded style: ", response.data);
                deferred.resolve(response.data);
            })
            .fail((error: Models.IHttpResponse) => {
                console.log("Failed to load custom map style");
                deferred.reject(error);
            });
        return deferred;
    }

    function init(scope: IScope, $timeout: ng.ITimeoutService) {
        scope.types = "['establishment']";
        scope.infoWindow = new google.maps.InfoWindow;
        scope.geocoder = new google.maps.Geocoder;
        scope.showSensorsDetails = false;
        //scope.sensors = [];
        //scope.selectedSensor = {};
        //scope.photoUrl = "";

        var mapStyles = [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#444444"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#46bcec"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            }
        ];

        var mapOptions: google.maps.MapOptions = {
            zoomControl: true,
            panControl: false,
            draggable: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP,
                style: google.maps.ZoomControlStyle.DEFAULT
            },
            scaleControl: true,
            rotateControl: true,
            center: scope.userLocation,
            zoom: 17,
            styles: mapStyles
        }

        scope.map = new google.maps.Map($("#locationMap")[0], mapOptions);
        scope.marker = new google.maps.Marker({
            position: scope.userLocation,
            map: scope.map,
            title: 'User Location'
        });
    }

    export function TsGoogleMap($timeout: ng.ITimeoutService, $log: ng.ILogService): ng.IDirective {
        let ddo: ng.IDirective = {
            restrict: 'AE',
            scope: {
                currentLocation: '=currentLocation',
                sensors: '=sensors',
                getUserLocationClick: '&getUserLocationClick',
                displaySensorClick: '&displaySensorClick',
                showSensorDetails: '=?showSensorDetails',
                selectedSensor: '=?selectedSensor',
                photoUrl: '=?photoUrl'
                //    "@"   (Text binding / one - way binding )
                //    "="   (Direct model binding / two - way binding )
                //    "&"   (Behaviour binding / Method binding  )
            },
            templateUrl: '/app/views/templates/ts-google-map-template.html',
            link: function (scope: IScope, $elm: Object, attr) {

                init(scope, $timeout);

                $timeout(5).then(() => {
                    scope.displaySensorClick = function (sensor: any) {
                        if (sensor) {
                            scope.showSensorDetails = true;
                            scope.selectedSensor = sensor;

                            var sensorCoordinates = new google.maps.LatLng(sensor.lat, sensor.lon)
                            setDataOnMap(sensorCoordinates, scope, $timeout);
                        }
                        else {
                            scope.showSensorDetails = false;
                            scope.selectedSensor = {}
                        }
                    }

                    //Initialize autocomplete text box
                    scope.googleMapAutoComplete = attachSearchBar();

                    scope.getUserLocationClick = () => {
                        getUserLocationFn(navigator)
                            .done((pos) => {
                                setDataOnMap(pos, scope, $timeout);
                            })
                            .fail((error) => {
                                scope.userLocation = null;
                            });
                    };

                    getUserLocationFn(navigator)
                        .done((latLong: google.maps.LatLng) => {
                            scope.userLocation = latLong;
                            setDataOnMap(scope.userLocation, scope, $timeout);
                        })
                        .fail((error) => {
                            scope.userLocation = null;
                            //init(scope, $timeout);
                        }).always(() => {
                            loadListeners(scope, $timeout);

                        });

                });
            }
        };

        return ddo;
    }
}
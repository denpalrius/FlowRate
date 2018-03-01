module ThingSpeak.Directives {
    "use strict";

    interface IScope extends ng.IScope {
        map: google.maps.Map;
        marker: google.maps.Marker;
        markers: google.maps.Marker[];
        userLocation: google.maps.LatLng;
        types: any;
        infoWindow: google.maps.InfoWindow;
        geocoder: google.maps.Geocoder;
        signOutClick: Function;
        getUserLocationClick: Function;
        displaySensorClick: Function;
        displaySensorListClick: Function;
        currentLocation?: string;
        selectedSensor?: ViewModels.iSensor;
        sensors?: ViewModels.iSensor[];
        showSensorDetails: boolean;
        loggedInUser: ViewModels.iUser;
        googleMapAutoComplete?: google.maps.places.Autocomplete;
    }

    function signOut() {
        console.log("Signing out");

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

                //TODO: load nearby sensors

                if (scope.marker) {
                    scope.showSensorDetails = false;
                    if (scope.sensors && scope.sensors.length) {
                        scope.sensors.forEach((sensor: ViewModels.iSensor) => {
                            var sensorID = scope.marker.getLabel();
                            if (sensorID && sensor.id == sensorID) {
                                displaySensor(sensor, scope, $timeout);
                            }
                        });
                    }
                }
            });
        });

    }

    function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    function deg2rad(deg: any) {
        return deg * (Math.PI / 180)
    }

    function distance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p) / 2 +
            c(lat1 * p) * c(lat2 * p) *
            (1 - c((lon2 - lon1) * p)) / 2;

        return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    }

    function attachSearchBar(): google.maps.places.Autocomplete {
        //console.log("Input : ", $("#googleMapSearchBox"));
        let searchInput = $("#googleMapSearchBox")[0] as HTMLInputElement;
        return new google.maps.places.Autocomplete(searchInput);
    }

    function loadCurrentLocation(navigator: Navigator, scope: IScope, $timeout: ng.ITimeoutService) {
        getUserLocationFn(navigator)
            .done((pos: google.maps.LatLng) => {
                scope.userLocation = pos;
                setDataOnMap(pos, scope, $timeout);
            })
            .fail((error) => {
                scope.userLocation = null;
            });
    }

    function setDataOnMap(coords: google.maps.LatLng, scope: IScope, $timeout: ng.ITimeoutService) {
        getUserAddress(coords, null)
            .done((geoCodeResult: google.maps.GeocoderResult) => {
                $timeout(0).then(() => {
                    scope.currentLocation = geoCodeResult.formatted_address;
                    scope.marker.setPosition(coords);
                    scope.map.setCenter(coords);

                    // Add circle overlay and bind to marker
                    //var circle = new google.maps.Circle({
                    //    map: scope.map,
                    //    radius: 500,
                    //    fillColor: '#AA0000'
                    //});
                    //circle.bindTo('center', scope.marker, 'position');
                    //scope.map.setZoom(9);

                    displaySensorList(scope, $timeout);

                    //console.log("Reverse output Address", scope.currentLocation);
                });
            })
            .fail((error) => {
                //TODO: handle error
                console.log("Failed to get address details, ", error);
            });

    }

    function displaySensor(sensor: ViewModels.iSensor, scope: IScope, $timeout: ng.ITimeoutService) {
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

    // Sets the map on all markers in the array.
    function setMapOnAll(scope: IScope, map: any) {
        for (var i = 0; i < scope.markers.length; i++) {
            scope.markers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers(scope: IScope) {
        setMapOnAll(scope, null);

    }

    // Shows any markers currently in the array.
    function showMarkers(scope: IScope) {
        setMapOnAll(scope, scope.map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers(scope: IScope) {
        clearMarkers(scope);
        scope.markers = [];
    }

    function displaySensorList(scope: IScope, $timeout: ng.ITimeoutService) {
        $timeout(0).then(() => {

            if (scope.sensors) {
                clearAllMarkers(scope);

                //Set map bounds
                var bounds = new google.maps.LatLngBounds();

                for (var i = 0; i < scope.sensors.length; i++) {
                    var sensor = scope.sensors[i];
                    var marker = new google.maps.Marker({
                        map: scope.map,
                        position: new google.maps.LatLng(sensor.lat, sensor.lon),
                        title: sensor.physicalAddress,
                        icon: '/app/images/sensor-marker.svg'
                    });

                    bounds.extend(marker.getPosition());
                    //scope.map.fitBounds(bounds);

                    var str = '<div style="box-shadow: 0px 0px 3px 0px rgba(240, 232, 232, 0.59); " > <div style="background- color:#00BCD4; width: 100 %; height: 80px; border: 0px solid transparent" > <h2>' + marker.getTitle() + '</h2></div > <div style="background- color:white; width: 100 %; height: 100px; border: 0px solid transparent; overflow: auto" > <p>' + marker.getLabel() + "aaaaa lot of other stuff " + '</p></div > </div>';

                    var infowindow = new google.maps.InfoWindow({
                        content: str
                    });
                    marker.addListener('click', function () {
                        //infowindow.open(scope.map, marker);

                        //$timeout(3).then(() => {
                        //    if (marker.getAnimation() !== null) {
                        //        marker.setAnimation(null);
                        //    } else {
                        //        marker.setAnimation(google.maps.Animation.BOUNCE);
                        //    }
                        //});
                        displaySensor(sensor, scope, $timeout);
                    });

                    addMarkerWithTimeout(scope, marker, i * 20, $timeout);

                }

                // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
                var boundsListener = google.maps.event.addListener((scope.map), 'bounds_changed', function (event: any) {
                    //scope.map.setZoom(10);
                    console.log("Listener set and removed");
                    google.maps.event.removeListener(boundsListener);
                });
            }
        });
    }

    function addMarkerWithTimeout(scope: IScope, marker: google.maps.Marker, timeout: any, $timeout: ng.ITimeoutService) {
        window.setTimeout(function () {
            marker.setAnimation(google.maps.Animation.DROP)
            scope.markers.push(marker);
        }, timeout);
    }

    function clearAllMarkers(scope: IScope) {
        for (var i = 0; i < scope.markers.length; i++) {
            scope.markers[i].setMap(null);
        }
        scope.markers = [];
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
        scope.markers = [];
        scope.geocoder = new google.maps.Geocoder;
        scope.showSensorsDetails = false;

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
                displaySensorListClick: '&displaySensorListClick',
                showSensorDetails: '=?showSensorDetails',
                selectedSensor: '=?selectedSensor',
                loggedInUser: '=?loggedInUser',
                signOutClick: '&signOutClick'
                //    "@"   (Text binding / one - way binding )
                //    "="   (Direct model binding / two - way binding )
                //    "&"   (Behaviour binding / Method binding  )
            },
            templateUrl: '/app/views/templates/ts-google-map-template.html',
            link: function (scope: IScope, $elm: Object, attr) {

                init(scope, $timeout);

                $timeout(5).then(() => {
                    //scope.signOutClick = () => signOut();
                    scope.googleMapAutoComplete = attachSearchBar();
                    scope.getUserLocationClick = () => loadCurrentLocation(navigator, scope, $timeout);
                    loadCurrentLocation(navigator, scope, $timeout);
                    scope.displaySensorClick = (sensor: ViewModels.iSensor) => displaySensor(sensor, scope, $timeout);
                    //scope.displaySensorListClick = (sensors: ViewModels.iSensor[]) => displaySensorList(sensors, scope, $timeout);
                    loadListeners(scope, $timeout);
                });
            }
        };

        return ddo;
    }
}
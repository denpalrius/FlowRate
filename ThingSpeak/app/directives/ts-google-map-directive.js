var ThingSpeak;
(function (ThingSpeak) {
    var Directives;
    (function (Directives) {
        "use strict";
        function signOut() {
            console.log("Signing out");
        }
        function handleLocationError(browserHasGeolocation, infoWindow, pos, map) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }
        function getUserLocationFn(_navigator) {
            if (_navigator.geolocation) {
                var deferred = $.Deferred();
                _navigator.geolocation.getCurrentPosition(function (position) {
                    deferred.resolve(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
                }, function (error) {
                    deferred.reject("User did not accept location permission");
                });
            }
            else {
                deferred.reject("Geolocation not supported");
            }
            return deferred;
        }
        function getUserAddress(_position, _address) {
            var deferred = $.Deferred();
            var geocoder = new google.maps.Geocoder();
            var req = null;
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
                geocoder.geocode(req, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results.length) {
                            deferred.resolve(results[0]);
                        }
                        else {
                            console.log("No results found");
                            deferred.reject(null);
                        }
                    }
                    else {
                        console.log("Geocoder failed due to: " + status);
                        deferred.reject(null);
                    }
                });
            }
            return deferred;
        }
        function loadCurrentAddress(pos, scope, $timeout) {
            getUserAddress(pos, null)
                .done(function (geoCodeResult) {
                $timeout(0).then(function () {
                    scope.currentLocation = geoCodeResult.formatted_address;
                });
            })
                .fail(function (error) {
            });
        }
        function loadListeners(scope, $timeout) {
            scope.map.addListener('click', function (e) {
                var clickLocation = e.latLng;
                scope.marker.setPosition(clickLocation);
                getUserAddress(clickLocation, null)
                    .done(function (geoCodeResult) {
                    $timeout(0).then(function () {
                        scope.currentLocation = geoCodeResult.formatted_address;
                    });
                })
                    .fail(function (error) {
                    console.log("Failed to load user");
                });
            });
            scope.googleMapAutoComplete.addListener('place_changed', function (e) {
                var place = scope.googleMapAutoComplete.getPlace();
                $timeout(0).then(function () {
                    scope.marker.setPosition(place.geometry.location);
                    scope.currentLocation = place.formatted_address;
                    scope.map.setCenter(place.geometry.location);
                    if (scope.marker) {
                        scope.showSensorDetails = false;
                        if (scope.sensors && scope.sensors.length) {
                            scope.sensors.forEach(function (sensor) {
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
        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            var R = 6371;
            var dLat = deg2rad(lat2 - lat1);
            var dLon = deg2rad(lon2 - lon1);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c;
            return d;
        }
        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }
        function distance(lat1, lon1, lat2, lon2) {
            var p = 0.017453292519943295;
            var c = Math.cos;
            var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                c(lat1 * p) * c(lat2 * p) *
                    (1 - c((lon2 - lon1) * p)) / 2;
            return 12742 * Math.asin(Math.sqrt(a));
        }
        function attachSearchBar() {
            var searchInput = $("#googleMapSearchBox")[0];
            return new google.maps.places.Autocomplete(searchInput);
        }
        function loadCurrentLocation(navigator, scope, $timeout) {
            getUserLocationFn(navigator)
                .done(function (pos) {
                scope.userLocation = pos;
                setDataOnMap(pos, scope, $timeout);
            })
                .fail(function (error) {
                scope.userLocation = null;
            });
        }
        function setDataOnMap(coords, scope, $timeout) {
            getUserAddress(coords, null)
                .done(function (geoCodeResult) {
                $timeout(0).then(function () {
                    scope.currentLocation = geoCodeResult.formatted_address;
                    scope.marker.setPosition(coords);
                    scope.map.setCenter(coords);
                    displaySensorList(scope, $timeout);
                });
            })
                .fail(function (error) {
                console.log("Failed to get address details, ", error);
            });
        }
        function displaySensor(sensor, scope, $timeout) {
            if (sensor) {
                scope.showSensorDetails = true;
                scope.selectedSensor = sensor;
                var sensorCoordinates = new google.maps.LatLng(sensor.lat, sensor.lon);
                setDataOnMap(sensorCoordinates, scope, $timeout);
            }
            else {
                scope.showSensorDetails = false;
                scope.selectedSensor = {};
            }
        }
        function setMapOnAll(scope, map) {
            for (var i = 0; i < scope.markers.length; i++) {
                scope.markers[i].setMap(map);
            }
        }
        function clearMarkers(scope) {
            setMapOnAll(scope, null);
        }
        function showMarkers(scope) {
            setMapOnAll(scope, scope.map);
        }
        function deleteMarkers(scope) {
            clearMarkers(scope);
            scope.markers = [];
        }
        function displaySensorList(scope, $timeout) {
            $timeout(0).then(function () {
                if (scope.sensors) {
                    clearAllMarkers(scope);
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
                        var str = '<div style="box-shadow: 0px 0px 3px 0px rgba(240, 232, 232, 0.59); " > <div style="background- color:#00BCD4; width: 100 %; height: 80px; border: 0px solid transparent" > <h2>' + marker.getTitle() + '</h2></div > <div style="background- color:white; width: 100 %; height: 100px; border: 0px solid transparent; overflow: auto" > <p>' + marker.getLabel() + "aaaaa lot of other stuff " + '</p></div > </div>';
                        var infowindow = new google.maps.InfoWindow({
                            content: str
                        });
                        marker.addListener('click', function () {
                            displaySensor(sensor, scope, $timeout);
                        });
                        addMarkerWithTimeout(scope, marker, i * 20, $timeout);
                    }
                    var boundsListener = google.maps.event.addListener((scope.map), 'bounds_changed', function (event) {
                        console.log("Listener set and removed");
                        google.maps.event.removeListener(boundsListener);
                    });
                }
            });
        }
        function addMarkerWithTimeout(scope, marker, timeout, $timeout) {
            window.setTimeout(function () {
                marker.setAnimation(google.maps.Animation.DROP);
                scope.markers.push(marker);
            }, timeout);
        }
        function clearAllMarkers(scope) {
            for (var i = 0; i < scope.markers.length; i++) {
                scope.markers[i].setMap(null);
            }
            scope.markers = [];
        }
        function loadMapStyles(http) {
            var deferred = $.Deferred();
            http.get("app/scripts/map-style.json")
                .done(function (response) {
                console.log("Loaded style: ", response.data);
                deferred.resolve(response.data);
            })
                .fail(function (error) {
                console.log("Failed to load custom map style");
                deferred.reject(error);
            });
            return deferred;
        }
        function init(scope, $timeout) {
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
            var mapOptions = {
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
            };
            scope.map = new google.maps.Map($("#locationMap")[0], mapOptions);
            scope.marker = new google.maps.Marker({
                position: scope.userLocation,
                map: scope.map,
                title: 'User Location'
            });
        }
        function TsGoogleMap($timeout, $log) {
            var ddo = {
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
                },
                templateUrl: '/app/views/templates/ts-google-map-template.html',
                link: function (scope, $elm, attr) {
                    init(scope, $timeout);
                    $timeout(5).then(function () {
                        scope.googleMapAutoComplete = attachSearchBar();
                        scope.getUserLocationClick = function () { return loadCurrentLocation(navigator, scope, $timeout); };
                        loadCurrentLocation(navigator, scope, $timeout);
                        scope.displaySensorClick = function (sensor) { return displaySensor(sensor, scope, $timeout); };
                        loadListeners(scope, $timeout);
                    });
                }
            };
            return ddo;
        }
        Directives.TsGoogleMap = TsGoogleMap;
    })(Directives = ThingSpeak.Directives || (ThingSpeak.Directives = {}));
})(ThingSpeak || (ThingSpeak = {}));

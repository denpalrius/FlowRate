var Flux;
(function (Flux) {
    var Directives;
    (function (Directives) {
        "use strict";
        function handleLocationError(browserHasGeolocation, infoWindow, pos, map) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }
        function getUserLocationFn() {
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
                        console.log("Reverse output: ", scope.currentLocation);
                    });
                })
                    .fail(function (error) {
                    console.log("Failed to load user");
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
        function loadCurrentLocation(scope, $timeout) {
            getUserLocationFn()
                .done(function (pos) {
                scope.userLocation = pos;
                setDataOnMap(pos, scope, $timeout);
            })
                .fail(function (error) {
                scope.userLocation = null;
            });
        }
        function changeMarkerLocation(coords, scope, $timeout) {
            getUserAddress(coords, null)
                .done(function (geoCodeResult) {
                $timeout(0).then(function () {
                    scope.currentLocation = geoCodeResult.formatted_address;
                    scope.marker.setPosition(coords);
                    scope.map.setCenter(coords);
                });
            })
                .fail(function (error) {
                console.log("Failed to get address details, ", error);
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
                            if (sensor) {
                                var sensorCoordinates = new google.maps.LatLng(sensor.lat, sensor.lon);
                                setDataOnMap(sensorCoordinates, scope, $timeout);
                            }
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
                deferred.resolve(response.data);
            })
                .fail(function (error) {
                deferred.reject(error);
            });
            return deferred;
        }
        function setMapStyles() {
            return [
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
        }
        function init(scope, $timeout, HttpService) {
            scope.types = "['establishment']";
            scope.infoWindow = new google.maps.InfoWindow;
            scope.markers = [];
            scope.geocoder = new google.maps.Geocoder;
            var mapOptions = {
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false,
                zoomControl: true,
                panControl: true,
                draggable: true,
                streetViewControl: false,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.RIGHT_TOP,
                    style: google.maps.ZoomControlStyle.DEFAULT
                },
                center: scope.userLocation,
                zoom: 17
            };
            mapOptions.styles = setMapStyles();
            scope.map = new google.maps.Map($("#locationMap")[0], mapOptions);
            scope.marker = new google.maps.Marker({
                position: scope.userLocation,
                map: scope.map,
                title: 'User Location'
            });
        }
        function TsGoogleMap($timeout, $log, $rootScope, HttpService) {
            var mapDirective = {
                restrict: 'AE',
                scope: {
                    currentLocation: '=?currentLocation',
                    sensors: '=?sensors',
                },
                template: '<div class="mapcanvas" id="locationMap"></div>',
                link: function (scope, $elm, attr) {
                    init(scope, $timeout, HttpService);
                    loadCurrentLocation(scope, $timeout);
                    loadListeners(scope, $timeout);
                    $rootScope.$on('auto-complete-location-changed', function (event, place) {
                        changeMarkerLocation(place.geometry.location, scope, $timeout);
                    });
                    $rootScope.$on('set-current-location', function (event) {
                        loadCurrentLocation(scope, $timeout);
                    });
                    $rootScope.$on('display-sensor-details', function (event, sensor) {
                        changeMarkerLocation(new google.maps.LatLng(sensor.lat, sensor.lon), scope, $timeout);
                    });
                }
            };
            return mapDirective;
        }
        Directives.TsGoogleMap = TsGoogleMap;
    })(Directives = Flux.Directives || (Flux.Directives = {}));
})(Flux || (Flux = {}));

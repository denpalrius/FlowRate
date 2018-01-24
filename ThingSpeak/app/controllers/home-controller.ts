module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        pageTitle?: string;
        currentLocation?: any;
        userAddress?: string;
        mapCenter?: string;
        googleMapsUrl?: string;
        customMapStyle?: any;
        sensors?: ViewModels.Channel[];
        mapEnable?: boolean;
    }

    interface IHomeScope extends ng.IScope {
        homeScope?: ICurrentScope;
    }

    export class HomeController {
        constructor(
            private $scope: IHomeScope,
            private $rootScope: ng.IRootScopeService,
            private $location: ng.ILocationService) {
            var that: HomeController = this;
            that.init();
        }

        private init() {
            var that: HomeController = this;

            that.$scope.homeScope = {};
            that.$scope.homeScope.pageTitle = "AngularJS App";
            that.$scope.homeScope.googleMapsUrl = "";
            that.$scope.homeScope.sensors = [];
            that.$scope.homeScope.currentLocation = new Object();
            that.$scope.homeScope.userAddress = "";

            that.$scope.homeScope.customMapStyle = [
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
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#bab8cb"
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
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "color": "#9a3fa0"
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
                    "featureType": "transit",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#8e2b2b"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#30a4d3"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "hue": "#00a3ff"
                        }
                    ]
                }
            ];

            //that.$rootScope.$on('map-center-updated', (event, data) => {
            //    that.$scope.homeScope.mapCenter = data;
            //});

            //that.$rootScope.$on('sensors-updated', (event, data) => {
            //    that.$scope.homeScope.sensors = data;
            //    //console.log("sensors:", data);
            //});

            that.loadMapData();

        }

        private loadMapData() {
            var that: HomeController = this;

            that.getCurrentPosition()
                .done((geolocation) => {
                    that.getAddress(geolocation);
                })
                .fail((error) => {
                    console.error(error);
                });
        }

        //GeoCoding
        private getCurrentPosition(): JQueryDeferred<google.maps.LatLng> {
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
                deferred.reject("Geolocation is not supported by yout device");
            }

            return deferred;
        }

        //Reverse Geocoding
        private getAddress(latLong: google.maps.LatLng) {
            var that: HomeController = this;
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ 'location': latLong }, function (results: any, status: any) {
                if (status == google.maps.GeocoderStatus.OK) {
                    //console.log("Reverse Geocode results: ", results)
                    if (results[0]) {
                        that.$scope.homeScope.userAddress = results[0].formatted_address;
                        console.log("currentAddress: ", that.$scope.homeScope.userAddress);
                    } else {
                        console.log("No results found");
                    }
                } else {
                    console.log("Geocoder failed due to: " + status);
                }
            });
        }

        private getRadius(num: number): number {
            return Math.sqrt(num) * 100;
        }
    }
}
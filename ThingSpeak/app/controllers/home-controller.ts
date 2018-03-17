module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        loggedInUser?: ViewModels.iUser;
        currentLocation?: string;
        userAddress?: string;
        mapCenter?: string;
        googleMapsUrl?: string;
        customMapStyle?: any;
        sensors?: ViewModels.iSensor[];
        selectedSensor?: ViewModels.iSensor;
        mapEnable?: boolean;
        showSensorDetails?: boolean;
        userLocation?: google.maps.LatLng;
        googleMapAutoComplete?: google.maps.places.Autocomplete;

    }

    interface IHomeScope extends ng.IScope {
        homeScope?: ICurrentScope;
    }

    export class HomeController {
        constructor(
            public $scope: IHomeScope,
            private $rootScope: ng.IRootScopeService,
            private $timeout: ng.ITimeoutService,
            private $location: ng.ILocationService,
            private $cookies: ng.cookies.ICookiesService,
            private FirebaseService: Services.FirebaseService,
            private MapService: Services.MapService) {
            var that: HomeController = this;
            that.init();
        }

        private init() {
            var that: HomeController = this;

            that.$scope.homeScope = {};
            that.$scope.homeScope.loggedInUser = {};
            that.$scope.homeScope.googleMapsUrl = "";
            that.$scope.homeScope.sensors = [];
            that.$scope.homeScope.selectedSensor = {};
            that.$scope.homeScope.currentLocation = "";
            that.$scope.homeScope.userAddress = "";
            that.$scope.homeScope.showSensorDetails = false;

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

            that.checkUSer();

            //that.intitializeGoogleMapsAutoComplete();

            that.MapService.intitializeGoogleMapsAutoComplete();
        }

        private goTo(route: string) {
            var that: HomeController = this;

            that.$location.path(route);
        }
        private setCurrentLocation() {
            var that: HomeController = this;
            that.$rootScope.$emit('set-current-location');
        }

        private checkUSer() {
            var that: HomeController = this;
            that.FirebaseService.checkSignedInUser()
                .done((user: any) => {
                    if (user) {
                        that.$scope.homeScope.loggedInUser = user;

                        console.log("User", that.$scope.homeScope.loggedInUser );

                        that.getSensors();
                    } else {
                        that.$location.path("login");
                    }
                }).fail((error: any) => {
                    console.log("There is  no logged in user");
                });
        }

        private Signout() {
            console.log("Signing out");

            var that: HomeController = this;
            that.FirebaseService.signOut()
                .done((response: any) => {
                    console.log(response);
                }).fail((error: any) => {
                    console.log(error);
                }).always(() => {
                    that.$location.path("login");
                });
        }

        private getSensors() {
            var that: HomeController = this;

            that.FirebaseService.readList("sensors")
                .done((sensors: ViewModels.iSensor[]) => {
                    that.$scope.$apply(function () {
                        that.$scope.homeScope.sensors = sensors;
                    });

                }).fail((error: any) => {
                    console.log("Error:", error);
                });
        }

        private getSensorDetails(sensorId: any) {
            var that: HomeController = this;

            that.FirebaseService.read("sensors", sensorId)
                .done((sensor: any) => {
                    that.$scope.homeScope.selectedSensor = sensor;
                }).fail((error: any) => {
                    console.log("Error:", error);
                });
        }

        private displaySensorDetails(sensor: ViewModels.iSensor) {
            var that: HomeController = this;

            if (sensor) {
                that.$scope.homeScope.showSensorDetails = true;
                that.$scope.homeScope.selectedSensor = sensor;
                if (sensor.latitude && sensor.longitude) {
                    that.$rootScope.$emit('display-sensor-details', sensor);
                }
            }
            else {
                that.$scope.homeScope.showSensorDetails = false;
                that.$scope.homeScope.selectedSensor = {}
            }
        }

    }
}
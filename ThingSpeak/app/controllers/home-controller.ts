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
            private $location: ng.ILocationService,
            private FirebaseService: Services.FirebaseService) {
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

            that.doFirebaseStuff();

        }

        private doFirebaseStuff() {
            var that: HomeController = this;

            var newUser: ThingSpeak.ViewModels.User = {
                id: Helpers.AppHelpers.generateGUID(),
                name:"Mzitoh Yule",
                phone: "0711028292",
                email: "mzitoh@me.com",
                role: ViewModels.userRole.admin
            }

            that.FirebaseService.write("users", newUser, newUser.name);

        }
    }
}
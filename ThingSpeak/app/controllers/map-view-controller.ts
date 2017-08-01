module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        mapName?: string;
        map?: {
            center: {
                latitude: number;
                longitude: number;
            };
            zoom: number;
            options: {
                styles: ({ featureType: string;elementType: string;stylers: { color: string }[] } |
                         { featureType: string;elementType: string;stylers: { visibility: string }[] } |
                         {
                             featureType: string;
                             elementType: string;
                             stylers: ({ saturation: number } | { lightness: number })[];
                         } |
                         { featureType: string;elementType: string;stylers: ({ visibility: string } | { color: string })[] }
                         |
                         { featureType: string;elementType: string;stylers: ({ visibility: string } | { hue: string })[] })[
                ];
                streetViewControl: boolean;
                mapTypeControl: boolean;
                scaleControl: boolean;
                rotateControl: boolean;
                zoomControl: boolean;
            };
            bounds: { northeast: { latitude: number;longitude: number };southwest: { latitude: number;longitude: number } }
        };
    }

    interface IMapScope extends ng.IScope {
        mapScope?: ICurrentScope;
    }

    export class MapViewController {
        constructor(
            private $scope: IMapScope,
            private $state: angular.ui.IStateService,
            private uiGmapGoogleMapApi: angular.ui.IStateService,
            private nemSimpleLogger:any) {

            var that: MapViewController = this;
            that.init();
        }

        private init() {
            var that: MapViewController = this;

            that.$scope.mapScope = {};
            that.$scope.mapScope.mapName = "";

            that.loadMap();
        }

        private loadMap() {
            var that: MapViewController = this;

            var customMapStyle = [
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

            that.$scope.mapScope.map = {
                center: {
                    latitude: -1.2920659,
                    longitude: 36.8219462
                },
                zoom: 8,
                options: {
                    styles: customMapStyle,
                    streetViewControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    rotateControl: false,
                    zoomControl: false
                }, 
                bounds : {
                    northeast: {
                        latitude: 0.17687,
                        longitude: 37.90833
                    },
                    southwest: {
                        latitude: -0.17687,
                        longitude: -37.90833
                    }
                }
            };

            console.log("Map Center: ", that.$scope.mapScope.map.center);
        }
    }
}
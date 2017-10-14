module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        pageTitle?: string;
        menuConfig?: {
            buttonWidth: number;
            menuRadius: number;
            color: string;
            offset: number;
            textColor: string;
            showIcons: boolean;
            onlyIcon: boolean;
            textAndIcon: boolean;
            gutter: { top: number;right: number;bottom: number;left: number };
            angles: { topLeft: number;topRight: number;bottomRight: number;bottomLeft: number };
        };
        menuItems?: {
            title: string;
            color: string;
            rotate: number;
            show: number;
            titleColor: string;
            icon: { color: string;name: string;size: number }
        }[];

        mapName?: string;
        map?: {
            center: {
                latitude: number;
                longitude: number;
            };
            mapTypeId: google.maps.MapTypeId;
            zoom: number;
            options: {
                styles: ({ featureType: string; elementType: string; stylers: { color: string }[] } |
                    { featureType: string; elementType: string; stylers: { visibility: string }[] } |
                    {
                        featureType: string;
                        elementType: string;
                        stylers: ({ saturation: number } | { lightness: number })[];
                    } |
                    { featureType: string; elementType: string; stylers: ({ visibility: string } | { color: string })[] }
                    |
                    { featureType: string; elementType: string; stylers: ({ visibility: string } | { hue: string })[] })[
                ];
                streetViewControl: boolean;
                mapTypeControl: boolean;
                scaleControl: boolean;
                rotateControl: boolean;
                zoomControl: boolean;
            };
            bounds: { northeast: { latitude: number; longitude: number }; southwest: { latitude: number; longitude: number } }
        };
        
        googleMapsUrl?: string;
        mapCenter?: string[]
        customMapStyle?: any;
        sensors?: ViewModels.Channel[];
        mapEnable?: boolean;
        displayLabel?: string;
    }

    interface IHomeScope extends ng.IScope {
        homeScope?: ICurrentScope;
    }

    export class HomeController {
        constructor(
            private $scope: IHomeScope,
            private $rootScope: ng.IRootScopeService,
            private $state: angular.ui.IStateService,
            private mapDataService: Services.MapDataService,
            private NgMap: angular.map.INgMap
        ) {

            var that: HomeController = this;
            that.init();
        }

        private init() {
            var that: HomeController = this;

            that.$scope.homeScope = {};
            that.$scope.homeScope.pageTitle = "AngularJS App";
            that.$scope.homeScope.displayLabel = "";
            that.$scope.homeScope.googleMapsUrl = "";
            that.$scope.homeScope.sensors = [];

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

            that.$rootScope.$on('map-center-updated', (event, data) => {
                that.$scope.homeScope.mapCenter = data;
            });
            that.$rootScope.$on('sensors-updated', (event, data) => {
                that.$scope.homeScope.sensors = data;
                //console.log("sensors:", data);
            });

            that.fillMenu();
            that.loadMap();

        }

        private fillMenu() {
            var that: HomeController = this;

            that.$scope.homeScope.menuConfig = {
                "buttonWidth": 60,
                "menuRadius": 180,
                "color": "#393c41",
                "offset": 25,
                "textColor": "#ffffff",
                "showIcons": true,
                "onlyIcon": false,
                "textAndIcon": true,
                "gutter": {
                    "top": 35,
                    "right": 50,
                    "bottom": 35,
                    "left": 35
                },
                "angles": {
                    "topLeft": 0,
                    "topRight": 90,
                    "bottomRight": 180,
                    "bottomLeft": 270
                }
            };

            that.$scope.homeScope.menuItems = [{
                "title": "Flow Rate",
                "color": "#424242",
                "rotate": 0,
                "show": 0,
                "titleColor": "#fff",
                "icon": { "color": "#fff", "name": "fa fa-line-chart", "size": 20 }
            }, {
                "title": "Home",
                "color": "#303030",
                "rotate": 0,
                "show": 0,
                "titleColor": "#fff",
                "icon": { "color": "#fff", "name": "fa fa-map", "size": 20 }
            }, {
                "title": "About",
                "color": "#212121",
                "rotate": 0,
                "show": 0,
                "titleColor": "#fff",
                "icon": { "color": "#fff", "name": "fa fa-info", "size": 25 }
            }, {
                "title": "Admin",
                "color": "#000000",
                "rotate": 0,
                "show": 0,
                "titleColor": "#fff",
                "icon": { "color": "#fff", "name": "fa fa-sliders", "size": 20 }
            }];
        }

        private onWingClick(wing: any) {
            var that: HomeController = this;
            that.$state.go(wing.title);

            console.log("State: ", that.$state.current.name);
        }

        private loadMap() {
            var that: HomeController = this;
            that.$scope.homeScope.googleMapsUrl = Configs.AppConfig.googleMapsUrl;

            if (typeof google == "undefined") {
                that.$scope.homeScope.mapEnable = false;
                console.warn("Map cannot show");
            } else {
                that.$scope.homeScope.mapEnable = true;
            }

            that.loadMapData();
        }

        private loadMapData() {
            var that: HomeController = this;

            var pos = that.getCurrentPosition();
            if (pos) {
                var address = that.getAddress(pos);
                if (address) {
                    var infowindow = new google.maps.InfoWindow({
                        content: address
                    });
                }
            }

            var mapOptions = {
                    mapTypeId: google.maps.MapTypeId.HYBRID,
                    zoom: 8,
                    options: {
                        styles: this.$scope.homeScop.customMapStyle,
                        streetViewControl: false,
                        mapTypeControl: false,
                        scaleControl: false,
                        rotateControl: false,
                        zoomControl: false
                    }
            }

            var markers = [];

            that.mapDataService.loadMapData()
                .done((response: Models.IHttpResponse) => {
                    var kenyaCountriesData = response.data;

                    that.NgMap.getMap().then(function (thisMap) {
                    thisMap.setOptions(mapOptions);
                    if (pos) thisMap.setCenter(pos);

                    var myMarker = new google.maps.Marker({
                        position: pos,
                        map: thisMap,
                        title: 'Sensor Location'
                    });


                    myMarker.addListener('click', function () {
                        infowindow.open(thisMap, myMarker)
                    });
                    
                    if (kenyaCountriesData) {

                        //var geojson = JSON .parse(kenyaCountriesData);
                        //thisMap.data.addGeoJson(geojson);

                        //var kenyaHealthSites = "https://data.humdata.org/dataset/65b34def-4e7a-4dff-93ff-66a0c276d99d/resource/308d62cd-a66d-4d41-afc3-9971bf81b7ec/download/kenya.geojson";
                        //thisMap.data.loadGeoJson(kenyaHealthSites);

                        //thisMap.data.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/google.json');
                        var nyc = "https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson";
                        thisMap.data.loadGeoJson(nyc, null, function (features) {
                            console.log("features: ", features);

                        });

                        //var heatmapData = [];

                        //if (kenyaCountriesData.features) {
                        //    for (var i = 0; i < kenyaCountriesData.features.length; i++) {
                        //        var coords = kenyaCountriesData.features[i].geometry.coordinates;
                        //        var latLng = new google.maps.LatLng(coords[1], coords[0]);
                        //        var marker = new google.maps.Marker({
                        //            position: latLng,
                        //            map: thisMap
                        //        });
                        //    }
                        //}
                    }
                });
            });
        }

        //GeoCoding
        private getCurrentPosition():google.maps.LatLng {
            var that: HomeController = this;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        console.log("geolocate: ", geolocate);
                        console.log("position: ", position);

                        return geolocate;
                    },
                    (error) => {
                        console.log("Error: ", error);
                    });
            } else {
                console.log("Geolocation is not supported by yout device");
            }
            return null;
        }

        //Reverse Geocoding
        private getAddress(latLong: google.maps.LatLng):string {
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ 'location': latLong }, function (results:any, status:any) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log("Reverse Geocode results: ", results)
                    if (results[1]) {
                        return results[0].formatted_address;
                    } else {
                        console.log("No results found");
                    }
                } else {
                    console.log("Geocoder failed due to: " + status);
                }
            });
            return "";
        }

        private getRadius(num: number): number {
            return Math.sqrt(num) * 100;
        }
    }
}
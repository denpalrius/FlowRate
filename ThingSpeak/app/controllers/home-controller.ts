module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        pageTitle?: string;
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
            private $state: angular.ui.IStateService) {
            var that: HomeController = this;
            that.init();
        }

        private init() {
            var that: HomeController = this;

            that.$scope.homeScope = {};
            that.$scope.homeScope.pageTitle = "AngularJS App";
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

            that.loadMap();

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

            var mapOptions: google.maps.MapOptions = {
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                zoom: 8,
                center: pos,
                styles: this.$scope.homeScope.customMapStyle,
                streetViewControl: true,
                mapTypeControl: true,
                scaleControl: true,
                rotateControl: true,
                zoomControl: true
            }

         

            //that.mapDataService.loadMapData()
            //    .done((response: Models.IHttpResponse) => {
            //        var kenyaCountriesData = response.data;

            //        that.NgMap.getMap().then(function (thisMap) {
            //        thisMap.setOptions(mapOptions);
            //        if (pos) thisMap.setCenter(pos);

           //var myMarker = new google.maps.Marker({
           //             position: pos,
           //             map: thisMap,
           //             title: 'Sensor Location'
           //         });


            //        myMarker.addListener('click', function () {
            //            console.log("Marker clicked");
            //            infowindow.open(thisMap, myMarker)
            //        });
                    
            //        if (kenyaCountriesData) {

            //            //var geojson = JSON .parse(kenyaCountriesData);
            //            //thisMap.data.addGeoJson(geojson);

            //            //var kenyaHealthSites = "https://data.humdata.org/dataset/65b34def-4e7a-4dff-93ff-66a0c276d99d/resource/308d62cd-a66d-4d41-afc3-9971bf81b7ec/download/kenya.geojson";
            //            //thisMap.data.loadGeoJson(kenyaHealthSites);

            //            //thisMap.data.loadGeoJson('https://storage.googleapis.com/mapsdevsite/json/google.json');
            //            //var nyc = "https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson";
            //            //thisMap.data.loadGeoJson(nyc, null, function (features) {
            //                //console.log("features: ", features);

            //            //});

            //            //var heatmapData = [];

            //            //if (kenyaCountriesData.features) {
            //            //    for (var i = 0; i < kenyaCountriesData.features.length; i++) {
            //            //        var coords = kenyaCountriesData.features[i].geometry.coordinates;
            //            //        var latLng = new google.maps.LatLng(coords[1], coords[0]);
            //            //        var marker = new google.maps.Marker({
            //            //            position: latLng,
            //            //            map: thisMap
            //            //        });
            //            //    }
            //            //}
            //        }
            //    });
            //});
        }

        //GeoCoding
        private getCurrentPosition():google.maps.LatLng {
            var that: HomeController = this;

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        //console.log("geolocate: ", geolocate);
                        //console.log("position: ", position);

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

            geocoder.geocode({'location': latLong }, function (results:any, status:any) {
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
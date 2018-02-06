module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        loggedInUser?: ViewModels.iUser;
        currentLocation?: any;
        userAddress?: string;
        mapCenter?: string;
        googleMapsUrl?: string;
        customMapStyle?: any;
        sensors?: ViewModels.iSensor[];
        selectedSensor?: ViewModels.iSensor;
        mapEnable?: boolean;
    }

    interface IHomeScope extends ng.IScope {
        homeScope?: ICurrentScope;
    }

    export class HomeController {
        constructor(
            private $scope: IHomeScope,
            private $rootScope: ng.IRootScopeService,
            private $timeout: ng.ITimeoutService,
            private $location: ng.ILocationService,
            private $cookies: ng.cookies.ICookiesService,
            private FirebaseService: Services.FirebaseService) {
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

            that.getSensors();
            that.getSensorDetails("0005AMB");

            that.loadUSerDetails();
        }

        private loadUSerDetails() {
            var that: HomeController = this;
            var userDetails = that.$cookies.getObject(Configs.AppConfig.cookies.UserProfile);
            if (userDetails) {
                that.$scope.homeScope.loggedInUser = userDetails;
                console.log("loggedInUser: ", that.$scope.homeScope.loggedInUser);
            } else {
                that.$location.path("login");
            }
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

        private uploadSensorData() {
            var that: HomeController = this;

            var sensorArray: ViewModels.iSensor[] = [
                {
                    "id": "0005AMB",
                    "physicalAddress": "Ambassadeur",
                    "lat": -1.285963,
                    "lon": 36.826048,
                    "installedOn": "2010-06-09T15:20:00-07:00",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0006BSS",
                    "physicalAddress": "Bus Station",
                    "lat": -1.287191,
                    "lon": 36.828881,
                    "installedOn": "2010-06-09T15:20:00-07:01",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0007COM",
                    "physicalAddress": "Commercial",
                    "lat": -1.284282,
                    "lon": 36.826188,
                    "installedOn": "2010-06-09T15:20:00-07:02",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0512AMU",
                    "physicalAddress": "Ambassadeur",
                    "lat": -1.285315,
                    "lon": 36.825615,
                    "installedOn": "2010-06-09T15:20:00-07:03",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0001RLW",
                    "physicalAddress": "Railways Terminus",
                    "lat": -1.290884,
                    "lon": 36.828242,
                    "installedOn": "2010-06-09T15:20:00-07:04",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0513KWR",
                    "physicalAddress": "Kware",
                    "lat": -1.396812,
                    "lon": 36.75024,
                    "installedOn": "2010-06-09T15:20:00-07:05",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0412KNC",
                    "physicalAddress": "Kencom",
                    "lat": -1.28589,
                    "lon": 36.82429,
                    "installedOn": "2010-06-09T15:20:00-07:06",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "6050GPO",
                    "physicalAddress": "GPO",
                    "lat": -1.28604,
                    "lon": 36.818211,
                    "installedOn": "2010-06-09T15:20:00-07:07",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0502AMB",
                    "physicalAddress": "Ambassadeur",
                    "lat": -1.2854,
                    "lon": 36.825803,
                    "installedOn": "2010-06-09T15:20:00-07:08",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501KPU",
                    "physicalAddress": "Kenya Polytechnic Bus Stop",
                    "lat": -1.292001,
                    "lon": 36.822352,
                    "installedOn": "2010-06-09T15:20:00-07:09",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501KBL",
                    "physicalAddress": "Kobil Haile Selassie",
                    "lat": -1.29335,
                    "lon": 36.820878,
                    "installedOn": "2010-06-09T15:20:00-07:10",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501KAB",
                    "physicalAddress": "Makaburini",
                    "lat": -1.29955,
                    "lon": 36.824716,
                    "installedOn": "2010-06-09T15:20:00-07:11",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0511NYS",
                    "physicalAddress": "Nyayo Stadium/Nairobi West Stage",
                    "lat": -1.305554,
                    "lon": 36.825028,
                    "installedOn": "2010-06-09T15:20:00-07:12",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501WEB",
                    "physicalAddress": "West End Bar/Barclays",
                    "lat": -1.30734,
                    "lon": 36.82366,
                    "installedOn": "2010-06-09T15:20:00-07:13",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0511NWT",
                    "physicalAddress": "Nairobi West Stage",
                    "lat": -1.307386,
                    "lon": 36.822896,
                    "installedOn": "2010-06-09T15:20:00-07:14",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501DSC",
                    "physicalAddress": "Discount",
                    "lat": -1.307496,
                    "lon": 36.822293,
                    "installedOn": "2010-06-09T15:20:00-07:15",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501WEM",
                    "physicalAddress": "West Mall",
                    "lat": -1.30939,
                    "lon": 36.82225,
                    "installedOn": "2010-06-09T15:20:00-07:16",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501MIL",
                    "physicalAddress": "Miller Estate",
                    "lat": -1.31174,
                    "lon": 36.82004,
                    "installedOn": "2010-06-09T15:20:00-07:17",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501CIV",
                    "physicalAddress": "Civil Servants",
                    "lat": -1.31213,
                    "lon": 36.81927,
                    "installedOn": "2010-06-09T15:20:00-07:18",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501MOE",
                    "physicalAddress": "Moi Educational Centre",
                    "lat": -1.31337,
                    "lon": 36.81898,
                    "installedOn": "2010-06-09T15:20:00-07:19",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501KSB",
                    "physicalAddress": "Kenya Society For The Blind",
                    "lat": -1.31425,
                    "lon": 36.81831,
                    "installedOn": "2010-06-09T15:20:00-07:20",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501SPR",
                    "physicalAddress": "Space Apartments",
                    "lat": -1.31397,
                    "lon": 36.81782,
                    "installedOn": "2010-06-09T15:20:00-07:21",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501MAG",
                    "physicalAddress": "Magharibi/Kogo Star",
                    "lat": -1.3137,
                    "lon": 36.81747,
                    "installedOn": "2010-06-09T15:20:00-07:22",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0503TMO",
                    "physicalAddress": "T-Mall",
                    "lat": -1.31297,
                    "lon": 36.81666,
                    "installedOn": "2010-06-09T15:20:00-07:23",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501KDO",
                    "physicalAddress": "Kodi I",
                    "lat": -1.307651,
                    "lon": 36.821316,
                    "installedOn": "2010-06-09T15:20:00-07:24",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501KDT",
                    "physicalAddress": "Kodi Ii",
                    "lat": -1.307474,
                    "lon": 36.820249,
                    "installedOn": "2010-06-09T15:20:00-07:25",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501MKS",
                    "physicalAddress": "Madaraka Shopping Centre",
                    "lat": -1.30682,
                    "lon": 36.81779,
                    "installedOn": "2010-06-09T15:20:00-07:26",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501NMD",
                    "physicalAddress": "Nhc Flats/Madaraka Primary School",
                    "lat": -1.30685,
                    "lon": 36.81659,
                    "installedOn": "2010-06-09T15:20:00-07:27",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0511SUP",
                    "physicalAddress": "7Up",
                    "lat": -1.30738,
                    "lon": 36.81491,
                    "installedOn": "2010-06-09T15:20:00-07:28",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0503STS",
                    "physicalAddress": "Strathmore/Siwaka",
                    "lat": -1.30875,
                    "lon": 36.81233,
                    "installedOn": "2010-06-09T15:20:00-07:29",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0500STR",
                    "physicalAddress": "Strathmore University/Siwaka",
                    "lat": -1.30874,
                    "lon": 36.81251,
                    "installedOn": "2010-06-09T15:20:00-07:30",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0500SUP",
                    "physicalAddress": "7Up",
                    "lat": -1.30742,
                    "lon": 36.81474,
                    "installedOn": "2010-06-09T15:20:00-07:31",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0500MPS",
                    "physicalAddress": "Madaraka Primary School",
                    "lat": -1.30691,
                    "lon": 36.81627,
                    "installedOn": "2010-06-09T15:20:00-07:32",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0500MSC",
                    "physicalAddress": "Madaraka Shopping Centre",
                    "lat": -1.30683,
                    "lon": 36.81867,
                    "installedOn": "2010-06-09T15:20:00-07:33",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0511MAD",
                    "physicalAddress": "Madaraka Flyover Stage",
                    "lat": -1.307736,
                    "lon": 36.819463,
                    "installedOn": "2010-06-09T15:20:00-07:34",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501TML",
                    "physicalAddress": "Shell/T-Mall",
                    "lat": -1.311067,
                    "lon": 36.817232,
                    "installedOn": "2010-06-09T15:20:00-07:35",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501WIL",
                    "physicalAddress": "Wilson Airport/Shell",
                    "lat": -1.316647,
                    "lon": 36.813418,
                    "installedOn": "2010-06-09T15:20:00-07:36",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501AMR",
                    "physicalAddress": "Amref",
                    "lat": -1.319163,
                    "lon": 36.810873,
                    "installedOn": "2010-06-09T15:20:00-07:37",
                    "installedBy": "Denis Sigei"
                },
                {
                    "id": "0501DME",
                    "physicalAddress": "Dam Estate",
                    "lat": -1.322802,
                    "lon": 36.804624,
                    "installedOn": "2010-06-09T15:20:00-07:38",
                    "installedBy": "Denis Sigei"
                }
            ];

            sensorArray.forEach((sensor: ViewModels.iSensor) => {
                that.FirebaseService.write(Configs.AppConfig.firebaseRefs.sensors, sensor);
            });
        }
    }
}
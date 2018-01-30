var ThingSpeak;
(function (ThingSpeak) {
    var Configs;
    (function (Configs) {
        var ThemeConfig = (function () {
            function ThemeConfig($mdThemingProvider, $mdIconProvider) {
                $mdThemingProvider.theme('default')
                    .primaryPalette('cyan', {
                    'default': '400',
                    'hue-1': '100',
                    'hue-2': '600',
                    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                })
                    .accentPalette('deep-orange', {
                    'default': '700' // use shade 200 for default, and keep all other shades the same
                });
                // Enable browser color
                $mdThemingProvider.enableBrowserColor({
                    theme: 'default',
                    palette: 'accent',
                    hue: '700' // Default is '800'
                });
            }
            return ThemeConfig;
        }());
        Configs.ThemeConfig = ThemeConfig;
    })(Configs = ThingSpeak.Configs || (ThingSpeak.Configs = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
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
                        //console.log("Reverse Geocode results: ", results)
                        if (results.length) {
                            //console.log("Reverse Geocode", results[0]);
                            deferred.resolve(results[0]);
                        }
                        else {
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
        function loadCurrentAddress(pos, scope, $timeout) {
            getUserAddress(pos, null)
                .done(function (geoCodeResult) {
                $timeout(0).then(function () {
                    scope.currentLocation = geoCodeResult.formatted_address;
                    console.log("Reverse output Address", scope.currentLocation);
                });
            })
                .fail(function (error) {
                //TODO: handle error
            });
        }
        function loadListeners(scope, $timeout) {
            // click map listener  
            scope.map.addListener('click', function (e) {
                var clickLocation = e.latLng;
                //console.log("e: ", e);
                scope.marker.setPosition(clickLocation);
                getUserAddress(clickLocation, null)
                    .done(function (geoCodeResult) {
                    $timeout(0).then(function () {
                        scope.currentLocation = geoCodeResult.formatted_address;
                        console.log("Reverse output: ", scope.currentLocation);
                    });
                })
                    .fail(function (error) {
                    //TODO: handle error
                });
            });
            if (scope.isShowSearchBar) {
                // click autocomplete listener
                scope.googleMapAutoComplete.addListener('place_changed', function (e) {
                    var place = scope.googleMapAutoComplete.getPlace();
                    //console.warn("Event : ", e);
                    $timeout(0).then(function () {
                        console.log("Place : ", [place, scope]);
                        scope.marker.setPosition(place.geometry.location);
                        scope.currentLocation = place.formatted_address;
                        scope.map.setCenter(place.geometry.location);
                    });
                });
            }
        }
        function attachSearchBar() {
            //console.log("Input : ", $("#googleMapSearchBox"));
            var searchInput = $("#googleMapSearchBox")[0];
            return new google.maps.places.Autocomplete(searchInput);
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
            scope.geocoder = new google.maps.Geocoder;
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
                mapTypeControl: true,
                //maxZoom: 15,
                //minZoom: 4,
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
                    getUserLocationClick: '&getUserLocationClick',
                    isShowSearchBar: '=isShowSearchBar'
                    //    "@"   (Text binding / one - way binding )
                    //    "="   (Direct model binding / two - way binding )
                    //    "&"   (Behaviour binding / Method binding  )
                },
                templateUrl: '/app/views/templates/ts-google-map-template.html',
                link: function (scope, $elm, attr) {
                    init(scope, $timeout);
                    $timeout(5).then(function () {
                        //Change this once you Move Input to Directive
                        if (scope.isShowSearchBar) {
                            scope.googleMapAutoComplete = attachSearchBar();
                            //console.warn("scope.googleMapAutoComplete: ", scope.googleMapAutoComplete);
                            scope.getUserLocationClick = function () {
                                getUserLocationFn(navigator)
                                    .done(function (pos) {
                                    scope.marker.setPosition(pos);
                                    scope.map.setCenter(pos);
                                })
                                    .fail(function (error) {
                                    //set a manual location
                                    scope.userLocation = null;
                                });
                            };
                            getUserLocationFn(navigator)
                                .done(function (latLong) {
                                scope.userLocation = latLong;
                                getUserAddress(scope.userLocation, null)
                                    .done(function (geoCodeResult) {
                                    $timeout(0).then(function () {
                                        scope.currentLocation = geoCodeResult.formatted_address;
                                        scope.marker.setPosition(scope.userLocation);
                                        scope.map.setCenter(scope.userLocation);
                                        //console.log("Reverse output Address", scope.currentLocation);
                                    });
                                })
                                    .fail(function (error) {
                                    //TODO: handle error
                                });
                                // loadCurrentAddress(scope.userLocation, scope, $timeout);
                                loadListeners(scope, $timeout);
                            })
                                .fail(function (error) {
                                scope.userLocation = null;
                                init(scope, $timeout);
                                loadListeners(scope, $timeout);
                                scope.getUserLocationClick = function () {
                                    getUserLocationFn(navigator)
                                        .done(function (pos) {
                                        scope.marker.setPosition(pos);
                                        scope.map.setCenter(pos);
                                    })
                                        .then(function (pos) {
                                        // loadCurrentAddress(pos, scope, $timeout);
                                    })
                                        .fail(function (error) {
                                        //set a manual location
                                        scope.userLocation = null;
                                        loadListeners(scope, $timeout);
                                    });
                                };
                            });
                        }
                        else {
                            // get addresss  
                            getUserAddress(null, scope.currentLocation)
                                .done(function (geoCodeResult) {
                                init(scope, $timeout); //map fails to load without calling init()
                                // loadListeners(scope, $timeout);
                                $log.info("Meeting Location ", scope.currentLocation);
                                $log.info("Geocode Result ", geoCodeResult.geometry.location);
                                scope.marker.setPosition(geoCodeResult.geometry.location);
                                scope.map.setCenter(geoCodeResult.geometry.location);
                            })
                                .fail(function (error) {
                                $log.error("Failed to get address : ", error);
                                getUserLocationFn(navigator)
                                    .done(function (latLong) {
                                    scope.map.setCenter(latLong);
                                });
                                //loadListeners(scope, $timeout);
                            });
                        }
                    });
                }
            };
            return ddo;
        }
        Directives.TsGoogleMap = TsGoogleMap;
    })(Directives = ThingSpeak.Directives || (ThingSpeak.Directives = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    "use strict";
    var AppModule = (function () {
        function AppModule() {
            // module
            var ngFlowRate = angular.module("ngFlowRate", ["ngRoute", "ngMaterial", "ngMessages", "firebase"]);
            // configs
            ngFlowRate.config([ThingSpeak.Configs.AppConfig]);
            ngFlowRate.config(["$routeProvider", "$locationProvider", ThingSpeak.Configs.RouteConfig]);
            ngFlowRate.config(["$mdThemingProvider", "$mdIconProvider", ThingSpeak.Configs.ThemeConfig]);
            //Directives
            ngFlowRate.directive("tsGoogleMap", ["$timeout", "$log", ThingSpeak.Directives.TsGoogleMap]);
            //Filters
            ngFlowRate.filter("TsRemoveStringFilter", ThingSpeak.Filters.TsRemoveStringFilter);
            // services
            ngFlowRate.service("HttpService", ["$http", ThingSpeak.Services.HttpService]);
            ngFlowRate.service("ThingSpeakService", ["HttpService", ThingSpeak.Services.ThingSpeakService]);
            ngFlowRate.service("FirebaseService", [ThingSpeak.Services.FirebaseService]);
            // controllers
            ngFlowRate.controller("AdminController", ["$scope", ThingSpeak.Controllers.AdminController]);
            ngFlowRate.controller("HomeController", ["$scope", "$rootScope", "$location", "FirebaseService", ThingSpeak.Controllers.HomeController]);
            ngFlowRate.controller("FlowRateController", ["$scope", "$rootScope", "$location", "HttpService", "ThingSpeakService", "$timeout", ThingSpeak.Controllers.FlowRateController]);
            ngFlowRate.controller("AboutController", ["$scope", ThingSpeak.Controllers.AboutController]);
            // bootstrap the app when everything has been loaded
            angular.element(document).ready(function () {
                angular.bootstrap(document, ["ngFlowRate"]);
            });
        }
        return AppModule;
    }());
    ThingSpeak.AppModule = AppModule;
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Configs;
    (function (Configs) {
        var AppConfig = (function () {
            function AppConfig() {
            }
            return AppConfig;
        }());
        AppConfig.ApiUrl = "https://thingspeak.com/channels/16153/feed.json";
        AppConfig.googleMapsKey = "AIzaSyD-GStdYSjF3KUTNa3Xqxc_2BYx4kH-WNw";
        AppConfig.googleMapsUrl = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD-GStdYSjF3KUTNa3Xqxc_2BYx4kH-WNw";
        AppConfig.firebaseConfig = {
            apiKey: "AIzaSyCJPEz7gppJusDGFuaBWyLhKrU--cgECfc",
            authDomain: "thingspeak-1501090556379.firebaseapp.com",
            databaseURL: "https://thingspeak-1501090556379.firebaseio.com",
            projectId: "thingspeak-1501090556379",
            storageBucket: "thingspeak-1501090556379.appspot.com",
            messagingSenderId: "311714038874"
        };
        Configs.AppConfig = AppConfig;
    })(Configs = ThingSpeak.Configs || (ThingSpeak.Configs = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Configs;
    (function (Configs) {
        var RouteConfig = (function () {
            function RouteConfig($routeProvider, $locationProvider) {
                $routeProvider
                    .when("/home", {
                    templateUrl: '/app/views/home.html',
                    controllerAs: 'HomeCtrl',
                    controller: 'HomeController',
                })
                    .when("/about", {
                    templateUrl: '/app/views/about.html',
                    controllerAs: 'AboutCtrl',
                    controller: 'AboutController',
                })
                    .when("/admin", {
                    templateUrl: '/app/views/admin.html',
                    controllerAs: 'AdminCtrl',
                    controller: 'AdminController',
                })
                    .when("/flowrate", {
                    templateUrl: '/app/views/flow-rate.html',
                    controllerAs: 'FlowRateCtrl',
                    controller: 'FlowRateController',
                })
                    .otherwise({
                    redirectTo: "/home",
                });
                $locationProvider.html5Mode(true);
            }
            return RouteConfig;
        }());
        Configs.RouteConfig = RouteConfig;
    })(Configs = ThingSpeak.Configs || (ThingSpeak.Configs = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var AdminController = (function () {
            function AdminController($scope) {
                this.$scope = $scope;
                var that = this;
                that.init();
            }
            AdminController.prototype.init = function () {
                var that = this;
            };
            return AdminController;
        }());
        Controllers.AdminController = AdminController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var AboutController = (function () {
            function AboutController($scope) {
                this.$scope = $scope;
                var that = this;
                that.init();
            }
            AboutController.prototype.init = function () {
                var that = this;
            };
            return AboutController;
        }());
        Controllers.AboutController = AboutController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var HomeController = (function () {
            function HomeController($scope, $rootScope, $location, FirebaseService) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$location = $location;
                this.FirebaseService = FirebaseService;
                var that = this;
                that.init();
            }
            HomeController.prototype.init = function () {
                var that = this;
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
            };
            HomeController.prototype.doFirebaseStuff = function () {
                var that = this;
                var newUser = {
                    id: ThingSpeak.Helpers.AppHelpers.generateGUID(),
                    name: "Mzitoh Yule",
                    phone: "0711028292",
                    email: "mzitoh@me.com",
                    role: ThingSpeak.ViewModels.userRole.admin
                };
                that.FirebaseService.write("users", newUser, newUser.name);
            };
            return HomeController;
        }());
        Controllers.HomeController = HomeController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var FlowRateController = (function () {
            function FlowRateController($scope, $rootScope, $location, HttpService, ThingSpeakService, $timeout) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$location = $location;
                this.HttpService = HttpService;
                this.ThingSpeakService = ThingSpeakService;
                this.$timeout = $timeout;
                var that = this;
                that.init();
            }
            FlowRateController.prototype.init = function () {
                var that = this;
                that.$scope.flowRateScope = {};
                that.$scope.flowRateScope.maraRiverFlowRate = {};
                that.$scope.flowRateScope.maraRiverFlowRate.channel = {};
                that.$scope.flowRateScope.maraRiverFlowRate.feeds = [];
                that.$scope.flowRateScope.channel = {};
                that.$scope.flowRateScope.feeds = [];
                that.$scope.flowRateScope.sensors = [];
                that.$scope.flowRateScope.pageLoadingFinished = false;
                that.$scope.flowRateScope.reorderFeeds = [];
                that.$scope.flowRateScope.selectedFeed = [];
                that.$scope.flowRateScope.$stickies = [];
                //that.getData();
                that.getFlowRateData();
                //TODO: Do a progress ring
                //TODO: Paginate the table
                //TODO: Add charts for Field 1, field 2 ad field 3
                //TODO: Map
            };
            FlowRateController.prototype.getFlowRateData = function () {
                var that = this;
                that.$scope.flowRateScope.pageLoadingFinished = false;
                //console.log("Loading started...", that.$scope.flowRateScope.pageLoadingFinished);
                that.ThingSpeakService.getThingSpeakData()
                    .done(function (response) {
                    that.$timeout(0).then(function () {
                        that.$scope.flowRateScope.maraRiverFlowRate = response;
                        //console.log("Feeds: ", that.$scope.flowRateScope.maraRiverFlowRate.feeds);
                        var mapCenter = [
                            that.$scope.flowRateScope.maraRiverFlowRate.channel.latitude.toString(),
                            that.$scope.flowRateScope.maraRiverFlowRate.channel.longitude.toString()
                        ];
                        that.$rootScope.$emit("map-center-updated", mapCenter);
                        that.$scope.flowRateScope.sensors.push(that.$scope.flowRateScope.maraRiverFlowRate.channel);
                        that.$rootScope.$emit("sensors-updated", that.$scope.flowRateScope.sensors);
                        that.$scope.flowRateScope.pageLoadingFinished = true;
                        //console.log("Page loaded", that.$scope.flowRateScope.pageLoadingFinished);
                    });
                })
                    .fail(function () {
                    console.log("Failed to get the JSON data");
                });
            };
            FlowRateController.prototype.getData = function () {
                var that = this;
                that.$scope.flowRateScope.pageLoadingFinished = false;
                console.log("Loading started...", that.$scope.flowRateScope.pageLoadingFinished);
                var deferred = $.Deferred();
                that.HttpService.get(ThingSpeak.Configs.AppConfig.ApiUrl)
                    .done(function (response) {
                    console.log("response.data", response.data);
                    that.$scope.flowRateScope.maraRiverFlowRate = response.data;
                    deferred.resolve(that.$scope.flowRateScope.maraRiverFlowRate);
                    console.log("maraRiverFlowRate: ", that.$scope.flowRateScope.maraRiverFlowRate);
                    var mapCenter = [
                        that.$scope.flowRateScope.maraRiverFlowRate.channel.latitude.toString(),
                        that.$scope.flowRateScope.maraRiverFlowRate.channel.longitude.toString()
                    ];
                    that.$rootScope.$emit("map-center-updated", mapCenter);
                    that.$scope.flowRateScope.sensors.push(that.$scope.flowRateScope.channel);
                    that.$rootScope.$emit("sensors-updated", that.$scope.flowRateScope.sensors);
                    that.$scope.flowRateScope.pageLoadingFinished = true;
                    console.log("Page loaded", that.$scope.flowRateScope.pageLoadingFinished);
                })
                    .fail(function (error) {
                    console.log("Failed to get the JSON data");
                    deferred.reject(error);
                });
                return deferred;
            };
            FlowRateController.prototype.selectFeed = function (feed) {
                var that = this;
                that.$scope.flowRateScope.selectedFeed = feed;
                console.log("Selected Feed: ", feed.entry_id);
            };
            FlowRateController.prototype.openReorderDialog = function () {
                var that = this;
                that.$scope.flowRateScope.reorderFeeds = angular.copy(that.$scope.flowRateScope.feeds);
                console.log("Reorder list: ", that.$scope.flowRateScope.reorderFeeds);
            };
            return FlowRateController;
        }());
        Controllers.FlowRateController = FlowRateController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Filters;
    (function (Filters) {
        "use strict";
        function TsRemoveStringFilter() {
            return function TsRemoveStringFilter(text) {
                if (text) {
                    var textArray = text.split('');
                    return textArray.map(function (txt) {
                        if (isNaN(parseInt(txt))) {
                            return txt;
                        }
                    });
                }
            };
        }
        Filters.TsRemoveStringFilter = TsRemoveStringFilter;
    })(Filters = ThingSpeak.Filters || (ThingSpeak.Filters = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Helpers;
    (function (Helpers) {
        var AppHelpers = (function () {
            function AppHelpers() {
            }
            AppHelpers.generateGUID = function () {
                var d = new Date().getTime();
                if (window.performance && typeof window.performance.now === "function") {
                    d += performance.now(); //use high-precision timer if available
                }
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            };
            AppHelpers.encryptPassword = function (password) {
                if (password) {
                    return password + new Date();
                }
                return password;
            };
            AppHelpers.arrayHasData = function (array) {
                if (array === undefined || array === null || array.length === undefined || array.length === null) {
                    return false;
                }
                else {
                    return true;
                }
            };
            return AppHelpers;
        }());
        Helpers.AppHelpers = AppHelpers;
    })(Helpers = ThingSpeak.Helpers || (ThingSpeak.Helpers = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Models;
    (function (Models) {
        "use strict";
    })(Models = ThingSpeak.Models || (ThingSpeak.Models = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Models;
    (function (Models) {
        "use strict";
    })(Models = ThingSpeak.Models || (ThingSpeak.Models = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Services;
    (function (Services) {
        var FirebaseService = (function () {
            function FirebaseService() {
                var that = this;
                that.init();
            }
            FirebaseService.prototype.init = function () {
                firebase.initializeApp(ThingSpeak.Configs.AppConfig.firebaseConfig);
            };
            FirebaseService.prototype.write = function (ref, data, identifier) {
                if (ref && data.id && identifier) {
                    //firebase.database().ref('users/' + data.id).set(data);
                    var dataRef = firebase.database().ref(ref + "/" + identifier);
                    dataRef.set(data);
                }
            };
            FirebaseService.prototype.read = function (ref, objId) {
                var userId = firebase.auth().currentUser.uid;
                return firebase.database().ref("/" + ref + "/" + objId).once('value').then(function (snapshot) {
                    var data = (snapshot.val() && snapshot.val().username) || 'Anonymous';
                    console.log("username: ", data);
                });
            };
            FirebaseService.prototype.update = function (ref, data) {
                if (ref && data.id) {
                    var dataRef = firebase.database().ref(ref + "/" + data.id);
                    dataRef.update(data);
                    //johnRef.update({
                    //    "number": 10
                    //});
                }
            };
            return FirebaseService;
        }());
        Services.FirebaseService = FirebaseService;
    })(Services = ThingSpeak.Services || (ThingSpeak.Services = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Services;
    (function (Services) {
        var ThingSpeakService = (function () {
            function ThingSpeakService(HttpService) {
                this.HttpService = HttpService;
                var that = this;
            }
            ThingSpeakService.prototype.getThingSpeakData = function () {
                var that = this;
                var deferred = $.Deferred();
                that.HttpService.get(ThingSpeak.Configs.AppConfig.ApiUrl)
                    .done(function (response) {
                    var maraRiverFlowRate = response.data;
                    deferred.resolve(maraRiverFlowRate);
                })
                    .fail(function (error) {
                    console.log("Failed to get the maraRiverFlowRate JSON data");
                    deferred.reject(error);
                });
                return deferred;
            };
            return ThingSpeakService;
        }());
        Services.ThingSpeakService = ThingSpeakService;
    })(Services = ThingSpeak.Services || (ThingSpeak.Services = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var Services;
    (function (Services) {
        var HttpService = (function () {
            function HttpService($http) {
                this.$http = $http;
                var that = this;
            }
            HttpService.prototype.get = function (url) {
                var that = this;
                var deferred = $.Deferred();
                that.$http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(function (successresponse) {
                    deferred.resolve(successresponse);
                }, function (errorResponse) {
                    deferred.reject(errorResponse);
                });
                return deferred;
            };
            return HttpService;
        }());
        Services.HttpService = HttpService;
    })(Services = ThingSpeak.Services || (ThingSpeak.Services = {}));
})(ThingSpeak || (ThingSpeak = {}));
var ThingSpeak;
(function (ThingSpeak) {
    var ViewModels;
    (function (ViewModels) {
        var userRole;
        (function (userRole) {
            userRole[userRole["admin"] = 1] = "admin";
            userRole[userRole["standard"] = 2] = "standard";
        })(userRole = ViewModels.userRole || (ViewModels.userRole = {}));
    })(ViewModels = ThingSpeak.ViewModels || (ThingSpeak.ViewModels = {}));
})(ThingSpeak || (ThingSpeak = {}));
//# sourceMappingURL=app.js.map
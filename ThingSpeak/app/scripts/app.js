var Flux;
(function (Flux) {
    var Configs;
    (function (Configs) {
        var AppConfig = (function () {
            function AppConfig() {
            }
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
            AppConfig.firebaseRefs = {
                sensors: "sensors",
                users: "users"
            };
            AppConfig.cookies = {
                userToken: "USERTOKEN",
                UserProfile: "USERPROFILE"
            };
            return AppConfig;
        }());
        Configs.AppConfig = AppConfig;
    })(Configs = Flux.Configs || (Flux.Configs = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Configs;
    (function (Configs) {
        var RouteConfig = (function () {
            function RouteConfig($routeProvider, $locationProvider) {
                $routeProvider
                    .when("/login", {
                    templateUrl: '/app/views/login.html',
                    controllerAs: 'LoginCtrl',
                    controller: 'LoginController',
                })
                    .when("/home", {
                    templateUrl: '/app/views/home.html',
                    controllerAs: 'HomeCtrl',
                    controller: 'HomeController',
                })
                    .when("/admin", {
                    templateUrl: '/app/views/admin.html',
                    controllerAs: 'AdminCtrl',
                    controller: 'AdminController',
                })
                    .when("/profile", {
                    templateUrl: '/app/views/profile.html',
                    controllerAs: 'ProfCtrl',
                    controller: 'ProfileController',
                })
                    .otherwise({
                    redirectTo: "/home",
                });
                $locationProvider.html5Mode(true);
            }
            return RouteConfig;
        }());
        Configs.RouteConfig = RouteConfig;
    })(Configs = Flux.Configs || (Flux.Configs = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Configs;
    (function (Configs) {
        var ThemeConfig = (function () {
            function ThemeConfig($mdThemingProvider, $mdIconProvider) {
                $mdThemingProvider.theme('default')
                    .primaryPalette('blue', {
                    'default': '600',
                    'hue-1': '500',
                    'hue-2': '800',
                    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                })
                    .accentPalette('deep-orange', {
                    'default': '700' // use shade 200 for default, and keep all other shades the same
                });
                // Enable browser color
                $mdThemingProvider.enableBrowserColor({
                    theme: 'default',
                    palette: 'primary',
                    hue: '700' // Default is '800'
                });
            }
            return ThemeConfig;
        }());
        Configs.ThemeConfig = ThemeConfig;
    })(Configs = Flux.Configs || (Flux.Configs = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var AdminController = (function () {
            function AdminController($scope, $location, FirebaseService, HttpService, $mdToast) {
                this.$scope = $scope;
                this.$location = $location;
                this.FirebaseService = FirebaseService;
                this.HttpService = HttpService;
                this.$mdToast = $mdToast;
                var that = this;
                that.init();
            }
            AdminController.prototype.init = function () {
                var that = this;
                that.$scope.adminScope = {};
                that.$scope.adminScope.selectedChannel = {};
                that.$scope.adminScope.newUser = {};
                that.$scope.adminScope.loggedInUser = {};
                that.$scope.adminScope.selectedUser = {};
                that.$scope.adminScope.allUsers = [];
                that.$scope.adminScope.sensors = [];
                that.$scope.adminScope.newSensor = {};
                that.$scope.adminScope.selectedSensor = {};
                that.$scope.adminScope.status = "";
                that.$scope.adminScope.view = "";
                that.$scope.adminScope.visiblePanel = "dashboard";
                //that.$scope.adminScope.view = "dashboard";
                that.$scope.adminScope.view = "'/app/views/templates/dashboard-template.html'";
                that.$scope.adminScope.userRoles = [
                    { role: "Administrator", value: Flux.ViewModels.UserRole.admin },
                    { role: "Manager", value: Flux.ViewModels.UserRole.manager },
                    { role: "Standard User", value: Flux.ViewModels.UserRole.standard }
                ];
                that.getSensors();
                that.getUsers();
                that.loadSampleChannel();
            };
            AdminController.prototype.goTo = function (route) {
                var that = this;
                that.$location.path(route);
            };
            AdminController.prototype.addUser = function (isValid) {
                var that = this;
                if (isValid) {
                    that.$scope.adminScope.newUser.id = Flux.Helpers.AppHelpers.generateGUID();
                    that.FirebaseService.write(Flux.Configs.AppConfig.firebaseRefs.users, that.$scope.adminScope.newUser)
                        .done(function (response) {
                        Flux.Helpers.AppHelpers.showToast("User added successfully", true, that.$mdToast);
                    })
                        .fail(function (error) {
                        Flux.Helpers.AppHelpers.showToast("There was an error adding new user", false, that.$mdToast);
                    });
                }
            };
            AdminController.prototype.checkUSer = function () {
                var that = this;
                that.FirebaseService.checkSignedInUser()
                    .done(function (user) {
                    if (user) {
                        that.$scope.adminScope.loggedInUser = user;
                        console.log("User", that.$scope.adminScope.loggedInUser);
                    }
                    else {
                        that.$location.path("login");
                    }
                })
                    .fail(function (error) {
                    console.log("There is  no logged in user");
                });
            };
            AdminController.prototype.getSensors = function () {
                var that = this;
                that.FirebaseService.readList("sensors")
                    .done(function (sensors) {
                    that.$scope.adminScope.sensors = sensors;
                })
                    .fail(function (error) {
                    console.warn("Error: ", error);
                });
            };
            AdminController.prototype.getUsers = function () {
                var that = this;
                that.FirebaseService.readList("users")
                    .done(function (users) {
                    that.$scope.adminScope.allUsers = users;
                })
                    .fail(function (error) {
                    console.error("Error: ", error);
                });
            };
            AdminController.prototype.selectUser = function (selectedUser) {
                var that = this;
                that.$scope.adminScope.selectedUser = selectedUser;
                console.log(selectedUser);
            };
            AdminController.prototype.updateUser = function (selectedUser) {
                var that = this;
                console.warn("Should update user!");
            };
            AdminController.prototype.updateSensor = function (selectedUser) {
                var that = this;
                console.warn("Should update sensor!");
            };
            AdminController.prototype.signOut = function () {
                console.log("Signing out");
                var that = this;
                that.FirebaseService.signOut()
                    .done(function (response) {
                    console.log(response);
                }).fail(function (error) {
                    console.log(error);
                }).always(function () {
                    that.$location.path("login");
                });
            };
            AdminController.prototype.displaySensorDetails = function (sensor) {
                var that = this;
                if (sensor) {
                    that.$scope.adminScope.selectedSensor = sensor;
                }
                else {
                    that.$scope.adminScope.selectedSensor = {};
                }
            };
            AdminController.prototype.addSensor = function (isValid) {
                var that = this;
                if (isValid) {
                    var newSensor = that.$scope.adminScope.newSensor;
                    newSensor.id = newSensor.name.replace(/\s/g, '') + '+' + Flux.Helpers.AppHelpers.generateGUID();
                    that.FirebaseService.write(Flux.Configs.AppConfig.firebaseRefs.sensors, that.$scope.adminScope.newSensor)
                        .done(function (response) {
                        Flux.Helpers.AppHelpers.showToast("Sensor added successfully", true, that.$mdToast);
                    })
                        .fail(function (error) {
                        Flux.Helpers.AppHelpers.showToast("There was an error adding new sensor", false, that.$mdToast);
                    });
                }
            };
            AdminController.prototype.loadSampleChannel = function () {
                var that = this;
                that.HttpService.get("app/scripts/sample-channel.json")
                    .done(function (response) {
                    that.$scope.adminScope.selectedChannel = response.data;
                    var selectedChannel = response.data;
                    google.charts.load('current', { packages: ['corechart', 'line'] });
                    var data = new google.visualization.DataTable();
                    data.addColumn('number', 'Timestamp');
                    data.addColumn('number', "Cumulative flow rate");
                    var rows = [];
                    selectedChannel.feeds.forEach(function (feed) {
                        rows.push([+feed.entry_id, +feed.field1]);
                    });
                    data.addRows(rows);
                    var options = {
                        chart: {
                            //title: selectedChannel.name,
                            //subtitle: selectedChannel.description
                            title: "Padawan v1",
                            subtitle: "Digitized Flow Meter"
                        },
                        hAxis: {
                            title: 'Date'
                        },
                        vAxis: {
                            title: "Cummulative Flow"
                        },
                    };
                    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
                    //chart.draw(data, options);
                    chart.draw(data, google.charts.Line.convertOptions(options));
                }).fail(function (error) {
                    console.error(error);
                });
            };
            return AdminController;
        }());
        Controllers.AdminController = AdminController;
    })(Controllers = Flux.Controllers || (Flux.Controllers = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
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
                that.HttpService.get(Flux.Configs.AppConfig.ApiUrl)
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
    })(Controllers = Flux.Controllers || (Flux.Controllers = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var HomeController = (function () {
            function HomeController($scope, $rootScope, $timeout, $location, $cookies, FirebaseService, MapService) {
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$timeout = $timeout;
                this.$location = $location;
                this.$cookies = $cookies;
                this.FirebaseService = FirebaseService;
                this.MapService = MapService;
                var that = this;
                that.init();
            }
            HomeController.prototype.init = function () {
                var that = this;
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
            };
            HomeController.prototype.goTo = function (route) {
                var that = this;
                that.$location.path(route);
            };
            HomeController.prototype.setCurrentLocation = function () {
                var that = this;
                that.$rootScope.$emit('set-current-location');
            };
            HomeController.prototype.checkUSer = function () {
                var that = this;
                that.FirebaseService.checkSignedInUser()
                    .done(function (user) {
                    if (user) {
                        that.$scope.homeScope.loggedInUser = user;
                        console.log("User", that.$scope.homeScope.loggedInUser);
                        that.getSensors();
                    }
                    else {
                        that.$location.path("login");
                    }
                }).fail(function (error) {
                    console.log("There is  no logged in user");
                });
            };
            HomeController.prototype.Signout = function () {
                console.log("Signing out");
                var that = this;
                that.FirebaseService.signOut()
                    .done(function (response) {
                    console.log(response);
                }).fail(function (error) {
                    console.log(error);
                }).always(function () {
                    that.$location.path("login");
                });
            };
            HomeController.prototype.getSensors = function () {
                var that = this;
                that.FirebaseService.readList("sensors")
                    .done(function (sensors) {
                    that.$scope.$apply(function () {
                        that.$scope.homeScope.sensors = sensors;
                    });
                }).fail(function (error) {
                    console.log("Error:", error);
                });
            };
            HomeController.prototype.getSensorDetails = function (sensorId) {
                var that = this;
                that.FirebaseService.read("sensors", sensorId)
                    .done(function (sensor) {
                    that.$scope.homeScope.selectedSensor = sensor;
                }).fail(function (error) {
                    console.log("Error:", error);
                });
            };
            HomeController.prototype.displaySensorDetails = function (sensor) {
                var that = this;
                if (sensor) {
                    that.$scope.homeScope.showSensorDetails = true;
                    that.$scope.homeScope.selectedSensor = sensor;
                    if (sensor.latitude && sensor.longitude) {
                        that.$rootScope.$emit('display-sensor-details', sensor);
                    }
                }
                else {
                    that.$scope.homeScope.showSensorDetails = false;
                    that.$scope.homeScope.selectedSensor = {};
                }
            };
            return HomeController;
        }());
        Controllers.HomeController = HomeController;
    })(Controllers = Flux.Controllers || (Flux.Controllers = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var LoginController = (function () {
            function LoginController($scope, $location, FirebaseService, $mdToast) {
                this.$scope = $scope;
                this.$location = $location;
                this.FirebaseService = FirebaseService;
                this.$mdToast = $mdToast;
                var that = this;
                that.init();
            }
            LoginController.prototype.init = function () {
                var that = this;
            };
            LoginController.prototype.login = function (email, password) {
                var that = this;
                if (email && password) {
                    that.FirebaseService.logIn(email, password)
                        .done(function (response) {
                        that.$location.path("home");
                        that.$scope.authScope.loggedInUser = response;
                    })
                        .fail(function (error) {
                        console.error("Login error: ", error);
                        Flux.Helpers.AppHelpers.showToast("We could not log you in at the moment. Please try again later", false, that.$mdToast);
                    });
                }
                else {
                    Flux.Helpers.AppHelpers.showToast("Username or password is missing", false, that.$mdToast);
                }
            };
            LoginController.prototype.SignIn = function () {
                var that = this;
                that.FirebaseService.googleSignin()
                    .done(function (response) {
                    that.$location.path("home");
                }).fail(function (error) {
                    console.log("Error:", error.message);
                });
            };
            LoginController.prototype.Signout = function () {
                var that = this;
                that.FirebaseService.signOut()
                    .done(function (response) {
                    console.log(response);
                }).fail(function (error) {
                    console.log(error);
                });
                that.$location.path("login");
            };
            return LoginController;
        }());
        Controllers.LoginController = LoginController;
    })(Controllers = Flux.Controllers || (Flux.Controllers = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var ProfileController = (function () {
            function ProfileController($scope) {
                this.$scope = $scope;
                var that = this;
                that.init();
            }
            ProfileController.prototype.init = function () {
                var that = this;
            };
            return ProfileController;
        }());
        Controllers.ProfileController = ProfileController;
    })(Controllers = Flux.Controllers || (Flux.Controllers = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Directives;
    (function (Directives) {
        "use strict";
        function init(scope, $timeout) {
            scope.equalWith = false;
        }
        function TsCompareWith($$rootScope) {
            var equalWithDirective = {
                restrict: 'AE',
                scope: {
                    equalWith: '=?equalWith',
                },
                link: function (scope, $elm, attr, ngModelCtrl) {
                    ngModelCtrl.$validators.equalWith =
                        function (modelValue) {
                            return (modelValue === scope.equalWith());
                        };
                    scope.$watch(scope.equalWith, function (value) {
                        ngModelCtrl.$validate();
                    });
                }
            };
            return equalWithDirective;
        }
        Directives.TsCompareWith = TsCompareWith;
    })(Directives = Flux.Directives || (Flux.Directives = {}));
})(Flux || (Flux = {}));
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
                    //console.log("Reverse output Address", scope.currentLocation);
                });
            })
                .fail(function (error) {
                //TODO: handle error
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
                        //console.log("Reverse output: ", scope.currentLocation);
                    });
                })
                    .fail(function (error) {
                    console.log("Failed to load user");
                });
            });
        }
        function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2 - lat1); // deg2rad below
            var dLon = deg2rad(lon2 - lon1);
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = R * c; // Distance in km
            return d;
        }
        function deg2rad(deg) {
            return deg * (Math.PI / 180);
        }
        function distance(lat1, lon1, lat2, lon2) {
            var p = 0.017453292519943295; // Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((lat2 - lat1) * p) / 2 +
                c(lat1 * p) * c(lat2 * p) *
                    (1 - c((lon2 - lon1) * p)) / 2;
            return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
        }
        function loadCurrentLocation(scope, $timeout) {
            //console.log("Setting current location..");
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
                    //console.log("Reverse output Address", scope.currentLocation);
                });
            })
                .fail(function (error) {
                //TODO: handle error
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
                    // Add circle overlay and bind to marker
                    //var circle = new google.maps.Circle({
                    //    map: scope.map,
                    //    radius: 500,
                    //    fillColor: '#AA0000'
                    //});
                    //circle.bindTo('center', scope.marker, 'position');
                    //scope.map.setZoom(9);
                    displaySensorList(scope, $timeout);
                    //console.log("Reverse output Address", scope.currentLocation);
                });
            })
                .fail(function (error) {
                //TODO: handle error
                console.log("Failed to get address details, ", error);
            });
        }
        // Sets the map on all markers in the array.
        function setMapOnAll(scope, map) {
            for (var i = 0; i < scope.markers.length; i++) {
                scope.markers[i].setMap(map);
            }
        }
        // Removes the markers from the map, but keeps them in the array.
        function clearMarkers(scope) {
            setMapOnAll(scope, null);
        }
        // Shows any markers currently in the array.
        function showMarkers(scope) {
            setMapOnAll(scope, scope.map);
        }
        // Deletes all markers in the array by removing references to them.
        function deleteMarkers(scope) {
            clearMarkers(scope);
            scope.markers = [];
        }
        function displaySensorList(scope, $timeout) {
            $timeout(0).then(function () {
                if (scope.sensors) {
                    clearAllMarkers(scope);
                    //Set map bounds
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
                        //scope.map.fitBounds(bounds);
                        var str = '<div style="box-shadow: 0px 0px 3px 0px rgba(240, 232, 232, 0.59); " > <div style="background- color:#00BCD4; width: 100 %; height: 80px; border: 0px solid transparent" > <h2>' + marker.getTitle() + '</h2></div > <div style="background- color:white; width: 100 %; height: 100px; border: 0px solid transparent; overflow: auto" > <p>' + marker.getLabel() + "aaaaa lot of other stuff " + '</p></div > </div>';
                        var infowindow = new google.maps.InfoWindow({
                            content: str
                        });
                        marker.addListener('click', function () {
                            //infowindow.open(scope.map, marker);
                            //$timeout(3).then(() => {
                            //    if (marker.getAnimation() !== null) {
                            //        marker.setAnimation(null);
                            //    } else {
                            //        marker.setAnimation(google.maps.Animation.BOUNCE);
                            //    }
                            //});
                            //displaySensor(sensor, scope, $timeout);
                            if (sensor) {
                                var sensorCoordinates = new google.maps.LatLng(sensor.lat, sensor.lon);
                                setDataOnMap(sensorCoordinates, scope, $timeout);
                            }
                        });
                        addMarkerWithTimeout(scope, marker, i * 20, $timeout);
                    }
                    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
                    var boundsListener = google.maps.event.addListener((scope.map), 'bounds_changed', function (event) {
                        //scope.map.setZoom(10);
                        console.log("Listener set and removed");
                        google.maps.event.removeListener(boundsListener);
                    });
                }
            });
        }
        function addMarkerWithTimeout(scope, marker, timeout, $timeout) {
            window.setTimeout(function () {
                //marker.setAnimation(google.maps.Animation.DROP)
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
                        //TODO: Load nearby sensors 
                    });
                    $rootScope.$on('set-current-location', function (event) {
                        loadCurrentLocation(scope, $timeout);
                        //TODO: Load nearby sensors 
                    });
                    $rootScope.$on('display-sensor-details', function (event, sensor) {
                        changeMarkerLocation(new google.maps.LatLng(sensor.lat, sensor.lon), scope, $timeout);
                        //TODO: Customize selected sensor
                        //1. Center map to selected sensor
                        //2. Animate selected sensor
                        //3. Change marker color to differentiate from the rest
                    });
                }
            };
            return mapDirective;
        }
        Directives.TsGoogleMap = TsGoogleMap;
    })(Directives = Flux.Directives || (Flux.Directives = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
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
    })(Filters = Flux.Filters || (Flux.Filters = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
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
            AppHelpers.showToast = function (message, truthy, $mdToast) {
                $mdToast.show($mdToast.simple()
                    .textContent(message)
                    .position('top right')
                    .hideDelay(3000)
                    .toastClass(truthy ? 'success' : 'error'));
            };
            return AppHelpers;
        }());
        Helpers.AppHelpers = AppHelpers;
    })(Helpers = Flux.Helpers || (Flux.Helpers = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Models;
    (function (Models) {
        "use strict";
    })(Models = Flux.Models || (Flux.Models = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Models;
    (function (Models) {
        "use strict";
    })(Models = Flux.Models || (Flux.Models = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Services;
    (function (Services) {
        var FirebaseService = (function () {
            function FirebaseService($cookies) {
                this.$cookies = $cookies;
                var that = this;
                that.init();
            }
            FirebaseService.prototype.init = function () {
                var that = this;
                firebase.initializeApp(Flux.Configs.AppConfig.firebaseConfig);
                firebase.auth().useDeviceLanguage();
                that.provider = new firebase.auth.GoogleAuthProvider();
                that.provider.setCustomParameters({
                    'login_hint': 'user@example.com'
                });
                that.loggedInUser = {};
            };
            FirebaseService.prototype.signUp = function (newUser) {
                var that = this;
                var deferred = $.Deferred();
                firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
                    .then(function (user) {
                    var loggedInUser = {
                        id: user.uid,
                        fullName: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber,
                        photoUrl: user.photoURL,
                        role: Flux.ViewModels.UserRole.standard
                    };
                    //Add user to Firebase DB
                    var isUserAdded = that.write(Flux.Configs.AppConfig.firebaseRefs.users, loggedInUser)
                        .done(function (response) {
                        console.log("New user: ", response);
                        return true;
                    })
                        .fail(function (error) {
                        console.log("Error: ", error);
                        return false;
                    });
                    console.log("isUserAdded: ", isUserAdded);
                    deferred.resolve(user);
                })
                    .catch(function (error) {
                    var errorMessage = "There was an error creating the new acccount. Kindly contact the owner";
                    if (error.code.match(/^(auth\/email-already-in-use| auth\/invalid-email| auth\/weak-password)$/)) {
                        errorMessage = error.message;
                    }
                    else if (error.code === "auth/operation-not-allowed") {
                        errorMessage = "Email sign up is not allowed";
                    }
                    deferred.reject(errorMessage);
                });
                return deferred;
            };
            FirebaseService.prototype.logIn = function (email, password) {
                var that = this;
                var deferred = $.Deferred();
                deferred.resolve("Denis Sigei");
                return deferred;
            };
            FirebaseService.prototype.signIn = function () {
                var that = this;
                var deferred = $.Deferred();
                //firebase.auth().signInWithRedirect(that.provider);
                //firebase.auth().getRedirectResult().then(function (result: any) {
                firebase.auth().signInWithPopup(that.provider)
                    .then(function (result) {
                    if (result.credential) {
                        var token = result.credential.accessToken;
                    }
                    var user = result.user;
                    deferred.resolve('Sign in was Succesfull');
                })
                    .catch(function (error) {
                    var errorOccured = {
                        errorCode: error.code,
                        errorMessage: error.message,
                        email: error.email,
                        credential: error.credential
                    };
                    deferred.reject(error);
                });
                return deferred;
            };
            FirebaseService.prototype.signOut = function () {
                var that = this;
                var deferred = $.Deferred();
                firebase.auth().signOut()
                    .then(function () {
                    deferred.resolve('Signout Succesfull');
                })
                    .catch(function (error) {
                    deferred.reject(error);
                });
                //that.$cookies.remove(Configs.AppConfig.cookies.userToken);
                //that.$cookies.remove(Configs.AppConfig.cookies.UserProfile);
                return deferred;
            };
            FirebaseService.prototype.checkSignedInUser = function () {
                var that = this;
                var deferred = $.Deferred();
                firebase.auth().onAuthStateChanged(function (user) {
                    if (user) {
                        var signedInUser = {
                            fullName: user.displayName,
                            email: user.email,
                            photoUrl: user.photoURL,
                            emailVerified: user.emailVerified,
                            id: user.uid,
                            token: user.getToken()
                        };
                        deferred.resolve(signedInUser);
                    }
                    else {
                        deferred.reject("There is no currently logged in user");
                    }
                });
                return deferred;
            };
            FirebaseService.prototype.updateUserProfile = function () {
                var user = firebase.auth().currentUser;
                var signedInUser = {
                    fullName: user.displayName,
                    email: user.email,
                    photoUrl: user.photoURL,
                    emailVerified: user.emailVerified,
                    id: user.uid
                };
            };
            FirebaseService.prototype.googleSignin = function () {
                var that = this;
                var deferred = $.Deferred();
                //firebase.auth().signInWithRedirect(that.provider);
                //firebase.auth().getRedirectResult().then(function (result: any) {
                firebase.auth().signInWithPopup(that.provider)
                    .then(function (result) {
                    var token = result.credential.accessToken;
                    var user = result.user;
                    that.loggedInUser = {
                        id: user.uid,
                        fullName: user.displayName,
                        email: user.email,
                        phone: user.phoneNumber,
                        photoUrl: user.photoURL,
                        role: Flux.ViewModels.UserRole.standard
                    };
                    //that.$cookies.put(Configs.AppConfig.cookies.userToken, token);
                    //that.$cookies.putObject(Configs.AppConfig.cookies.UserProfile, that.loggedInUser);
                    //Add user to Firebase DB
                    that.write(Flux.Configs.AppConfig.firebaseRefs.users, that.loggedInUser)
                        .done(function (response) {
                        console.log(response);
                    })
                        .fail(function (error) {
                        console.log(error);
                    });
                    deferred.resolve("User logged in successfuly");
                })
                    .catch(function (error) {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    deferred.reject(error.message);
                });
                return deferred;
            };
            FirebaseService.prototype.write = function (ref, data) {
                var that = this;
                var deferred = $.Deferred();
                if (ref && data.id) {
                    firebase.database().ref(ref + '/' + data.id).set(data).then(function () {
                        deferred.resolve("Data added successfuly");
                    });
                }
                else {
                    deferred.reject("An error occured adding the new data!");
                }
                return deferred;
            };
            FirebaseService.prototype.read = function (ObjectRef, objId) {
                var that = this;
                var deferred = $.Deferred();
                var refPath = objId ? "/" + ObjectRef + "/" + objId : "/" + ObjectRef;
                var ref = firebase.database().ref(refPath);
                ref.on("value", function (snapshot) {
                    deferred.resolve(snapshot.val());
                }, function (error) {
                    deferred.reject(error.code);
                });
                return deferred;
            };
            FirebaseService.prototype.readList = function (ObjectRef) {
                var that = this;
                var deferred = $.Deferred();
                var ref = firebase.database().ref("/" + ObjectRef);
                ref.on("value", function (snapshot) {
                    var array = [];
                    snapshot.forEach(function (childSnapshot) {
                        array.push(childSnapshot.val());
                    });
                    deferred.resolve(array);
                }, function (error) {
                    deferred.reject(error.code);
                });
                return deferred;
            };
            FirebaseService.prototype.snapshotToArray = function (snapshot) {
                var returnArr = [];
                snapshot.forEach(function (childSnapshot) {
                    returnArr.push(childSnapshot.val());
                });
                return returnArr;
            };
            FirebaseService.prototype.read_old = function (ref, objId) {
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
                }
            };
            return FirebaseService;
        }());
        Services.FirebaseService = FirebaseService;
    })(Services = Flux.Services || (Flux.Services = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
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
    })(Services = Flux.Services || (Flux.Services = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Services;
    (function (Services) {
        var MapService = (function () {
            function MapService($rootScope) {
                this.$rootScope = $rootScope;
                var that = this;
            }
            MapService.prototype.getUserLocation = function () {
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
            };
            MapService.prototype.intitializeGoogleMapsAutoComplete = function () {
                var that = this;
                var searchInput = $("#googleMapAutocompleteBox")[0];
                var googleMapAutoComplete = new google.maps.places.Autocomplete(searchInput);
                googleMapAutoComplete.addListener('place_changed', function (e) {
                    var place = googleMapAutoComplete.getPlace();
                    that.$rootScope.$emit('auto-complete-location-changed', place);
                });
            };
            return MapService;
        }());
        Services.MapService = MapService;
    })(Services = Flux.Services || (Flux.Services = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var Services;
    (function (Services) {
        var ThingSpeakService = (function () {
            function ThingSpeakService(HttpService, FirebaseService) {
                this.HttpService = HttpService;
                this.FirebaseService = FirebaseService;
                var that = this;
            }
            ThingSpeakService.prototype.getThingSpeakData = function () {
                var that = this;
                var deferred = $.Deferred();
                that.HttpService.get(Flux.Configs.AppConfig.ApiUrl)
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
            ThingSpeakService.prototype.getAllSensors = function () {
                var that = this;
                var deferred = $.Deferred();
                that.FirebaseService.readList("sensors")
                    .done(function (sensors) {
                    deferred.resolve(sensors);
                }).fail(function (error) {
                    deferred.reject(error);
                });
                return deferred;
            };
            ThingSpeakService.prototype.getSensor = function (sensorId) {
                var that = this;
                var deferred = $.Deferred();
                that.FirebaseService.read("sensors", sensorId)
                    .done(function (sensor) {
                    deferred.resolve(sensor);
                }).fail(function (error) {
                    deferred.reject(error);
                });
                return deferred;
            };
            return ThingSpeakService;
        }());
        Services.ThingSpeakService = ThingSpeakService;
    })(Services = Flux.Services || (Flux.Services = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    var ViewModels;
    (function (ViewModels) {
        (function (UserRole) {
            UserRole[UserRole["admin"] = 1] = "admin";
            UserRole[UserRole["manager"] = 2] = "manager";
            UserRole[UserRole["standard"] = 3] = "standard";
        })(ViewModels.UserRole || (ViewModels.UserRole = {}));
        var UserRole = ViewModels.UserRole;
    })(ViewModels = Flux.ViewModels || (Flux.ViewModels = {}));
})(Flux || (Flux = {}));
var Flux;
(function (Flux) {
    "use strict";
    var AppModule = (function () {
        function AppModule() {
            // module
            var ngFlux = angular.module("ngFlux", ["ngRoute", "ngMaterial", "ngMessages", "ngAnimate", "ui.bootstrap", "ngCookies", "firebase"]);
            // configs
            ngFlux.config([Flux.Configs.AppConfig]);
            ngFlux.config(["$routeProvider", "$locationProvider", Flux.Configs.RouteConfig]);
            ngFlux.config(["$mdThemingProvider", "$mdIconProvider", Flux.Configs.ThemeConfig]);
            //Directives
            ngFlux.directive("tsGoogleMap", ["$timeout", "$log", "$rootScope", "HttpService", Flux.Directives.TsGoogleMap]);
            //Filters
            ngFlux.filter("TsRemoveStringFilter", Flux.Filters.TsRemoveStringFilter);
            // services
            ngFlux.service("HttpService", ["$http", Flux.Services.HttpService]);
            ngFlux.service("MapService", ["$rootScope", Flux.Services.MapService]);
            ngFlux.service("ThingSpeakService", ["HttpService", "FirebaseService", Flux.Services.ThingSpeakService]);
            ngFlux.service("FirebaseService", ["$cookies", Flux.Services.FirebaseService]);
            // controllers
            ngFlux.controller("LoginController", ["$scope", "$location", "FirebaseService", "$mdToast", Flux.Controllers.LoginController]);
            ngFlux.controller("HomeController", ["$scope", "$rootScope", "$timeout", "$location", "$cookies", "FirebaseService", "MapService", Flux.Controllers.HomeController]);
            ngFlux.controller("AdminController", ["$scope", "$location", "FirebaseService", "HttpService", "$mdToast", Flux.Controllers.AdminController]);
            ngFlux.controller("FlowRateController", ["$scope", "$rootScope", "$location", "HttpService", "ThingSpeakService", "$timeout", Flux.Controllers.FlowRateController]);
            ngFlux.controller("ProfileController", ["$scope", Flux.Controllers.ProfileController]);
            // bootstrap the app when everything has been loaded
            angular.element(document).ready(function () {
                angular.bootstrap(document, ["ngFlux"]);
            });
        }
        return AppModule;
    }());
    Flux.AppModule = AppModule;
})(Flux || (Flux = {}));
//# sourceMappingURL=app.js.map
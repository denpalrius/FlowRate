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
                that.$scope.homeScope.userAddress = "";
                that.$scope.homeScope.showSensorDetails = false;
                that.$scope.homeScope.isLeftPanelVisible = true;
                that.$scope.homeScope.areSensorsLoading = true;
                that.checkUSer();
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
                    that.$scope.homeScope.sensors = sensors;
                })
                    .fail(function (error) {
                    console.log("Error: ", error);
                })
                    .always(function () {
                    that.MapService.intitializeGoogleMapsAutoComplete('googleMapAutoComplete-mobile');
                    that.MapService.intitializeGoogleMapsAutoComplete('googleMapAutoComplete-pc');
                    that.$scope.homeScope.areSensorsLoading = false;
                    that.$scope.$apply();
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

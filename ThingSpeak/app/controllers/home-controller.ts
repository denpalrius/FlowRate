module Flux.Controllers {
    "use strict";

    interface ICurrentScope {
        loggedInUser?: ViewModels.iUser;
        currentLocation?: string;
        userAddress?: string;
        mapCenter?: string;
        googleMapsUrl?: string;
        sensors?: ViewModels.iSensor[];
        selectedSensor?: ViewModels.iSensor;
        mapEnable?: boolean;
        showSensorDetails?: boolean;
        userLocation?: google.maps.LatLng;
        googleMapAutoComplete?: google.maps.places.Autocomplete;
        isLeftPanelVisible?: boolean;
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
            that.$scope.homeScope.isLeftPanelVisible = true;

            that.checkUSer();

            //that.MapService.intitializeGoogleMapsAutoComplete("#googleMapAutocompleteBoxPc");
            that.intitializeGoogleMapsAutoComplete();
        }

        private goTo(route: string) {
            var that: HomeController = this;

            that.$location.path(route);
        }

        private setCurrentLocation() {
            var that: HomeController = this;
            that.$rootScope.$emit('set-current-location');
        }


        private intitializeGoogleMapsAutoComplete() {
            var that: HomeController = this;

            var searchInput:any = document.getElementById('googleMapAutocomplete');

            console.log('#googleMapAutocomplete controller', searchInput);

            if (searchInput) {
                var googleMapAutoComplete = new google.maps.places.Autocomplete(searchInput);

                googleMapAutoComplete.addListener('place_changed', (e: google.maps.MouseEvent) => {
                    var place = googleMapAutoComplete.getPlace();
                    that.$rootScope.$emit('auto-complete-location-changed', place);
                });
            }
        }

        private checkUSer() {
            var that: HomeController = this;
            that.FirebaseService.checkSignedInUser()
                .done((user: any) => {
                    if (user) {
                        that.$scope.homeScope.loggedInUser = user;

                        //console.log("User", that.$scope.homeScope.loggedInUser );

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
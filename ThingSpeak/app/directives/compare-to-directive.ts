module ThingSpeak.Directives {
    "use strict";

    interface IScope extends ng.IScope {
        equalWith?: any;
    }
    
    function init(scope: IScope, $timeout: ng.ITimeoutService) {
        scope.types = "['establishment']";
        scope.infoWindow = new google.maps.InfoWindow;
        scope.markers = [];
        scope.geocoder = new google.maps.Geocoder;
        scope.showSensorsDetails = false;

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

        var mapOptions: google.maps.MapOptions = {
            zoomControl: true,
            panControl: false,
            draggable: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP,
                style: google.maps.ZoomControlStyle.DEFAULT
            },
            scaleControl: true,
            rotateControl: true,
            center: scope.userLocation,
            zoom: 17
            //styles: mapStyles
        }

        scope.map = new google.maps.Map($("#locationMap")[0], mapOptions);
        scope.marker = new google.maps.Marker({
            position: scope.userLocation,
            map: scope.map,
            title: 'User Location'
        });
    }

    export function TsCompareWith($$rootScope: ng.IRootScopeService): ng.IDirective {
        let ddo: ng.IDirective = {
            restrict: 'AE',
            scope: {
                currentLocation: '=?currentLocation',
                sensors: '=?sensors',
                //    "@"   (Text binding / one - way binding )
                //    "="   (Direct model binding / two - way binding )
                //    "&"   (Behaviour binding / Method binding  )
            },
            template: '<div class="mapcanvas" id="locationMap" style="z-index:0"></div>',
            link: function (scope: IScope, $elm: Object, attr, ngModelCtrl) {

                ngModelCtrl.$validators.equalWith =
                    function (modelValue) {
                        return (modelValue === scope.equalWith())
                    }
                scope.$watch(scope.equalWith, function (value) {
                    ctrl.$validate()
                })
            }
        };

        return ddo;
    }
}
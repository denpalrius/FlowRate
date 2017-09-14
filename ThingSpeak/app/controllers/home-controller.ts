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
        sensorLocation?: {
            latitude: number;
            longitude: number;
        };

        mapEnable?: boolean;
        displayLabel?: string;
        nums?: AgendaVM[];
        nums2?: AgendaVM[];
        agendaItems?: AgendaVM[];
    }

    interface IHomeScope extends ng.IScope {
        homeScope?: ICurrentScope;
    }
    export interface AgendaVM {
        id?: string;
        meetingId?: string;
        name?: string;
        description?: string;
        position?: string;
        owner?: string;
        duration?: number;
        createdBy?: string;
        createdDate?: Date;
        presenter?: string;
        notes?: any;
        attachments?:any;
        links?:any;

        // ui components
        isSequentialUpload?: boolean;
        isShowDropZone?: boolean;
        isDropFile?: boolean;
        isShowUploadedFiles?: boolean;
        tempUploadedFiles?: any;
        currentUploadedFiles?: any;
        isAddSubItem?: boolean;
        isShowAgendaDetails?: boolean;
        isShowContext?: boolean;
        isKeepContextOpen?: boolean;
        isNotNumberedItem?: boolean;
        isAddSingleAgendaItem?: boolean;
        isAddSeveralAgendaItems?: boolean;
        isShowAddMoreAgendaInfo?: boolean;
        isShowEditMoreAgendaInfo?: boolean;
        isPopOverOpen?: boolean;
        isDeleteAgenda?: boolean;
        isEditAgenda?: boolean;
        isMoved?: boolean;
        isSelected?: boolean;
    }
    export class HomeController {
        constructor(
            private $scope: IHomeScope,
            private $rootScope: ng.IRootScopeService,
            private $state: angular.ui.IStateService
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

            that.$rootScope.$on('map-center-loaded', (event, data) => {
                that.$scope.homeScope.sensorLocation = data;

                console.log("Map Center: ", data);
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
                "title": "Map",
                "color": "#303030",
                "rotate": 0,
                "show": 0,
                "titleColor": "#fff",
                "icon": { "color": "#fff", "name": "fa fa-map", "size": 20 }
            },{
                "title": "About",
                "color": "#212121",
                "rotate": 0,
                "show": 0,
                "titleColor": "#fff",
                "icon": { "color": "#fff", "name": "fa fa-info", "size": 25 }
            },{
                "title": "Admin",
                "color": "#000000",
                "rotate": 0,
                "show": 0,
                "titleColor": "#fff",
                "icon": { "color": "#fff", "name": "fa fa-sliders", "size": 20 }
            } ];
        }

        private onWingClick(wing:any) {
            var that: HomeController = this;
            that.$state.go(wing.title);
        }
        
        private loadMap() {
            var that: HomeController = this;
            that.$scope.homeScope.googleMapsUrl = Configs.AppConfig.googleMapsUrl;

            if (typeof google == "undefined") {
                that.$scope.homeScope.mapEnable = false;
                console.warn("Map cannot show");
            } else {
                that.$scope.homeScope.mapEnable = true;
                console.log("Map displaying");
            }
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

            that.$scope.homeScope.map = {
                center: {
                    latitude: 1.2921,
                    longitude: 36.8219
                },
                zoom: 3,
                options: {
                    styles: customMapStyle,
                    streetViewControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    rotateControl: false,
                    zoomControl: false
                },
                bounds: {
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
        }
    }
}
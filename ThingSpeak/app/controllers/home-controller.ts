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
            private $state: angular.ui.IStateService) {

            var that: HomeController = this;
            that.init();
        }

        private init() {
            var that: HomeController = this;

            that.$scope.homeScope = {};
            that.$scope.homeScope.pageTitle = "Agenda Reordering";
            that.$scope.homeScope.displayLabel = "";

            that.fillMenu();
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
    }
}
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
            
            //var nums = [
            //    '1.1.1',
            //    '10.2.3',
            //    '2..6.7',
            //    '21.10.4',
            //    '3.10.12',
            //    '3.10..12',
            //    '4.112.5',
            //    '4.112.16',
            //    '6.4.23'
            //];

            //that.goDoStuff((agendas) as any);
            //that.sortAgendaItems(agendas as any);

            that.$scope.homeScope.nums2 = that.$scope.homeScope.agendaItems.sort(that.sortAgendasUpdated);

            that.$scope.homeScope.nums2.forEach((num) => {
                console.log(num);
            });
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

        private goDoStuff(agendas:AgendaVM[]) {
            var that: HomeController = this;

            var sortedagendas = agendas.sort((a, b) => {
                var nums1 = a.position.split(".");
                var nums2 = b.position.split(".");

                for (var i = 0; i < nums1.length; i++) {
                    if (nums2[i]) {
                        if (nums1[i] !== nums2[i]) {
                            return parseInt(nums1[i]) - parseInt(nums2[i]);
                        }//else continue
                    } else {
                        return 1;//no second number in b
                    }
                }
                //return parseInt(nums1[]) + parseInt(nums2[i]);
            });

            that.$scope.homeScope.nums = sortedagendas;
        }

        private compare(a:any, b:any) {
            var aSplit = a.split(".");
            var bSplit = b.split(".");


            var length = Math.min(aSplit.length, bSplit.length);
            for (var i = 0; i < length; ++i) {
                if (parseInt(aSplit[i]) < parseInt(bSplit[i])) {
                    return -1;
                } else if (parseInt(aSplit[i]) > parseInt(bSplit[i])) {
                    return 1;
                }
            }

            if (aSplit.length < bSplit.length) {
                return -1;
            } else if (aSplit.length > bSplit.length) {
                return 1;
            }

            return 0;
        }

        private sortAgendas(a:any,b:any) {
                var nums1 = a.position.split(".");
                var nums2 = b.position.split(".");

                for (var i = 0; i < nums1.length; i++) {
                    if (nums2[i]) {
                        if (nums1[i] !== nums2[i]) {
                            return parseInt(nums1[i]) - parseInt(nums2[i]);
                        }//else continue
                    } else {
                        return 1;//no second number in b
                    }
                }
                //return parseInt(nums1[]) + parseInt(nums2[i]);
        
        }

        private sortAgendasUpdated(a:AgendaVM, b:AgendaVM) {
            var nums1 = a.position.split(".");
            var nums2 = b.position.split(".");

            for (var i = 0; i < nums1.length; i++) {
                if (nums2[i]) {
                    if (nums1[i] !== nums2[i]) {
                        return parseInt(nums1[i]) - parseInt(nums2[i]);
                    }//else continue
                } else {
                    return 1;//no second number in b
                }
            }
        }

        private sortAgendaItems(nums: AgendaVM[]) {
            var that: HomeController = this;

            that.$scope.homeScope.nums2 = nums.map(a => a.position.split('.').map(n => +n + 100000).join('.')).sort()
                .map(a => a .split('.').map(n => +n - 100000).join('.'));
        }

        private onWingClick(wing:any) {
            var that: HomeController = this;
            that.$state.go(wing.title);
        }
    }
}
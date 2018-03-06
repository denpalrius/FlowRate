module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        sensors?: ViewModels.iSensor[];
        newSensor?: ViewModels.iSensor;
        currentNavItem?: string;
        status?: string;

    }

    interface IAdminScope extends ng.IScope {
        adminScope?: ICurrentScope;
    }

    export class AdminController {
        constructor(
            private $scope: IAdminScope,
            private FirebaseService: Services.FirebaseService) {

            var that: AdminController = this;
            that.init();
        }

        private init() {
            var that: AdminController = this;

            that.$scope.adminScope = {};
            that.$scope.adminScope.currentNavItem = "page1";
            that.$scope.adminScope.status = "";
        }

        private openMenu($mdMenu: any, ev: any) {

        }

    }
}
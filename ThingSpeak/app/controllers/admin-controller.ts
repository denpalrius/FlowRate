module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        sensors?: ViewModels.iSensor[];
        newSensor?: ViewModels.iSensor;
        newUser?: ViewModels.iUser;
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
            that.$scope.adminScope.newUser = {};
            that.$scope.adminScope.status = "";
        }

        private addUser(isValid: boolean) {
            var that: AdminController = this;

            if (isValid){
                console.log("New user: ", that.$scope.adminScope.newUser);
            }
        }

        private openMenu($mdMenu: any, ev: any) {

        }

    }
}
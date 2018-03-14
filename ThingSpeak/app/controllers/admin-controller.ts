module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        sensors?: ViewModels.iSensor[];
        newSensor?: ViewModels.iSensor;
        newUser?: ViewModels.iUser;
        currentNavItem?: string;
        status?: string;
        userRoles?: ViewModels.iUserRole[];
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
            that.$scope.adminScope.userRoles = [
                { role: "Administrator", value: ViewModels.UserRole.admin },
                { role: "Manager", value: ViewModels.UserRole.manager },
                { role: "Standard User", value: ViewModels.UserRole.standard }
            ];
        }

        private addUser(isValid: boolean) {
            var that: AdminController = this;

            if (isValid){
                console.log("New user: ", that.$scope.adminScope.newUser);
            }
        }

        private doPasswordsMatch(password: any, confirmPassword: any) {
            console.log("password: ", password);
            console.log("confirmPassword: ", confirmPassword);

            return password === confirmPassword;
        }
    }
}
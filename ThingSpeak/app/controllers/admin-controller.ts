module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        sensors?: ViewModels.iSensor[];
        newSensor?: ViewModels.iSensor;
        newUser?: ViewModels.newUser;
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
            private $location: ng.ILocationService,
            private FirebaseService: Services.FirebaseService,
            private $mdToast: any) {

            var that: AdminController = this;
            that.init();
        }

        private init() {
            var that: AdminController = this;

            that.$scope.adminScope = {};
            that.$scope.adminScope.newUser = {};
            that.$scope.adminScope.newSensor = {};
            that.$scope.adminScope.status = "";
            that.$scope.adminScope.userRoles = [
                { role: "Administrator", value: ViewModels.UserRole.admin },
                { role: "Manager", value: ViewModels.UserRole.manager },
                { role: "Standard User", value: ViewModels.UserRole.standard }
            ];
        }

        private addUser(isValid: boolean) {
            var that: AdminController = this;

            if (isValid) {
                that.$scope.adminScope.newUser.id = Helpers.AppHelpers.generateGUID();
                that.FirebaseService.write(Configs.AppConfig.firebaseRefs.users, that.$scope.adminScope.newUser)
                    .done((response: any) => {
                        Helpers.AppHelpers.showToast("User added successfully", true, that.$mdToast);
                    })
                    .fail((error: any) => {
                        Helpers.AppHelpers.showToast("There was an error adding new user", false, that.$mdToast);
                    });
            }
        }

        private checkUSer() {
            var that: AdminController = this;
            that.FirebaseService.checkSignedInUser()
                .done((user: any) => {
                    if (user) {
                        that.$scope.homeScope.loggedInUser = user;

                        console.log("User", that.$scope.homeScope.loggedInUser);
                    } else {
                        that.$location.path("login");
                    }
                }).fail((error: any) => {
                    console.log("There is  no logged in user");
                });
        }

        private signOut() {
            console.log("Signing out");

            var that: AdminController = this;
            that.FirebaseService.signOut()
                .done((response: any) => {
                    console.log(response);
                }).fail((error: any) => {
                    console.log(error);
                }).always(() => {
                    that.$location.path("login");
                });
        }

        private isAlphaNumeric(str:any) {
            var code, i, len;

            for (i = 0, len = str.length; i < len; i++) {
                code = str.charCodeAt(i);
                if (!(code > 47 && code < 58) && // numeric (0-9)
                    !(code > 64 && code < 91) && // upper alpha (A-Z)
                    !(code > 96 && code < 123)) { // lower alpha (a-z)
                    return false;
                }
            }
            return true;
        }

        private addSensor(isValid: boolean) {
            var that: AdminController = this;

            if (isValid) {
                var newSensor = that.$scope.adminScope.newSensor;
                newSensor.id = newSensor.name.replace(/\s/g, '') + '+' + Helpers.AppHelpers.generateGUID();

                that.FirebaseService.write(Configs.AppConfig.firebaseRefs.sensors, that.$scope.adminScope.newSensor)
                    .done((response: any) => {
                        Helpers.AppHelpers.showToast("Sensor added successfully", true, that.$mdToast);
                    })
                    .fail((error: any) => {
                        Helpers.AppHelpers.showToast("There was an error adding new sensor", false, that.$mdToast);
                    });
            }
        }
    }
}
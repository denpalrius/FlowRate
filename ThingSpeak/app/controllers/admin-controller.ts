module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        sensors?: ViewModels.iSensor[];
        newSensor?: ViewModels.iSensor;
        newUser?: ViewModels.newUser;
        selectedUser?: ViewModels.iUser;
        allUsers?: ViewModels.iUser[];
        currentNavItem?: string;
        selectedSensor?: ViewModels.iSensor;
        status?: string;
        view?: string;
        visiblePanel?: string;
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
            that.$scope.adminScope.selectedUser = {};
            that.$scope.adminScope.allUsers = [];
            that.$scope.adminScope.sensors = [];
            that.$scope.adminScope.newSensor = {};
            that.$scope.adminScope.selectedSensor = {};
            that.$scope.adminScope.status = "";
            that.$scope.adminScope.view = "";
            that.$scope.adminScope.visiblePanel = "dashboard";
            //that.$scope.adminScope.view = "dashboard";
            that.$scope.adminScope.view = "'/app/views/templates/dashboard-template.html'";
            that.$scope.adminScope.userRoles = [
                { role: "Administrator", value: ViewModels.UserRole.admin },
                { role: "Manager", value: ViewModels.UserRole.manager },
                { role: "Standard User", value: ViewModels.UserRole.standard }
            ];

            that.getSensors();
            that.getUsers();
        }

        private goTo(route: string) {
            var that: AdminController = this;

            that.$location.path(route);
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
                })
                .fail((error: any) => {
                    console.log("There is  no logged in user");
                });
        }

        private getSensors() {
            var that: AdminController = this;
            that.FirebaseService.readList("sensors")
                .done((sensors: ViewModels.iSensor[]) => {
                    that.$scope.adminScope.sensors = sensors;
                })
                .fail((error: any) => {
                    console.warn("Error: ", error);
                });
        }

        private getUsers() {
            var that: AdminController = this;
            that.FirebaseService.readList("users")
                .done((users: ViewModels.iUser[]) => {
                    that.$scope.adminScope.allUsers = users;
                })
                .fail((error: any) => {
                    console.error("Error: ", error);
                });
        }

        private selectUser(selectedUser: ViewModels.iUser) {
            var that: AdminController = this;
            that.$scope.adminScope.selectedUser = selectedUser;
            console.log(selectedUser);
        }

        private updateUser(selectedUser: ViewModels.iUser) {
            var that: AdminController = this;

            console.warn("Should update user!");
        }

        private updateSensor(selectedUser: ViewModels.iUser) {
            var that: AdminController = this;

            console.warn("Should update sensor!");
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

        private displaySensorDetails(sensor: ViewModels.iSensor) {
            var that: AdminController = this;

            if (sensor) {
                that.$scope.adminScope.selectedSensor = sensor;

            }
            else {
                that.$scope.adminScope.selectedSensor = {}
            }
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
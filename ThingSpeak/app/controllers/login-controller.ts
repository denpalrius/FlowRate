module Flux.Controllers {
    "use strict";

    interface ICurrentScope {
        loggedinUser?: any;
    }

    interface ILoginScope extends ng.IScope {
        loginScope?: ICurrentScope;
    }

    export class LoginController {
        constructor(
            private $scope: ILoginScope,
            private $location: ng.ILocationService,
            private FirebaseService: Services.FirebaseService,
            private $mdToast: any) {

            var that: LoginController = this;
            that.init();
        }

        private init() {
            var that: LoginController = this;
        }

        private login(email: string, password: string) {
            var that: LoginController = this;
            if (email && password) {
                that.FirebaseService.logIn(email, password)
                    .done((response: any) => {
                        that.$location.path("home");
                        that.$scope.authScope.loggedInUser = response;
                    })
                    .fail((error: any) => {
                        console.error("Login error: ", error);
                        Helpers.AppHelpers.showToast("We could not log you in at the moment. Please try again later", false, that.$mdToast);
                    });
            }
            else {
                Helpers.AppHelpers.showToast("Username or password is missing", false, that.$mdToast);
            }
        }

        private SignIn() {
            var that: LoginController = this;

            that.FirebaseService.googleSignin()
                .done((response: any) => {
                    that.$location.path("home");
                }).fail((error: any) => {
                    console.log("Error:", error.message);
                });
        }

        private Signout() {
            var that: LoginController = this;
            that.FirebaseService.signOut()
                .done((response: any) => {
                    console.log(response);
                }).fail((error: any) => {
                    console.log(error);
                });

            that.$location.path("login");
        }

    }
}
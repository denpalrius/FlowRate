module ThingSpeak.Controllers {
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
            private FirebaseService: Services.FirebaseService) {

            var that: LoginController = this;
            that.init();
        }

        private init() {
            var that: LoginController = this;

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
            that.FirebaseService.googleSignout()
                .done((response: any) => {
                    console.log(response);
                }).fail((error: any) => {
                    console.log(error);
                });

            that.$location.path("login");
        }
    }
}
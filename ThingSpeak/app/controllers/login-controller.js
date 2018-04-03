var Flux;
(function (Flux) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var LoginController = (function () {
            function LoginController($scope, $location, FirebaseService, $mdToast) {
                this.$scope = $scope;
                this.$location = $location;
                this.FirebaseService = FirebaseService;
                this.$mdToast = $mdToast;
                var that = this;
                that.init();
            }
            LoginController.prototype.init = function () {
                var that = this;
            };
            LoginController.prototype.login = function (email, password) {
                var that = this;
                if (email && password) {
                    that.FirebaseService.logIn(email, password)
                        .done(function (response) {
                        that.$location.path("home");
                        that.$scope.authScope.loggedInUser = response;
                    })
                        .fail(function (error) {
                        console.error("Login error: ", error);
                        Flux.Helpers.AppHelpers.showToast("We could not log you in at the moment. Please try again later", false, that.$mdToast);
                    });
                }
                else {
                    Flux.Helpers.AppHelpers.showToast("Username or password is missing", false, that.$mdToast);
                }
            };
            LoginController.prototype.SignIn = function () {
                var that = this;
                that.FirebaseService.googleSignin()
                    .done(function (response) {
                    that.$location.path("home");
                }).fail(function (error) {
                    console.log("Error:", error.message);
                });
            };
            LoginController.prototype.Signout = function () {
                var that = this;
                that.FirebaseService.signOut()
                    .done(function (response) {
                    console.log(response);
                }).fail(function (error) {
                    console.log(error);
                });
                that.$location.path("login");
            };
            return LoginController;
        }());
        Controllers.LoginController = LoginController;
    })(Controllers = Flux.Controllers || (Flux.Controllers = {}));
})(Flux || (Flux = {}));

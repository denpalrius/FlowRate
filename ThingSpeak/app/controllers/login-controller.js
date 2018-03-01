var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var LoginController = (function () {
            function LoginController($scope, $location, FirebaseService) {
                this.$scope = $scope;
                this.$location = $location;
                this.FirebaseService = FirebaseService;
                var that = this;
                that.init();
            }
            LoginController.prototype.init = function () {
                var that = this;
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
                that.FirebaseService.googleSignout()
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
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));

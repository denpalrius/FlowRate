var ThingSpeak;
(function (ThingSpeak) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var AdminController = (function () {
            function AdminController($scope, FirebaseService) {
                this.$scope = $scope;
                this.FirebaseService = FirebaseService;
                this.goto = function (tab) {
                    var that = this;
                    that.$scope.adminScope.status = "Goto " + tab;
                };
                var that = this;
                that.init();
            }
            AdminController.prototype.init = function () {
                var that = this;
                that.$scope.adminScope = {};
                that.$scope.adminScope.currentNavItem = "page1";
                that.$scope.adminScope.status = "";
            };
            return AdminController;
        }());
        Controllers.AdminController = AdminController;
    })(Controllers = ThingSpeak.Controllers || (ThingSpeak.Controllers = {}));
})(ThingSpeak || (ThingSpeak = {}));

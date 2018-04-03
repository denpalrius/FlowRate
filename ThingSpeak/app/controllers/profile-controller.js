var Flux;
(function (Flux) {
    var Controllers;
    (function (Controllers) {
        "use strict";
        var ProfileController = (function () {
            function ProfileController($scope) {
                this.$scope = $scope;
                var that = this;
                that.init();
            }
            ProfileController.prototype.init = function () {
                var that = this;
            };
            return ProfileController;
        }());
        Controllers.ProfileController = ProfileController;
    })(Controllers = Flux.Controllers || (Flux.Controllers = {}));
})(Flux || (Flux = {}));

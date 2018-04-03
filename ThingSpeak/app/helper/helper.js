var Flux;
(function (Flux) {
    var Helpers;
    (function (Helpers) {
        var AppHelpers = (function () {
            function AppHelpers() {
            }
            AppHelpers.generateGUID = function () {
                var d = new Date().getTime();
                if (window.performance && typeof window.performance.now === "function") {
                    d += performance.now();
                }
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            };
            AppHelpers.encryptPassword = function (password) {
                if (password) {
                    return password + new Date();
                }
                return password;
            };
            AppHelpers.arrayHasData = function (array) {
                if (array === undefined || array === null || array.length === undefined || array.length === null) {
                    return false;
                }
                else {
                    return true;
                }
            };
            AppHelpers.showToast = function (message, truthy, $mdToast) {
                $mdToast.show($mdToast.simple()
                    .textContent(message)
                    .position('top right')
                    .hideDelay(3000)
                    .toastClass(truthy ? 'success' : 'error'));
            };
            return AppHelpers;
        }());
        Helpers.AppHelpers = AppHelpers;
    })(Helpers = Flux.Helpers || (Flux.Helpers = {}));
})(Flux || (Flux = {}));

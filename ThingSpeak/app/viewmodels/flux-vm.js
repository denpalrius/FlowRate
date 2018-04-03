var Flux;
(function (Flux) {
    var ViewModels;
    (function (ViewModels) {
        var UserRole;
        (function (UserRole) {
            UserRole[UserRole["admin"] = 1] = "admin";
            UserRole[UserRole["manager"] = 2] = "manager";
            UserRole[UserRole["standard"] = 3] = "standard";
        })(UserRole = ViewModels.UserRole || (ViewModels.UserRole = {}));
        var chartType;
        (function (chartType) {
            chartType[chartType["cumulative"] = 1] = "cumulative";
            chartType[chartType["realTime"] = 2] = "realTime";
        })(chartType = ViewModels.chartType || (ViewModels.chartType = {}));
    })(ViewModels = Flux.ViewModels || (Flux.ViewModels = {}));
})(Flux || (Flux = {}));

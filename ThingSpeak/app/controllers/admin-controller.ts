module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {


    }

    interface IAdminScope extends ng.IScope {
        adminScope?: ICurrentScope;
    }

    export class AdminController {
        constructor(
            private $scope: IAdminScope) {

            var that: AdminController = this;
            that.init();
        }

        private init() {
            var that: AdminController = this;

        }
    }
}
module ThingSpeak.Controllers {
    "use strict";

    export interface ICurrentScope {


    }

    interface IHomeScope extends ng.IScope {
        homeScope?: ICurrentScope;
    }

    export class HomeController {
        constructor(
            private $scope: ICurrentScope) {

            var that: HomeController = this;
            that.init();
        }

        private init() {
            var that: HomeController = this;

        }
    }
}
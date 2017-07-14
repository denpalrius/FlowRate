module ThingSpeak.Controllers {
    "use strict";

    export interface ICurrentScope {


    }

    interface IAboutScope extends ng.IScope {
        aboutScope?: ICurrentScope;
    }

    export class AboutController {
        constructor(
            private $scope: ICurrentScope) {

            var that: AboutController = this;
            that.init();
        }

        private init() {
            var that: AboutController = this;

        }
    }
}
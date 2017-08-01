module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {


    }

    interface IAboutScope extends ng.IScope {
        aboutScope?: ICurrentScope;
    }

    export class AboutController {
        constructor(
            private $scope: IAboutScope) {

            var that: AboutController = this;
            that.init();
        }

        private init() {
            var that: AboutController = this;

        }
    }
}
module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {

    }

    interface IProfileScope extends ng.IScope {
        profileScope?: ICurrentScope;
    }

    export class ProfileController {
        constructor(
            private $scope: IProfileScope) {

            var that: ProfileController = this;
            that.init();
        }

        private init() {
            var that: ProfileController = this;

        }
    }
}
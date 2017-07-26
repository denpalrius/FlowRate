module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {


    }

    interface IMapScope extends ng.IScope {
        mapScope?: ICurrentScope;
    }

    export class MapViewController {
        constructor(
            private $scope: ICurrentScope) {

            var that: MapViewController = this;
            that.init();
        }

        private init() {
            var that: MapViewController = this;

        }
    }
}
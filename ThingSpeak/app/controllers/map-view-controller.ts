module ThingSpeak.Controllers {
    "use strict";

    export interface ICurrentScope {


    }

    interface IMapScope extends ng.IScope {
        mapScope?: ICurrentScope;
    }

    export class MapController {
        constructor(
            private $scope: ICurrentScope) {

            var that: MapController = this;
            that.init();
        }

        private init() {
            var that: MapController = this;

        }
    }
}
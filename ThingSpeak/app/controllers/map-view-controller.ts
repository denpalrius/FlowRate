//module ThingSpeak.Controllers {
//    "use strict";

//    interface ICurrentScope {
//        mapName?: string;
//    }

//    interface IMapScope extends ng.IScope {
//        mapScope?: ICurrentScope;
//    }

//    export class MapViewController {
//        constructor(
//            private $scope: IMapScope,
//            private $state: angular.ui.IStateService) {

//            var that: MapViewController = this;
//            that.init();
//        }

//        private init() {
//            var that: MapViewController = this;

//            that.$scope.mapScope = {};
//            that.$scope.mapScope.mapName = "";

//            that.loadMap();
//        }

//        private loadMap() {
//            var that: MapViewController = this;

//        }
//    }
//}
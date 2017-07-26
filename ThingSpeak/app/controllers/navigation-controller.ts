module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        isActive?: boolean;
        isSelected(path: String): boolean;
    }

    interface INavigationScope extends ng.IScope {
        navigationScope?: ICurrentScope;
    }

    export class NavigationController {
        constructor(
            private $scope: INavigationScope,
            private $location:angular.ILocationService) {

            var that: NavigationController = this;

            //that.$scope.navigationScope.isSelected = function (path) {
            //    return this.isSelected(path)
            //}.bind(this);

        }

        private isSelected(path: String): boolean {
            return this.$location.path().substr(0, path.length) == path;
        }

        private getPath(path: String) {
            var that: NavigationController = this;

            console.log(that.$location.path());

            return path === that.$location.path();
        };

    }
}
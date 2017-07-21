module ThingSpeak.Controllers {
    "use strict";

    export interface ICurrentScope {
        title?: string;
    }

    interface IHomeScope extends ng.IScope {
        homeScope?: ICurrentScope;
    }

    export class HomeController {
        constructor(
            private $scope: IHomeScope,
            private $state: angular.ui.IStateService) {

            var that: HomeController = this;
            that.init();
        }

        private init() {

            var that: HomeController = this;

            console.log('Tumefikia scope');

            //that.$scope.homeScope.title = "";

            //that.$scope.homeScope.title = "Home";

            //that.$state.go('home');

            //that.navigateView("home");

        }

        private navigateView(view: string) {

            console.log('Twende home');


            var that: HomeController = this;
            that.$state.go(view);
        }

        private openHomeView() {
            var that: HomeController = this;

            that.navigateView("home");
        }

       
    }
}
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

        //private loadSpinner($interval) {
        //    var self = this;

        //    self.activated = true;
        //    self.determinateValue = 30;

        //    // Iterate every 100ms, non-stop and increment
        //    // the Determinate loader.
        //    $interval(function () {

        //        self.determinateValue += 1;
        //        if (self.determinateValue > 100) {
        //            self.determinateValue = 30;
        //        }

        //    }, 100);
        //}
    }
}
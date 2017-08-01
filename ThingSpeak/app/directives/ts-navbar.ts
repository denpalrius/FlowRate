
module ThingSpeak.Directives {
    "use strict";

    interface IScope extends ng.IScope {
        title?: string;
        isOpen?: any;
        isMenuCollapsed?: boolean;
        selectedmenu?: any;
        section: any;
        toggle: () => void;
    }


    export function menuToggle(): ng.IDirective {
        return {
            restrict: "AE",
            scope: {
                title: '@',
                isOpen: '@',
                isMenuCollapsed: '@',
                section: '='

                //"@"   (Text binding / one - way binding )
                //"="   (Direct model binding / two - way binding )
                //"&"   (Behaviour binding / Method binding  )
            },
            templateUrl: '/app/views/templates/ts-widget.html',
            link($scope: IScope, $elm: JQuery, $attr: ng.IAttributes) {
                var controller = $elm.parent().controller();
                $scope.isOpen = () => controller.isOpen($scope.section);
                $scope.toggle = () => {
                    controller.toggleOpen($scope.section);
                };

            }
        };
    }
}
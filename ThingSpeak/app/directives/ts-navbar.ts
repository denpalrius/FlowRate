
module ThingSpeak.Directives {
    "use strict"

    interface IScope extends ng.IScope {
        title: string;
        subtitle: string;
        rightText: string;
        allowCollapse: string;
        isMenuCollapsed: boolean;
        selectedmenu: any;
        collapseMenu: any;
    }
   

    export function tsWidgetHeader(): ng.IDirective {
        return {
            restrict: "AE",
            scope: {
                title: '@',
                subtitle: '@',
                rightText: '@',
                isMenuCollapsed: '@',
                collapseMenu: '@'

                 //"@"   (Text binding / one - way binding )
                //"="   (Direct model binding / two - way binding )
                //"&"   (Behaviour binding / Method binding  )
            },
            templateUrl: '/app/views/templates/ts-widget.html',
            link(scope: IScope, $elm: JQuery, $attr: ng.IAttributes) {
                //scope.selectedmenu = function (isMenuCollapsed){
                //}
                //    scope.collapseMenu({ isMenuCollapsed: isMenuCollapsed});
                //}
            }

        }
    }
}
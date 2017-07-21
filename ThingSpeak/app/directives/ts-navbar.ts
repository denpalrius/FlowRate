
module ThingSpeak.Directives {
    "use strict"

    interface Iscope extends ng.IScope {
        title: string;
        subtitle: string;
        rightText: string;
        allowCollapse: string;
    }

    export function TsWidgetHeader(): ng.IDirective {
        return {
            restrict: 'AE',
            scope: {
                title: '@',
                subtitle: '@',
                rightText: '@'
            },
            templateUrl: '/app/views/templates/ts-widget.html',
            link:function
        }
    }
}
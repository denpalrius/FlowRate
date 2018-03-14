module ThingSpeak.Directives {
    "use strict";

    interface IScope extends ng.IScope {
        equalWith?: any;
    }
    
    function init(scope: IScope, $timeout: ng.ITimeoutService) {
        scope.equalWith = false;
    }

    export function TsCompareWith($$rootScope: ng.IRootScopeService): ng.IDirective {
        let equalWithDirective: ng.IDirective = {
            restrict: 'AE',
            scope: {
                equalWith: '=?equalWith',
            },
            link: function (scope: IScope, $elm: Object, attr:any, ngModelCtrl:any) {

                ngModelCtrl.$validators.equalWith =
                    function (modelValue:any) {
                        return (modelValue === scope.equalWith())
                    }
                scope.$watch(scope.equalWith, function (value) {
                    ngModelCtrl.$validate()
                })
            }
        };

        return equalWithDirective;
    }
}
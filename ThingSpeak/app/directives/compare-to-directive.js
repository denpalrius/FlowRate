var Flux;
(function (Flux) {
    var Directives;
    (function (Directives) {
        "use strict";
        function init(scope, $timeout) {
            scope.equalWith = false;
        }
        function TsCompareWith($$rootScope) {
            var equalWithDirective = {
                restrict: 'AE',
                scope: {
                    equalWith: '=?equalWith',
                },
                link: function (scope, $elm, attr, ngModelCtrl) {
                    ngModelCtrl.$validators.equalWith =
                        function (modelValue) {
                            return (modelValue === scope.equalWith());
                        };
                    scope.$watch(scope.equalWith, function (value) {
                        ngModelCtrl.$validate();
                    });
                }
            };
            return equalWithDirective;
        }
        Directives.TsCompareWith = TsCompareWith;
    })(Directives = Flux.Directives || (Flux.Directives = {}));
})(Flux || (Flux = {}));


module ThingSpeak.Directives {
    "use strict";

    interface IScope extends ng.IScope {
        list?: string;
        $window?: JQuery;
        $stickies?: JQuery;
    }

    function setStickies(stickies?: JQuery, $scope?: IScope) {
        if (typeof stickies === "object" && stickies instanceof jQuery && stickies.length > 0) {
            $scope.$stickies = stickies.each(function () {
                var $thisSticky = $(this).wrap('<div class="followWrap" />');

                $thisSticky
                    .data("originalPosition", $thisSticky.offset().top)
                    .data("originalHeight", $thisSticky.outerHeight())
                    .parent()
                    .height($thisSticky.outerHeight());
            });

            $scope.$window.off("scroll.stickies").on("scroll.stickies", function () {
                whenScrolling($scope);
            });
        }
    }

    function whenScrolling($scope: IScope) {
            $scope.$stickies.each(function (i) {
                var $thisSticky = $(this);
                var $stickyPosition = $thisSticky.data("originalPosition");

            if ($stickyPosition <= $scope.$window.scrollTop()) {
                var $nextSticky = $scope.$stickies.eq(i + 1);
                var $nextStickyPosition = $nextSticky.data("originalPosition")-$thisSticky.data("originalHeight");

                $thisSticky.addClass("fixed");

                if (
                    $nextSticky.length > 0 &&
                    $thisSticky.offset().top >= $nextStickyPosition
                ) {
                    $thisSticky.addClass("absolute").css("top", $nextStickyPosition);
                }
            } else {
                var $prevSticky = $scope.$stickies.eq(i - 1);

                $thisSticky.removeClass("fixed");

                if (
                    $prevSticky.length > 0 &&
                    $scope.$window.scrollTop() <=
                    $thisSticky.data("originalPosition") -
                    $thisSticky.data("originalHeight")
                ) {
                    $prevSticky.removeClass("absolute").removeAttr("style");
                }
            }
        });
    }


    export function tsStickyHeader(): ng.IDirective {
        return {
            restrict: "AE",
            scope: {
                title: '@',
                isOpen: '@',
                isMenuCollapsed: '@',
                section: '=',
                list: '='
            },
            link($scope: IScope, $elm: JQuery, $attr: ng.IAttributes) {

                $scope.$window = angular.element(window);
                $scope.$stickies = $elm;

                $scope.$watch('list', () => {
                    if ($scope.list.length > 0) {
                        setStickies($elm.eq(0).children(), $scope);
                    }
                });

                //Sticky list

                //var stickyList = angular.element('#main-list');
                //stickyList.stickySectionHeaders({
                //    stickyClass: 'sticky',
                //    headlineSelector: 'strong'
                //});
            }
        };
    }
}
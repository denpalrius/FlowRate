module ThingSpeak.Directives {
    "use strict";

    interface IScope extends ng.IScope {
    }

    export function tsStickyHeader(): ng.IDirective {

        var settings = {
            stickyClass: 'sticky',
            headlineSelector: '.followMeBar'
        };

        return {
            restrict: 'A',
            link: function (scope: any, mainList: JQuery) {

                console.log("mainList: ", mainList);

                mainList.bind('scroll.sticky', function (e) {
                    mainList.find('> div.feedItem').each(function () {
                        var $this = $(this),
                            top = $this.position().top,
                            height = $this.outerHeight(),
                            $head = $this.find(settings.headlineSelector),
                            headHeight = $head.outerHeight();

                        console.log("Scrolling..");

                        if (top < 0) {
                            $this.addClass(settings.stickyClass).css('paddingTop', headHeight);

                            var totalPadding =
                                parseInt($head.css('padding-left').replace("px", "")) +
                                parseInt($head.css('padding-right').replace("px", ""));

                            $head.css({
                                'top': (height + top < headHeight) ? (headHeight - (top + height)) * -1 : '',
                                'width': $this.outerWidth() - totalPadding,
                            });
                        }
                        else {
                            $this.removeClass(settings.stickyClass).css('paddingTop', '');
                        }
                    });
                });
            }
        };
    }

}
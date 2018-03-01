var ThingSpeak;
(function (ThingSpeak) {
    var Filters;
    (function (Filters) {
        "use strict";
        function TsRemoveStringFilter() {
            return function TsRemoveStringFilter(text) {
                if (text) {
                    var textArray = text.split('');
                    return textArray.map(function (txt) {
                        if (isNaN(parseInt(txt))) {
                            return txt;
                        }
                    });
                }
            };
        }
        Filters.TsRemoveStringFilter = TsRemoveStringFilter;
    })(Filters = ThingSpeak.Filters || (ThingSpeak.Filters = {}));
})(ThingSpeak || (ThingSpeak = {}));

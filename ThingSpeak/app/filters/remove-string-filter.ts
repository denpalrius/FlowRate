module Flux.Filters {
    "use strict";

    export function TsRemoveStringFilter() {
        return function TsRemoveStringFilter(text: string) {
            if (text) {
                var textArray = text.split('');
                return textArray.map((txt) => {
                    if (isNaN(parseInt(txt))) {
                        return txt;
                    }
                });
            }
        }
    }
}
module ThingSpeak.Directives {
    "use strict";

    interface sortTechnique {
        name?: string;
        code?: number;
    }

    interface IScope extends ng.IScope {
        list?: string;
        numberList?: number[];
        sortedList?: number[];
        sortTypes?: sortTechnique[];
        selectSortType?: any;
        selectedSortType?: sortTechnique;
        keyDownFn?: any;
    }

    export function dsSortingAlgorithms(): ng.IDirective {
        return {
            restrict: "AE",
            scope: {
                list: '=?list',
                numberList: '=?numberList',
                sortedList: '=?sortedList',
                sortTypes: '=?sortTypes',
                selectedSortType: "=?selectedSortType",
                selectSortType: "&selectSortType",
                keyDownFn: "&keyDownFn"
            },
            templateUrl: "/app/views/templates/ds-sorting-algorithms.html",
            link(scope: IScope) {
                init(scope);

                scope.selectSortType = function () {
                    sort(scope);
                }

                scope.keyDownFn = function () {
                    sort(scope);
                }
            }
        };
    }

    function init(scope: IScope) {
        scope.list = "";
        scope.numberList = [];
        scope.sortedList = [];
        scope.sortTypes = [
            { name: "Bubble Sort", code: 1 },
            { name: "Insertion Sort", code: 2 },
            { name: "Selection Sort", code: 3 },
            { name: "Merge Sort", code: 4 },
            { name: "Shell Sort", code: 5 },
            { name: "Quick Sort", code: 6 }
        ];
        scope.selectedSortType = scope.sortTypes[0];
    }

    function sort(scope: IScope) {
        scope.numberList = scope.list.split(',').map((s) => {
            if (s) {
                let n = parseInt(s);
                if (!isNaN(n) || s == ",") {
                    return n;
                }
            }
        });

        if (scope.selectedSortType && scope.numberList) {
            switch (scope.selectedSortType.code) {
                case 1:
                    scope.sortedList = bubbleSort(scope.numberList);
                    break;
                case 2:
                    scope.sortedList = insertionSort(scope.numberList);
                    break;
                case 3:
                    scope.sortedList = selectionSort(scope.numberList);
                    break;
                case 4:
                    scope.sortedList = mergeSort(scope.numberList);
                    break;
                case 5:
                    scope.sortedList = shellSort(scope.numberList);
                    break;
                case 6:
                    scope.sortedList = quickSort(scope.numberList);
                    break;
            }
        }
    }

    function bubbleSort(numberList:number[]): number[] {
        if (numberList) {
            let sortedList = numberList;

            let i = 0, j = 0, len = sortedList.length, swapped = false;

            for (i=0; i < len; i++){
                swapped = false;
                for (j=0; j < len-1; j++) {
                    let currentValue = sortedList[j], nextValue = sortedList[j + 1];
                    if (currentValue > nextValue) {  /* compare the adjacent elements */
                        sortedList[j] = nextValue;   /* swap them */
                        sortedList[j + 1] = currentValue;
                        swapped = true;
                    }
                }
                if (!swapped) {/*if no number was swapped that means array is sorted now, break the loop.*/
                    break;
                }
            }
            return sortedList;
        }
        return [];
    }
    function insertionSort(numberList: number[]): number[] {
        if (numberList) {

            return numberList;
        }
        return [];
    }
    function selectionSort(numberList: number[]): number[] {
        if (numberList) {

            return numberList;
        }
        return [];
    }
    function mergeSort(numberList: number[]): number[] {
        if (numberList) {

            return numberList;
        }
        return [];
    }
    function shellSort(numberList: number[]): number[] {
        if (numberList) {

            return numberList;
        }
        return [];
    }
    function quickSort(numberList: number[]): number[] {
        if (numberList) {

            return numberList;
        }
        return [];
    }
}
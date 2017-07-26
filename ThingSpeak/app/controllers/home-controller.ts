module ThingSpeak.Controllers {
    "use strict";

    interface ICurrentScope {
        pageTitle?: string;
        sourcePos?: string;
        destinationPos?: string;
        largerPos?: number;
    }

    interface IHomeScope extends ng.IScope {
        homeScope?: ICurrentScope;
    }

    export class HomeController {
        constructor(
            private $scope: IHomeScope,
            private $state: angular.ui.IStateService) {

            var that: HomeController = this;
            that.init();
        }

        private init() {
            var that: HomeController = this;

            that.$scope.homeScope = {};
            that.$scope.homeScope.pageTitle = "Compare Positions";
            that.$scope.homeScope.sourcePos = "2.3.4";
            that.$scope.homeScope.destinationPos = "3.3.41s";
            that.$scope.homeScope.largerPos = 0;
        }

        private checkPosition() {
            var that: HomeController = this;
            var rs = that.comparePositions(that.$scope.homeScope.sourcePos, that.$scope.homeScope.destinationPos);
            console.log("Largest Position:", rs);
            that.$scope.homeScope.largerPos = parseFloat(rs);
        }
 
        private containsNaN(numArray: number[]):boolean {
            numArray.forEach((item) => {
                if (isNaN(item)) {
                    return true;
                }
                return false;
            });
            return false;
        }

        private comparePositions(sourcePos: string, destinationPos: string) {
            var that: HomeController = this;

            var sourcePosArray = sourcePos.split('.').map(n => parseInt(n, 10));
            var destinationPosArray = destinationPos.split('.').map(n => parseInt(n, 10));

            console.log('SourcePosArray: ', sourcePosArray);
            console.log('DestinationPosArray: ', destinationPosArray);

            if (that.containsNaN(sourcePosArray) || that.containsNaN(destinationPosArray)) {
                console.log('You have NaN values');
                return "Contains NaN";
            }
            for (var i = 0; i < sourcePosArray.length; i++) {
                if (sourcePosArray[i] === destinationPosArray[i]) {
                    continue;
                } else {
                    if (i > 0) { //After the first decimal
                        //SourceDec and destinationDec are temporary decimal numbers to be used for comparison
                        var sourceDec = parseFloat(sourcePosArray[i - 1].toString() + "." + sourcePosArray[i].toString());
                        var destinationDec = 0;
                        if (destinationPosArray.length === 1) {
                            destinationDec = parseFloat(destinationPosArray[i - 1].toString() + "." + destinationPosArray[i].toString());
                        } else {
                            destinationDec = parseFloat(destinationPosArray[i - 1].toString() + "." + destinationPosArray[i].toString());
                        }

                        console.log('sourceDec:', sourceDec);
                        console.log('destinationDec:', destinationDec);

                        return sourceDec > destinationDec ? sourcePos : destinationPos;
                    } else {
                        if (sourcePosArray[i] > destinationPosArray[i]) {
                            return sourcePos;
                        } else {
                            return destinationPos;
                        }
                    }
                }
            }
            if (destinationPosArray.length > sourcePosArray.length) {
                return destinationPos;
            } else if(destinationPosArray.length === sourcePosArray.length) {
                return "Equal";
            }
            return "Things went wrong";
        }

        private othercomparePositions(positions: string) {
            var that: HomeController = this;

            positions.split(",").reduce((initialPos: string, followingPosition: string) => {
                var initialPosArray = initialPos.split('.').map(n => parseInt(n, 10));
                var followingPositionArray = followingPosition.split('.').map(n => parseInt(n, 10));

                    console.log('initialPosArray: ', initialPosArray);
                    console.log('followingPositionArray: ', followingPositionArray);

                if (that.containsNaN(initialPosArray) || that.containsNaN(followingPositionArray)) {
                    console.log('You have NaN values');
                    return "Contains Strings";
                }
                for (var i = 0; i < initialPosArray.length; i++) {
                    if (initialPosArray[i] === followingPositionArray[i]) {
                        continue;
                    } else {
                        if (i>0) { //After the first decimal
                            var dec1 = parseFloat(initialPosArray[i - 1].toString() + "." + initialPosArray[i].toString());
                            //if (followingPositionArray.length) {
                            
                            //}
                            var dec2 = parseFloat(followingPositionArray[i-1].toString() + "." + followingPositionArray[i].toString());

                            console.log('Dec1:', dec1);
                            console.log('Dec1:', dec2);

                            return dec1 > dec2 ? initialPos : followingPosition;
                        } else {
                            if (initialPosArray[i] > followingPositionArray[i]) {
                                return initialPos;
                            } else {
                                return followingPosition;
                            }
                        }
                    
                    }
                }
                    if (followingPositionArray.length > initialPosArray.length) {
                        return followingPosition;
                    } else {
                        return "Equal";
                    }
                });
        }
    }
}
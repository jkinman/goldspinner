'use strict';

angular.module('pkerApp')
	.directive('threecardpokerhand', function(threecardpoker, $rootScope) {
		return {
			templateUrl: 'app/directives/threecardpokerhand/threecardpokerhand.html',
			restrict: 'EA',
			replace: true,
			scope: {
				hand: "=",
				index: "@",
				anti: "=",
				pairsPlus: "=",
				sixCard: "=",
				state: "=",
				handActive: "=",
			},
			link: function(scope, element, attrs) {
				scope.hand.bets.anti = 10;
				scope.hand.bets.play = 0;
				scope.hand.bets.sixCard = 10;
				scope.hand.bets.pairsPlus = 10;
				scope.handActive = true;

				// console.log( scope.hand );
				scope.foldHand = function() {
					console.log("fold hand " + scope.index);
					scope.handActive = false;
				};
			}
		};
	});

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
				play: "=",
				pairsPlus: "=",
				sixCard: "=",
				payout: "=",
				state: "=",
				handActive: "=",
			},
			link: function(scope, element, attrs) {
				scope.hand.bets.anti = 10;
				scope.hand.bets.play = 0;
				scope.hand.bets.sixCard = 10;
				scope.hand.bets.pairsPlus = 10;
				scope.hand.handActive = 1;

				scope.foldHand = function() {
					console.log("fold hand " + scope.index);
					scope.hand.handActive = false;
					scope.hand.bets.play = 0;
				};
			}
		};
	});

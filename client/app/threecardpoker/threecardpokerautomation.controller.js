'use strict';

angular.module('pkerApp')
	.controller('ThreecardpokerautomationCtrl', function($scope, threecardpoker, $rootScope, $http, $window) {

		// update the game with the current bets
		$scope.bets = [];
		for (var i = 0; i < 8; i++) {
			$scope.bets[i] = {
				anti: 5,
				play: 5,
				pairsPlus: 5,
				sixCard: 5
			};
		};
		$rootScope.output = [];

		$scope.runGame = function() {
			var game = new threecardpoker();

			game.bets = $scope.bets;
			game.$save(function() {
				//$window.setTimeout(function(game) {
					game.bets = $scope.bets;
					game.$deal(function() {
						game.bets = $scope.bets;
						game.$resolve(function() {
							$rootScope.output.push(game.totalMoney);
							$rootScope.average = 0;
							$rootScope.total = 0;
							$rootScope.totalHands = $rootScope.output.length * 8;
							for (var i = 0; i < $rootScope.output.length; i++) {
								$rootScope.total += $rootScope.output[i];
							};
							$rootScope.average = $rootScope.total / $rootScope.output.length;
							$window.setTimeout($scope.runGame, 1000);
						});
					});
				//}, 1000);
			});

		}

		var games = [];
		// for (var i = 0; i < 250; i++) {
			$window.setTimeout($scope.runGame, 1000);
			// var game = new threecardpoker();
			// $scope.runGame(game);
		// }
	});

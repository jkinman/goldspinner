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
		$rootScope.raise = 0;
		$rootScope.fold = 0;

		$rootScope.winnings = {
			anti: 0,
			antiBonus: 0,
			pairsPlusTotal: 0,
			playBonus: 0,
			sixCardBonus: 0,
		};
		$rootScope.output = [];
		$scope.state = "none";
		$scope.data = {
			deal: "nottki",
			fold: true,
			raise: true
		};

		$scope.runGame = function() {
			var game = new threecardpoker();
			$rootScope.game = game;
			$rootScope.output.push( "Init" );
			game.bets = $scope.bets;
			game.$save(function() {
				$rootScope.output[$rootScope.output.length-1] = "shuffled";
				game.bets = $scope.bets;
				// prefill the bets
				for (var i = game.hands.length - 1; i >= 0; i--) {
					game.hands[i].bets = {
						anti: 5,
						play: 5,
						pairsPlus: 5,
						sixCard: 5
					};
				};

				game.$deal(function() {
					for (var i = game.hands.length - 1; i >= 0; i--) {
						assesHand(game.hands[i]);
					};
					$rootScope.output[$rootScope.output.length-1] = "Betting";

					game.bets = $scope.bets;


					game.$resolve(function() {
						$rootScope.output[$rootScope.output.length-1] = game.totalMoney;
						$rootScope.average = 0;
						$rootScope.total = 0;
						$rootScope.totalHands = $rootScope.output.length * 8;
						for (var i = 0; i < $rootScope.output.length; i++) {
							$rootScope.total += $rootScope.output[i];
						};
						for (var i = game.hands.length - 1; i >= 0; i--) {
							$rootScope.winnings.anti += game.hands[i].winnings.anti;
							$rootScope.winnings.antiBonus += game.hands[i].winnings.antiBonus;
							$rootScope.winnings.sixCardBonus += game.hands[i].winnings.sixCardBonus;
							$rootScope.winnings.playBonus += game.hands[i].winnings.playBonus;
							$rootScope.winnings.pairsPlusTotal += game.hands[i].winnings.pairsPlusTotal;
						};
						$rootScope.average = $rootScope.total / $rootScope.output.length;
						$window.setTimeout($scope.runGame, 1000);
					});
				});
			});

		}

		function assesHand(hand) {

			hand.bets = {
				anti: 5,
				play: 5,
				pairsPlus: 5,
				sixCard: 5
			};

			if (hand.rank.handType > 1 && $scope.data.raise) {
				$rootScope.raise += 1;
				hand.bets.play = 10;
			}

			if ($scope.data.fold && hand.rank.handType == 1 && hand.rank.value < 4115) {
				$rootScope.fold += 1;
				hand.handActive = false;
			}
		}

		$scope.start = function() {
			$scope.state = 'running';
			$window.setTimeout($scope.runGame, 1000);
		}

		var games = [];

	});

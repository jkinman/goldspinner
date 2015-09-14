'use strict';

angular.module('pkerApp')
  .controller('ThreecardpokerCtrl', function($scope, threecardpoker, $rootScope) {

    // figure out if a game is in progress of a new one should be created
    $rootScope.message = "Click Shuffle to start playing";
    $scope.game = new threecardpoker();
    // $scope.game.state = 'stopped';
    $rootScope.state = 'none'
    $scope.hands = [];
    $scope.game.dealer = {
      cards: []
    };
    $scope.bets = [];
    $scope.cards = {
      hands: {},
      dealer: {
        cards: []
      }
    };


    // build hands and init bets
    $scope.init = function() {
      $rootScope.message = "place bets and click deal to lock them in";

      var unknown = '?';
      $rootScope.state = 'init';

      $scope.game.dealer = {
        cards: [unknown, unknown, unknown]
      };

      $scope.hands[0] = {
        cards: [unknown, unknown, unknown],
        payout: 0,
        bets: {
          anti: 25,
          pairsPlus: 0,
          play: 0,
          sixCard: 0
        }
      };
      $scope.hands[1] = {
        cards: [unknown, unknown, unknown],
        payout: 0,
        bets: {
          anti: 25,
          play: 0,
          pairsPlus: 0,
          sixCard: 0
        }
      };
      $scope.hands[2] = {
        cards: [unknown, unknown, unknown],
        payout: 0,
        bets: {
          anti: 25,
          play: 0,
          pairsPlus: 0,
          sixCard: 0
        }
      };
      $scope.hands[3] = {
        cards: [unknown, unknown, unknown],
        payout: 0,
        bets: {
          anti: 25,
          play: 0,
          pairsPlus: 0,
          sixCard: 0
        }
      };
      $scope.hands[4] = {
        cards: [unknown, unknown, unknown],
        payout: 0,
        bets: {
          anti: 25,
          pairsPlus: 0,
          play: 0,
          sixCard: 0
        }
      };
      $scope.hands[5] = {
        cards: [unknown, unknown, unknown],
        payout: 0,
        bets: {
          play: 0,
          anti: 25,
          pairsPlus: 0,
          sixCard: 0
        }
      };
      $scope.hands[6] = {
        cards: [unknown, unknown, unknown],
        payout: 0,
        bets: {
          anti: 25,
          play: 0,
          pairsPlus: 0,
          sixCard: 0
        }
      };
      $scope.hands[7] = {
        cards: [unknown, unknown, unknown],
        payout: 0,
        bets: {
          anti: 25,
          play: 0,
          pairsPlus: 0,
          sixCard: 0
        }
      };
    };

    // send init state to server and get the deck and your cards
    $scope.startGame = function() {


      // update the game with the current bets
      var bets = [];
      for (var i = 0; i < $scope.hands.length; i++) {
        bets[i] = {
          anti: $scope.hands[i].bets.anti,
          play: $scope.hands[i].bets.play,
          pairsPlus: $scope.hands[i].bets.pairsPlus,
          sixCard: $scope.hands[i].bets.sixCard
        };
      };

      $scope.game.bets = bets;

      $scope.game.$save(function() {
        $scope.hands = $scope.game.hands;

        $rootScope.state = 'created';
        $rootScope.message = "Set your Play bets or fold hands and Click SHOWDOWN.";

      });
    };

    // get the dealers hand and money made
    $scope.resolve = function() {

      $rootScope.message = "Resolving game";
      // update the game with the current bets
      // var bets = [];
      for (var i = 0; i < $scope.game.hands.length; i++) {
        $scope.game.hands[i].bets.play = $scope.hands[i].bets.play;
      };


      $rootScope.state = 'resolved';
      $scope.game.$resolve(function() {
        if ($scope.game.totalMoney > 0) {
          $rootScope.message = "Finished. Congrats you won $" + $scope.game.totalMoney;
        } else {
          $rootScope.message = "Finished. You lost $" + $scope.game.totalMoney;
        }
        // what did I get back?
        $scope.hands = $scope.game.hands;
      });
    };

    $scope.reset = function() {
      $rootScope.message = "Click Shuffle to start playing";
      $scope.game = new threecardpoker();
      // $scope.game.state = 'stopped';
      $rootScope.state = 'none'
      $scope.hands = [];
      $scope.game.dealer = {
        cards: []
      };
      $scope.bets = [];
      $scope.cards = {
        hands: {},
        dealer: {
          cards: []
        }
      };

    };

  });

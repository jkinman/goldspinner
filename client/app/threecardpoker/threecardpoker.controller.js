'use strict';

angular.module('pkerApp')
  .controller('ThreecardpokerCtrl', function ($scope, threecardpoker, $rootScope) {

  	// figure out if a game is in progress of a new one should be created

  	$scope.game = new threecardpoker();
    // $scope.game.state = 'stopped';
    $rootScope.state = 'none'
    $scope.hands = [];
    $scope.game.dealer = {cards:[]};
    $scope.bets = [];
    $scope.cards = {hands:{},dealer:{cards:[]}};


    // build hands and init bets
    $scope.init = function() {
      var unknown = '?';
      $rootScope.state = 'init';

      $scope.game.dealer = {cards:[unknown, unknown, unknown]};

      $scope.hands[0] = {cards:[unknown, unknown, unknown], bets:{anti:0, pairsPlus: 0, sixCard: 0}};
      $scope.hands[1] = {cards:[unknown, unknown, unknown], bets:{anti:0, pairsPlus: 0, sixCard: 0}};
      $scope.hands[2] = {cards:[unknown, unknown, unknown], bets:{anti:0, pairsPlus: 0, sixCard: 0}};
      $scope.hands[3] = {cards:[unknown, unknown, unknown], bets:{anti:0, pairsPlus: 0, sixCard: 0}};
      $scope.hands[4] = {cards:[unknown, unknown, unknown], bets:{anti:0, pairsPlus: 0, sixCard: 0}};
      $scope.hands[5] = {cards:[unknown, unknown, unknown], bets:{anti:0, pairsPlus: 0, sixCard: 0}};
      $scope.hands[6] = {cards:[unknown, unknown, unknown], bets:{anti:0, pairsPlus: 0, sixCard: 0}};
      $scope.hands[7] = {cards:[unknown, unknown, unknown], bets:{anti:0, pairsPlus: 0, sixCard: 0}};
    };   

    // send init state to server and get the deck and your cards
    $scope.startGame = function() {
      $rootScope.state = 'created';

      // update the game with the current bets
      var bets = [];
      for (var i = 0; i < $scope.hands.length; i++) {
        bets[i] = {
          anti: $scope.hands[i].bets.anti,
          pairsPlus: $scope.hands[i].bets.pairsPlus,
          sixCard: $scope.hands[i].bets.sixCard
        };
      };
      
      $scope.game.bets = bets;
      
      $scope.game.$save( function(){
        $scope.hands = $scope.game.hands;
      });
    };

    // get the dealers hand and money made
    $scope.resolve = function() {
      $scope.game.$resolve( function(){
        // what did I get back?
        debugger;
      });
    };

  });

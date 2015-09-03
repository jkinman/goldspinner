'use strict';

angular.module('pkerApp')
  .controller('ThreecardpokerCtrl', function ($scope, threecardpoker) {

  	// figure out if a game is in progress of a new one should be created

  	$scope.game = new threecardpoker();
    $scope.state = 'stopped';
    $scope.hands = [];
    $scope.dealer = {};
    $scope.bets = [];


  	
  	// $scope.model = threecardpoker;
   //  $scope.gameService = threecardpoker.game;
   //  $scope.gameState = threecardpoker.game;
   //  $scope.hands = threecardpoker.hands;
  $scope.init = function() {
    // var unknown = {suit:'?', value:'?', card:'?'};
    var unknown = '?';
      $scope.dealer = {cards:[unknown, unknown, unknown]};
      $scope.hands[0] = {cards:[unknown, unknown, unknown], anti:0};
      $scope.hands[1] = {cards:[unknown, unknown, unknown], anti:0};
      $scope.hands[2] = {cards:[unknown, unknown, unknown], anti:0};
      $scope.hands[3] = {cards:[unknown, unknown, unknown], anti:0};
      $scope.hands[4] = {cards:[unknown, unknown, unknown], anti:0};
      $scope.hands[5] = {cards:[unknown, unknown, unknown], anti:0};
      $scope.hands[6] = {cards:[unknown, unknown, unknown], anti:0};
      $scope.hands[7] = {cards:[unknown, unknown, unknown], anti:0};
  };   

    $scope.startGame = function() {
      // update the game with the current bets
      var bets = [];
      for (var i = 0; i < $scope.hands.length; i++) {
        bets[i] = {anti: $scope.hands[i].anti};
      };
      
      $scope.game.bets = bets;
      
      $scope.game.$save( function(){
        var retval = $scope.game.deck;
        $scope.hands = $scope.game.hands;
        // data saved, in this case a new game should have been created
        // $scope.hands[0] = [retval[0], retval[4], retval[8]];
        // $scope.hands[1] = [retval[1], retval[5], retval[9]];
        // $scope.hands[2] = [retval[2], retval[6], retval[10]];
        // $scope.hands[3] = [retval[0], retval[1], retval[2]];
        // $scope.hands[4] = [retval[4], retval[5], retval[6]];
        // $scope.hands[5] = [retval[8], retval[9], retval[10]];
        // $scope.hands[6] = [retval[10], retval[5], retval[0]];
        // $scope.hands[7] = [retval[2], retval[5], retval[8]];

        console.log( $scope.game._id );
      });
    };

  });

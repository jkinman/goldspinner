'use strict';

angular.module('pkerApp')
  .controller('ThreecardpokerCtrl', function ($scope, threecardpoker) {

  	// figure out if a game is in progress of a new one should be created

  	$scope.game = new threecardpoker();
    $scope.hands = [];
    $scope.dealer = [];
    $scope.bets = [];




  	
  	// $scope.model = threecardpoker;
   //  $scope.gameService = threecardpoker.game;
   //  $scope.gameState = threecardpoker.game;
   //  $scope.hands = threecardpoker.hands;
  $scope.init = function() {
    var unknown = {suit:'?', value:'?', card:'?'};
        $scope.dealer = [unknown, unknown, unknown];
        $scope.hands[0] = {hand:[unknown, unknown, unknown], anti:0};
        $scope.hands[1] = {hand:[unknown, unknown, unknown], anti:0};
        $scope.hands[2] = {hand:[unknown, unknown, unknown], anti:0};
        $scope.hands[3] = {hand:[unknown, unknown, unknown], anti:0};
        $scope.hands[4] = {hand:[unknown, unknown, unknown], anti:0};
        $scope.hands[5] = {hand:[unknown, unknown, unknown], anti:0};
        $scope.hands[6] = {hand:[unknown, unknown, unknown], anti:0};
        $scope.hands[7] = {hand:[unknown, unknown, unknown], anti:0};
        // $scope.hands[1] = [unknown, unknown, unknown];
        // $scope.hands[2] = [unknown, unknown, unknown];
        // $scope.hands[3] = [unknown, unknown, unknown];
        // $scope.hands[4] = [unknown, unknown, unknown];
        // $scope.hands[5] = [unknown, unknown, unknown];
        // $scope.hands[6] = [unknown, unknown, unknown];
        // $scope.hands[7] = [unknown, unknown, unknown];

  };   

    $scope.startGame = function() {
      // update the game with the current bets
      var bets = [];
      for (var i = 0; i < $scope.hands.length; i++) {
        bets[i] = {anti: $scope.hands[i].anti};
      };
      
      $scope.game.bets = bets;
      
      debugger;
      $scope.game.$save( function(){
        var retval = $scope.game.deck;
        // data saved, in this case a new game should have been created
        $scope.hands[0] = [retval[0], retval[4], retval[8]];
        $scope.hands[1] = [retval[1], retval[5], retval[9]];
        $scope.hands[2] = [retval[2], retval[6], retval[10]];
        $scope.hands[3] = [retval[0], retval[1], retval[2]];
        $scope.hands[4] = [retval[4], retval[5], retval[6]];
        $scope.hands[5] = [retval[8], retval[9], retval[10]];
        $scope.hands[6] = [retval[10], retval[5], retval[0]];
        $scope.hands[7] = [retval[2], retval[5], retval[8]];

        console.log( $scope.game._id );
      });
    };

  });

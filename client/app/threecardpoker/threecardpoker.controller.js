'use strict';

angular.module('pkerApp')
  .controller('ThreecardpokerCtrl', function ($scope, threecardpoker) {

  	// figure out if a game is in progress of a new one should be created

  	$scope.game = new threecardpoker();


  	
  	// $scope.model = threecardpoker;
   //  $scope.gameService = threecardpoker.game;
   //  $scope.gameState = threecardpoker.game;
   //  $scope.hands = threecardpoker.hands;
    $scope.startGame = function() {
	  	$scope.game.$save( function(){
        // data saved, in this case a new game should have been created
        console.log( $scope.game._id );
      });
    };

  });

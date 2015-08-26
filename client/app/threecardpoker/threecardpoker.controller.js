'use strict';

angular.module('pkerApp')
  .controller('ThreecardpokerCtrl', function ($scope, threecardpoker) {


  	$scope.model = threecardpoker;
    $scope.gameService = threecardpoker.game;
    $scope.gameState = threecardpoker.game;
    $scope.hands = threecardpoker.hands;
    $scope.startGame = function() {
    	
    };

  });

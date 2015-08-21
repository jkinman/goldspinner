'use strict';

angular.module('pkerApp')
  .controller('ThreecardpokerCtrl', function ($scope, threecardpoker) {
    $scope.message = 'Hello';
    $scope.gameState = threecardpoker.game;
    $scope.startGame = function() {
    	
    };


  });

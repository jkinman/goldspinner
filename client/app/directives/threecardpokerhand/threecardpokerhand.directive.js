'use strict';

angular.module('pkerApp')
  .directive('threecardpokerhand', function ( threecardpoker, $rootScope ) {
    return {
      templateUrl: 'app/directives/threecardpokerhand/threecardpokerhand.html',
      restrict: 'EA',
      replace: true,
      scope: {
      	hand: "=",
      	index: "@",
        anti: "=",
        pairsPlus: "=",
        sixCard: "=",
        state: "=",
      },
      link: function (scope, element, attrs) {
        scope.hand.anti = 0;
        scope.hand.sixCard = 0;
        scope.hand.pairsPlus = 0;
        scope.handActive = true;

      	// console.log( scope.hand );
        scope.foldHand = function() {
          console.log( "fold hand " + scope.index );
          scope.handActive = false;
        };
      }
    };
  });
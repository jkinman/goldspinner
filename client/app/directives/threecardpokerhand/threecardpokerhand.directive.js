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
        anti: "="
      },
      link: function (scope, element, attrs) {
        scope.hand.anti = 0;

      	// console.log( scope.hand );
      },
      foldHand: function() {
        console.log( "fold hand " + scope.index );
      }
    };
  });
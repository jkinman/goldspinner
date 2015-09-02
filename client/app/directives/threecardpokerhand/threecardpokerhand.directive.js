'use strict';

angular.module('pkerApp')
  .directive('threecardpokerhand', function () {
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
      }
    };
  });
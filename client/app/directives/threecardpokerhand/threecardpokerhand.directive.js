'use strict';

angular.module('pkerApp')
  .directive('threecardpokerhand', function () {
    return {
      templateUrl: 'app/directives/threecardpokerhand/threecardpokerhand.html',
      restrict: 'EA',
      replace: true,
      scope: {
      	hand: "=",
      	index: "@"
      },
      link: function (scope, element, attrs) {
      	// console.log( scope.hand );
      }
    };
  });
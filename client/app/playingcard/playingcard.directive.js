'use strict';

angular.module('pkerApp')
  .directive('playingcard', function () {
    return {
      templateUrl: 'app/playingcard/playingcard.html',
      restrict: 'EA',
      scope: {
      	card: =@
      },
      link: function (scope, element, attrs) {
      }
    };
  });
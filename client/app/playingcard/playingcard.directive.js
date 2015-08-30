'use strict';

angular.module('pkerApp')
  .directive('playingcard', function ( $window ) {
    return {
      template: '',
      restrict: 'EA',
      scope: {
      	card: '@',
      	suit: '@',
      	size: '@',
      	value: '@'
      },
      link: function (scope, el, attrs) {

      	var card = $window.Poker.getCardImage(scope.size, scope.suit, scope.value.toLowerCase());
      	el.append( card );


      }
    };
  });
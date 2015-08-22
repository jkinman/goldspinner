'use strict';

angular.module('pkerApp')
  .directive('playingcard', function () {
    return {
      templateUrl: 'app/playingcard/playingcard.html',
      restrict: 'EA',
      scope: {
      	card: '@',
      	suit: '@',
      	value: '@'
      },
      link: function (scope, element, attrs) {

      	// determine suit
      	if( -1 > scope.card.indexOf( 'd') ){
      		scope.suit = 'diamonds';
      	}
      	else if( -1 > scope.card.indexOf( 'c') ){
      		scope.suit = 'clubs';
      	}
      	else if( -1 > scope.card.indexOf( 'h') ){
      		scope.suit = 'hearts';
      	}
      	else if( -1 > scope.card.indexOf( 's') ){
      		scope.suit = 'spades';
      	}

      }
    };
  });
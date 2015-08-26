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

      	// determine suit
      	// if( -1 > scope.suit.toLowerCase().indexOf( 'dia') ){
      	// 	scope.suit = 'diamonds';
      	// }
      	// else if( -1 > scope.suit.toLowerCase().indexOf( 'club') ){
      	// 	scope.suit = 'clubs';
      	// }
      	// else if( -1 > scope.suit.toLowerCase().indexOf( 'heart') ){
      	// 	scope.suit = 'hearts';
      	// }
      	// else{
      	// 	scope.suit = 'spades';
      	// }

      	var card = $window.Poker.getCardImage(scope.size, scope.suit, scope.value.toLowerCase());
      	el.append( card );


      }
    };
  });
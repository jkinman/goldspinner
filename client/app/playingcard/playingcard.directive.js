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
      	value: '@',
      },
      link: function (scope, el, attrs) {


        if( scope.card.indexOf( "s" ) > 0 ) {
          scope.suit = "Spades";
        }
        else if( scope.card.indexOf( "d" ) > 0 ) {
          scope.suit = "Diamonds";
        }
        else if( scope.card.indexOf( "c" ) > 0 ) {
          scope.suit = "Clubs";
        }
        else if( scope.card.indexOf( "h" ) > 0 ) {
          scope.suit = "Hearts";
        }
        else {
          scope.suit = "?";
        }

        if( scope.card.indexOf( '2' ) > 0 ) {
          scope.value = "Two";
        }
        else if( scope.card.indexOf( '2' ) > 0 ) {
          scope.value = "Two";
        }
        else if( scope.card.indexOf( '3' ) > 0 ) {
          scope.value = "Three";
        }
        else if( scope.card.indexOf( '4' ) > 0 ) {
          scope.value = "Four";
        }
        else if( scope.card.indexOf( '5' ) > 0 ) {
          scope.value = "Five";
        }
        else if( scope.card.indexOf( '6' ) > 0 ) {
          scope.value = "Six";
        }
        else if( scope.card.indexOf( '7' ) > 0 ) {
          scope.value = "Seven";
        }
        else if( scope.card.indexOf( '8' ) > 0 ) {
          scope.value = "Eight";
        }
        else if( scope.card.indexOf( '9' ) > 0 ) {
          scope.value = "Nine";
        }
        else if( scope.card.indexOf( 'T' ) > 0 ) {
          scope.value = "Ten";
        }
        else if( scope.card.indexOf( 'J' ) > 0 ) {
          scope.value = "Jack";
        }
        else if( scope.card.indexOf( 'Q' ) > 0 ) {
          scope.value = "Queen";
        }
        else if( scope.card.indexOf( 'K' ) > 0 ) {
          scope.value = "King";
        }
        else if( scope.card.indexOf( 'A' ) > 0 ) {
          scope.value = "Ace";
        }
        else{
          scope.value = "?"
        }
        
        // front or back
        var card;
        if( scope.suit.indexOf( '?' ) >= 0 || scope.value.indexOf( '?' ) >= 0 ) {
      	 card = $window.Poker.getBackImage(scope.size );
        }
        else{
          card = $window.Poker.getCardImage(scope.size, scope.suit, scope.value.toLowerCase());
        }
      	el.append( card );
      }
    };
  });
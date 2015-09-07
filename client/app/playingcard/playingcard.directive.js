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
          // scope.el = el;
          scope.$watch("card", function( newValue, oldValue ) {

            scope.card = newValue;

        // if( scope.card.toLowerCase().indexOf( "s" ) > -1 ) {
        //   scope.suit = "Spades";
        // }
        // else if( scope.card.toLowerCase().indexOf( "d" ) > -1 ) {
        //   scope.suit = "Diamonds";
        // }
        // else if( scope.card.toLowerCase().indexOf( "c" ) > -1 ) {
        //   scope.suit = "Clubs";
        // }
        // else if( scope.card.toLowerCase().indexOf( "h" ) > -1 ) {
        //   scope.suit = "Hearts";
        // }
        // else {
        //   scope.suit = "?";
        // }

        // if( scope.card.indexOf( '2' ) > -1 ) {
        //   scope.value = '2';
        // }
        // else if( scope.card.indexOf( '3' ) > -1 ) {
        //   scope.value = '3';
        // }
        // else if( scope.card.indexOf( '4' ) > -1 ) {
        //   scope.value = '4';
        // }
        // else if( scope.card.indexOf( '5' ) > -1 ) {
        //   scope.value = 5;
        // }
        // else if( scope.card.indexOf( '6' ) > -1 ) {
        //   scope.value = 6;
        // }
        // else if( scope.card.indexOf( '7' ) > -1 ) {
        //   scope.value = 7;
        // }
        // else if( scope.card.indexOf( '8' ) > -1 ) {
        //   scope.value = 8;
        // }
        // else if( scope.card.indexOf( '9' ) > -1 ) {
        //   scope.value = 9;
        // }
        // else if( scope.card.indexOf( 'J' ) > -1 ) {
        //   scope.value = "J";
        // }
        // else if( scope.card.indexOf( 'Q' ) > -1 ) {
        //   scope.value = "Q";
        // }
        // else if( scope.card.indexOf( 'K' ) > -1 ) {
        //   scope.value = "K";
        // }
        // else if( scope.card.indexOf( 'A' ) > -1 ) {
        //   scope.value = "A";
        // }
        // else{
        //   scope.value = "?"
        // }
        
        // front or back
        var card;

        var val = scope.card.charAt(0).toLowerCase();
        var suit = scope.card.charAt(scope.card.length-1).toUpperCase();

        if( val.toLowerCase().indexOf( 't' ) != -1 || val.toLowerCase().indexOf( '1' ) != -1 ) {
          val = '10';
        }


        if( scope.card.indexOf( '?' ) == -1 ) {
          // card = $window.Poker.getCardImage(scope.size, scope.value, suit );
          card = $window.Poker.getCardImage(scope.size, suit, val );
        }
        else{
         card = $window.Poker.getBackImage(scope.size );
        }
        el.html( card );

          });

      },

    };
  });
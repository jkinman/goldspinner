'use strict';

angular.module('pkerApp')
  .directive('playingcard', function($window) {
    return {
      template: '',
      restrict: 'EA',
      scope: {
        card: '@',
        suit: '@',
        size: '@',
        value: '@',
      },
      link: function(scope, el, attrs) {
        // scope.el = el;
        scope.$watch("card", function(newValue, oldValue) {

          scope.card = newValue;

          // front or back
          var card;

          var val = scope.card.charAt(0).toLowerCase();
          var suit = scope.card.charAt(scope.card.length - 1).toUpperCase();

          if (val.toLowerCase().indexOf('t') != -1 || val.toLowerCase().indexOf('1') != -1) {
            val = '10';
          }


          if (scope.card.indexOf('?') == -1) {
            // card = $window.Poker.getCardImage(scope.size, scope.value, suit );
            card = $window.Poker.getCardImage(scope.size, suit, val);
          } else {
            card = $window.Poker.getBackImage(scope.size);
          }
          el.html(card);

        });

      },

    };
  });

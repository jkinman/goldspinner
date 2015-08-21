'use strict';

angular.module('pkerApp')
  .service('threecardpoker', function ( $http, socket ) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var game = [];

    $http.get('/api/threecardpokers').success(function(state) {
      game = state;
      socket.syncUpdates('game', game);
    });

  });

'use strict';

angular.module('pkerApp')
  .service('threecardpoker', function ( $http, socket ) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.req = $http.get('/api/threecardpokers').then( function(data, status, headers, config) {
      // game = data;
      // socket.syncUpdates('game', this.game);
      return data;
    });



    this.getGameData = function( ) {
   		$http.get('/api/threecardpokers').then( function(data, status, headers, config) {
      		// game = data;
      		// socket.syncUpdates('game', this.game);
      		// return data;
    	});
    	return ['a', 'b'];
    };

    this.game = this.getGameData();


  });

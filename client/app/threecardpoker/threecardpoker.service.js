'use strict';

angular.module('pkerApp')
  .factory('threecardpoker', function ( $resource ) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var bets = [];

    return $resource( 'api/threecardpokers/:id', {id: '@_id' } , {
    	update: {
    		method: 'PUT'
    	},
    	resolve: {
    		method: 'PUT'
    	}
    });

  });

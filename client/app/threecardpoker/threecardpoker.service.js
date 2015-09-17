'use strict';

angular.module('pkerApp')
  .factory('threecardpoker', function ( $resource ) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var bets = [];

    return $resource( 'api/threecardpokers/:id', {id: '@_id' } , {
    	update: {
    		method: 'PUT'
    	},
        shuffle: {
            method: 'POST'
        },
        deal: {
            url: 'api/threecardpokers/deal/:id',
            method: 'PUT'
        },
        resolve: {
            url: 'api/threecardpokers/resolve/:id',
            method: 'PUT'
        },
    });

  });

'use strict';

angular.module('pkerApp')
  .factory('threecardpoker', function ( $resource ) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var bets = [];

    return $resource( 'api/threecardpokers/:id', {id: '@_id' } , {
    	update: {
    		method: 'PUT'
    	}
    });


 //    var service = {
 //    	req:{}, 
 //    	game:{},
 //    	hands:[]
 //    };
 //    service.newGame = function() {

 //    };

 //    service.req = $http.get('/api/threecardpokers').then( function(retval) {
	// 	service.hands[0] = [retval.data[0], retval.data[4], retval.data[8]];
	// 	service.hands[1] = [retval.data[1], retval.data[5], retval.data[9]];
	// 	service.hands[2] = [retval.data[2], retval.data[6], retval.data[10]];
	// 	service.hands[3] = [retval.data[0], retval.data[1], retval.data[2]];
	// 	service.hands[4] = [retval.data[4], retval.data[5], retval.data[6]];
	// 	service.hands[5] = [retval.data[8], retval.data[9], retval.data[10]];
	// 	service.hands[6] = [retval.data[10], retval.data[5], retval.data[0]];
	// 	service.hands[7] = [retval.data[2], retval.data[5], retval.data[8]];


	// 	service.game = retval.data;

	// });

	// return service;

  });

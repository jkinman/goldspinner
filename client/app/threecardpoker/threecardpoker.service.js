'use strict';

angular.module('pkerApp')
  .factory('threecardpoker', function ( $http ) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var service = {req:{}, game:{}};
    service.newGame = function() {

    };

    service.req = $http.get('/api/threecardpokers').then( function(retval) {
		service.game = retval.data;
	});

	return service;

  });

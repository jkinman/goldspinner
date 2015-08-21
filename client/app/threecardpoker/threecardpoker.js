'use strict';

angular.module('pkerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('threecardpoker', {
        url: '/threecardpoker',
        templateUrl: 'app/threecardpoker/threecardpoker.html',
        controller: 'ThreecardpokerCtrl'
      });
  });
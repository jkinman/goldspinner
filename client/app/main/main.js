'use strict';

angular.module('pkerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('notdone', {
        url: '/notdone',
        templateUrl: 'app/main/notdone.html',
        controller: 'MainCtrl'
      })
      .state('pker', {
        url: '/pker',
        templateUrl: 'app/games/pker.html',
        controller: 'MainCtrl'
      })
      ;
  });
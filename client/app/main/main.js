'use strict';

angular.module('pkerApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'LoginCtrl'
      })
      .state('pker', {
        url: '/pker',
        templateUrl: 'app/threecardpoker/threecardpoker.html',
        controller: 'ThreecardpokerCtrl'
      })

      .state('rules', {
        url: '/rules',
        templateUrl: 'app/main/notdone.html',
        controller: 'MainCtrl'
      })
      .state('payouts', {
        url: '/payouts',
        templateUrl: 'app/main/notdone.html',
        controller: 'MainCtrl'
      })
      .state('8hands', {
        url: '/8hands',
        templateUrl: 'app/main/notdone.html',
        controller: 'MainCtrl'
      })
      .state('shuffling', {
        url: '/shuffling',
        templateUrl: 'app/main/notdone.html',
        controller: 'MainCtrl'
      })
      .state('casinoverify', {
        url: '/casinoverify',
        templateUrl: 'app/main/notdone.html',
        controller: 'MainCtrl'
      })
      .state('stats', {
        url: '/stats',
        templateUrl: 'app/games/notdone.html',
        controller: 'MainCtrl'
      })
      ;
  });
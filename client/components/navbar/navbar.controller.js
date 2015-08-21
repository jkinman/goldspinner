'use strict';

angular.module('pkerApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
    {
      'title': 'Home',
      'link': '/'
    },
    {
      'title': 'Rules',
      'link': '/rules'
    },
    {
      'title': 'Payouts',
      'link': '/payouts'
    },
    {
      'title': '8 Hands?',
      'link': '/8hands'
    },
    {
      'title': 'Shuffling',
      'link': '/shuffling'
    },
    {
      'title': 'Casino Verify',
      'link': '/casinoverify'
    },
    {
      'title': 'Stats',
      'link': '/stats'
    },
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
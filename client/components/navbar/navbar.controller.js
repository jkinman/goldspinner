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
      'link': '/'
    },
    {
      'title': 'Payouts',
      'link': '/'
    },
    {
      'title': '8 Hands?',
      'link': '/'
    },
    {
      'title': 'Shuffling',
      'link': '/'
    },
    {
      'title': 'Casino Verify',
      'link': '/'
    },
    {
      'title': 'Stats',
      'link': '/'
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
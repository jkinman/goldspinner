'use strict';

describe('Controller: ThreecardpokerCtrl', function () {

  // load the controller's module
  beforeEach(module('pkerApp'));

  var ThreecardpokerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThreecardpokerCtrl = $controller('ThreecardpokerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

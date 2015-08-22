'use strict';

describe('Directive: playingcard', function () {

  // load the directive's module and view
  beforeEach(module('pkerApp'));
  beforeEach(module('app/playingcard/playingcard.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<playingcard></playingcard>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the playingcard directive');
  }));
});
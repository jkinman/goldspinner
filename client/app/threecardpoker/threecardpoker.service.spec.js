'use strict';

describe('Service: threecardpoker', function () {

  // load the service's module
  beforeEach(module('pkerApp'));

  // instantiate service
  var threecardpoker;
  beforeEach(inject(function (_threecardpoker_) {
    threecardpoker = _threecardpoker_;
  }));

  it('should do something', function () {
    expect(!!threecardpoker).toBe(true);
  });

});

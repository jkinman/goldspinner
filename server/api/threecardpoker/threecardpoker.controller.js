'use strict';

var _ = require('lodash');
var Threecardpoker = require('./threecardpoker.model');

// Get list of threecardpokers
exports.index = function(req, res) {
  Threecardpoker.find(function (err, threecardpokers) {
    if(err) { return handleError(res, err); }

    threecardpokers = ["3q", "4q", "5q"];

    return res.status(200).json(threecardpokers);
  });
};

// Get a single threecardpoker
exports.show = function(req, res) {
  Threecardpoker.findById(req.params.id, function (err, threecardpoker) {
    if(err) { return handleError(res, err); }
    if(!threecardpoker) { return res.status(404).send('Not Found'); }
    return res.json(threecardpoker);
  });
};

// Creates a new threecardpoker in the DB.
exports.create = function(req, res) {
  Threecardpoker.create(req.body, function(err, threecardpoker) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(threecardpoker);
  });
};

// Updates an existing threecardpoker in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Threecardpoker.findById(req.params.id, function (err, threecardpoker) {
    if (err) { return handleError(res, err); }
    if(!threecardpoker) { return res.status(404).send('Not Found'); }
    var updated = _.merge(threecardpoker, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(threecardpoker);
    });
  });
};

// Deletes a threecardpoker from the DB.
exports.destroy = function(req, res) {
  Threecardpoker.findById(req.params.id, function (err, threecardpoker) {
    if(err) { return handleError(res, err); }
    if(!threecardpoker) { return res.status(404).send('Not Found'); }
    threecardpoker.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
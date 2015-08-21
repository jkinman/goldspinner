/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Threecardpoker = require('./threecardpoker.model');

exports.register = function(socket) {
  Threecardpoker.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Threecardpoker.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('threecardpoker:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('threecardpoker:remove', doc);
}
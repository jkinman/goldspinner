'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThreecardpokerSchema = new Schema({
  playerName: String,
  info: String,
  deck: String,
  options: String,
  userId: String,
  state: String
});

module.exports = mongoose.model('Threecardpoker', ThreecardpokerSchema);
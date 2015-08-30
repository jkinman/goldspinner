'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThreecardpokerSchema = new Schema({
  name: String,
  info: String,
  deck: String,
  options: String,
  created: Date,
  user: String,
  active: Boolean
});

module.exports = mongoose.model('Threecardpoker', ThreecardpokerSchema);
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThreecardpokerSchema = new Schema({
  playerName: String,
  info: String,
  deck: [String],
  hands: [[String, String, String]],
  options: {
  	numberOfHands: Number,
  },
  bets: [
  	{anti: Number}
  ],
  userId: String,
  state: String
});

module.exports = mongoose.model('Threecardpoker', ThreecardpokerSchema);
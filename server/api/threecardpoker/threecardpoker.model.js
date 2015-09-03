'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var hand = {
	cards: [String],
	rank: {
		handName: String,
		value: Number,
		handRank: Number,
		handType: Number
	}
};

var ThreecardpokerSchema = new Schema({
  playerName: String,
  info: String,
  deck: [String],
  key: String,
  encryptedDeck: String,
  hands: [hand],
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